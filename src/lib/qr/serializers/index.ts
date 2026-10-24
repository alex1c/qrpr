/**
 * Unified serialization entry for all QR payload types.
 */
import type { QrPayloadMap, QrToolId } from '@/types/qr'
import { serializeEmail } from '@/lib/qr/serializers/email'
import { serializeEvent } from '@/lib/qr/serializers/event'
import { serializeLocation } from '@/lib/qr/serializers/location'
import { serializePhone } from '@/lib/qr/serializers/phone'
import { serializeSms } from '@/lib/qr/serializers/sms'
import { serializeTelegram } from '@/lib/qr/serializers/telegram'
import { serializeText, validateText } from '@/lib/qr/serializers/text'
import { serializeUrl, normalizeUrl } from '@/lib/qr/serializers/url'
import { serializeVCard } from '@/lib/qr/serializers/vcard'
import { serializeWhatsApp } from '@/lib/qr/serializers/whatsapp'
import { serializeWifi } from '@/lib/qr/serializers/wifi'
import { validateEmail } from '@/lib/qr/serializers/email'
import { validateEvent } from '@/lib/qr/serializers/event'
import { validateCoordinates } from '@/lib/qr/serializers/location'
import { validatePhone } from '@/lib/qr/serializers/phone'
import { validateSms } from '@/lib/qr/serializers/sms'
import { validateTelegram } from '@/lib/qr/serializers/telegram'
import { validateVCard } from '@/lib/qr/serializers/vcard'
import { validateWhatsApp } from '@/lib/qr/serializers/whatsapp'
import { validateWifi } from '@/lib/qr/serializers/wifi'

export function serializeQrPayload<T extends QrToolId> (
	type: T,
	payload: QrPayloadMap[T],
): string {
	switch (type) {
		case 'url':
			return serializeUrl((payload as QrPayloadMap['url']).url)
		case 'text':
			return serializeText((payload as QrPayloadMap['text']).text)
		case 'wifi':
			return serializeWifi(payload as QrPayloadMap['wifi'])
		case 'vcard':
			return serializeVCard(payload as QrPayloadMap['vcard'])
		case 'email':
			return serializeEmail(payload as QrPayloadMap['email'])
		case 'phone':
			return serializePhone((payload as QrPayloadMap['phone']).phone)
		case 'sms':
			return serializeSms(payload as QrPayloadMap['sms'])
		case 'telegram':
			return serializeTelegram((payload as QrPayloadMap['telegram']).value)
		case 'whatsapp':
			return serializeWhatsApp(payload as QrPayloadMap['whatsapp'])
		case 'location':
			return serializeLocation(payload as QrPayloadMap['location'])
		case 'event':
			return serializeEvent(payload as QrPayloadMap['event'])
		case 'pdf': {
			const result = normalizeUrl((payload as QrPayloadMap['pdf']).url)
			if (!result.ok) {
				throw new Error(result.error)
			}
			if (!result.value.startsWith('https://')) {
				throw new Error('Для документов нужна публичная HTTPS-ссылка')
			}
			return result.value
		}
		default: {
			const _exhaustive: never = type
			throw new Error(`Unsupported type: ${_exhaustive}`)
		}
	}
}

export function validateQrPayload<T extends QrToolId> (
	type: T,
	payload: QrPayloadMap[T],
): string | null {
	try {
		switch (type) {
			case 'url': {
				const result = normalizeUrl((payload as QrPayloadMap['url']).url)
				return result.ok ? null : result.error
			}
			case 'text':
				return validateText((payload as QrPayloadMap['text']).text)
			case 'wifi':
				return validateWifi(payload as QrPayloadMap['wifi'])
			case 'vcard':
				return validateVCard(payload as QrPayloadMap['vcard'])
			case 'email':
				return validateEmail(payload as QrPayloadMap['email'])
			case 'phone':
				return validatePhone((payload as QrPayloadMap['phone']).phone)
			case 'sms':
				return validateSms(payload as QrPayloadMap['sms'])
			case 'telegram':
				return validateTelegram((payload as QrPayloadMap['telegram']).value)
			case 'whatsapp':
				return validateWhatsApp(payload as QrPayloadMap['whatsapp'])
			case 'location': {
				const loc = payload as QrPayloadMap['location']
				return validateCoordinates(loc.latitude, loc.longitude)
			}
			case 'event':
				return validateEvent(payload as QrPayloadMap['event'])
			case 'pdf': {
				const result = normalizeUrl((payload as QrPayloadMap['pdf']).url)
				if (!result.ok) {
					return result.error
				}
				if (!result.value.startsWith('https://')) {
					return 'Для документов нужна публичная HTTPS-ссылка'
				}
				return null
			}
			default:
				return 'Неизвестный тип'
		}
	} catch (err) {
		return err instanceof Error ? err.message : 'Ошибка валидации'
	}
}

export {
	serializeUrl,
	serializeText,
	serializeWifi,
	serializeVCard,
	serializeEmail,
	serializePhone,
	serializeSms,
	serializeTelegram,
	serializeWhatsApp,
	serializeLocation,
	serializeEvent,
	normalizeUrl,
}
