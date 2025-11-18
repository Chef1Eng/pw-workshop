import { test, expect } from '../fixtures/fixtures';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';

test.describe('Only Login Fixture By Edu', () => {
  test('addToCart', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);
    await inventoryPage.addProductToCartByNthProduct(2);
    await inventoryPage.clickOnCartIcon();
    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('removeFromCartProductName', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);
    await inventoryPage.addProductToCartByName("Sauce Labs Backpack");
    await inventoryPage.clickOnCartIcon();
    await cartPage.getRemoveByProductName('Sauce Labs Backpack');
    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('removeFromCartFirstProduct', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);
    await inventoryPage.addProductToCartByNthProduct(0);
    await inventoryPage.clickOnCartIcon();
    await cartPage.getRemoveFirstProduct();
    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(0);
  });
});