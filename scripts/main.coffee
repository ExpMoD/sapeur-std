Random = (min, max) ->
	Math.round(Math.random() * (max - min) + min)

settings =
	sizeX: 30
	sizeY: 16
	mines: 99
	zoom: 100


difficulty =
	beginner:
		sizeY: 9
		sizeX: 9
		mines: 10
	lover:
		sizeY: 16
		sizeX: 16
		mines: 40
	expert:
		sizeY: 16
		sizeX: 30
		mines: 99


class Vector2
	constructor: (@x, @y) ->

class Game
	constructor: ->
		@gameScreen = $ '#game-screen'

		@gameStarted = false
		@flaggedCells = []
		@loadSettings()

		@generateMap()

	loadSettings: (InputSettings = {}) ->
		if settings?
			@sizeX = InputSettings.sizeX or settings.sizeX
			@sizeY = InputSettings.sizeY or settings.sizeY
			@mines = InputSettings.mines or settings.mines
			@zoom = InputSettings.zoom or settings.zoom


			if @sizeX < 8 then @sizeX = 8
			if @sizeY < 5 then @sizeY = 5

			if @mines > (@sizeX * @sizeY) then @mines = @sizeX * @sizeY

			@resizeBorder()
			return true
		return false

	generateMap: (excluding = new Vector2(-1,-1), callback = ->) ->
		@destroy()
		generatingMap = []


		if @sizeX? and @sizeY? and @mines?
			halfCells = (@sizeX * @sizeY)/2
			trueGen = if @mines < halfCells then yes else no

			neededCells = if trueGen then @mines else (@sizeX * @sizeY)-@mines

			for mY in [0...@sizeY]
				lineMap = []
				for mX in [0...@sizeX]
					lineMap.push(!trueGen)
				generatingMap.push(lineMap)

			if excluding?
				if excluding.x? and excluding.y?
					for mines in [0...neededCells]
						placed = false
						until placed
							pY = Random(0, @sizeY - 1)
							pX = Random(0, @sizeX - 1)
							if pX isnt excluding.x and pY isnt excluding.y
								if generatingMap[pY][pX] is !trueGen
									generatingMap[pY][pX] = trueGen
									placed = true

					@map = generatingMap.slice(0);
					callback?(@)
					@renderingMap()
					return true
		false

	resizeBorder: ->
		$('#zoom').removeClassWild('zoom-*').addClass("zoom-#{@zoom}")

		CellSize = new Vector2(16 * (@zoom / 100), 16 * (@zoom / 100))
		BorderTBSize = new Vector2(16 * (@zoom / 100), 10 * (@zoom / 100))
		CornerSize = new Vector2(10 * (@zoom / 100), 10 * (@zoom / 100))
		BorderLRLong = new Vector2(15 * (@zoom / 100), 36 * (@zoom / 100))
		NumbsSize = new Vector2(13 * (@zoom / 100), 23 * (@zoom / 100))
		BorderLR = new Vector2(10 * (@zoom / 100), 16 * (@zoom / 100))

		widthScreen = (CellSize.x * @sizeX) + (CornerSize.x * 2)
		#heightScreen = (CellSize.y * @sizeY) + (CornerSize.y * 3) + BorderLRLong.y

		@faceMargin = (widthScreen - ((6 * @zoom / 100) * 2 + (Math.ceil(NumbsSize.x) * 6) + (Math.ceil(BorderLR.x) * 2) + (26 * @zoom / 100))) / 2;


		@gameScreen.width(widthScreen)
		#@gameScreen.height(heightScreen)

		if $('#face').length
			$('#face').css(
				"margin-left": @faceMargin
				"margin-right": @faceMargin
			)

	renderingMap: () ->
		@gameScreen.html('')

		htmlCode = '';

		iconGen = (iconName) ->
			htmlCode += "<div class='icon icon-#{iconName}'></div>"

		iconNumbGen = (timeName, iconName) ->
			htmlCode += "<div id='#{timeName}' class='icon icon-#{iconName}'></div>"


		iconGen('bordertl')
		for i in [0...@sizeX]
			iconGen('bordertb')
		iconGen('bordertr')

		iconGen('borderlrlong')
		iconNumbGen('mines-hundreds', 'numb-0')
		iconNumbGen('mines-tens', 'numb-0')
		iconNumbGen('mines-ones', 'numb-0')

		htmlCode += "<div id='face' class='icon icon-facesmile' style='margin-left: #{@faceMargin}px; margin-right: #{@faceMargin}px;'></div>"

		iconNumbGen('seconds-hundreds', 'numb-0')
		iconNumbGen('seconds-tens', 'numb-0')
		iconNumbGen('seconds-ones', 'numb-0')
		iconGen('borderlrlong')

		iconGen('border-jointl')
		for i in [0...@sizeX]
			iconGen('bordertb')
		iconGen('border-jointr')


		for row, rowIn in @map
			iconGen('borderlr')
			for col, colIn in row
				htmlCode += "<div id='#{rowIn},#{colIn}' class='icon clickable icon-blank' data-row='#{rowIn}' data-col='#{colIn}'></div>";
			iconGen('borderlr')


		iconGen('borderbl')
		for i in [0...@sizeX]
			iconGen('bordertb')
		iconGen('borderbr')

		htmlCode += "<div class='clear-fix'></div>"

		@gameScreen.html(htmlCode)

		@setMinesAndTimes('mines', @mines)
		@registrationEvents()

	registrationEvents: () ->
		clickable = $('.clickable')
		face = $('#face')

		_this = @

		isClickableDown = false
		isFaceDown = false

		$(document).on 'mouseup', (e) ->
			if isClickableDown
				isClickableDown = false
				if(face.hasClass('icon-faceooh'))
					face.iconToggle('icon-facesmile');

			if isFaceDown
				if(face.hasClass('icon-facepressed'))
					face.iconToggle('icon-facesmile')
				isFaceDown = false


		clickable.on 'mouseenter', (e) ->
			if isClickableDown and $(@).hasClass('icon-blank')
				$(@).iconToggle('icon-blank-pressed')

		clickable.on 'mouseleave', (e) ->
			if isClickableDown and ($(@).hasClass('icon-blank') or $(@).hasClass('icon-blank-pressed'))
				$(@).iconToggle('icon-blank')

		clickable.on 'mousedown', (e) ->
			if $(@).hasClass('icon-blank')
				if(e.button == 0)
					$(@).iconToggle('icon-blank-pressed')
					face.iconToggle('icon-faceooh')
					isClickableDown = true

		clickable.on 'mouseup', (e) ->
			if ($(@).hasClass('icon-blank') or $(@).hasClass('icon-blank-pressed') or $(@).hasClass("icon-bombflagged"))
				selRow = $(@).attr('data-row')
				selCol = $(@).attr('data-col')

				if e.button == 0
					_this.openCell(selRow, selCol)
				else if e.button == 2
					_this.setFlag(new Vector2(selCol, selRow))


		face.on 'mouseenter', (e) ->
			if isFaceDown
				$(@).iconToggle('icon-facepressed')

		face.on 'mouseleave', (e) ->
			if isFaceDown
				$(@).iconToggle('icon-facesmile')

		face.on 'mousedown', (e) ->
			isFaceDown = true
			$(@).iconToggle('icon-facepressed')

		face.on 'mouseup', (e) ->
			_this.restartGame()

	openCell: (Py, Px) ->
		if !@gameStarted
			#if @map[Py][Px] then @generateMap(new Vector2(Px, Py), ((__this) -> __this.openCell(Py, Px)))
			#else
			@gameStarted = true
			@startTimer()
			@openCell(Py, Px)
		else
			if @map[Py][Px]
				@loseGame(new Vector2(Px, Py))
				return

			@checkCell(Py, Px)
			@checkWin()

	setMinesAndTimes: (type, number) ->
		strNumb = number.toString()
		countNumbs = strNumb.length
		arrayNumbs = []

		for i in [0...countNumbs]
			arrayNumbs.push(Number(strNumb[i]))

		for numb, index in arrayNumbs.reverse()
			if number >= 0
				$("##{type}-ones").iconToggle("icon-numb-#{numb}") if index == 0
				$("##{type}-tens").iconToggle("icon-numb-#{numb}") if index == 1
				$("##{type}-hundreds").iconToggle("icon-numb-#{numb}") if index == 2
			else if number < 0
				$("##{type}-ones").iconToggle("icon-numb-#{numb}") if index == 0
				$("##{type}-tens").iconToggle("icon-numb-#{numb}") if index == 1
				$("##{type}-hundreds").iconToggle("icon-numb-minus");

	checkCell: (Py, Px) ->
		aroundMines = 0

		aroundCells = [
			{y: Number(Py) - 1, x: Number(Px) - 1}, {y: Number(Py) - 1, x: Number(Px)},
			{y: Number(Py) - 1, x: Number(Px) + 1}, {y: Number(Py), x: Number(Px) + 1},
			{y: Number(Py) + 1, x: Number(Px) + 1}, {y: Number(Py) + 1, x: Number(Px)},
			{y: Number(Py) + 1, x: Number(Px) - 1}, {y: Number(Py), x: Number(Px) - 1}
		];

		for item in aroundCells
			if 0 <= item.x < @sizeX and 0 <= item.y < @sizeY
				if @map[item.y][item.x]
					aroundMines++

		curCell = $("[id='#{Py},#{Px}']")

		if aroundMines
			if not curCell.hasClass("icon-open-#{aroundMines}")
				curCell.iconToggle("icon-open-#{aroundMines}")
		else if not curCell.hasClass("icon-open-#{aroundMines}")
			curCell.iconToggle("icon-open-0")
			@openNeighbors(Py, Px)

	openNeighbors: (Py, Px) ->
		aroundCells = [
			{y: Number(Py) - 1, x: Number(Px) - 1}, {y: Number(Py) - 1, x: Number(Px)},
			{y: Number(Py) - 1, x: Number(Px) + 1}, {y: Number(Py), x: Number(Px) + 1},
			{y: Number(Py) + 1, x: Number(Px) + 1}, {y: Number(Py) + 1, x: Number(Px)},
			{y: Number(Py) + 1, x: Number(Px) - 1}, {y: Number(Py), x: Number(Px) - 1}
		];

		for item in aroundCells
			if 0 <= item.x < @sizeX and 0 <= item.y < @sizeY
				if not $("[id='#{item.y},#{item.x}']").hasClass('icon-bombflagged')
					if not @map[item.y][item.x]
						@checkCell(item.y, item.x)

	setFlag: (vector) ->
		isFlagged = false
		FlaggedIndex = -1
		for item, index in @flaggedCells
			if item.x == vector.x and item.y == vector.y
				isFlagged = true
				FlaggedIndex = index

		element = $("[id='#{vector.y},#{vector.x}']");
		if isFlagged
			@flaggedCells.splice(FlaggedIndex, 1)
			element.iconToggle("icon-blank")
		else
			@flaggedCells.push(vector)
			element.iconToggle("icon-bombflagged")

		@setMinesAndTimes('mines', @mines - @flaggedCells.length)

	checkWin: () ->
		isWin = true
		_this = @
		searchElems = $('.icon-blank,.icon-bombflagged')
		searchElems.each (index) ->
			row = $(@).attr("data-row")
			col = $(@).attr("data-col")
			if not _this.map[row][col]
				isWin = false
		if isWin
			searchElems.each () ->
				$(@).iconToggle('icon-bombflagged')
			@setMinesAndTimes('mines', 0)
			@winGame()

	winGame: () ->
		$('#face').iconToggle('icon-facewin')
		@openMap()

	loseGame: (loseVector) ->
		$('#face').iconToggle('icon-facedead')
		@openMap(loseVector)

	openMap: (loseVector = false) ->
		_this = @
		clickable = $('.clickable')
		clickable.each () ->
			row = $(@).attr("data-row")
			col = $(@).attr("data-col")

			if _this.map[row][col]
				if $(@).hasClass('icon-bombflagged')
					$(@).iconToggle('icon-bombflagged')
				else
					$(@).iconToggle('icon-bombrevealed')

				if not not loseVector
					if row == loseVector.y and col == loseVector.x
						$(@).iconToggle('icon-bombdeath')
			else
				if $(@).hasClass('icon-bombflagged')
					$(@).iconToggle('icon-bombmisflagged')

		@destroy()

	startTimer: ->
		@timerNumb = 1
		@setMinesAndTimes("seconds", @timerNumb)
		timerFn = =>
			if @gameStarted
				@timerNumb += 1
				@setMinesAndTimes("seconds", @timerNumb)
			else
				clearInterval @timer

		@timer = setInterval timerFn, 1000
		return

	restartGame: ->
		@flaggedCells = []
		@destroy()
		@generateMap()

	destroy: ->
		@gameStarted = false
		$('.clickable').unbind('mouseenter').unbind('mouseleave').unbind('mousedown').unbind('mouseup');
		clearInterval @timer


