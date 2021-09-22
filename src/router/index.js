// https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E9%85%8D%E7%BD%AE%E9%A1%B9
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

// 不需要动态判断权限的路由，如登录页、404、等通用页面
export const constantRoutes = [
    // *不需要基于 Layout 的页面
    {
        path: '/login',
        component: () => import('@/views/login'),
        name: 'Login',
        hidden: true,
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect'),
        name: 'AuthRedirect',
        hidden: true,
    },
    // 重定向页面
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index'),
                name: 'Redirect',
            }
        ],
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: { title: '仪表盘', icon: 'dashboard', },
            }
        ],
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        hidden: true,
        children: [
            {
                path: 'index',
                component: () => import('@/views/profile/index'),
                name: 'Profile',
                meta: { title: '个人中心', icon: 'user', noCache: true },
            }
        ],
    },
]

// 需求动态判断权限并通过 addRoutes 动态添加的页面
export const asyncRoutes = [
    {
        path: '/error',
        component: Layout,
        redirect: 'noRedirect',
        name: 'ErrorPages',
        meta: {
            title: '错误页面',
            icon: '404'
        },
        children: [
            {
                path: '401',
                component: () => import('@/views/error-page/401'),
                name: 'Page401',
                meta: {
                    title: '401页面(admint和editor)',
                    roles: ['admin'],
                    noCache: true
                }
            },
            {
                path: '404',
                component: () => import('@/views/error-page/404'),
                name: 'Page404',
                meta: {
                    title: '404页面(editor)',
                    roles: ['editor'],
                    noCache: true
                }
            }
        ]
    },
    // 注：注意事项 这里有一个需要非常注意的地方就是 404 页面一定要最后加载
    // 如果放在 constantRoutes 一同声明了 404 ，后面的所有页面都会被拦截到404 
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
})

const router = createRouter()

export default router

// *动态清除注册的路由:https://juejin.cn/post/6844903840626507784#heading-4
export function resetRouter() {
    const newRouter = createRouter()
    // 重置路由
    router.matcher = newRouter.matcher
}