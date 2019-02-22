const fs = require('fs')
const fetch = require('node-fetch')
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
divisions = parseInt(divisions)

const c_re_slice = Math.abs(max_c_re - min_c_re) / divisions
const width_slice = width / divisions

async function getSlice(
	address,
	min_c_re,
	min_c_im,
	max_c_re,
	max_c_im,
	x,
	y,
	inf_n
) {
	return await fetch(
		`${address}/${min_c_re}/${min_c_im}/${max_c_re}/${max_c_im}/${x}/${y}/${inf_n}`
	).then(res => res.json())
}

const serverAddresses = new Array(divisions - 1)
	.fill(0)
	.map((v, index) => list_of_servers[index])

const results = serverAddresses.map((address, index) =>
	fetch(
		`${address}/${min_c_re + c_re_slice * index}/${min_c_im}/${min_c_re +
			c_re_slice *
				(index + 1)}/${max_c_im}/${width_slice}/${height}/${max_n}`
	).then(result => result.json())
)

const local_result = mandelbrot(
	min_c_re + c_re_slice * (divisions - 1),
	min_c_im,
	max_c_re,
	max_c_im,
	max_n,
	width_slice,
	height
)

const remote_results = await Promise.all(results)
const final_result = remote_results.concat(local_result).flat()

const ppmHeader = Buffer.from(
	`P5\n ${width} ${height}\n255\n`,
	'ascii'
).toJSON().data

const ppmBuffer = Buffer.from(ppmHeader.concat(final_result))

fs.writeFileSync('./mangelbrot.ppm', ppmBuffer, 'ascii')
