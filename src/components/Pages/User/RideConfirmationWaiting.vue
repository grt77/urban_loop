<template>
  <div class="row driver-confirmation-waiting-container">
    <div class="col-xs-12 header-container">
      <img :src="images.autoRickShaw" alt="autoRickshaw" class="rickshaw" />
      <h2>Getting Your <span>FLASH RIDE</span></h2>
    </div>
    <div class="col-xs-12 waiting-driver-content">
      <div class="estimated-fair">Waiting for Driver's Confirmation</div>
    </div>
    <div class="col-xs-12 form-group">
      <button class="cancel-request-btn">Cancel Request</button>
    </div>
    <div class="col-xs-12">
      <img :src="images.logo" alt="urban-loop-logo" class="urban-loop-logo" />
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { images } from '../../../assets/images';

export default {
  name: 'RideConfirmationWaiting',
  data() {
    return {
      otp: '',
      otpError: '',
      images,
      debouncedCheckOTP: debounce(this.validateOtp, 500),
    };
  },
  methods: {
    validateOtp() {
      console.log('test');
    }
  }
};
</script>

<style lang="scss">
.driver-confirmation-waiting-container {
  margin-top: 50px;

  .header-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0;

    .rickshaw {
      width: 70px;
      z-index: 1;
      margin-bottom: 30px;
    }

    h2 {
      font-family: 'Bangers';
      margin-bottom: 0;
      font-size: 20px;
      width: 50%;

      span {
        font-size: 35px;
      }
    }
  }

  .waiting-driver-content {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 80px;

    .estimated-fair {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      font-family: Arial, Helvetica, sans-serif;
    }
  }

  .form-group {
    .urban-loop-logo {
      width: 100%;
    }

    .cancel-request-btn {
      width: 100%;
      background-color: #2D9BF0;
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
