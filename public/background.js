// 获取当前选项卡index
function getCurrentTabIndex(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (callback) callback(tabs.length ? tabs[0].index : null)
  })
}

// 下个标签打开某个连接
function openUrlNextTab({ url }) {
  getCurrentTabIndex((index) => {
    chrome.tabs.create({ index: index + 1, url })
  })
}

// browser_action click event
chrome.browserAction.onClicked.addListener(() => {
  const url = 'https://nfeng.net.cn'
  openUrlNextTab({ url })
})

// -------------------- 右键菜单 ------------------------//

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (callback) callback(tabs.length ? tabs[0].id : null)
  })
}

// 关闭当前标签
function closeIndexTab() {
  getCurrentTabId((tabId) => {
    if (tabId) {
      chrome.tabs.remove(tabId)
    }
  })
}

// 关闭当前标签
chrome.contextMenus.create({
  title: 'Close current tab',
  onclick() {
    closeIndexTab()
  },
})

chrome.contextMenus.create({
  title: '使用度娘搜索“%s”', // %s表示选中的文字
  contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
  onclick(params) {
    // 注意不能使用location.href，因为location是属于background的window对象
    openUrlNextTab({ url: `https://www.baidu.com/s?ie=utf-8&wd=${encodeURI(params.selectionText)}` })
  },
})

chrome.contextMenus.create({
  title: '使用度娘翻译“%s”', // %s表示选中的文字
  contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
  onclick(params) {
    const value = params.selectionText
    if (/^[A-Za-z]+$/.test(value)) {
      openUrlNextTab(`https://fanyi.baidu.com/?#en/zh/${value}`)
    }
    if (/^[\u4e00-\u9fa5]+$/.test(value)) {
      openUrlNextTab(`https://fanyi.baidu.com/?#zh/en/${value}`)
    }
  },
})

// popup或者bg向content主动发送消息
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      if (callback) callback(response)
    })
  })
}

chrome.contextMenus.create({
  title: 'Collect pictures',
  contexts: ['image'],
  onclick(params) {
    const url = params.srcUrl
    if (/^http.*(gif|png|jpe?g)/.test(url)) {
      sendMessageToContentScript({ cmd: 'Collect pictures', url })
    } else {
      sendMessageToContentScript({ cmd: 'message', msg: '抱歉，这不是常见的图片类型' })
    }
  },
})

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log('收到来自content-script的消息：')
  // console.log(request, sender, sendResponse)
  sendResponse(`我是后台，我已收到你的消息：${JSON.stringify(request)}`)
  if (request.cmd === 'img add') {
    const requestUrl = 'https://nfeng.net.cn'
    const name = 'Nfeng-Token'
    chrome.cookies.get({ name, url: requestUrl }, (cookies) => {
      const { tag, url } = request
      const data = { tag, url, cookies: cookies.value }
      $.ajax({
        type: 'get',
        url: `${requestUrl}/api/img/add`,
        data,
        success: ({ code, msg }) => {
          if (code === 200) {
            sendMessageToContentScript({ cmd: 'message', type: 'success', msg })
          } else {
            sendMessageToContentScript({ cmd: 'message', msg })
          }
        },
      })
    })
  }
})
