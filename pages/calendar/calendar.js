const store = require('../../utils/store.js')
const dateUtil = require('../../utils/date.js')

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

Page({
  data: {
    year: 0,
    month: 0,
    monthText: '',
    weekdays: WEEKDAYS,
    weeks: [],
    selectedDate: '',
    dayEvents: []
  },

  onLoad() {
    const now = new Date()
    this.setData({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      selectedDate: dateUtil.today()
    })
    this.build()
  },

  onShow() {
    if (this.data.year) this.build()
  },

  build() {
    const events = store.getEvents().map(event => store.decorateEvent(event))
    const pets = store.getPets()
    const weeks = dateUtil.monthGrid(this.data.year, this.data.month, events)
    const dayEvents = store.getEventsOnDate(this.data.selectedDate, events).map(event => {
      const pet = pets.find(item => item.id === event.petId)
      return Object.assign({}, event, { petName: pet ? pet.name : '宠物' })
    })
    this.setData({
      weeks,
      dayEvents,
      monthText: dateUtil.monthLabel(this.data.year, this.data.month)
    })
  },

  onPrevMonth() {
    let year = this.data.year
    let month = this.data.month - 1
    if (month < 1) {
      month = 12
      year -= 1
    }
    this.setData({ year, month }, this.build)
  },

  onNextMonth() {
    let year = this.data.year
    let month = this.data.month + 1
    if (month > 12) {
      month = 1
      year += 1
    }
    this.setData({ year, month }, this.build)
  },

  onSelectDay(e) {
    this.setData({ selectedDate: e.currentTarget.dataset.date }, this.build)
  },

  onOpenEvent(e) {
    wx.navigateTo({ url: `/pages/event-edit/event-edit?id=${e.currentTarget.dataset.id}` })
  }
})
