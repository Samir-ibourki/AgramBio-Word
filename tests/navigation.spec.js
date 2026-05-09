import { test, expect } from '@playwright/test';

test('navigation links work correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  
  const amlouLink = page.locator('header nav').getByRole('link', { name: /amlou|أملو/i }).first();
  await amlouLink.click();
  await expect(page).toHaveURL(/\/shop/);
  
  const aboutLink = page.locator('header nav').getByRole('link', { name: /about|من نحن|à propos/i }).first();
  await aboutLink.click();
  await expect(page).toHaveURL(/\/about/);
  
  
  const contactLink = page.locator('header nav').getByRole('link', { name: /contact|اتصل بنا/i }).first();
  await contactLink.click();
  await expect(page).toHaveURL(/\/contact/);
  
  const logo = page.locator('header').getByRole('link', { name: /agram/i }).first();
  await logo.click();
  await expect(page).toHaveURL('http://localhost:5173/');
});
