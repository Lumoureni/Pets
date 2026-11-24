const POST_KEY = 'pet_community_posts_v1'

const DEMO_POSTS = [
  {
    id: 'p1',
    user: '铲屎官小A',
    avatar: '/assets/post-avatar-1.png',
    content: '我家基基学会握手啦😀',
    likes: 12,
    comments: 3,
    commentList: [],
    favorite: false,
    favorites: 5,
    liked: false,
    isMine: false
  },
  {
    id: 'p2',
    user: '猫主子酱',
    avatar: '/assets/post-avatar-2.png',
    content: '今天罐罐超好吃😊',
    likes: 24,
    comments: 6,
    commentList: [],
    favorite: false,
    favorites: 8,
    liked: false,
    isMine: false
  },
  {
    id: 'p3',
    user: '小铲屎官',
    avatar: '/assets/profile-avatar.png',
    content: '带煤球去公园晒太阳，灰猫也太上镜了吧📸',
    likes: 18,
    comments: 4,
    commentList: [],
    favorite: false,
    favorites: 3,
    liked: false,
    isMine: true
  }
]

const FILTERS = [
  { key: 'all', name: '全部' },
  { key: 'mine', name: '我的' },
  { key: 'fav', name: '收藏' }
]

function normalize(post) {
  const list = Array.isArray(post.commentList) ? post.commentList : []
  return Object.assign({}, post, {
    commentList: list,
    comments: list.length || post.comments || 0,
    favorite: !!post.favorite,
    favorites: post.favorites || 0,
    liked: !!post.liked,
    isMine: post.isMine || post.user === '小铲屎官'
  })
}

function loadPosts() {
  try {
    const saved = wx.getStorageSync(POST_KEY)
    if (Array.isArray(saved) && saved.length) return saved.map(normalize)
  } catch (e) {}
  return DEMO_POSTS.map(normalize)
}

function savePosts(posts) {
  try {
    wx.setStorageSync(POST_KEY, posts)
  } catch (e) {}
}

function filterPosts(posts, key) {
  if (key === 'mine') return posts.filter(post => post.isMine)
  if (key === 'fav') return posts.filter(post => post.favorite)
  return posts
}

Page({
  data: {
    posts: [],
    displayed: [],
    draft: '',
    filters: FILTERS,
    activeFilter: 'all'
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const posts = loadPosts()
    this.setData({
      posts,
      displayed: filterPosts(posts, this.data.activeFilter)
    })
  },

  onDraftInput(e) {
    this.setData({ draft: e.detail.value })
  },

  onSwitchFilter(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      activeFilter: key,
      displayed: filterPosts(loadPosts(), key)
    })
  },

  onPublish() {
    const content = (this.data.draft || '').trim()
    if (!content) {
      wx.showToast({ title: '写点什么再发吧', icon: 'none' })
      return
    }
    const posts = loadPosts()
    posts.unshift({
      id: `p-${Date.now()}`,
      user: '小铲屎官',
      avatar: '/assets/profile-avatar.png',
      content,
      likes: 0,
      comments: 0,
      commentList: [],
      liked: false,
      favorite: false,
      favorites: 0,
      isMine: true
    })
    savePosts(posts)
    this.setData({ draft: '', activeFilter: 'all' })
    this.refresh()
    wx.showToast({ title: '发布成功', icon: 'success' })
  },

  onToggleLike(e) {
    const { id } = e.currentTarget.dataset
    const posts = loadPosts().map(post => {
      if (post.id !== id) return post
      const liked = !post.liked
      return Object.assign({}, post, {
        liked,
        likes: Math.max(0, post.likes + (liked ? 1 : -1))
      })
    })
    savePosts(posts)
    this.refresh()
  },

  onToggleFavorite(e) {
    const { id } = e.currentTarget.dataset
    const posts = loadPosts().map(post => {
      if (post.id !== id) return post
      const favorite = !post.favorite
      return Object.assign({}, post, {
        favorite,
        favorites: Math.max(0, post.favorites + (favorite ? 1 : -1))
      })
    })
    savePosts(posts)
    this.refresh()
    wx.showToast({ title: posts.find(p => p.id === id).favorite ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  onAddComment(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '写评论',
      editable: true,
      placeholderText: '说点什么…',
      confirmText: '发送',
      success: res => {
        const text = (res.content || '').trim()
        if (!res.confirm || !text) return
        const posts = loadPosts().map(post => {
          if (post.id !== id) return post
          const commentList = post.commentList.concat([{
            id: `c-${Date.now()}`,
            user: '小铲屎官',
            content: text,
            createdAt: Date.now()
          }])
          return Object.assign({}, post, { commentList, comments: commentList.length })
        })
        savePosts(posts)
        this.refresh()
        wx.showToast({ title: '评论成功', icon: 'success' })
      }
    })
  }
})
