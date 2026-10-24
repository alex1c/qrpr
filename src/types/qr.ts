/**
 * Shared QR domain types for serializers, styling, and UI.
 */

export type QrToolId =
	| 'url'
	| 'text'
	| 'wifi'
	| 'vcard'
	| 'email'
	| 'phone'
	| 'sms'
	| 'telegram'
	| 'whatsapp'
	| 'location'
	| 'event'
	| 'pdf'

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export type DotStyle = 'square' | 'rounded' | 'dots'
export type EyeStyle = 'square' | 'rounded' | 'leaf'

export type StylePresetId =
	| 'classic'
	| 'business'
	| 'minimal'
	| 'colorful'
	| 'contrast'

export interface QrStyleOptions {
	fgColor: string
	bgColor: string
	/** Transparent background for PNG/SVG when true. */
	transparentBackground: boolean
	size: number
	/** Quiet zone in modules (QR border). */
	margin: number
	errorCorrection: ErrorCorrectionLevel
	dotStyle: DotStyle
	eyeStyle: EyeStyle
	/** Data URL or object URL of centered logo. */
	logoDataUrl: string | null
	/** Logo size as fraction of QR width (0.1–0.28 recommended). */
	logoSizeRatio: number
}

export interface WifiPayload {
	ssid: string
	password: string
	encryption: 'WPA' | 'WEP' | 'nopass'
	hidden: boolean
}

export interface VCardPayload {
	firstName: string
	lastName: string
	organization: string
	title: string
	phone: string
	email: string
	url: string
	address: string
}

export interface EmailPayload {
	address: string
	subject: string
	body: string
}

export interface SmsPayload {
	phone: string
	message: string
}

export interface WhatsAppPayload {
	phone: string
	message: string
}

export interface LocationPayload {
	latitude: number
	longitude: number
}

export interface EventPayload {
	title: string
	start: string
	end: string
	description: string
	location: string
}

export type QrPayloadMap = {
	url: { url: string }
	text: { text: string }
	wifi: WifiPayload
	vcard: VCardPayload
	email: EmailPayload
	phone: { phone: string }
	sms: SmsPayload
	telegram: { value: string }
	whatsapp: WhatsAppPayload
	location: LocationPayload
	event: EventPayload
	pdf: { url: string }
}

export type DetectedContentType =
	| 'url'
	| 'wifi'
	| 'vcard'
	| 'email'
	| 'phone'
	| 'sms'
	| 'geo'
	| 'event'
	| 'text'
	| 'unknown'

export interface DecodeResult {
	raw: string
	type: DetectedContentType
}
