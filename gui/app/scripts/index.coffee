console.log('hey')
io = require('socket.io-client')

socket = io.connect('http://194.47.154.230:8080')

socket.on 'news', (data) ->
  console.log(data)
