import { test, expect } from '../fixtures/loginFixture';
import { LoginHelpers } from '../helpers/loginHelpers';
import { UserFactory } from '../data/user';

/**
 * Example tests demonstrating login fixture usage
 * 
 * These examples show how to use the various login fixtures
 * for different testing scenarios in the workshop.
 */

test.describe('Login Fixture Examples', () => {

  test.describe('Basic Login Fixtures', () => {

    test('manual login using loginPage fixture', async ({ loginPage, inventoryPage }) => {
      // Manual login for full control
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      
      await expect(loginPage.page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    test('auto-authenticated test using authenticatedPage fixture', async ({ authenticatedPage }) => {
      // Already logged in with standard_user - start testing immediately
      await expect(authenticatedPage.inventoryItems).toHaveCount(6);
      await expect(authenticatedPage.cartIcon).toBeVisible();
      
      // Test cart functionality
      await authenticatedPage.addProductToCartByNthProduct(0);
      await expect(authenticatedPage.cartIconBadge).toHaveText('1');
    });

  });

  test.describe('Specific User Type Fixtures', () => {

    test('standard user workflow', async ({ authenticatedStandardUser }) => {
      // Guaranteed to use standard_user for reliable testing
      await authenticatedStandardUser.addProductToCartByNthProduct(0);
      await authenticatedStandardUser.addProductToCartByNthProduct(1);
      
      await expect(authenticatedStandardUser.cartIconBadge).toHaveText('2');
      
      // Test sorting functionality
      await authenticatedStandardUser.orderProductsAZ();
      await expect(authenticatedStandardUser.productSortActive).toHaveText('Name (A to Z)');
    });

    test('random user variety testing', async ({ authenticatedRandomUser }) => {
      // Uses a random valid user - good for discovering user-specific issues
      await authenticatedRandomUser.addProductToCartByName("Sauce Labs Backpack");
      await expect(authenticatedRandomUser.cartIconBadge).toHaveText('1');
      
      await authenticatedRandomUser.clickOnCartIcon();
      await expect(authenticatedRandomUser.page).toHaveURL(/cart\.html/);
    });

    test('problem user UI testing', async ({ authenticatedProblemUser }) => {
      // Specifically tests with problem_user to verify UI issues are handled
      await authenticatedProblemUser.addProductToCartByNthProduct(0);
      
      // Problem user might have UI quirks but basic functionality should work
      await expect(authenticatedProblemUser.cartIconBadge).toHaveText('1');
    });

    test('performance user timing testing', async ({ authenticatedPerformanceUser }) => {
      // Tests with performance_glitch_user - might be slower
      const startTime = Date.now();
      
      await authenticatedPerformanceUser.addProductToCartByNthProduct(0);
      await authenticatedPerformanceUser.clickOnCartIcon();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`Performance user workflow took: ${duration}ms`);
      await expect(authenticatedPerformanceUser.page).toHaveURL(/cart\.html/);
    });

  });

  test.describe('Login Helper Functions', () => {

    test('login with specific user type using helper', async ({ page }) => {
      const inventoryPage = await LoginHelpers.loginWithUserType(page, 'error');
      
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    test('login with custom credentials using helper', async ({ page }) => {
      const { loginPage, inventoryPage } = await LoginHelpers.loginWithCredentials(
        page, 
        'standard_user', 
        'secret_sauce'
      );
      
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.cartIcon).toBeVisible();
    });

    test('failed login using helper', async ({ page }) => {
      const loginPage = await LoginHelpers.attemptFailedLogin(
        page, 
        'locked_out_user', 
        'secret_sauce'
      );
      
      await expect(loginPage.errorMessage).toContainText('locked out');
    });

    test('logout functionality using helper', async ({ authenticatedPage }) => {
      // Start authenticated, then logout
      await expect(authenticatedPage.page).toHaveURL(/inventory\.html/);
      
      await LoginHelpers.logout(authenticatedPage.page);
      
      // Should be back at login page
      await expect(authenticatedPage.page).toHaveURL(/\/$/);
    });

    test('reset app state using helper', async ({ authenticatedPage }) => {
      // Add items to cart
      await authenticatedPage.addProductToCartByNthProduct(0);
      await authenticatedPage.addProductToCartByNthProduct(1);
      await expect(authenticatedPage.cartIconBadge).toHaveText('2');
      
      // Reset app state
      await LoginHelpers.resetAppState(authenticatedPage.page);
      
      // Cart should be empty but still logged in
      await expect(authenticatedPage.page).toHaveURL(/inventory\.html/);
      await expect(authenticatedPage.cartIconBadge).not.toBeVisible();
    });

  });

  test.describe('Multiple User Testing', () => {

    test('test all valid users with fixture pattern', async ({ page }) => {
      // Filter out locked users since they can't login successfully
      const validUsers = UserFactory.getAllValidUsers().filter(user => user.type !== 'locked');
      
      for (const user of validUsers) {
        await test.step(`Test workflow with ${user.username} (${user.type})`, async () => {
          const inventoryPage = await LoginHelpers.loginWithUserType(page, user.type as 'standard' | 'problem' | 'performance' | 'error' | 'visual');
          
          // Test basic cart functionality with each user
          await inventoryPage.addProductToCartByNthProduct(0);
          await expect(inventoryPage.cartIconBadge).toHaveText('1');
          
          // Logout for next user
          await LoginHelpers.logout(page);
        });
      }
    });

  });

  test.describe('Workshop Exercise Examples', () => {

    test('shopping workflow with authenticated fixture', async ({ authenticatedPage }) => {
      // Exercise: Complete shopping workflow using fixture
      
      // 1. Add products to cart
      await authenticatedPage.addProductToCartByNthProduct(0); // Backpack
      await authenticatedPage.addProductToCartByNthProduct(1); // Bike Light
      await expect(authenticatedPage.cartIconBadge).toHaveText('2');
      
      // 2. Navigate to cart
      await authenticatedPage.clickOnCartIcon();
      await expect(authenticatedPage.page).toHaveURL(/cart\.html/);
      
      // 3. Verify cart contents (would continue to checkout in full workflow)
      const cartItems = authenticatedPage.page.locator('.cart_item');
      await expect(cartItems).toHaveCount(2);
    });

    test('compare user behaviors with different fixtures', async ({ page }) => {
      // Exercise: Compare standard vs problem user behaviors
      
      await test.step('Standard user workflow', async () => {
        const standardInventory = await LoginHelpers.loginWithUserType(page, 'standard');
        await standardInventory.addProductToCartByNthProduct(0);
        await expect(standardInventory.cartIconBadge).toHaveText('1');
        await LoginHelpers.logout(page);
      });
      
      await test.step('Problem user workflow', async () => {
        const problemInventory = await LoginHelpers.loginWithUserType(page, 'problem');
        await problemInventory.addProductToCartByNthProduct(0);
        // Problem user should still be able to add to cart despite UI issues
        await expect(problemInventory.cartIconBadge).toHaveText('1');
        await LoginHelpers.logout(page);
      });
    });

  });

});