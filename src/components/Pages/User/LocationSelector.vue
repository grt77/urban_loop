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
        @click="selectCurrentLocation"
      />
    </section>

    <section class="col-xs-12 form-group">
      <font-awesome-icon icon="search" class="search-icon" />
      <input
        v-model="source"
        class="form-control"
        type="text"
        placeholder="Search Source Location"
        @change="debouncedSearchSourceLocation()"
      />
      <ul v-if="sourcePlaces?.length" class="place-list-container">
        <li
          v-for="place in sourcePlaces"
          :key="place.id"
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
        type="text"
        placeholder="Search Destination"
        @change="debouncedSearchDestinationLocation()"
      />
      <ul v-if="destinationPlaces?.length" class="place-list-container">
        <li
          v-for="place in destinationPlaces"
          :key="place.id"
          @click="selectPlace(EPathConfig.DESTINATION, place)"
        >
          {{ place.name_place }}
        </li>
      </ul>
    </section>

    <section class="col-xs-12 form-group text-start fw-bold mt-1">
      <label for="mobileNumber">Mobile Number:</label>
      <input
        v-model="mobileNumber"
        class="form-control"
        type="number"
        placeholder="Enter Mobile Number"
        @input="debouncedValidateMobileNumber"
      />
      <div v-if="mobileNumberError" class="mobile-number-error-message">
        {{ mobileNumberError }}
      </div>
    </section>

    <section class="col-xs-12 form-group">
      <button class="confirm-button" @click="$router.push({ name: 'Fair' })">Confirm</button>
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

const mapService = new MapService();

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
      debouncedSearchSourceLocation: debounce(this.searchSourceLocation, 500),
      debouncedSearchDestinationLocation: debounce(this.searchDestinationLocation, 500),
      debouncedValidateMobileNumber: debounce(this.validateMobileNumber, 500),
      images,
      EPathConfig,
      isSourceLoading: false,
      isDestinationLoading: false,
    };
  },
  methods: {
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
          this.sourceCordinates = [data.latitude, data.longitude];
          this.source = place.name_place;
          this.resetPlaceFlag('placeCurrentLocation');
        } else if (type === EPathConfig.DESTINATION) {
          this.destinationCordinates = [data.latitude, data.longitude];
          this.destination = place.name_place;
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

    .search-icon {
      position: absolute;
      top: 18px;
      left: 20px;
      color: rgba(0, 0, 0, 0.8);
    }

    input.form-control {
      border-radius: 5px;
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      padding-left: 40px;
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

      li {
        padding: 10px;

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
