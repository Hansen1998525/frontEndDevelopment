<template>
    <div>
        <svg-icon
            :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
            @click="click"
        />
    </div>
</template>
<script>
import screenfull from "screenfull";

// 全屏显示
export default {
    name: "Screenfull",
    data() {
        return {
            isFullscreen: false,
        };
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.destroy();
    },
    methods: {
        click() {
            if (!screenfull.enabled) {
                this.$message({
                    message: "您的浏览器未能工作,请检查浏览器或重新打开浏览器~",
                    type: "warning",
                });
                return false;
            }
            screenfull.toggle();
        },
        change() {
            this.isFullscreen = screenfull.isFullscreen;
        },
        init() {
            if (screenfull.enabled) {
                screenfull.on("change", this.change);
            }
        },
        destroy() {
            if (screenfull.enabled) {
                screenfull.off("change", this.change);
            }
        },
    },
};
</script>

<style scoped>
.screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
}
</style>