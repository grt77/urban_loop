<template>
  <div class="row login-container">
    <div class="col-xs-12 text-center">
      <img :src="images.logo" alt="Urban Loop Logo" class="urban-loop-logo" />
      <div class="form-group mt-4">
        <div v-if="isMobileNumberPage">
          <label>Mobile Number:</label>
          <input
            v-model="mobileNumber"
            class="form-control ps-3"
            type="number"
            placeholder="Enter Mobile Number"
            @input="debouncedValidateMobileNumber"
          />
          <div v-if="mobileNumberError" class="mobile-number-error-message">
            {{ mobileNumberError }}
          </div>
        </div>
        <div v-else="isMobileNumberPage">
          <label>Enter OTP:</label>
          <input
            v-model="otp"
            class="form-control ps-3"
            type="number"
            placeholder="Enter OTP"
            @input="debouncedOTP"
          />
          <div v-if="otpError" class="mobile-number-error-message">
            {{ otpError }}
          </div>
        </div>
      </div>
      <button class="btn btn-primary rounded-1 p-2 fw-bold mt-4 ps-5 pe-5" @click="handleLogin">{{ isMobileNumberPage ? 'Generate OTP' : 'Login' }}</button>
    </div>
    <div class="col-xs-12">
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { images } from '../../../assets/images';
import DriverService from '../../../services/driver.service';

const driverService = new DriverService();

export default {
  name: 'Login',
  data() {
    return {
      isMobileNumberPage: true,
      images,
      mobileNumber: null,
      otp: null,
      mobileNumberError: '',
      otpError: '',
      debouncedValidateMobileNumber: debounce(this.validateMobileNumber, 500),
      debouncedOTP: debounce(this.validateOtp, 500),
    };
  },
  methods: {
    validateMobileNumber() {
      const indianMobilePattern = /^[6-9]\d{9}$/;
      this.mobileNumberError = indianMobilePattern.test(this.mobileNumber)
        ? ''
        : 'Invalid mobile number';
    },
    validateOtp() {
      const otpRegex = /^\d{6}$/; // Regex for exactly 6 digits
      if (!otpRegex.test(this.otp)) {
        this.otpError = 'OTP must be a 6-digit number.';
      } else {
        this.otpError = '';
      }
    },
    async handleLogin() {
      if (this.isMobileNumberPage) {
        try {
          const loginDetails = await driverService.loginByMobileNumber(this.mobileNumber);
          if (loginDetails?.data?.message === 'Success') {
            this.isMobileNumberPage = false;
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const otpDetails = await driverService.verifyOtp(this.mobileNumber, this.otp);
          if (otpDetails?.data?.message === 'Validated') {
            localStorage?.setItem('authToken', otpDetails?.data?.Auth);
            this.$router.push({ name: 'DriverRideDecision'});
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};
</script>

<style lang="scss">
.login-container {
  margin-top: 40px;
  text-align: start;
  font-family: Arial, Helvetica, sans-serif;

  .form-group {
    text-align: start;

    label {
      font-weight: bold;
    }

    input.form-control {
      border-radius: 5px;
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      padding-left: 30px;
      margin: 5px 0;

      &::placeholder {
        color: rgba(0, 0, 0, 0.8);
      }

      &:focus {
        box-shadow: none;
      }
    }

    .mobile-number-error-message {
      color: #dc3545;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .urban-loop-logo {
    width: 100%;
  }
}
</style>