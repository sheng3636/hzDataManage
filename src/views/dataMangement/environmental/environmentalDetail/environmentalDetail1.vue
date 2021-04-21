<template>
  <div class="appContation">
    <div class="mainWrapper">
      <div class="mainHeader">
        <span class="title">
          <el-page-header @back="jumpUrl('Environmental')" class="goBackBtn" :content="pageTitle"></el-page-header>
        </span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top" v-permission="['dataMangement/pageList']">
          <el-form-item label="" prop="cityName">
            <el-input v-model="queryParams.cityName" placeholder="请输入所属市" />
          </el-form-item><el-form-item label="" prop="districtName">
            <el-input v-model="queryParams.districtName" placeholder="请输入所属区域" />
          </el-form-item><el-form-item label="" prop="sectionName">
            <el-input v-model="queryParams.sectionName" placeholder="断面名称" />
          </el-form-item>
          <el-form-item label="" prop="year">
            <el-date-picker v-model="queryParams.year" type="year" value-format="yyyy" :clearable="false" placeholder="请选择选择结束年份">
            </el-date-picker>
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="queryIndicatorsList()">查询</el-button>
            <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="mainWrapper">
      <div class="mainHeader mainHeader1">
        <span class="title">数据表结构</span>
        <div class="searchBar">
          <span class="button button1" @click="uploadData()" v-permission="['dataMangement/pageList']">上传数据</span>
          <span class="button button2" @click="downloadTemplate()" v-permission="['dataMangement/pageList']">下载模板</span>
          <span class="button button3" @click="exportData()" v-permission="['dataMangement/pageList']">导出数据</span>
          <span class="button button4" @click="deleteAll()" v-permission="['dataMangement/deleteAll']">批量删除</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="indicatorsTable" :data="indicatorsList" border fit highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column width="65" align="center" type="index" label="序号" />
          <el-table-column width="150" align="center" prop="year" label="年份" sortable></el-table-column>
          <el-table-column width="180" align="center" prop="cityName" label="所属市"></el-table-column>
          <el-table-column width="200" align="center" prop="districtName" label="所属区域"></el-table-column>
          <el-table-column align="center" prop="sectionName" label="断面名称" sortable></el-table-column>
          <el-table-column align="center" prop="value" label="水质" sortable></el-table-column>
          <el-table-column width="200" align="center" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column width="180" align="center" fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn2" @click="deleteClick(scope.row)" v-permission="['dataMangement/pageList']">删除</span>
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
    <el-dialog title="上传文件" v-dialogDrag :visible.sync="editDialog" width="40%" center :close-on-click-modal="false"
      :close-on-press-escape="false" @close="editCloseClick()">
      <div class="uploadBody">
        <el-upload class="upload-demo" ref="upload" action="aaa" accept=".xlsx" :auto-upload="false" :limit="1"
          :on-change="handleChange" :on-exceed="handleExceed" drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
        </el-upload>
        <div class="uploadErrTxtWrap" v-if="uploadErrTxt">
          <el-input type="textarea" :rows="5" disabled v-model="uploadErrTxt">
          </el-input>
          <el-button class="copyBtn" v-clipboard:copy="uploadErrTxt" v-clipboard:success="clipboardSuccess" type="primary"
            icon="el-icon-document">
            复制
          </el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit()">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { apiGet, apiDelete } from '@/utils/request'
import clipboard from '@/directive/clipboard/index.js'
import '@/directive/moveDialog.js'
import axios from "axios"
import { getToken } from '@/utils/auth'
export default {
  directives: {
    clipboard
  },
  data() {
    return {
      pageTitle: '', // 页面标题
      templateType:'', // 指标类型
      total: 0, // 指标表格总数
      currentPage: 1, // 指标表格当前页码
      pageSize: 10, // 指标表格整页大小
      areasArr:[],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        cityName: '',
        districtName: '',
        sectionName: '',
        year: '',
      }, // 获取指标列表查询参数
      indicatorsList: [], // 指标列表数据
      editDialog: false,
      formData: '',
      uploadErrTxt: '', // 错误上传信息
      delarr: [], //存放删除的数据
      multipleSelection: [], //多选的数据
    }
  },
  mounted() {
    this.pageTitle = this.$route.query.pageTitle
    this.templateType = this.$route.query.templateType    
    this.queryParams.quatoCode = this.$route.query.quotaCode
    this.queryIndicatorsList()
  },
  methods: {
    // 获取指标列表数据
    queryIndicatorsList() {
      // this.queryParams.areas = this.areasArr[this.areasArr.length - 1]
      apiGet('system/data/sectionDataPageList',this.queryParams).then((res) => {
        const { data } = res
        this.total = data.total
        this.indicatorsList = data.list
      })
    },
    // 重置搜索栏
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.areasArr = []
      this.queryIndicatorsList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.queryIndicatorsList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryIndicatorsList()
    },
    // 删除单个指标
    deleteClick(row) {
      apiDelete(this, 'system/data/delete', { id: row.id,templateType:this.templateType }).then((res) => {
        this.queryIndicatorsList()
      })
    },
    // 操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除指标
    deleteAll() {
      const length = this.multipleSelection.length
      if (length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据',
        })
        return
      }
      this.delarr = []
      for (let i = 0; i < length; i++) {
        this.delarr.push(this.multipleSelection[i].id)
      }
      apiDelete(this, 'system/data/batchDelete', {
        ids: this.delarr,
        templateType: this.templateType,
      }).then((res) => {
        this.queryIndicatorsList()
      })
    },
    // 关闭上传框
    editCloseClick() {
      this.editDialog = false
      this.$refs.upload.clearFiles()
      this.formData = ''
    },
    // 打开上传数据弹窗
    uploadData() {
      this.editDialog = true
      this.uploadErrTxt = ''
    },
    // 上传数据
    editSubmit() {
      let formData = new FormData()
      formData.append('templateType', this.templateType)
      formData.append('quatoCode', this.$route.query.quotaCode)
      formData.append('file', this.formData)
      axios({
        url: process.env.VUE_APP_BASE_API + '/system/data/uploadData',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data;charset=utf-8',
          accessToken: getToken(),
        },
      })
        .then((res) => {
          let { data } = res
          if (data.code !== 0) {
            this.uploadErrTxt = data.data.join('\n')
          } else {
            this.$message({
              type: 'success',
              message: data.message,
            })
            this.queryIndicatorsList()
            this.editCloseClick()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      const fileName = file.name
      const pos = fileName.lastIndexOf('.')
      const lastName = fileName.substring(pos, fileName.length)
      if (lastName.toLowerCase() !== '.xlsx') {
        this.$message.error('文件必须为.xlsx类型')
        this.$refs.upload.clearFiles()
        return
      }
      this.formData = file.raw
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    // 下载模板
    downloadTemplate() {
      let title = encodeURIComponent(this.pageTitle)
      window.open(
        `${process.env.VUE_APP_BASE_API}/system/data/downloadTemplate?templateType=${this.templateType}&quatoName=${title}`,
        '_self'
      )
    },
    // 导出数据
    exportData() {
      let param = JSON.stringify(this.queryParams)
      window.open(`${process.env.VUE_APP_BASE_API}/system/data/export?param=${encodeURIComponent(param)}&templateType=${this.templateType}`,'_self')
    },
    // 跳转路由
    jumpUrl(path) {
      this.$router.push({
        name: path,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.uploadBody {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .uploadErrTxtWrap {
    margin-top: 10px;
    width: 360px;
    input {
      color: red;
    }
    .copyBtn {
      display: block;
      float: right;
      margin-top: 15px;
    }
  }
}
</style>