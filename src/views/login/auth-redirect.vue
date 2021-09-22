<script>
export default {
    name: "AuthRedirect",
    created() {
        const hash = window.location.search.slice(1);
        if (window.localStorage) {
            window.localStorage.setItem("x-admin-oauth-code", hash);
            window.close();
        }
    },
    render: function (h) {
        // 避免警告信息
        return h();
    },
};
</script>