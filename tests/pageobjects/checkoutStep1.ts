import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class CheckoutStep1 extends BasePage {   
    readonly titleCheckoutStep1 : Locator;
    readonly continueButton : Locator;
    readonly firstNameInput : Locator;
    readonly lastNameInput : Locator;
    readonly postalCodeInput : Locator;

    constructor (page: Page) {
        super(page,'/cart.html');
        this.titleCheckoutStep1 = this.page.locator('[data-test="title"]')
        this.continueButton = this.page.locator('[data-test="continue"]')
        this.firstNameInput = this.page.locator('[data-test="firstName"]')
        this.lastNameInput = this.page.locator('[data-test="lastName"]')
        this.postalCodeInput = this.page.locator('[data-test="postalCode"]')
    }

    clickOnContinueButton() {
        return this.continueButton.click();
    }

    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }
}