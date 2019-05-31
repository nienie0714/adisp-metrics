import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/view/home/MainView'
import Login from '@/view/home/LoginView'
import Home from '@/view/home/Home'
import Basic from '@/view/home/BasicResourceView'
import store from '../store'
import {postData, getQueryAll} from '../api/base'
import _ from 'lodash'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: '主机管理',
      redirect: '/basicdata/manage/host'
    },
    {
      path: '/basicdata',
      name: '基础数据',
      component: Home,
      children: [
        {
          path: 'manage',
          name: '管理',
          component: Basic,
          children: [
            {
              path: 'host',
              name: '用户管理',
              component: r => require.ensure([], () => r(require('@/view/basicResource/HostView'), 'HostView'))
            }
          ]
        }
      ]
    }
  ]
})

export default router
