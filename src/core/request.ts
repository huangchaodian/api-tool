/// <reference types="chrome"/>
export function getTreeData(requests: MyRequest[]): MyTree[] {
  console.log(requests)
  const tree: MyTree[] = []
  for (const i in requests) {
    const r = requests[i]
    const url = new URL(r.url)
    const host = url.host
    const uri = url.pathname

    if (!tree.map((e) => e.label).includes(host)) {
      tree.push({
        label: host,
        children: []
      })
    }
    const paths = uri.split('/').slice(1)
    let children = tree.find((e) => e.label === host)?.children || []
    for (const j in paths) {
      const path = paths[j]
      if (parseInt(j) === paths.length - 1) {
        children.push({
          id: i,
          label: path
        })
      } else if (!children.map((e) => e.label).includes(path)) {
        children.push({
          label: path,
          children: []
        })
      }
      children = children.find((e) => e.label === path).children
    }
  }
  return tree
}

export function onMessage(requests: MyRequest[]) {
  chrome.runtime &&
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      //(request, sender, sendResponse)
      const e = request.data
      if (e.type !== 'xhr') return
      const urlStr = e.url.replace(/^\/\//, e.protocol + '//')
      const item: MyRequest = {
        url: urlStr,
        method: e.method,
        requestBody: e.requestData,
        responseBody: e.responseData
      }
      requests.push(item)
      setTimeout(function () {
        sendResponse(true)
      }, 1)
      return true
    })
}
export function replay(request: MyRequest) {
  let config = {
    method: request.method,
    headers: {},
    body: request.requestBody
  }
  if (request.method === 'POST') {
    config = {
      ...config,
      headers: {
        'Content-Type': 'application/json;'
      }
    }
  }
  fetch(request.url, config)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
    .catch((error) => console.error(error))
}
