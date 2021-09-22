import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'              // 进度条
import 'nprogress/nprogress.css'               // 进度条样式
import { getToken } from '@/utils/auth'        // 从cookie中获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })    // NProgress配置
const whiteList = ['/login', '/auth-redirect'] // 不用重定向白名单

router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()
    // 设置页面标题
    document.title = getPageTitle(to.meta.title)
    // 判断用户是否已经登录
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            // 如果已登录，则重定向到主页
            next({ path: '/' })
            // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
            NProgress.done()
        } else {
            // 判断用户是否通过getInfo获得了权限角色
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    // 获取用户信息
                    // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
                    const { roles } = await store.dispatch('login/getInfo')
                    // 生成基于角色的可访问路由
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                    // 动态添加可访问路由
                    router.addRoutes(accessRoutes)
                    // hack 方法来确保 addroues 是完整的
                    // 设置 replace: true，这样导航就不会留下历史记录
                    next({ ...to, replace: true })
                } catch (error) {
                    // 移除令牌，到登录页面重新登录
                    await store.dispatch('login/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* 没有令牌 */

        if (whiteList.indexOf(to.path) !== -1) {
            // 在登录白名单，直接下一步
            next()
        } else {
            // 其他没有访问权限的页面被重定向到登录页面
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 完成进度条
    NProgress.done()
})