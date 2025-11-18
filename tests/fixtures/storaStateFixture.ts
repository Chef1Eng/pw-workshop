import { test as base } from '@playwright/test';

type WorkerFixtures = {
  storageState: string;
};

export const test = base.extend<{}, WorkerFixtures>({
  // Define a fixture named "storageState".
  // It produces a path to a saved auth state file that tests can reuse.
  storageState: [
    async ({ browser }, use) => {
      // 1) Create an ISOLATED browser context.
      //    Why newContext? Storage state (cookies/localStorage) is tied to a specific context.
      //    We must not pollute Playwright's default context, and we want a clean, reproducible login.
      const context = await browser.newContext();

      // 2) Open a fresh page in that context (still isolated from other tests/contexts).
      const page = await context.newPage();

      // 3) Navigate to the app under test.
      await page.goto('https://www.saucedemo.com/');

      // 4) Perform the real login steps (this seeds the context with cookies/localStorage).
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      await page.click('#login-button');
      // 5) Persist the authenticated storage to disk.
      //    This captures cookies/localStorage for the CURRENT CONTEXT and saves them
      //    so other tests/contexts can start already logged in via `storageState`.
      await context.storageState({ path: 'storageState.json' });

      // 6) Hand the produced value to the consumer of this fixture.
      //    Here we pass the FILE PATH. Tests (or other fixtures) can use it in their own newContext:
      //    `browser.newContext({ storageState: 'storageState.json' })`.
      await use('storageState.json');

      // 7) Cleanup: close the temporary context we used to create the state.
      //    Why close? Avoid leaking resources and keep tests isolated/deterministic.
      await context.close();
    },

    // 8) Scope: 'worker' means this fixture runs ONCE per worker process,
    //    not per test. That way we generate the storage file once and reuse it
    //    across many tests executed by the same worker.
    { scope: 'worker' },
  ],
});
