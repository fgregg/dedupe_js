'use strict';

import { affine_gap_distance } from './affinegap.js'
import { start_5_char } from './blocking.js'
import regeneratorRuntime from "regenerator-runtime";
import combinations from '@aureooms/js-itertools/lib/map/combinations.js'

export class Dedupe {
    constructor() {
	this.predicates = [ start_5_char ];
    }

    _blockRecords(records) {
	
	const blocked_records = new Map();
	for (const [id, record] of records) {
	    for (let predicate of this.predicates) {
		let key = predicate(record['name']);
		if (blocked_records.has(key)) {
		    blocked_records.get(key).push([id, record]);
		} else {
		    blocked_records.set(key, [[id, record]]);
		}
	    }
	}
		
	return blocked_records;
    }

    * pairs(records) {

	const blocked_records = this._blockRecords(records)

	for (let a of records) {
	    const [id_a, record_a] = a
	    let B = new Set()
	    for (let predicate of this.predicates) {
		let key = predicate(record_a['name']);
		for (let b of blocked_records.get(key)) {
		    B.add(b);
		}
	    }
	    for (let b of B) {
		if (id_a < b[0]) {
		    yield [a, b]
		}
	    }
	}
    }

    match(records) {
	for (const [[i, record_a], [j, record_b]] of this.pairs(records)) {
	    console.log(affine_gap_distance(record_a['name'],
					    record_b['name']));
	}
    }
}
