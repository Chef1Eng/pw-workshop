import { Locator, Page } from "@playwright/test";
import { BasicPage } from "./basicPage";

export class CartPage extends BasicPage {   
    readonly cartItems : Locator;
    readonly quantityCart : Locator;
    readonly descriptionCart : Locator;

    constructor (page: Page) {
        super(page,'/cart.html');
        this.cartItems = this.page.locator('.cart_item');
        this.quantityCart = this.page.locator('[data-test="item-quantity"]');
        this.descriptionCart = this.page.locator('[data-test="inventory-item-name"]');
    }

    getRemoveButtonFor(productName: string): Locator {
    return this.page
        .locator('.cart_item')
        .filter({ has: this.page.locator('[data-test="inventory-item-name"]').getByText(productName) })
        .locator('[data-test*="remove"]');
    }
}