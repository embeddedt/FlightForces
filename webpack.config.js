const requireg = require('requireg');
const WebpackBar = requireg('webpackbar');
const path = require('path');
/*const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;*/
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var babelLoader = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: false,
        presets: [['@babel/preset-env', {
            debug: false,
            useBuiltIns: 'usage',
            corejs: '3',
            shippedProposals: true,
            forceAllTransforms: true
        }]],
        sourceType: "unambiguous",
        plugins: ['@babel/plugin-transform-runtime']
    }
};

var babelRegex = function (moduleName) {
    var retVal;
    if (moduleName.includes("country-list-js"))
        retVal = false;
    else if (!moduleName.includes("node_modules"))
        retVal = false;
    else
        retVal = true;
    return retVal;
}

function isProduction(env) {
    return typeof env != "undefined" && env.production;
}

const fileRule = {
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
        {
            loader: 'file-loader',
            
            options: {
                publicPath: ""
            }
        },
    ],
};
const mod = {
    rules: [
        {
            test: /\.tsx?$/,
            use: [
                babelLoader,
                { loader: 'ts-loader' }
            ],
            exclude: babelRegex,
        },
        {
            test: /\.js$/,
            exclude: babelRegex,
            use: [
                babelLoader
            ]
        },
        fileRule,
        {
            test: /\.html$/,
            exclude: /node_modules/,
            use: { loader: 'html-loader' }
        }
    ],
};
function getBaseConfig(env) {
    return {
        mode: isProduction(env) ? 'production' : 'development',
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        devServer: {
            contentBase: '.',
            port: 8080
        },
        devtool: isProduction(env) ? false : 'inline-source-map',
        plugins: [
            new WebpackBar()
        ]
    }
}
const configA = env => Object.assign({}, getBaseConfig(env), {
    module: mod, entry: ['./main.ts'], output: {
        filename: '_bundled_code.js',
        path: __dirname
    }
});
const configB = env => Object.assign({}, getBaseConfig(env), {
    plugins: [
        new MiniCssExtractPlugin(),
        new WebpackBar()
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Compiles Sass to CSS
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            filename: 'style_tmp.css',
                            publicPath: ""
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            fileRule
        ]
    }, entry: { compiled_styles: './styles.scss' }, output: {
        filename: 'style_tmp.css',
        path: __dirname
    }
});

module.exports = [ configA, configB ];