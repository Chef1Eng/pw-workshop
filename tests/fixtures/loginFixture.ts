import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';
import { InventoryPage } from '../pageobjects/inventoryPage';
import { UserFactory, User } from '../data/user';

// Define fixture types
type LoginFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  authenticatedPage: InventoryPage;
  authenticatedStandardUser: InventoryPage;
  authenticatedRandomUser: InventoryPage;
  authenticatedProblemUser: InventoryPage;
  authenticatedPerformanceUser: InventoryPage;
};

/**
 * Login Fixtures for SauceDemo Workshop
 * 
 * Provides various login scenarios as fixtures to reduce test boilerplate
 * and ensure consistent authentication across test suites.
 */
export const test = base.extend<LoginFixtures>({
  
  /**
   * Basic LoginPage fixture - instantiates LoginPage object
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page, '/');
    await use(loginPage);
  },

  /**
   * Basic InventoryPage fixture - instantiates InventoryPage object
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Authenticated Page fixture with default standard_user
   * 
   * Automatically logs in with standard_user and provides InventoryPage
   * Use this for tests that need a logged-in state with the most reliable user
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    // Navigate to login page
    await loginPage.goto();
    
    // Login with standard user (most reliable)
    const standardUser = UserFactory.getStandardUsers()[0];
    await loginPage.login(standardUser.username, standardUser.password);
    
    // Verify successful login
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    
    console.log(`✅ Authenticated with ${standardUser.username} (${standardUser.type})`);
    
    await use(inventoryPage);
  },

  /**
   * Authenticated Standard User fixture
   * 
   * Explicitly logs in with standard_user for tests requiring reliable behavior
   */
  authenticatedStandardUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    const standardUser = UserFactory.getStandardUsers()[0];
    
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    
    // Verify successful login
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    
    console.log(`✅ Authenticated with standard_user`);
    
    await use(inventoryPage);
  },

  /**
   * Authenticated Random Valid User fixture
   * 
   * Logs in with a random valid user for test variety
   * Good for testing different user behaviors
   */
  authenticatedRandomUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    const randomUser = UserFactory.getRandomValidUser();
    
    await loginPage.goto();
    await loginPage.login(randomUser.username, randomUser.password);
    
    // Verify successful login
    await expect(page).toHaveURL(/inventory\.html/);
    
    // Note: Some users might have different UI behaviors but should still reach inventory
    if (randomUser.type === 'problem') {
      console.log(`ℹ️  Using problem_user - may have UI quirks`);
    } else if (randomUser.type === 'performance') {
      console.log(`ℹ️  Using performance_glitch_user - may be slower`);
    }
    
    console.log(`✅ Authenticated with ${randomUser.username} (${randomUser.type})`);
    
    await use(inventoryPage);
  },

  /**
   * Authenticated Problem User fixture
   * 
   * Specifically logs in with problem_user for testing problematic scenarios
   */
  authenticatedProblemUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    const problemUser = UserFactory.getAllValidUsers().find(user => user.type === 'problem')!;
    
    await loginPage.goto();
    await loginPage.login(problemUser.username, problemUser.password);
    
    // Verify successful login (problem user should still login successfully)
    await expect(page).toHaveURL(/inventory\.html/);
    
    console.log(`✅ Authenticated with problem_user (expect UI quirks)`);
    
    await use(inventoryPage);
  },

  /**
   * Authenticated Performance User fixture
   * 
   * Specifically logs in with performance_glitch_user for performance testing
   */
  authenticatedPerformanceUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    const performanceUser = UserFactory.getAllValidUsers().find(user => user.type === 'performance')!;
    
    await loginPage.goto();
    await loginPage.login(performanceUser.username, performanceUser.password);
    
    // Verify successful login (may take longer)
    await expect(page).toHaveURL(/inventory\.html/);
    
    console.log(`✅ Authenticated with performance_glitch_user (expect slower responses)`);
    
    await use(inventoryPage);
  }
});

/**
 * Helper functions for login-related operations
 */
export class LoginHelpers {
  
  /**
   * Login with a specific user type
   */
  static async loginWithUserType(
    page: any, 
    userType: 'standard' | 'problem' | 'performance' | 'error' | 'visual'
  ): Promise<InventoryPage> {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    const user = UserFactory.getAllValidUsers().find(u => u.type === userType);
    if (!user) {
      throw new Error(`No valid user found for type: ${userType}`);
    }
    
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    
    // Verify successful login
    await expect(page).toHaveURL(/inventory\.html/);
    
    return inventoryPage;
  }

  /**
   * Login with specific credentials
   */
  static async loginWithCredentials(
    page: any, 
    username: string, 
    password: string
  ): Promise<{ loginPage: LoginPage; inventoryPage: InventoryPage }> {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(username, password);
    
    return { loginPage, inventoryPage };
  }

  /**
   * Attempt login and expect failure
   */
  static async attemptFailedLogin(
    page: any, 
    username: string, 
    password: string
  ): Promise<LoginPage> {
    const loginPage = new LoginPage(page, '/');
    
    await loginPage.goto();
    await loginPage.login(username, password);
    
    // Verify login failed (should still be on login page)
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.errorMessage).toBeVisible();
    
    return loginPage;
  }

  /**
   * Logout from authenticated state
   */
  static async logout(page: any): Promise<void> {
    // Click hamburger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    
    // Click logout
    await page.getByRole('link', { name: 'Logout' }).click();
    
    // Verify logout successful
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  }

  /**
   * Reset app state while remaining logged in
   */
  static async resetAppState(page: any): Promise<void> {
    // Click hamburger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    
    // Click reset app state
    await page.getByRole('link', { name: 'Reset App State' }).click();
    
    // Close menu
    await page.getByRole('button', { name: 'Close Menu' }).click();
    
    // Verify still on inventory page but state is reset
    await expect(page).toHaveURL(/inventory\.html/);
  }
}

export { expect } from '@playwright/test';