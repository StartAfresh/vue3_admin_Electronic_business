import { reqCategoryC1, reqCategoryC2, reqCategoryC3 } from '@/api/product/attr'
import { defineStore } from 'pinia'

const useCategoryStore = defineStore('Category', {
  state: () => {
    return {
      C1Arr: [],
      c1Id: '',
      C2Arr: [],
      c2Id: '',
      C3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    async getCategoryC1() {
      const result = await reqCategoryC1()
      if (result.code == 200) {
        this.C1Arr = result.data
      }
    },
    async getCategoryC2() {
      const result = await reqCategoryC2(this.c1Id)
      if (result.code == 200) {
        this.C2Arr = result.data
      }
    },
    async getCategoryC3() {
      const result = await reqCategoryC3(this.c2Id)
      if (result.code == 200) {
        this.C3Arr = result.data
      }
    },
  },
})

export default useCategoryStore
