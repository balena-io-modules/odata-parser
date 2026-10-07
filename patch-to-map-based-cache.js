// This applies a patch to convert the results cache to use a Map instead of an object,
// with ~1.9x performance improvement, increasing with longer URLs.
// See: https://github.com/peggyjs/peggy/pull/663

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const targetPath = path.join(__dirname, 'odata-parser.js');

const source = fs.readFileSync(targetPath, 'utf8');

const replacements = [
	{
		from: /const cached = peg\$resultsCache\[key];/g,
		to: 'const cached = peg$resultsCache.get(key);',
	},
	{
		from: /peg\$resultsCache\[key] = { nextPos: peg\$currPos, result: ([a-zA-Z0-9_]+) };/g,
		to: 'peg$resultsCache.set(key, { nextPos: peg$currPos, result: $1 });',
	},
	{
		from: /let peg\$resultsCache = {};/g,
		to: 'let peg$resultsCache = new Map();',
	},
];

let updated = source;
for (const { from, to } of replacements) {
	if (!from.test(updated)) {
		throw new Error(`Expected to find: ${from}`);
	}

	updated = updated.replaceAll(from, to);
}

fs.writeFileSync(targetPath, updated);
