<template>
  <div class="row fare-container">
    <div class="back-container">
      <font-awesome-icon icon="chevron-circle-left" title="Go Back" @click="$router.go(-1)" />
    </div>
    <div class="col-xs-12 header-container">
      <img :src="images.autoRickShaw" alt="autoRickshaw" class="rickshaw" />
      <h2>FLASH RIDE</h2>
    </div>
    <div class="col-xs-12 fare-content-container">
      <div class="estimated-fare">Estimated Fare</div>
      <span style="font-size: 10px;">Duration: {{ fairDetails?.duration_minutes }} min</span>
      <span style="font-size: 10px;">Distance: {{ fairDetails?.distance_km }} km</span>
      <h3>{{  fairAmount }} /-</h3>
      <div class="resend-button">Resend OTP</div>
    </div>
    <div class="col-xs-12 form-group">
      <input
        v-model="otp"
        class="form-control"
        type="number"
        placeholder="Enter OTP"
        @input="debouncedCheckOTP"
      />
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
        const otpResult = await otpService.verifyOtp(this.mobileNumber, this.otp);
        if (otpResult) {
          localStorage.setItem('authToken', otpResult?.data?.auth || otpResult?.data?.Auth);
          this.getUserDetails();
          this.$router.push({ name: 'UserRideConfirmationWaiting' });
        }
      } catch (error) {
        console.log(error); 
      }
    },
    async getUserDetails() {
      try {
        const userDetails = await driverService.getDriverDetails(this.mobileNumber);
        if (userDetails) {
          this.setUserId(userDetails?.data?.id);
        }
      } catch (error) {
        console.log(error); 
      }
    }
  },
};
</script>

<style lang="scss">
.fare-container {
  .back-container {
    display: flex;
    justify-content: left;
    margin-bottom: 20px;

    .fa-circle-chevron-left {
      font-size: 35px;
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
    align-items: center;

    .rickshaw {
      width: 70px;
      margin-right: 20px;
    }

    h2 {
      font-family: "Bangers";
      font-size: 40px;
      margin-bottom: 0;
    }
  }

  .fare-content-container {
    display: flex;
    flex-direction: column;
    text-align: start;
    margin-top: 80px;

    .estimated-fare {
      font-size: 17px;
      font-weight: 600;
      font-family: Arial, Helvetica, sans-serif;
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
      margin: 10px 0;
      cursor: pointer;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .form-group {
    .form-control[type="number"] {
      border-radius: 5px;
      margin: 5px 0;
      border: 2.5px solid rgba(0, 0, 0, 0.8);

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
    margin-top: 80px;
    width: 100%;
  }
}
</style>
