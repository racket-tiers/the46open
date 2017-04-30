const req = new XMLHttpRequest()
const url = 'https://galvanize-cors.herokuapp.com/http://quotes.stormconsultancy.co.uk/random.json'
req.open('GET', url)
req.onload = () => {
  var apiObj = JSON.parse(req.responseText)
  var quote = apiObj.quote
  var footerEl = document.querySelector('footer')
  footerEl.textContent = quote
}
req.onerror = () => {
  document.querySelector('footer').textContent = 'Api not loading.'
}
req.send()
