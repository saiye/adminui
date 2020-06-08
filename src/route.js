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
        redirect: '/business/list',
        hidden: true,
        meta: { requiresAuth: false }
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
                path: 'user-detail',
                name: 'sys-edit-user',
                component: () => import('./views/sys/add_user'),
                hidden: true,
                meta: {title: '用户详情', icon: 'example'},
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
                hidden: false,
                meta:{title: '添加角色', icon: 'example'},
            },
            {
                path: 'edit-role',
                name: 'sys-edit-role',
                component: () => import('./views/sys/edit_role'),
                hidden:true,
                meta:{title: '编辑权限', icon: 'example'},
            },
        ]
    },
    {
        path: '/logs',
        component: Layout,
        redirect: '/logs/action-list',
        name: 'logs',
        hidden: false,
        meta: {title: '日志管理', icon: 'example'},
        children: [
            {
                path: 'action-list',
                name: 'logs-action-list',
                component: () => import('./views/logs/action_list'),
                hidden: false,
                meta: {title: '操作日志', icon: 'example'},
            },{
                path: 'error',
                name: 'logs-error',
                component: () => import('./views/logs/error'),
                hidden: false,
                meta: {title: '系统日志', icon: 'example'},
            },
        ]
    },
    {
        path: '/business',
        component: Layout,
        name: 'business-list',
        hidden:false,
        redirect: '/business/list',
        meta: {title: '商家管理', icon: 'example'},
        children: [
            {
                path: 'list',
                name: 'business-list',
                component: () => import('./views/business/list'),
                hidden: false,
                meta: {title: '商家管理', icon: 'example'},
            },
        ]
    },
    {
        path: '/store',
        component: Layout,
        name: 'store-list',
        hidden:false,
        redirect: '/store/list',
        meta: {title: '店面管理', icon: 'example'},
        children: [
            {
                path: 'list',
                name: 'store-list',
                component: () => import('./views/store/list'),
                hidden: false,
                meta: {title: '店面管理', icon: 'example'},
            },
        ]
    },
    {
        path: '/room',
        component: Layout,
        name: 'room-list',
        hidden:false,
        redirect: '/room/list',
        meta: {title: '房间管理', icon: 'example'},
        children: [
            {
                path: 'list',
                name: 'room-list',
                component: () => import('./views/room/list'),
                hidden: false,
                meta: {title: '房间管理', icon: 'example'},
            },
        ]
    },
    {
        path: '/member',
        component: Layout,
        name: 'member-list',
        hidden:false,
        redirect: '/member/list',
        meta: {title: '会员管理', icon: 'example'},
        children: [
            {
                path: 'list',
                name: 'member-list',
                component: () => import('./views/member/list'),
                hidden: false,
                meta: {title: '房间管理', icon: 'example'},
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
