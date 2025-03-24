const fs = require('fs');
const path = require('path');
const { insertcolumn } = require('./functions');

const filePath = path.join(__dirname, 'csv', 'normal.csv');
const testCasesPath = path.join(__dirname, 'json', 'insert_column.json');

const csvContent = fs.readFileSync(filePath, 'utf8');
const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

testCases.forEach(({ name, index, column }, i) => {
  console.log(`\n🧪 Caso ${i + 1}: ${name}`);
  const result = insertcolumn(csvContent, index, column);
  console.log(result);
});
