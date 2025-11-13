import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import { InventoryPage } from './pages/inventoryPage';
import { UserFactory, User } from './data/user';

/**
 * SEED TESTS - Environment and Data Verification
 * 
 * These tests verify that:
 * - The SauceDemo website is accessible
 * - All test users work as expected
 * - Core functionality is available
 * - Page objects are properly configured
 * 
 * Run this before running main test suites to ensure environment readiness.
 */

test.describe('🌱 Seed Tests - Environment Verification', () => {

  test.describe('🔗 Website Accessibility', () => {
    
    test('SauceDemo website is accessible', async ({ page }) => {
      await page.goto('/');
      
      // Verify page loads correctly
      await expect(page).toHaveTitle(/Swag Labs/);
      await expect(page.getByPlaceholder('Username')).toBeVisible();
      await expect(page.getByPlaceholder('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
      
      console.log('✅ SauceDemo website is accessible and login form is present');
    });

    test('inventory page structure is correct', async ({ page }) => {
      const loginPage = new LoginPage(page, '/');
      const inventoryPage = new InventoryPage(page);
      
      // Login with standard user
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      
      // Verify inventory page elements
      await expect(page).toHaveURL(/inventory.html/);
      await expect(inventoryPage.inventoryItems).toHaveCount(6); // SauceDemo has 6 products
      await expect(inventoryPage.cartIcon).toBeVisible();
      await expect(inventoryPage.productSortContainer).toBeVisible();
      
      console.log('✅ Inventory page structure is correct with products available');
    });

  });

  test.describe('👥 User Data Verification', () => {
    
    test('all valid users can login successfully', async ({ page }) => {
      const validUsers = UserFactory.getAllValidUsers();
      expect(validUsers.length).toBeGreaterThan(0);
      
      for (const user of validUsers) {
        await test.step(`Verify ${user.username} (${user.type}) can login`, async () => {
          const loginPage = new LoginPage(page, '/');
          
          await loginPage.goto();
          await loginPage.login(user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          
          console.log(`✅ User ${user.username} (${user.type}) login verified`);
          
          // Go back to login for next user
          await page.goto('/');
        });
      }
    });

    test('locked out user shows proper error', async ({ page }) => {
      const lockedUser = UserFactory.getLockedOutUser();
      expect(lockedUser).toBeDefined();
      expect(lockedUser.canLogin).toBe(false);
      
      const loginPage = new LoginPage(page, '/');
      
      await loginPage.goto();
      await loginPage.login(lockedUser.username, lockedUser.password);
      
      // Should stay on login page with error
      await expect(page).not.toHaveURL(/inventory.html/);
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('locked out');
      
      console.log(`✅ Locked user ${lockedUser.username} properly blocked with error message`);
    });

    test('user factory methods work correctly', async ({ page }) => {
      // Test UserFactory methods
      const allUsers = UserFactory.getAllUsers();
      const validUsers = UserFactory.getAllValidUsers();
      const invalidUsers = UserFactory.getAllInvalidUsers();
      const randomValidUser = UserFactory.getRandomValidUser();
      const standardUsers = UserFactory.getStandardUsers();
      const lockedUser = UserFactory.getLockedOutUser();

      // Verify counts and relationships
      expect(allUsers.length).toBe(validUsers.length + invalidUsers.length);
      expect(validUsers.length).toBeGreaterThan(0);
      expect(invalidUsers.length).toBeGreaterThan(0);
      expect(validUsers).toContain(randomValidUser);
      expect(standardUsers.every((user: User) => user.type === 'standard')).toBe(true);
      expect(lockedUser.type).toBe('locked');
      expect(lockedUser.canLogin).toBe(false);

      console.log(`✅ UserFactory methods verified:`);
      console.log(`   - Total users: ${allUsers.length}`);
      console.log(`   - Valid users: ${validUsers.length}`);
      console.log(`   - Invalid users: ${invalidUsers.length}`);
      console.log(`   - Standard users: ${standardUsers.length}`);
    });

  });

  test.describe('🛒 Core Functionality Verification', () => {
    
    test('product sorting functionality works', async ({ page }) => {
      const loginPage = new LoginPage(page, '/');
      const inventoryPage = new InventoryPage(page);
      
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      
      // Test sorting
      await inventoryPage.orderProductsAZ();
      await expect(inventoryPage.productSortActive).toHaveText('Name (A to Z)');
      
      console.log('✅ Product sorting functionality verified');
    });

    test('add to cart functionality works', async ({ page }) => {
      const loginPage = new LoginPage(page, '/');
      const inventoryPage = new InventoryPage(page);
      
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      
      // Add products to cart
      await inventoryPage.addProductToCartByNthProduct(0);
      await inventoryPage.addProductToCartByNthProduct(1);
      
      // Verify cart badge shows correct count
      await expect(inventoryPage.cartIconBadge).toHaveText('2');
      
      console.log('✅ Add to cart functionality verified');
    });

    test('cart page navigation works', async ({ page }) => {
      const loginPage = new LoginPage(page, '/');
      const inventoryPage = new InventoryPage(page);
      
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      
      // Add item and navigate to cart
      await inventoryPage.addProductToCartByNthProduct(0);
      await inventoryPage.clickOnCartIcon();
      
      // Verify cart page
      await expect(page).toHaveURL(/cart.html/);
      
      console.log('✅ Cart page navigation verified');
    });

  });

  test.describe('🏗️ Page Object Architecture Verification', () => {
    
    test('all page objects are properly initialized', async ({ page }) => {
      // Verify page objects can be instantiated without errors
      const loginPage = new LoginPage(page, '/');
      const inventoryPage = new InventoryPage(page);
      
      // Check that essential locators are defined
      expect(loginPage.usernameInput).toBeDefined();
      expect(loginPage.passwordInput).toBeDefined();
      expect(loginPage.loginButton).toBeDefined();
      expect(loginPage.errorMessage).toBeDefined();
      
      expect(inventoryPage.inventoryItems).toBeDefined();
      expect(inventoryPage.cartIcon).toBeDefined();
      expect(inventoryPage.cartIconBadge).toBeDefined();
      expect(inventoryPage.productSortContainer).toBeDefined();
      
      console.log('✅ All page objects properly initialized with required locators');
    });

    test('page object inheritance works correctly', async ({ page }) => {
      const loginPage = new LoginPage(page, '/');
      
      // Verify inheritance from BasePage
      expect(loginPage.goto).toBeDefined();
      expect(typeof loginPage.goto).toBe('function');
      
      // Test goto functionality
      await loginPage.goto();
      await expect(page).toHaveURL(/\/$/);
      
      console.log('✅ Page object inheritance verified');
    });

  });

  test.describe('📊 Test Environment Summary', () => {
    
    test('generate environment report', async ({ page }) => {
      console.log('\n🔍 ENVIRONMENT VERIFICATION SUMMARY:');
      console.log('=====================================');
      
      // Website info
      await page.goto('/');
      const title = await page.title();
      const url = page.url();
      
      console.log(`🌐 Website: ${url}`);
      console.log(`📄 Title: ${title}`);
      
      // User data summary
      const allUsers = UserFactory.getAllUsers();
      const validUsers = UserFactory.getAllValidUsers();
      const invalidUsers = UserFactory.getAllInvalidUsers();
      
      console.log(`👥 Total test users: ${allUsers.length}`);
      console.log(`✅ Valid users: ${validUsers.length}`);
      console.log(`❌ Invalid users: ${invalidUsers.length}`);
      
      // List all users with their types
      console.log('\n📋 User Inventory:');
      for (const user of allUsers) {
        const status = user.canLogin ? '✅' : '❌';
        console.log(`   ${status} ${user.username} (${user.type})`);
      }
      
      console.log('\n🎯 Environment is ready for testing!');
      console.log('=====================================\n');
    });

  });

});