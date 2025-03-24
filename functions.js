const _ = require('lodash');
const fs = require("fs");
const path = require("path");

/**
 * @param {number} index - Índice donde insertar
 * @param {any} item - Valor a insertar.
 * @param {Array} arr - Arreglo original.
 * @returns {Array} - CSV en formato de arreglo.
 */
const insertAt = _.curry((index, item, arr) => {
  return [...arr.slice(0, index), item, ...arr.slice(index)];
});

/**
 * @param {string} file - CSV como string.
 */
function* rowsGenerator(file) {
  const rows = file.split(/\r?\n/);
  for (const row of rows) {
    yield row;
  }
}

/**
 * @param {Array<string>} rows 
 * @returns {string}
 */
const joinRows = rows => rows.join("\n");


/**
 * @param {string} file - CSV en formato string.
 * @param {number} n - Índice de columna en el que se insertará.
 * @param {Array<string>} column - Arreglo con los valores a insertar (uno por fila).
 * @throws {Error}
 * @returns {boolean}
 */

const validateInsertColumn = (file, n, column) => {
  if (typeof file !== 'string') {
    throw new Error("El archivo CSV debe ser un string.");
  }
  if (!Array.isArray(column)) {
    throw new Error("La columna a insertar debe ser un array.");
  }
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("El índice debe ser un entero no negativo.");
  }
    const rows = file.split(/\r?\n/).filter(row => row.trim() !== "");
  
  if (rows.length !== column.length) {
    throw new Error(`El número de elementos en la columna (${column.length}) no coincide con el número de filas (${rows.length}) en el CSV.`);
  }
  
  for (const row of rows) {
    const cells = row.split(",");
    if (n > cells.length) {
      throw new Error(`El índice ${n} es mayor que la cantidad de columnas (${cells.length}) en la fila: ${row}`);
    }
  }
  return true;
};

/**
 * @param {string} file
 * @param {number} n
 * @param {Array<string>} column
 * @returns {string}
 */
const insertcolumn = (file, n, column) => {
  validateInsertColumn(file, n, column);
  const rows = [...rowsGenerator(file)];
  return _.chain(rows)
    .map((row, idx) => {
      if (row.trim() === "") return row;
      return _.chain(row.split(","))
        .thru(cells => insertAt(n, column[idx] || "", cells))
        .thru(newCells => newCells.join(", "))
        .value();
    })
    .thru(joinRows)
    .value();
};


/**
 * @param {string} file - CSV en formato string.
 * @returns {string} HTML con la tabla generada.
 */
const tohtmltable = (file) => {
  const rows = file.split(/\r?\n/).filter(row => row.trim() !== "");
  let html = "<table>\n";
  rows.forEach(row => {
    const cells = row.split(",");
    html += "    <tr>\n";
    cells.forEach(cell => {
      html += "        <td>" + cell + " </td>\n";
    });
    html += "    </tr>\n";
  });
  
  html += "</table>";
  return html;
};

/**
 * @param {string} csvFilePath - Ruta del archivo CSV.
 */
const createHtmlFile = (csvFilePath, htmlFileName) => {
  const htmlPath = path.join(__dirname, 'html', htmlFileName);
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const htmlTable = tohtmltable(csvContent);
    fs.writeFileSync(htmlPath, htmlTable, 'utf8');
  } catch (error) {
    console.error("Error al crear el archivo HTML:", error.message);
  }
};

module.exports = {
  insertcolumn,
  validateInsertColumn,
  tohtmltable,
  createHtmlFile,
};

