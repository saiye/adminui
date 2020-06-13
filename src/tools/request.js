import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store/index'
import {getToken} from './auth'

// create an axios instance
const service = axios.create({
   // baseURL: process.env.APP_BASE_API, // url = base url + request url
    baseURL:'/api', // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Accept'] ='application/json';
       if (store.getters.token) {
           config.headers['Authorization'] ='Bearer '+getToken();
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(

    response => {
        const res = response.data
        if (res.message||res.code!==1) {
            let type='error';
            switch(res.code){
                case 1:
                    type='success';
                    break;
            }
            Message({
                message: res.message || 'Error',
                type: type,
                duration: 5 * 1000
            })
        }
        // if the custom code is not 20000, it is judged as an error.
        if (res.code!==1) {
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('您已经登出，您可以取消以停留在此页面，或再次登录', '确认退出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('cpuser/resetToken').then(() => {
                        location.reload()
                    })
                }).catch(err=>{
                    console.log(err);
                })
            }
          return   Promise.reject(new Error(res.message || 'Error'))
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
