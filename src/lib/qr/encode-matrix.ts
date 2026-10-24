/**
 * Encode payload string into a QR boolean matrix via uqr.
 */
import { encode, QrCodeDataType } from 'uqr'
import type { ErrorCorrectionLevel } from '@/types/qr'

export interface EncodedMatrix {
	size: number
	version: number
	data: boolean[][]
	types: QrCodeDataType[][]
}

export function encodeMatrix (
	value: string,
	options: {
		errorCorrection?: ErrorCorrectionLevel
		margin?: number
	} = {},
): EncodedMatrix {
	const result = encode(value, {
		ecc: options.errorCorrection ?? 'M',
		border: options.margin ?? 4,
		boostEcc: Boolean(options.errorCorrection === undefined),
	})

	return {
		size: result.size,
		version: result.version,
		data: result.data,
		types: result.types,
	}
}

export { QrCodeDataType }
