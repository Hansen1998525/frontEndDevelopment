// 验证相关的方法

/**
 * 判断是否外的图标、链接、邮件地址等
 * @param {*} path :string
 * @returns boolean
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 验证用户名是不是 admin 或 editor 中的某一个
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}