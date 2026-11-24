const store = require('../../utils/store.js')

const MENUS = [
  {
    key: 'records',
    label: '我的记录',
    icon: '/assets/icon-records.png',
    type: 'records'
  },
  {
    key: 'settings',
    label: '设置',
    icon: '/assets/icon-settings.png',
    type: 'settings'
  },
  {
    key: 'service',
    label: '客服',
    icon: '/assets/icon-service.png',
    type: 'service'
  }
]

Page({
  data: {
    menus: MENUS,
    userName: '小铲屎官',
    petCount: 0,
    eventCount: 0,
    doneCount: 0,
    pendingCount: 0
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const pets = store.getPets()
    const events = store.getEvents()
    const pendingCount = events.filter(e => !e.done).length
    this.setData({
      petCount: pets.length,
      eventCount: events.length,
      doneCount: events.length - pendingCount,
      pendingCount
    })
  },

  onMenuTap(e) {
    const { type } = e.currentTarget.dataset
    if (type === 'records') {
      const pets = store.getPets()
      if (pets.length) {
        wx.navigateTo({ url: `/pages/pet-detail/pet-detail?id=${pets[0].id}` })
      } else {
        wx.navigateTo({ url: '/pages/pet-edit/pet-edit' })
      }
      return
    }
    if (type === 'settings') {
      wx.showModal({
        title: '设置',
        content: '通知、主题等设置即将上线',
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }
    if (type === 'service') {
      wx.showModal({
        title: '客服',
        content: '工作日 9:00 - 18:00 在线，也可留言反馈',
        showCancel: false,
        confirmText: '知道了'
      })
    }
  },

  onAddPet() {
    wx.navigateTo({ url: '/pages/pet-edit/pet-edit' })
  },

  onGoPets() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  onGoCommunity() {
    wx.switchTab({ url: '/pages/community/community' })
  }
})
