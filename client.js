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

const matrix = new Array(200).fill(0).map(() => new Array(200).fill([0, 0, 0]))

function calculatePixel(x, y) {
	var i = 0
	var cx = -2 + x / 50
	var cy = -2 + y / 50
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

for (var x = 0; x < 200; x++) {
	for (var y = 0; y < 200; y++) {
		const i = calculatePixel(x, y)
		matrix[y][x] = [i, i, i]
	}
}

const data = matrix.flat().flat()
const ppmHeader = Buffer.from('P6\n 200 200\n255\n', 'ascii').toJSON().data

const ppmBuffer = Buffer.from(ppmHeader.concat(data))

fs.writeFileSync('./png.ppm', ppmBuffer, 'ascii')
