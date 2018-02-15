const fs = require('fs');

const startDir = __dirname;

function collateConfig(searchFile) {
    if (typeof searchFile !== 'string')
        throw new TypeError('`searchFile` is required and must be a String');
    
    let searchPath = startDir.split('/');
    let result = {};

    while (searchPath.length > 0) {
        const currentPath = searchPath.join('/');

        const fullPath = currentPath + '/' + searchFile;
        const packageJsonPath = currentPath + '/package.json';

        if (fs.existsSync(packageJsonPath) && fs.existsSync(fullPath)) {
            let rcData = fs.readFileSync(fullPath, 'utf8');

            try {
                rcData = JSON.parse(rcData);   
            } catch (e) {
                throw new Error(fullPath + ' is not a valid JSON file!');
            }

            Object.assign(result, rcData);

            if (rcData.__sealed)
                break;
        }

        searchPath = searchPath.slice(0, -1);
    }

    return result;
}

exports.default = collateConfig;
exports.__esModule = true;
