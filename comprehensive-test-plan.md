# SauceDemo E-commerce Application - Comprehensive Test Plan

## Application Overview

The SauceDemo application (https://www.saucedemo.com/) is a React-based e-commerce testing platform that simulates a complete online shopping experience. The application features:

- **User Authentication**: Login system with multiple user types (standard, problem, performance, error, visual, locked)
- **Product Catalog**: 6 products with names, descriptions, images, and prices
- **Shopping Cart**: Add/remove items, quantity management, and cart persistence
- **Product Sorting**: Sort products by name (A-Z, Z-A) and price (low-to-high, high-to-low)
- **Checkout Process**: Multi-step checkout with user information, order review, and completion
- **Navigation**: Hamburger menu with logout, reset functionality, and external links
- **Cross-browser Support**: Tested across Chrome, Firefox, and Safari via Playwright

## Current Test Structure Analysis

### Existing Test Coverage

**Seed Tests (`tests/seed.spec.ts`)**
- Environment verification and readiness checks
- User factory validation
- Page object architecture verification
- Basic functionality smoke tests

**Shopping Bag Tests (`tests/exercises/shoppingBagTest.spec.ts`)**
- Basic cart operations: add items, remove by name, remove first item
- Simple workflows with standard user

**Extended Shopping Tests (`tests/exercises/shoppingBagExtendedTest.spec.ts`)**
- Multi-user login scenarios
- Complete checkout workflows
- Error handling for locked users
- Product sorting functionality

**Page Object Model Implementation**
- `LoginPage`: Authentication handling
- `InventoryPage`: Product browsing and cart operations
- `CartPage`: Cart management
- `CheckoutStep1`, `CheckoutStep2`, `CheckoutComplete`: Checkout process
- `UserFactory`: Test data management for different user types

## Comprehensive Test Scenarios

### 1. Authentication and User Management

**Seed:** `tests/seed.spec.ts`

#### 1.1 Valid User Authentication
**Steps:**
1. Navigate to login page at "/"
2. For each valid user (standard_user, problem_user, performance_glitch_user, error_user, visual_user):
   - Enter username and password "secret_sauce"
   - Click Login button
   - Verify redirect to "/inventory.html"
   - Verify inventory page elements are visible
   - Navigate back to login page

**Expected Results:**
- All valid users successfully authenticate
- Inventory page loads with 6 products visible
- Cart icon and sorting dropdown are present
- Page title shows "Swag Labs"

#### 1.2 Invalid User Authentication
**Steps:**
1. Navigate to login page at "/"
2. Enter "locked_out_user" and password "secret_sauce"
3. Click Login button

**Expected Results:**
- Error message appears: "Epic sadface: Sorry, this user has been locked out."
- User remains on login page
- No redirect to inventory occurs

#### 1.3 Empty Credentials Validation
**Steps:**
1. Navigate to login page at "/"
2. Leave username and password fields empty
3. Click Login button

**Expected Results:**
- Error message appears indicating required fields
- User remains on login page

#### 1.4 Invalid Credentials
**Steps:**
1. Navigate to login page at "/"
2. Enter "invalid_user" and password "wrong_password"
3. Click Login button

**Expected Results:**
- Error message appears indicating invalid credentials
- User remains on login page

### 2. Product Catalog and Inventory Management

**Seed:** `tests/exercises/shoppingBagExtendedTest.spec.ts`

#### 2.1 Product Display Verification
**Steps:**
1. Login with standard_user
2. Verify all 6 products are displayed:
   - Sauce Labs Backpack ($29.99)
   - Sauce Labs Bike Light ($9.99)
   - Sauce Labs Bolt T-Shirt ($15.99)
   - Sauce Labs Fleece Jacket ($49.99)
   - Sauce Labs Onesie ($7.99)
   - Test.allTheThings() T-Shirt (Red) ($15.99)
3. Verify each product has:
   - Product image
   - Product name (clickable link)
   - Product description
   - Price
   - "Add to cart" button

**Expected Results:**
- All 6 products display correctly with complete information
- Product links navigate to product detail views
- Add to cart buttons are functional

#### 2.2 Product Sorting Functionality
**Steps:**
1. Login with standard_user
2. Test each sorting option:
   - Name (A to Z): Verify alphabetical order
   - Name (Z to A): Verify reverse alphabetical order
   - Price (low to high): Verify ascending price order
   - Price (high to low): Verify descending price order
3. Verify active sort indicator updates correctly

**Expected Results:**
- Products reorder correctly for each sorting option
- Active sort indicator shows current selection
- Product information remains accurate after sorting

#### 2.3 Product Detail Navigation
**Steps:**
1. Login with standard_user
2. Click on each product name/image link
3. Verify product detail page functionality
4. Navigate back to inventory

**Expected Results:**
- Product detail pages display correctly
- Back navigation maintains cart state
- Product information remains consistent

### 3. Shopping Cart Operations

**Seed:** `tests/exercises/shoppingBagTest.spec.ts`

#### 3.1 Add Single Item to Cart
**Steps:**
1. Login with standard_user
2. Click "Add to cart" button for Sauce Labs Backpack
3. Verify cart badge shows "1"
4. Verify button changes to "Remove"
5. Click cart icon to view cart
6. Verify item appears in cart with correct details

**Expected Results:**
- Cart badge displays correct count
- Button state changes appropriately
- Cart page shows item with correct name, description, and price
- Cart total reflects item price

#### 3.2 Add Multiple Items to Cart
**Steps:**
1. Login with standard_user
2. Add 3 different products to cart
3. Verify cart badge shows "3"
4. Navigate to cart page
5. Verify all 3 items appear with correct details

**Expected Results:**
- Cart badge shows accurate count
- All selected items appear in cart
- Quantities and prices are correct
- Cart total calculation is accurate

#### 3.3 Remove Item from Cart (By Product Name)
**Steps:**
1. Login with standard_user
2. Add "Sauce Labs Backpack" to cart
3. Navigate to cart page
4. Click "Remove" button for Sauce Labs Backpack
5. Verify cart is empty

**Expected Results:**
- Item is removed from cart
- Cart badge disappears or shows updated count
- Cart page shows empty state
- Continue Shopping button remains functional

#### 3.4 Remove Item from Cart (First Product)
**Steps:**
1. Login with standard_user
2. Add multiple items to cart
3. Navigate to cart page
4. Remove the first product in the list
5. Verify remaining items stay in cart

**Expected Results:**
- Only the first item is removed
- Remaining items maintain their position and details
- Cart count updates correctly
- Checkout process remains available

#### 3.5 Cart Persistence During Session
**Steps:**
1. Login with standard_user
2. Add items to cart
3. Navigate to different pages (inventory, about)
4. Return to cart
5. Verify items remain in cart

**Expected Results:**
- Cart contents persist across page navigation
- Cart count remains accurate
- Item details remain unchanged

### 4. Checkout Process Workflow

**Seed:** `tests/exercises/shoppingBagExtendedTest.spec.ts`

#### 4.1 Complete Successful Checkout
**Steps:**
1. Login with standard_user
2. Add 2 items to cart (Sauce Labs Backpack and Sauce Labs Bike Light)
3. Navigate to cart and click "Checkout"
4. Fill checkout information:
   - First Name: "John"
   - Last Name: "Doe"  
   - Zip/Postal Code: "12345"
5. Click "Continue"
6. Review order details on checkout overview page
7. Verify payment information shows "SauceCard #31337"
8. Verify shipping shows "Free Pony Express Delivery!"
9. Verify total calculation includes tax
10. Click "Finish"
11. Verify order completion page

**Expected Results:**
- Checkout step 1 accepts valid information
- Checkout step 2 displays correct order summary
- Tax calculation is accurate ($2.40 for items totaling $39.98)
- Final total shows correct amount
- Completion page displays success message
- "Back Home" button returns to inventory

#### 4.2 Checkout with Missing Information
**Steps:**
1. Login with standard_user
2. Add item to cart and proceed to checkout
3. Leave required fields empty:
   - First Name: empty
   - Last Name: empty
   - Zip/Postal Code: empty
4. Click "Continue"

**Expected Results:**
- Error message appears for required fields
- User cannot proceed to step 2
- Form validation prevents submission

#### 4.3 Checkout Navigation (Cancel/Back)
**Steps:**
1. Login with standard_user
2. Add items to cart and start checkout
3. Test cancellation at each step:
   - Cancel from checkout step 1
   - Cancel from checkout step 2
4. Verify cart contents are preserved

**Expected Results:**
- Cancel buttons return to cart page
- Cart contents remain unchanged
- Checkout process can be restarted

#### 4.4 Empty Cart Checkout Prevention
**Steps:**
1. Login with standard_user
2. Navigate to cart page (without adding items)
3. Attempt to click checkout

**Expected Results:**
- Checkout button is disabled or unavailable
- User cannot proceed with empty cart
- Appropriate messaging guides user to add items

### 5. Navigation and Menu Functionality

#### 5.1 Hamburger Menu Operations
**Steps:**
1. Login with standard_user
2. Click hamburger menu button
3. Verify menu options:
   - All Items (returns to inventory)
   - About (external link to saucelabs.com)
   - Logout (returns to login page)
   - Reset App State (clears cart and session)
4. Test each menu option
5. Verify menu closes properly

**Expected Results:**
- Menu opens and closes smoothly
- All Items navigation works correctly
- About link opens in new tab/window
- Logout ends session and requires re-authentication
- Reset App State clears all cart contents

#### 5.2 Logout Functionality
**Steps:**
1. Login with standard_user
2. Add items to cart
3. Use hamburger menu to logout
4. Verify redirect to login page
5. Attempt to navigate back to inventory without login

**Expected Results:**
- User is logged out and redirected to login
- Session state is cleared
- Protected pages redirect back to login
- Cart contents are cleared after logout

#### 5.3 Reset App State
**Steps:**
1. Login with standard_user
2. Add multiple items to cart
3. Navigate through various pages
4. Use "Reset App State" from menu
5. Verify application state is reset

**Expected Results:**
- Cart is completely cleared
- User remains logged in
- Product sorting returns to default
- Application returns to initial post-login state

### 6. Cross-Browser and User Type Testing

#### 6.1 Multi-Browser Compatibility
**Steps:**
1. Execute all core scenarios across:
   - Chrome (Chromium)
   - Firefox
   - Safari (WebKit)
2. Verify consistent behavior and UI elements
3. Test responsive design elements

**Expected Results:**
- Consistent functionality across all browsers
- UI elements render correctly
- No browser-specific JavaScript errors
- Performance remains acceptable

#### 6.2 Special User Type Behaviors
**Steps:**
1. Test each special user type:
   - **problem_user**: May have UI/UX issues but should complete workflows
   - **performance_glitch_user**: May be slower but should function
   - **error_user**: May encounter specific errors in certain workflows
   - **visual_user**: May have visual/styling differences
2. Document specific behaviors while maintaining successful completion

**Expected Results:**
- All valid users can complete core workflows
- Specific user quirks are documented and expected
- No users should break application functionality
- Performance variations are within acceptable limits

### 7. Error Handling and Edge Cases

#### 7.1 Network and Connectivity Issues
**Steps:**
1. Simulate slow network conditions
2. Test form submissions with network delays
3. Verify error handling for failed requests

**Expected Results:**
- Application handles network delays gracefully
- Appropriate loading states are shown
- Error messages guide user appropriately

#### 7.2 Data Validation and Boundaries
**Steps:**
1. Test form inputs with boundary values:
   - Very long names (over 100 characters)
   - Special characters in postal codes
   - Numeric values in name fields
2. Test SQL injection and XSS attempts

**Expected Results:**
- Input validation prevents malicious input
- Boundary values are handled appropriately
- Error messages are clear and helpful

#### 7.3 Session and State Management
**Steps:**
1. Test concurrent sessions
2. Test browser refresh during checkout
3. Test back button behavior

**Expected Results:**
- Session state is maintained properly
- Refresh doesn't break application state
- Browser navigation works as expected

## Test Execution Strategy

### Priority Levels
- **P0 (Critical)**: Authentication, core shopping cart, checkout completion
- **P1 (High)**: Product sorting, navigation, user types
- **P2 (Medium)**: Error handling, edge cases, performance
- **P3 (Low)**: Visual validation, cross-browser consistency

### Test Environment Requirements
- **Base URL**: https://www.saucedemo.com/
- **Browsers**: Chrome, Firefox, Safari (via Playwright)
- **Viewport**: 1280x720 (desktop focus)
- **Test Data**: Managed via UserFactory class
- **Reporting**: HTML reports with screenshots on failure

### Continuous Integration
- Parallel execution across browsers (workers: 4)
- Retry logic for flaky tests (retries: 1)
- Trace capture on first retry for debugging
- Video recording on failure for investigation

This comprehensive test plan ensures thorough coverage of the SauceDemo application while building upon the existing Page Object Model structure and workshop learning objectives.