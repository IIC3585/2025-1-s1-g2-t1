const fs = require('fs');
const path = require('path');
const { insertcolumn, createHtmlFile } = require('./functions');

const filePath = path.join(__dirname, 'csv', 'normal.csv');
// const testCasesPath = path.join(__dirname, 'json', 'insert_column.json');
const testCasesPath = path.join(__dirname, 'json', 'insert_column_errors.json');
const csvContent = fs.readFileSync(filePath, 'utf8');
const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

// Insertar columnas
const insert_columns = () => {
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
}

// Crear archivo HTML
const create_html = () => {
  const folderPath = path.join(__dirname, 'csv');
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.csv'));
  files.forEach(file => {
    console.log(`\n--- ${file} ---`);
    createHtmlFile(path.join(folderPath, file), file.replace('.csv', '.html'));
  });
}

// Ejecutar funciones
// insert_columns();
create_html();