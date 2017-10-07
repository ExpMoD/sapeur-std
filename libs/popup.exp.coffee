class popup_exp

	constructor: (@element) ->
		@animationTime = 200

		@popup = $(@element)

		@popup.addClass('popup-exp')

		if not $('.popup-exp-fs-bg').length
			@BG = $(document.createElement('div')).addClass('popup-exp-fs-bg').appendTo('body')
		else
			@BG = $('.popup-exp-fs-bg')

	open: ->
		bgIsVisible = @BG.is(":visible")
		if bgIsVisible
			@close($(@BG.attr('popup')), false)
		else
			@BG.show()

		@BG.attr('popup', @element)

		@popup.show()
		@regEvents()

		return

	close: (curElem = @popup, hideBG = true) ->
		@BG.hide() if hideBG
		curElem.hide()

	regEvents: ->
		_this = @
		@BG.on 'click', ->
			_this.close($($(@).attr('popup')))