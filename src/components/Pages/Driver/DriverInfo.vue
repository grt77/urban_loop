<template>
  <div class="d-flex align-items-end w-100" style="height: 60%;">
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
      return `http://localhost:5173/?driver_id=${this.driverInfo?.driver_id}`;
    }
  },
}
</script>