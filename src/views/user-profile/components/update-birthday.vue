<template>
  <van-datetime-picker v-model="localBirthday" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel="$emit('close')" @confirm="onConfirm" />
</template>
<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateGender',
  model: {
    prop: 'birthday'
  },
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      localBirthday: new Date(this.birthday)
    }
  },
  methods: {
    async onConfirm(value, index) {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const localBirthday = dayjs(this.localBirthday).format('YYYY-MM-DD')
        await updateUserProfile(
          {
            birthday: localBirthday
          }
        )
        // 更新视图
        this.$emit('input', localBirthday)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast('更新失败')
        // console.log(err)
      }
    },
    onPickerChange(picker, value, index) {
      //   this.localGender = index
    }
  }
}
</script>



<style lang="less" scoped>
</style>
