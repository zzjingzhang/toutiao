<template>
  <div class="update-photo">
    <img :src="img" class="img" ref="img">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null

    }
  },
  mounted() {
    //   拿到dom 元素
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false

    })
  },
  methods: {
    onConfirm() {
      // 基于服务端的裁切使用 getData() 方法获取裁切参数
      // this.cropper.getData()
      // 纯客户端的裁切使用getCroppedCanvas() 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhotos(blob)
      })
    },
    async updateUserPhotos(blob) {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // console.log(blob)
        // 如果接口要求 Content-Type 是 application/json
        // 则传递普通 JavaScript 对象
        // updateUserPhoto({
        //     photo:blob
        // })
        // 如果接口要求 Content-Type  是 multipart/form-data
        // 则必须传递  FormData 对象
        const formData = new FormData()
        //   参数1 是 要传递的数据名 参数2 是该数据的值
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        // console.log(data)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', data.data.photo)
        // 提示更新成功
        this.$toast.success('图片更新成功')
      } catch (err) {
        this.$toast.fail('图片更新失败')
        // console.log(err)
      }
    }
  }
}
</script>



<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    max-width: 100%;
    display: block;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
