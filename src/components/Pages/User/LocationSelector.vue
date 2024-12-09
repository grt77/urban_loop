<template>
  <div class="row location-selector-container">
    <header class="col-xs-12 header-container">
      <img class="rickshaw" :src="images.autoRickShaw" alt="Rickshaw" width="70px" />
      <img class="urban-loop-logo" :src="images.logo" alt="Urban Loop Logo" width="80%" />
    </header>

    <section class="col-xs-12 map-container">
      <map-box
        :source-cordinates="sourceCordinates"
        :destination-cordinates="destinationCordinates"
        :place-current-location="placeCurrentLocation"
        :place-destination-location="placeDestinationLocation"
      />
      <font-awesome-icon
        icon="location"
        class="location-icon"
        title="Current Location"
        @click="setCurrentLocation"
      />
    </section>

    <section class="col-xs-12 form-group">
      <font-awesome-icon icon="search" class="search-icon" />
      <input
        v-model="source"
        class="form-control"
        :class="sourcePlaces?.length ? 'remove-border' : ''"
        type="text"
        placeholder="Search Source Location"
        @input="debouncedSearchSourceLocation()"
      />
      <ul v-if="sourcePlaces?.length" class="place-list-container">
        <li
          v-for="place in sourcePlaces"
          :key="place.id"
          :title="place.name_place"
          @click="selectPlace(EPathConfig.SOURCE, place)"
        >
          {{ place.name_place }}
        </li>
      </ul>
    </section>

    <section class="col-xs-12 form-group">
      <font-awesome-icon icon="search" class="search-icon" />
      <input
        v-model="destination"
        class="form-control"
        :class="destinationPlaces?.length ? 'remove-border' : ''"
        type="text"
        placeholder="Search Destination"
        @input="debouncedSearchDestinationLocation()"
      />
      <ul v-if="destinationPlaces?.length" class="place-list-container">
        <li
          v-for="place in destinationPlaces"
          :key="place.id"
          :title="place.name_place"
          @click="selectPlace(EPathConfig.DESTINATION, place)"
        >
          {{ place.name_place }}
        </li>
      </ul>
    </section>

    <section class="col-xs-12 form-group text-start fw-bold mt-1">
      <label for="mobileNumber">Mobile Number:</label>
      <div class="input-group">
        <input
          v-model="mobileNumber"
          class="form-control ps-3"
          type="number"
          placeholder="Enter Mobile Number"
          @input="debouncedValidateMobileNumber"
        />
      </div>
      <div v-if="mobileNumberError" class="mobile-number-error-message">
        {{ mobileNumberError }}
      </div>
    </section>

    <section class="col-xs-12 form-group">
      <button class="confirm-button" @click="handleOTPAndFairService">Confirm</button>
    </section>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import MapBox from '../../Widgets/Mapbox.vue';
import { images } from '../../../assets/images';
import MapService from '../../../services/map';
import { generateSessionId } from '../../../utils/helper';
import { EPathConfig } from '../../../utils/constant';
import OtpService from '../../../services/otp.service';
import FairService from '../../../services/fair.service';
import { mapActions } from 'vuex';

const mapService = new MapService();
const otpService = new OtpService();
const fairService = new FairService();

