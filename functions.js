const _ = require('lodash');
const fs = require("fs");
const path = require("path");

/**
 * @param {Array<string>} rows 
 * @returns {string}
 */
const joinRows = rows => rows.join("\n");

/**
 * @param {Array<Array<string>>} rows 
 * @returns {Array<string>}
 */
const joinColumns = rows => _.map(rows, cells => cells.join(","));

/**
 * @param {string} file - CSV como string.
 */
function* rowsGenerator(file) {
  const rows = file.split(/\r?\n/);
  for (const row of rows) {
    yield row;
  }
}
////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {Array<Array<any>>} file 
 * @param {number} n - primera columna
 * @param {number} m - segunda columna
 */
function swap(file, n, m) {
  if (!Array.isArray(file) || file.length === 0) {
      console.error("El archivo debe ser una matriz no vacía.");
      return;
  }

  if (
      typeof n !== "number" || typeof m !== "number" ||
      n < 0 || m < 0 || n >= file[0].length || m >= file[0].length
  ) {
      console.error("Los índices de columna deben estar dentro del rango válido.");
      return;
  }

  for (let i = 0; i < file.length; i++) {
      [file[i][n], file[i][m]] = [file[i][m], file[i][n]];
  }
}


////////////////////////////////////////////////////////////////////////////////////////
/**
 * Transpone un archivo CSV, convirtiendo filas en columnas.
 * @param {string} file - CSV en formato string.
 * @returns {string} - CSV en formato string con filas y columnas intercambiadas.
 */
const rowsToColumns = (file) =>
  _.flow([
    getRows, // Obtener filas
    (rows) => _.map(rows, (row) => row.split(",")), // Convertir a matriz
    (matrix) => matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex])), // Transponer
    joinColumns, // Convertir columnas a filas
    joinRows, // Convertir a string CSV
  ])(file);

////////////////////////////////////////////////////////////////////////////////////////

/**
 * Transforma un archivo CSV, convirtiendo columnas en filas.
 * @param {string} file - CSV en formato string.
 * @returns {string} - CSV en formato string.
 */
const columnsToRows = (file) =>
  _.flow([
    getRows,
    (rows) => _.map(rows, (row) => row.split(",")),
    (matrix) => {
      const numColumns = matrix[0].length;
      return _.times(numColumns, (colIndex) => matrix.map((row) => row[colIndex]));
    },
    joinColumns,
    joinRows,
  ])(file);


////////////////////////////////////////////////////////////////////////////////////////

/** 
 * @param {string} file - CSV como string.
 * @param {number} n - Índice de fila a eliminar.
 * @returns {string} - CSV en formato de string.
 */

const rowDelete = (file, n) => 
  _.flow([
    getRows,
    validateDeleteRow(n),
    deleteRow(n),
    joinRows
  ])(file);

/** 
 * @param {string} file - CSV como string.
 * @returns {Array<string>} - CSV en formato de lista.
 */

const getRows = (file) =>
  _.chain([...rowsGenerator(file)])
    .filter(row => row.trim() !== "")
    .value();

/**
 * @param {number} n - Índice de la fila a eliminar.
 * @param {string} rows - CSV en formato de lista.
 * @throws {Error}
 * @returns {Array<string>} - CSV en formato de lista.
 */

const validateDeleteRow = _.curry((n, rows) => {
    if (!Number.isInteger(n) || n <= 0) throw new Error("El índice debe ser un entero positivo.");
    if (n >= rows.length) throw new Error(`El índice ${n} es mayor que la cantidad de filas (${rows.length}) en el CSV.`);
    return rows;
});

/**
 * @param {number} n - Índice de la fila a eliminar.
 * @param {string} rows - CSV en formato de lista.
 * @returns {Array<string>} - CSV en formato de lista.
 */

const deleteRow = _.curry((n, rows) => 
  _.filter(rows, (row, idx) => idx !== n));
    


////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {number} n - Índice de la columna a eliminar.
 * @param {string} rows - CSV en formato de lista.
 * @throws {Error}
 * @returns {Array<string>} - CSV en formato de lista.
 */

const validateDeleteColumn = _.curry((n, rows) => {
  if (!Number.isInteger(n) || n <= 0) throw new Error("El índice debe ser un entero positivo.");
  if (rows.length > 0 && n > rows[0].length) throw new Error("El índice es mayor que la cantidad de columnas en el CSV.");
  return rows;
});

/**
 * @param {Array<string>} rows 
 * @returns {Array<Array<string>>} - CSV en formato de lista.
 */

const getColumns = (rows) => 
  _.chain(rows)
    .map(row => row.split(","))
    .value();

/**
 * @param {number} n - Índice de la columna a eliminar.
 * @param {list} columns - CSV en formato de lista.
 * @returns {Array<Array<string>>} - CSV en formato de lista.
 */

const deleteColumn = _.curry((n, columns) => 
  _.map(columns, cells => _.filter(cells, (cell, idx) => idx !== n - 1)));


/** 
 * @param {string} file - CSV como string.
 * @param {number} n - Índice de columna a eliminar.
 * @returns {string} - CSV en formato de string.
 */


const columnDelete = (file, n) =>
  _.flow([
    getRows,
    getColumns,
    validateDeleteColumn(n),
    deleteColumn(n),
    joinColumns,
    joinRows
  ])(file);

////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {number} n - Índice donde insertar.
 * @param {string} row - Fila a insertar.
 * @param {Array<string>} rows - Arreglo original.
 * @returns {Array<string>} - CSV en formato de arreglo.
 */

const insertRowToTheArray = _.curry((n, row, rows) => {
  return [...rows.slice(0, n + 1), row, ...rows.slice(n + 1)];
});

/**
 * @param {number} n - Índice donde insertar.
 * @param {string} row - Fila a insertar.
 * @param {Array<string>} rows - CSV en formato de arreglo.
 * @throws {Error}
 * @returns {Array<string>} - CSV en formato de arreglo.
 */

const validateInsertRow = _.curry((n, row, rows) => {
  if (!Number.isInteger(n) || n < 0) throw new Error("El índice debe ser un entero no negativo.");
  if (n > rows.length - 1) throw new Error(`El índice ${n} es mayor que la cantidad de filas (${rows.length - 1}) en el CSV.`);
  if (row.length !== rows[0].split(",").length && !_.isEmpty(rows)) throw new Error("El número de columnas en la fila a insertar no coincide con el CSV.");
  return rows;
});


/**
 * @param {string} file - CSV como string.
 * @param {number} n - Índice donde insertar.
 * @param {string} row - Fila a insertar.
 * @returns {string} - CSV en formato de string con la fila insertada.
 */

const insertRow = (file,  n, row) => 
  _.flow([
    getRows,
    validateInsertRow(n, row),
    insertRowToTheArray(n, row),
    joinRows
  ])(file);


////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////

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
  swap,
  rowsToColumns,
  columnsToRows,
  rowDelete,
  columnDelete,
  insertRow,
  insertcolumn,
  validateInsertColumn,
  tohtmltable,
  createHtmlFile,
};

