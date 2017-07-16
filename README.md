# Social Network


Project utilizing Angular, Express, Node, Typescript, SCSS, Webpack, Redux, Angular Universal, Angular HMR, Karma, Jasmine, Protractor, Travis CI, and Heroku to create a server side rendering of a feature rich social networking site. Development environment feels great with HMR, TypeScript, and Travis CI making changes is easy, safe, and blazing fast. Initial load time is extremely quick taking advantage of aot, redux, an on push change detection strategy, and Angular Universal to create a fantastic user experience. Continuous Deployment setup with Heroku ensures software can be released reliably at any time.


[![Build](https://travis-ci.org/zackluckyf/advanced-social-network.svg?branch=master)](https://travis-ci.org/zackluckyf/advanced-social-network)
![Heroku](https://heroku-badge.herokuapp.com/?app=zack-social-network)
[![Dependency Status](https://david-dm.org/zackluckyf/advanced-social-network.svg)](https://david-dm.org/zackluckyf/badges)
[![DevDependency Status](https://david-dm.org/zackluckyf/advanced-social-network/dev-status.svg)](https://david-dm.org/zackluckyf/badges#info=devDependencies)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php) 

[RoadMap](#roadmap)

[Getting Started](#getting-started)

[Prerequisites](#prerequisites)

[Installing](#installing)

[Development Server](#development-server)

[Build](#build)

[Test Environment](#test-environment)

[Running the tests](#running-the-tests)

[Deployment](#deployment)

[Authors](#authors)

[License](#license)

[Acknowledgments](#acknowledgments)

## RoadMap

* <strike>Set up Travis CI</strike>

* <strike>Get Heroku working</strike>

* <strike>Get Heroku working with Travis</strike>

* <strike>Only deploy passing builds to Heroku from Travis</strike>

* <strike>Detailed walkthrough on setup and deploy in README.md</strike>

* Enforce HTTPS only

* Setup concurrency in Node

* Look into StrongLoop as a process manager for the node server

* Research and use a reverse proxy

* Start working on some basic api methods, use try-catch

* UI for dashboard page

* UI for profile page

* Registration

* Authentication/Login

* Posts

* Like Button

* Chat

* Pictures

* User Search

* Friends List/Add and Remove Friends

* Video Chat

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Dependencies require Node 6.9.0 or higher, together with NPM 3 or higher.

After getting Node and NPM install the Angular cli

`npm install -g @angular/cli`

### Installing

Fork and then clone the repository e.g.

`git clone https://github.com/zackluckyf/advanced-social-network.git`

Install the dependencies

`npm install`

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run hmr` for a dev server with hot module replacement.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Test Environment

Run `npm run prod` to build the project and then build and launch the server. 

## Running The Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

Run `npm run all-tests` to run all unit tests and end-to-end tests.

Run `ng lint` to lint the code.

## Deployment

**Deployments will not work on forked versions** 

heroku config:set NPM_CONFIG_PRODUCTION=false makes heroku install dev dependencies

Added so flag can be flipped in production and didn't have to move cli to dependencies just for heroku

Current live heroku app https://zack-social-network.herokuapp.com

## Authors

* **Zack Fanning** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

TBD
