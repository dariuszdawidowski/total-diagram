/**
 * Build script v6-custom
 */

const files = [
    { src: 'total-diagram.js.ejs', dst: 'total-diagram.js' },
];

const fs = require('fs');
const { readFile } = require('fs').promises;
const ejs = require('ejs');
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

if (!fs.existsSync('dist')) fs.mkdirSync('dist');

files.forEach((file) => {

    ejs.render(fs.readFileSync(file.src, 'utf8'), { minjs }, {async: true})
        .then(output => fs.writeFileSync('dist/' + file.dst, output, 'utf8'));

});
