#!/usr/bin/env node

/* eslint-disable no-console */

import { env } from '../core/env'
import { genAPI } from '../core/gen-api'
import { setupSpringBootApplication } from '../core/gen-app'

async function main() {
  await setupSpringBootApplication()
  let setup_json_property = env.SETUP_JSON_PROPERTY != 'false'
  if (process.stdin.isTTY) {
    console.error('Reading api from stdin... (Please pipe api text to stdin)')
  }
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
