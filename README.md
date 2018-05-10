# Stereoscopy Simulator

Stereoscopy Simulator was created for students to help them better understand how stereoscopy works and for experienced photographers to help them with their work.

Temporarily hosted [here](http://dp.marpaweb.eu) (without HTTPS)
and here [here](https://matesberka.github.io/dp/build/) (with HTTPS).

Source code located [here](https://github.com/MatesBerka/dp/).
### Used packages

Stereoscopy Simulator uses following packages.
* [FileSaver.js] - FileSaver.js is the solution to saving files on the client-side.
* [Flow] - A static type checker for JavaScript.m
* [React] - React is a JavaScript library for building user interfaces.
* [Rangeslider] - A fast & lightweight react component as a drop in replacement for HTML5 input range slider element.
* [Semantic UI React] - A UI framework designed for theming.
* [React-scripts] - Configuration and scripts for Create React App.

### Installation

Stereoscopy Simulator requires [Node.js](https://nodejs.org/) v5.6+ to run (for dev. environment) and [npm](https://www.npmjs.com/) v5.2+.

Install all the dependencies with following command.

```sh
$ cd stereoscopy-simulator
$ npm install
```

Installed dependencies will be stored in node_modules folder. Unfortunately my dependencies have a lot of other dependencies so the folder can be quite large.

### Development
I order to start development version execute following command.
```sh
$ npm run start
```
By default development server will start on port 3000.
##### Static typing
Flow will generate report into console.
```sh
$ npm run flow
```
### Production ready version
Production ready version can be created with this command. Generated application is stored in build folder.
```sh
$ npm run build
```
**In current configuration application expects, that the homepage URL will look like this `/stereoscopy-simulator/build`.** Otherwise it will not be able to correctly load related files (JS, CSS).
This can be changes in `package.json` file with `homepage` attribute.

Example with full path:
```js
  "homepage": "http://mywebsite.com/relativepath",
```

Example with root:
```js
  "homepage": "/",
```
Or attribute `homepage` can be removed from `package.json` if app is hosted at the the root.

[FileSaver.js]: <https://www.npmjs.com/package/file-saver>
[Flow]: <https://flow.org/>
[React]: <https:/reactjs.org/>
[Rangeslider]: <https://www.npmjs.com/package/react-rangeslider>
[Semantic UI React]: <https://www.npmjs.com/package/file-saverg>
[React-scripts]: <https://www.npmjs.com/package/react-scripts>
