import { getCaption, } from '@/utils'

// 不同 token 返回不同的用户信息
const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

export default {
    // 用户登录
    'post|/login/login': (config) => {
        // option 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性
        let token = null;
        if (config.body.indexOf("admin") != -1) {
            token = { token: 'admin-token' };
        } else if (config.body.indexOf("editor") != -1) {
            token = { token: 'editor-token' };
        }
        if (!token) {
            return {
                code: 60204,
                message: 'Account and password are incorrect.'
            }
        }
        return {
            code: 20000,
            data: token
        }
    },

    // 获取用户信息
    'get|/login/getInfo': (config) => {
        const info = users[getCaption(config.url)]
        if (!info) {
            return {
                code: 50008,
                message: 'Login failed, unable to get user details.'
            }
        }
        return {
            code: 20000,
            data: info
        }
    },

    // 退出登录
    'post|/login/logout': (config) => {
        return {
            code: 20000,
            data: 'success'
        }
    }
}