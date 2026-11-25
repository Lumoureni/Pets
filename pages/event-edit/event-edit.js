const store = require('../../utils/store.js')
const dateUtil = require('../../utils/date.js')

function emptyForm(today) {
  return {
    petId: '',
    type: 'vaccine',
    title: store.typeOf('vaccine').defaultTitle,
    date: today,
    nextDate: '',
    amount: '',
    note: '',
    done: false
  }
}

Page({
  data: {
    isEdit: false,
    id: '',
    form: emptyForm(''),
    types: store.EVENT_TYPES,
    petList: [],
    petNames: [],
    petIndex: 0,
    today: '',
    showAmount: false,
    showSchedule: true,
    valueLabel: '',
    valueUnit: ''
  },

  onLoad(options) {
    const today = dateUtil.today()
    const pets = store.getPets()
    const petNames = pets.map(pet => pet.name)
    let form = emptyForm(today)
    let isEdit = false
    let id = ''

    if (options.id) {
      const event = store.getEvent(options.id)
      if (!event) {
        wx.showToast({ title: '该事项已不存在', icon: 'none' })
        wx.navigateBack()
        return
      }
      isEdit = true
      id = event.id
      form = {
        petId: event.petId || '',
        type: event.type || 'other',
        title: event.title || '',
        date: event.date || today,
        nextDate: event.nextDate || '',
        amount: event.amount || '',
        note: event.note || '',
        done: !!event.done
      }
    } else if (options.petId) {
      form.petId = options.petId
      if (options.type) {
        form.type = options.type
        form.title = store.typeOf(options.type).defaultTitle
      }
    }

    let petIndex = pets.findIndex(pet => pet.id === form.petId)
    if (petIndex < 0) petIndex = pets.length > 0 ? 0 : -1
    if (petIndex >= 0) form.petId = pets[petIndex].id

    const meta = store.typeOf(form.type)
    this.setData({
      today,
      isEdit,
      id,
      form,
      petList: pets,
      petNames,
      petIndex: Math.max(0, petIndex),
      showAmount: !!meta.valueLabel,
      showSchedule: !meta.daily,
      valueLabel: meta.valueLabel,
      valueUnit: meta.unit
    })
  },

  onSelectPet(e) {
    const index = Number(e.detail.value)
    const pet = this.data.petList[index]
    if (pet) this.setData({ petIndex: index, 'form.petId': pet.id })
  },

  onSelectType(e) {
    const { key } = e.currentTarget.dataset
    const previousMeta = store.typeOf(this.data.form.type)
    const nextMeta = store.typeOf(key)
    const patch = {
      'form.type': key,
      showAmount: !!nextMeta.valueLabel,
      showSchedule: !nextMeta.daily,
      valueLabel: nextMeta.valueLabel,
      valueUnit: nextMeta.unit
    }
    if (!this.data.form.title.trim() || this.data.form.title === previousMeta.defaultTitle) {
      patch['form.title'] = nextMeta.defaultTitle
    }
    if (nextMeta.daily) patch['form.done'] = true
    this.setData(patch)
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onDateChange(e) {
    this.setData({ 'form.date': e.detail.value })
  },

  onNextDateChange(e) {
    this.setData({ 'form.nextDate': e.detail.value })
  },

  onClearNext() {
    this.setData({ 'form.nextDate': '' })
  },

  onDoneChange(e) {
    this.setData({ 'form.done': e.detail.value })
  },

  onSave() {
    const form = this.data.form
    if (!form.petId) {
      wx.showToast({ title: '请先添加一只宠物', icon: 'none' })
      return
    }
    const title = form.title.trim() || store.typeOf(form.type).defaultTitle
    if (this.data.showSchedule && form.nextDate && form.nextDate < form.date) {
      wx.showToast({ title: '下次计划不能早于事项日期', icon: 'none' })
      return
    }
    store.saveEvent(Object.assign({}, form, {
      id: this.data.id,
      title,
      nextDate: this.data.showSchedule ? form.nextDate : '',
      amount: form.amount.trim(),
      note: form.note.trim()
    }))
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  },

  onDelete() {
    wx.showModal({
      title: '删除事项',
      content: '确定要删除这条记录吗？删除后无法恢复',
      confirmColor: '#E4644B',
      success: res => {
        if (!res.confirm) return
        store.removeEvent(this.data.id)
        wx.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 400)
      }
    })
  }
})