game = new Game();


#settingsModal = new popup_exp('#settingsModal')
#displayModal = new popup_exp('#displayModal')

#settingsModal.open()
#displayModal.open()

$('a.toggle-settings').click () ->
	$('#settingsModal').simplePopup()

$('a.toggle-display').click () ->
	$('#displayModal').simplePopup()

$('a.toggle-rules').click () ->
	$('#rulesModal').simplePopup()


$('#load-new-settings').click () ->
	if $('#dif-level-beginner').is(":checked")
		game.loadSettings difficulty.beginner
		game.generateMap()
	else if $('#dif-level-lover').is(":checked")
		game.loadSettings difficulty.lover
		game.generateMap()
	else if $('#dif-level-expert').is(":checked")
		game.loadSettings difficulty.expert
		game.generateMap()
	else if $('#dif-level-special').is(":checked")
		specialDif =
			sizeY: Number($('#special-height').val()) or 20
			sizeX: Number($('#special-width').val()) or 40
			mines: Number($('#special-mines').val()) or 145

		game.loadSettings specialDif
		game.generateMap()

$('[name=zoom]').change () ->
	if @value == "100" or @value == "150" or @value == "200"
		game.loadSettings {zoom: Number(@value)}


$('#special-height, #special-width, #special-mines').focus () ->
	$('#dif-level-special').prop 'checked', true

#game.loadSettings({sizeY: 5, sizeX: 5})