export default {
  name: 'LocationSelector',
  components: { MapBox },
  data() {
    return {
      source: '',
      destination: '',
      sourcePlaces: [],
      destinationPlaces: [],
      sourceCordinates: [],
      destinationCordinates: [],
      mobileNumber: '',
      mobileNumberError: '',
      placeCurrentLocation: false,
      placeDestinationLocation: false,
      debouncedSearchSourceLocation: debounce(this.searchSourceLocation, 100),
      debouncedSearchDestinationLocation: debounce(this.searchDestinationLocation, 100),
      debouncedValidateMobileNumber: debounce(this.validateMobileNumber, 500),
      images,
      EPathConfig,
      isSourceLoading: false,
      isDestinationLoading: false,
    };
  },
  methods: {
    ...mapActions([
      'setFairDetails',
      'setMobileNumber',
      'setSourceDetails',
      'setDestinationDetails',
    ]),
    async searchSourceLocation() {
      this.isSourceLoading = true;
      try {
        const { latitude, longitude } = await this.fetchCurrentLocation();
        const payload = {
          query: this.source,
          proximity_latitude: latitude,
          proximity_longitude: longitude,
          session_token: generateSessionId(),
        };
        const response = await mapService.getNearLocations(payload);
        this.sourcePlaces = response?.data || [];
      } catch (error) {
        console.error(error);
      } finally {
        this.isSourceLoading = false;
      }
    },
    async searchDestinationLocation() {
      this.isDestinationLoading = true;
      try {
        const { latitude, longitude } = await this.fetchCurrentLocation();
        const payload = {
          query: this.destination,
          proximity_latitude: latitude,
          proximity_longitude: longitude,
          session_token: generateSessionId(),
        };
        const response = await mapService.getNearLocations(payload);
        this.destinationPlaces = response?.data || [];
      } catch (error) {
        console.error(error);
      } finally {
        this.isDestinationLoading = false;
      }
    },
    async selectPlace(type, place) {
      try {
        const payload = {
          location_id: place.mapbox_id,
          session_id: generateSessionId(),
        };
        const { data } = await mapService.getLocationDetails(payload);
        if (type === EPathConfig.SOURCE) {
          this.sourceCordinates = [data.longitude, data.latitude];
          this.source = place.name_place;
          this.sourcePlaces = [];
          this.resetPlaceFlag('placeCurrentLocation');
        } else if (type === EPathConfig.DESTINATION) {
          this.destinationCordinates = [data.longitude, data.latitude];
          this.destination = place.name_place;
          this.destinationPlaces = [];
          this.resetPlaceFlag('placeDestinationLocation');
        }
      } catch (error) {
        console.error(error);
      }
    },
    resetPlaceFlag(flag) {
      this[flag] = true;
      setTimeout(() => {
        this[flag] = false;
      }, 2000);
    },
    async setCurrentLocation() {
      const { latitude, longitude } = await this.fetchCurrentLocation();
      this.sourceCordinates = [longitude, latitude];
      this.source = 'Current Location (You)';
      this.sourcePlaces = [];
      this.resetPlaceFlag('placeCurrentLocation');
    },
    fetchCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => reject(error.message || 'Failed to fetch location.')
          );
        } else {
          reject('Geolocation is not supported by this browser.');
        }
      });
    },
    validateMobileNumber() {
      const indianMobilePattern = /^[6-9]\d{9}$/;
      this.mobileNumberError = indianMobilePattern.test(this.mobileNumber)
        ? ''
        : 'Invalid mobile number';
    },
    async handleOTPAndFairService() {
      try {
        // Define the payload for the fair service
        const fairPayload = {
          origin_lat: this.sourceCordinates[1],
          origin_lon: this.sourceCordinates[0],
          dest_lat: this.destinationCordinates[1],
          dest_lon: this.destinationCordinates[0]
        };

        const [otpResponse, autoFairResponse] = await Promise.all([
          otpService.sendOtp(this.mobileNumber), // OTP service call
          fairService.getAutoFare(fairPayload)  // Fair service call
        ]);

        // Handle OTP response
        if (otpResponse && autoFairResponse) {
          this.setFairDetails({ ...autoFairResponse.data });
          this.setSourceDetails({
            latitude: this.sourceCordinates[1],
            longitude: this.sourceCordinates[0],
            address: this.source,
          });
          this.setDestinationDetails({
            latitude: this.destinationCordinates[1],
            longitude: this.destinationCordinates[0],
            address: this.destination,
          });
          this.setMobileNumber(this.mobileNumber);
          this.$router.push({ name: 'UserFairDetails' });
        }

      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
  },
};
</script>

<style lang="scss">
.location-selector-container {
  .header-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .rickshaw {
      width: 70px;
    }

    .urban-loop-logo {
      width: 80%;
      margin-left: -12px;
    }
  }

  .map-container {
    position: relative;

    .location-icon {
      position: absolute;
      bottom: 40px;
      right: 30px;
      background: white;
      color: gray;
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .form-group {
    position: relative;

    .input-group-text {
      height: 2.6rem;
      padding: 0px 8px;
      border: 3px solid;
      margin-top: 0.29rem;
      border-right: 0;
      padding-bottom: 1px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    .indian-code {
      position: absolute;
    }

    .search-icon {
      position: absolute;
      top: 18px;
      left: 20px;
      color: rgba(0, 0, 0, 0.8);
    }

    .remove-border {
      border-bottom: 0;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
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

    .place-list-container {
      position: absolute;
      background: white;
      border: 2px solid #ccc;
      list-style: none;
      margin: 0;
      padding: 0;
      z-index: 1;
      top: 44px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      width: 91%;
      border: 3px solid black;
      margin-top: -2px;
      max-height: 175px;
      overflow-y: auto;
      text-align: start;

      li {
        padding: 5px 10px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          background-color: rgb(218, 218, 218);
          cursor: pointer;
        }
      }
    }

    .mobile-number-error-message {
      color: #dc3545;
      font-size: 14px;
      font-weight: 500;
    }

    .confirm-button {
      background-color: #2d9bf0;
      color: white;
      width: 100%;
      margin-top: 10px;
      border-radius: 5px;
    }
  }
}
</style>
