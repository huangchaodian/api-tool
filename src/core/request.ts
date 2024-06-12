/// <reference types="chrome"/>
export function getTreeData(requests: MyRequest[]): MyTree[] {
  // console.log(requests)
  const tree: MyTree[] = []
  let nodeSeq = 1
  for (const i in requests) {
    const r = requests[i]
    const url = new URL(r.url)
    const host = url.host
    const uri = url.pathname

    if (!tree.map((e) => e.label).includes(host)) {
      tree.push({
        _seq: nodeSeq++,
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
          _seq: nodeSeq++,
          id: parseInt(i),
          label: path
        })
      } else if (!children.map((e) => e.label).includes(path)) {
        children.push({
          _seq: nodeSeq++,
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
      if (e.type !== 'xhr' && e.type !== 'fetch') return
      console.log(e)
      const urlStr = e.url.replace(/^\/\//, e.protocol + '//')
      const item: MyRequest = {
        url: urlStr,
        method: e.method,
        requestBody: e.requestData,
        responseBody: e.responseData
      }
      console.log(item)
      requests.push(item)
      setTimeout(function () {
        sendResponse(true)
      }, 1)
      return true
    })
}
export async function replay(request: MyRequest) {
  const config = {
    method: request.method,
    headers: {},
    body: request.requestBody
  }
  if (request.method === 'POST') {
    config.headers = {
      'Content-Type': 'application/json;'
    }
    config.body = request.requestBody
  }
  console.log(request, config)
  const response = await fetch(request.url, config)
  // if (response.ok) {
  //   return 'An error has occured:' + response.status
  // }
  const data = await response.text()
  return data
}
