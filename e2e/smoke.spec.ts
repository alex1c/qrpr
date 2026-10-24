import { expect, test } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

test.describe('QR-PR smoke', () => {
	test('home shows generator and creates URL QR', async ({ page }) => {
		await page.goto('/')
		await expect(page.getByRole('heading', { level: 1 })).toContainText(/QR-код/i)
		const urlInput = page.locator('#url')
		await urlInput.fill('https://qr-pr.ru')
		await expect(page.getByText('Готово к скачиванию')).toBeVisible({
			timeout: 10_000,
		})
		await expect(page.locator('.qr-preview svg')).toBeVisible()
	})

	test('download PNG works', async ({ page }) => {
		await page.goto('/qr-url')
		await page.locator('#url').fill('https://example.com/png')
		await expect(page.getByText('Готово к скачиванию')).toBeVisible({
			timeout: 10_000,
		})
		const downloadPromise = page.waitForEvent('download')
		await page.getByRole('button', { name: 'Скачать PNG' }).click()
		const download = await downloadPromise
		expect(download.suggestedFilename()).toMatch(/qr-pr-url-.*\.png/)
	})

	test('wifi and vcard flows', async ({ page }) => {
		await page.goto('/qr-wifi')
		await page.locator('#ssid').fill('GuestWiFi')
		await page.locator('#wifi-pass').fill('secret123')
		await expect(page.getByText('Готово к скачиванию')).toBeVisible({
			timeout: 10_000,
		})

		await page.goto('/qr-vcard')
		await page.locator('#fn').fill('Иван')
		await page.locator('#ln').fill('Тестов')
		await expect(page.getByText('Готово к скачиванию')).toBeVisible({
			timeout: 10_000,
		})
	})

	test('theme toggle', async ({ page }) => {
		await page.goto('/')
		const html = page.locator('html')
		await page.getByRole('button', { name: /тему/i }).click()
		await expect(html).toHaveClass(/dark|light/)
	})

	test('scanner recognizes generated QR image', async ({ page }, testInfo) => {
		const payload = 'https://qr-pr.ru/scan-test'
		await page.goto('/qr-url')
		await page.locator('#url').fill(payload)
		await expect(page.getByText('Готово к скачиванию')).toBeVisible({
			timeout: 10_000,
		})

		const filePath = path.join(testInfo.outputDir, 'sample-qr.png')
		fs.mkdirSync(testInfo.outputDir, { recursive: true })
		await page.locator('.qr-preview svg').screenshot({ path: filePath })

		await page.goto('/scan')
		await page.locator('input[type="file"]').setInputFiles(filePath)
		await expect(page.getByText('QR распознан')).toBeVisible({ timeout: 15_000 })
		await expect(page.getByText(payload)).toBeVisible()
	})

	test('mobile viewport home', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 })
		await page.goto('/')
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth > window.innerWidth + 1,
		)
		expect(overflow).toBe(false)
	})
})
