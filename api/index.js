// api/index.js
const path = require('path');
const fs = require('fs');

// Localizar el archivo compilado según la salida de nest build
let mainPath = path.resolve(__dirname, '../dist/index.js');
if (!fs.existsSync(mainPath)) {
  mainPath = path.resolve(__dirname, '../dist/src/index.js');
}
if (!fs.existsSync(mainPath)) {
  mainPath = path.resolve(__dirname, '../dist/main.js');
}

const app = require(mainPath);
module.exports = app.default || app;