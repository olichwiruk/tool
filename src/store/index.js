import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);


export default new Vuex.Store({
  namespaced: true,
  modules,
  strict: process.env.NODE_ENV !== 'production'
});
