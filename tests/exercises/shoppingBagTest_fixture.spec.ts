import { test, expect } from '../fixtures/loginFixture';
import { CartPage } from '../pageobjects/cartPage';

test.describe('Only Login Fixture By Edu', () => {
  test('addToCart', async ({ authenticatedStandardUser }) => {
    const cartPage = new CartPage(authenticatedStandardUser.page);
    await authenticatedStandardUser.addProductToCartByNthProduct(2);
    await authenticatedStandardUser.clickOnCartIcon();
    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('removeFromCartProductName', async ({ authenticatedStandardUser }) => {
    const cartPage = new CartPage(authenticatedStandardUser.page);
    await authenticatedStandardUser.addProductToCartByName("Sauce Labs Backpack");
    await authenticatedStandardUser.clickOnCartIcon();
    await cartPage.getRemoveByProductName('Sauce Labs Backpack');
    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('removeFromCartFirstProduct', async ({ authenticatedStandardUser }) => {
    const cartPage = new CartPage(authenticatedStandardUser.page);

    await authenticatedStandardUser.addProductToCartByNthProduct(0);
    await authenticatedStandardUser.clickOnCartIcon();
    await cartPage.getRemoveFirstProduct();
    await expect(cartPage.page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(0);
  });
});