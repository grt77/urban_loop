import axios from './axiosInstance';

class OtpService {
  sendOtp(mobileNumber) {
    return new Promise((resolve, reject) => {
      axios.post('otp/send_otp', { mobile_number: mobileNumber }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    })
  }

  verifyOtp(mobileNumber, otp) {
    return new Promise((resolve, reject) => {
      axios.post('otp/verify_otp', { mobile_number: mobileNumber, otp: Number(otp) }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    })
  }
}

export default OtpService;