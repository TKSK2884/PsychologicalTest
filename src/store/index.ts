import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        progressToken: undefined,
        accesToken: undefined,
        userId: undefined,
    },
    getters: {
        getProgressToken(state) {
            return state.progressToken;
        },
        getAccessToken(state) {
            return state.accesToken;
        },
    },
    mutations: {
        setProgressToken(state, token) {
            state.progressToken = token;
        },
        setAccessToken(state, token) {
            state.accesToken = token;
        },
        setUserId(state, id) {
            state.userId = id;
        },
    },
    actions: {},
    modules: {},
});
