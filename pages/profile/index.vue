<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{profile.username}}</h4>
          <p>{{profile.bio}}</p>
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <!-- <a class="nav-link active" href="">My Articles</a> -->
              <nuxt-link class="nav-link" :class="{active: tab === 'my_article'}" :to="{
                name: 'profile',
                query: { tab: 'my_article' }
              }" exact>My Articles</nuxt-link>
            </li>
            <li class="nav-item" >
              <nuxt-link class="nav-link" :class="{active: tab === 'favorited_article'}" :to="{
                name: 'profile',
                query: { tab: 'favorited_article' }
              }" exact>Favorited Articles</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="article-preview" v-for="article in articles" :key="article.slug">
          <div class="article-meta">
            <a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
            <div class="info">
              <a href="" class="author">{{article.author.username}}</a>
              <span class="date">{{article.createdAt | formateDate }}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right"  @click="addFavoriteSlug(article)">
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
              <nuxt-link class="page-link" :to="{name: 'profile', query: {page: item, tab: tab}}">{{item}}</nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

</div>
</template>
<script>
import { getProfile } from '@/api/profile'
import { getArticle, addFavorite, cancelFavorite } from '@/api/article'

export default {
  middleware: 'authenticated',
  name: 'profilePage',
  async asyncData ({query, store}) {
    const page = Number.parseInt(query.page || 1)
    const limit = 5
    const tab = query.tab || 'my_article'
    const [ articleData, profileData ] = await Promise.all([getArticle({
    limit,
    offset: (page -1) * limit,
    tag: query.tag,
    favorited: tab === 'favorited_article' ? store.state.userInfo.username : null,
    author: tab === 'my_article' ? store.state.userInfo.username : null
  }), getProfile(store.state.userInfo.username)])
  const { articles, articlesCount } = articleData.data
  const { profile } = profileData.data
    return {
      profile,
      articles,
      articlesCount,
      tab,
      page,
      limit
    }
  },
  watchQuery:['page', 'tab'],
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
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