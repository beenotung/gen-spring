#!/usr/bin/env node

import { env } from '../db/env'
import { textToSpring } from '../db/text-to-spring'
import { detectDBClient } from '../utils/cli'

/* eslint-disable no-console */

function main() {
  let text = ''
  process.stdin
    .on('data', chunk => (text += chunk))
    .on('end', () => {
      if (!text) {
        console.error('missing api text from stdin')
        process.exit(1)
      }
      textToSpring(dbClient, text)
    })
}

main()
