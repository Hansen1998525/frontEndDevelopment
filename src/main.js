// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// 引入 vue 框架
import Vue from 'vue'
// js-cookie是一个简单的,轻量级的处理cookies的 js API
import Cookies from 'js-cookie'
// 引入根组件
import App from './App'
// 引入路由配置
import router from './router'
// 引入状态统一管理
import store from './store'
// Normalize.css 是一个可以定制的CSS文件，它让不同的浏览器在渲染网页元素的时候形式更统一
import 'normalize.css/normalize.css'
// 使用 element-ui 组件库
import Element from 'element-ui'
// 引入自定义修改主题色样式文件
import './styles/element-variables.scss'
import '@/styles/index.scss'
import '@/icons'
// 权限控制
import './permission'
// 全局操作过滤器
import * as filters from './filters'
// 引入 Mock 模拟数据
require('./mock/index.js')

Vue.use(Element, {
    // 设置 element-ui 默认尺寸
    size: Cookies.get('size') || 'medium',
})

// 注册全局公共过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// 关闭生产模式下给出的提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})