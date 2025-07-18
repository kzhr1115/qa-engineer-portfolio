import { WebScraper, ScrapingConfig } from './web-scraper';

async function scrapeInstagram() {
  const config: ScrapingConfig = {
    startUrl: 'https://www.instagram.com/',
    maxDepth: 1,
    maxPages: 5,
    outputFile: 'instagram_scrape.json',
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, span, div[class*="text"], p',
      images: 'img',
      custom: {
        posts: 'article',
        usernames: 'a[href*="/"]',
        stories: '[data-testid="story"]',
        navigation: 'nav a',
        buttons: 'button',
        modalContent: '[role="dialog"]'
      }
    }
  };

  console.log('Instagramのスクレイピングを開始します...');
  console.log('注意: Instagramは動的コンテンツが多いため、完全な読み込みまで待機します');

  const scraper = new WebScraper(config);
  
  try {
    const results = await scraper.run();
    console.log(`スクレイピング完了: ${results.length} ページを処理しました`);
    
    results.forEach((page, index) => {
      console.log(`\nページ ${index + 1}: ${page.url}`);
      console.log(`タイトル: ${page.title}`);
      console.log(`リンク数: ${page.links.length}`);
      
      Object.entries(page.elements).forEach(([type, elements]) => {
        if (elements.length > 0) {
          console.log(`${type}: ${elements.length}個の要素`);
        }
      });
    });
    
    return results;
  } catch (error) {
    console.error('スクレイピング中にエラーが発生しました:', error);
    throw error;
  }
}

async function scrapeInstagramWithLogin() {
  console.log('ログイン機能付きInstagramスクレイピング');
  console.log('実際のログイン情報を設定してください');
  
  const config: ScrapingConfig = {
    startUrl: 'https://www.instagram.com/',
    maxDepth: 2,
    maxPages: 10,
    outputFile: 'instagram_logged_scrape.json',
    loginConfig: {
      loginUrl: 'https://www.instagram.com/accounts/login/',
      usernameSelector: 'input[name="username"]',
      passwordSelector: 'input[name="password"]',
      submitSelector: 'button[type="submit"]',
      username: process.env.INSTAGRAM_USERNAME || 'dhino1115',
      password: process.env.INSTAGRAM_PASSWORD || '4agcgfpf',
      successIndicator: '[data-testid="user-avatar"]'
    },
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, span, div[class*="text"], p',
      images: 'img',
      custom: {
        posts: 'article',
        usernames: 'a[href*="/"]',
        stories: '[data-testid="story"]',
        feed: '[data-testid="post"]',
        profileInfo: '[data-testid="user-avatar"]',
        followButtons: 'button:has-text("Follow")',
        likeButtons: '[aria-label*="Like"]',
        commentSections: '[data-testid="comment"]'
      }
    }
  };

  const scraper = new WebScraper(config);
  
  try {
    const results = await scraper.run();
    console.log(`ログイン後スクレイピング完了: ${results.length} ページを処理しました`);
    return results;
  } catch (error) {
    console.error('ログインスクレイピング中にエラーが発生しました:', error);
    throw error;
  }
}

async function main() {
  const mode = process.argv[2] || 'basic';
  
  switch (mode) {
    case 'basic':
      await scrapeInstagram();
      break;
    case 'login':
      console.log('警告: ログイン情報を設定してから実行してください');
      await scrapeInstagramWithLogin();
      break;
    default:
      console.log('使用例:');
      console.log('ts-node instagram-scraper.ts basic   # 基本スクレイピング');
      console.log('ts-node instagram-scraper.ts login   # ログイン後スクレイピング');
  }
}

// Node.js環境でのみ実行
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

export { scrapeInstagram, scrapeInstagramWithLogin };