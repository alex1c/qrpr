/**
 * Copy public/ and .next/static into the standalone output so `npm start` works.
 * Mirrors the Docker runner stage layout.
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const standalone = join(root, '.next', 'standalone')

if (!existsSync(standalone)) {
	console.warn('Standalone output missing — skip prepare-standalone')
	process.exit(0)
}

const publicDir = join(root, 'public')
if (existsSync(publicDir)) {
	cpSync(publicDir, join(standalone, 'public'), { recursive: true })
}

const staticDir = join(root, '.next', 'static')
const targetStatic = join(standalone, '.next', 'static')
mkdirSync(join(standalone, '.next'), { recursive: true })
cpSync(staticDir, targetStatic, { recursive: true })

console.log('Standalone assets prepared')
