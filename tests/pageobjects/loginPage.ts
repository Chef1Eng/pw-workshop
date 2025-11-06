import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage{
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page, url: string) {
        super(page, '/');
        // ✅ BEST PRACTICE - Semantic locators
        this.usernameInput = this.page.getByPlaceholder('Username');
        this.passwordInput = this.page.getByPlaceholder('Password');
        this.loginButton = this.page.getByRole('button', { name: 'Login' });
        // ✅ BEST PRACTICE - Text-based semantic locator (since no alert role exists)
        this.errorMessage = this.page.getByText(/Epic sadface/i);
        // Alternative: this.errorMessage = this.page.getByTestId('error');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}