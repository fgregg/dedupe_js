'use strict';

import { Dedupe } from './api.js'
import { readFileSync } from 'fs'
import { performance } from 'perf_hooks'
import parse from 'csv-parse/lib/sync.js'

const content = readFileSync('./restaurant-nophone.csv', )

const records = new Map(parse(content, {columns: true}).entries());

const dedupe = new Dedupe()
const t0 = performance.now()
dedupe.match(records)
console.log(`Matching took ${Math.floor(performance.now() - t0)} milliseconds.`)    
