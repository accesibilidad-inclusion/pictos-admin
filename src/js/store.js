import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        categories: [],
        status: '',
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')) || {},
    },
    mutations: {
        auth_request( state ) {
            state.status = 'loading'
        },
        auth_success( state, data ) {
            state.status = 'success'
            state.token = data.token
            state.user = data.user
        },
        auth_error( state ) {
            state.status = 'error'
        },
        logout( state ) {
            state.status = ''
            state.token = ''
            state.user = {}
        },
        setCategories( state, categories ) {
            state.categories = categories
        },
    },
    actions: {
        setCategories( { commit } ){
            return new Promise( ( resolve, reject ) => {
                axios( {
                    url: 'http://pictos-backend.lo/api/categories/list',
                    method: 'GET'
                } ).then( response => {
                    commit('setCategories', response.data)
                    resolve()
                })
            })
        },
        login( { commit, dispatch }, user ){
            return new Promise( ( resolve, reject ) => {
                commit('auth_request')
                axios( {
                    url: 'http://pictos-backend.lo/api/login',
                    data: user,
                    method: 'POST'
                } ).then( response => {
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                    Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
                    commit('auth_success', {
                        token: response.data.token,
                        user: response.data.user
                    })
                    dispatch( 'setCategories' )
                    resolve(response)
                })
                .catch(err => {
                    commit('auth_error')
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    reject(err)
                })
            })
        },
        logout( { commit } ) {
            return new Promise( ( resolve, reject ) => {
                commit('logout')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                delete axios.defaults.headers.common['Authorization']
                resolve()
            } )
        },
    },
    getters : {
        isLoggedIn: state => !!state.token,
        user: state => state.user,
        authStatus: state => state.status,
        categories: state => state.categories,
    }
})
