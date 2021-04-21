<template>
  <div class="appContation">
    <div class="mainWrapper">
      <div class="mainHeader">
        <span class="title">
          <el-page-header @back="jumpUrl('Traffic')" class="goBackBtn" :content="pageTitle"></el-page-header>
        </span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top" v-permission="['dataMangement/pageList']">
          <el-form-item label="" prop="areas">
            <el-cascader v-model="areasArr" placeholder="请选择区域" :options="areaOptions" :show-all-levels="false" collapse-tags :props="{ multiple: true, checkStrictly: true }"
              clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="" prop="startTime">
            <el-date-picker v-model="queryParams.startTime" type="year" value-format="yyyy" :clearable="false" placeholder="请选择开始年份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker v-model="queryParams.endTime" type="year" value-format="yyyy" :clearable="false" placeholder="请选择选择结束年份">
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
          <span class="button button1" @click="uploadData()" v-permission="['dataMangement/uploadData']">上传数据</span>
          <span class="button button2" @click="downloadTemplate()" v-permission="['dataMangement/downloadTemplate']">下载模板</span>
          <span class="button button3" @click="exportData()" v-permission="['dataMangement/exportData']">导出数据</span>
          <span class="button button4" @click="deleteAll()" v-permission="['dataMangement/deleteAll']">批量删除</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="indicatorsTable" :data="indicatorsList" border fit highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column width="65" align="center" type="index" label="序号" />
          <el-table-column width="150" align="center" prop="year" label="年份" sortable></el-table-column>
          <el-table-column width="180" align="center" prop="areas" label="地域" sortable></el-table-column>
          <el-table-column width="200" align="center" prop="areasCode" label="区划代码" sortable></el-table-column>
          <el-table-column align="center" prop="quatoName" show-overflow-tooltip label="指标名称" sortable></el-table-column>
          <el-table-column align="center" prop="value" label="指标值" sortable></el-table-column>
          <el-table-column width="200" align="center" prop="unit" label="单位"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop="source" label="数据来源" />
          <el-table-column width="180" align="center" fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn2" @click="deleteClick(scope.row)" v-permission="['dataMangement/delete']">删除</span>
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
      areaOptions: [
        {
          value: '浙江省',
          label: '浙江省',
        },
        {
          value: '杭州市',
          label: '杭州市',
          children: [
            {
              value: '上城区',
              label: '上城区',
            },
            {
              value: '下城区',
              label: '下城区',
            },
            {
              value: '江干区',
              label: '江干区',
            },
            {
              value: '拱墅区',
              label: '拱墅区',
            },
            {
              value: '西湖区',
              label: '西湖区',
            },
            {
              value: '滨江区',
              label: '滨江区',
            },
            {
              value: '萧山区',
              label: '萧山区',
            },
            {
              value: '余杭区',
              label: '余杭区',
            },
            {
              value: '桐庐县',
              label: '桐庐县',
            },
            {
              value: '淳安县',
              label: '淳安县',
            },
            {
              value: '建德市',
              label: '建德市',
            },
            {
              value: '富阳区',
              label: '富阳区',
            },
            {
              value: '临安区',
              label: '临安区',
            },
          ],
        },
        {
          value: '宁波市',
          label: '宁波市',
          children: [
            {
              value: '海曙区',
              label: '海曙区',
            },
            {
              value: '江北区',
              label: '江北区',
            },
            {
              value: '北仑区',
              label: '北仑区',
            },
            {
              value: '镇海区',
              label: '镇海区',
            },
            {
              value: '鄞州区',
              label: '鄞州区',
            },
            {
              value: '奉化区',
              label: '奉化区',
            },
            {
              value: '象山县',
              label: '象山县',
            },
            {
              value: '宁海县',
              label: '宁海县',
            },
            {
              value: '余姚市',
              label: '余姚市',
            },
            {
              value: '慈溪市',
              label: '慈溪市',
            },
          ],
        },
        {
          value: '温州市',
          label: '温州市',
          children: [
            {
              value: '鹿城区',
              label: '鹿城区',
            },
            {
              value: '龙湾区',
              label: '龙湾区',
            },
            {
              value: '瓯海区',
              label: '瓯海区',
            },
            {
              value: '洞头区',
              label: '洞头区',
            },
            {
              value: '永嘉县',
              label: '永嘉县',
            },
            {
              value: '平阳县',
              label: '平阳县',
            },
            {
              value: '苍南县',
              label: '苍南县',
            },
            {
              value: '文成县',
              label: '文成县',
            },
            {
              value: '泰顺县',
              label: '泰顺县',
            },
            {
              value: '瑞安市',
              label: '瑞安市',
            },
            {
              value: '乐清市',
              label: '乐清市',
            },
            {
              value: '龙港市',
              label: '龙港市',
            },
          ],
        },
        {
          value: '嘉兴市',
          label: '嘉兴市',
          children: [
            {
              value: '南湖区',
              label: '南湖区',
            },
            {
              value: '秀洲区',
              label: '秀洲区',
            },
            {
              value: '嘉善县',
              label: '嘉善县',
            },
            {
              value: '海盐县',
              label: '海盐县',
            },
            {
              value: '海宁市',
              label: '海宁市',
            },
            {
              value: '平湖市',
              label: '平湖市',
            },
            {
              value: '桐乡市',
              label: '桐乡市',
            },
          ],
        },
        {
          value: '湖州市',
          label: '湖州市',
          children: [
            {
              value: '吴兴区',
              label: '吴兴区',
            },
            {
              value: '南浔区',
              label: '南浔区',
            },
            {
              value: '德清县',
              label: '德清县',
            },
            {
              value: '长兴县',
              label: '长兴县',
            },
            {
              value: '安吉县',
              label: '安吉县',
            },
          ],
        },
        {
          value: '绍兴市',
          label: '绍兴市',
          children: [
            {
              value: '越城区',
              label: '越城区',
            },
            {
              value: '柯桥区',
              label: '柯桥区',
            },
            {
              value: '上虞区',
              label: '上虞区',
            },
            {
              value: '新昌县',
              label: '新昌县',
            },
            {
              value: '诸暨市',
              label: '诸暨市',
            },
            {
              value: '嵊州市',
              label: '嵊州市',
            },
          ],
        },
        {
          value: '金华市',
          label: '金华市',
          children: [
            {
              value: '婺城区',
              label: '婺城区',
            },
            {
              value: '金东区',
              label: '金东区',
            },
            {
              value: '武义县',
              label: '武义县',
            },
            {
              value: '浦江县',
              label: '浦江县',
            },
            {
              value: '磐安县',
              label: '磐安县',
            },
            {
              value: '兰溪市',
              label: '兰溪市',
            },
            {
              value: '义乌市',
              label: '义乌市',
            },
            {
              value: '东阳市',
              label: '东阳市',
            },
            {
              value: '永康市',
              label: '永康市',
            },
          ],
        },
        {
          value: '衢州市',
          label: '衢州市',
          children: [
            {
              value: '柯城区',
              label: '柯城区',
            },
            {
              value: '衢江区',
              label: '衢江区',
            },
            {
              value: '常山县',
              label: '常山县',
            },
            {
              value: '开化县',
              label: '开化县',
            },
            {
              value: '龙游县',
              label: '龙游县',
            },
            {
              value: '江山市',
              label: '江山市',
            },
          ],
        },
        {
          value: '舟山市',
          label: '舟山市',
          children: [
            {
              value: '定海区',
              label: '定海区',
            },
            {
              value: '普陀区',
              label: '普陀区',
            },
            {
              value: '岱山县',
              label: '岱山县',
            },
            {
              value: '嵊泗县',
              label: '嵊泗县',
            },
          ],
        },
        {
          value: '台州市',
          label: '台州市',
          children: [
            {
              value: '椒江区',
              label: '椒江区',
            },
            {
              value: '黄岩区',
              label: '黄岩区',
            },
            {
              value: '路桥区',
              label: '路桥区',
            },
            {
              value: '三门县',
              label: '三门县',
            },
            {
              value: '天台县',
              label: '天台县',
            },
            {
              value: '仙居县',
              label: '仙居县',
            },
            {
              value: '温岭市',
              label: '温岭市',
            },
            {
              value: '临海市',
              label: '临海市',
            },
            {
              value: '玉环市',
              label: '玉环市',
            },
          ],
        },
        {
          value: '丽水市',
          label: '丽水市',
          children: [
            {
              value: '莲都区',
              label: '莲都区',
            },
            {
              value: '青田县',
              label: '青田县',
            },
            {
              value: '缙云县',
              label: '缙云县',
            },
            {
              value: '遂昌县',
              label: '遂昌县',
            },
            {
              value: '松阳县',
              label: '松阳县',
            },
            {
              value: '云和县',
              label: '云和县',
            },
            {
              value: '庆元县',
              label: '庆元县',
            },
            {
              value: '景宁县',
              label: '景宁县',
            },
            {
              value: '龙泉市',
              label: '龙泉市',
            },
          ],
        },
      ], // 区域级联数据
      pageTitle: '', // 页面标题
      templateType:'', // 指标类型
      total: 0, // 指标表格总数
      currentPage: 1, // 指标表格当前页码
      pageSize: 10, // 指标表格整页大小
      areasArr:[],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        quatoCode: '',
        areaList: '',
        startTime: '',
        endTime: '',
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
      let arr = []
      for (let i = 0; i < this.areasArr.length; i++) {
        const element = this.areasArr[i];
        if (element.length === 0) {
          arr = []
        } else if (element.length === 1) {
          arr.push(element[0])
        } else {
          arr.push(element[1])
        }
      }
      this.queryParams.areaList = arr.join(',')
      apiGet('system/data/quotaDataPageList',this.queryParams).then((res) => {
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