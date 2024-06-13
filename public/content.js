// console.log('content script start');

// inject injected script
var s = document.createElement('script')
s.src = chrome.runtime.getURL('injected.js')
s.onload = function () {
  this.remove()
}
;(document.head || document.documentElement).appendChild(s)

// receive message from injected script
window.addEventListener('message', function (e) {
  try {
    chrome.runtime.sendMessage(
      {
        data: {
          ...e.data,
          protocol: document.location.protocol
        }
      },
      {},
      function () {
        // 收到回复后在页面弹出提醒
        // console.log(res);
        return true
      }
    )
  } catch (e) {
    // console.log(e)
  }
})
