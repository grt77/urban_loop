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

  getActiveRides(mobileNumber) {
    return new Promise((resolve, reject) => {
      axios.post('/driver/get_present_rides', { mobile_number: mobileNumber }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  acceptRideById(rideId, driver_id) {
    return new Promise((resolve, reject) => {
      axios.post('driver/accept_ride_id_reject_rem', { ride_id: rideId, driver_id }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  rejectRideById(rideId) {
    return new Promise((resolve, reject) => {
      axios.post('ride/cancel_ride', { ride_id: rideId }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  stratRide(rideId) {
    return new Promise((resolve, reject) => {
      axios.post('driver/startRide', { ride_id: rideId }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  endRide(rideId) {
    return new Promise((resolve, reject) => {
      axios.post('driver/ride_complete', { ride_id: rideId }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  } 

  // driver/getdriverride_info
  rideInfo(mobile_num) {
    return new Promise((resolve, reject) => {
      axios.post('driver/getdriverride_info', { mobile_num }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  } 

  getDriverId(mobile_num) {
    return new Promise((resolve, reject) => {
      axios.post('driver/get_driver_id', { mobile_num }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  isValidDriver(driver_id) {
    return new Promise((resolve, reject) => {
      axios.post('driver/check_valid_driver', { driver_id }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}

export default DriverService;