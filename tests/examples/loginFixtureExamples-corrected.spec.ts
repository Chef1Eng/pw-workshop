import test, { expect } from "@playwright/test";
import { UserFactory } from "../data/user";
import { LoginHelpers } from "../fixtures/loginFixture";

    test('test all valid users with fixture pattern', async ({ page }) => {
      const validUsers = UserFactory.getAllValidUsers().filter(user => user.type !== 'locked');
      
      for (const user of validUsers) {
        await test.step(`Test workflow with ${user.username} (${user.type})`, async () => {
          const inventoryPage = await LoginHelpers.loginWithUserType(page, user.type as 'standard' | 'problem' | 'performance' | 'error' | 'visual');
          
          // Test basic cart functionality with each user
          await inventoryPage.addProductToCartByNthProduct(0);
          await expect(inventoryPage.cartIconBadge).toHaveText('1');
          
          // Logout for next user
          await LoginHelpers.logout(page);
        });
      }
    });