import VueRouter from 'vue-router'

import Layout from './views/layout/main.vue';

export const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import("./views/login/index"),
        hidden: true,
        meta: { requiresAuth: false }
    },
    {
        path: '/404',
        name: '404',
        component: () => import('./views/errors/404'),
        hidden: true,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        name: 'home',
        redirect: '/sys/user-list',
        hidden: true,
        meta: { requiresAuth: true}
    },
    {
        path: '/sys',
        component: Layout,
        redirect: '/sys/user-list',
        name: 'sys',
        hidden: false,
        meta: {title: '权限管理', icon: 'example'},
        children: [
            {
                path: 'user-list',
                name: 'sys-user-list',
                component: () => import('./views/sys/user_list'),
                hidden: false,
                meta: {title: '用户列表', icon: 'example'},
            },
            {
                path: 'add-user',
                name: 'sys-add-user',
                component: () => import('./views/sys/add_user'),
                hidden: false,
                meta: {title: '添加用户', icon: 'example'},
            },
            {
                path: 'role-list',
                name: 'sys-role-list',
                component: () => import('./views/sys/role_list'),
                hidden: false,
                meta: {title: '角色列表', icon: 'example'},
            },
            {
                path: 'add-role',
                name: 'sys-add-role',
                component: () => import('./views/sys/add_role'),
                hidden: true,
                meta:{title: '添加角色', icon: 'example'},
            },
        ]
    },
    {path: '*', redirect: '/404', name: 'alias-404',hidden: true}
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
