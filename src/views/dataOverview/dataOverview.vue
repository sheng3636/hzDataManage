<template>
  <div class="appContation">
    <div class="topArea">
      <div :span="5" class="realDataWrap">
        <span>实时总数据量</span>
        <span class="count">{{countObj.total}}</span>
      </div>
      <ul class="moduleTab">
        <li :class="{active:indicatorParams.subjectName === '综合分析'}" @click="moudleNamelick('综合分析')">
          <img src="../../assets/customImages/hz9.png">
          <p>综合分析</p>
          <p class="count">{{countObj.zhfx}}</p>
        </li>
        <li :class="{active:indicatorParams.subjectName === '产业发展'}" @click="moudleNamelick('产业发展')">
          <img src="../../assets/customImages/hz10.png">
          <p>产业发展</p>
          <p class="count">{{countObj.cyfz}}</p>
        </li>
        <li :class="{active:indicatorParams.subjectName === '综合交通'}" @click="moudleNamelick('综合交通')">
          <img src="../../assets/customImages/hz11.png">
          <p>综合交通</p>
          <p class="count">{{countObj.zhjt}}</p>
        </li>
        <li :class="{active:indicatorParams.subjectName === '能源发展'}" @click="moudleNamelick('能源发展')">
          <img src="../../assets/customImages/hz12.png">
          <p>能源发展</p>
          <p class="count">{{countObj.nyfz}}</p>
        </li>
        <li :class="{active:indicatorParams.subjectName === '人口社会'}" @click="moudleNamelick('人口社会')">
          <img src="../../assets/customImages/hz13.png">
          <p>人口社会</p>
          <p class="count">{{countObj.rksh}}</p>
        </li>
        <li :class="{active:indicatorParams.subjectName === '生态环境'}" @click="moudleNamelick('生态环境')">
          <img src="../../assets/customImages/hz14.png">
          <p>生态环境</p>
          <p class="count">{{countObj.sthj}}</p>
        </li>
      </ul>
    </div>
    <ul class="moudleWrap">
      <li @click="titleClick(index,item)" :class="{active:titleActive === index}" v-for="(item,index) in titlesList"
        :key="index">{{item}}</li>
    </ul>
    <div class="swiper-container indicatorList">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in indicatorList"
          :class="{ slideActive: whichIndicator === index }" :key="index" @click="indicatorListClick(index, item)">
          {{ item.quotaName }}
        </div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
    <div class="bottomArea">
      <el-row :gutter="20">
        <el-col :span="13">
          <div class="mainWrapper">
            <div class="mainHeader mainHeader1">
              <span class="title">{{indicatorList[whichIndicator]['quotaName']}}</span>
              <div class="searchBar">
                <el-select v-model="quatoParams.areaName" placeholder="请选择" @change="queryQuotaDetail">
                  <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="mainContent">
              <div id="indicatorChart"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="mainWrapper">
            <div class="mainHeader mainHeader1">
              <span class="title">{{indicatorList[whichIndicator]['quotaName']}}</span>
              <div class="searchBar">
                <span class="button button2" v-if="!dataFull" @click="exportMissData()">导出缺失数据</span>
                <div class="switchWrap">
                  <span @click="chagneDataFullFn" :class="{active:dataFull}">已入库数据</span>
                  <span @click="chagneDataFullFn" :class="{active:!dataFull}">缺失数据</span>
                </div>
              </div>
            </div>
            <div class="mainContent">
              <el-table ref="branchTable" :data="dataFullList" border fit highlight-current-row height="496px">
                <el-table-column align="center" width="65" type="index" label="序号" />
                <el-table-column align="center" prop="year" label="年份" sortable></el-table-column>
                <el-table-column align="center" prop="areas" label="区域" />
                <el-table-column align="center" prop="areasCode" label="区划代码" :formatter="completeAreaCodeFn" sortable>
                </el-table-column>
                <el-table-column align="center" prop="source" label="数据来源" />
              </el-table>
              <div class="paginationWrap">
                <el-pagination :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />
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
import cityTown from '@/utils/cityTown'
require('echarts/theme/macarons') // echarts theme
export default {
  name: 'Home',
  data() {
    return {
      countObj: {
        total: 0,
      }, // 顶部六大模块数据
      titlesObj: {
        zhfx: [
          '经济发展',
          '科技创新',
          '社会民生',
          '生态环境',
          '质量效益',
          '综合评价',
        ],
        cyfz: ['三次产业结构', '制造业结构', '服务业结构'],
        zhjt: ['交通经济', '交通设施', '运输服务'],
        nyfz: ['能源供应', '能源效率', '能源消费'],
        rksh: ['人口总量', '人口结构', '人口分布', '人口迁移'],
        sthj: ['环境质量', '生态资源', '污染物排放', '生态资源状况'],
      },
      titlesList: [
        '经济发展',
        '科技创新',
        '社会民生',
        '生态环境',
        '质量效益',
        '综合评价',
      ],
      titleActive: 0,

      whichIndicator: 0,
      indicatorParams: {
        pageNo: 1,
        pageSize: 300,
        type: 0,
        subjectName: '综合分析',
        moduleName: '经济发展',
        quotaName: '',
      }, // 获取指标列表查询参数
      indicatorList: [],

      areaList: [
        {
          value: '浙江省',
          label: '浙江省',
        },
        {
          value: '杭州市',
          label: '杭州市',
        },
        {
          value: '湖州市',
          label: '湖州市',
        },
        {
          value: '绍兴市',
          label: '绍兴市',
        },
        {
          value: '宁波市',
          label: '宁波市',
        },
        {
          value: '嘉兴市',
          label: '嘉兴市',
        },
        {
          value: '丽水市',
          label: '丽水市',
        },
        {
          value: '台州市',
          label: '台州市',
        },
        {
          value: '温州市',
          label: '温州市',
        },
        {
          value: '金华市',
          label: '金华市',
        },
        {
          value: '衢州市',
          label: '衢州市',
        },
        {
          value: '舟山市',
          label: '舟山市',
        },
      ],
      quatoParams: {
        quatoCode: '',
        areaName: '浙江省',
      },
      dataZoomChartObj: {
        id: 'indicatorChart',
        xAxis: [],
        barWidth: 45,
        chartArr: [
          {
            name: '各年份数据详情（条）',
            chartType: 'bar',
            color: 'rgba(82,184,255)',
            labelHide: false,
            yAxis: [],
          },
        ],
      },

      dataFull: true,
      total: 0, // 指标数据是否完整表格总数
      currentPage: 1, // 指标数据是否完整表格当前页码
      pageSize: 10, // 指标数据是否完整表格整页大小
      dataFullQueryParams: {
        pageNo: 1,
        pageSize: 10,
        quatoCode: '',
        parentArea: '浙江省',
        year: '',
      }, // 获取指标数据是否完整列表查询参数
      dataFullList: [], // 指标数据是否完整列表
    }
  },
  mounted() {
    // 获取顶部六大模块数据详情
    apiGet('/system/home/dataModule').then((res) => {
      const { data } = res
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        switch (element.name) {
          case '综合交通':
            this.countObj.zhjt = element.value
            break
          case '生态环境':
            this.countObj.sthj = element.value
            break
          case '能源发展':
            this.countObj.nyfz = element.value
            break
          case '综合分析':
            this.countObj.zhfx = element.value
            break
          case '产业发展':
            this.countObj.cyfz = element.value
            break
          default:
            this.countObj.rksh = element.value
            break
        }
      }
      for (const key in this.countObj) {
        const element = this.countObj[key]
        this.countObj.total += this.countObj[key]
      }
    })
    this.queryQuotaList()
  },
  methods: {
    // 六大模块点击事件
    moudleNamelick(val) {
      switch (val) {
        case '综合分析':
          this.titlesList = this.titlesObj.zhfx
          break
        case '产业发展':
          this.titlesList = this.titlesObj.cyfz
          break
        case '综合交通':
          this.titlesList = this.titlesObj.zhjt
          break
        case '能源发展':
          this.titlesList = this.titlesObj.nyfz
          break
        case '人口社会':
          this.titlesList = this.titlesObj.rksh
          break
        default:
          this.titlesList = this.titlesObj.sthj
          break
      }

      this.indicatorParams.subjectName = val
      this.indicatorParams.moduleName = this.titlesList[0]

      this.titleActive = 0

      this.whichIndicator = 0

      this.quatoParams.areaName = '浙江省'
      this.quatoParams.quatoCode = this.indicatorList[0].quotaCode

      this.dataFull = true
      this.currentPage = 1
      this.pageSize = 10
      this.queryQuotaList()
    },
    // 子模块点击事件
    titleClick(index, val) {
      this.titleActive = index

      this.indicatorParams.moduleName = val

      this.whichIndicator = 0

      this.quatoParams.areaName = '浙江省'
      this.quatoParams.quatoCode = this.indicatorList[0].quotaCode
      
      this.dataFull = true
      this.currentPage = 1
      this.pageSize = 10
      this.queryQuotaList()
    },
    // 获取指标列表数据
    queryQuotaList() {
      apiGet('system/data/quotaPageList', this.indicatorParams).then((res) => {
        const { data } = res
        this.indicatorList = data.list
        this.$nextTick(() => {
          new Swiper('.indicatorList', {
            slidesPerView: 'auto',
            loop: false,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          })
        })

        this.quatoParams.quatoCode = data.list[0].quotaCode
        this.queryQuotaDetail()

        this.dataFullQueryParams.quatoCode = data.list[0].quotaCode
        this.queryDataFullList()
      })
    },
    // 获取某区域指标各年份数据详情
    queryQuotaDetail() {
      this.dataFull = true
      this.currentPage = 1
      this.pageSize = 10
      
      this.dataZoomChartObj.xAxis = []
      this.dataZoomChartObj.chartArr[0].yAxis = []
      apiGet('system/home/dataNum', this.quatoParams).then((res) => {
        const { data } = res
        // for (let i = 0; i < data.length; i++) {
        //   const element = data[i]
        //   this.dataZoomChartObj.xAxis.push(element.name)
        //   this.dataZoomChartObj.chartArr[0].yAxis.push(element.value)
        // }
        this.dataZoomChartObj.xAxis = data.xData 
        this.dataZoomChartObj.chartArr[0].yAxis = data.yData 
        console.log(this.dataZoomChartObj);
        this.dataZoomChart(this.dataZoomChartObj)
        this.dataFullQueryParams.parentArea = this.quatoParams.areaName
        this.queryDataFullList()
      })
    },
    // 具体指标值点击事件
    indicatorListClick(index, val) {
      this.whichIndicator = index

      this.quatoParams.areaName = '浙江省'
      this.quatoParams.quatoCode = val.quotaCode
      this.queryQuotaDetail()
      
      this.dataFull = true
      this.currentPage = 1
      this.pageSize = 10
      this.dataFullQueryParams.quatoCode = val.quotaCode
      this.queryDataFullList()
    },
    // 区域缩放图
    dataZoomChart(data) {
      let legends = []
      let barLineColors = []
      let seriesArr = []
      for (let i = 0; i < data.chartArr.length; i++) {
        legends.push(data.chartArr[i].name)
        barLineColors.push(data.chartArr[i].color)
        seriesArr.push({
          name: data.chartArr[i].name,
          type: data.chartArr[i].chartType,
          barWidth: data.barWidth,
          barGap: '0%',
          itemStyle: {
            normal: {
              color: data.chartArr[i].color,
            },
          },
          label: {
            normal: {
              show: !data.chartArr[i].labelHide,
              position: 'top',
              textStyle: {
                fontSize: 16,
                color: data.chartArr[i].color,
              },
            },
          },
          data: data.chartArr[i].yAxis,
        })
      }
      let chart = echarts.init(document.getElementById(data.id))
      let option = {
        color: barLineColors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
            },
          },
        },
        calculable: true,
        legend: {
          top: '2%',
          x: 'center',
          textStyle: {
            fontSize: 14,
            color: '#000',
          },
          data: legends,
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                var ret = '' //拼接加\n返回的类目项
                var maxLength = 4 //每项显示文字个数
                var valLength = value.length //X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength) //类目项需要换行的行数
                if (rowN > 1) {
                  //如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = '' //每次截取的字符串
                    var start = i * maxLength //开始截取的位置
                    var end = start + maxLength //结束截取的位置
                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + '\n'
                    ret += temp //凭借最终的字符串
                  }
                  return ret
                } else {
                  return value
                }
              },
              padding: [5, 0, 5, 0],
              color: '#000',
            },
            axisLine: {
              lineStyle: {
                color: '#6291fb',
              },
            },
            data: data.xAxis,
          },
        ],
        yAxis: [
          {
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#000',
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#0124b3',
              },
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            // start: 0,
            // end: 90,
            startValue: data.xAxis.length < 2 ? 0 : data.xAxis.length - 10,
            endValue: data.xAxis.length - 1,
            height: 20,
            textStyle: {
              fontSize: 14,
              color: '#000',
            },
          },
        ],
        series: seriesArr,
      }
      chart.clear()
      chart.getZr().on('click', (params) => {
        this.dataFull = true
        this.currentPage = 1
        this.pageSize = 10
        var point = [params.offsetX, params.offsetY]
        if (chart.containPixel('grid', point)) {
          var xIndex = chart.convertFromPixel({ seriesIndex: 0 }, point)[0]
          var op = chart.getOption()
          var name = op.xAxis[0].data[xIndex]
          this.dataFullQueryParams.year = name
          this.queryDataFullList()
        }
      })
      chart.setOption(option)
    },
    // 获取指标入库以及缺失数据
    queryDataFullList() {
      let url = this.dataFull
        ? 'system/data/quotaDataPageList'
        : 'system/data/missingDataPageList'
      apiGet(url, this.dataFullQueryParams).then((res) => {
        const { data } = res
        this.total = data.total
        this.dataFullList = data.list
      })
    },
    // 已入库数据缺失数据切换
    chagneDataFullFn() {
      this.currentPage = 1
      this.pageSize = 10
      this.dataFull = !this.dataFull
      this.queryDataFullList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.dataFullQueryParams.pageNo = val
      this.queryDataFullList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.dataFullQueryParams.pageSize = val
      this.queryDataFullList()
    },
    // 补全浙江省下属区域市县的区划代码
    completeAreaCodeFn(row) {
      let key = cityTown[row.areas].cod
      return key
    },
    // 导出缺失数据
    exportMissData() {
      // http://192.168.0.166:8083/system/data/missingDataExport?quatoCode=10000000001&parentArea=%E6%B5%99%E6%B1%9F%E7%9C%81&year=
      window.open(`${process.env.VUE_APP_BASE_API}system/data/missingDataExport?year=${this.dataFullQueryParams.year}&quatoCode=${this.dataFullQueryParams.quatoCode}&parentArea=${this.dataFullQueryParams.parentArea}`,'_self')
    }
  },
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
@import './dataOverview.scss';
</style>
