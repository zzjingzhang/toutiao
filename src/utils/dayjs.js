import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用相对时间 relativeTime的插件
dayjs.extend(relativeTime)

// 全局使用中文
dayjs.locale('zh-cn')

// 定义一个全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
// dayjs()获取当前最新时间
// dayjs().format('YYYY-MM-DD')
