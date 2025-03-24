const fs = require('fs');
const path = require('path');
const { insertcolumn } = require('./functions');

const filePath = path.join(__dirname, 'csv', 'normal.csv');
// const testCasesPath = path.join(__dirname, 'json', 'insert_column.json');
const testCasesPath = path.join(__dirname, 'json', 'insert_column_errors.json');

const csvContent = fs.readFileSync(filePath, 'utf8');
const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

testCases.forEach(({ name, index, column }, i) => {
  console.log(`\n🧪 Caso ${i + 1}: ${name}`);
  try {
    const result = insertcolumn(csvContent, index, column);
    console.log("✅ Resultado:");
    console.log(result);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
});
