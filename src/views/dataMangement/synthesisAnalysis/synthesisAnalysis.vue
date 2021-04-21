<template>
  <div class="appContation">
    <div class="mainWrapper" v-permission="['dataMangement/pageList']">
      <div class="mainHeader">
        <span class="title">数据查询</span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-form-item label="" prop="quotaName">
            <el-input v-model="queryParams.quotaName" placeholder="请输入指标名称" />
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="queryQuotaList()">查询</el-button>
            <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <ul class="moudleWrap">
      <li @click="moudleNameClick('经济发展')" :class="{active:queryParams.moduleName === '经济发展'}">经济发展</li>
      <li @click="moudleNameClick('科技创新')" :class="{active:queryParams.moduleName === '科技创新'}">科技创新</li>
      <li @click="moudleNameClick('社会民生')" :class="{active:queryParams.moduleName === '社会民生'}">社会民生</li>
      <li @click="moudleNameClick('生态环境')" :class="{active:queryParams.moduleName === '生态环境'}">生态环境</li>
      <li @click="moudleNameClick('质量效益')" :class="{active:queryParams.moduleName === '质量效益'}">质量效益</li>
      <li @click="moudleNameClick('综合评价')" :class="{active:queryParams.moduleName === '综合评价'}">综合评价</li>
    </ul>
    <div class="mainWrapper">
      <div class="mainHeader mainHeader1">
        <span class="title">数据指标信息列表</span>
      </div>
      <div class="mainContent">
        <el-table ref="titlesTable" :data="titlesList" border fit highlight-current-row>
          <el-table-column width="65" align="center" type="index" label="序号" />
          <el-table-column align="center" show-overflow-tooltip prop="quotaName" label="指标名称" sortable></el-table-column>
          <el-table-column width="380" align="center" show-overflow-tooltip prop="source" label="数据来源" />
          <el-table-column width="180" align="center" fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn1" @click="jumpUrl('SynthesisAnalysisDetail',scope.row)" v-permission="['dataMangement/detail']">查看详情</span>
            </template>
          </el-table-column>
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
import { apiGet, apiPost, apiDelete } from '@/utils/request'
export default {
  data() {
    return {
      total: 0, // 指标表格总数
      currentPage: 1, // 指标表格当前页码
      pageSize: 10, // 指标表格整页大小
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        subjectName: '综合分析',
        moduleName: '经济发展',
        quotaName: '',
      }, // 获取指标列表查询参数
      titlesList: [], // 指标列表
    }
  },
  mounted() {
    this.queryQuotaList()
  },
  methods: {
    // 获取指标列表数据
    queryQuotaList() {
      apiGet('system/data/quotaPageList', this.queryParams).then((res) => {
        const { data } = res
        this.total = data.total
        this.titlesList = data.list
      })
    },
    // 重置搜索栏
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.queryQuotaList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.queryQuotaList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryQuotaList()
    },
    // 子模块点击事件
    moudleNameClick(val) {
      this.queryParams.moduleName = val
      this.queryQuotaList()
    },
    // 跳转路由
    jumpUrl(path, row) {
      this.$router.push({
        name: path,
        query: {
          quotaCode: row.quotaCode,
          pageTitle: row.quotaName,
          templateType:row.templateType
        },
      })
    },
  },
}
</script>