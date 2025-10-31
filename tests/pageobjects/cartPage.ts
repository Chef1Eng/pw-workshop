import { Locator, Page } from "@playwright/test";
import { BasicPage } from "./basicPage";

export class CartPage extends BasicPage {   
    readonly cartItems : Locator;
    readonly cartQuantity : Locator;
    readonly descriptionCart : Locator;

    constructor (page: Page) {
        super(page,'/cart.html');
        this.cartItems = this.page.locator('.cart_item');
        this.cartQuantity = this.page.locator('[data-test="item-quantity"]');
        this.descriptionCart = this.page.locator('[data-test="inventory-item-name"]');
    }

    getRemoveButtonFor(productName: string): Promise<void>  {
//return this.page.locator('.cart_item').filter({ has: this.page.locator('[data-test="inventory-item-name"]').getByText(productName) }).locator('[data-test*="remove"]');
        const dataTestId = productName.toLowerCase().replaceAll(' ', '-');
        return this.page
        .locator(`[data-test="remove-${dataTestId}"]`)
        .click();
    }
}