import { test, expect } from '@playwright/test';
import { searchYahooQAEngineer } from './helpers/yahoo';

test('Yahoo!でQAエンジニアを検索', async ({ page }) => {
  await searchYahooQAEngineer(page);
  // 検索結果ページに「QAエンジニア」が含まれていることを確認
  await expect(page.locator('body')).toContainText('QAエンジニア');
});
