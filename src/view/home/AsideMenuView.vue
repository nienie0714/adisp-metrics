<template>
  <div>
    <!-- <el-aside :class="asideHidden?'hidden-aside':'whole-aside'"> -->
    <el-aside class="hidden-aside">
    </el-aside>
  </div>
</template>

<script>
import baseMixin from '../../components/mixin/baseMixin'
import {queryAll} from '../../api/base.js'
import _ from 'lodash'

export default {
  mixins: [baseMixin],
  data () {
    return {
      getResourcePerm: 'basicdata/sysUser/queryResourceByUserAndPath',
      asideData: [],
      activeIndex: '',
      isCollapse: false,
      filterName: '',
      asideHidden: false,
      indexTime: 0
    }
  },
  created () {
    this.$nextTick(() => {
      this.asideData = JSON.parse(localStorage.getItem('userResource'))
      this.findActiveIndex(this.asideData)
      if (localStorage.getItem('indexTime') != 1) {
        this.$router.push(this.activeIndex)
        localStorage.setItem('indexTime', 1)
      } else {
        this.$router.push({name: localStorage.getItem('basicdataName')})
      }
    })
  },
  methods: {
    findActiveIndex (arr) {
     if (arr && arr.length > 0) {
      if (arr[0].hasOwnProperty('children') && (arr[0].children != null) && (arr[0].children.length > 0)) {
        this.activeIndex = arr[0].children[0].attributes
      }
     }
    },
    handleAsideHiddenButton () {
      if (this.asideHidden) {
        this.asideHidden = false
      } else {
        this.asideHidden = true
      }
      this.$nextTick(() => {
        var asideView = this.$root.$el.querySelector('.el-aside')
        var basicContView = this.$root.$el.querySelector('.basic-resource-contain')
        var basicWidth = window.innerWidth - asideView.offsetWidth - 40
        basicContView.style.width = basicWidth + 'px'
      })
    },
    handleSelect (key, keyPath) {
      var arr = this.asideData
      _.forEach(this.asideData, (item) => {
        if (item.children) {
          arr = _.concat(arr, item.children)
        }
      })
      var obj = _.filter(arr, ['attributes', key])
      if (this.$route.matched[0].path == '/basicdata') {
        localStorage.setItem('basicdataName', obj[0].text)
      } else {
        localStorage.setItem('statisticsName', obj[0].text)
      }
    },
    handleAsideMenu (data) {
      this.$router.push({name: data.key})
    },
    openIsCollapse () {
      this.isCollapse = false
    },
    closeIsCollapse () {
      this.isCollapse = true
    },
    filterMethod () {
      if (this.$route.matched[0].path == '/basicdata') {
        this.asideData = JSON.parse(localStorage.getItem('userResource'))
      } else {
        this.asideData = JSON.parse(localStorage.getItem('statResource'))
      }
      if (!this.filterName) return
      var value = this.filterName
      var _this = this
      this.asideData.forEach(item => {
        var hidden = true
        if (item.children != null) {
          _this.$set(item, 'hidden', true)
          item.children.forEach(child => {
            hidden = _this.filters(child, value)
            if (!hidden) {
              _this.$set(item, 'hidden', false)
            }
          })
        } else {
          _this.filters(item, value)
        }
      })
    },
    filters (data, value) {
      if (data.text.indexOf(value) == -1) {
        // 未匹配到
        this.$set(data, 'hidden', true)
        return true
      } else {
        // 匹配到
        return false
      }
    }
  }
}
</script>

