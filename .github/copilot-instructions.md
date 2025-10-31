# Playwright Workshop Copilot Instructions

## Project Overview
This is a Playwright TypeScript workshop focusing on **Page Object Model** patterns for web automation testing. The project targets two main testing sites: `the-internet.herokuapp.com` for basic login tests and `saucedemo.com` for e-commerce cart functionality.

## Architecture Patterns

### Page Object Model Structure
- All page objects extend `BasicPage` class which provides common `goto()` functionality
- Page objects are stored in `tests/pageobjects/` directory
- Each page object defines its URL in the constructor: `super(page, '/inventory.html')`
- Locators are declared as `readonly` class properties for consistency

**Example Pattern:**
```typescript
export class LoginPage extends BasicPage {
    readonly usernameInput: Locator;
    
    constructor(page: Page) {
        super(page, '/');
        this.usernameInput = this.page.locator('#user-name');
    }
}
```

### Test Organization
- Workshop exercises: `tests/exercises/` - skeleton files for students to complete
- Smoke tests: `tests/smoke/` - working examples 
- Page objects: `tests/pageobjects/` - reusable page components

## Key Development Workflows

### Test Execution Commands
- `npm test` - Headless cross-browser testing (Chrome, Firefox, Safari)
- `npm run test:ui` - Interactive Playwright UI mode for debugging
- `npm run test:headed` - Visual browser execution
- `npm run test:debug` - Debug mode with PWDEBUG=1
- `npm report` - View HTML test reports

### Workshop-Specific Patterns
- Base URL is configurable via `playwright.config.ts` but workshop uses explicit URLs
- Tests should focus on Page Object Model implementation over complex assertions
- Workshop exercises use TODO comments to guide implementation
- Screenshots/videos only captured on failures to reduce noise

## Project-Specific Conventions

### Locator Strategies
- Prefer data-test attributes: `[data-test="shopping-cart-badge"]`
- ID selectors for form inputs: `#user-name`, `#password`
- Class-based selectors for lists: `.inventory_item`, `.cart_item`
- Use `nth()` for selecting specific items from lists

### Page Object Inheritance
- All pages extend `BasicPage` which handles navigation
- Constructor pattern: `super(page, relativeUrl)`
- Action methods return promises (implicit async/await)
- Locators exposed as public readonly properties

### Testing Focus Areas
1. **Login workflows** - Username/password authentication patterns
2. **E-commerce cart operations** - Add/remove items, quantity verification
3. **Multi-step workflows** - Login → Browse → Add to Cart → Checkout
4. **Cross-browser compatibility** - All tests run on Chrome, Firefox, Safari

## Critical Files
- `playwright.config.ts` - Cross-browser setup, failure artifacts configuration
- `tests/pageobjects/basicPage.ts` - Base class pattern for all page objects
- `tests/exercises/00-first-test.spec.ts` - Student template with TODO structure
- `package.json` - Workshop-optimized scripts for different test execution modes

When creating new tests, follow the Page Object Model pattern and add corresponding page objects to `tests/pageobjects/`. Focus on practical web automation scenarios rather than complex assertions.