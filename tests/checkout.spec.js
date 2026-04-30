import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  // Go to shop and wait for products to load from GraphQL
  await page.goto('http://localhost:5173/shop');

 
  const productLink = page.locator('a[href*="/product/"]').first();
  
  await expect(productLink).toBeVisible({ timeout: 20000 });
  await productLink.click();

  const addToCartBtn = page.getByRole('button', {
    name: /add to cart|أضف إلى السلة|ajouter au panier/i
  });
  
  await addToCartBtn.waitFor({ state: 'visible', timeout: 15000 });
  await addToCartBtn.click();

  const checkoutBtn = page.getByRole('link', {
    name: /checkout|إتمام الشراء|passer la commande/i
  });
  
  await checkoutBtn.waitFor({ state: 'visible' });
  await checkoutBtn.click();

  await expect(page).toHaveURL(/\/checkout/);

  const nameInput = page.locator('input').nth(0);
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill('Test User');
  
  await page.locator('input').nth(1).fill('0612345678');
  await page.locator('input').nth(2).fill('Casablanca');
  await page.locator('textarea').fill('123 Test Street, Anfa');

  const confirmBtn = page.getByRole('button', {
    name: /confirm|تأكيد|confirmer/i
  });

  await confirmBtn.click();

  // 6. Verify success page
  const successMessage = page.locator('h1').filter({ 
    hasText: /merci|shukran|thank you|شكراً/i 
  });
  
  await expect(successMessage).toBeVisible({ timeout: 30000 });
});