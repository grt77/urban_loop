<template>
  <div class="row fare-container">
    <div class="back-container">
      <font-awesome-icon icon="chevron-circle-left" title="Go Back" @click="$router.go(-1)" />
    </div>
    <div class="col-xs-12 header-container">
      <img :src="images.autoRickShaw" alt="autoRickshaw" class="rickshaw" />
      <div>
        <h2>You on</h2>
        <h2><span>Flash Ride</span></h2>
      </div>
    </div>
    <div class="col-xs-12 fare-content-container">
      <div class="estimated-fare">Estimated Fare</div>
      <div class="units">
        <span class="fare-unit"><b>Duration:</b> <span class="text-success">{{ Math.round(fairDetails?.duration_minutes) }} mins</span></span>
        <span class="fare-unit"><b>Distance:</b> <span>{{ fairDetails?.distance_km }} kms</span></span>
      </div>
      <h3><span class="me-1">₹</span>{{  Math.ceil(fairAmount) }}.00</h3>
      <div class="resend-button" @click="resendOtp()">Resend OTP</div>
    </div>
    <div class="col-xs-12 form-group">
      <input
        v-model="otp"
        class="form-control"
        :type="showOTP ? 'text' : 'password'"
        placeholder="Enter OTP"
        @input="debouncedCheckOTP"
      />
      <font-awesome-icon :icon="showOTP ? 'eye' : 'eye-slash'" class="eye-icon" @click="showOTP = !showOTP" />
      <div v-if="otpError" class="otp-error-message">
        {{ otpError }}
      </div>
    </div>
    <div class="col-xs-12 form-group">
      <button class="proceed-button" @click="verifyOtp">Proceed</button>
    </div>
    <div class="col-xs-12">
      <img :src="images.logo" alt="urban-loop-logo" class="urban-loop-logo" />
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { images } from "../../../assets/images";
import { mapGetters } from "vuex";
import OtpService from "../../../services/otp.service";
import DriverService from "../../../services/driver.service";
import { mapActions } from "vuex/dist/vuex.cjs.js";
import { toast } from "@steveyuowo/vue-hot-toast";

const otpService = new OtpService();
const driverService = new DriverService();

export default {
  name: "FareComponent",
  data() {
    return {
      fairAmount: 0,
      otp: "",
      otpError: "",
      images,
      showOTP: false,
      debouncedCheckOTP: debounce(this.validateOtp, 500),
    };
  },
  computed: {
    ...mapGetters({
      fairDetails: 'getFairDetails',
      mobileNumber: 'getMobileNumber',
    }),
  },
  mounted() {
    this.fairAmount = this.fairDetails?.fare_amount || 0;
  },
  methods: {
    ...mapActions([
      'setUserId',
      'setIsLoading',
      'setLoadingMessage'
    ]),
    validateOtp() {
      const otpRegex = /^\d{6}$/; // Regex for exactly 6 digits
      if (!otpRegex.test(this.otp)) {
        this.otpError = 'OTP must be a 6-digit number.';
      } else {
        this.otpError = '';
      }
    },
    async verifyOtp() {
      try {
        this.setIsLoading(true);
        this.setLoadingMessage('Validating your OTP, please wait...');
        const otpResult = await otpService.verifyOtp(this.mobileNumber, Number(this.otp));
        if (otpResult) {
          localStorage.setItem('accessToken', otpResult?.data?.auth || otpResult?.data?.Auth);
          this.getUserDetails();
          this.$router.push({ name: 'UserRideConfirmationWaiting' });
        }
      } catch (error) {
        toast.error('OTP validation failed. Please try again.');
      } finally {
        this.setIsLoading(false);
        this.setLoadingMessage('');
      }
    },
    async resendOtp() {
      try {
        const otpResponse = await otpService.sendOtp(this.mobileNumber);
        if (otpResponse) {
          toast.success(`OTP Resend on ${this.mobileNumber}`);
        }
      } catch (error) {
        toast.error('Failed to resend otp');
      }
    },
    async getUserDetails() {
      try {
        const userDetails = await driverService.getDriverDetails(this.mobileNumber);
        if (userDetails) {
          this.setUserId(userDetails?.data?.id?.id || userDetails?.data?.id);
        }
      } catch (error) {
        toast.error('Failed to fetch user details');
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.fare-container {
  position: relative;
  .back-container {
    display: flex;
    justify-content: left;
    margin-left: 12px;
    cursor: pointer;

    .fa-circle-chevron-left {
      font-size: 30px;
      cursor: pointer;
    }
  }

  .otp-error-message {
    color: #dc3545;
    font-size: 14px;
    font-weight: 500;
  }

  .header-container {
    display: flex;
    align-items: end;
    margin-top: -15px;

    .rickshaw {
      width: 70px;
      margin-right: 20px;
      margin-bottom: 5px;
    }

    h2 {
      font-family: "Bangers";
      font-size: 25px;
      margin-bottom: 0;

      span {
        font-size: 40px;
      }
    }
  }

  .fare-content-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 60px;
    padding: 0;
    width: 110%;

    .estimated-fare {
      font-size: 20px;
      font-weight: 600;
      font-family: Arial, Helvetica, sans-serif;
    }

    .units {
      margin-top: 10px;
      display: flex;
      flex-direction: row;

      .fare-unit {
        display: block;
        width: 50%;
        margin-right: 3px;
        font-size: 15px;

        span {
          color: green;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }

    h3 {
      margin: 18px 0 0;
      text-align: center;
      font-size: 40px;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
    }

    .resend-button {
      text-align: end;
      font-size: 14px;
      margin: 35px 0 5px;
      margin-right: 17px;
      cursor: pointer;
      font-weight: 500;
      color: #0b27c7;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .form-group {
    position: relative;

    .eye-icon {
      position: absolute;
      right: 25px;
      top: 17px;
      cursor: pointer;
      color: grey;
      z-index: 99;
    }

    .form-control {
      border-radius: 5px;
      margin: 5px 0;
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      letter-spacing: 2px;

      &::placeholder {
        color: rgba(0, 0, 0, 0.8);
      }

      &:focus {
        box-shadow: none;
      }
    }

    .proceed-button {
      width: 100%;
      background-color: #2d9bf0;
      color: white;
      margin-top: 10px;
      border-radius: 5px;
    }
  }

  .urban-loop-logo {
    margin-top: 50px;
    width: 100%;
  }
}
</style>
