<template>
  <el-container direction="vertical">
    <el-header class="query-contain">
      <Query-view :data="queryRowGroup" class="left" @keyupEnter="queryDataReq()"></Query-view>
      <div class="left-button">
        <el-button type="info" icon="el-icon-search" plain @click="cleanQueryData()">清空</el-button>
        <el-button type="primary" icon="el-icon-search" @click="queryDataReq()">查询</el-button>
      </div>
    </el-header>
    <el-main class="page-table-view">
      <div class="page-table-header">
        <div class="page-table-title">查询结果</div>
        <!-- <Pagination-view :pageData="pageData" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"></Pagination-view> -->
      </div>
      <Table-view :permissions="permissions" :tableData="tableData" ref="basicTable" @change="tableChange" @handleDetail="handleDetail" @handleEdit="handleEdit" @handleDelete="handleDelete">
        <template slot="button-slot-scope" slot-scope="scopeData">
          <div class="tool-div-button button-detail" title="主机详情" @click="openHomeDia(scopeData.data)"></div>
          <div class="tool-div-button button-details" title="API详情" @click="openSubscribeDia(scopeData.data)"></div>
        </template>
        <!-- <template slot="button-slot-scope" slot-scope="scopeData">
          <el-dropdown trigger="click" title="更多">
            <div class="tool-div-button button-reset"></div>
            <el-dropdown-menu slot="dropdown" class="morrow-button-dpd">
              <el-dropdown-item :divided="true" @click.native="openSubscribeDia(scopeData.data)">API详情</el-dropdown-item>
              <el-dropdown-item :divided="true" @click.native="openHomeDia(scopeData.data)">主机详情</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template> -->
      </Table-view>
    </el-main>
    <!-- <Edit-view :formData="formData" @handleAdd="saveAdd" @handleEdit="saveEdit" @handleReset="saveReset" @handlePwd="savePassword"></Edit-view> -->
    <el-dialog  :visible.sync="subscribeData.visible" :close-on-click-modal="false" width="900px" append-to-body class='other-dialog menu-status-dialog' @close="closeSubscribeDialog">
      <div slot="title" class="table-header flight-table-header-left">
        <img :src="require('@img/title_deco.png')" />
        <span class="header-title" :style="{'line-height': '60px'}">{{subscribeData.title}}</span>
        <span>
          <div class="dot-font" v-if="subscribeData.data.dbStatus">
            <div class="dot-color-4_1"></div>
            <span>数据库正在连接</span>
          </div>
          <div class="dot-font" v-if="!subscribeData.data.dbStatus">
            <div class="dot-color-3"></div>
            <span>数据库已断开</span>
          </div>
        </span>
      </div>
      <div class="dialog-body">
        <div>
          <el-row :gutter="20">
            <el-col :span="1.5"><div></div>服务</el-col>
            <el-col :span="7"><el-input type="input" v-model.trim="subscribeData.data.serviceName" disabled></el-input></el-col>
            <el-col :span="1.5"><div>主机</div></el-col>
            <el-col :span="6"><el-input type="input" v-model.trim="subscribeData.data.hostAddress" disabled></el-input></el-col>
            <el-col :span="1.5"><div></div>端口</el-col>
            <el-col :span="6"><el-input type="input" v-model.trim="subscribeData.data.port" disabled></el-input></el-col>
          </el-row>
        </div>
        <div>
          <el-table height="465" ref="multipleTable" :data="subscribeData.tableData" stripe :highlight-current-row="true" :row-key="subscribeData.key" align="center" style="width: 100%" @selection-change="handleSubSelectionChange">
            <el-table-column type="selection" fixed="left" align="center"></el-table-column>
            <el-table-column prop="apiPath" label="api路径" align="center"></el-table-column>
            <el-table-column prop="apiStatus" label="api状态" align="center"></el-table-column>
            <el-table-column prop="lastVisitTime" label="上次访问时间" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer dbStatus-footer">
        <el-button @click="closeSubscribeDialog">关 闭</el-button>
        <!-- <el-button type="primary" :loading="subscribeData.loading" @click="handleSaveAndBind()" v-if="subscribeData.title == '绑定消息'">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 主机详情 -->
    <el-dialog  :visible.sync="homeData.visible" :close-on-click-modal="false" width="900px" append-to-body class='other-dialog menu-status-dialog' @close="closeHomeDialog">
      <div slot="title" class="table-header flight-table-header-left">
        <img :src="require('@img/title_deco.png')" />
        <span class="header-title" :style="{'line-height': '60px'}">{{homeData.title}}</span>
      </div>
      <div class="dialog-body">
        <div>
          <el-row :gutter="20">
            <el-col :span="1.5"><div>主机</div></el-col>
            <el-col :span="6"><el-input type="input" v-model.trim="homeData.data.hostAddress" disabled></el-input></el-col>
            <el-col :span="1.5"><div></div>系统信息</el-col>
            <el-col :span="14"><el-input type="input" v-model.trim="homeData.data.systemVersion" disabled></el-input></el-col>
          </el-row>
        </div>
        <div class="stat-block">
          <div class="disk-wrapper">
            <div id="diskChart" class="disk"></div>
            <div class="cpu-wrapper">
              <div id="cpuChart" class="cpu"></div>
              <div id="jvmChart" class="jvm"></div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer dbStatus-footer">
        <el-button @click="closeHomeDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <Warning-box-view :data="deleteData" @handleConfirm="handleDeleteConfirm" @handleClose="handleDeleteClose"></Warning-box-view>
    <Warning-box-view :data="canNotDeleteData"></Warning-box-view>
  </el-container>
