<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field name="mobile" v-model="user.mobile" placeholder="请输入手机号" type="number" maxlength="11" :rules="userFormRule.mobile">
        <i slot="left-icon" class="iconfont iconshouji"></i>
      </van-field>
      <van-field v-model="user.code" name="code" placeholder="请输入验证码" :rules="userFormRule.code">
        <i slot="left-icon" class="iconfont iconyanzhengma"></i>
        <template #button>
          <!-- time倒计时时间 -->
          <van-count-down v-if="isCountDownShow" :time="1000*60" format="ss s" @finish="isCountDownShow=false" />
          <van-button v-else native-type="button" class="send-sms-btn" round size="small" type="default" @click="onSendSms">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        // 手机号
        mobile: '',
        // 验证码
        code: ''
      },
      //   验证规则
      userFormRule: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { // 校验手机号的正则表达式
            pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误'
          }],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    async onSubmit() {
      // 获取表单数据
      //   const user = this.user
      // 表单验证
      //   在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        // 禁用背景点击
        forbidClick: true,
        // 默认事件是2000毫秒，如果为0 则 持续展示
        duration: 0
      })
      // 提交表单请求登录
      try {
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 登录成功跳转回原来的页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          //   console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.success('登录失败，请稍后重试')
        }
      }
    },
    async onSendSms() {
      //   校验手机号码
      try {
        await this.$refs.loginForm.validate('mobile')
        // console.log('验证通过')
      } catch (err) {
        return this.$toast(err)
      }
      // 验证通过显示倒计时
      this.isCountDownShow = true
      // 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          console.log('发送失败')
        }
      }
    }
  }


}
</script>

<style lang="less" scoped>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    width: 160px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 30px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>>

