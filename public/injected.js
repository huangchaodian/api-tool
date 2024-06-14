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
      try {
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
  try {
    var url = ''
    var method = 'GET'
    var body = null
    var headers = null

    if (Object.getPrototypeOf(args[0])[Symbol.toStringTag] === 'Request') {
      url = args[0].url
      method = args[0].method
      headers = args[0].headers
      body = args[0].body
    } else if (Object.getPrototypeOf(args[0])[Symbol.toStringTag] === 'URL') {
      url = args[0].origin
    }

    if (url.substr(0, 2) === '//') {
      url = window.location.protocol + url
    } else if (url.substr(0, 1) === '/') {
      url = window.location.protocol + '//' + window.location.host + url
    }

    if (args.length >= 1 && args[1] && args[1].method) {
      method = args[1].method
    }
    if (args.length >= 1 && args[1] && args[1].body) {
      body = args[1].body
    }
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
          headers: JSON.parse(JSON.stringify(headers)),
          requestData: body,
          responseData: data
        }
        window.postMessage(message, '*') // send to content script
        //window.postMessage({ type: 'fetch', data: URL.createObjectURL(data) }, '*'); // if a big media file, can createObjectURL before send to content script
      })
      .catch((err) => console.error(err))
  } catch (e) {
    // console.log(e, ...args)
  }
  return response
}
