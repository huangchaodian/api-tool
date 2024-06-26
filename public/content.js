/// <reference types="chrome"/>
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
        data: e.data
      },
      function (response) {
        if (!chrome.runtime.lastError) {
          if (e && e.data && e.data.type === 'loadAllRequests') {
            e.source.postMessage({ type: 'loadAllRequestsResult', ...response }, e.origin)
          }
        }
      }
    )
  } catch (e) {
    // console.log(e)
  }
})
