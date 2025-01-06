<template>
  <div class="row login-container">
    <div class="col-xs-12 text-center">
      <img :src="images.logo" alt="Urban Loop Logo" class="urban-loop-logo" />
      <section v-if="isMobileNumberPage" class="col-xs-12 form-group text-start fw-bold mt-1">
        <label for="mobileNumber">Mobile Number:</label>
        <div class="input-group">
          <label class="input-group-text" for="driverMobileNumber">+91</label>
          <input
            id="driverMobileNumber"
            v-model="mobileNumber"
            class="form-control ps-3"
            type="text"
            placeholder="Enter Mobile Number"
            @input="debouncedValidateMobileNumber"
          />
        </div>
        <div v-if="mobileNumberError" class="mobile-number-error-message">
          {{ mobileNumberError }}
        </div>
      </section>
      <section v-else class="col-xs-12 form-group text-start fw-bold mt-1">
        <label for="mobileNumber">Enter OTP:</label>
        <div class="input-group">
          <input
            v-model="otp"
            class="form-control ps-3 input-otp"
            :type="showOTP ? 'text' : 'password'"
            placeholder="Enter OTP"
            @input="debouncedOTP"
          />
          <font-awesome-icon :icon="showOTP ? 'eye' : 'eye-slash'" class="eye-icon" @click="showOTP = !showOTP" />
        </div>
        <div v-if="otpError" class="mobile-number-error-message">
          {{ otpError }}
        </div>
      </section>
      <button v-if="isMobileNumberPage" class="btn btn-primary rounded-1 p-2 fw-bold mt-4 ps-5 pe-5" :class="!isMobileNumberValid ? 'disabled' : ''" :disabled="!isMobileNumberValid" @click="handleLogin">Generate OTP</button>
      <button v-else class="btn btn-primary rounded-1 p-2 fw-bold mt-4 ps-5 pe-5" :disabled="!isOTPValid" :class="!isOTPValid ? 'disabled' : ''" @click="handleLogin">Login</button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { images } from '../../../assets/images';
import DriverService from '../../../services/driver.service';
import { mapActions } from 'vuex';
import { toast } from '@steveyuowo/vue-hot-toast';
import { setItemInLocalStorage } from '../../../utils/helper';

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
      isMobileNumberValid: false,
      isOTPValid: false,
      otpError: '',
      showOTP: false,
      debouncedValidateMobileNumber: debounce(this.validateMobileNumber, 500),
      debouncedOTP: debounce(this.validateOtp, 500),
    };
  },
  methods: {
    ...mapActions([
      'setDriverMobileNumber',
      'setIsLoading',
      'setLoadingMessage'
    ]),
    validateMobileNumber() {
      const indianMobilePattern = /^[6-9]\d{9}$/;
      this.mobileNumberError = indianMobilePattern.test(this.mobileNumber)
        ? ''
        : 'Invalid mobile number';
      this.isMobileNumberValid = indianMobilePattern.test(this.mobileNumber);
    },
    validateOtp() {
      const otpRegex = /^\d{6}$/; // Regex for exactly 6 digits
      if (!otpRegex.test(this.otp)) {
        this.otpError = 'OTP must be a 6-digit number.';
        this.isOTPValid = false;
      } else {
        this.otpError = '';
        this.isOTPValid = true;
      }
    },
    async handleLogin() {
      if (this.isMobileNumberPage) {
        try {
          this.setIsLoading(true);
          this.setLoadingMessage('Processing your login request. Sending OTP...');
          const loginDetails = await driverService.loginByMobileNumber(this.mobileNumber);
          if (loginDetails?.data?.message === 'Success') {
            this.isMobileNumberPage = false;
          }
        } catch (error) {
          console.log(error);
          toast.error('Failed to send OTP. Please try again.');
        } finally {
          this.setIsLoading(false);
          this.setLoadingMessage('');
        }
      } else {
        try {
          this.setIsLoading(true);
          this.setLoadingMessage('Validating your OTP, please wait...');
          const otpDetails = await driverService.verifyOtp(this.mobileNumber, Number(this.otp));
          if (otpDetails?.data?.message === 'Validated') {
            localStorage?.setItem('accessToken', otpDetails?.data?.Auth);
            setItemInLocalStorage('driver_mobile_number', this.mobileNumber);
            this.setDriverMobileNumber(this.mobileNumber);
            this.$router.push({ name: 'DriverRideDecision'});
          }
        } catch (error) {
          console.log(error);
          toast.error('Invalid OTP. Please try again')
        } finally {
          this.setIsLoading(false);
          this.setLoadingMessage('');
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

    .input-group-text {
      padding: 10px;
      font-size: 14px;
      height: 41px;
      margin-top: 5px;
      border-radius: 0;
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      border-right: 0px;
      font-weight: 500;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    .eye-icon {
      position: absolute;
      right: 10px;
      top: 17px;
      cursor: pointer;
      color: grey;
      z-index: 99;
    }

    input.form-control {
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      padding-left: 10px !important;
      margin: 0px;
      margin-top: 5px;

      &::placeholder {
        color: rgba(0, 0, 0, 0.8);
      }

      &:focus {
        box-shadow: none;
      }
    }

    .input-otp {
      border-radius: 5px !important;
      letter-spacing: 2px !important;
    }

    .mobile-number-error-message {
      color: #dc3545;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .btn {

  }
  
  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: unset;
  }

  .urban-loop-logo {
    width: 100%;
  }
}
</style>