import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { Configuration as WebpackConfiguration } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  name: 'webpack-study',
  mode: isDevelopment ? 'development' : 'production',
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: './src/index.tsx',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: isDevelopment ? 'source-map' : 'hidden-source-map',
  devServer: {
    static: './public',
    port: 3000,
    hot: true,
    // open: true, // 브라우저 자동 열기
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      // CSS 로더 수정 - Tailwind CSS 지원 추가
      {
        test: /\.css$/, // .css 파일에 대해
        use: [
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['tailwindcss', 'autoprefixer'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new Dotenv({
    //   path: `./.env.${process.env.NODE_ENV}`, // 환경별 .env 파일 경로
    // }),
  ],
};

if (config.plugins) {
  if (isDevelopment) {
    config.plugins.push(
      new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
      }),
    );
  }

  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      async: isDevelopment, // 개발 모드에서는 비동기, 프로덕션 모드에서는 동기
    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  );
}

export default config;
