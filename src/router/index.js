import Vue from 'vue';
import Router from 'vue-router';
import wuliushenhe from '@/page/wuliushenhe';
import login from '@/page/login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/wuliushenhe',
      name: 'wuliushenhe',
      component: wuliushenhe
    },
    {
      path: '/',
      name: 'login',
      component: login,
      //路由元信息
      meta:{
          noLogin:true
      }
    }
  ]
});
