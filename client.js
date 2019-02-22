const fs = require('fs')
const mandelbrot = require('./mandelbrot')
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

min_c_re = parseFloat(min_c_re)
min_c_im = parseFloat(min_c_im)
max_c_re = parseFloat(max_c_re)
max_c_im = parseFloat(max_c_im)

max_n = parseInt(max_n)
width = parseInt(width)
height = parseInt(height)

const data = mandelbrot(
	min_c_re,
	min_c_im,
	max_c_re,
	max_c_im,
	max_n,
	width,
	height
)

const ppmHeader = Buffer.from(
	`P5\n ${width} ${height}\n255\n`,
	'ascii'
).toJSON().data

const ppmBuffer = Buffer.from(ppmHeader.concat(data))

fs.writeFileSync('./mangelbrot.ppm', ppmBuffer, 'ascii')
