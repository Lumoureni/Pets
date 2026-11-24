const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`
}

function toDate(value) {
  if (!value) return null
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }
  const parts = String(value).split('-')
  if (parts.length < 3) return null
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  return isNaN(date.getTime()) ? null : date
}

function format(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function today() {
  return format(new Date())
}

function diffDays(target, base) {
  const t = toDate(target)
  const b = toDate(base || today())
  if (!t || !b) return null
  return Math.round((t.getTime() - b.getTime()) / 86400000)
}

function dateLabel(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function fullDateLabel(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function weekday(value) {
  const date = toDate(value)
  return date ? WEEKDAYS[date.getDay()] : ''
}

function ageText(birthday) {
  const birth = toDate(birthday)
  if (!birth) return '年龄未知'
  const now = toDate(today())
  if (birth.getTime() > now.getTime()) return '生日日期有误'
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (now.getDate() < birth.getDate()) months -= 1
  if (months < 0) {
    years -= 1
    months += 12
  }
  if (years <= 0) return months <= 0 ? '未满月' : `${months}个月`
  return months > 0 ? `${years}岁${months}个月` : `${years}岁`
}

function nextBirthday(birthday) {
  const birth = toDate(birthday)
  if (!birth) return null
  const now = toDate(today())
  let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
  if (next.getTime() < now.getTime()) {
    next = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate())
  }
  const dateStr = format(next)
  return {
    date: dateStr,
    days: diffDays(dateStr),
    age: next.getFullYear() - birth.getFullYear()
  }
}

function monthGrid(year, month, list) {
  const first = new Date(year, month - 1, 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(year, month - 1, 1 - offset)
  const todayStr = today()
  const events = list || []
  const cells = []
  for (let i = 0; i < 42; i++) {
    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const value = format(current)
    cells.push({
      date: value,
      day: current.getDate(),
      inMonth: current.getMonth() === month - 1,
      isToday: value === todayStr,
      count: events.filter(event => (event.targetDate || event.date) === value).length
    })
  }
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function monthLabel(year, month) {
  return `${year}年${month}月`
}

module.exports = {
  today,
  format,
  diffDays,
  dateLabel,
  fullDateLabel,
  weekday,
  ageText,
  nextBirthday,
  monthGrid,
  monthLabel
}
