console.log('hey')
_ = require('lodash')
$ = require('jquery')
io = require('socket.io-client')
fs = require('fs')
chooseCharacterTmpl = fs.readFileSync(__dirname + '/templates/choose-character.html')

$app = $('#app')

socket = io.connect('http://194.47.154.230:8080')

socket.on 'give-me-characters', (data) ->
  characters = data.characters
  sessionId = data.sessionId
  $app.html(_.template(chooseCharacterTmpl, {characters: characters}))
  $('.character-selection .character-btn').on 'click', ->
    myCharacterId = $(this).val()
    myCharacter = _.find characters, ((obj) -> return obj.id is myCharacterId)
    socket.emit 'i-chose-character', {character: myCharacter}


socket.on 'new-game-id', (gameId) ->
