<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <el-form :inline="true" class="from">
        <el-form-item label="用户名:">
          <el-input v-model="keyWord" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :disabled="!keyWord">
            搜索
          </el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button @click="addUser" style="margin-bottom: 20px" type="primary">
        添加
      </el-button>
      <el-button
        style="margin-bottom: 20px"
        type="danger"
        :disabled="delIdList.length == 0"
        @click="batchDeletion"
      >
        批量删除
      </el-button>
      <el-table
        @selection-change="handleSelectionChange"
        :data="useRecord"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="#" width="120"></el-table-column>
        <el-table-column prop="id" property="name" label="id" width="120" />
        <el-table-column
          property="address"
          label="用户名字"
          prop="username"
          show-overflow-tooltip
        />
        <el-table-column
          property="address"
          label="用户名称"
          prop="name"
          show-overflow-tooltip
        />
        <el-table-column
          property="address"
          label="用户角色"
          show-overflow-tooltip
          prop="roleName"
        />
        <el-table-column
          property="address"
          label="创建时间"
          show-overflow-tooltip
          prop="createTime"
        />
        <el-table-column
          property="address"
          label="更新时间"
          show-overflow-tooltip
          prop="updateTime"
        />
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.username}?`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        :small="true"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        layout=" prev, pager, next, jumper,->,total, sizes,"
        :total="total"
        @current-change="getSpuDate"
        @size-change="changeSize"
      />
    </el-card>

    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :rules="rules" ref="formRef" :model="userParams">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请您输入用户姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请您输入用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请您输入用户密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色(职位)</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              @change="handleCheckAllChange"
              v-model="checkAll"
              :indeterminate="isIndeterminate"
            >
              全选
            </el-checkbox>
            <!-- 显示职位的的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :label="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import { ref, onMounted, reactive, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
// 搜索关键字
let keyWord = ref('')
// 当前页
let currentPage = ref(1)
// 每页条数
let pageSize = ref(5)
// 当前页发生改变时触发
let total = ref(0)
let useRecord = ref([])
// 抽屉是否展示
let drawer = ref(false)
// 收集用户信息
let userParams = reactive({
  name: '',
  username: '',
  password: '',
})
// 收集表单数据
let formRef = ref()
let getSpuDate = () => {
  getHasUser(currentPage.value)
}
// 每页条数发生改变时触发
let changeSize = () => {
  getHasUser(currentPage.value)
}

// 获取所有用户信息
let getHasUser = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqUserInfo(
    currentPage.value,
    pageSize.value,
    keyWord.value,
  )
  if (result.code == 200) {
    useRecord.value = result.data.records
    total.value = result.data.total
  }
}

// 添加用户
//添加用户按钮的回调
const addUser = () => {
  //抽屉显示出来
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
let save = async () => {
  let result: any = await reqAddOrUpdateUser(userParams)
  //添加或者更新成功
  if (result.code == 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    //获取最新的全部账号的信息
    // getHasUser(userParams.id ? pageNo.value : 1);
    //浏览器自动刷新一次
    window.location.reload()
  } else {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
  getHasUser()
}
//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//校验用户名字回调函数
const validatorname = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
// 抽屉正则
let rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
// 编辑用户
let updateUser = (row) => {
  drawer.value = true
  Object.assign(userParams, row)
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
let cancel = () => {
  drawer.value = false
  formRef.value.resetFields()
}

// 分配角色
let drawer1 = ref(false)
// 当前用户已有的职位
let userRole = ref([])
// 获取所有职位
let allRole = ref([])
let setRole = async (row) => {
  drawer1.value = true
  let result = await reqAllRole(row.id)
  if (result.code == 200) {
    userRole.value = result.data.assignRoles
    allRole.value = result.data.allRolesList
    Object.assign(userParams, row)
  }
}
let checkAll = ref(false)
let handleCheckAllChange = (val) => {
  // isIndeterminate.value = false
  // 当全选选中的时候，根据val值来判断选中的角色，三元表达式比赋值运算符优先级高
  userRole.value = val ? allRole.value : []
}

// 职位的复选框
let handleCheckedCitiesChange = (value) => {
  //顶部复选框的勾选
  //不确定的样式数据
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  isIndeterminate.value = value.length !== allRole.value.length
}
let isIndeterminate = ref(true)

let confirmClick = async () => {
  //收集参数
  let data = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  console.log('我是data', data)
  let result = await reqSetUserRole(data)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(currentPage.value)
  }
}

let deleteUser = async (id) => {
  let result = await reqRemoveUser(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser()
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
// 批量删除
let batchDeletion = async () => {
  let result = await reqSelectUser(delIdList.value)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser()
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
let delIdList = ref([])
let handleSelectionChange = (val) => {
  delIdList.value = val.map((item) => {
    return item.id
  })
}

let search = () => {
  getHasUser()
  keyWord.value = ''
}
let reset = () => {
  keyWord.value = ''
  getHasUser()
}
onMounted(() => {
  getHasUser()
})
</script>

<style scoped>
.from {
  display: flex;
  justify-content: space-between;
}
</style>
