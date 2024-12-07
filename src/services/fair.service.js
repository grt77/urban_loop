import axios from './axiosInstance';

class FairService {
  getAutoFare(payload) {
    return new Promise((resolve, reject) => {
      axios.post('fare/get_auto_fare', payload).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}

export default FairService;