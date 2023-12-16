import request from '@/utils/request'
// 获取spu列表数据的接口

enum API {
  //获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}

export const reqSpuList = (page, limit, category3Id) => {
  return request({
    url: `/admin/product/${page}/${limit}?category3Id=${category3Id}`,
    method: 'get',
  })
}
//获取全部的SPU的品牌的数据
export const reqAllTradeMark = () => request.get(API.ALLTRADEMARK_URL)
//获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spuId) => request.get(API.IMAGE_URL + spuId)
//获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId) =>
  request.get(API.SPUHASSALEATTR_URL + spuId)
//获取全部的销售属性
export const reqAllSaleAttr = () => request.get(API.ALLSALEATTR_URL)
//添加一个新的SPU的
//更新已有的SPU接口
//data:即为新增的SPU|或者已有的SPU对象
export const reqAddOrUpdateSpu = (data) => {
  //如果SPU对象拥有ID,更新已有的SPU
  console.log('我是data.id', data.id)
  if (data.id) {
    return request.post(API.UPDATESPU_URL, data)
  } else {
    return request.post(API.ADDSPU_URL, data)
  }
}
//添加SKU的请求方法
export const reqAddSku = (data) => request.post(API.ADDSKU_URL, data)

//获取SKU数据
export const reqSkuList = (spuId) => request.get(API.SKUINFO_URL + spuId)

//删除已有的SPU
export const reqRemoveSpu = (spuId) => request.delete(API.REMOVESPU_URL + spuId)
