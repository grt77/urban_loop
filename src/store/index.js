import { createStore } from 'vuex';
import { SET_DESTINATION_DETAILS, SET_DRIVER_ACTIVE_DETAILS, SET_DRIVER_ID, SET_DRIVER_MOBILE_NUMBER, SET_FAIR_DETAILS, SET_MOBILE_NUMBER, SET_SOURCE_DETAILS, SET_USER_ID, SET_USER_RIDE_INFO } from './mutation-types';

const store = createStore({
  state: {
    fairDetails: {},
    currentMobileNumber: 0,
    driverId: '',
    userId: null,
    sourceDetails: {},
    destinationDetails: {},
    driverActiveRideDetails: {},
    userRideInfo: {},
    driverMobileNumber: null,
  },
  mutations: {
    [SET_FAIR_DETAILS](state, payload) {
      state.fairDetails = payload;
    },
    [SET_DRIVER_ID](state, payload) {
      state.driverId = payload;
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
    },
    [SET_USER_RIDE_INFO](state, payload) {
      state.userRideInfo = payload;
    },
    [SET_DRIVER_MOBILE_NUMBER](state, payload) {
      state.driverMobileNumber = payload;
    },
  },
  actions: {
    setFairDetails({ commit }, payload) {
      commit(SET_FAIR_DETAILS, payload);
    },
    setDriverId({ commit }, payload) {
      commit(SET_DRIVER_ID, payload);
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
    setUserRideInfo({ commit }, payload) {
      commit(SET_USER_RIDE_INFO, payload);
    },
    setDriverMobileNumber({ commit }, payload) {
      commit(SET_DRIVER_MOBILE_NUMBER, payload);
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
    getUserRideInfo: (state) => {
      return state.userRideInfo;
    },
    getDriverMobileNumber: (state) => {
      return state.driverMobileNumber;
    },
  }
});

export default store;
