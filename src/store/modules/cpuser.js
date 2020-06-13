import {login, logout, getInfo} from '@/api/cpuser'
import {getToken, setToken, removeToken} from '@/tools/auth'
import {resetRouter} from '@/route'

const getDefaultState = () => {
    return {
        token: getToken(),
        user_name: '',
        user_id: '',
        avatar: '',
        role_id: '',
        email: '',
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.user_name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_USER_ID: (state, user_id) => {
        state.user_id = user_id
    },
    SET_ROLE_ID: (state, role_id) => {
        state.role_id = role_id
    },
    SET_EMAIL: (state, email) => {
        state.email = email
    },
}
const actions = {
    // user login
    login({commit}, userInfo) {
        const {user_name, password} = userInfo
        return new Promise((resolve, reject) => {
            login({user_name: user_name.trim(), password: password.trim()}).then(response => {
                commit('SET_TOKEN', response.data.token)
                setToken(response.data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            getInfo().then(response => {
                if (!response) {
                    reject('Verification failed, please Login again.')
                }
                commit('SET_NAME', response.data.user_name)
                commit('SET_AVATAR', response.data.avatar)
                commit('SET_USER_ID', response.data.user_id)
                commit('SET_ROLE_ID', response.data.role_id)
                commit('SET_EMAIL', response.data.email)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({commit, state}) {
        return new Promise((resolve, reject) => {
            logout().then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

