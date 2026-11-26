// TEST-R03/R04/R07: every matrix cell reached by URL, its landmark asserted, axe clean, no external requests.
import { expect, test } from '@playwright/test';
import { blockExternal, expectNoSeriousAxe } from './helpers';
import { matrix } from './matrix';

for (const cell of matrix) {
  test(`${cell.step} · ${cell.state} · ${cell.role}`, async ({ page }) => {
    const external: string[] = [];
    await blockExternal(page, external);
    await page.goto(`${cell.route}?state=${cell.state}&role=${cell.role}`);
    await expect(page.getByTestId(cell.landmark)).toBeVisible();
    await expectNoSeriousAxe(page);
    expect(external).toEqual([]);
  });
}

test('FL-01.S01 · ready · member · AI off keeps the manual path (AIX-R10)', async ({ page }) => {
  await page.goto('/?state=ready&ai=off');
  await expect(page.getByTestId('ai-suggested')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Book / }).first()).toBeVisible();
});

test('FL-01.S01 · ready · member · a lot of data at 320px reflows (A11Y-R10)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/?state=ready&volume=lots');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
