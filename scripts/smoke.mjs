import { readFileSync } from 'node:fs'
import {
  chunkArray,
  clamp,
  isValidEmail,
  sluggifiedString
} from '../dist/index.js'

const root = readFileSync(new URL('../dist/index.js', import.meta.url), 'utf8')
if (root.includes('from "react"') || root.includes("from 'react'")) {
  throw new Error('The core bundle should not import React.')
}

if (!isValidEmail('user@example.com')) throw new Error('Email check failed.')
if (JSON.stringify(chunkArray([1, 2, 3], 2)) !== '[[1,2],[3]]') {
  throw new Error('chunkArray smoke check failed.')
}
if (clamp(12, 0, 10) !== 10) throw new Error('clamp smoke check failed.')
if (sluggifiedString('Hello, World!') !== 'hello-world') {
  throw new Error('sluggifiedString smoke check failed.')
}

const react = await import('../dist/react.js')
if (typeof react.useDebounce !== 'function') {
  throw new Error('The React entry should export useDebounce.')
}

console.log('esm smoke ok')
