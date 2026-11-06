const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const { chunkArray, isValidEmail } = require('../dist/index.cjs')
const { useToggle } = require('../dist/react.cjs')

if (!isValidEmail('user@example.com')) {
  throw new Error('Email check failed.')
}
if (chunkArray([1, 2], 1).length !== 2) {
  throw new Error('chunkArray smoke check failed.')
}
if (typeof useToggle !== 'function') {
  throw new Error('The React entry should export useToggle.')
}

const source = readFileSync(join(__dirname, '../dist/index.cjs'), 'utf8')
if (
  source.includes('require("react")') ||
  source.includes("require('react')")
) {
  throw new Error('The core bundle should not require React.')
}

console.log('cjs smoke ok')
