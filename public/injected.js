;(function (XMLHttpRequest) {
  var XHR = XMLHttpRequest.prototype

  var open = XHR.open
  var send = XHR.send
  var setRequestHeader = XHR.setRequestHeader

  XHR.setRequestHeader = function (header, value) {
    if (!this._headers) {
      this._headers = {}
    }
    this._headers[header] = value
    return setRequestHeader.apply(this, arguments)
  }

  XHR.open = function (method, url) {
    this._method = method
    this._url = url
    return open.apply(this, arguments)
  }

  XHR.send = function (postData) {
    // console.log('injected script xhr request:', this._method, this._url, this.getAllResponseHeaders(), postData);
    this.addEventListener('load', function () {
      var url = this._url
      if (url.substr(0, 2) === '//') {
        url = window.location.protocol + url
      } else if (url.substr(0, 1) === '/') {
        url = window.location.protocol + '//' + window.location.host + url
      }
      var message = {
        type: 'xhr',
        method: this._method,
        url: url,
        headers: this._headers,
        requestData: postData,
        responseData: this.response
      }
      try {
        window.postMessage(message, '*') // send to content script
      } catch (e) {
        // console.log(e)
      }
      // console.log(message)
    })
    return send.apply(this, arguments)
  }
})(XMLHttpRequest)

const { fetch: origFetch } = window
window.fetch = async (...args) => {
  const response = await origFetch(...args)
  //   console.log('injected script fetch request:', args)
  var url = args[0]
  if (url.substr(0, 2) === '//') {
    url = window.location.protocol + url
  } else if (url.substr(0, 1) === '/') {
    url = window.location.protocol + '//' + window.location.host + url
  }
  var method = 'GET'
  if (args.length >= 1 && args[1] && args[1].method) {
    method = args[1].method
  }
  var body = null
  if (args.length >= 1 && args[1] && args[1].body) {
    body = args[1].body
  }
  var headers = null
  if (args.length >= 1 && args[1] && args[1].headers) {
    headers = args[1].headers
  }

  response
    .clone()
    .text()
    // .blob() // maybe json(), text(), blob()
    .then((data) => {
      var message = {
        type: 'fetch',
        method: method,
        url: url,
        headers: headers,
        requestData: body,
        responseData: data
      }
      try {
        window.postMessage(message, '*') // send to content script
      } catch (e) {
        // console.log(e)
      }
      //window.postMessage({ type: 'fetch', data: URL.createObjectURL(data) }, '*'); // if a big media file, can createObjectURL before send to content script
    })
    .catch((err) => console.error(err))
  return response
}
