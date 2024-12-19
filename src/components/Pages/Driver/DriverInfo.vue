<template>
  <div class="d-flex align-items-end w-100" style="height: 60%;">
    <vue-qrcode
      style="width: 100%;"
      :value="dataUrl"
      @change="onDataUrlChange"
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
import { mapGetters } from 'vuex/dist/vuex.cjs.js';

const driverService = new DriverService();

export default {
  name: 'DriverInfo',
  data() {
    return {
      dataUrl: '',
      driverInfo: {},
    }
  },
  components: {
    VueQrcode,
  },
  computed: {
    ...mapGetters({
      driverMobileNumber: 'getDriverMobileNumber',
    }),
  },
  mounted() {
    this.getDriverId();
  },
  methods: {
    onDataUrlChange(dataUrl) {
      this.dataUrl = dataUrl;
    },
    async getDriverId() {
      try {
        const driverResponse = await driverService.getDriverId(this.driverMobileNumber);
        this.driverInfo = driverResponse?.data || {};
        this.dataUrl = `http://localhost:5173/?driver_id=${driverResponse?.data?.driver_id}`;
        console.log(this.dataUrl);
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>