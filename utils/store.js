const dateUtil = require('./date.js')

const PETS_KEY = 'my_pets_v1'
const EVENTS_KEY = 'my_pet_events_v1'
const INVENTORY_KEY = 'my_pet_inventory_v1'
const LOW_STOCK_DAYS = 3

const SPECIES = [
  { key: 'cat', name: '猫咪', icon: '🐱', bg: 'rgba(255, 170, 120, 0.38)' },
  { key: 'dog', name: '狗狗', icon: '🐶', bg: 'rgba(96, 208, 180, 0.32)' },
  { key: 'other', name: '其他', icon: '🐾', bg: 'rgba(158, 140, 255, 0.32)' }
]

const GENDERS = [
  { key: 'boy', name: '弟弟', icon: '♂' },
  { key: 'girl', name: '妹妹', icon: '♀' },
  { key: 'unknown', name: '保密', icon: '?' }
]

const EVENT_TYPES = [
  { key: 'vaccine', name: '疫苗', icon: '💉', color: '#FF8A5B', bg: 'rgba(255, 138, 91, 0.22)', defaultTitle: '疫苗接种', valueLabel: '', unit: '', daily: false },
  { key: 'deworm', name: '驱虫', icon: '🛡️', color: '#3DBE9A', bg: 'rgba(61, 190, 154, 0.22)', defaultTitle: '体内外驱虫', valueLabel: '', unit: '', daily: false },
  { key: 'checkup', name: '体检', icon: '🩺', color: '#7C8CF8', bg: 'rgba(124, 140, 248, 0.22)', defaultTitle: '健康体检', valueLabel: '', unit: '', daily: false },
  { key: 'grooming', name: '洗护', icon: '🛁', color: '#E9A23B', bg: 'rgba(233, 162, 59, 0.22)', defaultTitle: '洗护美容', valueLabel: '', unit: '', daily: false },
  { key: 'feed', name: '喂食', icon: '🍚', color: '#F0A030', bg: 'rgba(240, 160, 48, 0.22)', defaultTitle: '喂食', valueLabel: '喂食量', unit: '例如：50g / 半碗', daily: true },
  { key: 'walk', name: '遛弯', icon: '🦮', color: '#3DBE9A', bg: 'rgba(61, 190, 154, 0.22)', defaultTitle: '遛弯', valueLabel: '时长', unit: '例如：30 分钟', daily: true },
  { key: 'poop', name: '排便', icon: '🧻', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.22)', defaultTitle: '排便记录', valueLabel: '情况', unit: '例如：正常 2 次', daily: true },
  { key: 'weight', name: '体重', icon: '⚖️', color: '#7C8CF8', bg: 'rgba(124, 140, 248, 0.22)', defaultTitle: '体重记录', valueLabel: '体重', unit: '例如：4.2', daily: true },
  { key: 'expense', name: '消费', icon: '🧾', color: '#E85A6A', bg: 'rgba(232, 90, 106, 0.22)', defaultTitle: '养宠消费', valueLabel: '金额', unit: '例如：128 元', daily: true },
  { key: 'other', name: '其他', icon: '📌', color: '#98A0B3', bg: 'rgba(152, 160, 179, 0.22)', defaultTitle: '其他事项', valueLabel: '', unit: '', daily: false }
]

const AVATARS = ['🐱', '🐶', '🐰', '🐹', '🦊', '🐢', '🐦', '🐷']

const SPRITE_KEYS = [
  'cat-orange', 'cat-tuxedo', 'cat-calico', 'cat-siamese', 'cat-black', 'cat-british',
  'dog-corgi', 'dog-shiba', 'dog-golden', 'dog-husky', 'dog-poodle', 'dog-frenchie'
]

const SPRITE_RULES = {
  cat: [
    { keys: ['橘', 'orange'], key: 'cat-orange' },
    { keys: ['奶牛', '黑白', 'tuxedo'], key: 'cat-tuxedo' },
    { keys: ['三花', 'calico'], key: 'cat-calico' },
    { keys: ['暹罗', 'siamese'], key: 'cat-siamese' },
    { keys: ['黑猫', 'black'], key: 'cat-black' },
    { keys: ['英短', '蓝猫', 'british'], key: 'cat-british' }
  ],
  dog: [
    { keys: ['柯基', 'corgi'], key: 'dog-corgi' },
    { keys: ['柴犬', '柴狗', 'shiba'], key: 'dog-shiba' },
    { keys: ['金毛', 'golden'], key: 'dog-golden' },
    { keys: ['哈士奇', '二哈', 'husky'], key: 'dog-husky' },
    { keys: ['泰迪', '贵宾', 'poodle'], key: 'dog-poodle' },
    { keys: ['法斗', '斗牛', 'french'], key: 'dog-frenchie' }
  ]
}

