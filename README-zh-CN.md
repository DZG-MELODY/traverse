# traverse-all 👌

<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/DZG-MELODY/traverse#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/DZG-MELODY/traverse/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/DZG-MELODY/traverse/blob/master/LICENSE">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" target="_blank" />
  </a>
</p>

> 可以遍历一切的方法集！

其他语言文档:
[英文](./README.md)

## 安装

```sh
npm install traverse-all
```

## 用法

### 基础用法

#### 直接引入模块

```js
const Traverse = require("traverse-all");

Traverse.traverse_recursive(nodes, options);
```

#### 从模块中引入指定方法

```js
const { traverse_recursive } = require("traverse-all");

traverse_recursive(nodes, options);
```

## 方法使用

### traverse_recursive(nodes,options) 递归遍历

- **nodes**：`Array` root nodes
- **options**：`Object` traverse options which includes:
  - predicate：`Function` **required**
  - nodeHandle：`Function` **required**
  - exclude: `Function`
  - ignore: `Function`
- **return** `Promise<any>`

【递归判断谓词】：predicate(node):{done:`Boolean`,iterators:`Array`}

- node：单个节点对象
- done：该节点是否完成递归
- iterators：该节点下需要继续递归的节点数组

【节点处理方法】：nodeHandle(node,params,options,result):node

- node：单个节点
- params：节点参数
- options：遍历设置
- result：透传结果
- return：单个节点 注意：即使不做任何操作也要返回该节点，例如：`node=>node`

**params**携带了当前节点的特殊参数：

- path：`Array<node>`节点路径
- isLeaf：`Boolean`是否为叶子节点
- isFirst：`Boolean`是否为该级别遍历的第一个节点
- isLast：`Boolean`是否为该级别遍历的最后一个节点

## Author

👤 **dzg**

- Github: [@DZG-MELODY](https://github.com/DZG-MELODY)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [dzg](https://github.com/DZG-MELODY).

This project is [ISC](https://github.com/DZG-MELODY/traverse/blob/master/LICENSE) licensed.
