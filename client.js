// const [
// 	IGNORE_NODE,
// 	IGNORE_FILE_NAME,
// 	min_c_re,
// 	min_c_im,
// 	max_c_re,
// 	max_c_im,
// 	max_n,
// 	x,
// 	y,
// 	divisions,
// 	...list_of_servers
// ] = process.argv
const fs = require('fs')

const [width, height] = [1000, 1000]

const matrix = new Array(height)
	.fill(0)
	.map(() => new Array(width).fill([0, 0, 0]))

function calculatePixel(x, y) {
	var i = 0
	var cx = -2 + x / (width / 4)
	var cy = -2 + y / (height / 4)
	var zx = 0
	var zy = 0

	do {
		var xt = zx * zy
		zx = zx * zx - zy * zy + cx
		zy = 2 * xt + cy
		i++
	} while (i < 255 && zx * zx + zy * zy < 4)

	return i
}

for (var x = 0; x < width; x++) {
	for (var y = 0; y < height; y++) {
		const i = calculatePixel(x, y)
		matrix[y][x] = [i, i, i]
	}
}

const data = matrix.flat().flat()
const ppmHeader = Buffer.from(
	`P6\n ${width} ${height}\n255\n`,
	'ascii'
).toJSON().data

const ppmBuffer = Buffer.from(ppmHeader.concat(data))

fs.writeFileSync('./png.ppm', ppmBuffer, 'ascii')
