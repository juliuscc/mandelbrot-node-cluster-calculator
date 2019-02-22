# Mandelbrot Node.js Cluster Calculator

## Installation

Download and install Node.js from [this link](https://nodejs.org/en/download/).

When you have Node.js installed run `npm install` to install all dependencies.

## Screenshot

![Mandelbrot rendering](./mandelbrot.png)

## How to run

Open the project in four terminal windows. Run `node server.js` in three of them. If all servers get the ports `[3000, 3001, 3002]` you can run `npm start`. If not you have to specify the ports and will have to run:

`node client.js -2 -2 2 2 1024 1000 1000 4 localhost:<port1> localhost:<port2> localhost:<port3>`

where `<portx>` represents the given port number from every server.

This works with another number of servers also.
