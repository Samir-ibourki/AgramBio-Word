import { test, expect } from '@playwright/test';

test('language switching and persistence', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // 1. Identify the language switcher (globe icon button)
  const langTrigger = page.locator('button').filter({ has: page.locator('svg.lucide-globe') }).first();
  await langTrigger.click();
  
  // 2. Switch to English (specifically from the dropdown, using .first() to avoid mobile ambiguity)
  const englishBtn = page.locator('.lang-dropdown button').filter({ hasText: /English/i }).first();
  await englishBtn.click();
  
  // 3. Verify content is in English (Hero section buttons are a good indicator)
  await expect(page.getByText(/SHOP NOW/i)).toBeVisible();
  
  // 4. Reload page to test persistence
  await page.reload();
  
  // 5. Verify it remains in English
  await expect(page.getByText(/SHOP NOW/i)).toBeVisible();
  
  // 6. Switch to Arabic to test RTL
  await langTrigger.click();
  const arabicBtn = page.locator('.lang-dropdown button').filter({ hasText: /العربية/i }).first();
  await arabicBtn.click();
  
  // 7. Check if direction is RTL
  const html = page.locator('html');
  await expect(html).toHaveAttribute('dir', 'rtl');
  await expect(page.getByText(/تسوق الآن/i)).toBeVisible();
});
