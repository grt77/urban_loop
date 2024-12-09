import { createStore } from 'vuex';
import { SET_DESTINATION_DETAILS, SET_DRIVER_ACTIVE_DETAILS, SET_FAIR_DETAILS, SET_MOBILE_NUMBER, SET_SOURCE_DETAILS, SET_USER_ID } from './mutation-types';

const store = createStore({
  state: {
    fairDetails: {},
    currentMobileNumber: 0,
    driverId: '973239d3-a8f3-11ef-992f-06e09a310733',
    userId: null,
    sourceDetails: {},
    destinationDetails: {},
    driverActiveRideDetails: {},
  },
  mutations: {
    [SET_FAIR_DETAILS](state, payload) {
      state.fairDetails = payload;
    },
    [SET_MOBILE_NUMBER](state, payload) {
      state.currentMobileNumber = payload;
    },
    [SET_SOURCE_DETAILS](state, payload) {
      state.sourceDetails = payload;
    },
    [SET_DESTINATION_DETAILS](state, payload) {
      state.destinationDetails = payload;
    },
    [SET_USER_ID](state, payload) {
      state.userId = payload;
    },
    [SET_DRIVER_ACTIVE_DETAILS](state, payload) {
      state.driverActiveRideDetails = payload;
    }
  },
  actions: {
    setFairDetails({ commit }, payload) {
      commit(SET_FAIR_DETAILS, payload);
    },
    setMobileNumber({ commit }, payload) {
      commit(SET_MOBILE_NUMBER, payload);
    },
    setSourceDetails({ commit }, payload) {
      commit(SET_SOURCE_DETAILS, payload);
    },
    setDestinationDetails({ commit }, payload) {
      commit(SET_DESTINATION_DETAILS, payload);
    },
    setUserId({ commit }, payload) {
      commit(SET_USER_ID, payload);
    },
    setDriverActiveRideDetails({ commit }, payload) {
      commit(SET_DRIVER_ACTIVE_DETAILS, payload);
    },
  },
  getters: {
    getFairDetails: (state) => {
      return state.fairDetails;
    },
    getMobileNumber: (state) => {
      return state.currentMobileNumber;
    },
    getSourceDetails: (state) => {
      return state.sourceDetails;
    },
    getDestinationDetails: (state) => {
      return state.destinationDetails;
    },
    getDriverId: (state) => {
      return state.driverId;
    },
    getUserId: (state) => {
      return state.driverId;
    },
    getDriverActiveRideDetails: (state) => {
      return state.driverActiveRideDetails;
    },
  }
});

export default store;
