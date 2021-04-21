<template>
  <div class="appContation">
    <div class="mainWrapper">
      <div class="mainHeader">
        <span class="title">
          <el-page-header @back="jumpUrl('IndustrialDev')" class="goBackBtn" :content="pageTitle"></el-page-header>
        </span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top"
          v-permission="['dataMangement/pageList']">
          <el-form-item label="" prop="companyName">
            <el-input v-model="queryParams.companyName" placeholder="请输入公司中文名称" />
          </el-form-item>
          <el-form-item label="" prop="tradeName">
            <el-input v-model="queryParams.tradeName" placeholder="请输入所属行业" />
          </el-form-item>
          <el-form-item label="" prop="productType">
            <el-input v-model="queryParams.productType" placeholder="请输入主营产品类型" />
          </el-form-item>
          <el-form-item label="" prop="shangshiBoard">
            <el-input v-model="queryParams.shangshiBoard" placeholder="请输入上市板" />
          </el-form-item>
          <el-form-item label="" prop="country">
            <el-input v-model="queryParams.country" placeholder="请输入企业所在县" />
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
          <span class="button button1" @click="uploadData()" v-permission="['dataMangement/uploadData']">上传数据</span>
          <span class="button button2" @click="downloadTemplate()"
            v-permission="['dataMangement/downloadTemplate']">下载模板</span>
          <span class="button button3" @click="exportData()" v-permission="['dataMangement/exportData']">导出数据</span>
          <span class="button button4" @click="deleteAll()" v-permission="['dataMangement/deleteAll']">批量删除</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="indicatorsTable" :data="indicatorsList" border fit highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column width="65" align="center" type="index" label="序号" />
          <el-table-column width="140" align="center" show-overflow-tooltip prop="securitiesCode" label="证券代码" sortable>
          </el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="securitiesName" label="证券简称">
          </el-table-column>
          <el-table-column width="230" align="center" show-overflow-tooltip prop="stockName" label="股票简称">
          </el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="shangshiArea" label="上市地点">
          </el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="shangshiBoard" label="上市板">
          </el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="shangshiTime" label="上市日期" sortable>
          </el-table-column>
          <el-table-column width="220" align="center" show-overflow-tooltip prop="companyName" label="公司中文名称">
          </el-table-column>
          <el-table-column width="220" align="center" show-overflow-tooltip prop="productName" label="主营产品名称">
          </el-table-column>
          <el-table-column width="320" align="center" show-overflow-tooltip prop="productType" label="主营产品类型">
          </el-table-column>
          <el-table-column width="240" align="center" show-overflow-tooltip prop="xingzheng" label="所属行政区划">
          </el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="province" label="省份">
          </el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="city" label="城市"></el-table-column>
          <el-table-column width="270" align="center" show-overflow-tooltip prop="zhengTradeName" label="所属证监会行业名称">
          </el-table-column>
          <el-table-column width="220" align="center" show-overflow-tooltip prop="windTradeFirst"
            label="所属Wind行业名称(一级行业)"></el-table-column>
          <el-table-column width="220" align="center" show-overflow-tooltip prop="windTradeSecond"
            label="所属Wind行业名称(二级行业)"></el-table-column>
          <el-table-column width="220" align="center" show-overflow-tooltip prop="windTradeThird"
            label="所属Wind行业名称(三级行业)"></el-table-column>
          <el-table-column width="220" align="center" show-overflow-tooltip prop="windTradeForth"
            label="所属Wind行业名称(四级行业)"></el-table-column>
          <el-table-column width="260" align="center" show-overflow-tooltip prop="registArea" label="注册地址">
          </el-table-column>
          <el-table-column width="260" align="center" show-overflow-tooltip prop="officeArea" label="办公地址">
          </el-table-column>
          <el-table-column width="200" align="center" show-overflow-tooltip prop="total" label="总市值" sortable></el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="latitude" label="维度">
          </el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="longitude" label="经度">
          </el-table-column>
          <el-table-column width="200" align="center" show-overflow-tooltip prop="creditCode" label="统一社会信用代码">
          </el-table-column>
          <el-table-column width="200" align="center" show-overflow-tooltip prop="registeredCapital" label="注册资本" sortable>
          </el-table-column>
          <el-table-column width="200" align="center" show-overflow-tooltip prop="tradeName" label="所属行业">
          </el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="tradeCode" label="行业代码">
          </el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="range" label="经营范围"></el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="patentApplyNum" label="专利申请数" sortable>
          </el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="patentAuthorizeNum" label="专利授权数" sortable>
          </el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="softNum" label="软著数" sortable>
          </el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="isHighTechEnterp" label="是否高新技术企业">
          </el-table-column>
          <el-table-column width="150" align="center" show-overflow-tooltip prop="isTechnologicalSmes"
            label="是否科技型中小企业"></el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="isStateEnterpTechCenter"
            label="是否国家企业技术中心"></el-table-column>
          <el-table-column width="200" align="center" show-overflow-tooltip prop="isHighTechEnterpCenter"
            label="是否高新技术企业研发中心"></el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip prop="country" label="企业所在县">
          </el-table-column>
          <el-table-column width="180" align="center" show-overflow-tooltip fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn2" @click="deleteClick(scope.row)"
                v-permission="['dataMangement/delete']">删除</span>
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
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  directives: {
    clipboard
  },
  data() {
    return {
      pageTitle: '', // 页面标题
      templateType: '', // 指标类型
      total: 0, // 指标表格总数
      currentPage: 1, // 指标表格当前页码
      pageSize: 10, // 指标表格整页大小
      areasArr: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        shangshiBoard: '',
        companyName: '',
        productType: '',
        country: '',
        tradeName: '',
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
      apiGet('system/data/listedDataPageList', this.queryParams).then((res) => {
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
    // 删除指标
    deleteClick(row) {
      apiDelete(this, 'system/data/delete', {
        id: row.id,
        templateType: this.templateType,
      }).then((res) => {
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
      // 限制上传文件的大小
      // const isLt = file.size / 1024 / 1024 / 100 <= 5
      // if (!isLt) {
      //   this.$message.error('上传文件不得大于500MB!')
      //   this.$refs.upload.clearFiles()
      // }
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
      window.open(
        `${
          process.env.VUE_APP_BASE_API
        }/system/data/export?param=${encodeURIComponent(param)}&templateType=${
          this.templateType
        }`,
        '_self'
      )
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