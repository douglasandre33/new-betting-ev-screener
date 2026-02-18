import { test, expect } from '@playwright/test';

test('dashboard renders shell', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: '+EV Dashboard' })).toBeVisible();
  await expect(page.getByText('Fair odds source: Weighted blend')).toBeVisible();
});
