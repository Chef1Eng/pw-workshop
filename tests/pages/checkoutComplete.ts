import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class CheckoutComplete extends BasePage {   
    readonly titleCheckoutComplete : Locator;
    readonly finishButton : Locator;
    readonly completeHeader : Locator;

    constructor (page: Page) {
        super(page,'/cart.html');
        this.titleCheckoutComplete = this.page.locator('[data-test="title"]')
        this.finishButton = this.page.locator('[data-test="finish"]')
        this.completeHeader = this.page.locator('[data-test="complete-header"]')
    }

    clickOnFinishButton() {
        return this.finishButton.click();
    }
}