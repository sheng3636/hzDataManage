<template>
  <div class="appContation">
    <div class="mainWrapper" v-permission="['logging/pageList']">
      <div class="mainHeader">
        <span class="title">日志查询</span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-form-item label="" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择查询类型" style="width:100%">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="keyWords">
            <el-input v-model="queryParams.keyWords" placeholder="请输入查询条件" />
          </el-form-item>
          <el-form-item label="" prop="startTime">
            <el-date-picker v-model="queryParams.startTime" :clearable="false" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker v-model="queryParams.endTime" :clearable="false" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择选择结束时间">
            </el-date-picker>
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="queryLoginLogList()">查询</el-button>
            <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="mainWrapper">
      <div class="mainHeader  mainHeader1">
        <span class="title" v-if="queryParams.type === 0">日志列表<b class="dataCountDetail">共查询到{{total}}条信息</b> </span>
        <span class="title" v-if="queryParams.type === 1">日志列表<b class="dataCountDetail">共查询到{{total}}条登录日志信息,共{{extendValue}}人登录</b></span>
        <span class="title" v-if="queryParams.type === 3">日志列表<b class="dataCountDetail">共查询到{{total}}条数据上传信息,共上传数据{{extendValue}}条</b> </span>
        <div class="searchBar">
          <span class="button button1" @click="exportLoginLogback" v-permission="['logging/export']">下载日志信息</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="loginLogTable" :data="loginLogList" border fit highlight-current-row>
          <el-table-column align="center" width="65" type="index" label="序号" />
          <el-table-column align="center" prop="name" label="姓名" sortable></el-table-column>
          <el-table-column align="center" prop="deptName" label="部门" />
          <el-table-column align="center" prop="operation" label="操作" />
          <el-table-column align="center" prop="detail" label="详情" sortable />
          <el-table-column align="center" prop="loginTime" label="时间" sortable />
        </el-table>
        <div class="paginationWrap">
          <el-pagination :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiGet } from '@/utils/request'
export default {
  name: 'loginsLog',
  data() {
    return {
      total: 0, // 登录日志表格总数
      currentPage: 1, // 登录日志表格当前页码
      pageSize: 10, // 登录日志表格整页大小
      typeList: [
        {
          label:'全部',
          value:0
        },
        {
          label:'登录日志',
          value:1
        },
        {
          label:'数据日志',
          value:3
        },
      ],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        keyWords: '',
        type: 0,
        startTime: '',
        endTime: '',
      }, // 获取登录日志列表查询参数
      loginLogList: [], // 登录日志列表
      extendValue:null
    }
  },
  mounted () {
    this.queryLoginLogList()
  },
  methods: {
    // 获取登录日志列表数据
    queryLoginLogList() {
      apiGet('system/logging/pageList', this.queryParams).then((res) => {
        const { data } = res
        this.extendValue = data.extendValue
        this.total = data.total
        this.loginLogList = data.list
      })
    },
    // 重置搜索栏
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.queryLoginLogList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.queryLoginLogList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryLoginLogList()
    },
    // 到处登录日志列表
    exportLoginLogback(){
      window.open(`${process.env.VUE_APP_BASE_API}/system/logging/export?startTime=${this.queryParams.startTime}&endTime=${this.queryParams.endTime}&keyWords=${this.queryParams.keyWords}&type=${this.queryParams.type}`,'_self')
    }
  },
}
</script>
<style lang="scss" scoped>
// @import './loginLog.scss';
</style>