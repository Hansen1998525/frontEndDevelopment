<script>
export default {
    created() {
        const { params, query } = this.$route;
        const { path } = params;
        this.$router.replace({ path: "/" + path, query }, () => {});
    },
    render: function (h) {
        // 避免警告信息
        return h();
    },
};
</script>