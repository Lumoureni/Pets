const store = require('../../utils/store.js')
const dateUtil = require('../../utils/date.js')

function emptyForm() {
  return {
    name: '',
    species: '',
    breed: '',
    gender: '',
    birthday: '',
    weight: '',
    weightUnit: 'kg',
    neutered: 'unknown',
    adoptedAt: '',
    allergy: '',
    photo: '',
    spriteKey: '',
    avatar: '',
    avatarType: 'image',
    note: ''
  }
}

Page({
  data: {
    isEdit: false,
    id: '',
    form: emptyForm(),
    speciesList: store.SPECIES,
    genders: store.GENDERS,
    pixelAvatar: '',
    pixelKey: '',
    neuterOptions: [
      { key: 'yes', name: '已绝育' },
      { key: 'no', name: '未绝育' },
      { key: 'unknown', name: '未填写' }
    ],
    today: ''
  },

  onLoad(options) {
    const today = dateUtil.today()
    if (!options.id) {
      this.setData({ today }, () => this.refreshPixelPreview())
      return
    }
    const pet = store.getPet(options.id)
    if (!pet) {
      wx.showToast({ title: '这只宠物已不存在', icon: 'none' })
      wx.navigateBack()
      return
    }
    const form = {
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      gender: pet.gender || '',
      birthday: pet.birthday || '',
      weight: pet.weight || '',
      weightUnit: pet.weightUnit || 'kg',
      neutered: pet.neutered || 'unknown',
      adoptedAt: pet.adoptedAt || '',
      allergy: pet.allergy || '',
      photo: pet.photo || (pet.avatarType === 'image' ? pet.avatar : ''),
      spriteKey: pet.spriteKey || '',
      avatar: pet.avatar || '',
      avatarType: pet.avatarType || 'image',
      note: pet.note || ''
    }
    this.setData({ id: pet.id, isEdit: true, form, today }, () => this.refreshPixelPreview())
  },

  refreshPixelPreview() {
    const form = this.data.form
    const sprite = store.spriteFor({
      species: form.species,
      gender: form.gender,
      breed: form.breed,
      spriteKey: form.spriteKey
    }, 0)
    this.setData({ pixelAvatar: sprite.avatar, pixelKey: sprite.key })
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    const patch = { [`form.${field}`]: e.detail.value }
    if (field === 'breed') patch['form.spriteKey'] = ''
    this.setData(patch, () => {
      if (field === 'breed') this.refreshPixelPreview()
    })
  },

  onSelectSpecies(e) {
    const { key } = e.currentTarget.dataset
    this.setData({ 'form.species': key, 'form.spriteKey': '' }, () => this.refreshPixelPreview())
  },

  onSelectGender(e) {
    const { key } = e.currentTarget.dataset
    this.setData({ 'form.gender': key, 'form.spriteKey': '' }, () => this.refreshPixelPreview())
  },

  onChooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: res => {
        const tempPath = res.tempFiles[0].tempFilePath
        let savedPath = tempPath
        try {
          const matched = /\.(\w+)$/.exec(tempPath)
          const ext = matched ? `.${matched[1]}` : '.jpg'
          savedPath = wx.getFileSystemManager().saveFileSync(
            tempPath,
            `${wx.env.USER_DATA_PATH}/pet-${store.genId()}${ext}`
          )
        } catch (err) {
          wx.showToast({ title: '照片仅本次可用', icon: 'none' })
        }
        this.setData({ 'form.photo': savedPath, 'form.avatarType': 'image' }, () => this.refreshPixelPreview())
      }
    })
  },

  onBirthdayChange(e) {
    this.setData({ 'form.birthday': e.detail.value })
  },

  onAdoptedAtChange(e) {
    this.setData({ 'form.adoptedAt': e.detail.value })
  },

  onSelectNeutered(e) {
    this.setData({ 'form.neutered': e.currentTarget.dataset.key })
  },

  onSelectWeightUnit(e) {
    this.setData({ 'form.weightUnit': e.currentTarget.dataset.key })
  },

  onSave() {
    const form = this.data.form
    const name = form.name.trim()
    if (!name) {
      wx.showToast({ title: '请填写宠物名字', icon: 'none' })
      return
    }
    if (!this.data.isEdit) {
      if (!form.photo) {
        wx.showToast({ title: '请上传宠物照片', icon: 'none' })
        return
      }
      if (!form.species) {
        wx.showToast({ title: '请选择种类', icon: 'none' })
        return
      }
      if (!form.gender || form.gender === 'unknown') {
        wx.showToast({ title: '请选择性别', icon: 'none' })
        return
      }
    }
    if (!form.birthday) {
      wx.showToast({ title: '请选择生日', icon: 'none' })
      return
    }
    if (dateUtil.diffDays(form.birthday) > 0) {
      wx.showToast({ title: '生日不能晚于今天', icon: 'none' })
      return
    }
    if (form.weight && isNaN(Number(form.weight))) {
      wx.showToast({ title: '体重请填写数字', icon: 'none' })
      return
    }
    if (form.adoptedAt && form.adoptedAt < form.birthday) {
      wx.showToast({ title: '到家日不能早于生日', icon: 'none' })
      return
    }

    const sprite = store.spriteFor({
      species: form.species,
      gender: form.gender,
      breed: form.breed.trim(),
      spriteKey: form.spriteKey
    }, 0)
    const petData = Object.assign({}, form, {
      id: this.data.id,
      name,
      breed: form.breed.trim(),
      weight: form.weight.trim(),
      allergy: form.allergy.trim(),
      note: form.note.trim(),
      photo: form.photo,
      spriteKey: sprite.key,
      spriteSheet: sprite.sheet,
      avatar: sprite.avatar,
      avatarType: 'image'
    })
    delete petData.pixelAvatar
    delete petData.pixelKey
    const record = store.savePet(petData)

    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => {
      if (this.data.isEdit) {
        wx.navigateBack()
      } else {
        wx.redirectTo({ url: `/pages/pet-detail/pet-detail?id=${record.id}` })
      }
    }, 400)
  },

  onDelete() {
    wx.showModal({
      title: '删除宠物',
      content: `将同时删除「${this.data.form.name}」的全部事项记录，且无法恢复`,
      confirmColor: '#E4644B',
      success: res => {
        if (!res.confirm) return
        store.removePet(this.data.id)
        wx.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => wx.reLaunch({ url: '/pages/index/index' }), 400)
      }
    })
  }
})
