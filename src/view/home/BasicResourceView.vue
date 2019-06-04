<template>
  <div class="basic-resource-contain table-container">
    <el-container direction="vertical">
      <el-header>
        <div class="table-header">
          <img :src="require('@img/title_deco.png')" />
          <!-- <span class="header-title">{{ routerViewName }}</span> -->
          <span class="header-title">主机管理</span>
          <span>
            <div class="dot-font" v-if="monitorStatus == 'green'">
              <div class="dot-color-4_1"></div>
              <span>监控系统正常</span>
            </div>
            <div class="dot-font" v-if="monitorStatus == 'red'">
              <div class="dot-color-3"></div>
              <span>监控系统警告</span>
            </div>
            <div class="dot-font" v-if="monitorStatus == 'yellow'">
              <div class="dot-color-2"></div>
              <span>监控系统停止</span>
            </div>
          </span>
          <div class="header-update-div">
            <div>最后更新时间：</div>
            <div>{{lastUpdateTime}}</div>
            <div class="header-refrush">
              <div class="img-refrush" @click="handleLetUpdate"></div>
              </div>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="basic-resource-main">
          <router-view v-if="$route.matched[0].path == '/basicdata'" ref="basicRouter"></router-view>
          <router-view v-else ref="statRouter"></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {getQueryAll} from '../../api/base.js'
export default {
  data () {
    return {
      // 命名视图名称
      routerViewName: '',
      monitorStatus: ''
    }
  },
  mounted () {
    window.name = this.$route.name
    // if (this.$route.matched[0].path == '/basicdata') {
    //   this.routerViewName = localStorage.getItem('basicdataName')
    // } else {
    //   this.routerViewName = localStorage.getItem('statisticsName')
    // }
  },
  created () {
    getQueryAll('/status').then(res => {
      if (res.data.success) {
        this.monitorStatus = res.data.data
      } else {
        this.showError('获取监控状态', '请重新尝试 !')
      }
    }).catch(() => {
      this.showError('获取监控状态', '请重新尝试 !')
    })
  },
  methods: {
    changeRouterViewName (keyName) {
      this.$router.push({name: keyName})
    },
    handleLetUpdate () {
      this.$refs.basicRouter.queryDataReq()
    }
  },
  watch: {
    $route (to, from) {
      // this.routerViewName = localStorage.getItem('basicdataName')
    }
  },
  computed: {
    lastUpdateTime () {
      return this.$store.getters.getLastUpdateTime
    }
  }
}
</script>

<style scoped>
.el-main {
  padding: 0
}
.el-main .basic-resource-main {
  height: 100%;
}
.basic-resource-contain {
  height: calc(100% - 2px);
}
</style>
