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
      path: '/basicdata',
      name: '基础数据',
      component: Home,
      children: [
        {
          path: 'perm',
          name: '权限',
          component: Basic,
          children: [
            {
              path: 'user',
              name: '用户管理',
              component: r => require.ensure([], () => r(require('@/view/basicResource/UserView'), 'UserView'))
            }
          ]
        }
      ]
    }
  ]
})

export default router
