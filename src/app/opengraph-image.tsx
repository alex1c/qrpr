import { ImageResponse } from 'next/og'

export const alt = 'QR-PR — бесплатный генератор QR-кодов'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage () {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					padding: 80,
					background: 'linear-gradient(135deg, #0b1412 0%, #0d7377 55%, #134e4a 100%)',
					color: '#fff',
					fontFamily: 'sans-serif',
				}}
			>
				<div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>
					QR-PR
				</div>
				<div style={{ marginTop: 24, fontSize: 36, opacity: 0.92, maxWidth: 800 }}>
					Бесплатные QR-коды без регистрации и водяных знаков
				</div>
				<div style={{ marginTop: 40, fontSize: 28, opacity: 0.75 }}>
					qr-pr.ru
				</div>
			</div>
		),
		{ ...size },
	)
}
