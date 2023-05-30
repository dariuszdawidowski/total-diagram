/**
 * Build script
 */

const fs = require('fs');
const ejs = require('ejs');
const { readFile } = require('fs').promises;
const { minify } = require('terser');

const minjs = async (filePath) => {
    try {
        const inputCode = await readFile(filePath, 'utf8');
        const minifiedCode = (await minify(inputCode)).code;
        return minifiedCode;
    }
    catch (error) {
        console.error(`Error minifying js ${filePath}:`, error);
        return null;
    }
};

ejs.render(fs.readFileSync('total-diagram.js.ejs', 'utf8'), { minjs }, { async: true })
.then(output => fs.writeFileSync('dist/total-diagram.js', output, 'utf8'));
