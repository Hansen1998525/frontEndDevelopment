// 首先引入 Mock
const Mock = require('mockjs');

// 设置拦截 ajax 请求的相应时间
Mock.setup({
    timeout: '200-600'
});

let configArray = [];

// 使用 webpack 的 require.context() 遍历所有 mock 文件(*包括子文件夹)
const files = require.context('.', true, /\.js$/);
files.keys().forEach((key) => {
    if (key === './index.js') return;
    configArray = configArray.concat(files(key).default);
});

// 注册所有的 mock 服务
configArray.forEach((item) => {
    for (let [path, target] of Object.entries(item)) {
        let protocol = path.split('|');
        Mock.mock(new RegExp('^' + protocol[1]), protocol[0], target);
    }
});