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
    path: '/driver/ride-decision',
    name: 'DriverRideDecision',
    component: RideDecision,
  },
  {
    path: '/driver/ride-confirmation',
    name: 'DriverRideConfirmation',
    component: RideConfirmation,
  },
  {
    path: '/driver/final-fare-collection',
    name: 'DriverFinalFareCollection',
    component: FinalFareCollection,
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

export default router;
