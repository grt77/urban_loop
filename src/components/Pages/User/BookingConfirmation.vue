<template>
  <div class="row booking-confirmed-container">
    <div class="col-xs-12 header-container">
      <h2>YOU ARE ON <span>FLASH RIDE</span></h2>
    </div>
    <div class="col-xs-12 map-box-container">
      <booking-map />
    </div>
    <div class="col-xs-12 estimates-travel">
      <div>Estimates Travel time 11 Mins</div>
    </div>
    <div class="col-xs-12 mt-4 driver-info">
      <div class="row">
        <div class="col-xs-6 d-flex align-items-center">
          <font-awesome-icon icon="circle-user" class="user-icon" />
          <div class="driver-details">
            <label for="driver-name">Name: <span>XXXXXX</span></label>
            <span>KA XX AS XXXX</span>
          </div>
        </div>
        <div class="col-xs-6 auto-model-details">
          <img :src="images.autoRickShaw" alt="autorickshaw" class="rickshaw" />
          <div>
            <span class="fw-bold">Auto Model</span> - XXXX
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 mt-4 heading-towards">
      <span class="fw-bold">Heading Towards:</span> XXXXXXXXXXXX
    </div>
  </div>
</template>

<script>
import { images } from '../../../assets/images';
import BookingMap from '../../Widgets/BookingMap.vue';
import Mapbox from '../../Widgets/Mapbox.vue';

export default {
  name: 'BookingConfirmation',
  components: {
    Mapbox,
    BookingMap
  },
  data() {
    return {
      placeCurrentLocation: false,
      placeDestinationLocation: false,
      sourceCordinates: [],
      destinationCordinates: [],
      images,
    };
  },
};
</script>

<style lang="scss">
.booking-confirmed-container {
  margin-top: 50px;
  font-family: Arial, Helvetica, sans-serif;

  .header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    h2 {
      font-family: 'Bangers', cursive;
      font-size: 20px;
      margin: 0;

      span {
        font-size: 35px;
        color: #2d9bf0;
      }
    }
  }

  .map-box-container {
    position: relative;
    width: 100%;
    height: 250px;
    border: 2px solid #ccc;
    border-radius: 5px;
    padding: 0 !important;
  }

  .estimates-travel {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    div {
      width: 70%;
      font-size: 17px;
      font-weight: 600;
    }
  }

  .driver-info {
    margin-top: 20px;

    .user-icon {
      color: #2d9bf0;
      font-size: 35px;
    }

    .driver-details {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      font-size: 12px;

      label {
        font-weight: 500;

        span {
          font-weight: 400;
        }
      }
    }

    .auto-model-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      font-size: 12px;

      .rickshaw {
        width: 50px;
        margin: 0 auto;
      }

      div {
        margin-top: 5px;
      }
    }
  }

  .heading-towards {
    font-size: 14px;
    margin-top: 20px;

    span {
      font-weight: bold;
    }
  }
}
</style>
