import { expect, test } from '@playwright/test'

const CONSENT_KEY = 'qr-pr-analytics-consent'

async function clearConsent (page: import('@playwright/test').Page) {
	await page.goto('/')
	await page.evaluate((key) => {
		window.localStorage.removeItem(key)
	}, CONSENT_KEY)
	await page.reload()
}

test.describe('analytics consent', () => {
	test('does not load Metrika before consent', async ({ page }) => {
		await clearConsent(page)
		await expect(
			page.getByRole('dialog', { name: /Аналитика cookies/i }),
		).toBeVisible()

		const metrikaRequests: string[] = []
		page.on('request', (req) => {
			if (req.url().includes('mc.yandex')) {
				metrikaRequests.push(req.url())
			}
		})

		await page.waitForTimeout(1500)
		expect(metrikaRequests).toHaveLength(0)
		await expect(page.locator('#yandex-metrika')).toHaveCount(0)
	})

	test('loads Metrika only after accept', async ({ page }) => {
		await clearConsent(page)
		const metrikaScript = page.waitForRequest(
			(req) =>
				req.url().includes('mc.yandex.ru/metrika/tag.js') ||
				req.url().includes('mc.yandex.com/metrika/tag.js'),
		)

		await page.getByRole('button', { name: 'Принять' }).click()
		await metrikaScript
		await expect(page.locator('#yandex-metrika')).toHaveCount(1)
		await expect(
			page.getByRole('dialog', { name: /Аналитика cookies/i }),
		).toHaveCount(0)
	})

	test('denial is persisted and blocks script', async ({ page }) => {
		await clearConsent(page)
		await page.getByRole('button', { name: 'Отказаться' }).click()
		await expect(
			page.getByRole('dialog', { name: /Аналитика cookies/i }),
		).toHaveCount(0)

		const stored = await page.evaluate(
			(key) => window.localStorage.getItem(key),
			CONSENT_KEY,
		)
		expect(stored).toBe('denied')

		await page.reload()
		await expect(page.locator('#yandex-metrika')).toHaveCount(0)
		await expect(
			page.getByRole('dialog', { name: /Аналитика cookies/i }),
		).toHaveCount(0)
	})

	test('privacy page can re-enable consent', async ({ page }) => {
		await clearConsent(page)
		await page.getByRole('button', { name: 'Отказаться' }).click()

		await page.goto('/privacy')
		await page.getByRole('button', { name: 'Разрешить аналитику' }).click()

		await expect
			.poll(async () =>
				page.evaluate(
					(key) => window.localStorage.getItem(key),
					CONSENT_KEY,
				),
			)
			.toBe('granted')
		await expect(page.locator('#yandex-metrika')).toHaveCount(1)
	})

	test('contact page shows ForestMusic without placeholders', async ({
		page,
	}) => {
		await page.goto('/contact')
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			'Контакты',
		)
		await expect(
			page.getByRole('link', { name: 'https://forest-music.ru' }),
		).toHaveAttribute('href', 'https://forest-music.ru')
		await expect(page.getByText(/указать/i)).toHaveCount(0)
	})

	test('generator still works with consent banner visible', async ({
		page,
	}) => {
		await clearConsent(page)
		await page.goto('/qr-url')
		await expect(
			page.getByRole('dialog', { name: /Аналитика cookies/i }),
		).toBeVisible()
		await page.locator('#url').fill('https://qr-pr.ru')
		await expect(page.getByText('Готово к скачиванию')).toBeVisible({
			timeout: 10_000,
		})
		await expect(page.locator('.qr-preview svg')).toBeVisible()
	})
})
