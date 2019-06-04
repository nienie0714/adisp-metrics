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
      redirect: to => {
        return { path: '/basicdata' }
      }
    },
    {
      path: '/basicdata',
      name: '基础数据',
      component: Home,
      redirect: to => {
        return { path: '/manage' }
      },
      children: [
        {
          path: '/manage',
          name: '管理',
          component: Basic,
          redirect: to => {
            return { path: '/host' }
          },
          children: [
            {
              path: '/host',
              name: '主机管理',
              component: r => require.ensure([], () => r(require('@/view/basicResource/HostView'), 'HostView'))
            }
          ]
        }
      ]
    }
  ]
})

export default router
