import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class CartPage extends BasePage {   
    readonly cartItems : Locator;
    readonly cartQuantity : Locator;
    readonly descriptionCart : Locator;
    readonly checkoutButton : Locator;

    constructor (page: Page) {
        super(page,'/cart.html');
        this.cartItems = this.page.locator('.cart_item');
        this.cartQuantity = this.page.locator('[data-test="item-quantity"]');
        this.descriptionCart = this.page.locator('[data-test="inventory-item-name"]');
        this.checkoutButton = this.page.locator('[data-test="checkout"]');
    }

    getRemoveByProductName(productName: string): Promise<void>  {
        const dataTestId = productName.toLowerCase().replaceAll(' ', '-');
        return this.page
        .locator(`[data-test="remove-${dataTestId}"]`)
        .click();
    }

    getRemoveFirstProduct(): Promise<void>  {
        return this.page
        .locator('button:has-text("Remove")').first()
        .click();
    }
}