const DEFAULT_SPRITES = {
  cat: {
    boy: ['cat-orange', 'cat-british', 'cat-siamese'],
    girl: ['cat-calico', 'cat-tuxedo', 'cat-siamese'],
    unknown: ['cat-orange', 'cat-calico', 'cat-british']
  },
  dog: {
    boy: ['dog-corgi', 'dog-husky', 'dog-shiba'],
    girl: ['dog-shiba', 'dog-golden', 'dog-poodle'],
    unknown: ['dog-corgi', 'dog-shiba', 'dog-husky']
  },
  other: {
    boy: ['dog-corgi', 'cat-orange'],
    girl: ['cat-calico', 'dog-shiba'],
    unknown: ['cat-tuxedo', 'dog-golden']
  }
}

function findItem(list, key, value) {
  return list.find(item => item[key] === value) || null
}

function speciesOf(key) {
  return findItem(SPECIES, 'key', key) || SPECIES[2]
}

function genderOf(key) {
  return findItem(GENDERS, 'key', key) || GENDERS[2]
}

function typeOf(key) {
  return findItem(EVENT_TYPES, 'key', key) || findItem(EVENT_TYPES, 'key', 'other')
}

function spriteKeyFor(pet, index) {
  if (pet && SPRITE_KEYS.indexOf(pet.spriteKey) >= 0) return pet.spriteKey
  const breed = String((pet && pet.breed) || '').toLowerCase()
  const species = (pet && pet.species) || 'other'
  const match = (SPRITE_RULES[species] || []).find(rule =>
    rule.keys.some(key => breed.indexOf(key) >= 0)
  )
  if (match) return match.key
  const group = DEFAULT_SPRITES[species] || DEFAULT_SPRITES.other
  const gender = (pet && pet.gender) || 'unknown'
  const list = group[gender] || group.unknown
  return list[(index || 0) % list.length]
}

function spritePaths(key) {
  return {
    key,
    avatar: `/assets/banner-pets/${key}.png`,
    sheet: `/assets/banner-pets/anim/${key}.png`
  }
}

function spriteFor(pet, index) {
  return spritePaths(spriteKeyFor(pet, index))
}

function genId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function toNumber(value) {
  const number = Number(value)
  return isFinite(number) && number > 0 ? number : 0
}

function round1(value) {
  return Math.round(value * 10) / 10
}

function read(key) {
  try {
    const value = wx.getStorageSync(key)
    return Array.isArray(value) ? value : []
  } catch (err) {
    return []
  }
}

function write(key, list) {
  try {
    wx.setStorageSync(key, list)
  } catch (err) {
    wx.showToast({ title: '保存失败，请重试', icon: 'none' })
  }
}

function getPets() {
  return read(PETS_KEY)
}

function getPet(id) {
  return getPets().find(pet => pet.id === id) || null
}

function savePet(pet) {
  const pets = getPets()
  const record = Object.assign({}, pet)
  if (!record.id) {
    record.id = genId()
    record.createdAt = Date.now()
  }
  const index = pets.findIndex(item => item.id === record.id)
  if (index >= 0) {
    record.createdAt = pets[index].createdAt || record.createdAt
    pets[index] = record
  } else pets.push(record)
  write(PETS_KEY, pets)
  return record
}

function removePet(id) {
  write(PETS_KEY, getPets().filter(pet => pet.id !== id))
  write(EVENTS_KEY, getEvents().filter(event => event.petId !== id))
  write(INVENTORY_KEY, getInventories().filter(item => item.petId !== id))
}

function getEvents() {
  return read(EVENTS_KEY)
}

function getEvent(id) {
  return getEvents().find(event => event.id === id) || null
}

function getEventsByPet(petId) {
  return getEvents().filter(event => event.petId === petId)
}

function ensureFollowUp(record, wasDone) {
  if (!record.done || !record.nextDate || wasDone) return false
  const exists = getEvents().some(event =>
    event.id !== record.id &&
    event.petId === record.petId &&
    event.date === record.nextDate &&
    event.title === record.title
  )
  if (exists) return false
  saveEvent({
    petId: record.petId,
    type: record.type,
    title: record.title,
    date: record.nextDate,
    nextDate: '',
    note: '',
    done: false
  })
  return true
}

