/**
 * Empty payload factories for each QR tool type.
 */
import type { QrPayloadMap, QrToolId } from '@/types/qr'

export function emptyPayload (type: QrToolId): QrPayloadMap[QrToolId] {
	switch (type) {
		case 'url':
			return { url: '' }
		case 'text':
			return { text: '' }
		case 'wifi':
			return { ssid: '', password: '', encryption: 'WPA', hidden: false }
		case 'vcard':
			return {
				firstName: '',
				lastName: '',
				organization: '',
				title: '',
				phone: '',
				email: '',
				url: '',
				address: '',
			}
		case 'email':
			return { address: '', subject: '', body: '' }
		case 'phone':
			return { phone: '' }
		case 'sms':
			return { phone: '', message: '' }
		case 'telegram':
			return { value: '' }
		case 'whatsapp':
			return { phone: '', message: '' }
		case 'location':
			return { latitude: 55.7558, longitude: 37.6173 }
		case 'event':
			return { title: '', start: '', end: '', description: '', location: '' }
		case 'pdf':
			return { url: '' }
		default: {
			const _exhaustive: never = type
			return _exhaustive
		}
	}
}
