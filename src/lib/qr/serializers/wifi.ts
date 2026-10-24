/**
 * WIFI: payload serialization for network join QR codes.
 * Format: WIFI:T:<enc>;S:<ssid>;P:<password>;H:<true|false>;;
 */
import { escapeWifiValue } from '@/lib/qr/escape'
import type { WifiPayload } from '@/types/qr'

export function serializeWifi (payload: WifiPayload): string {
	const ssid = payload.ssid
	if (!ssid) {
		throw new Error('Укажите название сети (SSID)')
	}

	const enc = payload.encryption
	const password = enc === 'nopass' ? '' : payload.password

	if (enc !== 'nopass' && !password) {
		throw new Error('Укажите пароль или выберите открытую сеть')
	}

	const parts = [
		`T:${enc}`,
		`S:${escapeWifiValue(ssid)}`,
		`P:${escapeWifiValue(password)}`,
		`H:${payload.hidden ? 'true' : 'false'}`,
	]

	return `WIFI:${parts.join(';')};;`
}

export function validateWifi (payload: WifiPayload): string | null {
	try {
		serializeWifi(payload)
		return null
	} catch (err) {
		return err instanceof Error ? err.message : 'Некорректные данные Wi‑Fi'
	}
}
