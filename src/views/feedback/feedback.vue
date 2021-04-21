<template>
  <div class="appContation">
    <div class="mainWrapper" v-permission="['feedback/pageList']">
      <div class="mainHeader">
        <span class="title">信息查询</span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-form-item label="" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="" prop="deptId">
            <el-select v-model="queryParams.deptId" placeholder="请选择部门" style="width:100%">
              <el-option v-for="item in branchList" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" style="width:100%">
              <el-option v-for="item in statusOpts" :key="item.id" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="startTime">
            <el-date-picker v-model="queryParams.startTime" type="datetime" :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker v-model="queryParams.endTime" type="datetime" :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择选择结束时间">
            </el-date-picker>
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="queryFeedbackList()">查询</el-button>
            <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="mainWrapper">
      <div class="mainHeader  mainHeader1">
        <span class="title">信息列表</span>
        <div class="searchBar">
          <span class="button button1" @click="exportFeedback" v-permission="['feedback/export']">下载反馈信息</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="feedbackTable" :data="feedbackList" border fit highlight-current-row>
          <el-table-column align="center" width="65" type="index" label="序号" />
          <el-table-column align="center" width="180" prop="name" label="姓名" sortable></el-table-column>
          <el-table-column align="center" width="180" prop="deptName" label="部门" />
          <el-table-column align="center" width="180" prop="createTime" label="反馈时间" sortable />
          <el-table-column align="center" width="300" prop="moduleName" label="板块" />
          <el-table-column align="center" show-overflow-tooltip prop="content" label="反馈内容" />
          <el-table-column align="center" width="180" prop="status" label="状态">
            <template slot-scope="scope">
              <el-select v-model="scope.row.statusVal" placeholder="请选择状态" style="width:100%" v-if="scope.row.status === 0 && scope.row.username === storeObj.user.name"
                @change="changeStatus($event,scope.row)">
                <el-option v-for="item in statusOpts" :key="item.id" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-tag v-else :type="scope.row.status === 0 ? 'warning' : 'success'" disable-transitions>
                {{scope.row.status === 0 ? '未修改' : '已修改'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn1" @click="detailClick(scope.row)"
                v-permission="['feedback/detail']">查看详情</span>
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
    <el-dialog title="信息详情" :visible.sync="detailDialog" width="40%" center :close-on-click-modal="false"
      :close-on-press-escape="false" @close="detailCloseClick">
      <p class="detailHead">
        <span>{{detailObj.moduleName}}</span>
        <span>{{detailObj.name}}</span>
        <span>{{detailObj.createTime}}</span>
      </p>
      <el-input disabled type="textarea" :rows="12" v-model="detailObj.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailCloseClick">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { apiGet, apiPost } from '@/utils/request'
export default {
  name: 'feedback',
  data() {
    return {
      total: 0, // 反馈信息表格总数
      currentPage: 1, // 反馈信息表格当前页码
      pageSize: 10, // 反馈信息表格整页大小
      branchList: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        deptId: '',
        startTime: '',
        endTime: '',
        status: '',
      }, // 获取反馈信息列表查询参数
      feedbackList: [], // 反馈信息列表
      detailDialog: false, // 是否显示详情框
      detailObj: {}, // 详情信息
      statusOpts: [
        {
          label: '未修改',
          value: 0,
        },
        {
          label: '已修改',
          value: 1,
        },
      ],
      statusParams: {
        status: 0,
        id: '',
      },
    }
  },
  computed: {
    storeObj() {
      return this.$store.state
    }
  },
  mounted() {
    this.queryFeedbackList()
    this.queryBranchList()
  },
  methods: {
    // 获取部门列表数据
    queryBranchList() {
      apiGet('system/dept/list').then((res) => {
        this.branchList = res.data
      })
    },
    // 获取反馈信息列表数据
    queryFeedbackList() {
      apiGet('/system/feedback/pageList', this.queryParams).then((res) => {
        const { data } = res
        for (let i = 0; i < data.list.length; i++) {
          const element = data.list[i]
          element.statusVal = 0
        }
        this.total = data.total
        this.feedbackList = data.list
      })
    },
    // 重置搜索栏
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.queryFeedbackList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.queryFeedbackList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryFeedbackList()
    },
    // 显示详情框
    detailClick(row) {
      this.detailDialog = true
      this.detailObj = row
    },
    // 关闭详情框
    detailCloseClick() {
      this.detailDialog = false
    },
    // 到处反馈信息列表
    exportFeedback() {
      window.open(
        `${process.env.VUE_APP_BASE_API}/system/feedback/export?startTime=${this.queryParams.startTime}&endTime=${this.queryParams.endTime}&name=${this.queryParams.name}&deptId=${this.queryParams.deptId}`,
        '_self'
      )
    },
    // 改变反馈的状态
    changeStatus(event, row) {
      let params = {
        id: row.id,
        status: 1,
      }
      apiPost(this, 'system/feedback/comfirm', params).then((res) => {
        this.queryFeedbackList()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import './feedback.scss';
</style>