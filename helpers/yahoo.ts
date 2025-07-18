import { Page, expect } from '@playwright/test';

/**
 * Yahoo! JAPANトップページにアクセスし、「QAエンジニア」で検索する
 */
export async function searchYahooQAEngineer(page: Page) {
  await page.goto('https://www.yahoo.co.jp');
  // 検索ボックスが表示されるまで待機
  const searchBox = page.locator('input[name="p"]');
  await searchBox.waitFor({ state: 'visible', timeout: 10000 });
  await searchBox.fill('QAエンジニア');
  await page.keyboard.press('Enter');
  // 検索結果ページのタイトルを確認
  await expect(page).toHaveTitle(/QAエンジニア/);
}
