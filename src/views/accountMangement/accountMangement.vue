<template>
  <div class="appContation">
    <div class="mainWrapper" v-permission="['user/pageList']">
      <div class="mainHeader">
        <span class="title">账号查询</span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-form-item label="" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="" prop="username">
            <el-input v-model="queryParams.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="" prop="deptId">
            <el-select v-model="queryParams.deptId" placeholder="请选择部门" style="width:100%">
              <el-option v-for="item in branchList" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="queryAccountList('queryParams')">查询</el-button>
            <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="mainWrapper">
      <div class="mainHeader mainHeader1">
        <span class="title">账号列表</span>
        <div class="searchBar">
          <span class="button button2" @click="editClick('add')" v-permission="['user/add']">新建账号</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="accountTable" :data="accountList" border fit highlight-current-row>
          <el-table-column width="65" align="center" type="index" label="序号" />
          <el-table-column align="center" prop="username" label="账号"  sortable/>
          <el-table-column align="center" prop="name" label="姓名"  sortable/>
          <el-table-column align="center" prop="roleName" label="角色" />
          <el-table-column align="center" prop="deptName" label="部门" />
          <el-table-column align="center" prop="createTime" label="创建时间"  sortable/>
          <el-table-column width="180" align="center" fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn1" @click="editClick('edit',scope.row)" v-permission="['user/edit']">修改</span>
              <span class="optionBtn optionBtn2" @click="deleteClick(scope.row)" v-permission="['user/delete']">删除</span>
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
    <el-dialog :title="editAccountTitle" :visible.sync="editAccountDialog" width="30%" center
      :close-on-click-modal="false" :close-on-press-escape="false" @close="editCloseClick('addForm')">
      <el-form class="addForm" ref="addForm" :model="addForm" :rules="AddEditRules" label-width="80px"
        label-position="right">
        <el-form-item label="账号" prop="username">
          <el-input v-model="addForm.username" :disabled="editAccountTitle === '修改账号'" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" :disabled="editAccountTitle === '修改账号'" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="editAccountTitle === '新建账号'">
          <el-input disabled v-model="addForm.password" placeholder="请输入密码" />
        </el-form-item>
        <p class="restPassword" v-if="editAccountTitle === '修改账号'">
          <span>密码</span>
          <span>******</span>
          <span @click="restPassword">重置密码</span>
        </p>
        <el-form-item label="部门" prop="deptId">
          <el-select v-model="addForm.deptId" placeholder="请选择部门" style="width:100%">
            <el-option v-for="item in branchList" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="addForm.roleId" placeholder="请选择角色" style="width:100%">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit('addForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { apiGet, apiPost, apiDelete } from '@/utils/request'
export default {
  data() {
    return {
      total: 0, // 账号表格总数
      currentPage: 1, // 账号表格当前页码
      pageSize: 10, // 账号表格整页大小
      branchList: [], // 部门列表
      roleList: [], // 角色列表
      queryParams: {
        page: 1,
        pageSize: 10,
        name: '',
        username: '',
        deptId: '',
      }, // 获取账号列表查询参数
      accountList: [],
      addForm: {
        username: '',
        name: '',
        deptId: '',
        roleId: '',
        password: '123456',
        id: '',
      }, // 新增编辑部门表单参数
      AddEditRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        deptId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'blur',
          },
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur',
          },
        ],
      }, // 新增编辑角色表单验证
      editAccountTitle: '新建账号', // 账号编辑弹窗头部标题
      editAccountDialog: false, // 是否显示详情框
      detailObj: {}, // 详情信息
    }
  },
  mounted() {
    this.queryBranchList()
    this.queryAccountList()
  },
  methods: {
    // 获取部门、角色列表数据
    queryBranchList() {
      apiGet('system/dept/list').then((res) => {
        this.branchList = res.data
      })
      apiGet('system/role/list').then((res) => {
        this.roleList = res.data
      })
    },
    // 获取反馈信息列表数据
    queryAccountList() {
      apiGet('/system/user/pageList', this.queryParams).then((res) => {
        const { data } = res
        this.total = data.total
        this.accountList = data.list
      })
    },
    // 重置搜索栏
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.queryAccountList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.queryAccountList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryAccountList()
    },
    // 显示编辑框
    editClick(flag, row) {
      this.editAccountDialog = true
      if (flag === 'add') {
        this.editAccountTitle = '新建账号'
      } else {
        this.addForm.username = row.username
        this.addForm.name = row.name
        this.addForm.deptId = row.deptId
        this.addForm.roleId = row.roleId
        this.addForm.id = row.id
        this.editAccountTitle = '修改账号'
      }
    },
    // 关闭编辑框
    editCloseClick(formName) {
      this.editAccountDialog = false
      this.$nextTick(() => {
        this.addForm.username = ''
        this.addForm.name = ''
        this.addForm.deptId = ''
        this.addForm.roleId = ''
        this.addForm.id = ''
      })
      this.$refs[formName].resetFields()
    },
    // 添加修改账号
    editSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editAccountTitle === '新建账号') {
            apiPost(this, 'system/user/add', this.addForm).then((res) => {
              this.queryAccountList()
              this.editAccountDialog = false
              this.editCloseClick(formName)
            })
          } else {
            apiPost(this, 'system/user/edit', this.addForm).then((res) => {
              this.queryAccountList()
              this.editAccountDialog = false
              this.editCloseClick(formName)
            })
          }
        } else {
          return false
        }
      })
    },
    // 重置密码
    restPassword() {
      this.$confirm('确认重置吗？', '提示').then(() => {
        apiGet('system/user/resetPass', { id: this.addForm.id }).then((res) => {
          let type = res.code === 0 ? 'success' : 'warning'
          this.$message({
            type: type,
            message: res.message,
          })
        })
      })
    },
    // 删除账号
    deleteClick(row) {
      apiDelete(this, 'system/user/delete', { id: row.id }).then((res) => {
        this.queryAccountList()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import './accountMangement.scss';
</style>