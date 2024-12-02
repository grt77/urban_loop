<template>
  <div class="row fare-container">
    <div class="back-container">
      <font-awesome-icon icon="chevron-circle-left" title="Go Back" />
    </div>
    <div class="col-xs-12 header-container">
      <img :src="images.autoRickShaw" alt="autoRickshaw" class="rickshaw" />
      <h2>FLASH RIDE</h2>
    </div>
    <div class="col-xs-12 fare-content-container">
      <div class="estimated-fare">Estimated Fare</div>
      <h3>120 /-</h3>
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
      <button class="proceed-button" @click="$router.push({ name: 'WaitingDriverConfirmation' })">Proceed</button>
    </div>
    <div class="col-xs-12">
      <img :src="images.logo" alt="urban-loop-logo" class="urban-loop-logo" />
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { images } from "../../../assets/images";

export default {
  name: "FareComponent",
  data() {
    return {
      otp: "",
      otpError: "",
      images,
      debouncedCheckOTP: debounce(this.validateOtp, 500),
    };
  },
  methods: {
    validateOtp() {
      console.log("Validate OTP logic here");
    },
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
