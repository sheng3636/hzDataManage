<template>
  <div class="appContation">
    <div class="topArea">
      <el-row :gutter="20">
        <el-col :span="5">
          <ul class="countWrap">
            <li>
              <p>
                <span>历史访问量</span>
                <span class="count1">{{userOverviewObj.historyView}}</span>
              </p>
              <p>
                <span>今日访问量</span>
                <span class="count2">{{userOverviewObj.todayView}}</span>
              </p>
            </li>
            <li>
              <p>
                <span>实时用户量</span>
                <span class="count1">{{userOverviewObj.currUserCount}}</span>
              </p>
            </li>
            <li>
              <p>
                <span>实时数据量</span>
                <span class="count1">{{userOverviewObj.currDataCount}}</span>
              </p>
            </li>
          </ul>
        </el-col>
        <el-col :span="8">
          <div id="indicatorsChart"></div>
        </el-col>
        <el-col :span="11">
          <div id="userChart"></div>
        </el-col>
      </el-row>
    </div>
    <div class="bottomArea">
      <el-row :gutter="20">
        <el-col :span="14">
          <div class="mainWrapper">
            <div class="mainHeader mainHeader1">
              <span class="title">反馈信息</span>
              <div class="searchBar">
                <span class="linkBtn" @click="goPage('feedback/feedback')">查看更多>></span>
              </div>
            </div>
            <div class="mainContent">
              <el-table ref="feedbackTable" :data="feedbackList" border fit highlight-current-row height="496px">
                <el-table-column align="center" width="65" type="index" label="序号" />
                <el-table-column align="center" width="150" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" width="160" prop="deptName" label="部门" />
                <el-table-column align="center" width="180" prop="createTime" label="反馈时间" sortable />
                <el-table-column align="center" width="300" prop="moduleName" label="板块" />
                <el-table-column align="center" show-overflow-tooltip prop="content" label="反馈内容" />
              </el-table>
              <div class="paginationWrap">
                <el-pagination :current-page.sync="feedbackCurrentPage" :page-sizes="[10, 20, 30, 40]"
                  :page-size="feedbackPageSize" layout="total, sizes, prev, pager, next, jumper" :total="feedbackTotal"
                  @size-change="handleFeedbackSizeChange" @current-change="handleFeedbackCurrentChange" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="mainWrapper">
            <div class="mainHeader mainHeader1">
              <span class="title">系统日志</span>
              <div class="searchBar">
                <span class="linkBtn" @click="goPage('loginsLog/loginsLog')">查看更多>></span>
              </div>
            </div>
            <div class="mainContent">
              <el-table ref="branchTable" :data="logsList" border fit highlight-current-row height="496px">
                <el-table-column align="center" width="65" type="index" label="序号" />
                <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" prop="operation" label="操作" />
                <el-table-column align="center" prop="loginTime" label="时间" sortable />
              </el-table>
              <div class="paginationWrap">
                <el-pagination :current-page.sync="logsCurrentPage" :page-sizes="[10, 20, 30, 40]"
                  :page-size="logsPageSize" layout="total, sizes, prev, pager, next, jumper" :total="logsTotal"
                  @size-change="handleBranchSizeChange" @current-change="handleBranchCurrentChange" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { apiGet } from '@/utils/request'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
