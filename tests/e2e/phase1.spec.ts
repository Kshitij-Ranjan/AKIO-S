import { test, expect } from '@playwright/test';

const viewports = [
  { width: 1920, height: 1080, name: 'desktop-1920' },
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 1280, height: 800, name: 'desktop-1280' },
  { width: 1024, height: 768, name: 'tablet-1024' },
  { width: 768, height: 1024, name: 'tablet-768' },
  { width: 428, height: 926, name: 'mobile-428' },
  { width: 390, height: 844, name: 'mobile-390' },
  { width: 375, height: 812, name: 'mobile-375' },
];

test.describe('Phase 1 Verification', () => {
  let errors: string[] = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', error => {
      errors.push(error.message);
    });
  });

  for (const vp of viewports) {
    test(`Viewport ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:3000');
      
      // Check for hydration errors and console errors
      expect(errors.length).toBe(0);

      // Check hero visibility
      await expect(page.locator('text="AKIO\'S"').first()).toBeVisible();
      
      // Check navigation
      if (vp.width >= 768) {
        await expect(page.locator('nav').filter({ hasText: 'Work' }).locator('visible=true')).toBeVisible();
      } else {
        const menuBtn = page.locator('button', { hasText: /Menu/i });
        await expect(menuBtn).toBeVisible();
        await menuBtn.click();
        await expect(page.locator('button', { hasText: /Close/i })).toBeVisible();
        await expect(page.locator('nav').filter({ hasText: 'Work' }).locator('visible=true')).toBeVisible();
        await page.locator('button', { hasText: /Close/i }).click();
      }

      // Check footer
      await expect(page.locator('footer')).toBeVisible();

      // Check for horizontal scroll (overflow)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width);
    });
  }
});
