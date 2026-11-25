const store = require('../../utils/store.js')

function sortedEvents(petId) {
  const events = store.getEventsByPet(petId).map(event => store.decorateEvent(event))
  events.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    if (a.done) return a.date < b.date ? 1 : -1
    return (a.targetDate || a.date) < (b.targetDate || b.date) ? -1 : 1
  })
  return events
}

Page({
  data: {
    petId: '',
    pet: null,
    todoCount: 0,
    totalCount: 0,
    activeTab: 'todo',
    displayed: []
  },

  onLoad(options) {
    this.setData({ petId: options.id || '' })
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const pet = store.getPet(this.data.petId)
    if (!pet) {
      wx.showToast({ title: '这只宠物已不存在', icon: 'none' })
      wx.navigateBack()
      return
    }

    const view = store.decoratePet(pet, store.getEvents())
    const events = sortedEvents(pet.id)
    const todo = events.filter(event => !event.done)
    this.setData({
      pet: view,
      todoCount: todo.length,
      totalCount: events.length,
      displayed: this.data.activeTab === 'todo' ? todo : events
    })
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab
    const events = sortedEvents(this.data.petId)
    this.setData({
      activeTab: tab,
      displayed: tab === 'todo' ? events.filter(event => !event.done) : events
    })
  },

  onToggleDone(e) {
    const { id } = e.currentTarget.dataset
    const result = store.toggleEvent(id)
    if (result) {
      const title = result.followedUp ? '已生成下次待办' : (result.done ? '已标记完成' : '已恢复待办')
      wx.showToast({ title, icon: 'none' })
      this.refresh()
    }
  },

  onEditEvent(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/event-edit/event-edit?id=${id}` })
  },

  onAddEvent() {
    wx.navigateTo({ url: `/pages/event-edit/event-edit?petId=${this.data.petId}` })
  },

  onEditPet() {
    wx.navigateTo({ url: `/pages/pet-edit/pet-edit?id=${this.data.petId}` })
  }
})
