# MosaiqoApp frontend server for testing & developing

[![Build Status](https://travis-ci.org/mosaiqo/frontend-devServer.svg)](https://travis-ci.org/mosaiqo/frontend-devServer)
[![Dependency Status](https://www.versioneye.com/user/projects/54d605933ca0840b19000677/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54d605933ca0840b19000677)
[![Code Climate](https://codeclimate.com/github/mosaiqo/frontend-devServer/badges/gpa.svg)](https://codeclimate.com/github/mosaiqo/frontend-devServer)
[![Test Coverage](https://codeclimate.com/github/mosaiqo/frontend-devServer/badges/coverage.svg)](https://codeclimate.com/github/mosaiqo/frontend-devServer)

## Prerequisites:
- node & npm
- mongo
- redis

## Setup:
- Install dependencies executing: `npm install`
- Clone somewhere the frontendApp
- Set the path to the frontendApp by creating a file called *env.json* at the project root with the content `{ "appPublicDir" : "path_to_the_frontEndApp_public_dir" }`
- Mongo:
    - Run `grunt mongo:setup` to create the data and logs directories and the PID file, ans set the propper permissions. *This is optional, see the README.md file inside the db directory*.
    - Start Mongo by executing `grunt mongo`.
    - Run `grunt mongo:populate` to load the fake data.
    - Run `grunt mongo:stop` to stop mongo (the grunt tasks will start/stop it when needed).

## Usage:

The gruntfile has 2 primary tasks, the default one and one called *dev*.

The default one starts a simple HTTP server to serve the frontend app files and also a fake API to test and develop independently from the backend app (developed using Laravel).

The *dev* task does the same as the default one, and does some additional things:

- It starts the mongo server used by the API and redis used to cache stuff (like the JWT).
- It monitors the frontendApp files, so when they change, the browser gets reloaded.
- It monitors the server files, so whenever changed, the files are linted, tested and the server is restarted.
- It offers a syncronized browsing on any device, using *browserSync*, so when the app navigates to some section on one browser, it also navigates to that section on any one browser/device. Very nice for testing, by the way:
    + [browserSync](http://www.browsersync.io/docs) UI: BrowserSync includes a UI that allows to controls all devices, push sync updates and much more. It can be accessed at [http://localhost:9002](http://localhost:9002).
    + [weinre](http://people.apache.org/~pmuellr/weinre-docs/latest/): BrowserSync includes a remote inspector that lets tweaking and debuging web pages that are running on connected devices. It can be accessed at [http://localhost:9003](http://localhost:9003).

