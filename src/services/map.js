import axios from './axiosInstance';

class MapService {
  getNearLocations(payload) {
    return new Promise((resolve, reject) => {
      axios.post('map/get_mapbox_suggestions', payload).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    })
  }

  getLocationDetails(payload) {
    return new Promise((resolve, reject) => {
      axios.post('map/get_location_details', payload).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    })
  }

  getLocationName(long, lat) {
    return new Promise((resolve, reject) => {
      axios.post('/map/get_location_name', { long, lat}).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }
};

export default MapService;
