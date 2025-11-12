import { test, expect } from '../fixtures/loginFixture';
import { LoginPage } from '../pageobjects/loginPage';
import { UserFactory } from '../data/user';
import { InventoryPage } from '../pageobjects/inventoryPage';
import { CartPage } from '../pageobjects/cartPage';
import { CheckoutStep1 } from '../pageobjects/checkoutStep1';
import { CheckoutStep2 } from '../pageobjects/checkoutStep2';
import { CheckoutComplete } from '../pageobjects/checkoutComplete';

test.describe('Enhanced Shopping Cart Tests', () => {

  test.describe('Successful Login Tests', () => {
    test('login with all valid users', async ({ page }) => {
      const validUsers = UserFactory.getAllValidUsers();

      for (const user of validUsers) {
        await test.step(`Login with ${user.username} (${user.type})`, async () => {
          const loginPage = new LoginPage(page, '/');

          await loginPage.goto();
          await loginPage.login(user.username, user.password);
          
          // ✅ CLEAR EXPECTATION: All valid users should reach inventory
          await expect(page).toHaveURL(/inventory.html/);
          console.log(`✅ Successfully logged in with user: ${user.username} (${user.type})`);
          
          // Optional: Test user-specific behaviors that still result in success
          if (user.type === 'problem') {
            console.log(`ℹ️  Note: ${user.username} may have UI quirks but login succeeded`);
          }
          if (user.type === 'performance') {
            console.log(`ℹ️  Note: ${user.username} may be slower but login succeeded`);
          }
        });
      }
    });
  });

  test.describe('Failed Login Tests', () => {
    test('login with locked out user shows error', async ({ page }) => {
      const lockedUser = UserFactory.getLockedOutUser();
      const loginPage = new LoginPage(page, '/');

      await loginPage.goto();
      await loginPage.login(lockedUser.username, lockedUser.password);
      
      // ✅ CLEAR EXPECTATION: Locked user should show error and stay on login page
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
      await expect(page).not.toHaveURL(/inventory.html/); // Should NOT reach inventory
      console.log(`✅ Error correctly displayed for: ${lockedUser.username}`);
    });

    // Future: Add tests for other error scenarios
    // test('login with invalid credentials shows error', async ({ page }) => { ... });
    // test('login with empty fields shows validation error', async ({ page }) => { ... });
  });

  test.describe('Shopping Cart Workflow Tests', () => {

    test('sort products and add items to cart', async ({ page }) => {
      const validUser = UserFactory.getRandomValidUser();
      const loginPage = new LoginPage(page, '/');
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);

      // Setup: Login
      await loginPage.goto();
      await loginPage.login(validUser.username, validUser.password);
      
      // Test: Sort and add items
      await inventoryPage.orderProductsAZ();
      await expect(inventoryPage.productSortActive).toHaveText('Name (A to Z)');
      
      await inventoryPage.addProductToCartByNthProduct(0);
      await inventoryPage.addProductToCartByNthProduct(1);
      await inventoryPage.clickOnCartIcon();
      await expect(cartPage.cartItems).toHaveCount(2);
      console.log(`✅ Successfully added 2 items to cart and sorted A-Z`);
    });

    test('complete checkout process', async ({ page }) => {
      const validUser = UserFactory.getRandomValidUser();
      const loginPage = new LoginPage(page, '/');
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const checkoutStep1 = new CheckoutStep1(page);
      const checkoutStep2 = new CheckoutStep2(page);
      const checkoutComplete = new CheckoutComplete(page);

      // Setup: Login and add items
      await loginPage.goto();
      await loginPage.login(validUser.username, validUser.password);
      await inventoryPage.addProductToCartByNthProduct(0);
      await inventoryPage.addProductToCartByNthProduct(1);
      await inventoryPage.clickOnCartIcon();

      // Test: Complete checkout
      await cartPage.checkoutButton.click();
      await expect(page).toHaveURL(/checkout-step-one.html/);

      await expect(checkoutStep1.titleCheckoutStep1).toHaveText('Checkout: Your Information');
      await checkoutStep1.fillCheckoutInformation('John', 'Doe', '1000');
      await checkoutStep1.clickOnContinueButton();
      await expect(page).toHaveURL(/checkout-step-two.html/);

      await expect(checkoutStep2.titleCheckoutStep2).toHaveText('Checkout: Overview');
      await checkoutStep2.clickOnFinishButton();
      await expect(page).toHaveURL(/checkout-complete.html/);

      await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
      console.log(`✅ Order completed successfully`);
    });

  });
    test('button UI should match baseline', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.loginCredentials).toHaveScreenshot('login-credentials-baseline.png');
  });
});

test.describe('Login Fixture', () => {

    test('use authenticated page fixture', async ({ authenticatedPage }) => {
      // Already logged in - start testing immediately
      await expect(authenticatedPage.inventoryItems).toHaveCount(6);
      await authenticatedPage.addProductToCartByNthProduct(0);
      await expect(authenticatedPage.cartIconBadge).toHaveText('1');
    });

    test('use specific user type fixtures', async ({ authenticatedStandardUser }) => {
      // Guaranteed standard user behavior
      await authenticatedStandardUser.addProductToCartByName("Sauce Labs Backpack");
      await expect(authenticatedStandardUser.cartIconBadge).toHaveText('1');
      
      await authenticatedStandardUser.clickOnCartIcon();
      await expect(authenticatedStandardUser.page).toHaveURL(/cart\.html/);
    });

    test('use problem user fixture', async ({ authenticatedProblemUser }) => {
      // Test with problem user - may have UI quirks but should function
      await authenticatedProblemUser.addProductToCartByNthProduct(0);
      await expect(authenticatedProblemUser.cartIconBadge).toHaveText('1');
    });

});