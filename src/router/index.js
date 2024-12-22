import { createRouter, createWebHistory } from 'vue-router';

// User Routes
import LocationSelector from '../components/Pages/User/LocationSelector.vue';
import FairDetails from '../components/Pages/User/FairDetails.vue';
import RideConfirmationWaiting from '../components/Pages/User/RideConfirmationWaiting.vue';
import BookingConfirmation from '../components/Pages/User/BookingConfirmation.vue';
import RideCompletion from '../components/Pages/User/RideCompletion.vue';

// Driver Routes
import RideDecision from '../components/Pages/Driver/RideDecision.vue';
import RideConfirmation from '../components/Pages/Driver/RideConfirmation.vue';
import FinalFareCollection from '../components/Pages/Driver/FinalFareCollection.vue';
import Login from '../components/Pages/Driver/Login.vue';
import QRScanner from '../components/Pages/Driver/DriverInfo.vue';
import DriverInfo from '../components/Pages/Driver/DriverInfo.vue';

const userRoutes = [
  {
    path: '/',
    name: 'UserLocationSelector',
    component: LocationSelector,
  },
  {
    path: '/fair-details',
    name: 'UserFairDetails',
    component: FairDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/ride-confirmation-waiting',
    name: 'UserRideConfirmationWaiting',
    component: RideConfirmationWaiting,
  },
  {
    path: '/booking-confirmed',
    name: 'UserBookingConfirmation',
    component: BookingConfirmation,
  },
  {
    path: '/ride-completion',
    name: 'UserRideCompletion',
    component: RideCompletion,
  },
];

const driverRoutes = [
  {
    path: '/driver/login',
    name: 'DriverLogin',
    component: Login,
  },
  {
    path: '/driver/info',
    name: 'DriverInfo',
    component: DriverInfo,
    meta: { requiresAuth: true },
  },
  {
    path: '/driver/ride-decision',
    name: 'DriverRideDecision',
    component: RideDecision,
    meta: { requiresAuth: true },
  },
  {
    path: '/driver/ride-confirmation',
    name: 'DriverRideConfirmation',
    component: RideConfirmation,
    meta: { requiresAuth: true },
  },
  {
    path: '/driver/final-fare-collection',
    name: 'DriverFinalFareCollection',
    component: FinalFareCollection,
    meta: { requiresAuth: true },
  },
];

const routes = [
  ...userRoutes,
  ...driverRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

function isValidAccessToken() {
  const token = localStorage.getItem('accessToken');
  return token !== null && token !== '';
}


router.beforeEach((to, from, next) => {
  console.log('IS_CAME', to)
  if (to.matched.some((record) => record.meta.requiresAuth) && to.path.startsWith('/driver')) {
    if (!isValidAccessToken()) {
      console.log('IS_VALID_ACCESS_TOKEN');
      next({ name: 'DriverLogin' });
    } else {
      console.log(to, from);
      next();
    }
  } else {
    if (to.path.startsWith('/driver') && isValidAccessToken()) {
      next({ name: 'DriverRideDecision' });
    } else {
      next();
    }
  }
});

export default router;
