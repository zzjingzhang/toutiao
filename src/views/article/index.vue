<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class=" main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate|relativeTime}}</div>
          <!-- 模板中的 $event 是事件参数 -->
          <!-- 当我们传递给子组件的数据既要使用还要修改 传递:props  修改 ：自定义事件  简写方式：在组件上使用v-model -->
          <!-- 传递:props  :is-followed="article.is_followed" -->
          <!--  修改:自定义事件 @update_is_followed="article.is_followed=$event"  -->
          <!-- 覆盖需要修改 v-model 的规则名称，可以通过子组件的 model属性来配置修改 -->
          <follow-user class="follow-btn" v-model="article.is_followed" :user-id="article.aut_id" @update_is_followed="article.is_followed=$event" />
          <!-- <van-button v-if="article.is_followed" :loading="followLoading" class="follow-btn" round size="small" @click="onFollow">已关注</van-button>
          <van-button v-else class="follow-btn" :loading="followLoading" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow">关注</van-button> -->

        </van-cell>
        <!-- /用户信息 -->
        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list :source="article.art_id" :list="commentList" @onload-success="totalCommentCount = $event.total_count" @reply-click="onReplyClick" />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow=true">写评论</van-button>
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <collect-article v-model="article.is_collected" :articleId="article.art_id" />
          <like-article v-model="article.attitude" :articleId="article.art_id" />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染，只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的隐藏和显示 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height:100%">
      <comment-reply v-if="isReplyShow" :comment="currentComment" @close="isReplyShow=false" />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有的后代组件体检数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      // 文章详情
      article: {},
      //   加载中的loading状态
      loading: true,
      //   失败的状态码
      errStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      // 控制发布评论的显示状态
      isPostShow: false,
      // 评论列表
      commentList: [],
      isReplyShow: false,
      // 当前点击评论的回复项
      currentComment: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() { },
  methods: {
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)
        this.article = data.data
        // 初始化图片点击预览
        setTimeout(() => {
          //   console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      //   无论成功还是失败，都需要关闭loading
      this.loading = false
    },
    previewImage() {
      // 得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      //   console.log(imgs)
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个img注册点击事件
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            //   起始位置 从 0 开始
            startPosition: index
          })
        }
      })
      //   console.log(images)
    },
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布的内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      console.log(comment)
      this.currentComment = comment

      // 显示弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }
  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
