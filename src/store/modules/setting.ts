import { defineStore } from 'pinia'

const settingIsCollapse = defineStore('setting', {
  state: () => {
    return {
      isCollapse: false, //控制菜单时折叠还是展开
      // refresh
      isRefresh: false,
    }
  },
})

export default settingIsCollapse
