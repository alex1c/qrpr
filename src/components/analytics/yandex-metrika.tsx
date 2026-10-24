'use client'

/**
 * Yandex Metrika loader — mounts only when analytics consent is granted.
 * - Initial pageview: counted once by ym('init')
 * - Client navigations: ym('hit') with query/hash stripped
 * - No form / content params; no QR payload events
 */
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useSyncExternalStore } from 'react'
import {
	YANDEX_METRIKA_ID,
	YANDEX_METRIKA_OPTIONS,
} from '@/config/analytics'
import {
	getAnalyticsConsentServerSnapshot,
	getAnalyticsConsentSnapshot,
	subscribeAnalyticsConsent,
} from '@/lib/analytics/consent-store'
import { buildAnalyticsHitUrl } from '@/lib/analytics/metrika-url'

declare global {
	interface Window {
		ym?: (
			id: number,
			method: string,
			...args: unknown[]
		) => void
		__qrPrMetrikaInitialized?: boolean
	}
}

export function YandexMetrika () {
	const consent = useSyncExternalStore(
		subscribeAnalyticsConsent,
		getAnalyticsConsentSnapshot,
		getAnalyticsConsentServerSnapshot,
	)
	const pathname = usePathname()
	const previousPathRef = useRef<string | null>(null)
	/** After init(), the current path is already counted — wait for the next change. */
	const awaitingFirstClientNavRef = useRef(true)

	useEffect(() => {
		if (consent !== 'granted') {
			previousPathRef.current = null
			// After revoke, the next grant may reuse an already-loaded tag.js.
			// If Metrika was initialized earlier, we must not skip the next hit
			// as if a fresh init() pageview just happened.
			awaitingFirstClientNavRef.current = !window.__qrPrMetrikaInitialized
		}
	}, [consent])

	useEffect(() => {
		if (consent !== 'granted' || !pathname) {
			return
		}

		const sendHitIfNeeded = (): boolean => {
			if (typeof window.ym !== 'function') {
				return false
			}

			if (awaitingFirstClientNavRef.current) {
				// Bind to the path that init() already reported; do not hit again.
				awaitingFirstClientNavRef.current = false
				previousPathRef.current = pathname
				return true
			}

			if (previousPathRef.current === pathname) {
				return true
			}

			previousPathRef.current = pathname
			const hitUrl = buildAnalyticsHitUrl(window.location.origin, pathname)
			window.ym(YANDEX_METRIKA_ID, 'hit', hitUrl, {
				title: document.title,
			})
			return true
		}

		if (sendHitIfNeeded()) {
			return
		}

		const timer = window.setInterval(() => {
			if (sendHitIfNeeded()) {
				window.clearInterval(timer)
			}
		}, 50)

		return () => {
			window.clearInterval(timer)
		}
	}, [consent, pathname])

	if (consent !== 'granted') {
		return null
	}

	const optionsJson = JSON.stringify(YANDEX_METRIKA_OPTIONS)
	const bootstrap = `
(function(){
  if (window.__qrPrMetrikaInitialized) { return; }
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) { return; }
    }
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(${YANDEX_METRIKA_ID}, "init", ${optionsJson});
  window.__qrPrMetrikaInitialized = true;
})();
`

	return (
		<Script
			id="yandex-metrika"
			strategy="afterInteractive"
			dangerouslySetInnerHTML={{ __html: bootstrap }}
		/>
	)
}
