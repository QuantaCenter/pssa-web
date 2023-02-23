import Vue from 'vue'

declare module "vue/types/vue" {
    interface Vue {
        $bus: Vue;
        $http: any;
        [propName: any]: any;
    }
}
