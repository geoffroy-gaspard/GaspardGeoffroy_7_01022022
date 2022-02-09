import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/'
});

let user = localStorage.getItem('user');
if (!user) {
        user = {
            userId: -1,
            token: '',
            };
        } else {
            try {
                user = JSON.parse(user);
                instance.defaults.headers.common['Authorization'] = user.token;
                } catch (ex) {
                    user = {
                        userId: -1,
                        token: '',
                    };
                }
            }

const store = new Vuex.Store({
    state: {
        status: '',
        user: user,
        userInfos: {
            first_name: '',
            last_name: '',
            email: '',
          },
    },
    mutations: {
        setStatus: function(state, status) {
            state.status = status;
        },
        logUser: function(state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
        },
        userInfos: function (state, userInfos) {
            state.userInfos = userInfos;
          },
        logout: function(state) {
            state.user = {
                userId: -1,
                token: '',
            }
            localStorage.removeItem('user');
        }
    },
    actions: {
        signUp: ({commit}, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                commit;
                instance.post('/users/sign-up', userInfos)
                .then(function (response) {
                    commit('setStatus', 'created');
                    resolve(response);
                })
                .catch(function (error) {
                    commit('setStatus', 'error_signup');
                    reject(error);
                });
            });         
        },
        login: ({commit}, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                instance.post('/users/login', userInfos)
                .then(function (response) {
                    commit('setStatus', '');
                    commit('logUser', response.data);
                    resolve(response);
                })
                .catch(function (error) {
                    commit('setStatus', 'error_login');
                    reject(error);
                });
            });         
        },
        getUserInfos: ({commit}) => {
            instance.get('/users/me')
            .then(function (response) {
                commit('userInfos', response.userInfos);
            })
            .catch(function () {
            });
        },
    }
})

export default store;