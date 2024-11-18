//base.webpack.config.js
const path = require('path');

module.exports = {
    mode: "development",
    //mode: "production",
    devtool: "inline-source-map",
    output: {
        filename: "frontend-bundle.js",
        library: {
            type: "module"
        },
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".mjs", ".map", ".scss", ".html"],
        fullySpecified: false,
        modules: ['node_modules'],
    },
    experiments: {
        outputModule: true,
    },
    externalsType: 'window',
    externals: [
        "@angular/common",
        "@angular/core",
        "@valtimo/components",
        "@valtimo/plugin",
        "rxjs",
        "tslib",
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                loader: "ts-loader",
            },
            {
                test: /\.(html|css|scss)?$/,
                type: 'asset/source',
                generator: {
                    filename: 'assets/[name]-[contenthash].[ext]',
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name]-[contenthash].[ext]',
                }
            },
            {
                resolve: {
                    fullySpecified: false,
                },
            }
        ]
    }
};