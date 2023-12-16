// 将components 全部注册为全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import Category from '@/components/Category/index.vue'
const allGlobalComponent = { SvgIcon, Pagination, Category }
// console.log(Object.keys(allGlobalComponent))
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
export default {
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      console.log('我是', key)
      app.component(key, allGlobalComponent[key])
    })
    // 将图标注册为全局
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
