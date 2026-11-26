import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** TEST-R07: any request leaving the origin fails the test. */
export async function blockExternal(page: Page, external: string[]): Promise<void> {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === 'localhost' || url.protocol === 'data:') return route.continue();
    external.push(url.href);
    return route.abort('blockedbyclient');
  });
}

/** TEST-R04: WCAG 2.2 AA tags; serious and critical violations fail. */
export async function expectNoSeriousAxe(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .exclude('aside[aria-label="Review"]') // the review bar is a review tool, not product UI
    .analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
}
