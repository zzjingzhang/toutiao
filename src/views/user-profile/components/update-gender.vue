<template>
  <van-picker title="性别" show-toolbar :columns="columns" :default-index="gender" @confirm="onConfirm" @cancel="$emit('close')" @change="onPickerChange" />
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  model: {
    prop: 'gender'
  },
  props: {
    gender: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.gender
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
        const localGender = this.localGender
        await updateUserProfile(
          {
            gender: localGender
          }
        )
        // 更新视图
        this.$emit('input', localGender)
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
      this.localGender = index
    }
  }
}
</script>



<style lang="less" scoped>
</style>
