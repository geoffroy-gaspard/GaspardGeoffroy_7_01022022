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
            infos: {
                first_name: '',
                last_name: '',
                email: '',
                id: ''
            }
            };
        } else {
            try {
                user = JSON.parse(user);
                instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
                } catch (ex) {
                    user = {
                        userId: -1,
                        token: '',
                        infos:  {
                            first_name: '',
                            last_name: '',
                            email: '',
                            id: ''
                        }
                    };
                }
            }

const store = new Vuex.Store({
    state: {
        status: '',
        users: {},
        user: user,
        isAdmin: '',
        userInfos: {
            first_name: '',
            last_name: '',
            email: ''
          },
        post: {
            title: '',
            content: '',
            attachment: '',
            userId: ''
        },
        comment: {
            content: '',
            postId: '',
            userId: ''
        }
    },
    mutations: {
        setStatus: function(state, status) {
            state.status = status;
        },
        logUser: function(state, user) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
        },
        userInfos: function (state, userInfos) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
            state.userInfos = userInfos;
        },
        logout: function(state) {
            state.user = {
                userId: -1,
                token: '',
                infos:  {
                    first_name: '',
                    last_name: '',
                    email: '',
                    id: ''
                }
            }
            localStorage.removeItem('user');
        },
        users: function(state, users) {
            state.users = users;
        },
        allPosts: function(state, post) {
            state.post = post;
        },
        allComments: function(state, comment) {
            state.comment = comment;
        },
        isAdmin: function(state, isAdmin) {
            state.isAdmin = isAdmin;
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
            instance.get(`/users/me/${store.state.user.infos.id}`)
            .then(function (response) {
                commit('isAdmin', response.data);
            })
            .catch(function () {
            });
        },
        postComment: ({commit}, comment) => {
            instance.post(`/comments`, comment)
            .then(function (response) {
                commit('comment', response.data);
            })
            .catch(function () {              
            });
        },
        newPost: ({commit}, post) => {
            instance.post('/posts', post)
            .then(function(response) {
                commit('post', response.data);
            })
            .catch(function () {                
            });
        },
        uploadImage: ({commit}, image) => {
            instance.post('/images/uploads', image)
            .then(function(response) {
                commit('image', response.data);
                localStorage.setItem('image_url', JSON.stringify(response.data));
                window.location.reload()
            })
            .catch(function () {                
            });
        },
        deletePost: ({commit}, postId) => {
            instance.delete(`/posts/${postId}`)
            .then(function (response) {
                commit(response.data);
            })
            .catch(function () {

            });
        },
        deleteAccount: ({commit}) => {
            instance.delete('/users/me')
            .then(function(response) {
                commit(response.data);
            })
            .catch(function () {

            });
        }
    }
})

export default store;