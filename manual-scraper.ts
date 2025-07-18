import { WebScraper, ScrapingConfig } from './web-scraper';

async function manualInstagramScraper() {
  const config: ScrapingConfig = {
    startUrl: 'https://www.instagram.com/',
    maxDepth: 2,
    maxPages: 20,
    manualMode: true,
    manualTimeout: 30000, // 30秒タイムアウト
    outputFile: 'manual_instagram_scrape.json',
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, h3, span, p, div[class*="text"]',
      images: 'img',
      custom: {
        posts: 'article',
        usernames: 'a[href*="/"]',
        stories: '[data-testid="story"]',
        feed: '[data-testid="post"]',
        profileInfo: '[data-testid="user-avatar"]',
        followButtons: 'button:has-text("Follow")',
        likeButtons: '[aria-label*="Like"]',
        commentSections: '[data-testid="comment"]',
        captions: '[data-testid="post-caption"]',
        hashtags: 'a[href*="/explore/tags/"]',
        mentions: 'a[href*="/"][href^="/"]'
      }
    }
  };

  console.log('手動操作付きInstagramスクレイピングを開始します...');
  
  const scraper = new WebScraper(config);
  
  try {
    const results = await scraper.run();
    console.log(`\n=== スクレイピング完了 ===`);
    console.log(`処理ページ数: ${results.length}`);
    
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

async function manualGenericScraper() {
  const config: ScrapingConfig = {
    startUrl: 'https://example.com',
    maxDepth: 1,
    maxPages: 10,
    manualMode: true,
    outputFile: 'manual_generic_scrape.json',
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, h3, p, span, div',
      images: 'img',
      forms: 'form',
      custom: {
        buttons: 'button',
        navigation: 'nav a',
        headers: 'header',
        footers: 'footer',
        articles: 'article',
        sections: 'section'
      }
    }
  };

  console.log('手動操作付き汎用スクレイピングを開始します...');
  
  const scraper = new WebScraper(config);
  
  try {
    const results = await scraper.run();
    console.log(`\n=== スクレイピング完了 ===`);
    console.log(`処理ページ数: ${results.length}`);
    
    return results;
  } catch (error) {
    console.error('スクレイピング中にエラーが発生しました:', error);
    throw error;
  }
}

async function interactiveConfigScraper() {
  console.log('\n=== インタラクティブなスクレイピング設定 ===');
  
  // 簡単な設定入力（実際の実装では readline を使用）
  const startUrl = process.argv[3] || 'https://www.instagram.com/';
  const maxPages = parseInt(process.argv[4] || '10');
  
  const config: ScrapingConfig = {
    startUrl,
    maxDepth: 2,
    maxPages,
    manualMode: true,
    outputFile: 'interactive_scrape.json',
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, h3, p, span, div',
      images: 'img',
      custom: {
        posts: 'article',
        buttons: 'button',
        navigation: 'nav a'
      }
    }
  };

  console.log(`設定:`);
  console.log(`開始URL: ${config.startUrl}`);
  console.log(`最大ページ数: ${config.maxPages}`);
  console.log(`出力ファイル: ${config.outputFile}`);
  
  const scraper = new WebScraper(config);
  
  try {
    const results = await scraper.run();
    console.log(`\n=== スクレイピング完了 ===`);
    console.log(`処理ページ数: ${results.length}`);
    
    return results;
  } catch (error) {
    console.error('スクレイピング中にエラーが発生しました:', error);
    throw error;
  }
}

async function main() {
  const mode = process.argv[2] || 'instagram';
  
  switch (mode) {
    case 'instagram':
      await manualInstagramScraper();
      break;
    case 'generic':
      await manualGenericScraper();
      break;
    case 'interactive':
      await interactiveConfigScraper();
      break;
    default:
      console.log('使用例:');
      console.log('npx ts-node manual-scraper.ts instagram              # Instagram手動スクレイピング');
      console.log('npx ts-node manual-scraper.ts generic                # 汎用手動スクレイピング');
      console.log('npx ts-node manual-scraper.ts interactive [URL] [数] # インタラクティブ設定');
      console.log('');
      console.log('例:');
      console.log('npx ts-node manual-scraper.ts interactive https://twitter.com 5');
  }
}

// Node.js環境でのみ実行
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

export { manualInstagramScraper, manualGenericScraper, interactiveConfigScraper };