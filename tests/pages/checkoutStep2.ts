import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class CheckoutStep2 extends BasePage {   
    readonly titleCheckoutStep2 : Locator;
    readonly finishButton : Locator;

    constructor (page: Page) {
        super(page,'/cart.html');
        this.titleCheckoutStep2 = this.page.locator('[data-test="title"]')
        this.finishButton = this.page.locator('[data-test="finish"]')
    }

    clickOnFinishButton() {
        return this.finishButton.click();
    }
}