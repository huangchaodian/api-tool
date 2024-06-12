;(function (XMLHttpRequest) {
  var XHR = XMLHttpRequest.prototype

  var open = XHR.open
  var send = XHR.send

  XHR.open = function (method, url) {
    this._method = method
    this._url = url
    return open.apply(this, arguments)
  }

  XHR.send = function (postData) {
    // console.log('injected script xhr request:', this._method, this._url, this.getAllResponseHeaders(), postData);
    this.addEventListener('load', function () {
      window.postMessage(
        {
          type: 'xhr',
          method: this._method,
          url: this._url,
          requestData: postData,
          responseData: this.response
        },
        '*'
      ) // send to content script
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

  response
    .clone()
    .text()
    // .blob() // maybe json(), text(), blob()
    .then((data) => {
      window.postMessage(
        {
          type: 'fetch',
          method: method,
          url: url,
          requestData: body,
          responseData: data
        },
        '*'
      ) // send to content script
      //window.postMessage({ type: 'fetch', data: URL.createObjectURL(data) }, '*'); // if a big media file, can createObjectURL before send to content script
    })
    .catch((err) => console.error(err))
  return response
}
