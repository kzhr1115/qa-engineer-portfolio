import { test, expect } from '@playwright/test';
import { WebScraper, ScrapingConfig } from './web-scraper';
import * as fs from 'fs';

test.describe('WebScraper', () => {
  test('基本的なスクレイピング機能', async () => {
    const config: ScrapingConfig = {
      startUrl: 'https://example.com',
      maxDepth: 1,
      maxPages: 3,
      outputFile: 'test_basic.json',
      selectors: {
        links: 'a[href]',
        texts: 'h1, p'
      }
    };

    const scraper = new WebScraper(config);
    const results = await scraper.run();

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('url');
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('elements');
    expect(results[0]).toHaveProperty('links');

    const fileExists = fs.existsSync('test_basic.json');
    expect(fileExists).toBe(true);

    if (fileExists) {
      fs.unlinkSync('test_basic.json');
    }
  });

  test('要素収集の検証', async () => {
    const config: ScrapingConfig = {
      startUrl: 'https://httpbin.org/html',
      maxDepth: 0,
      maxPages: 1,
      outputFile: 'test_elements.json',
      selectors: {
        links: 'a[href]',
        texts: 'h1, p',
        custom: {
          headers: 'h1'
        }
      }
    };

    const scraper = new WebScraper(config);
    const results = await scraper.run();

    expect(results).toBeDefined();
    expect(results.length).toBe(1);
    
    const pageData = results[0];
    expect(pageData.elements).toHaveProperty('links');
    expect(pageData.elements).toHaveProperty('texts');
    expect(pageData.elements).toHaveProperty('custom');

    if (fs.existsSync('test_elements.json')) {
      fs.unlinkSync('test_elements.json');
    }
  });

  test('URLの正規化とリンク収集', async () => {
    const config: ScrapingConfig = {
      startUrl: 'https://example.com',
      maxDepth: 0,
      maxPages: 1,
      outputFile: 'test_links.json'
    };

    const scraper = new WebScraper(config);
    const results = await scraper.run();

    expect(results).toBeDefined();
    expect(results.length).toBe(1);
    
    const pageData = results[0];
    expect(Array.isArray(pageData.links)).toBe(true);

    if (fs.existsSync('test_links.json')) {
      fs.unlinkSync('test_links.json');
    }
  });

  test('深度制限の動作確認', async () => {
    const config: ScrapingConfig = {
      startUrl: 'https://example.com',
      maxDepth: 0,
      maxPages: 10,
      outputFile: 'test_depth.json'
    };

    const scraper = new WebScraper(config);
    const results = await scraper.run();

    expect(results).toBeDefined();
    
    for (const result of results) {
      expect(result.depth).toBeLessThanOrEqual(0);
    }

    if (fs.existsSync('test_depth.json')) {
      fs.unlinkSync('test_depth.json');
    }
  });

  test('設定の継承とデフォルト値', async () => {
    const minimalConfig: ScrapingConfig = {
      startUrl: 'https://example.com'
    };

    const scraper = new WebScraper(minimalConfig);
    
    expect(scraper['config'].maxDepth).toBe(2);
    expect(scraper['config'].maxPages).toBe(50);
    expect(scraper['config'].outputFile).toBe('scraped_data.json');
    expect(scraper['config'].selectors).toBeDefined();
  });
});