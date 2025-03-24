const _ = require('lodash');

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
 * insertcolumn(file, n, column) - Inserta una columna después de la columna n.
 * @param {string} file
 * @param {number} n
 * @param {Array<string>} column
 * @returns {string}
 */
const insertcolumn = (file, n, column) => {
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

module.exports = {
  insertcolumn
};
