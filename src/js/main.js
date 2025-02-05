import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';

Vue.use(VueMaterial);
Vue.use(VueRouter);

import * as RouteTemplates from './RouteTemplates';
import StairstepChart from './StairstepChart.js';
import PieChart from './PieChart.js';

Vue.component('home', RouteTemplates.home);
Vue.component('solar-map', RouteTemplates.map);
Vue.component('methodology', RouteTemplates.methodology);
Vue.component('about', RouteTemplates.about);
Vue.component('why-solar', RouteTemplates.whySolar);
Vue.component('going-solar', RouteTemplates.goingSolar);

// Define components and routes. Each route should map to a component. The
// "component" can either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
const routes = [
  {
    path: '/',
    meta: { pageTitle: 'The Solar Scorecard' },
    component: {
      template: '<home></home>',
      created: emitPageTitleChange,
    },
  },
  {
    path: '/map',
    meta: { pageTitle: 'Solar Installations Map' },
    component: {
      template: '<solar-map></solar-map>', // Vue warns against <map>
      created: emitPageTitleChange,
    },
  },
  {
    path: '/why-solar',
    meta: { pageTitle: 'Why Count Solar?' },
    component: {
      template: '<why-solar></why-solar>',
      created: emitPageTitleChange,
    },
  },
  {
    path: '/methodology',
    meta: { pageTitle: 'How Solar Scorecard Thinks' },
    component: {
      template: '<methodology></methodology>',
      created: emitPageTitleChange,
    },
  },
  {
    path: '/about',
    meta: { pageTitle: 'All About Solar Scorecard' },
    component: {
      template: '<about></about>',
      created: emitPageTitleChange,
    },
  },
  {
    path: '/going-solar',
    meta: { pageTitle: 'Resources for Going Solar' },
    component: {
      template: '<going-solar></going-solar>',
      created: emitPageTitleChange,
    },
  },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for `routes: routes`
});

import Main from '../App.vue';

Vue.component('solar-scorecard-stairstep', {
  mounted: function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://opendata.fcgov.com/resource/3ku5-x4k9.json?$order=meta_row_index&$limit=100000');
    // This is so Socrata and the City knows who we are and our app
    //     it can often prevent API throttling
    xhr.setRequestHeader('X-App-Token', 'uGISPdpNnBfwN4kmj9goaZBNM');
    xhr.onload = function() {
      if (xhr.status === 200) {
        let xhrDataContainer = {
          data: {
            fortCollins: [],
          },
          selector: '#stairstep-chart-tabs',
        };
        xhrDataContainer.data.fortCollins = xhr.responseText;
        StairstepChart({
          selector: '#stairstep-chart',
          data: xhrDataContainer.data,
        });
      } else {
        alert('FoCo API request failed.  Returned status of ' + xhr.status);
      }
    };
    xhr.send();
  },
  template: '<canvas id="stairstep-chart" width="600" height="240"></canvas>',
});

Vue.component('solar-scorecard-ratios', {
  mounted: function() {
    PieChart({
      selector: '#pie-chart',
      data: {
        Electric: 51,
        'Ground Travel': 24,
        'Natural Gas': 21,
        'Solid Waste': 4,
        'Water Related': 0.3,
      },
    });
  },
  template: '<canvas id="pie-chart" width="600" height="200"></canvas>',
});

new Vue({
  router,
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
  },
  render: h => h(Main),
}).$mount('#app');

/**
 * Send a message toward the app root ("emit") to trigger a page title (top bar)
 * update.
 */
function emitPageTitleChange() {
  this.$emit('on-page-title-change', this.$route.meta.pageTitle);
}
