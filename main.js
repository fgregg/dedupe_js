'use strict';

import { affine_gap_distance } from './affinegap.js'
import { start_5_char } from './blocking.js'
import { readFileSync } from 'fs'
import parse from 'csv-parse/lib/sync.js'
import regeneratorRuntime from "regenerator-runtime";
import combinations from '@aureooms/js-itertools/lib/map/combinations.js'

const content = readFileSync('/Users/fgregg/work/dedupe/tests/datasets/restaurant-nophone.csv', )

const records = new Map(parse(content, {columns: true}).entries())

const blocked_records = new Map()
for (let [id, record] of records) {
    let key = start_5_char(record['name'])
    if (blocked_records.has(key)) {
	blocked_records.get(key).push([id, record])
    } else {
	blocked_records.set(key, [[id, record]])
    }
}

for (let block of blocked_records.values()) {
    for (const [[i, record_a], [j, record_b]] of combinations.combinations(block, 2)) {
        console.log(i, j)
	console.log(affine_gap_distance(record_a['name'], record_b['name']))
    }
}

    
