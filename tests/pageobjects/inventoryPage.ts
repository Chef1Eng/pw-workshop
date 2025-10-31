import { Locator, Page } from '@playwright/test';
import { BasicPage } from './basicPage';

export class InventoryPage extends BasicPage {

    readonly inventoryItems : Locator;
    readonly cartIcon : Locator;
    readonly cartIconBadge : Locator;

    constructor(page: Page) {
        super(page,'/inventory.html');
        this.inventoryItems = this.page.locator('.inventory_item');
        this.cartIcon = this.page.locator('.shopping_cart_link');
        this.cartIconBadge = this.page.locator('[data-test="shopping-cart-badge"]');
    }

    clickOnNthProduct(nthNumber: number) {
        return this.inventoryItems.nth(nthNumber).locator('button[data-test*="add-to-cart"]').click();
    }

    addProductToCart(productName: string): Promise<void> {
        //Next lines generates by copilot, but I love it
        const dataTestId = productName.toLowerCase().replace(/\s+/g, '-');
        return this.page.locator(`[data-test="add-to-cart-${dataTestId}"]`).click();
    }

    clickOnCartIcon() {
        return this.cartIcon.click();
    }


}