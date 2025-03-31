## 📁 Estructura del Proyecto

```bash
.
├── csv/               # Archivos CSV de entrada
├── html/              # Exportaciones de tablas HTML generadas
├── json/              # Casos de prueba en formato JSON
├── functions.js       # Funciones principales: insertar columnas, convertir a HTML, validaciones
├── csv.js             # Parser personalizado de archivos CSV
├── main.js            # Archivo principal para ejecutar funciones específicas
└── README.md          # Documentación
```

## 🚀 Cómo ejecutar el proyecto

```bash
# Instala las dependencias necesarias
npm install
o 
yarn install
# Ejecuta el archivo principal
node main.js
```

## ⚙️ main.js

El archivo `main.js` está diseñado para probar **una función a la vez**. Por lo tanto:

> [!IMPORTANT]  
> **Debes descomentar manualmente** la función que deseas probar.

## 📥 csv.js

El archivo [`csv.js`](./csv.js) contiene un parser de archivos `.csv` personalizados para ayudarte a trabajar con archivos desde la carpeta `./csv`.

> [!NOTE]  
> Los archivos `.csv` utilizados provienen de [Wikipedia sobre CSV](https://en.wikipedia.org/wiki/Comma-separated_values) y se complementaron con ejemplos generados por **GPT-4o**.

## 🧪 Casos de prueba

La carpeta `./json` contiene archivos `.json` con casos de prueba para cada función.

### Archivos relevantes

- `insert_column.json`: Casos válidos para la función `insertcolumn`.
- `insert_column_errors.json`: Casos con errores intencionales para validar fallos y bordes.

> [!TIP]
> Puedes cambiar entre archivos de prueba modificando la siguiente línea en `main.js`:
>
> ```js
> const testCasesPath = path.join(__dirname, 'json', 'insert_column.json');
> ```

## 🖼️ Exportar a HTML

La carpeta `./html` se utiliza para guardar los archivos `.html` generados desde los CSV.

## 🧩 Funciones disponibles

Las funciones principales están exportadas desde `functions.js`:

- `swap(file, n, m)`  
  Hace un swap de las columnas n y m

- `rowsToColumns(file)`  
  Transforma las filas en columnas
  
- `columnsToRows(file)`  
  Transforma las columnas en filas

- `insertcolumn(file, index, column)`  
  Inserta una columna en la posición indicada en el CSV.

- `validateInsertColumn(file, index, column)`  
  Verifica que los datos entregados a `insertcolumn` sean válidos.

- `tohtmltable(file)`  
  Convierte un archivo CSV en una tabla HTML (independiente del tamaño).

- `createHtmlFile(csvPath, htmlPath)`  
  Convierte un CSV a HTML y lo guarda en un archivo.