// app.js
App({
  onLaunch() {
    try {
      if (!wx.getStorageSync('pet_app_inited')) {
        this.seedDemoData()
        wx.setStorageSync('pet_app_inited', 1)
        this.upgradeData()
      }
    } catch (e) {
      // ignore
    }
  },

  seedDemoData() {
    const pets = wx.getStorageSync('my_pets_v1')
    if (Array.isArray(pets) && pets.length) return

    const now = Date.now()
    const demoPets = [
      {
        id: 'demo-cat-white',
        name: '奶昔',
        species: 'cat',
        gender: 'girl',
        birthday: '2023-03-12',
        breed: '橘猫',
        weight: '5.2',
        weightUnit: 'kg',
        neutered: 'yes',
        adoptedAt: '2023-04-20',
        allergy: '',
        note: '爱晒太阳的小胖橘',
        createdAt: now - 300000
      },
      {
        id: 'demo-dog-corgi',
        name: '基基',
        species: 'dog',
        gender: 'boy',
        birthday: '2022-08-01',
        breed: '柯基',
        weight: '12.4',
        weightUnit: 'kg',
        neutered: 'yes',
        adoptedAt: '2022-09-15',
        allergy: '鸡肉过敏',
        note: '刚学会握手的柯基',
        createdAt: now - 200000
      },
      {
        id: 'demo-cat-gray',
        name: '煤球',
        species: 'cat',
        gender: 'boy',
        birthday: '2024-01-20',
        breed: '英短',
        weight: '4.1',
        weightUnit: 'kg',
        neutered: 'no',
        adoptedAt: '2024-03-02',
        allergy: '',
        note: '高冷灰猫',
        createdAt: now - 100000
      }
    ]
    wx.setStorageSync('my_pets_v1', demoPets)

    const events = [
      {
        id: 'demo-ev-1',
        petId: 'demo-dog-corgi',
        type: 'vaccine',
        title: '狂犬疫苗第 2 针',
        date: this.plusDays(7),
        nextDate: '',
        note: '社区医院',
        done: false,
        createdAt: now
      },
      {
        id: 'demo-ev-2',
        petId: 'demo-cat-white',
        type: 'deworm',
        title: '体内外驱虫',
        date: this.plusDays(-2),
        nextDate: this.plusDays(28),
        note: '',
        done: false,
        createdAt: now
      },
      {
        id: 'demo-ev-3',
        petId: 'demo-cat-gray',
        type: 'grooming',
        title: '洗护美容',
        date: this.plusDays(-5),
        nextDate: '',
        note: '',
        done: true,
        createdAt: now
      },
      this.demoEvent('demo-ev-4', 'demo-cat-white', 'feed', '喂食', 0, '80g', '晚餐'),
      this.demoEvent('demo-ev-5', 'demo-dog-corgi', 'walk', '傍晚遛弯', -1, '35 分钟', '小区公园'),
      this.demoEvent('demo-ev-6', 'demo-cat-white', 'weight', '称重', -7, '5.0', ''),
      this.demoEvent('demo-ev-7', 'demo-cat-white', 'weight', '称重', -1, '5.2', '稳定增长'),
      this.demoEvent('demo-ev-8', 'demo-dog-corgi', 'expense', '购买狗粮', -2, '128 元', '主粮')
    ]
    wx.setStorageSync('my_pet_events_v1', events)
  },

  demoEvent(id, petId, type, title, offset, amount, note) {
    return {
      id,
      petId,
      type,
      title,
      date: this.plusDays(offset),
      nextDate: '',
      amount,
      note,
      done: true,
      doneAt: Date.now(),
      createdAt: Date.now()
    }
  },

  upgradeData() {
    try {
      if (wx.getStorageSync('pet_app_upgraded_v1')) return
      const pets = wx.getStorageSync('my_pets_v1')
      if (Array.isArray(pets)) {
        const upgraded = pets.map(pet => Object.assign({
          weight: '',
          weightUnit: 'kg',
          neutered: 'unknown',
          adoptedAt: '',
          allergy: ''
        }, pet))
        wx.setStorageSync('my_pets_v1', upgraded)
      }
      const events = wx.getStorageSync('my_pet_events_v1')
      if (Array.isArray(events) && !events.some(event => ['feed', 'walk', 'weight', 'expense'].indexOf(event.type) >= 0)) {
        const first = Array.isArray(pets) && pets.length ? pets[0] : null
        if (first) {
          const daily = [
            this.demoEvent('up-ev-feed', first.id, 'feed', '喂食', 0, '50g', ''),
            this.demoEvent('up-ev-walk', first.id, 'walk', '遛弯', -1, '30 分钟', ''),
            this.demoEvent('up-ev-weight', first.id, 'weight', '称重', -1, '4.5', '')
          ]
          wx.setStorageSync('my_pet_events_v1', events.concat(daily))
        }
      }
      wx.setStorageSync('pet_app_upgraded_v1', 1)
    } catch (e) {}
  },

  plusDays(n) {
    const d = new Date()
    d.setDate(d.getDate() + n)
    const pad = x => (x < 10 ? `0${x}` : `${x}`)
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
})
