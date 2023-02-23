import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from "../views/Login.vue"
import NoFound from "../views/NoFound.vue"
import PageContainer from '../components/PageContainer.vue'
import SubPageContainer from '../components/SubPageContainer.vue'
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'index',
        component: PageContainer,
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'index',
                //component: () => import("../views/MeetingIndex.vue")
                component: SubPageContainer,
                redirect: '/index/list',
                children: [
                    {
                        path: '/index/list',
                        name: 'indexList',
                        component: () => import('../views/MeetingIndex.vue')
                    },
                    {
                        path: '/index/detail',
                        name: 'meetingDetail',
                        component: () => import('../views/MeetingDetail.vue')
                    },
                    {
                        path: '/index/checkLeave',
                        name: 'indexCheckLeave',
                        component: () => import('../views/LeaveCheck.vue')
                    },
                    {
                        path: '/index/attend',
                        name: 'indexAttend',
                       component: () => import('../views/MeetingAttend.vue')
                    },
                    {
                        path: '/index/sign',
                        name:'indexSign',
                        component: () => import('../views/SignList.vue')
                    }
                ]
            },
            {
                path: '/publish',
                name: 'publish',
                component: () => import('../views/Publish.vue')
            },
            {
                path: '/audit',
                name: 'audit',
                component: SubPageContainer,
                redirect: '/audit/List',
                children: [
                    {
                        path: '/audit/List',
                        name: 'AuditList',
                        component: () => import('../views/MeetingAudit.vue')
                    },
                    {
                        path: '/audit/detail',
                        name: 'AuditDetail',
                        component: () => import('../views/MeetingDetail.vue')
                    }
                ]
            },
            {
                path: '/check',
                name: 'check',
                component: SubPageContainer,
                redirect: '/check/List',
                children: [
                    {
                        path: '/check/List',
                        name: 'checkList' ,
                        component: () => import('../views/MeetingCheck.vue')
                    }
                ]
            },
            {
                path: '/attend',
                name: 'attend',
                component: SubPageContainer,
                redirect: '/attend/index',
                children: [
                    {
                        path: '/attend/index',
                        name: 'AttendIndex',
                        component: () => import('../views/Attend.vue')
                    },
                    {
                        path: '/attend/detail',
                        name: 'AttendDetail',
                        component: () => import('../views/AttendDetail.vue')
                    }
                ]
            },
            {
                path: '/view',
                name: 'view',
                redirect: '/view/index',
                component: SubPageContainer,
                children: [
                    {
                        path: '/view/index',
                        name: 'viewIndex',
                        component: () => import('../views/checkView.vue')
                    },
                    {
                        path: '/view/detail',
                        name: 'viewDetail',
                        component: () => import('../views/UnitMeeting.vue')
                    },
                    
                ]
            }
        ]
    },
    {
        path: '*',
        name: 'NoFound',
        component: NoFound
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
