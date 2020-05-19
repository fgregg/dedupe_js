'use strict';

export { affine_gap_distance }

function affine_gap_distance (string_a,
			      string_b,
			      match_weight = 1,
			      mismatch_weight = 11,
			      gap_weight = 10,
			      space_weight = 7,
			      abbreviation_scale = 0.125) {
    
    if (string_a === string_b && match_weight === Math.min(match_weight,
							   mismatch_weight,
							   gap_weight)) {
	return match_weight * string_a.length
    }

    if (string_a.length < string_b.length) {
	[string_a, string_b] = [string_b, string_a]
    }

    const V_current = new Float32Array(string_a.length + 1)
    const D = new Float32Array(string_a.length + 1)

    let V_previous
    let I
    let M

    for (let j = 1; j <= string_a.length; j++) {
	V_current[j] = gap_weight + space_weight * j
	D[j] = Infinity
    }

    for (let i = 1; i <= string_b.length; i++) {

	V_previous = V_current.slice()
	V_current[0] = gap_weight + space_weight * i
	I = Infinity

	for (let j = 1; j <= string_a.length; j++) {

	    if (j <= string_b.length) {
		I = (Math.min(I, V_current[j - 1] + gap_weight)
		     + space_weight)
	    } else {
		I = (Math.min(I, V_current[j - 1]
			      + gap_weight * abbreviation_scale)
		     + space_weight * abbreviation_scale)
	    }

	    D[j] = Math.min(D[j], V_previous[j] + gap_weight) + space_weight

	    if (string_a[j - 1] === string_b[i - 1]) {
		M = V_previous[j - 1] + match_weight
	    } else {
		M = V_previous[j - 1] + mismatch_weight
	    }

	    V_current[j] = Math.min(I, D[j], M)

	}
    }

    return V_current[string_a.length]
}
	    
