import VueRouter from 'vue-router'

import Layout from './views/layout/main.vue';

export const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import("./views/login/index"),
        hidden: true
    },
    {
        path: '/',
        redirect: '/sys/user-list',
    },
    {
        path: '/404',
        name: '404',
        component: () => import('./views/errors/404'),
        hidden: true
    },
    {
        path: '/sys',
        component: Layout,
        redirect: '/sys/user-list',
        name: 'sys',
        meta: {title: '权限管理', icon: 'example'},
        children: [
            {
                path: 'user-list',
                name: 'sys-user-list',
                component: () => import('./views/sys/user_list'),
                hidden: false
            },
            {
                path: 'add-user',
                name: 'sys-add-user',
                component: () => import('./views/sys/add_user'),
                hidden: true
            },
            {
                path: 'add-role',
                name: 'sys-add-role',
                component: () => import('./views/sys/add_role'),
                hidden: true
            },
        ]
    },
    {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new VueRouter({
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})
const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
