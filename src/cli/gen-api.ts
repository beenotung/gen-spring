#!/usr/bin/env node

/* eslint-disable no-console */

import { env } from '../core/env'
import { genAPI } from '../core/gen-api'

function main() {
  let setup_json_property = env.SETUP_JSON_PROPERTY != 'false'
  let text = ''
  process.stdin
    .on('data', chunk => (text += chunk))
    .on('end', () => {
      if (!text) {
        console.error('missing api text from stdin')
        process.exit(1)
      }
      genAPI({ text, setup_json_property })
    })
}

main()