function saveEvent(event) {
  const events = getEvents()
  const record = Object.assign({}, event)
  if (!record.id) {
    record.id = genId()
    record.createdAt = Date.now()
  }
  const index = events.findIndex(item => item.id === record.id)
  const wasDone = index >= 0 ? !!events[index].done : false
  if (index >= 0) {
    record.createdAt = events[index].createdAt || record.createdAt
    events[index] = record
  } else events.push(record)
  write(EVENTS_KEY, events)
  return Object.assign({}, record, { followedUp: ensureFollowUp(record, wasDone) })
}

function toggleEvent(id) {
  const events = getEvents()
  const index = events.findIndex(event => event.id === id)
  if (index < 0) return null
  const wasDone = !!events[index].done
  events[index].done = !events[index].done
  events[index].doneAt = events[index].done ? Date.now() : null
  write(EVENTS_KEY, events)
  return Object.assign({}, events[index], {
    followedUp: ensureFollowUp(events[index], wasDone)
  })
}

function removeEvent(id) {
  write(EVENTS_KEY, getEvents().filter(event => event.id !== id))
}

function getInventories() {
  return read(INVENTORY_KEY)
}

function getInventory(petId) {
  const record = getInventories().find(item => item.petId === petId)
  return record ? decorateInventory(record) : null
}

function decorateInventory(record) {
  if (!record) return null
  const pet = getPet(record.petId)
  const elapsedDays = Math.max(0, -(dateUtil.diffDays(record.updatedAt || record.date) || 0))
  const dailyCans = toNumber(record.dailyCans)
  const dailyKibble = toNumber(record.dailyKibble)
  const remainingCans = round1(Math.max(0, toNumber(record.cans) - dailyCans * elapsedDays))
  const remainingKibble = round1(Math.max(0, toNumber(record.kibble) - dailyKibble * elapsedDays))
  const canDays = dailyCans > 0 ? Math.ceil(remainingCans / dailyCans) : null
  const kibbleDays = dailyKibble > 0 ? Math.ceil(remainingKibble / dailyKibble) : null
  const petName = pet ? pet.name : '毛孩子'
  const alerts = []

  if (dailyCans > 0 && canDays !== null && canDays <= LOW_STOCK_DAYS) {
    alerts.push({
      id: `${record.id}-cans`,
      petId: record.petId,
      petName,
      item: '罐头',
      days: canDays,
      tone: canDays <= 0 ? 'overdue' : 'soon',
      title: `${petName} · 罐头库存${canDays <= 0 ? '已耗尽' : '即将耗尽'}`,
      detail: canDays <= 0 ? '预计罐头已用完，记得补货' : `预计还能吃 ${canDays} 天`
    })
  }
  if (dailyKibble > 0 && kibbleDays !== null && kibbleDays <= LOW_STOCK_DAYS) {
    alerts.push({
      id: `${record.id}-kibble`,
      petId: record.petId,
      petName,
      item: '猫粮',
      days: kibbleDays,
      tone: kibbleDays <= 0 ? 'overdue' : 'soon',
      title: `${petName} · 猫粮库存${kibbleDays <= 0 ? '已耗尽' : '即将耗尽'}`,
      detail: kibbleDays <= 0 ? '预计猫粮已用完，记得补货' : `预计还能吃 ${kibbleDays} 天`
    })
  }

  return Object.assign({}, record, {
    petName,
    elapsedDays,
    dailyCans,
    dailyKibble,
    remainingCans,
    remainingKibble,
    canDays,
    kibbleDays,
    alerts,
    stockText: `罐头 ${remainingCans} 个 · 猫粮 ${remainingKibble}g`
  })
}

function getStockAlerts() {
  const alerts = []
  getInventories().forEach(record => {
    const inventory = decorateInventory(record)
    if (!inventory) return
    inventory.alerts.forEach(alert => alerts.push(alert))
  })
  return alerts.sort((a, b) => a.days - b.days)
}

function saveInventoryPurchase(data) {
  const list = getInventories()
  const index = list.findIndex(item => item.petId === data.petId)
  const current = index >= 0 ? decorateInventory(list[index]) : null
  const record = {
    id: current ? current.id : genId(),
    petId: data.petId,
    cans: round1((current ? current.remainingCans : 0) + toNumber(data.cans)),
    kibble: round1((current ? current.remainingKibble : 0) + toNumber(data.kibble)),
    dailyCans: toNumber(data.dailyCans),
    dailyKibble: toNumber(data.dailyKibble),
    updatedAt: dateUtil.today(),
    createdAt: current ? current.createdAt : Date.now()
  }
  if (index >= 0) list[index] = record
  else list.push(record)
  write(INVENTORY_KEY, list)
  return decorateInventory(record)
}

