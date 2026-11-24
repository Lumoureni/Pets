const FALLBACK_STATUS_BAR = 20
const FALLBACK_MENU_HEIGHT = 32
const FALLBACK_MENU_WIDTH = 95

function getWindowInfo() {
  if (typeof wx.getWindowInfo === 'function') return wx.getWindowInfo() || {}
  if (typeof wx.getSystemInfoSync === 'function') return wx.getSystemInfoSync() || {}
  return {}
}

function getDeviceInfo() {
  if (typeof wx.getDeviceInfo === 'function') return wx.getDeviceInfo() || {}
  return getWindowInfo()
}

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    logo: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    },
    homeButton: {
      type: Boolean,
      value: false
    },
    animated: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: true,
      observer: '_showChange'
    },
    delta: {
      type: Number,
      value: 1
    }
  },
  data: {
    displayStyle: '',
    ios: true,
    barStyle: '',
    contentStyle: ''
  },
  lifetimes: {
    attached() {
      this.updateLayout()
    }
  },
  methods: {
    updateLayout() {
      const info = getWindowInfo()
      const device = getDeviceInfo()
      const platform = device.platform || info.platform || 'devtools'
      const windowWidth = info.windowWidth || 375
      const safeTop = (info.safeArea && info.safeArea.top) || 0
      const statusBarHeight = info.statusBarHeight || safeTop || FALLBACK_STATUS_BAR

      let menu = null
      if (typeof wx.getMenuButtonBoundingClientRect === 'function') {
        const rect = wx.getMenuButtonBoundingClientRect()
        if (rect && rect.width > 0 && rect.height > 0 && rect.left > 0) {
          menu = rect
        }
      }
      if (!menu) {
        menu = {
          top: statusBarHeight + 6,
          height: FALLBACK_MENU_HEIGHT,
          left: Math.max(0, windowWidth - FALLBACK_MENU_WIDTH),
          width: FALLBACK_MENU_WIDTH - 8
        }
      }

      const menuGap = Math.max(4, menu.top - statusBarHeight)
      const barHeight = menu.height + menuGap * 2
      const menuWidth = Math.max(0, windowWidth - menu.left)

      this.setData({
        ios: platform !== 'android',
        barStyle: `height:${statusBarHeight + barHeight}px;padding-top:${statusBarHeight}px;padding-right:${menuWidth}px;`,
        contentStyle: `height:${barHeight}px;`
      })
    },
    _showChange(show) {
      const displayStyle = this.data.animated
        ? `opacity:${show ? 1 : 0};transition:opacity 0.3s;`
        : `display:${show ? 'block' : 'none'};`
      this.setData({ displayStyle })
    },
    back() {
      const { delta } = this.data
      if (delta) {
        wx.navigateBack({ delta })
      }
      this.triggerEvent('back', { delta }, {})
    },
    home() {
      wx.switchTab({ url: '/pages/index/index' })
      this.triggerEvent('home', {}, {})
    }
  }
})