</template>

<script>
import QueryView from '../../components/common/QueryView'
import PaginationView from '../../components/common/PaginationView'
import TableView from '../../components/common/BaseTableView'
import ToolButtonView from '../../components/common/ToolButtonView'
import EditView from '../../components/common/EditView'
import basicTableMixin from '../../components/mixin/basicTableMixin'
import pageTableMixin from '../../components/mixin/pageTableMixin'
import {passwordReg, passwordReg418, consumerReg} from '../../util/rules.js'
import {postData, delData, getQueryAll} from '../../api/base.js'

export default {
  components: {
    QueryView,
    PaginationView,
    TableView,
    ToolButtonView,
    EditView
  },
  mixins: [basicTableMixin, pageTableMixin],
  data () {
    return {
      // 菜单对应按钮权限
      permissions: {
        add: false,
        update: false,
        delete: false,
        reset: false
      },
      // 基础路径
      queryUrl: '/serviceList',
      formData: {
        title: '新增',
        visible: false,
        inline: true,
        className: 'twiceCol',
        key: 'userName',
        formData: [
          {key: 'userName', label: '登录账号', type: 'input', maxlength: 20}
        ]
      },
      // 查询条件每行个数
      colSize: 4,
      // 查询条件设置
      queryList: [
        {
          // p: '类别',
          key: 'host',
          value: '',
          type: 'select',
          filterable: true,
          inputText: '主机列表',
          getOptions: '/hostList',
          span: 4
        }
      ],
      // 列表设置
      tableData: {
        loading: false,
        data: [],
        stripe: true,
        height: window.innerHeight,
        highlight: true,
        type: 'selection',
        headerCellClass: 'tableHeaderCell-Center',
        rowClassName: this.tableRowClassName,
        key: 'userName',
        multipleSelection: [],
        fields: [
          {prop: 'applicationName', label: '应用', hidden: false},
          {prop: 'serviceName', label: '服务', hidden: false},
          {prop: 'hostAddress', label: '主机', hidden: false},
          {prop: 'port', label: '端口', hidden: false},
          {prop: 'macAddress', label: 'mac地址', hidden: false},
          {prop: 'apiStatus', label: 'API状态', hidden: false}
        ]
      },
      canNotDeleteData: {
        visible: false,
        loading: false,
        hiddenConfirm: true,
        width: '500px',
        class: ' dialog-delete-warn',
        info: '不能删除正在登陆的用户',
        data: null
      },
      subscribeData: {
        loading: false,
        visible: false,
        key: 'hostAddress',
        diaWidth: '800px',
        title: 'API详情',
        url: '/serviceInfo?service=', // todo
        multipleSelection: [],
        tableData: [],
        data: {}
      },
      homeData: {
        loading: false,
        visible: false,
        key: 'hostAddress',
        diaWidth: '800px',
        title: '主机详情',
        url: 'hostInfo?host=',
        data: {}
      },
      monitorStatus: null,
      diskChart: null,
      diskChartEl: null,
      diskOptions: {
        title: {
          text: '磁盘占用情况',
          textAlign: 'auto',
          left: '27%',
          top: '10%',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 14,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          // formatter: '{a} <br/>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ff6f0b"></span>' + '{b}: {c}MB ({d}%)',
          extraCssText:
            `background-color: rgba(19, 47, 64, 0.96);
            border: 1px solid rgba(60, 166, 200, 0.7);
            box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
            border-radius: 8px;`,
          formatter: function (params) {
            var result = ''
            let arr = []
            arr.push(params)
            arr.forEach((item) => {
              result += item.seriesName + '<br/>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.name + ': ' + item.value + 'MB (' + item.percent + '%)'
            })

            return result
          }
        },
        series: [
          {
            name: '磁盘占用情况',
            type: 'pie',
            radius: '75%',
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true
              }
            },
            data: [
              {value: 0, name: '占用', itemStyle: {color: '#3DA6CC', borderColor: '#071622', borderWidth: 2}},
              {value: 0, name: '空闲', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}}
            ]
          }
        ],
        legend: {
          orient: 'horizontal',
          left: 'left',
          top: '17%',
          formatter: this.diskFormatter,
          data: ['占用', '空闲'],
          textStyle: {
            color: '#7a939e'
          }
        }
      },
      // CPU --------------------------------------------------------------
      cpuChart: null,
      cpuChartEl: null,
      cpuOptions: {
        title: {
          text: 'CPU/内存占用率',
          textAlign: 'left',
          left: 100 / 1065 * 20 + '%',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 0, // this.fontSizeSt,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        legend: {
          align: 'auto',
          inactiveColor: 'rgba(122, 147, 158, 0.6)',
          itemGap: 20,
          textStyle: {
            color: '#7a939e',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: ['CPU占用率', '内存占用率']
        },
        grid: {
          left: 100 / 1065 * 40 + '%',
          right: 100 / 1065 * 45 + '%',
          top: 100 / 224 * 40 + '%',
          bottom: 100 / 224 * 10 + '%',
          containLabel: true
        },
        toolbox: {
          right: 100 / 1065 * 35 + '%',
          itemSize: 0, // this.fontSizeRs,
          iconStyle: {
            borderColor: '#7a939e'
          },
          feature: {
            dataView: {
              title: '转换表格',
              readOnly: true,
              backgroundColor: 'transparent',
              textareaColor: 'rgba(8, 25, 38, 1)',
              textareaBorderColor: 'rgba(60, 166, 200, 0.7)',
              textColor: '#fff',
              lang: ['', '关闭'],
              buttonColor: 'rgba(60, 166, 200, 0.4)',
              optionToContent: function (opt) {
                let axisData = opt.xAxis[0].data
                let series = opt.series
                let table = `
                  <div class="echarts-view">
                    <div class="close el-dialog__headerbtn">
                      <i class="el-dialog__close el-icon el-icon-close" onclick="documentElement.getElementsByClassName('echarts-view')[0].parentElement.parentElement.style.display = 'none'"></i>
                    </div>
                    <div class="header">
                      <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td style="width: 180px;">统计</td>
                            <td style="width: 180px;">${series[0].name}</td>
                            <td style="width: 180px;">${series[1].name}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="body">
                      <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
                        <tbody>`
                for (let i = 0, l = axisData.length; i < l; i++) {
                  table += `
                    <tr>
                      <td style="width: 180px;">${axisData[i]}</td>
                      <td style="width: 180px;">${series[0].data[i]}</td>
                      <td style="width: 180px;">${series[1].data[i]}</td>
                    </tr>`
                }
                table += '</tbody></table></div></div>'
                return table
              }
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          extraCssText:
            `background-color: rgba(19, 47, 64, 0.96);
            border: 1px solid rgba(60, 166, 200, 0.7);
            box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
            border-radius: 8px;`,
          axisPointer: {
            lineStyle: {
              color: 'rgba(60,166,200,0.7)'
            }
          },
          formatter: function (params) {
            var result = ''
            params.forEach((item, index) => {
              if (index == 1) {
                item.name = ''
              } else {
                item.name = item.name + '<br/>'
              }
              result += item.name + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ': ' + item.value + '%' + '<br/>'
            })

            return result
          }
        },
        xAxis: {
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 15,
            color: '#fff',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: []
        },
        yAxis: {
          min: 'dataMin',
          max: 'dataMax',
          minInterval: 1,
          splitLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 15,
            color: '#7a939e',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'none',
          startValue: -24,
          end: 100
        }],
        series: [
          {
            name: 'CPU占用率',
            type: 'line',
            // data: [120, 132, 101, 134, 90, 230, 210]
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            connectNulls: true,
            itemStyle: {
              normal: {
                color: 'rgb(3, 167, 134)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(3, 167, 134, 0.8)'
                  }, {
                    offset: 0.5, color: 'rgba(3, 167, 134, 0.5)'
                  }, {
                    offset: 1, color: 'rgba(3, 167, 134, 0.1)'
                  }]
                }
              }
            },
            // label: {
            //   normal: {
            //     show: false,
            //     position: 'center'
            //   }
            // },
            // markPoint: {
            //   data: [
            //     {type: 'max', name: '最大值'},
            //     {type: 'min', name: '最小值'}
            //   ]
            // },
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(3, 167, 134)',
              textStyle: {
                fontSize: 0, // this.fontSizeRs,
                fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
              }
            },
            data: []
          },
          {
            name: '内存占用率',
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              normal: {
                color: 'rgb(60, 166, 200)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(60, 166, 200, 0.8)'
                  }, {
                    offset: 0.5, color: 'rgba(60, 166, 200, 0.5)'
                  }, {
                    offset: 1, color: 'rgba(60, 166, 200, 0.1)'
                  }]
                }
              }
            },
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(60, 166, 200)',
              textStyle: {
                fontSize: 0, // this.fontSizeRs,
                fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
              }
            },
            data: []
          }
        ]
      },
      // jvm --------------------------------------------------------------
      jvmChart: null,
      jvmChartEl: null,
      jvmOptions: {
        title: {
          text: 'jvm动态分析',
          textAlign: 'left',
          left: 100 / 1065 * 20 + '%',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 0, // this.fontSizeSt,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        legend: {
          align: 'auto',
          inactiveColor: 'rgba(122, 147, 158, 0.6)',
          itemGap: 20,
          textStyle: {
            color: '#7a939e',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: ['缓冲区', '内存']
        },
        grid: {
          left: 100 / 1065 * 40 + '%',
          right: 100 / 1065 * 45 + '%',
          top: 100 / 224 * 40 + '%',
          bottom: 100 / 224 * 10 + '%',
          containLabel: true
        },
        toolbox: {
          right: 100 / 1065 * 35 + '%',
          itemSize: 0, // this.fontSizeRs,
          iconStyle: {
            borderColor: '#7a939e'
          },
          feature: {
            dataView: {
              title: '转换表格',
              readOnly: true,
              backgroundColor: 'transparent',
              textareaColor: 'rgba(8, 25, 38, 1)',
              textareaBorderColor: 'rgba(60, 166, 200, 0.7)',
              textColor: '#fff',
              lang: ['', '关闭'],
              buttonColor: 'rgba(60, 166, 200, 0.4)',
              optionToContent: function (opt) {
                let axisData = opt.xAxis[0].data
                let series = opt.series
                let table = `
                  <div class="echarts-view">
                    <div class="close el-dialog__headerbtn">
                      <i class="el-dialog__close el-icon el-icon-close" onclick="documentElement.getElementsByClassName('echarts-view')[0].parentElement.parentElement.style.display = 'none'"></i>
                    </div>
                    <div class="header">
                      <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td style="width: 180px;">统计</td>
                            <td style="width: 180px;">${series[0].name}</td>
                            <td style="width: 180px;">${series[1].name}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="body">
                      <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
                        <tbody>`
                for (let i = 0, l = axisData.length; i < l; i++) {
                  table += `
                    <tr>
                      <td style="width: 180px;">${axisData[i]}</td>
                      <td style="width: 180px;">${series[0].data[i]}</td>
                      <td style="width: 180px;">${series[1].data[i]}</td>
                    </tr>`
                }
                table += '</tbody></table></div></div>'
                return table
              }
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          extraCssText:
            `background-color: rgba(19, 47, 64, 0.96);
            border: 1px solid rgba(60, 166, 200, 0.7);
            box-shadow: 0 0 30px rgba(60, 166, 200, 0.4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
            border-radius: 8px;`,
          axisPointer: {
            lineStyle: {
              color: 'rgba(60,166,200,0.7)'
            }
          },
          formatter: function (params) {
            var result = ''
            params.forEach((item, index) => {
              if (index == 1) {
                item.name = ''
              } else {
                item.name = item.name + '<br/>'
              }
              result += item.name + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ': ' + item.value + '%' + '<br/>'
            })

            return result
          }
        },
        xAxis: {
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 15,
            color: '#fff',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          },
          data: []
        },
        yAxis: {
          min: 'dataMin',
          max: 'dataMax',
          minInterval: 1,
          splitLine: {
            lineStyle: {
              color: 'rgba(60, 166, 200, 0.3)'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 15,
            color: '#7a939e',
            fontSize: 0, // this.fontSizeRs,
            fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'none',
          startValue: -24,
          end: 100
        }],
        series: [
          {
            name: '缓冲区',
            type: 'line',
            // data: [120, 132, 101, 134, 90, 230, 210]
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            connectNulls: true,
            itemStyle: {
              normal: {
                color: 'rgb(3, 167, 134)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(3, 167, 134, 0.8)'
                  }, {
                    offset: 0.5, color: 'rgba(3, 167, 134, 0.5)'
                  }, {
                    offset: 1, color: 'rgba(3, 167, 134, 0.1)'
                  }]
                }
              }
            },
            // label: {
            //   normal: {
            //     show: false,
            //     position: 'center'
            //   }
            // },
            // markPoint: {
            //   data: [
            //     {type: 'max', name: '最大值'},
            //     {type: 'min', name: '最小值'}
            //   ]
            // },
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(3, 167, 134)',
              textStyle: {
                fontSize: 0, // this.fontSizeRs,
                fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
              }
            },
            data: []
          },
          {
            name: '内存',
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              normal: {
                color: 'rgb(60, 166, 200)',
                borderColor: '#071622',
                borderWidth: 2
              }
            },
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(60, 166, 200, 0.8)'
                  }, {
                    offset: 0.5, color: 'rgba(60, 166, 200, 0.5)'
                  }, {
                    offset: 1, color: 'rgba(60, 166, 200, 0.1)'
                  }]
                }
              }
            },
            tooltip: {
              formatter: '{c}',
              backgroundColor: 'rgb(60, 166, 200)',
              textStyle: {
                fontSize: 0, // this.fontSizeRs,
                fontFamily: `'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif`
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (row.apiStatus == 'true') {
        return 'color-alarm'
      }
    },
    // 列表选中事件
    tableChange (data) {
      if (data.currentRow) {
        for (let i = 0; i < this.formData.formData.length; i++) {
          this.$set(this.formData.formData[i], 'value', data.currentRow[this.formData.formData[i].key])
        }
      }
    },
    openSubscribeDia (row) {
      this.subscribeData.data.hostAddress = row.hostAddress
      this.subscribeData.data.port = row.port
      this.subscribeData.data.applicationName = row.applicationName
      this.subscribeData.data.serviceName = row.serviceName
      getQueryAll(this.subscribeData.url + `${this.subscribeData.data.hostAddress}:${this.subscribeData.data.port}:${this.subscribeData.data.applicationName}:${this.subscribeData.data.serviceName}`).then(res => {
        if (res.data.success) {
          this.subscribeData.tableData = res.data.data.apiInfoVOS
          this.$set(this.subscribeData.data, 'serviceName', res.data.data.serviceName)
          this.$set(this.subscribeData.data, 'dbStatus', res.data.data.dbStatus)
        } else {
          this.showError('获取API列表', '请重新尝试 !')
        }
      })
      this.subscribeData.visible = true
    },
    checked () {
      this.subscribeData.multipleSelection.filter(item => {
        this.$refs.multipleTable.toggleRowSelection(item, true)
      })
    },
    closeSubscribeDialog () {
      this.subscribeData.loading = false
      this.subscribeData.visible = false
      // 清空数据
      this.subscribeData.data = {}
      this.subscribeData.tableData = []
      this.subscribeData.multipleSelection = []
    },
    openHomeDia (row) {
      this.homeData.data.hostAddress = row.hostAddress
      getQueryAll(this.homeData.url + `${this.homeData.data.hostAddress}`).then(res => {
        if (res.data.success) {
          this.$set(this.homeData.data, 'hostAddress', res.data.data.hostAddress)
          this.$set(this.homeData.data, 'systemVersion', res.data.data.systemVersion)

          this.$set(this.homeData.data, 'diskTotal', res.data.data.diskTotal)
          this.$set(this.homeData.data, 'diskFree', res.data.data.diskFree)
          this.$set(this.homeData.data, 'diskBusy', res.data.data.diskTotal - res.data.data.diskFree)

          this.$nextTick(() => {
            // disk -------------------------------------------------
            this.diskChartEl = document.getElementById('diskChart')
            this.diskChart = this.$echarts.init(this.diskChartEl)

            // charts
            this.diskOptions.series[0].data = [
              {value: this.homeData.data.diskBusy, name: '占用', itemStyle: {color: '#3DA6CC', borderColor: '#071622', borderWidth: 2}},
              {value: this.homeData.data.diskFree, name: '空闲', itemStyle: {color: '#7A939E', borderColor: '#071622', borderWidth: 2}}
            ]

            // cpu -------------------------------------------------
            this.cpuChartEl = document.getElementById('cpuChart')
            this.cpuChart = this.$echarts.init(this.cpuChartEl)

            this.$set(this.homeData.data, 'sysRecordDate', [])
            this.$set(this.homeData.data, 'sysRecordDate', res.data.data.sysRecordDate)
            this.$set(this.homeData.data, 'cpuUsage', [])
            this.$set(this.homeData.data, 'cpuUsage', res.data.data.cpuUsage.map(item => (item * 100).toFixed(2)))
            this.$set(this.homeData.data, 'memoryUsage', [])
            this.$set(this.homeData.data, 'memoryUsage', res.data.data.memoryUsage.map(item => (item * 100).toFixed(2)))
            this.cpuOptions.xAxis.data = this.homeData.data.sysRecordDate
            this.cpuOptions.series[0].data = this.homeData.data.cpuUsage
            this.cpuOptions.series[1].data = this.homeData.data.memoryUsage

            // jvm -------------------------------------------------
            this.jvmChartEl = document.getElementById('jvmChart')
            this.jvmChart = this.$echarts.init(this.jvmChartEl)

            this.$set(this.homeData.data, 'jvmRecordDate', [])
            this.$set(this.homeData.data, 'jvmRecordDate', res.data.data.jvmRecordDate)
            this.$set(this.homeData.data, 'jvmBufferUsage', [])
            this.$set(this.homeData.data, 'jvmBufferUsage', res.data.data.jvmBufferUsage.map(item => (item * 100).toFixed(2)))
            this.$set(this.homeData.data, 'jvmMemoryUsage', [])
            this.$set(this.homeData.data, 'jvmMemoryUsage', res.data.data.jvmMemoryUsage.map(item => (item * 100).toFixed(2)))
            this.jvmOptions.xAxis.data = this.homeData.data.jvmRecordDate
            this.jvmOptions.series[0].data = this.homeData.data.jvmBufferUsage
            this.jvmOptions.series[1].data = this.homeData.data.jvmMemoryUsage
            this.updateView()
          })
        } else {
          this.showError('获取主机信息', '请重新尝试 !')
        }
      })
      this.homeData.visible = true
    },
    diskFormatter (name) {
      let index = 0
      let clientlabels = ['占用', '空闲']
      let clientcounts = [this.homeData.data.diskBusy, this.homeData.data.diskFree]
      clientlabels.forEach(function (value, i) {
        if (value == name) {
            index = i
        }
      })
      return name + '  ' + clientcounts[index]
    },
    closeHomeDialog () {
      this.homeData.loading = false
      this.homeData.visible = false
      // 清空数据
      this.homeData.data = {}
      this.homeData.tableData = []
      this.homeData.multipleSelection = []
    },
    handleSubSelectionChange (val) {
      this.subscribeData.multipleSelection = val
    },
    updateView () {
      this.diskChart.setOption(this.diskOptions, true)
      this.cpuChart.setOption(this.cpuOptions, true)
      this.jvmChart.setOption(this.jvmOptions, true)
    }
  },
  watch: {
  }
}
</script>
<style>
.menu-status-dialog>.el-dialog {
  height: 650px;
}
.morrow-button-dpd>li:first-of-type {
  border-top: 0;
}
.morrow-button-dpd .el-dropdown-menu__item--divided {
  margin-top: 0;
  border-top: 1px solid rgba(60, 166, 200, 0.3);
}
.morrow-button-dpd .el-dropdown-menu__item--divided:before {
  height: 0 !important;
}
.dbStatus {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 5px 0 8px;
  background-color: red;
  border-radius: 50%;
}
.dbStatus-footer {
  color: #7a939e!important;
}
.stat-block {
  height: calc(100% - 40px)!important;
  flex-grow: 1;
  display: flex;
}
.disk-wrapper{
  width: 100%;
  height: 100%;
  display: flex;
}
.disk {
  width: 30%;
  height: 100%;
}
.cpu-wrapper {
  width: 70%;
  height: 100%;
}
.cpu-wrapper>div {
  display: flex;
  flex-direction: column;
  height: 47%;
  width: 100%;
}
.cpu-wrapper>div:nth-child(1) {
  margin-bottom: 15px;
}
</style>
