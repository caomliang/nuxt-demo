<template>
  <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item" v-if="userInfo">
              <nuxt-link class="nav-link" :class="{active: tab === 'your_feed'}" :to="{
                name: 'home',
                query: { tab: 'your_feed' }
              }" exact>Your Feed</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" :class="{active: tab === 'global_feed'}"  :to="{
                name: 'home',
                query: { tab: 'global_feed' }
              }" exact>Global Feed</nuxt-link>
            </li>
            <li class="nav-item" v-if="tag">
              <!-- <a class="nav-link active" href="">#{{tag}}</a> -->
              <nuxt-link class="nav-link" :class="{active: tab === 'tag'}" :to="{
                name: 'home',
                query: { 
                  tab: 'tag',
                  tag: tag
                 }
              }" exact>#{{tag}}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="article-preview" v-for="article in articles" :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{name: 'profile', params: {username: article.author.username}}">
              <img :src="article.author.image" />
            </nuxt-link>
            <div class="info">
              <nuxt-link class="author" :to="{name: 'profile', params: {username: article.author.username}}">{{article.author.username}}</nuxt-link>
              <span class="date">{{article.createdAt  | formateDate}}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{active: article.favorited}" @click="addFavoriteSlug(article)">
              <i class="ion-heart"></i> {{article.favoritesCount}}
            </button>
          </div>
          <nuxt-link :to="{
            name: 'article',
            params: { slug: article.slug }
          }" class="preview-link">
            <h1>{{article.title}}</h1>
            <p>{{article.description}}</p>
            <span>Read more...</span>
          </nuxt-link>
        </div>
        <!-- 分页 -->
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{active: item===page}" v-for="item in totalPage" :key="item">
              <nuxt-link class="page-link" :to="{name: 'home', query: {page: item, tag: tag, tab: tab}}">{{item}}</nuxt-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list">
            <template v-for="item in tags">
              <nuxt-link :to="{name: 'home', query: {tag: item, tab: 'tag'}}" class="tag-pill tag-default"  :key="item" v-if="isLetter(item)">{{item}}</nuxt-link>
            </template>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>
<script>
import { getArticle, getFeedArticle, addFavorite, cancelFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: 'homePage',
  async asyncData ({ query, store }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tab = query.tab || 'global_feed'
    const loadArticle = tab === 'your_feed' ? getFeedArticle : getArticle
    const [ articleData, tagData ] = await Promise.all([loadArticle({
      limit,
      offset: (page -1) * limit,
      tag: query.tag,
      favorited: ''
    }), getTags()])
    const { articles, articlesCount } = articleData.data
    const { tags } = tagData.data
    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag: query.tag,
      tab: tab
    }
  },
  watchQuery:['page', 'tag', 'tab'],
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['userInfo'])
  },
  methods: {
    isLetter(str) {
      for (let i in str) {
          let asc = str.charCodeAt(i);
          if ((asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
              return true
          }
      }
      return false
    },
    async addFavoriteSlug (article) {
      if (article.favorited) {
        await cancelFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
    }
  }
}
</script>