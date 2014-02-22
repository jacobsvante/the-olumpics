_ = require('lodash')
$ = require('jquery')
io = require('socket.io-client')
queryString = require('query-string')
fs = require('fs')
chooseCharacterTmpl = fs.readFileSync(__dirname + '/templates/choose-character.html')

$app = $('#app')
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

socket.emit 'user.new'

socket.on 'fighter.suggestions', (fighters) ->
  console.log fighters
  # characters = data.characters
  # sessionId = data.sessionId
  # $app.html(_.template(chooseCharacterTmpl, {characters: characters}))
  # $('.character-selection .character-btn').on 'click', ->
  #   myCharacterId = $(this).val()
  #   myCharacter = _.find characters, ((obj) -> return obj.id is myCharacterId)
  #   socket.emit 'i-chose-character', {character: myCharacter}


socket.on 'new-game-id', (gameId) ->
