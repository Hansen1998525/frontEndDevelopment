<template>
    <section class="app-main">
        <!-- 文档：https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/layout.html#app-main -->
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <!-- 在 router-view 上加上一个唯一的 key，来保证路由切换时都会重新渲染触发钩子了 -->
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>

<script>
export default {
    name: "AppMain",
    computed: {
        cachedViews() {
            return this.$store.state.tagsView.cachedViews;
        },
        key() {
            return this.$route.path;
        },
    },
};
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.fixed-header + .app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
        padding-top: 84px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>