const fs = require('fs')
const http = require('http')
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

const c_im_slice = Math.abs(max_c_im - min_c_im) / divisions
const height_slice = height / divisions

const serverAddresses = new Array(divisions - 1)
	.fill(0)
	.map((v, index) => list_of_servers[index])

function getSlice(
	address,
	index,
	min_c_re,
	min_c_im,
	max_c_re,
	max_c_im,
	max_n,
	width,
	height
) {
	return new Promise(resolve => {
		http.get(
			`http://${address}/${min_c_re}/${min_c_im +
				c_im_slice * index}/${max_c_re}/${min_c_im +
				c_im_slice * (index + 1)}/${width}/${height_slice}/${max_n}`,
			res => {
				let rawData = ''
				res.on('data', chunk => {
					rawData += chunk
				})
				res.on('end', () => {
					const parsedData = JSON.parse(rawData)
					resolve(parsedData)
				})
			}
		)
	})
}

const results = serverAddresses.map((address, index) =>
	getSlice(
		address,
		index,
		min_c_re,
		min_c_im,
		max_c_re,
		max_c_im,
		max_n,
		width,
		height
	)
)

const local_result = mandelbrot(
	min_c_re,
	min_c_im + c_im_slice * (divisions - 1),
	max_c_re,
	max_c_im,
	max_n,
	width,
	height_slice
)

;(async function() {
	const remote_results = await Promise.all(results)

	const final_result = remote_results.concat(local_result).flat()

	const ppmHeader = Buffer.from(
		`P5\n ${width} ${height}\n255\n`,
		'ascii'
	).toJSON().data

	const ppmBuffer = Buffer.from(ppmHeader.concat(final_result))

	fs.writeFileSync('./mangelbrot.ppm', ppmBuffer, 'ascii')
})()
