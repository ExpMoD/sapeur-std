<!doctype html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport"
	      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Сапёр</title>


	<link rel="stylesheet" href="styles/main.css">
	<link rel="stylesheet" href="styles/icons.css">
	<link rel="stylesheet" href="libs/jquery.simple-popup.min.css">
	<link rel="stylesheet" href="libs/jquery.simple-popup.settings.css">
	<link rel="stylesheet" href="libs/jquery-ui.min.css">
	<link rel="stylesheet" href="libs/jquery-ui.structure.min.css">
	<link rel="stylesheet" href="libs/jquery-ui.theme.min.css">
	<link rel="stylesheet" href="libs/jquery-ui-slider-pips.css">


	<script type="text/javascript" src="libs/js.cookie.js"></script>
	<script type="text/javascript" src="libs/jquery.js"></script>
	<script type="text/javascript" src="libs/help.lib.js"></script>
	<script type="text/javascript" src="libs/jquery-ui.min.js"></script>
	<script type="text/javascript" src="libs/jquery-ui-slider-pips.js"></script>

	<script type="text/javascript" src="libs/jquery.simple-popup.min.js"></script>

</head>
<body>
	<div class="page">
		<div class="wrapper">
			<div class="control-buttons"><a class="toggle-settings" href="#">Настройки</a> <a class="toggle-display" href="#">Отображение</a></div>
			<div id="zoom" class="zoom-200">
				<div id="game-screen" oncontextmenu="return false;" ondrag="return false;" ondragstart="return false;">
					<div class="icon icon-open-5"></div>
					<div class="icon icon-open-5"></div>
					<div class="icon icon-open-5"></div>
					<div class="icon icon-open-5"></div>
				</div>
			</div>
		</div>
	</div>

	<div id="settingsModal" class="simplePopup">
		<div style="margin-bottom: 10px;">Высота поля:</div>
		<div id="height-game-map"></div>
		<div style="margin-bottom: 10px;">Ширина поля:</div>
		<div id="width-game-map"></div>
		<div style="margin-bottom: 10px;">Количество мин:</div>
		<div id="mines-game-map"></div>
	</div>


	<div id="displayModal" class="simplePopup">
		dispay
	</div>

	<script type="text/javascript" src="scripts/main.js"></script>
</body>
</html>