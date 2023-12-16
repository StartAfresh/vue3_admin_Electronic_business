import request from '@/utils/request'
enum API {
  //删除某一个已有的属性
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

export const reqCategoryC1 = () => {
  return request({
    url: `/admin/product/getCategory1`,
    method: 'get',
  })
}

export const reqCategoryC2 = (category1Id) => {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get',
  })
}

export const reqCategoryC3 = (category2Id) => {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get',
  })
}
export const reqCategoryAttr = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get',
  })
}
export const reqCategoryAttrAddOrUpdate = (data: any) => {
  return request({
    url: `/admin/product/saveAttrInfo`,
    method: 'post',
    data,
  })
}
//删除某一个已有的属性业务
export const reqRemoveAttr = (attrId: number) =>
  request.delete(API.DELETEATTR_URL + attrId)
