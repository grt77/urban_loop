import axios from './axiosInstance';

class DriverService {
  getDriverVerifiedDetails(driverId) {
    return new Promise((resolve, reject) => {
      axios.post('ride/get_driver_verified_details', { driver_id: driverId}).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  getDriverDetails(mobileNumber) {
    return new Promise((resolve, reject) => {
      axios.post('ride/get_rider_id', { mbno: mobileNumber}).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  createRide(payload) {
    return new Promise((resolve, reject) => {
      axios.post('ride/create_ride', payload).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  loginByMobileNumber(mobileNumber) {
    return new Promise((resolve, reject) => {
      axios.post('driver/send_otp', { mobile_number: mobileNumber}).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  verifyOtp(mobileNumber, otp) {
    return new Promise((resolve, reject) => {
      axios.post('driver/verify_otp', { mobile_number: mobileNumber, otp }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}

export default DriverService;