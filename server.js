const getPort = require('get-port')
const express = require('express')
const mandelbrot = require('./mandelbrot')

const app = express()

;(async () => {
	const port = await getPort({ port: [3000, 3001, 3002] })

	app.get(
		'/:min_c_re/:min_c_im/:max_c_re/:max_c_im/:x/:y/:inf_n',
		(req, res) => {
			console.log('Got request:')
			console.log(req.params)

			let {
				min_c_re,
				min_c_im,
				max_c_re,
				max_c_im,
				x,
				y,
				inf_n
			} = req.params

			min_c_re = parseFloat(min_c_re)
			min_c_im = parseFloat(min_c_im)
			max_c_re = parseFloat(max_c_re)
			max_c_im = parseFloat(max_c_im)
			x = parseInt(x)
			y = parseInt(y)
			inf_n = parseInt(inf_n)

			const data = mandelbrot(
				min_c_re,
				min_c_im,
				max_c_re,
				max_c_im,
				inf_n,
				x,
				y
			)

			res.setHeader('Content-Type', 'application/json')
			res.send(JSON.stringify(data))
			console.log('Returned request')
		}
	)

	app.listen(port, () =>
		console.log(`Mandelbrot server listening on port ${port}!`)
	)
})()
