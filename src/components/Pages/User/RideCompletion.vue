<template>
  <div class="row ride-completion-container">
    <div class="col-xs-12 header-container">
      <img :src="images.autoRickShaw" alt="Auto Rickshaw" class="auto-image" />
    </div>
    <div class="col-xs-12 footer">
      <div class="thanks-message">Thanks for choosing</div>
      <img :src="images.logo" alt="Urban Loop Logo" class="urban-loop-logo" />
    </div>
    <div class="col-xs-12 ride-completion-content">
      <span>Please pay the total amount to the driver</span>
      <h2>₹&nbsp;{{ fairDetails?.fare_amount }}.00</h2>
    </div>
    <div class="col-xs-12 driver-info-container">
      <h6>Driver Info</h6>
      <div><span>Name:</span> Rajesh Singh</div>
      <div><span>Phone No:</span> +917986209818</div>
      <div><span>Vehicle No:</span> K26A1234</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { images } from '../../../assets/images';

export default {
  name: 'RideCompletion',
  data() {
    return {
      images,
    };
  },
  computed: {
    ...mapGetters({
      fairDetails: 'getFairDetails',
    })
  }
};
</script>

<style lang="scss">
.ride-completion-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 50px;
  font-family: Arial, Helvetica, sans-serif;

  .header-container {
    display: flex;
    justify-content: center;
    width: 100%;

    .auto-image {
      width: 120px;
    }
  }

  .bot-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;

    .flying-bot {
      width: 180px;
    }
  }

  .ride-completion-content {
    text-align: center;
    margin-top: 40px;

    span {
      font-size: 20px;
      font-weight: 500;
      color: #333;
    }

    h2 {
      font-size: 28px;
      font-weight: bold;
      margin-top: 10px;
    }
  }

  .footer {
    margin-top: 40px;
    text-align: center;

    .thanks-message {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #555;
    }

    .urban-loop-logo {
      width: 100%;
    }
  }

  .driver-info-container {
    border: 1px solid;
    border-radius: 5px;
    padding: 10px;
    width: 75%;
    font-size: 11px;

    h6 {
      font-weight: bold;
    }
  }
}
</style>
