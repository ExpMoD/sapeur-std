$.fn.extend
	removeClassWild: (mask) ->
		return @.removeClass((index, cls) ->
			re = mask.replace(/\*/g, '\\S+')
			return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ')
		)

	iconToggle: (newClass) ->
		$(@).removeClassWild('icon-*')
		$(@).addClass(newClass)
