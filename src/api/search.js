// 搜索模块
import request from '@/utils/request'

// 获取联想建议（自动补全）
export const getSearchSuggest = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果（自动补全）
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
