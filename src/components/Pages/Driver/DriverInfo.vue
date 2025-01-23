<template>
  <div class="back-container">
    <font-awesome-icon icon="chevron-circle-left" title="Go Back" @click="$router.go(-1)" />
  </div>
  <div class="d-flex align-items-end w-100" style="height: 50%;">
    <vue-qrcode
      style="width: 100%;"
      :value="dataUrl"
    />
  </div>
  <div>
    <p><span class="fw-bold">Vehicle No:</span> {{ driverInfo?.vel_no }}</p>
    <p><span class="fw-bold">Vehicle Type:</span> {{ driverInfo?.vel_type }}</p>
  </div>
</template>
<script>
import VueQrcode from 'vue-qrcode';
import DriverService from '../../../services/driver.service';
import { mapGetters } from 'vuex';

const driverService = new DriverService();

export default {
  name: 'DriverInfo',
  data() {
    return {
    }
  },
  components: {
    VueQrcode,
  },
  computed: {
    ...mapGetters({
      driverMobileNumber: 'getDriverMobileNumber',
      driverInfo: 'getDriverInfo',
    }),
    dataUrl() {
      return `https://urban-loop-backend.onrender.com/?driver_id=${this.driverInfo?.driver_id}`;
    }
  },
}
</script>
<style lang="scss" scoped>
.back-container {
  display: flex;
  justify-content: left;

  .fa-circle-chevron-left {
    font-size: 35px;
    cursor: pointer;
  }
}
</style>
