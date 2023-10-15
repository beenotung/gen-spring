#!/usr/bin/env node

/* eslint-disable no-console */

import { genAPI } from '../core/gen-api'

function main() {
  let text = ''
  process.stdin
    .on('data', chunk => (text += chunk))
    .on('end', () => {
      if (!text) {
        console.error('missing api text from stdin')
        process.exit(1)
      }
      genAPI(text)
    })
}

main()
