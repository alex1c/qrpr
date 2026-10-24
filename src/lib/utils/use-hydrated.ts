'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

/** Keep server-rendered controls inactive until React can handle input. */
export function useHydrated() {
	return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
}
