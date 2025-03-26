const fs = require('fs');
const path = require('path');
const { swap, rowsToColumns, columnsToRows, rowDelete, columnDelete, insertRow, insertcolumn, createHtmlFile } = require('./functions');

const filePath = path.join(__dirname, 'csv', 'normal.csv');
const testCasesPath = path.join(__dirname, 'json', 'delete_row.json');
// const testCasesPath = path.join(__dirname, 'json', 'insert_column_errors.json');
const csvContent = fs.readFileSync(filePath, 'utf8');
const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));
console.log(testCases);


// Cambiar columnas (swap)
const swap_columns = () => {
  testCases.forEach(({ name, col1, col2 }, i) => {
    console.log(`\n🧪 Caso ${i + 1}: ${name}`);
    try {
      const result = swap(csvContent, col1, col2);
      console.log("✅ Resultado:");
      console.log(result);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });
}

// Transformar filas en columnas
const rows_to_columns = () => {
  testCases.forEach(({ name }, i) => {
    console.log(`\n🧪 Caso ${i + 1}: ${name}`);
    try {
      const result = rowsToColumns(csvContent);
      console.log("✅ Resultado:");
      console.log(result);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });
}

// Transformar columnas en filas
const columns_to_rows = () => {
  testCases.forEach(({ name }, i) => {
    console.log(`\n🧪 Caso ${i + 1}: ${name}`);
    try {
      const result = columnsToRows(csvContent);
      console.log("✅ Resultado:");
      console.log(result);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });
}

// Eliminar filas
const delete_rows = () => {
  testCases.forEach(({ name, index }, i) => {
    console.log(`\n🧪 Caso ${i + 1}: ${name}`);
    try {
      const result = rowDelete(csvContent, index);
      console.log("✅ Resultado:");
      console.log(result);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });
}

// Eliminar columnas
const delete_columns = () => {
  testCases.forEach(({ name, index }, i) => {
    console.log(`\n🧪 Caso ${i + 1}: ${name}`);
    try {
      const result = columnDelete(csvContent, index);
      console.log("✅ Resultado:");
      console.log(result);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });
}


// Insertar filas
const insert_rows = () => {
  testCases.forEach(({ name, index, row }, i) => {
    console.log(`\n🧪 Caso ${i + 1}: ${name}`);
    try {
      const result = insertRow(csvContent, index, row);
      console.log("✅ Resultado:");
      console.log(result);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });
}

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
// swap_columns();
// rows_to_columns();
// columns_to_rows();
// delete_rows();
// delete_columns();
// insert_rows();
// insert_columns();
// create_html();