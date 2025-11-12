# Login Fixture Documentation

## Overview

The login fixture provides pre-authenticated states and helper functions to reduce test boilerplate and ensure consistent authentication across your Playwright tests.

## Files Structure

- `tests/fixtures/loginFixture.ts` - Main fixture definitions
- `tests/helpers/loginHelpers.ts` - Helper functions for login operations
- `tests/examples/loginFixtureExamples.spec.ts` - Example usage
- `tests/examples/loginFixtureExamples-corrected.spec.ts` - Corrected examples

## Quick Fix Applied

✅ **Best Practice Implemented**: Moved `LoginHelpers` class from fixtures to a dedicated helpers folder to maintain proper separation of concerns.

## Available Fixtures

### Basic Fixtures

```typescript
// Basic page object instances
test('example', async ({ loginPage, inventoryPage }) => {
  // Manual login control
});

// Pre-authenticated with standard_user
test('example', async ({ authenticatedPage }) => {
  // Already logged in, start testing immediately
});
```

### User-Specific Fixtures

```typescript
// Guaranteed standard_user (most reliable)
test('example', async ({ authenticatedStandardUser }) => {
  // Use for tests requiring consistent behavior
});

// Random valid user (test variety)  
test('example', async ({ authenticatedRandomUser }) => {
  // Good for discovering user-specific issues
});

// Problem user (UI quirks expected)
test('example', async ({ authenticatedProblemUser }) => {
  // Test UI issue handling
});

// Performance user (slower responses expected)
test('example', async ({ authenticatedPerformanceUser }) => {
  // Test performance scenarios
});
```

## Helper Functions

```typescript
import { LoginHelpers } from '../helpers/loginHelpers';

// Login with specific user type
const inventoryPage = await LoginHelpers.loginWithUserType(page, 'standard');

// Login with custom credentials
const { loginPage, inventoryPage } = await LoginHelpers.loginWithCredentials(
  page, 'username', 'password'
);

// Attempt failed login (returns LoginPage with error visible)
const loginPage = await LoginHelpers.attemptFailedLogin(
  page, 'locked_out_user', 'secret_sauce'
);

// Quick login with standard user (shortcut)
const inventoryPage = await LoginHelpers.quickLogin(page);

// Login with random user for variety
const { user, inventoryPage } = await LoginHelpers.loginWithRandomUser(page);

// Logout from authenticated state
await LoginHelpers.logout(page);

// Reset app state (clear cart but stay logged in)
await LoginHelpers.resetAppState(page);
```

## Workshop Integration

This fixture integrates seamlessly with your existing structure:

- ✅ Uses your existing `LoginPage` and `InventoryPage` classes
- ✅ Leverages your `UserFactory` for test data
- ✅ Follows your Page Object Model pattern
- ✅ Works with your cross-browser configuration
- ✅ Supports your workshop learning objectives

## Usage Examples

### Simple Cart Test
```typescript
test('add items to cart', async ({ authenticatedPage }) => {
  await authenticatedPage.addProductToCartByNthProduct(0);
  await expect(authenticatedPage.cartIconBadge).toHaveText('1');
});
```

### Multi-User Testing
```typescript
test('test all user types', async ({ page }) => {
  const userTypes = ['standard', 'problem', 'performance', 'error', 'visual'];
  
  for (const userType of userTypes) {
    await test.step(`Test ${userType} user`, async () => {
      const inventory = await LoginHelpers.loginWithUserType(page, userType);
      // Test functionality with this user type
      await LoginHelpers.logout(page);
    });
  }
});
```

### Error Handling
```typescript
test('locked user error', async ({ page }) => {
  const loginPage = await LoginHelpers.attemptFailedLogin(
    page, 'locked_out_user', 'secret_sauce'
  );
  await expect(loginPage.errorMessage).toContainText('locked out');
});
```

## Benefits

1. **Reduced Boilerplate**: No need to manually login in every test
2. **Consistent Setup**: Standardized authentication across tests  
3. **User Variety**: Easy testing with different user types
4. **Error Testing**: Built-in helpers for failed login scenarios
5. **Workshop Ready**: Follows your existing patterns and structure

## Getting Started

1. Import the fixture in your test files:
   ```typescript
   import { test, expect } from '../fixtures/loginFixture';
   ```

2. Import helpers when needed:
   ```typescript
   import { LoginHelpers } from '../helpers/loginHelpers';
   ```

3. Use the fixtures in your tests:
   ```typescript
   test('my test', async ({ authenticatedPage }) => {
     // Start testing immediately - already logged in!
   });
   ```

4. For more control, use the helper functions:
   ```typescript
   const inventoryPage = await LoginHelpers.quickLogin(page);
   ```