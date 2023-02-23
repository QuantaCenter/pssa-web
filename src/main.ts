import Vue from 'vue'
import App from "./App.vue"
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import instance from './api'
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()
Vue.prototype.$http = instance
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
