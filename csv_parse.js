const Papa = require('papaparse');
const fs = require("fs");

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');

const parseCSV = (file) => Papa.parse(file, { header: true });

const csvParser = (filePath) => parseCSV(readFile(filePath)); // Composition


console.log(csvParser('./test.csv'));


module.exports = csvParser;