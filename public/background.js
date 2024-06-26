chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'index.html' })
})
var allRequests = []
chrome.runtime &&
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request && request.data && request.data.type === 'loadAllRequests') {
      sendResponse({ data: allRequests })
      return
    }
    if (request && request.data && request.data.type === 'clearAllRequests') {
      allRequests = []
      sendResponse({ data: allRequests })
      return
    }
    sendResponse(true)
    const e = request.data
    if (e.type !== 'xhr' && e.type !== 'fetch') return
    const item = {
      url: e.url,
      method: e.method,
      headers: e.headers,
      requestBody: e.requestData,
      responseContentType: e.responseContentType,
      responseBody: e.responseData
    }
    console.log(item)
    if (allRequests.length > 1000) {
      //默认最多保留1000历史请求
      allRequests.pop()
    }
    allRequests.push(item)
  })
