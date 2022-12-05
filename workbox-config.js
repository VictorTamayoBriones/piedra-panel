module.exports = {
	globDirectory: 'src/',
	globPatterns: [
		'**/*.{ts,html,scss,ttf,png,jpg,json,ico,webmanifest}'
	],
	swDest: 'src/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};