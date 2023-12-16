<template>
  <el-card class="box-card" style="margin: 0 30px; margin-top: 20px">
    <el-button
      @click="addTrademark()"
      style="margin-bottom: 20px"
      type="primary"
      icon="Plus"
    >
      添加
    </el-button>
    <el-table border style="width: 100%" :data="trademarkList">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        align="center"
        label="品牌名称"
        width="180"
        prop="tmName"
      >
        <template #default="{ row }">
          <pre>{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品牌LOGO">
        <template #default="{ row }">
          <img style="width: 50px; height: 50px" :src="row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #="{ row, $index }">
          <el-button type="primary" @click="editTrademark(row)" icon="Edit">
            修改
          </el-button>

          <el-popconfirm
            title="Are you sure to delete this?"
            @confirm="delTrademark(row)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px"
      :small="true"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      layout=" prev, pager, next, jumper,->,total, sizes,"
      :total="total"
    />
  </el-card>
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" prop="tmName">
        <el-input
          placeholder="请您输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <!-- 
        :show-file-list="false" : 是否展示上传的进度
        action ： 将图片上传到服务器
        :on-success="handleAvatarSuccess": 上传成功后的钩子函数
        :before-upload="beforeAvatarUpload" : 上传前的钩子函数

       -->
        <el-upload
          class="avatar-uploader"
          action="api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqTradeMarkList,
  reqAddOrUpdateTradeMark,
  reqDeleteTradeMark,
} from '@/api/product/trademark'
// 类型约束
import type { UploadProps } from 'element-plus'
// 当前页
let currentPage = ref(1)
// 	每页显示个数选择器的选项设置
let pageSize = ref(6)
// 数据的条数
let total = ref(0)
// 品牌数据
let trademarkList = ref([])
let trademarkParams = reactive({
  tmName: '',
  logoUrl: '',
})

let getTrademarkDate = async () => {
  let result: any = await reqTradeMarkList(currentPage.value, pageSize.value)
  if (result.code == 200) {
    console.log(result)
    total.value = result.data.total
    // 将品牌数据赋值
    trademarkList.value = result.data.records
  }
}
let editTrademark = async (row: any) => {
  dialogFormVisible.value = true
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = row.logoUrl
  ;(trademarkParams as any).id = row.id

  // 当点击添加的时候，要将上一次残留的规则清除
  // formRef.value?.resetFields()
  // 或者这样
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
    console.log('我是formRef', formRef)
  })
}
let delTrademark = async (row: any) => {
  console.log('我执行了')
  let result: any = await reqDeleteTradeMark(row.id)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: result.message,
    })
    getTrademarkDate()
  } else {
    ElMessage({
      type: 'error',
      message: result.message,
    })
  }
}
onMounted(() => {
  getTrademarkDate()
})
watch([currentPage, pageSize], () => {
  getTrademarkDate()
})

// 对话框显示与隐藏
let dialogFormVisible = ref(false)
let addTrademark = () => {
  // 当点击添加时要删除输入框里面数据，以及图片，清除id
  dialogFormVisible.value = true
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  delete (trademarkParams as any).id

  // 当点击添加的时候，要将上一次残留的规则清除
  // formRef.value?.resetFields()
  // 或者这样
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
    console.log('我是formRef', formRef)
  })
}
// 取消对话框
let cancel = () => {
  dialogFormVisible.value = false
}
// 确认对话框
let confirm = async () => {
  //在你发请求之前,要对于整个表单进行校验
  //调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
  await formRef.value.validate()
  dialogFormVisible.value = false

  let result: any = await reqAddOrUpdateTradeMark(trademarkParams)

  if (result.code == 200) {
    // 重新请求数据
    getTrademarkDate()
    ElMessage({
      type: 'success',
      message: result.message,
    })
    getTrademarkDate()
  } else {
    ElMessage({
      type: 'error',
      message: result.message,
    })
  }
}
// 图片上传前的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
  // rawFile 是上传的文件对象
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // 将图片网址赋值给logoUrl，显示图片
  trademarkParams.logoUrl = response.data
}
// 获取form表单组件
let formRef = ref(null)

// 校验表单规则
const validatorTmName = (rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候,会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  console.log(value)
  //如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}
// 规则校验对象
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
