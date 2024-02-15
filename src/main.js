/*入口文件main.js*/

import Vue from 'vue'//引入vue框架
import App from './App.vue'//引入根组件
import router from './router'//引入路由设置
import './plugins/element.js'
import './assets/css/global.css'//引入自定义的全局样式

import axios from 'axios'
//设置请求的根路径
//axios.defaults.baseURL = '/api'
//axios.defaults.headers.common['Authorization'] = "5Lp06U8IDO36eHz3UHABnvi06E1CG6JG";
// axios.defaults.headers.post['Content-Type'] = 'application/json';
//挂载到vue组件上
Vue.prototype.$http = axios

//关闭生产模式下给出的提示
Vue.config.productionTip = false

import qs from 'qs'




//定义vue实例
new Vue({
  router,//注入router（路由管理对象）实例，使用路由
  render: h => h(App)
  // render: x => x(App)
  // 这里的render: x => x(App)是es6的写法
  // 转换过来就是：  暂且可理解为是渲染App组件
  // render:(function(x){
  //  return x(App);
  // });
}).$mount('#app')
