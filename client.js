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

const matrix = new Array(height).fill(0).map(() => new Array(width).fill(0))

function calculatePixel(pixel_x, pixel_y) {
	var iterations = 0
	var cx = -2 + pixel_x / (width / 4)
	var cy = -2 + pixel_y / (height / 4)
	var zx = 0
	var zy = 0

	do {
		var xt = zx * zy
		zx = zx * zx - zy * zy + cx
		zy = 2 * xt + cy
		iterations++
	} while (iterations < 2048 && zx * zx + zy * zy < 4)

	return iterations
}

for (var pixel_x = 0; pixel_x < width; pixel_x++) {
	for (var pixel_y = 0; pixel_y < height; pixel_y++) {
		matrix[pixel_y][pixel_x] = calculatePixel(pixel_x, pixel_y) % 255
	}
}

const data = matrix.flat().flat()
const ppmHeader = Buffer.from(
	`P5\n ${width} ${height}\n255\n`,
	'ascii'
).toJSON().data

const ppmBuffer = Buffer.from(ppmHeader.concat(data))

fs.writeFileSync('./mangelbrot.ppm', ppmBuffer, 'ascii')
