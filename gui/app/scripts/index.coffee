console.log('hey')
_ = require('lodash')
io = require('socket.io-client')
fs = require('fs')
chooseCharacterTmpl = fs.readFileSync(__dirname + '/templates/choose-character.html')

socket = io.connect('http://194.47.154.230:8080')

socket.on 'give-me-characters', (data) ->
  characters = data.characters
  sessionId = data.sessionId
  $('body').html(_.template(chooseCharacterTmpl, {characters: characters}))
  $('.character-selection .character-btn').on 'click', ->
    myCharacterId = $(this).val()
    myCharacter = _.find characters, ((obj) -> return obj.id is myCharacterId)
    socket.emit 'i-chose-character', {character: myCharacter}


socket.on 'new-game-id', (gameId) ->

