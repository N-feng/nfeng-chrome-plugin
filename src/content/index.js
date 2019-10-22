import {
  Message,
  MessageBox,
} from 'element-ui'

(function insertElementIcons() {
  const elementIcons = document.createElement('style')
  elementIcons.type = 'text/css'
  elementIcons.textContent = `
      @font-face {
          font-family: "element-icons";
          src: url('${window.chrome.extension.getURL('fonts/element-icons.woff')}') format('woff'),
          url('${window.chrome.extension.getURL('fonts/element-icons.ttf ')}') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
      }
  `
  document.head.appendChild(elementIcons)
}())

// 接收来自后台的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'Collect pictures') {
    MessageBox.prompt('请输入标签', '提示').then(({ value }) => {
      chrome.runtime.sendMessage({ cmd: 'img add', tag: value, url: request.url }, (response) => {
        console.log(`收到来自后台的回复：${response}`)
      })
    })
  }
  if (request.cmd === 'message') {
    Message({
      type: request.type || 'error',
      message: request.msg,
    })
  }
  sendResponse('我收到了你的消息！')
})
