import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';
import { InventoryPage } from '../pageobjects/inventoryPage';
import { CartPage } from '../pageobjects/cartPage';

test('addToCart', async ({ page }) => {
  const loginPage = new LoginPage(page, '/');
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCartByNthProduct(2);
  await inventoryPage.clickOnCartIcon();
  await expect(cartPage.cartItems).toHaveCount(1);
});

test('removeFromCartProductName', async ({ page }) => {
  const loginPage = new LoginPage(page, '/');
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
  await inventoryPage.clickOnCartIcon();
  await cartPage.getRemoveByProductName('Sauce Labs Backpack');
  await expect(cartPage.cartItems).toHaveCount(0);
});

test('removeFromCartFirstProduct', async ({ page }) => {
  const loginPage = new LoginPage(page, '/');
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCartByNthProduct(0);
  await inventoryPage.clickOnCartIcon();
  await cartPage.getRemoveFirstProduct();
  await expect(cartPage.cartItems).toHaveCount(0);
});
