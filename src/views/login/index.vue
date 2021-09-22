<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">欢迎使用关务订单系统</h3>
            </div>

            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="请输入系统账号"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                />
            </el-form-item>

            <el-tooltip
                v-model="capsTooltip"
                content="大写锁定已开启"
                placement="right"
                manual
            >
                <el-form-item prop="password">
                    <span class="svg-container">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="请输入系统密码"
                        name="password"
                        tabindex="2"
                        autocomplete="on"
                        @keyup.native="checkCapslock"
                        @blur="capsTooltip = false"
                        @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon
                            :icon-class="
                                passwordType === 'password' ? 'eye' : 'eye-open'
                            "
                        />
                    </span>
                </el-form-item>
            </el-tooltip>

            <el-button
                :loading="loading"
                type="primary"
                style="width: 100%; margin-bottom: 30px"
                @click.native.prevent="handleLogin"
            >
                登录
            </el-button>
        </el-form>
    </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
    name: "login",
    data() {
        // 验证
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error("请输入正确的用户名:admin / editor"));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error("密码不能少于6位"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: "admin",
                password: "111111",
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateUsername,
                    },
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validatePassword,
                    },
                ],
            },
            passwordType: "password",
            capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {},
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query;
                if (query) {
                    this.redirect = query.redirect;
                    this.otherQuery = this.getOtherQuery(query);
                }
            },
            immediate: true,
        },
    },

    // 页面创建
    created() {},
    mounted() {
        if (this.loginForm.username === "") {
            this.$refs.username.focus();
        } else if (this.loginForm.password === "") {
            this.$refs.password.focus();
        }
    },

    methods: {
        checkCapslock(e) {
            const { key } = e;
            this.capsTooltip =
                key && key.length === 1 && key >= "A" && key <= "Z";
        },
        // 密码的显示与隐藏
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        // 登录
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("login/login", this.loginForm)
                        .then(() => {
                            // 如下写法会有报错，解决方案：在push()后面接一个.catch(()=>{})可解决报错：https://github.com/armour/vue-typescript-admin-template/issues/150
                            this.$router
                                .push({
                                    path: this.redirect || "/",
                                    query: this.otherQuery,
                                })
                                .catch(() => {});
                            this.loading = false;
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== "redirect") {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        },
    },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

// 重置 Element-ui 样式
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;
            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$svg_yellow: yellow;
$light_gray: #fff;

.login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-image: url("~@/assets/login.png");

    // 主登录区域
    .login-form {
        // 水平居中
        margin: 0 auto;
        // 右上实现切角效果和透明效果
        // background: linear-gradient(
        //     135deg,
        //     transparent 20px,
        //     rgba(243, 243, 243, 0.096) 0
        // );
        border-radius: 10px;
        background: #0083ff;
        // 添加阴影效果
        -moz-box-shadow: 2px 0px 10px #909090;
        -webkit-box-shadow: 0px 2px 10px #909090;
        box-shadow: 2px 0px 10px #909090;
        // 垂直居中
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        /* 大屏幕 ：大于等于1200px*/
        @media (min-width: 1200px) {
            width: 500px;
            padding: 50px;
        }
        /*默认*/
        @media (min-width: 980px) {
            width: 400px;
            padding: 50px 40px;
        }
        /* 平板电脑和小屏电脑之间的分辨率 */
        @media (min-width: 768px) and (max-width: 979px) {
            width: 400px;
            padding: 50px 40px;
        }
        /* 横向放置的手机和竖向放置的平板之间的分辨率 */
        @media (max-width: 767px) {
            width: 400px;
            padding: 50px 30px;
        }
        /* 横向放置的手机及分辨率更小的设备 */
        @media (max-width: 480px) {
            width: 400px;
            padding: 50px 30px;
        }
    }
    // 图标样式
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $svg_yellow;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }
    // 欢迎使用关务订单系统提示文字样式
    .title-container {
        position: relative;
        .title {
            font-size: 23.5px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }
    // 密码的显示与隐藏
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $svg_yellow;
        cursor: pointer;
        user-select: none;
    }
}
</style>