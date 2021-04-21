<template>
  <div class="appContation">
    <div class="mainWrapper" v-permission="['role/pageList']">
      <div class="mainHeader">
        <span class="title">角色查询</span>
        <el-form class="searchBar" ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-form-item label="" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入角色" />
          </el-form-item>
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="queryRoleList()">查询</el-button>
            <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="mainWrapper">
      <div class="mainHeader mainHeader1">
        <span class="title">角色列表</span>
        <div class="searchBar">
          <span class="button button2" @click="editClick('add')" v-permission="['role/add']">新建角色</span>
        </div>
      </div>
      <div class="mainContent">
        <el-table ref="roleTable" :data="roleList" border fit highlight-current-row>
          <el-table-column width="65" align="center" type="index" label="序号" />
          <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
          <el-table-column align="center" prop="createBy" label="创建人" />
          <el-table-column align="center" prop="createTime" label="创建时间" sortable />
          <el-table-column width="180" align="center" fixed="right" label="操作">
            <template slot-scope="scope">
              <span class="optionBtn optionBtn1" @click="editClick('edit',scope.row)"
                v-permission="['role/edit']">修改</span>
              <span class="optionBtn optionBtn2" @click="deleteClick(scope.row)"
                v-permission="['role/delete']">删除</span>
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
    <el-dialog :title="editRoleTitle" :visible.sync="editRoleDialog" width="30%" center :close-on-click-modal="false"
      :close-on-press-escape="false" @close="editCloseClick('addForm')">
      <el-form ref="addForm" :model="addForm" :rules="AddEditRules" label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
      <div class="treeWrap">
        <el-tree :data="roleTreeList" ref="roleTree" show-checkbox default-expand-all node-key="id"
          :check-strictly="true" :props="defaultProps" :default-checked-keys="addForm.authList"
          @check-change="handleCheckChange">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit('addForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { apiGet, apiPost, apiDeleteCustom } from '@/utils/request'
export default {
  data() {
    return {
      total: 0, // 角色表格总数
      currentPage: 1, // 角色表格当前页码
      pageSize: 10, // 角色表格整页大小
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: '',
      }, // 获取角色列表查询参数
      roleList: [], // 角色列表
      addForm: {
        // 新增编辑角色表单参数
        id: '',
        name: '',
        authList: [],
      },
      AddEditRules: {
        // 新增编辑角色表单验证
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
      editRoleTitle: '新建角色', // 角色编辑弹窗头部标题
      editRoleDialog: false, // 是否显示详情框
      roleTreeList: [], // 权限树
      defaultProps: {
        // 权限树配置选项
        children: 'children',
        label: 'label',
      },
    }
  },
  mounted() {
    this.queryRoleList()
    this.queryRoleTreeList()
  },
  methods: {
    // 获取角色列表数据
    queryRoleList() {
      apiGet('system/role/pageList', this.queryParams).then((res) => {
        const { data } = res
        this.total = data.total
        this.roleList = data.list
      })
    },
    // 重置搜索栏
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.queryRoleList()
    },
    // page变化触动函数
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.queryRoleList()
    },
    // pageSize变化触动函数
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryRoleList()
    },
    // 显示编辑框
    editClick(flag, row) {
      this.editRoleDialog = true
      if (flag === 'add') {
        this.editRoleTitle = '新建角色'
      } else {
        this.addForm.id = row.id
        this.addForm.name = row.name
        this.queryTreeChecked(row.id)
        this.editRoleTitle = '修改角色'
      }
    },
    // 关闭编辑框
    editCloseClick(formName) {
      this.editRoleDialog = false
      this.$nextTick(() => {
        this.addForm.id = ''
        this.addForm.name = ''
        this.addForm.authList = []
        this.$refs.roleTree.setCheckedKeys([])
      })
      this.$refs[formName].resetFields()
    },
    // 获取权限树
    queryRoleTreeList() {
      apiGet('system/role/authTree').then((res) => {
        const { data } = res
        this.roleTreeList = data
      })
    },
    // 获取权限树所选中id数组
    handleCheckChange(data, checked, indeterminate) {
      this.addForm.authList = this.$refs.roleTree
        .getCheckedKeys()
        .concat(this.$refs.roleTree.getHalfCheckedKeys())
    },
    // 获取所选角色的所有权限id列表
    queryTreeChecked(roleId) {
      apiGet('system/role/roleAuth', { roleId }).then((res) => {
        const { data } = res
        this.addForm.authList = data
      })
    },
    // 添加修改角色
    editSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editRoleTitle === '新建角色') {
            apiPost(this, 'system/role/add', this.addForm).then((res) => {
              this.queryRoleList()
              this.editRoleDialog = false
              this.editCloseClick(formName)
            })
          } else {
            apiPost(this, 'system/role/edit', this.addForm).then((res) => {
              this.queryRoleList()
              this.editRoleDialog = false
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
      apiGet('system/role/userCount', { roleId: row.id }).then((res) => {
        apiDeleteCustom(this, 'system/role/delete', { id: row.id },`当前已有${res.data}人分配此角色，删除后${res.data}人为无权限状态`).then((res) => {
          this.queryRoleList()
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import './roleMangement.scss';
</style>