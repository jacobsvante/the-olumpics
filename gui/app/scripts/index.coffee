_ = require('lodash')
$ = require('jquery')
io = require('socket.io-client')
queryString = require('query-string')
fs = require('fs')
startTmpl = fs.readFileSync(__dirname + '/templates/start.html')
waitTmpl = fs.readFileSync(__dirname + '/templates/wait.html')
loadingFightersTmpl = fs.readFileSync(__dirname + '/templates/loading-fighters.html')
chooseTmpl = fs.readFileSync(__dirname + '/templates/choose-character.html')
chooseCharacterTmpl = fs.readFileSync(__dirname + '/templates/choose-character.html')

$app = $('#app')
$app.html(_.template(startTmpl))

$app.find('.action-btn').on 'click', ->
  gameUrl = 'http://127.0.0.1:8089/?game=' + gameId
  $app.html(_.template(waitTmpl, gameUrl: gameUrl))

gameId = parseInt(queryString.parse(window.location.search).game, 10)
userId = null
socket = io.connect('http://194.47.154.230:8080')

socket.on 'user.id', (uid) ->
  userId = uid
  if gameId
    socket.emit 'game.join', gameId
  else
    socket.emit 'game.new'

socket.on 'game.id', (gid) ->
  gameId = gid


socket.on 'fighter.select', ->
  socket.emit 'fighter.get_suggestions'
  $app.html(_.template(loadingFightersTmpl))

socket.emit 'user.new'

socket.on 'fighter.suggestions', (fighters) ->
  $app.html(_.template(chooseTmpl, {fighters: fighters}))
