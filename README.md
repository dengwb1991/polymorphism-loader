# Polymorphism-loader

实现以文件维度条件编译

## 配置

```js
// webpack.config.js

rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [{
      loader: 'polymorphism-loader',
      options: {
        mode: 'prod'
      }
    }]
  }
]
```

```js
// index.js
import bridge from './mode/bridge.js'

// 目录结构如下
├── mode
│   ├── bridge.js
│   ├── bridge.dev.js
│   └── bridge.prod.js
├── index.js
```

根据 `options.mode` 配置，匹配对应的文件.

若是开发环境(dev)下，则引入mode文件夹内的 `bridge.dev.js` 文件；
若是生产环境(prod)下，则引入mode文件夹内的 `bridge.prod.js` 文件；
若是其他环境下，则引入mode文件夹内的 `bridge.js` 文件；