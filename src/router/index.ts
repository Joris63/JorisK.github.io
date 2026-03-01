import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import OrdersAdd from '@/views/sales/OrdersAdd.vue';
import OrdersAdd_Direct from '@/views/sales/OrdersAdd_Direct.vue';
import OrdersAdd_ThankYou from '@/views/sales/OrdersAdd_ThankYou.vue';
import CustomersOverview from '@/views/sales/CustomersOverview.vue';
import CustomerEdit from '@/views/sales/CustomerEdit.vue';
import OffersOverview from '@/views/marketing/OffersOverview.vue';
import OffersEdit from '@/views/marketing/OffersEdit.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sales/orders/add',
      name: 'ordersAdd',
      component: OrdersAdd,
      meta: {
        breadcrumbs: ['Verkoop', 'Bestelling aanmaken'],
      },
    },
    {
      path: '/sales/direct',
      name: 'ordersAddDirect',
      component: OrdersAdd_Direct,
      meta: {
        breadcrumbs: ['Verkoop', 'Directe verkoop'],
      },
    },
    {
      path: '/sales/thank-you',
      name: 'ordersThankYou',
      component: OrdersAdd_ThankYou,
      meta: {
        breadcrumbs: ['Verkoop', 'Bedankt'],
      },
    },
    {
      path: '/sales/customers',
      name: 'CustomersOverview',
      component: CustomersOverview,
      meta: {
        breadcrumbs: ['Verkoop', 'Klanten'],
      },
    },
    {
      path: '/sales/customers/:id',
      name: 'CustomerEdit',
      component: CustomerEdit,
      meta: {
        breadcrumbs: ['Verkoop', { label: 'Klanten', route: '/sales/customers' }, 'Klant bewerken'],
      },
    },
    {
      path: '/marketing/offers',
      name: 'OffersOverview',
      component: OffersOverview,
      meta: {
        breadcrumbs: ['Marketing', 'Acties'],
      },
    },
    {
      path: '/marketing/offers/:id',
      name: 'OffersEdit',
      component: OffersEdit,
      meta: {
        breadcrumbs: [
          'Marketing',
          { label: 'Acties', route: '/marketing/offers' },
          'Actie bewerken',
        ],
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
