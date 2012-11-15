###
PHM.sound module

How it works:

1. Put WAV soundfile into app/sounds (say app/sounds/poker/fun_sound_effect.wav)
2. Run rake sounds:compile (you must have Lame and Oggenc installed)
3. Call PHM.sound.init() on page load
4. Call PHM.sound.play('poker/fun_sound_effect') when you need it

###
(->
  exports = this
  self = exports.PHM.sound = {}
  self.skipAll = false

  self.effects = {}

  self.addEffect = (effectName, url) ->
    self.effects[effectName] = new buzz.sound(url, {formats: ['mp3', 'ogg'], preload: true})

  self.init = () ->
    _(self.catalog).each (url, name) ->
      self.addEffect(name, url)

  self.play = (effectName) ->
    return if self.skipAll
    self.effects[effectName].play()

  self.toggleMute = (state) ->
    if arguments.length==0
      _(self.effects).each (sound) ->
        sound.toggleMute()
    else if state
      _(self.effects).each (sound) ->
        sound.mute()
    else
      _(self.effects).each (sound) ->
        sound.unmute()
)()