function decoratePet(pet, events) {
  const species = speciesOf(pet.species)
  const gender = genderOf(pet.gender)
  const next = dateUtil.nextBirthday(pet.birthday)
  const petEvents = (events || getEvents()).filter(event => event.petId === pet.id)
  const neuteredLabel = pet.neutered === 'yes' ? '已绝育' : (pet.neutered === 'no' ? '未绝育' : '未填写')
  return Object.assign({}, pet, {
    speciesLabel: species.name,
    speciesIcon: species.icon,
    avatarBg: species.bg,
    genderIcon: pet.gender === 'unknown' ? '' : gender.icon,
    genderLabel: gender.name,
    ageText: dateUtil.ageText(pet.birthday),
    birthdayText: dateUtil.fullDateLabel(pet.birthday),
    birthdayDays: next ? next.days : null,
    birthdayAge: next ? next.age : 0,
    birthdayLabel: next ? (next.days === 0 ? '今天过生日' : `距生日 ${next.days} 天`) : '未填写生日',
    pendingCount: petEvents.filter(event => !event.done).length,
    eventCount: petEvents.length,
    weightText: pet.weight ? `${pet.weight}${pet.weightUnit || 'kg'}` : '未填写',
    neuteredLabel,
    adoptedText: pet.adoptedAt ? dateUtil.fullDateLabel(pet.adoptedAt) : '未填写',
    allergyText: pet.allergy || ''
  })
}

function decorateEvent(event) {
  const type = typeOf(event.type)
  const targetDate = event.nextDate || event.date || ''
  const days = dateUtil.diffDays(targetDate)
  let statusText = '待安排'
  let statusTone = 'muted'
  if (event.done) {
    statusText = '已完成'
    statusTone = 'done'
  } else if (days !== null) {
    if (days < 0) {
      statusText = `逾期 ${-days} 天`
      statusTone = 'overdue'
    } else if (days === 0) {
      statusText = '就在今天'
      statusTone = 'today'
    } else {
      statusText = `还有 ${days} 天`
      statusTone = days <= 7 ? 'soon' : 'normal'
    }
  }
  return Object.assign({}, event, {
    typeName: type.name,
    typeIcon: type.icon,
    typeColor: type.color,
    typeBg: type.bg,
    typeDaily: !!type.daily,
    valueLabel: type.valueLabel,
    valueUnit: type.unit,
    amountText: event.amount ? String(event.amount) : '',
    targetDate,
    targetDays: days,
    dateText: dateUtil.dateLabel(event.date),
    fullDateText: dateUtil.fullDateLabel(event.date),
    dateWeekday: dateUtil.weekday(event.date),
    nextDateText: event.nextDate ? dateUtil.fullDateLabel(event.nextDate) : '',
    targetDateText: targetDate ? dateUtil.dateLabel(targetDate) : '',
    statusText,
    statusTone
  })
}

function getDueEvents(list) {
  return (list || getEvents())
    .map(event => decorateEvent(event))
    .filter(event => !event.done && event.targetDate && event.targetDays !== null && event.targetDays <= 0)
    .sort((a, b) => (a.targetDate || '') < (b.targetDate || '') ? -1 : 1)
}

function getEventsOnDate(date, list) {
  return (list || getEvents())
    .map(event => decorateEvent(event))
    .filter(event => event.targetDate === date)
    .sort((a, b) => (a.done === b.done) ? 0 : (a.done ? 1 : -1))
}

module.exports = {
  SPECIES,
  GENDERS,
  EVENT_TYPES,
  AVATARS,
  SPRITE_KEYS,
  genId,
  speciesOf,
  genderOf,
  typeOf,
  spriteKeyFor,
  spritePaths,
  spriteFor,
  getPets,
  getPet,
  savePet,
  removePet,
  getEvents,
  getEvent,
  getEventsByPet,
  saveEvent,
  toggleEvent,
  removeEvent,
  getInventories,
  getInventory,
  decorateInventory,
  getStockAlerts,
  saveInventoryPurchase,
  decoratePet,
  decorateEvent,
  getDueEvents,
  getEventsOnDate
}
