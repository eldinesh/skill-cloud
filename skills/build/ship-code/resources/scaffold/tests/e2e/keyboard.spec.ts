// TEST-R05 / A11Y-R14–R15: keyboard-only path and focus landing.
import { expect, test } from '@playwright/test';

test('FL-01 · keyboard: focus lands on the h1 on entry', async ({ page }) => {
  await page.goto('/?state=ready&review=off');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('FL-01 · keyboard: skip link is first, reaches main, and the suggestion is bookable by keyboard', async ({ page }) => {
  await page.goto('/?state=ready&review=off');
  // Focus starts on the h1 (A11Y-R14). Walk back through the header in order: every stop asserted.
  for (const name of ['Help', 'My bookings', 'Book', 'Skip to main content']) {
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('link', { name, exact: true })).toBeFocused();
  }
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.keyboard.press('Tab');
  const book = page.getByTestId('ai-suggested').getByRole('button', { name: 'Book Juniper' });
  await expect(book).toBeFocused();
});
