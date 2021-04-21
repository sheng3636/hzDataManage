<template>
  <div class="appContation">
    <div class="mainWrapper" v-permission="['dept/pageList']">
      <div class="mainHeader">
        <span class="title">部门查询</span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-form-item label="" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入部门" />
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="queryBranchList()">查询</el-button>
            <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="mainWrapper">
      <div class="mainHeader mainHeader1">
        <span class="title">部门列表</span>
        <div class="searchBar">
          <span class="button button2" @click="editClick('add')" v-permission="['dept/add']">新建部门</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="branchTable" :data="branchList" border fit highlight-current-row>
          <el-table-column width="65" align="center" type="index" label="序号" />
          <el-table-column align="center" prop="title" label="部门名称"></el-table-column>
          <el-table-column align="center" prop="createBy" label="创建人" />
          <el-table-column align="center" prop="createTime" label="创建时间" sortable />
          <el-table-column width="180" align="center" fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn1" @click="editClick('edit',scope.row)" v-permission="['dept/edit']">修改</span>
              <span class="optionBtn optionBtn2" @click="deleteClick(scope.row)" v-permission="['dept/delete']">删除</span>
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
    <el-dialog :title="editBranchTitle" :visible.sync="editBranchDialog" width="30%" center
      :close-on-click-modal="false" :close-on-press-escape="false" @close="editCloseClick('addForm')">
      <el-form ref="addForm" :model="addForm" :rules="AddEditRules" label-width="80px" label-position="left">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入部门名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit('addForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { apiGet, apiPost, apiDeleteCustom } from '@/utils/request'
export default {
  name:'branchMangement',
  data() {
    return {
      total: 0, // 部门表格总数
      currentPage: 1, // 部门表格当前页码
      pageSize: 10, // 部门表格整页大小
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: '',
      },// 获取部门列表查询参数
      branchList: [], // 部门列表
      addForm: {
        // 新增编辑部门表单参数
        id: '',
        name: '',
      },
      AddEditRules: {
        // 新增编辑部门表单验证
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      },
      editBranchTitle: '新建部门', // 部门编辑弹窗头部标题
      editBranchDialog: false // 是否显示详情框
    }
  },
  mounted() {
    this.queryBranchList()
  },
  methods: {
    // 获取部门列表数据
    queryBranchList() {
      apiGet('system/dept/pageList', this.queryParams).then((res) => {
        const { data } = res
        this.total = data.total
        this.branchList = data.list
      })
    },
    // 重置搜索栏
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.queryBranchList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.queryBranchList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryBranchList()
    },
    // 显示编辑框
    editClick(flag, row) {
      this.editBranchDialog = true
      if (flag === 'add') {
        this.editBranchTitle = '新建部门'
      } else {
        this.addForm.id = row.id
        this.addForm.name = row.title
        this.editBranchTitle = '修改部门'
      }
    },
    // 关闭编辑框
    editCloseClick(formName) {
      this.editBranchDialog = false
      this.$nextTick(() => {
        this.addForm.id = ''
        this.addForm.name = ''
      })
      this.$refs[formName].resetFields()
    },
    // 添加修改部门
    editSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editBranchTitle === '新建部门') {
            apiPost(this, 'system/dept/add', this.addForm).then((res) => {
              this.queryBranchList()
              this.editBranchDialog = false
              this.editCloseClick(formName)
            })
          } else {
            apiPost(this, 'system/dept/edit', this.addForm).then((res) => {
              this.queryBranchList()
              this.editBranchDialog = false
              this.editCloseClick(formName)
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除角色
    deleteClick(row) {
      apiGet('system/dept/userCount', { deptId: row.id }).then((res) => {
        apiDeleteCustom(this, 'system/dept/delete', { id: row.id },`当前已有${res.data}人分配此部门，删除后${res.data}人为无部门状态`).then((res) => {
          this.queryBranchList()
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import './branchMangement.scss';
</style>