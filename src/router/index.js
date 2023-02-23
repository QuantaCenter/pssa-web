import router from './router';
import Vue from 'vue';
let tipsVue = new Vue();
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        sessionStorage.removeItem("userId");
        next();
    }
    else {
        if (!sessionStorage.getItem("userId") && to.path !== '/login') {
            if (from.path !== '/') {
                tipsVue.$message.warning("请先登录");
            }
            next('/login');
        }
        else {
            next();
        }
    }
});
export default router;
//# sourceMappingURL=index.js.map