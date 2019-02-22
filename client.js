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

const matrix = new Array(height).fill(0).map(() => new Array(width).fill(0))

function pixel_coordinate_to_c_coordinate(pixel, dimension, c_min, c_max) {
	const normalized_on_img = pixel / dimension
	const complex_range = Math.abs(c_min - c_max)
	return normalized_on_img * complex_range + c_min
}

function c_coordinate_to_pixel_coordinate(c_coordinate, dimension) {
	return ((c_coordinate + 2) / 4) * dimension
}

function calculatePixel(pixel_x, pixel_y) {
	var iterations = 0
	var cx = pixel_coordinate_to_c_coordinate(
		pixel_x,
		width,
		min_c_re,
		max_c_re
	)
	var cy = pixel_coordinate_to_c_coordinate(
		pixel_y,
		height,
		min_c_im,
		max_c_im
	)

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
