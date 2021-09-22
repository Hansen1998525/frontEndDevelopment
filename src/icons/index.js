import Vue from 'vue'
// 引入 SvgIcon 自定义组件
import SvgIcon from '@/components/SvgIcon'

// 全局注册 SvgIcon 组件：使用时<svg-icon />
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)

// require.context有三个参数：
// 1、directory：说明需要检索的目录
// 2、useSubdirectories：是否检索子目录
// 3、regExp: 匹配文件的正则表达式
const req = require.context('./svg', false, /\.svg$/)

requireAll(req)