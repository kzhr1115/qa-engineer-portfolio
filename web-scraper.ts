import { Page, Browser, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface ScrapingConfig {
  startUrl: string;
  maxDepth?: number;
  maxPages?: number;
  loginConfig?: LoginConfig;
  selectors?: ElementSelectors;
  outputFile?: string;
  manualMode?: boolean;
  manualTimeout?: number;
}

export interface LoginConfig {
  loginUrl: string;
  usernameSelector: string;
  passwordSelector: string;
  submitSelector: string;
  username: string;
  password: string;
  successIndicator?: string;
}

export interface ElementSelectors {
  links?: string;
  texts?: string;
  images?: string;
  forms?: string;
  custom?: { [key: string]: string };
}

export interface ScrapedData {
  url: string;
  title: string;
  elements: { [key: string]: any[] };
  links: string[];
  timestamp: string;
  depth: number;
}

export class WebScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private visitedUrls: Set<string> = new Set();
  private scrapedData: ScrapedData[] = [];
  private config: ScrapingConfig;

  constructor(config: ScrapingConfig) {
    this.config = {
      maxDepth: 2,
      maxPages: 50,
      selectors: {
        links: 'a[href]',
        texts: 'p, h1, h2, h3, h4, h5, h6, span, div',
        images: 'img',
        forms: 'form'
      },
      outputFile: 'scraped_data.json',
      ...config
    };
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: this.config.manualMode ? 100 : 0
    });
    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      viewport: { width: 1280, height: 720 }
    });
    this.page = await context.newPage();
  }

  async login(): Promise<boolean> {
    if (!this.config.loginConfig || !this.page) {
      return true;
    }

    const { loginUrl, usernameSelector, passwordSelector, submitSelector, username, password, successIndicator } = this.config.loginConfig;

    try {
      console.log('ログインページに移動中...');
      await this.page.goto(loginUrl);
      await this.page.waitForLoadState('networkidle');
      
      console.log('ログインフォーム入力中...');
      await this.page.waitForSelector(usernameSelector, { timeout: 10000 });
      await this.page.fill(usernameSelector, username);
      await this.page.waitForTimeout(1000);
      
      await this.page.fill(passwordSelector, password);
      await this.page.waitForTimeout(1000);
      
      console.log('ログインボタンクリック中...');
      await this.page.click(submitSelector);
      
      // Instagram特有の処理
      await this.page.waitForTimeout(3000);
      
      // 2要素認証やその他のポップアップを処理
      try {
        const notNowButton = this.page.locator('button:has-text("後で"), button:has-text("Not Now")');
        if (await notNowButton.isVisible()) {
          await notNowButton.click();
          await this.page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('「後で」ボタンは表示されませんでした');
      }

      // 通知許可のポップアップを処理
      try {
        const notificationButton = this.page.locator('button:has-text("後で"), button:has-text("Not Now")');
        if (await notificationButton.isVisible()) {
          await notificationButton.click();
          await this.page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('通知ポップアップは表示されませんでした');
      }

      // ログイン成功の確認
      if (successIndicator) {
        try {
          await this.page.waitForSelector(successIndicator, { timeout: 10000 });
          console.log('ログイン成功（successIndicator確認）');
          return true;
        } catch (e) {
          console.log('successIndicatorが見つかりません、URLでログイン確認を試行します');
        }
      }

      // URLでログイン成功を確認
      const currentUrl = this.page.url();
      if (currentUrl.includes('instagram.com') && !currentUrl.includes('login')) {
        console.log('ログイン成功（URL確認）');
        return true;
      }

      console.log('ログイン失敗の可能性があります');
      return false;

    } catch (error) {
      console.error('ログインエラー:', error);
      return false;
    }
  }

  async scrapeElements(url: string): Promise<{ [key: string]: any[] }> {
    if (!this.page || !this.config.selectors) return {};

    const elements: { [key: string]: any[] } = {};

    for (const [elementType, selector] of Object.entries(this.config.selectors)) {
      try {
        const elementHandles = await this.page.$$(selector);
        const elementData = [];

        for (const handle of elementHandles) {
          let data: any = {};

          switch (elementType) {
            case 'links':
              data = {
                text: await handle.textContent(),
                href: await handle.getAttribute('href'),
                title: await handle.getAttribute('title')
              };
              break;
            case 'texts':
              data = {
                text: await handle.textContent(),
                tagName: await handle.evaluate(el => el.tagName.toLowerCase()),
                className: await handle.getAttribute('class')
              };
              break;
            case 'images':
              data = {
                src: await handle.getAttribute('src'),
                alt: await handle.getAttribute('alt'),
                title: await handle.getAttribute('title'),
                width: await handle.getAttribute('width'),
                height: await handle.getAttribute('height')
              };
              break;
            case 'forms':
              data = {
                action: await handle.getAttribute('action'),
                method: await handle.getAttribute('method'),
                inputs: await handle.$$eval('input', inputs => 
                  inputs.map(input => ({
                    type: input.type,
                    name: input.name,
                    placeholder: input.placeholder
                  }))
                )
              };
              break;
            default:
              data = {
                text: await handle.textContent(),
                outerHTML: await handle.evaluate(el => el.outerHTML.substring(0, 500))
              };
          }

          if (data.text || data.href || data.src || data.action) {
            elementData.push(data);
          }
        }

        elements[elementType] = elementData;
      } catch (error) {
        console.error(`要素収集エラー (${elementType}):`, error);
        elements[elementType] = [];
      }
    }

    return elements;
  }

  async getPageLinks(baseUrl: string): Promise<string[]> {
    if (!this.page) return [];

    try {
      const links = await this.page.$$eval('a[href]', (anchors, base) => {
        return anchors
          .map(a => {
            const href = a.getAttribute('href');
            if (!href) return null;
            
            if (href.startsWith('http')) return href;
            if (href.startsWith('//')) return 'https:' + href;
            if (href.startsWith('/')) return base + href;
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
            
            return base + '/' + href;
          })
          .filter(Boolean);
      }, new URL(baseUrl).origin);

      return [...new Set(links)];
    } catch (error) {
      console.error('リンク収集エラー:', error);
      return [];
    }
  }

  async scrapePage(url: string, depth: number = 0): Promise<void> {
    if (!this.page || this.visitedUrls.has(url) || depth > (this.config.maxDepth || 2) || this.scrapedData.length >= (this.config.maxPages || 50)) {
      return;
    }

    this.visitedUrls.add(url);
    console.log(`スクレイピング中 (深度 ${depth}): ${url}`);

    try {
      // ログイン後の最初のページは既に読み込まれているため、gotoをスキップ
      if (depth === 0 && this.config.loginConfig && this.page.url().includes('instagram.com')) {
        console.log('ログイン後のページを使用します');
        try {
          await this.page.waitForLoadState('networkidle', { timeout: 5000 });
        } catch (e) {
          console.log('networkidle待機をスキップして続行します');
          await this.page.waitForTimeout(2000);
        }
      } else {
        await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      }
      
      const title = await this.page.title();
      const elements = await this.scrapeElements(url);
      const links = await this.getPageLinks(url);

      const pageData: ScrapedData = {
        url,
        title,
        elements,
        links,
        timestamp: new Date().toISOString(),
        depth
      };

      this.scrapedData.push(pageData);

      if (depth < (this.config.maxDepth || 2)) {
        for (const link of links.slice(0, 5)) {
          if (!this.visitedUrls.has(link) && this.scrapedData.length < (this.config.maxPages || 50)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.scrapePage(link, depth + 1);
          }
        }
      }
    } catch (error) {
      console.error(`ページスクレイピングエラー: ${url}`, error);
    }
  }

  async waitForUserInteraction(): Promise<void> {
    if (!this.page) return;

    console.log('\n=== 手動操作モード ===');
    console.log('ブラウザで必要な操作を行ってください:');
    console.log('- ログイン');
    console.log('- 目的のページに移動');
    console.log('- 必要な設定やフィルタリング');
    
    const timeout = this.config.manualTimeout || 30000;
    console.log(`\n${timeout/1000}秒後に自動でスクレイピングを開始します...`);
    
    // シンプルなタイムアウト待機
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('自動スクレイピングを開始します...');
        resolve();
      }, timeout);
    });
  }

  async run(): Promise<ScrapedData[]> {
    try {
      await this.initialize();
      
      if (this.config.manualMode) {
        // 手動モードの場合、最初にページを開いてユーザー操作を待つ
        await this.page!.goto(this.config.startUrl);
        await this.waitForUserInteraction();
        
        // 現在のページからスクレイピング開始
        const currentUrl = this.page!.url();
        await this.scrapePage(currentUrl);
      } else {
        // 通常モード
        if (this.config.loginConfig) {
          const loginSuccess = await this.login();
          if (!loginSuccess) {
            throw new Error('ログインに失敗しました');
          }
        }

        await this.scrapePage(this.config.startUrl);
      }
      
      await this.saveData();
      
      return this.scrapedData;
    } finally {
      await this.cleanup();
    }
  }

  async saveData(): Promise<void> {
    const outputPath = this.config.outputFile || 'scraped_data.json';
    
    const summary = {
      totalPages: this.scrapedData.length,
      totalUrls: this.visitedUrls.size,
      startUrl: this.config.startUrl,
      scrapedAt: new Date().toISOString(),
      config: this.config,
      data: this.scrapedData
    };

    await fs.promises.writeFile(outputPath, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`データを保存しました: ${outputPath}`);
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}