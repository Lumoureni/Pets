const store = require('../../utils/store.js')
const dateUtil = require('../../utils/date.js')

const FEATURES = [
  { key: 'feed', label: '快速喂食', icon: '/assets/icon-feed.png', page: 'feed' },
  { key: 'vaccine', label: '疫苗提醒', icon: '/assets/icon-vaccine.png', page: 'vaccine' },
  { key: 'walk', label: '遛弯记录', icon: '/assets/icon-walk.png', page: 'walk' },
  { key: 'health', label: '健康统计', icon: '/assets/icon-health.png', page: 'health' }
]

const BREED_RULES = {
  cat: [
    { keys: ['橘', 'orange'], img: '/assets/banner-pets/cat-orange.png' },
    { keys: ['奶牛', '黑白', 'tuxedo'], img: '/assets/banner-pets/cat-tuxedo.png' },
    { keys: ['三花', 'calico'], img: '/assets/banner-pets/cat-calico.png' },
    { keys: ['暹罗', 'siamese'], img: '/assets/banner-pets/cat-siamese.png' },
    { keys: ['黑猫', 'black'], img: '/assets/banner-pets/cat-black.png' },
    { keys: ['英短', '蓝猫', 'british'], img: '/assets/banner-pets/cat-british.png' }
  ],
  dog: [
    { keys: ['柯基', 'corgi'], img: '/assets/banner-pets/dog-corgi.png' },
    { keys: ['柴犬', '柴狗', 'shiba'], img: '/assets/banner-pets/dog-shiba.png' },
    { keys: ['金毛', 'golden'], img: '/assets/banner-pets/dog-golden.png' },
    { keys: ['哈士奇', '二哈', 'husky'], img: '/assets/banner-pets/dog-husky.png' },
    { keys: ['泰迪', '贵宾', 'poodle'], img: '/assets/banner-pets/dog-poodle.png' },
    { keys: ['法斗', '斗牛', 'french'], img: '/assets/banner-pets/dog-frenchie.png' }
  ]
}

const DEFAULT_BANNER_PET = {
  cat: ['/assets/banner-pets/cat-orange.png', '/assets/banner-pets/cat-calico.png', '/assets/banner-pets/cat-british.png'],
  dog: ['/assets/banner-pets/dog-corgi.png', '/assets/banner-pets/dog-shiba.png', '/assets/banner-pets/dog-husky.png'],
  other: ['/assets/banner-pets/cat-tuxedo.png', '/assets/banner-pets/dog-golden.png']
}

function bannerPetImage(pet, index) {
  const breed = String(pet.breed || '').toLowerCase()
  const rules = BREED_RULES[pet.species] || []
  const match = rules.find(rule => rule.keys.some(key => breed.indexOf(key) >= 0))
  if (match) return match.img
  const defaults = DEFAULT_BANNER_PET[pet.species] || DEFAULT_BANNER_PET.other
  return defaults[index % defaults.length]
}

Page({
  data: {
    features: FEATURES,
    bannerPets: [],
    reminders: [],
    dueTasks: [],
    quickVisible: false,
    quickType: 'feed',
    quickTitle: '喂食',
    quickValueLabel: '喂食量',
    quickValueUnit: '例如：50g',
    quickPetNames: [],
    quickPetIds: [],
    quickPetIndex: 0,
    quickAmount: '',
    userName: '小铲屎官'
  },

  onShow() {
    this.refresh()
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
      img: bannerPetImage(pet, index)
    }))

    this.setData({
      bannerPets,
      reminders: reminders.slice(0, 3),
      dueTasks
    })
  },

  onFeatureTap(e) {
    const { key } = e.currentTarget.dataset
    if (key === 'feed' || key === 'walk') {
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
    this.setData({
      quickVisible: true,
      quickType: type,
      quickTitle: meta.defaultTitle,
      quickValueLabel: meta.valueLabel,
      quickValueUnit: meta.unit,
      quickAmount: '',
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
    this.setData({ quickPetIndex: Number(e.detail.value) })
  },

  onQuickAmountInput(e) {
    this.setData({ quickAmount: e.detail.value })
  },

  onQuickConfirm() {
    const petId = this.data.quickPetIds[this.data.quickPetIndex]
    if (!petId) return
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
