const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
      popup: path.join(srcDir, 'popup.tsx'),
      options: path.join(srcDir, 'options.tsx'),
      background: path.join(srcDir, 'background.ts'),
      content_script: path.join(srcDir, 'content_script.tsx'),
      content_script2: path.join(srcDir, 'content_script2.tsx'),
      context_menu: path.join(srcDir, 'context_menu.ts'),
      app_auth: path.join(srcDir, 'AppAuth.tsx'),
      // "fragment-generation-utils": path.join(srcDir, 'fragment-generation-utils.js'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    // optimization: {
    //     splitChunks: {
    //         name: "vendor",
    //         chunks(chunk) {
    //           return chunk.name !== 'background';
    //         }
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },        
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                        options: {
                          injectType: "lazySingletonStyleTag",
                          // Do not forget that this code will be used in the browser and
                          // not all browsers support latest ECMA features like `let`, `const`, `arrow function expression` and etc,
                          // we recommend use only ECMA 5 features,
                          // but it is depends what browsers you want to support
                          insert: function insertIntoTarget(element, options) {
                            var parent = options.target || document.head;
            
                            parent.appendChild(element);
                          },
                        },
                    },
                    'css-loader', 'postcss-loader'
                ]
            },        
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", '.css'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};