<style>
.whole-aside {
  overflow: hidden;
  width: 270px !important;
  padding: 0 20px 0 10px;
}
.hidden-aside {
  overflow: hidden;
  width: 0px !important;
  padding: 0 10px;
}
.el-aside {
  height: 100%;
  /* background-color: #545c64; */
}
.aside-el-menu {
  margin: 20px 0 0 0;
}
.whole-aside .aside-el-menu>div {
  width: calc(100% - 8px);
}
.el-menu--vertical, .el-menu--vertical *,
.aside-el-menu, .aside-el-menu * {
  background: none;
}
/* 展开样式 */
.aside-el-menu:not(.el-menu--collapse) {
  width: 240px;
}
/* 折叠样式 */
.aside-el-menu.el-menu--collapse {
  width: 50px;
}
.aside-el-menu.el-menu {
  border-right: none;
  height: calc(100% - 270px);
  overflow: hidden;
  z-index: 10;
}
ul.aside-el-menu.el-menu:hover {
  overflow-y: auto;
}
.aside-el-menu .el-submenu__title {
  display: flex;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  padding: 0 !important;
}
.el-menu--collapse .el-submenu__title {
  height: 30px !important;
  line-height: 30px !important;
  margin: 10px 0;
}
.el-menu--vertical .el-menu-item,
.aside-el-menu .el-menu-item {
  height: 36px;
  line-height: 36px;
}
.aside-el-menu .el-menu-item {
  padding-left: 46px !important;
}
.el-menu--vertical .el-menu-item {
  padding-left: 23px !important;
  color: #fff;
}
.menu-icon {
  width: 30px;
  height: 30px;
}
.el-menu--collapse>div>.el-menu-item [class^=aside-el-menu], .el-menu--collapse>div>.el-submenu>.el-submenu__title [class^=aside-el-menu] {
  margin: 0;
  vertical-align: middle;
  width: 30px;
  text-align: center;
}
.el-menu--collapse>div>.el-menu-item span, .el-menu--collapse>div>.el-submenu>.el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
.el-menu--collapse>div>.el-menu-item .el-submenu__icon-arrow, .el-menu--collapse>div>.el-submenu>.el-submenu__title .el-submenu__icon-arrow {
  display: none;
}
/* 展开样式 */
.aside-el-menu:not(.el-menu--collapse) .menu-icon {
  margin: 10px 16px 10px 0;
}
/* 折叠样式 */
.aside-el-menu.el-menu--collapse .menu-icon {
  margin: 0;
}
/* ***********折叠菜单后样式*********** */
.el-menu--vertical {
  width: 200px;
  padding: 12px;
  border: 1px solid rgba(60, 166, 200, 0.7);
  background-color: rgba(8, 25, 38, 0.96);
  box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
  border-radius: 12px;
}
.el-menu--vertical ul {
  margin: 0;
}
.el-menu--vertical li:hover {
  background: none;
}
.el-submenu__title:hover {
  background: none;
}
.hidden-aside .el-submenu.is-opened {
  opacity: 0.7;
}
/* *********************************** */
.menu-icon-basic {
  background: url('./../../assets/img/basic/icon_sider_flight.png');
}
.menu-icon-air {
  background: url('./../../assets/img/basic/icon_sider_resource.png');
}
.menu-icon-org {
  background: url('./../../assets/img/basic/icon_sider_organization.png');
}
.menu-icon-perm {
  background: url('./../../assets/img/basic/icon_sider_authority.png');
}
.menu-icon-device {
  background: url('./../../assets/img/basic/icon_sider_equipment.png');
}
.menu-icon-knowledge {
  background: url('./../../assets/img/basic/icon_sider_library.png');
}
.menu-icon-taskpool {
  background: url('./../../assets/img/basic/icon_sider_tasks.png');
}
.el-submenu__icon-arrow.el-icon-arrow-down {
  font-weight: 900;
  font-size: 10px;
  box-shadow: 0 0 30px rgba(53, 191, 255, 0.27) inset, 0 0 30px rgba(53, 191, 255, 1);
}
.aside-hidden-img {
  width: 30px;
  height: 30px;
  background-color: rgba(8, 25, 38, 0.7);
  background: url('./../../assets/img/basic/icon_arrow_left_30.png');
  border: 1px solid rgba(60, 166, 200, 0.7);
  box-shadow: 0 0 10px rgba(60, 166, 200, 0.3);
  border-radius: 50%;
  position: absolute;
  bottom: 40px;
  left: 105px;
  z-index: 10;
  cursor: pointer;
}
.aside-hidden-img:hover {
  background-color: rgba(60, 166, 200, 0.2);
}
.ishidden {
  transform: rotateZ(180deg);
}
.aside-hidden-img.ishidden {
  left: 30px;
}
.el-aside .el-submenu__icon-arrow {
  right: 5px;
}
.el-aside .el-input__icon {
  line-height: 25px;
}
.el-aside .el-submenu__title i {
  color: #fff;
}
</style>
