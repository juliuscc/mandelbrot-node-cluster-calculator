function mandelbrot(
	min_c_re,
	min_c_im,
	max_c_re,
	max_c_im,
	max_n,
	width,
	height
) {
	const matrix = new Array(height).fill(0).map(() => new Array(width).fill(0))

	function pixel_coordinate_to_c_coordinate(pixel, dimension, c_min, c_max) {
		const normalized_on_img = pixel / dimension
		const complex_range = Math.abs(c_min - c_max)
		return normalized_on_img * complex_range + c_min
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

	return matrix.flat().flat()
}

module.exports = mandelbrot
