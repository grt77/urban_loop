import axios from './axiosInstance';

class UserService {
  getUserDetails(mobileNumber) {
    return new Promise((resolve, reject) => {
      axios.post('/ride/get_rider_id', { mbno: mobileNumber}).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}

export default UserService;