// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import App from './App';
import router from './router';
import { Flexbox, FlexboxItem, XButton, Alert, XInput, AlertPlugin, XTable, XDialog, Confirm, Group} from 'vux';
import ElementUI from 'element-ui';



//注册全局过滤器,使用day.js
import dayjs from 'dayjs'
Vue.filter('formatTime',(value,formatTem) =>{
  return dayjs(value).format(formatTem)
})


// 导入我的axios插件
import myaxios from './api/my-axios';

FastClick.attach(document.body);

Vue.config.productionTip = false;

Vue.component('flexbox', Flexbox);
Vue.component('flexbox-item', FlexboxItem);
Vue.component('x-button', XButton);
Vue.component('alert', Alert);
Vue.component('x-input', XInput);
Vue.component('x-table', XTable);
Vue.use(AlertPlugin);
// use一下 调用了 插件的install方法
Vue.use(myaxios);
Vue.use(ElementUI);
Vue.component('x-dialog', XDialog);
Vue.component('confirm', Confirm);
Vue.component('group', Group);

/* eslint-disable no-new */
new Vue({
  el: '#app-box',
  router,
  components: { App },
  template: '<App/>'
});
