import { expect, test } from '@playwright/test'
import fs from 'node:fs/promises'
test.setTimeout(120_000)
const runtimeErrors = new WeakMap<object, string[]>()
test.beforeEach(({ page }) => {
 const errors: string[] = []
 runtimeErrors.set(page, errors)
 page.on('pageerror', error => errors.push(error.message))
})
test.afterEach(({ page }) => {
 expect(runtimeErrors.get(page)).toEqual([])
})


for (const width of [320, 375, 768, 1024, 1440]) {
	for (const theme of ['light', 'dark']) {
		test(`layout ${width} ${theme}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 })
			await page.addInitScript(
				(theme) => localStorage.setItem('qr-pr-theme', theme),
				theme,
			)
			for (const route of ['/', '/qr-wifi', '/scan', '/qr-with-logo']) {
				await page.goto(route)
				await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth + 1,
					),
				).toBe(true)
			}
		})
	}
}
test('exports every PNG size, SVG and vector PDF', async ({ page }, info) => {
	await page.goto('/qr-url')
	await page.locator('#url').fill('https://example.com/audit')
	await expect(page.locator('.qr-preview svg')).toBeVisible()
	for (const size of [256, 512, 1024, 2048]) {
		await page.locator('#png-size').selectOption(String(size))
		const downloading = page.waitForEvent('download')
		await page.getByRole('button', { name: 'Скачать PNG', exact: true }).click()
		const download = await downloading
		const file = info.outputPath(`${size}.png`)
		await download.saveAs(file)
		const buffer = await fs.readFile(file)
		expect(buffer.readUInt32BE(16)).toBe(size)
		expect(buffer.readUInt32BE(20)).toBe(size)
		await page.goto('/scan')
		await page.locator('input[type=file]').setInputFiles(file)
		await expect(page.getByText('QR распознан', { exact: true })).toBeVisible()
		await page.goto('/qr-url')
		await page.locator('#url').fill('https://example.com/audit')
	}
	for (const format of ['SVG', 'PDF']) {
		const downloading = page.waitForEvent('download')
		await page.getByRole('button', { name: format, exact: true }).click()
		const download = await downloading
		const file = info.outputPath(`export.${format.toLowerCase()}`)
		await download.saveAs(file)
		const data = await fs.readFile(file, 'latin1')
		if (format === 'SVG') {
			expect(data).toContain('<path')
			expect(data).not.toContain('<image')
		} else {
			expect(data).toContain('%PDF-')
			expect(data).not.toContain('/Subtype /Image')
		}
	}
})

test('scanner rejects corrupt file and unsupported SVG; retries same file', async ({
	page,
}) => {
	await page.goto('/scan')
	const input = page.locator('input[type=file]')
	for (let i = 0; i < 2; i++) {
		await input.setInputFiles({
			name: 'bad.png',
			mimeType: 'image/png',
			buffer: Buffer.from('broken'),
		})
		await expect(page.locator('main [role=alert]')).toContainText(
			'Не удалось прочитать',
		)
	}
	await input.setInputFiles({
		name: 'bad.svg',
		mimeType: 'image/svg+xml',
		buffer: Buffer.from('<svg/>'),
	})
	await expect(page.locator('main [role=alert]')).toContainText(
		'Поддерживаются',
	)
 await input.setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer: Buffer.alloc(8 * 1024 * 1024 + 1) })
 await expect(page.locator('main [role=alert]')).toContainText('Файл слишком большой')

})

test('camera permission error is recoverable', async ({ page }) => {
	await page.addInitScript(() => {
		navigator.mediaDevices.getUserMedia = async () => {
			throw new DOMException('denied', 'NotAllowedError')
		}
	})
	await page.goto('/scan')
	await page.getByRole('button', { name: 'Сканировать камерой' }).click()
	await expect(page.locator('main [role=alert]')).toContainText('Нет доступа')
	await expect(
		page.getByRole('button', { name: 'Сканировать камерой' }),
	).toBeEnabled()
})

test('camera track stops on stop and late permission after unmount', async ({
	page,
}) => {
	// Use a real canvas capture track: its stop method is observable.
	await page.addInitScript(() => {
		const state = window as unknown as { stopped: number; release: () => void }
		state.stopped = 0
		navigator.mediaDevices.getUserMedia = () =>
			new Promise<MediaStream>((resolve) => {
				state.release = () => {
					const canvas = document.createElement('canvas')
					canvas.width = 320
					canvas.height = 240
					const stream = canvas.captureStream(5)
					for (const track of stream.getTracks()) {
						const stop = track.stop.bind(track)
						track.stop = () => {
							state.stopped++
							stop()
						}
					}
					resolve(stream)
				}
			})
	})
	await page.goto('/scan')
	await page.getByRole('button', { name: 'Сканировать камерой' }).click()
	await page.evaluate(() =>
		(window as unknown as { release: () => void }).release(),
	)
	await expect(
		page.getByRole('button', { name: 'Остановить камеру' }),
	).toBeVisible()
	await page.getByRole('button', { name: 'Остановить камеру' }).click()
	expect(
		await page.evaluate(
			() => (window as unknown as { stopped: number }).stopped,
		),
	).toBe(1)
	await page.getByRole('button', { name: 'Сканировать камерой' }).click()
	await page.locator('header a[href="/"]').first().click()
	await page.evaluate(() =>
		(window as unknown as { release: () => void }).release(),
	)
	await expect
		.poll(() =>
			page.evaluate(() => (window as unknown as { stopped: number }).stopped),
		)
		.toBe(2)
})

test('all indexable routes expose unique SEO and content in server HTML', async ({
	request,
}, info) => {
	const sitemap = await request.get('/sitemap.xml')
	expect(sitemap.ok()).toBe(true)
	const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
		(m) => m[1],
	)
	const titles = new Set<string>()
	const descriptions = new Set<string>()
	const evidence = []
	for (const url of urls) {
		const path = new URL(url).pathname
		const response = await request.get(path)
		expect(response.ok(), path).toBe(true)
		const html = await response.text()
		const title = html.match(/<title>(.*?)<\/title>/)?.[1]
		const description = html.match(
			/<meta name="description" content="([^"]+)"/,
		)?.[1]
		expect(title, path).toBeTruthy()
		expect(titles.has(title!), path).toBe(false)
		titles.add(title!)
		expect(description, path).toBeTruthy()
		expect(descriptions.has(description!), path).toBe(false)
		descriptions.add(description!)
		expect((html.match(/<h1\b/g) || []).length, path).toBe(1)
		expect(html, path).toContain(`rel="canonical" href="${url}"`)
		expect(html, path).toContain('property="og:title"')
		expect(html, path).toContain('name="robots" content="index, follow"')
		expect(html, path).toContain('application/ld+json')
		expect(html, path).toContain('href="/generator"')
		evidence.push({ path, title, description, status: response.status() })
	}
	await fs.writeFile(
		info.outputPath('seo.json'),
		JSON.stringify(evidence, null, 2),
	)
	const robots = await request.get('/robots.txt')
	expect(await robots.text()).toContain('Sitemap: https://qr-pr.ru/sitemap.xml')
	const response = await request.get('/')
	expect(response.headers()['x-content-type-options']).toBe('nosniff')
	expect(response.headers()['content-security-policy']).toContain(
		"object-src 'none'",
	)
})

test('scanner JPEG/WebP, paste, drop and malicious text stay local', async ({
	page,
}) => {
	await page.goto('/qr-text')
	await page.locator('textarea').first().fill('javascript:alert(1)')
	await expect(page.locator('.qr-preview svg')).toBeVisible()
	const images = await page.locator('.qr-preview svg').evaluate(async (svg) => {
		const image = new Image()
		image.src =
			'data:image/svg+xml;base64,' +
			btoa(new XMLSerializer().serializeToString(svg))
		await image.decode()
		const canvas = document.createElement('canvas')
		canvas.width = 512
		canvas.height = 512
		const ctx = canvas.getContext('2d')!
		ctx.fillStyle = 'white'
		ctx.fillRect(0, 0, 512, 512)
		ctx.drawImage(image, 0, 0, 512, 512)
		return ['image/jpeg', 'image/webp'].map((type) => ({
			type,
			data: canvas.toDataURL(type).split(',')[1],
		}))
	})
	await page.goto('/scan')
	for (const image of images) {
		await page
			.locator('input[type=file]')
			.setInputFiles({
				name: 'test.' + image.type.split('/')[1],
				mimeType: image.type,
				buffer: Buffer.from(image.data, 'base64'),
			})
		await expect(page.getByText('QR распознан', { exact: true })).toBeVisible()
		await expect(
			page.getByRole('link', { name: 'Открыть ссылку' }),
		).toHaveCount(0)
	}
	for (const action of ['paste', 'drop']) {
		await page.goto('/scan')
		await page.getByRole('button', { name: 'Выбрать файл' }).evaluate(
			(button, { image, action }) => {
				const bytes = Uint8Array.from(atob(image.data), (c) => c.charCodeAt(0))
				const transfer = new DataTransfer()
				transfer.items.add(new File([bytes], 'qr.webp', { type: image.type }))
				if (action === 'paste')
					button.dispatchEvent(
						new ClipboardEvent('paste', {
							clipboardData: transfer,
							bubbles: true,
						}),
					)
				else
					button.dispatchEvent(
						new DragEvent('drop', { dataTransfer: transfer, bubbles: true }),
					)
			},
			{ image: images[1], action },
		)
		await expect(page.getByText('QR распознан', { exact: true })).toBeVisible()
	}
})

import jsQR from 'jsqr'
test('styled preview decodes for every module and eye style, ECC and transparency', async ({
	page,
}, info) => {
	await page.goto('/qr-url')
	await page.locator('#url').fill('https://example.com/styles')
	await page.getByRole('button', { name: /Оформление/ }).click()
	for (const dot of ['square', 'rounded', 'dots']) {
		await page.locator('#dots').selectOption(dot)
		for (const eye of ['square', 'rounded', 'leaf']) {
			await page.locator('#eyes').selectOption(eye)
			const bitmap = await page
				.locator('.qr-preview svg')
				.evaluate(async (svg) => {
					const image = new Image()
					image.src =
						'data:image/svg+xml;base64,' +
						btoa(new XMLSerializer().serializeToString(svg))
					await image.decode()
					const canvas = document.createElement('canvas')
					canvas.width = 512
					canvas.height = 512
					const ctx = canvas.getContext('2d')!
					ctx.fillStyle = 'white'
					ctx.fillRect(0, 0, 512, 512)
					ctx.drawImage(image, 0, 0, 512, 512)
					const bytes = ctx.getImageData(0, 0, 512, 512).data
					let binary = ''
					for (let offset = 0; offset < bytes.length; offset += 8192)
						binary += String.fromCharCode(
							...bytes.subarray(offset, offset + 8192),
						)
					return btoa(binary)
				})
			expect(
				jsQR(new Uint8ClampedArray(Buffer.from(bitmap, 'base64')), 512, 512)
					?.data,
				`${dot}/${eye}`,
			).toBe('https://example.com/styles')
		}
	}
	for (const ecc of ['L', 'M', 'Q', 'H']) {
		await page.locator('#ecc').selectOption(ecc)
		await expect(page.locator('.qr-preview svg')).toBeVisible()
	}
	await page.getByLabel('Прозрачный фон (PNG/SVG)').check()
	expect(await page.locator('.qr-preview svg').innerHTML()).not.toContain(
		'fill="#ffffff"',
	)
	await page.screenshot({ path: info.outputPath('styled.png'), fullPage: true })
})

test('SVG logo is rasterized without executing scripts; keyboard navigation works', async ({
	page,
}) => {
	const unexpected: string[] = []
	page.on('request', (request) => {
		if (request.url().includes('audit-external')) unexpected.push(request.url())
	})
	await page.goto('/qr-with-logo')
	await page.locator('#url').fill('https://example.com/logo')
	await page
		.locator('#logo')
		.setInputFiles({
			name: 'logo.svg',
			mimeType: 'image/svg+xml',
			buffer: Buffer.from(
				'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" onload="window.auditInjected=true"><script>window.auditInjected=true</script><image href="https://example.com/audit-external"/><rect width="200" height="100" fill="red"/></svg>',
			),
		})
	await expect(page.locator('.qr-preview image')).toHaveAttribute(
		'href',
		/^data:image\/png;base64,/,
	)
	expect(
		await page.evaluate(
			() => (window as unknown as { auditInjected?: boolean }).auditInjected,
		),
	).toBeUndefined()
	expect(unexpected).toEqual([])
	await expect(page.locator('#ecc')).toHaveValue('H')
	await page.goto('/')
	await page.keyboard.press('Tab')
	await expect(
		page.getByRole('link', { name: 'Перейти к содержимому' }),
	).toBeFocused()
	await page.keyboard.press('Enter')
	expect(new URL(page.url()).hash).toBe('#main')
})
