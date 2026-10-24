/**
 * Geo / map link serialization for location QR codes.
 */
import type { LocationPayload } from '@/types/qr'

export function validateCoordinates (
	latitude: number,
	longitude: number,
): string | null {
	if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
		return 'Укажите числовые координаты'
	}
	if (latitude < -90 || latitude > 90) {
		return 'Широта должна быть в диапазоне −90…90'
	}
	if (longitude < -180 || longitude > 180) {
		return 'Долгота должна быть в диапазоне −180…180'
	}
	return null
}

/**
 * Use OpenStreetMap link — open, stable, no API key.
 * Also commonly understood by map apps when opened in a browser.
 */
export function serializeLocation (payload: LocationPayload): string {
	const error = validateCoordinates(payload.latitude, payload.longitude)
	if (error) {
		throw new Error(error)
	}
	const lat = payload.latitude
	const lon = payload.longitude
	return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`
}
