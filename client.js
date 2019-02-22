const fs = require('fs')
let [
	IGNORE_NODE,
	IGNORE_FILE_NAME,
	min_c_re,
	min_c_im,
	max_c_re,
	max_c_im,
	max_n,
	width,
	height,
	divisions,
	...list_of_servers
] = process.argv

min_c_re = parseInt(min_c_re)
min_c_im = parseInt(min_c_im)
max_c_re = parseInt(max_c_re)
max_c_im = parseInt(max_c_im)

max_n = parseInt(max_n)
width = parseInt(width)
height = parseInt(height)

const min_x = c_coordinate_to_pixel_coordinate(min_c_re, width)
const max_x = c_coordinate_to_pixel_coordinate(max_c_re, width)
const min_y = c_coordinate_to_pixel_coordinate(min_c_im, height)
const max_y = c_coordinate_to_pixel_coordinate(max_c_im, height)

// console.log({ min_x, max_x, min_y, max_y, width, height })

const matrix = new Array(height).fill(0).map(() => new Array(width).fill(0))

function pixel_coordinate_to_c_coordinate(pixel, dimension) {
	return (pixel / dimension - 0.5) * 4
}

function c_coordinate_to_pixel_coordinate(c_coordinate, dimension) {
	return ((c_coordinate + 2) / 4) * dimension
}

function calculatePixel(pixel_x, pixel_y) {
	var iterations = 0
	var cx = pixel_coordinate_to_c_coordinate(pixel_x, width)
	var cy = pixel_coordinate_to_c_coordinate(pixel_y, height)
	var zx = 0
	var zy = 0

	do {
		var xt = zx * zy
		zx = zx * zx - zy * zy + cx
		zy = 2 * xt + cy
		iterations++
	} while (iterations < max_n && zx * zx + zy * zy < 4)

	return iterations
}

for (var pixel_x = min_x; pixel_x < max_x; pixel_x++) {
	for (var pixel_y = min_y; pixel_y < max_y; pixel_y++) {
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
