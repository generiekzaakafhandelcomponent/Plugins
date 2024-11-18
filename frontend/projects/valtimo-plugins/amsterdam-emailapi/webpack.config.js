//base.webpack.config.js
const path = require('path');

module.exports = {
    extends: path.resolve(__dirname, '../../../base.webpack.config.js'),
    mode: "development",
    //mode: "production",
    entry: {
        main: "./src/public_api.ts",
    },
    output: {
        path: path.resolve(__dirname, '../../../../backend/amsterdam-email-api/src/main/resources/public'),
        filename: "frontend-bundle.js",
        library: {
            type: "module"
        },
    },
};