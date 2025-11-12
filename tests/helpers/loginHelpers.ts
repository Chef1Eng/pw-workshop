import { expect, Page } from '@playwright/test';
import { LoginPage } from '../pageobjects/loginPage';
import { InventoryPage } from '../pageobjects/inventoryPage';
import { UserFactory } from '../data/user';

/**
 * Login Helper Functions
 * 
 * Utility functions for login-related operations that can be used
 * across different test files and scenarios.
 */
export class LoginHelpers {
  
  /**
   * Login with a specific user type
   * 
   * @param page - Playwright page object
   * @param userType - Type of user to login with
   * @returns Promise<InventoryPage> - Inventory page object after successful login
   */
  static async loginWithUserType(
    page: Page, 
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
   * 
   * @param page - Playwright page object
   * @param username - Username to login with
   * @param password - Password to login with
   * @returns Promise<{loginPage: LoginPage; inventoryPage: InventoryPage}>
   */
  static async loginWithCredentials(
    page: Page, 
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
   * 
   * @param page - Playwright page object
   * @param username - Username to attempt login with
   * @param password - Password to attempt login with
   * @returns Promise<LoginPage> - LoginPage object with error visible
   */
  static async attemptFailedLogin(
    page: Page, 
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
   * 
   * @param page - Playwright page object (should be authenticated)
   */
  static async logout(page: Page): Promise<void> {
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
   * 
   * @param page - Playwright page object (should be authenticated)
   */
  static async resetAppState(page: Page): Promise<void> {
    // Click hamburger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    
    // Click reset app state
    await page.getByRole('link', { name: 'Reset App State' }).click();
    
    // Close menu
    await page.getByRole('button', { name: 'Close Menu' }).click();
    
    // Verify still on inventory page but state is reset
    await expect(page).toHaveURL(/inventory\.html/);
  }

  /**
   * Quick login with standard user (most reliable)
   * 
   * @param page - Playwright page object
   * @returns Promise<InventoryPage> - Inventory page after login
   */
  static async quickLogin(page: Page): Promise<InventoryPage> {
    return this.loginWithUserType(page, 'standard');
  }

  /**
   * Login with random valid user for test variety
   * 
   * @param page - Playwright page object
   * @returns Promise<{user: User; inventoryPage: InventoryPage}>
   */
  static async loginWithRandomUser(page: Page): Promise<{user: any; inventoryPage: InventoryPage}> {
    const loginPage = new LoginPage(page, '/');
    const inventoryPage = new InventoryPage(page);
    
    const user = UserFactory.getRandomValidUser();
    
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    
    // Verify successful login
    await expect(page).toHaveURL(/inventory\.html/);
    
    return { user, inventoryPage };
  }
}