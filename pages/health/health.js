const store = require('../../utils/store.js')
const dateUtil = require('../../utils/date.js')

Page({
  data: {
    pets: [],
    petIndex: 0,
    petId: '',
    empty: false,
    monthLabel: '',
    vaccineDone: 0,
    vaccineTotal: 0,
    vaccinePercent: 0,
    monthCount: 0,
    weightPoints: [],
    breakdown: [],
    recent: []
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const pets = store.getPets().map(pet => store.decoratePet(pet))
    if (!pets.length) {
      this.setData({ empty: true, pets: [] })
      return
    }

    let index = pets.findIndex(pet => pet.id === this.data.petId)
    if (index < 0) index = 0
    const pet = pets[index]
    const events = store.getEventsByPet(pet.id).map(event => store.decorateEvent(event))

    const vaccine = events.filter(event => event.type === 'vaccine')
    const vaccineDone = vaccine.filter(event => event.done).length
    const vaccineTotal = vaccine.length

    const monthPrefix = dateUtil.today().slice(0, 7)
    const monthCount = events.filter(event => (event.date || '').indexOf(monthPrefix) === 0).length

    const weights = events
      .filter(event => event.type === 'weight' && event.amount !== '' && !isNaN(Number(event.amount)))
      .sort((a, b) => (a.date || '') < (b.date || '') ? -1 : 1)
      .slice(-8)
    const maxWeight = weights.reduce((max, item) => Math.max(max, Number(item.amount)), 0)
    const weightPoints = weights.map(item => ({
      id: item.id,
      date: dateUtil.dateLabel(item.date),
      value: item.amount,
      height: maxWeight > 0 ? Math.round(24 + (Number(item.amount) / maxWeight) * 66) : 30
    }))

    const breakdown = store.EVENT_TYPES.map(type => ({
      key: type.key,
      name: type.name,
      icon: type.icon,
      color: type.color,
      count: events.filter(event => event.type === type.key).length
    })).filter(item => item.count > 0)

    const recent = events
      .slice()
      .sort((a, b) => (a.date || '') < (b.date || '') ? 1 : -1)
      .slice(0, 5)

    const now = new Date()
    this.setData({
      empty: false,
      pets,
      petIndex: index,
      petId: pet.id,
      monthLabel: dateUtil.monthLabel(now.getFullYear(), now.getMonth() + 1),
      vaccineDone,
      vaccineTotal,
      vaccinePercent: vaccineTotal ? Math.round((vaccineDone / vaccineTotal) * 100) : 0,
      monthCount,
      weightPoints,
      breakdown,
      recent
    })
  },

  onSwitchPet(e) {
    this.setData({ petId: e.currentTarget.dataset.id }, this.refresh)
  },

  onOpenEvent(e) {
    wx.navigateTo({ url: `/pages/event-edit/event-edit?id=${e.currentTarget.dataset.id}` })
  },

  onAddPet() {
    wx.navigateTo({ url: '/pages/pet-edit/pet-edit' })
  }
})
