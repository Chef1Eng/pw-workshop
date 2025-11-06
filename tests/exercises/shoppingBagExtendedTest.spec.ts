import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';
import { UserFactory } from '../data/user';
import { InventoryPage } from '../pageobjects/inventoryPage';
import { CartPage } from '../pageobjects/cartPage';
import { CheckoutStep1 } from '../pageobjects/checkoutStep1';
import { CheckoutStep2 } from '../pageobjects/checkoutStep2';
import { CheckoutComplete } from '../pageobjects/checkoutComplete';

test.describe('Extend the shopping cart test with additional functionality', () => { 
  test('successful checkout', async ({ page }) => {
    const validUsers = UserFactory.getRandomValidUser();
    const loginPage = new LoginPage(page, '/');
  

    await loginPage.goto();
    await loginPage.login(validUsers.username, validUsers.password);
    await expect(page).toHaveURL(/inventory.html/);
    console.log(`Logged in with user: ${validUsers.username}`);

    const inventoryPage = new InventoryPage(page);

    await inventoryPage.orderProductsAZ();
    await expect(inventoryPage.productSortActive).toHaveText('Name (A to Z)');

    const cartPage = new CartPage(page);
    
    await inventoryPage.addProductToCartByNthProduct(0);
    await inventoryPage.addProductToCartByNthProduct(1);
    await inventoryPage.clickOnCartIcon();
    await expect(cartPage.cartItems).toHaveCount(2);
    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one.html/);
    console.log(`Proceeded to checkout step one`);

    const checkoutStep1 = new CheckoutStep1(page);

    await expect(checkoutStep1.titleCheckoutStep1).toHaveText('Checkout: Your Information');
    await checkoutStep1.fillCheckoutInformation('John', 'Doe', '1000');
    await checkoutStep1.clickOnContinueButton();
    console.log(`Proceeded to checkout step two`);
    await expect(page).toHaveURL(/checkout-step-two.html/);

    const checkoutStep2 = new CheckoutStep2(page);

    await expect(checkoutStep2.titleCheckoutStep2).toHaveText('Checkout: Overview');
    console.log(`On checkout step two page`);
    checkoutStep2.clickOnFinishButton();
    await expect(page).toHaveURL(/checkout-complete.html/);
    console.log(`Proceeded to checkout complete page`);

    const checkoutComplete = new CheckoutComplete(page);
    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
    console.log(`Order completed successfully`);
  });

  test('Error login case locked user', async ({ page }) => {
  const lockedUsers = UserFactory.getLockedOutUser();
  const loginPage = new LoginPage(page, '/');

  await loginPage.goto();
  await loginPage.login(lockedUsers.username, lockedUsers.password);
  const errorMessage = loginPage.errorMessage;
  await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  console.log(`Logged in with user: ${lockedUsers.username}`);

  });
});