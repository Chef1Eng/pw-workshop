import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class InventoryPage extends BasePage {

    readonly inventoryItems : Locator;
    readonly cartIcon : Locator;
    readonly cartIconBadge : Locator;
    readonly productSortContainer : Locator;

    constructor(page: Page) {
        super(page,'/inventory.html');
        this.inventoryItems = this.page.locator('.inventory_item');
        this.cartIcon = this.page.locator('.shopping_cart_link');
        this.cartIconBadge = this.page.locator('[data-test="shopping-cart-badge"]');
        this.productSortContainer = this.page.locator('[data-test="product-sort-container"]');
    }

    addProductToCartByNthProduct(nthNumber: number) {
        return this.inventoryItems.nth(nthNumber).locator('button[data-test*="add-to-cart"]').click();
    }

    addProductToCartByName(productName: string): Promise<void> {
        //Next lines generates by copilot, but I love it
        const dataTestId = productName.toLowerCase().replaceAll(/\s+/g, '-');
        return this.page.locator(`[data-test="add-to-cart-${dataTestId}"]`).click();
    }

    clickOnCartIcon() {
        return this.cartIcon.click();
    }

    orderProductsAZ() {
        return this.productSortContainer.selectOption('az');
    }
}