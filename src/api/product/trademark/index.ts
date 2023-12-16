import request from '@/utils/request'
// 获取品牌列表
export const reqTradeMarkList = (page, limit) => {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get',
  })
}
// 修改 或添加品牌

export const reqAddOrUpdateTradeMark = (tradeMark: any) => {
  if (tradeMark.id) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: 'put',
      data: {
        ...tradeMark,
      },
    })
  } else {
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: 'post',
      data: {
        ...tradeMark,
      },
    })
  }
}
//

export const reqDeleteTradeMark = (id: any) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete',
  })
}
