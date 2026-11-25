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

const ROOM_TICK = 520

Page({
  data: {
    menus: MENUS,
    userName: '小铲屎官',
    roomPets: [],
    petCount: 0,
    eventCount: 0,
    doneCount: 0,
    pendingCount: 0
  },

  onShow() {
    this.refresh()
    this.startRoomAnimation()
  },

  onHide() {
    this.stopRoomAnimation()
  },

  onUnload() {
    this.stopRoomAnimation()
  },

  startRoomAnimation() {
    if (this._roomTimer) return
    this._roomTimer = setInterval(() => {
      const pets = this.data.roomPets
      if (!pets.length) return
      const next = pets.map(pet => {
        const nextPet = Object.assign({}, pet)
        nextPet.ticks += 1

        if (nextPet.ticks >= nextPet.nextIn) {
          const roll = Math.random()
          nextPet.state = roll < 0.45 ? 'roam' : (roll < 0.75 ? 'nap' : 'sleep')
          nextPet.ticks = 0
          nextPet.nextIn = nextPet.state === 'roam'
            ? 3 + Math.floor(Math.random() * 4)
            : (nextPet.state === 'nap' ? 4 + Math.floor(Math.random() * 4) : 6 + Math.floor(Math.random() * 5))
          if (nextPet.state === 'roam') {
            nextPet.direction = Math.random() < 0.5 ? -1 : 1
          }
        }

        if (nextPet.state === 'roam') {
          nextPet.x += nextPet.direction * (4 + Math.random() * 5)
          if (nextPet.x < 8) {
            nextPet.x = 8
            nextPet.direction = 1
          }
          if (nextPet.x > 76) {
            nextPet.x = 76
            nextPet.direction = -1
          }
          nextPet.frame = nextPet.ticks % 2 === 0 ? 1 : 6
        } else if (nextPet.state === 'nap') {
          nextPet.frame = Math.random() < 0.7 ? 2 : 5
        } else {
          nextPet.frame = 5
        }
        return nextPet
      })
      this.setData({ roomPets: next })
    }, ROOM_TICK)
  },

  stopRoomAnimation() {
    if (this._roomTimer) {
      clearInterval(this._roomTimer)
      this._roomTimer = null
    }
  },

  refresh() {
    const pets = store.getPets()
    const events = store.getEvents()
    const pendingCount = events.filter(e => !e.done).length
    const roomPets = pets.slice(0, 4).map((pet, index) => ({
      id: pet.id,
      name: pet.name || '毛孩子',
      sheet: store.spriteFor(pet, index).sheet,
      frame: 0,
      state: 'roam',
      x: 12 + index * 18,
      ticks: 0,
      nextIn: 2 + Math.floor(Math.random() * 4),
      direction: Math.random() < 0.5 ? -1 : 1
    }))
    this.setData({
      roomPets,
      petCount: pets.length,
      eventCount: events.length,
      doneCount: events.length - pendingCount,
      pendingCount
    })
  },

  onPetTap(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/pet-detail/pet-detail?id=${id}` })
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
