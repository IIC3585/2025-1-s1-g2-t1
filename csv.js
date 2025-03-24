const Papa = require('papaparse');
const fs = require("fs");
const path = require("path");

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');
const parseCSV = (file) => Papa.parse(file, { header: true });
const csvParser = (filePath) => parseCSV(readFile(filePath));

const testParseAllCSVs = (folderPath) => {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.csv'));
  files.forEach(file => {
    console.log(`\n--- ${file} ---`);
    const result = csvParser(path.join(folderPath, file));
    console.dir(result, { depth: null });
  });
};


// console.log(csvParser('./csv/normal.csv'));
// testAllCSVs('./csv');

module.exports = {
  csvParser,
  testAllCSVs: testParseAllCSVs
};
