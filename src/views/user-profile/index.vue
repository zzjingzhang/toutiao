<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="个人信息" @click-left="$router.back()" />
    <input type="file" hidden ref="file" @change="onFileChange">
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image round class="avatar" width="30px" height="30px" fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow=true" />
    <van-cell title="性别" :value="user.gender?'女':'男'" is-link @click="isUpdateGenderShow=true" />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow=true" />

    <!-- 编辑昵称弹层 -->
    <van-popup v-model="isUpdateNameShow" position="bottom" style="height:100%">
      <update-name v-if="isUpdateNameShow" v-model="user.name" @close="isUpdateNameShow=false" />
    </van-popup>
    <!-- 编辑性别弹层 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow=false" />
    </van-popup>
    <!-- 修改出生日期弹层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday v-if="isUpdateBirthdayShow" v-model="user.birthday" @close="isUpdateBirthdayShow=false" />
    </van-popup>
    <!-- 编辑头像弹层 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height:100%">
      <update-photo v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow=false" @update-photo="user.photo=$event" />
    </van-popup>
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('获取数据失败')
        // console.log(err)
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      //   console.log(file)
      // 基于文件对象获取blob数据
      const data = window.URL.createObjectURL(file)
      //   console.log(data)
      this.img = data
      //   展示预览图片弹出层
      this.isUpdatePhotoShow = true
      //   file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法是每次使用完毕，清空 value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 6px;
  }
  .van-popup {
    background-color: #f6f7fa;
  }
}
</style>