export default {
  name: 'Home',
  data() {
    return {
      userOverviewObj:{}, // 用户访问量
      feedbackTotal: 0, // 反馈信息表格总数
      feedbackCurrentPage: 1, // 反馈信息表格当前页码
      feedbackPageSize: 10, // 反馈信息表格整页大小
      feedbackQueryParams: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        deptId: '',
        startTime: '',
        endTime: '',
      }, // 获取反馈信息列表查询参数
      feedbackList: [], // 反馈信息列表
      logsTotal: 0, // 部门表格总数
      logsCurrentPage: 1, // 部门表格当前页码
      logsPageSize: 10, // 部门表格整页大小
      logsQueryParams: {
        pageNo: 1,
        pageSize: 10
      }, // 获取部门列表查询参数
      logsList: [], // 部门列表
      indicatorsChart: null,
      userChart: null,
    }
  },
  mounted() {
    this.queryFeedbackList()
    this.queryLogsList()
    // 获取用户访问量
    apiGet('/system/home/overview').then((res) => {
      this.userOverviewObj = res.data
    })
    // 获取行业指标数据详情
    apiGet('/system/home/dataModule').then((res) => {
      const { data } = res
      let chartObj = {
        yAxis: [],
        xAxis: []
      }
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        chartObj.xAxis.push(element.value)
        chartObj.yAxis.push(element.name)
      }
      this.indicatorsChartInit(chartObj)
    })
    // 获取实时用户分布情况
    apiGet('/system/home/userDept').then((res) => {
      const { data } = res
      this.$nextTick(() => {
        this.userChartInit(data)
      })
    })
    window.addEventListener('resize', () => {
      this.indicatorsChart.resize()
      this.userChart.resize()
    })
  },
  methods: {
    // 跳转页面
    goPage(url) {
      this.$router.push({ path: url })
    },
    // 获取反馈信息列表数据
    queryFeedbackList() {
      apiGet('/system/feedback/pageList', this.feedbackQueryParams).then(
        (res) => {
          const { data } = res
          this.feedbackTotal = data.total
          this.feedbackList = data.list
        }
      )
    },
    // page变化触动函数
    handleFeedbackCurrentChange(val) {
      this.feedbackQueryParams.pageNo = val
      this.queryFeedbackList()
    },
    // pageSize变化触动函数
    handleFeedbackSizeChange(val) {
      this.feedbackQueryParams.pageSize = val
      this.queryFeedbackList()
    },
    // 获取系统日志列表数据
    queryLogsList() {
      apiGet('system/logging/pageList', this.logsQueryParams).then((res) => {
        const { data } = res
        this.logsTotal = data.total
        this.logsList = data.list
      })
    },
    // page变化触动函数
    handleBranchCurrentChange(val) {
      this.logsQueryParams.pageNo = val
      this.queryLogsList()
    },
    // pageSize变化触动函数
    handleBranchSizeChange(val) {
      this.logsQueryParams.pageSize = val
      this.queryLogsList()
    },

    // 行业指标数据详情图表
    indicatorsChartInit(data) {
      this.indicatorsChart = echarts.init(
        document.getElementById('indicatorsChart')
      )
      var charts = data
      var top10CityData = charts.xAxis
      let lineY = []
      for (var i = 0; i < charts.yAxis.length; i++) {
        var data = {
          name: charts.yAxis[i],
          value: top10CityData[i],
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                [
                  {
                    offset: 0,
                    color: 'rgba(82,184,255)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,150,255)',
                  },
                ],
                false
              ),
            },
            emphasis: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
            },
          },
        }
        lineY.push(data)
      }
      this.indicatorsChart.setOption({
        title: {
          text: '行业指标数据详情',
          top: '3%',
          left: '3%',
          textStyle: {
            fontSize: 20,
            color: '#313131',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        grid: {
          borderWidth: 0,
          top: '13%',
          left: '5%',
          right: '15%',
          bottom: '3%',
        },
        yAxis: [
          {
            type: 'category',
            // inverse: true,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
              inside: false,
            },
            data: data.yAxis,
          },
          {
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
            },
            splitArea: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            data: top10CityData,
          },
        ],
        xAxis: {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        series: [
          {
            name: '',
            type: 'bar',
            zlevel: 2,
            barWidth: 15,
            data: lineY,
            animationDuration: 1500,
            label: {
              normal: {
                color: '#5a5a5a',
                show: true,
                position: [0, '-24px'],
                textStyle: {
                  fontSize: 16,
                },
                formatter: function (a, b) {
                  return a.name
                },
              },
            },
          },
        ],
        animationEasing: 'cubicOut',
      })
    },
    // 实时用户分布情况
    userChartInit(data) {
      let legends = []
      for (let i = 0; i < data.length; i++) {
        legends.push(data[i].name)
      }
      this.userChart = echarts.init(document.getElementById('userChart'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        title: {
          text: '实时用户分布情况',
          top: '3%',
          left: '3%',
          textStyle: {
            fontSize: 20,
            color: '#313131',
          },
        },
        legend: {
          // type: 'scroll',
          orient: 'vertical',
          right: '2%',
          top: '5%',
          itemGap: 25,
          icon: 'circle',
          selectedMode: false,
          textStyle: {
            fontSize: '14',
            color: '#000',
          },
          formatter: function (name) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                return name + ' ' + data[i].value
              }
            }
          },
          data: legends,
        },
        series: [
          {
            name: '用户分布',
            type: 'pie',
            radius: [100, 145],
            center: ['22%', '55%'],
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{b|{b}}\n{c|{c}}',
                rich: {
                  b: {
                    fontSize: 28,
                    lineHeight: 33,
                    color: '#00d7e9',
                  },
                  c: {
                    fontSize: 28,
                    padding: [8, 0],
                    color: '#00d7e9',
                  },
                },
              },
              emphasis: {
                show: true,
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
              normal: {
                color: function (params) {
                  let colorList = [
                    '#2072ed',
                    '#ff7723',
                    '#8e30ff',
                    '#23fddc',
                    '#2a885c',
                    '#d0fbff',
                    '#fed700',
                    '#96ff00',
                    '#ff89e5',
                    '#ffb0b0',
                    '#e8395d',
                    '#00fdad',
                    '#a0bdff',
                    '#cd8600',
                    '#ff856d',
                    '#980e7a',
                    '#00c669',
                  ]
                  return colorList[params.dataIndex]
                },
              },
            },
            data: data,
          },
        ],
      }
      this.userChart.setOption(option)
      pieSelected(this.userChart, data)

      function pieSelected(target, data, selecdFan) {
        let k = 0
        target.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: k,
        })
        target.on('mouseover', function (e) {
          if (e.dataIndex != k) {
            target.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: k,
            })
          }
        })
        target.on('mouseout', function () {
          target.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: k,
          })
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import './home.scss';
</style>
