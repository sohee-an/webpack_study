import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import TerserPlugin from 'terser-webpack-plugin';

module.exports = merge(common, {
  mode: 'production', // 프로덕션 모드로 설정
  // 다른 설정
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true, // 공백, 주석 제거 등 코드 최소화
          mangle: true, // 변수명, 함수명 난독화
        },
        extractComments: false,
      }),
    ],
  },
});
