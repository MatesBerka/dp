# Stereoscopy Simulator

Stereoscopy Simulator was created for students to help them better understand how stereoscopy works and for experienced photographers to help them with their experiments.

Temporarily hosted [here](http://dp.marpaweb.eu).
### Used packages

Stereoscopy Simulator uses following packages.
* [FileSaver.js] - FileSaver.js is the solution to saving files on the client-side.
* [Flow] - A static type checker for JavaScript.
* [React] - React is a JavaScript library for building user interfaces.
* [Rangeslider] - A fast & lightweight react component as a drop in replacement for HTML5 input range slider element.
* [Semantic UI React] - A UI framework designed for theming.
* [React-scripts] - Configuration and scripts for Create React App.

### Installation

Stereoscopy Simulator requires [Node.js](https://nodejs.org/) v5.6+ to run (for dev. environment).

Install all the dependencies with following command.

```sh
$ cd stereoscopy-simulator
$ npm install
```
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
In current configuration application expects, that the homepage URL will look like this `/stereoscopy-simulator/build`. Otherwise it will not be able to correctly load related files (JS, CSS).
This can be changes in package.json file with `homepage` attribute.

© [Petr Lobaz](http://www.kiv.zcu.cz/cz/katedra/osoby-seznam/osoba-detail.html?login=lobaz), University of West Bohemia.

[FileSaver.js]: <https://www.npmjs.com/package/file-saver>
[Flow]: <https://flow.org/>
[React]: <https:/reactjs.org/>
[Rangeslider]: <https://www.npmjs.com/package/react-rangeslider>
[Semantic UI React]: <https://www.npmjs.com/package/file-saverg>
[React-scripts]: <https://www.npmjs.com/package/react-scripts>
