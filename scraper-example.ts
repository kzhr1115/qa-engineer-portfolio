import { WebScraper, ScrapingConfig } from './web-scraper';

async function basicExample() {
  const config: ScrapingConfig = {
    startUrl: 'https://example.com',
    maxDepth: 2,
    maxPages: 10,
    outputFile: 'basic_scrape.json',
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, p',
      images: 'img'
    }
  };

  const scraper = new WebScraper(config);
  const results = await scraper.run();
  console.log(`スクレイピング完了: ${results.length} ページ`);
}

async function loginExample() {
  const config: ScrapingConfig = {
    startUrl: 'https://example-site.com/dashboard',
    maxDepth: 1,
    maxPages: 5,
    outputFile: 'login_scrape.json',
    loginConfig: {
      loginUrl: 'https://example-site.com/login',
      usernameSelector: '#username',
      passwordSelector: '#password',
      submitSelector: 'button[type="submit"]',
      username: 'your_username',
      password: 'your_password',
      successIndicator: '.dashboard'
    },
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, h3, p, .content',
      custom: {
        userInfo: '.user-profile',
        notifications: '.notification'
      }
    }
  };

  const scraper = new WebScraper(config);
  const results = await scraper.run();
  console.log(`ログイン後スクレイピング完了: ${results.length} ページ`);
}

async function comprehensiveExample() {
  const config: ScrapingConfig = {
    startUrl: 'https://news-site.com',
    maxDepth: 3,
    maxPages: 50,
    outputFile: 'comprehensive_scrape.json',
    selectors: {
      links: 'a[href]',
      texts: 'h1, h2, h3, p, article, .content',
      images: 'img',
      forms: 'form',
      custom: {
        articles: 'article',
        headlines: '.headline',
        metadata: '.meta',
        comments: '.comment'
      }
    }
  };

  const scraper = new WebScraper(config);
  const results = await scraper.run();
  console.log(`包括的スクレイピング完了: ${results.length} ページ`);
}

async function main() {
  const example = process.argv[2] || 'basic';
  
  switch (example) {
    case 'basic':
      basicExample().catch(console.error);
      break;
    case 'login':
      loginExample().catch(console.error);
      break;
    case 'comprehensive':
      comprehensiveExample().catch(console.error);
      break;
    default:
      console.log('使用例: ts-node scraper-example.ts [basic|login|comprehensive]');
  }
}

// Node.js環境でのみ実行
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

export { basicExample, loginExample, comprehensiveExample };