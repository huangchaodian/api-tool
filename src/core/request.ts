/// <reference types="chrome"/>
export interface MyTree {
  _seq?: number
  id?: number
  typ: string
  label: string
  children?: MyTree[]
}
export interface MyRequest {
  url: string
  method: string
  headers?: [string, string][]
  requestBody?: string
  responseContentType?: string
  responseBody?: string
}

export function getTreeData(requests: MyRequest[]): MyTree[] {
  // console.log(requests)
  const tree: MyTree[] = []
  let nodeSeq = 1
  for (const i in requests) {
    try {
      const r = requests[i]

      let url = new URL(r.url)
      let host = url.host
      if (url.protocol === 'blob:') {
        url = new URL(r.url.replace('blob:', ''))
        host = 'blob:' + url.host
      }
      const search = url.search
      let uri = url.pathname
      if (uri.substr(0, 1) !== '/') {
        uri = '/' + uri
      }

      let hostNode = tree.find((e) => e.label === host)
      if (!hostNode) {
        hostNode = {
          _seq: nodeSeq++,
          label: host,
          typ: 'host',
          children: []
        }
        tree.push(hostNode)
      }

      const paths = uri.split('/').slice(1)
      let children = hostNode.children || []
      for (const j in paths) {
        const path = paths[j]
        let node: MyTree | undefined
        if (parseInt(j) === paths.length - 1) {
          node = {
            _seq: nodeSeq++,
            id: parseInt(i),
            label: path + search || '/',
            typ: 'param'
          }
          children.push(node)
          continue
        } else {
          node = children.find((e) => e.label === path && e.typ === 'path')
          if (!node) {
            node = {
              _seq: nodeSeq++,
              label: path,
              typ: 'path',
              children: []
            }
            children.splice(children.filter((e) => e.id === undefined).length, 0, node)
          }
          children = node.children || []
        }
      }
    } catch (e) {
      console.log(requests[i], e)
    }
  }
  return tree
}

function loadHistoryMessage(requests: MyRequest[]) {
  if (chrome.runtime) {
    chrome.runtime.sendMessage({ data: { type: 'loadAllRequests' } }, function (response) {
      requests.unshift(...response.data)
    })
  } else {
    window.addEventListener('message', function (event) {
      if (event.data.type === 'loadAllRequestsResult') {
        requests.unshift(...event.data.data)
      }
    })
    window.postMessage({ type: 'loadAllRequests' }, '*')
  }
}

export function clearHistoryMessage(requests: MyRequest[]) {
  console.log('clear')
  chrome.runtime &&
    chrome.runtime.sendMessage({ data: { type: 'clearAllRequests' } }, function (response) {})
}

export function onMessage(requests: MyRequest[]) {
  loadHistoryMessage(requests)
  chrome.runtime &&
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      sendResponse(true)
      //(request, sender, sendResponse)
      const e = request.data
      if (e.type !== 'xhr' && e.type !== 'fetch') return
      const item: MyRequest = {
        url: e.url,
        method: e.method,
        headers: e.headers,
        requestBody: e.requestData,
        responseContentType: e.responseContentType,
        responseBody: e.responseData
      }
      console.log(item)
      requests.push(item)
    })
}
export async function replay(request: MyRequest) {
  try {
    const config: RequestInit = {
      method: request.method,
      headers: request.headers,
      body: request.requestBody
    }
    // if (request.method === 'POST') {
    //   config.body = request.requestBody
    // }
    console.log(request, config)
    const response = await fetch(request.url, config)
    if (!response.ok) {
      return 'An error has occured:' + response.status
    }
    const data = await response.text()
    return data
  } catch (e) {
    console.log(request, e)
    return 'An error has occured:' + e
  }
}
