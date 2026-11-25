const store = require('../../utils/store.js')
const dateUtil = require('../../utils/date.js')

const FEATURES = [
  { key: 'inventory', label: '库存记录', icon: '/assets/icon-feed.png', page: 'inventory', bg: '#FFF0D9' },
  { key: 'vaccine', label: '疫苗提醒', icon: '/assets/icon-vaccine.png', page: 'vaccine', bg: '#FFE7DF' },
  { key: 'walk', label: '遛弯记录', icon: '/assets/icon-walk.png', page: 'walk', bg: '#DDF4EC' },
  { key: 'health', label: '健康统计', icon: '/assets/icon-health.png', page: 'health', bg: '#E8EAFD' }
]

const PET_ANIM_FRAMES = 12
const PET_ANIM_TICK = 240

function bannerPetImage(pet, index) {
  if (pet && pet.spriteSheet) return pet.spriteSheet
  return store.spriteFor(pet, index).sheet
}

function isNonNegative(value) {
  const text = String(value === undefined || value === null ? '' : value).trim()
  return text !== '' && isFinite(Number(text)) && Number(text) >= 0
}

Page({
  data: {
    features: FEATURES,
    bannerPets: [],
    petCount: 0,
    reminders: [],
    dueTasks: [],
    stockAlerts: [],
    quickVisible: false,
    quickType: 'feed',
    quickTitle: '喂食',
    quickValueLabel: '喂食量',
    quickValueUnit: '例如：50g',
    quickPetNames: [],
    quickPetIds: [],
    quickPetIndex: 0,
    quickAmount: '',
    quickCans: '',
    quickKibble: '',
    quickDailyCans: '',
    quickDailyKibble: '',
    quickStockText: '',
    userName: '小铲屎官'
  },

  onShow() {
    this.refresh()
    this.startPetAnimation()
  },

  onHide() {
    this.stopPetAnimation()
  },

  onUnload() {
    this.stopPetAnimation()
  },

  startPetAnimation() {
    if (this._petTimer) return
    this._petTimer = setInterval(() => {
      const pets = this.data.bannerPets
      if (!pets.length) return
      const next = pets.map(pet => {
        let frame
        if (Math.random() < 0.7) {
          frame = (pet.frame + 1) % PET_ANIM_FRAMES
        } else {
          frame = Math.floor(Math.random() * PET_ANIM_FRAMES)
          if (frame === pet.frame) frame = (frame + 1) % PET_ANIM_FRAMES
        }
        return Object.assign({}, pet, { frame })
      })
      this.setData({ bannerPets: next })
    }, PET_ANIM_TICK)
  },

  stopPetAnimation() {
    if (this._petTimer) {
      clearInterval(this._petTimer)
      this._petTimer = null
    }
  },

  refresh() {
    const pets = store.getPets()
    const events = store.getEvents()
    const petViews = pets.map(pet => store.decoratePet(pet, events))
    const decoratedEvents = events.map(event => store.decorateEvent(event))

    const reminders = []
    decoratedEvents.forEach(event => {
      if (event.done || !event.targetDate || event.targetDays === null) return
      if (event.targetDays > 30) return
      const pet = pets.find(item => item.id === event.petId)
      reminders.push({
        id: `event-${event.id}`,
        kind: 'event',
        eventId: event.id,
        petId: event.petId,
        icon: event.typeIcon,
        title: `${pet ? pet.name : '宠物'} · ${event.title}`,
        detail: `${event.targetDateText} · ${event.statusText}`,
        tone: event.statusTone
      })
    })

    const dueTasks = store.getDueEvents(events).slice(0, 5).map(event => {
      const pet = pets.find(item => item.id === event.petId)
      return Object.assign({}, event, {
        id: `due-${event.id}`,
        eventId: event.id,
        petName: pet ? pet.name : '宠物',
        detailText: `${event.targetDateText} · ${event.statusText}`
      })
    })

    const bannerPets = petViews.slice(0, 3).map((pet, index) => ({
      id: pet.id,
      name: pet.name || '毛孩子',
      img: bannerPetImage(pet, index),
      frame: Math.floor(Math.random() * PET_ANIM_FRAMES)
    }))

    const stockAlerts = store.getStockAlerts()

    this.setData({
      bannerPets,
      petCount: pets.length,
      reminders: reminders.slice(0, 3),
      dueTasks,
      stockAlerts
    })
  },

  onFeatureTap(e) {
    const { key } = e.currentTarget.dataset
    if (key === 'inventory' || key === 'walk') {
      this.openQuickRecord(key)
      return
    }
    if (key === 'vaccine') {
      const pets = store.getPets()
      if (!pets.length) {
        wx.navigateTo({ url: '/pages/pet-edit/pet-edit' })
        return
      }
      wx.navigateTo({ url: `/pages/event-edit/event-edit?petId=${pets[0].id}&type=vaccine` })
      return
    }
    if (key === 'health') {
      wx.navigateTo({ url: '/pages/health/health' })
    }
  },

  openQuickRecord(type) {
    const pets = store.getPets()
    if (!pets.length) {
      wx.navigateTo({ url: '/pages/pet-edit/pet-edit' })
      return
    }
    const meta = store.typeOf(type)
    const firstPetId = pets[0].id
    const inventory = type === 'inventory' ? store.getInventory(firstPetId) : null
    this.setData({
      quickVisible: true,
      quickType: type,
      quickTitle: type === 'inventory' ? '库存记录' : meta.defaultTitle,
      quickValueLabel: meta.valueLabel,
      quickValueUnit: meta.unit,
      quickAmount: '',
      quickCans: '',
      quickKibble: '',
      quickDailyCans: '',
      quickDailyKibble: '',
      quickStockText: inventory ? inventory.stockText : '暂无库存记录',
      quickPetNames: pets.map(pet => pet.name),
      quickPetIds: pets.map(pet => pet.id),
      quickPetIndex: 0
    })
  },

  onQuickClose() {
    this.setData({ quickVisible: false })
  },

  noop() {},

  onQuickPickPet(e) {
    const index = Number(e.detail.value)
    const petId = this.data.quickPetIds[index]
    const inventory = this.data.quickType === 'inventory' && petId ? store.getInventory(petId) : null
    this.setData({
      quickPetIndex: index,
      quickStockText: inventory ? inventory.stockText : '暂无库存记录'
    })
  },

  onQuickAmountInput(e) {
    this.setData({ quickAmount: e.detail.value })
  },

  onQuickCansInput(e) {
    this.setData({ quickCans: e.detail.value })
  },

  onQuickKibbleInput(e) {
    this.setData({ quickKibble: e.detail.value })
  },

  onQuickDailyCansInput(e) {
    this.setData({ quickDailyCans: e.detail.value })
  },

  onQuickDailyKibbleInput(e) {
    this.setData({ quickDailyKibble: e.detail.value })
  },

  onQuickConfirm() {
    const petId = this.data.quickPetIds[this.data.quickPetIndex]
    if (!petId) return
    if (this.data.quickType === 'inventory') {
      this.confirmInventory(petId)
      return
    }
    store.saveEvent({
      petId,
      type: this.data.quickType,
      title: this.data.quickTitle,
      date: dateUtil.today(),
      nextDate: '',
      amount: this.data.quickAmount.trim(),
      note: '',
      done: true
    })
    this.setData({ quickVisible: false })
    wx.showToast({ title: '已记录', icon: 'success' })
    this.refresh()
  },

  confirmInventory(petId) {
    const { quickCans, quickKibble, quickDailyCans, quickDailyKibble } = this.data
    const values = [quickCans, quickKibble, quickDailyCans, quickDailyKibble]
    if (!values.every(isNonNegative)) {
      wx.showToast({ title: '请填写有效的数量', icon: 'none' })
      return
    }
    const cans = Number(quickCans) || 0
    const kibble = Number(quickKibble) || 0
    const dailyCans = Number(quickDailyCans) || 0
    const dailyKibble = Number(quickDailyKibble) || 0
    if (!cans && !kibble) {
      wx.showToast({ title: '请至少填写一项采购数量', icon: 'none' })
      return
    }
    if (!dailyCans && !dailyKibble) {
      wx.showToast({ title: '请填写预计每日消耗量', icon: 'none' })
      return
    }

    const inventory = store.saveInventoryPurchase({ petId, cans, kibble, dailyCans, dailyKibble })
    this.setData({ quickVisible: false })
    const emptyItems = []
    if (dailyCans > 0 && inventory.remainingCans <= 0) emptyItems.push('罐头')
    if (dailyKibble > 0 && inventory.remainingKibble <= 0) emptyItems.push('猫粮')

    if (emptyItems.length) {
      wx.showModal({
        title: '库存耗尽提醒',
        content: `${inventory.petName}的${emptyItems.join('、')}库存预计已耗尽，请及时补货。`,
        showCancel: false,
        confirmText: '知道了'
      })
    } else {
      wx.showToast({ title: '库存已记录', icon: 'success' })
    }
    this.refresh()
  },

  onStockAlertTap(e) {
    const { petId } = e.currentTarget.dataset
    this.openQuickRecord('inventory')
    if (!petId) return
    const index = this.data.quickPetIds.indexOf(petId)
    if (index < 0) return
    const inventory = store.getInventory(petId)
    this.setData({
      quickPetIndex: index,
      quickStockText: inventory ? inventory.stockText : '暂无库存记录'
    })
  },

  onOpenCalendar() {
    wx.navigateTo({ url: '/pages/calendar/calendar' })
  },

  onAddPet() {
    wx.navigateTo({ url: '/pages/pet-edit/pet-edit' })
  },

  onOpenPet(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/pet-detail/pet-detail?id=${id}` })
  },

  onOpenReminder(e) {
    const { kind, eventId, petId } = e.currentTarget.dataset
    if (kind === 'event' && eventId) {
      wx.navigateTo({ url: `/pages/event-edit/event-edit?id=${eventId}` })
      return
    }
    if (petId) {
      wx.navigateTo({ url: `/pages/pet-detail/pet-detail?id=${petId}` })
    }
  },

  onGoMine() {
    wx.switchTab({ url: '/pages/mine/mine' })
  }
})
