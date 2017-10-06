// Generated by CoffeeScript 1.12.7
(function() {
  var Game, Random, Vector2, game, settings;

  Random = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  settings = {
    sizeX: 30,
    sizeY: 16,
    mines: 99,
    zoom: 100
  };

  Vector2 = (function() {
    function Vector2(x, y) {
      this.x = x;
      this.y = y;
    }

    return Vector2;

  })();

  Game = (function() {
    function Game() {
      this.gameScreen = $('#game-screen');
      this.gameStarted = false;
      this.flaggedCells = [];
      this.loadSettings();
      this.generateMap();
    }

    Game.prototype.loadSettings = function(InputSettings) {
      if (InputSettings == null) {
        InputSettings = {};
      }
      if (settings != null) {
        this.sizeX = InputSettings.sizeX || settings.sizeX;
        this.sizeY = InputSettings.sizeY || settings.sizeY;
        this.mines = InputSettings.mines || settings.mines;
        this.zoom = InputSettings.zoom || settings.zoom;
        this.resizeBorder();
        return true;
      }
      return false;
    };

    Game.prototype.generateMap = function(excluding, callback) {
      var generatingMap, halfCells, j, k, l, lineMap, mX, mY, mines, neededCells, pX, pY, placed, ref, ref1, ref2, trueGen;
      if (excluding == null) {
        excluding = new Vector2(-1, -1);
      }
      if (callback == null) {
        callback = function() {};
      }
      generatingMap = [];
      if ((this.sizeX != null) && (this.sizeY != null) && (this.mines != null)) {
        halfCells = (this.sizeX * this.sizeY) / 2;
        trueGen = this.mines < halfCells ? true : false;
        neededCells = trueGen ? this.mines : (this.sizeX * this.sizeY) - this.mines;
        for (mY = j = 0, ref = this.sizeY; 0 <= ref ? j < ref : j > ref; mY = 0 <= ref ? ++j : --j) {
          lineMap = [];
          for (mX = k = 0, ref1 = this.sizeX; 0 <= ref1 ? k < ref1 : k > ref1; mX = 0 <= ref1 ? ++k : --k) {
            lineMap.push(!trueGen);
          }
          generatingMap.push(lineMap);
        }
        if (excluding != null) {
          if ((excluding.x != null) && (excluding.y != null)) {
            for (mines = l = 0, ref2 = neededCells; 0 <= ref2 ? l < ref2 : l > ref2; mines = 0 <= ref2 ? ++l : --l) {
              placed = false;
              while (!placed) {
                pY = Random(0, this.sizeY - 1);
                pX = Random(0, this.sizeX - 1);
                if (pX !== excluding.x && pY !== excluding.y) {
                  if (generatingMap[pY][pX] === !trueGen) {
                    generatingMap[pY][pX] = trueGen;
                    placed = true;
                  }
                }
              }
            }
            this.map = generatingMap.slice(0);
            if (typeof callback === "function") {
              callback(this);
            }
            this.renderingMap();
            return true;
          }
        }
      }
      return false;
    };

    Game.prototype.resizeBorder = function() {
      var BorderLR, BorderLRLong, BorderTBSize, CellSize, CornerSize, NumbsSize, widthScreen;
      $('#zoom').removeClassWild('zoom-*').addClass("zoom-" + this.zoom);
      CellSize = new Vector2(16 * (this.zoom / 100), 16 * (this.zoom / 100));
      BorderTBSize = new Vector2(16 * (this.zoom / 100), 10 * (this.zoom / 100));
      CornerSize = new Vector2(10 * (this.zoom / 100), 10 * (this.zoom / 100));
      BorderLRLong = new Vector2(15 * (this.zoom / 100), 36 * (this.zoom / 100));
      NumbsSize = new Vector2(13 * (this.zoom / 100), 23 * (this.zoom / 100));
      BorderLR = new Vector2(10 * (this.zoom / 100), 16 * (this.zoom / 100));
      widthScreen = (CellSize.x * this.sizeX) + (CornerSize.x * 2);
      this.faceMargin = (widthScreen - ((6 * this.zoom / 100) * 2 + (Math.ceil(NumbsSize.x) * 6) + (Math.ceil(BorderLR.x) * 2) + (26 * this.zoom / 100))) / 2;
      this.gameScreen.width(widthScreen);
      if ($('#face').length) {
        return $('#face').css({
          "margin-left": this.faceMargin,
          "margin-right": this.faceMargin
        });
      }
    };

    Game.prototype.renderingMap = function() {
      var col, colIn, htmlCode, i, iconGen, iconNumbGen, j, k, l, len, len1, m, n, ref, ref1, ref2, ref3, row, rowIn;
      this.gameScreen.html('');
      htmlCode = '';
      iconGen = function(iconName) {
        return htmlCode += "<div class='icon icon-" + iconName + "'></div>";
      };
      iconNumbGen = function(timeName, iconName) {
        return htmlCode += "<div id='" + timeName + "' class='icon icon-" + iconName + "'></div>";
      };
      iconGen('bordertl');
      for (i = j = 0, ref = this.sizeX; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        iconGen('bordertb');
      }
      iconGen('bordertr');
      iconGen('borderlrlong');
      iconNumbGen('mines-hundreds', 'numb-0');
      iconNumbGen('mines-tens', 'numb-0');
      iconNumbGen('mines-ones', 'numb-0');
      htmlCode += "<div id='face' class='icon icon-facesmile' style='margin-left: " + this.faceMargin + "px; margin-right: " + this.faceMargin + "px;'></div>";
      iconNumbGen('seconds-hundreds', 'numb-0');
      iconNumbGen('seconds-tens', 'numb-0');
      iconNumbGen('seconds-ones', 'numb-0');
      iconGen('borderlrlong');
      iconGen('border-jointl');
      for (i = k = 0, ref1 = this.sizeX; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        iconGen('bordertb');
      }
      iconGen('border-jointr');
      ref2 = this.map;
      for (rowIn = l = 0, len = ref2.length; l < len; rowIn = ++l) {
        row = ref2[rowIn];
        iconGen('borderlr');
        for (colIn = m = 0, len1 = row.length; m < len1; colIn = ++m) {
          col = row[colIn];
          htmlCode += "<div id='" + rowIn + "," + colIn + "' class='icon clickable icon-blank' data-row='" + rowIn + "' data-col='" + colIn + "'></div>";
        }
        iconGen('borderlr');
      }
      iconGen('borderbl');
      for (i = n = 0, ref3 = this.sizeX; 0 <= ref3 ? n < ref3 : n > ref3; i = 0 <= ref3 ? ++n : --n) {
        iconGen('bordertb');
      }
      iconGen('borderbr');
      htmlCode += "<div class='clear-fix'></div>";
      this.gameScreen.html(htmlCode);
      this.setMinesAndTimes('mines', this.mines);
      return this.registrationEvents();
    };

    Game.prototype.registrationEvents = function() {
      var _this, clickable, face, isClickableDown, isFaceDown;
      clickable = $('.clickable');
      face = $('#face');
      _this = this;
      isClickableDown = false;
      isFaceDown = false;
      $(document).on('mouseup', function(e) {
        if (isClickableDown) {
          isClickableDown = false;
          if (face.hasClass('icon-faceooh')) {
            face.iconToggle('icon-facesmile');
          }
        }
        if (isFaceDown) {
          if (face.hasClass('icon-facepressed')) {
            face.iconToggle('icon-facesmile');
          }
          return isFaceDown = false;
        }
      });
      clickable.on('mouseenter', function(e) {
        if (isClickableDown && $(this).hasClass('icon-blank')) {
          return $(this).iconToggle('icon-blank-pressed');
        }
      });
      clickable.on('mouseleave', function(e) {
        if (isClickableDown && ($(this).hasClass('icon-blank') || $(this).hasClass('icon-blank-pressed'))) {
          return $(this).iconToggle('icon-blank');
        }
      });
      clickable.on('mousedown', function(e) {
        if ($(this).hasClass('icon-blank')) {
          if (e.button === 0) {
            $(this).iconToggle('icon-blank-pressed');
            face.iconToggle('icon-faceooh');
            return isClickableDown = true;
          }
        }
      });
      clickable.on('mouseup', function(e) {
        var selCol, selRow;
        if ($(this).hasClass('icon-blank') || $(this).hasClass('icon-blank-pressed') || $(this).hasClass("icon-bombflagged")) {
          selRow = $(this).attr('data-row');
          selCol = $(this).attr('data-col');
          if (e.button === 0) {
            return _this.openCell(selRow, selCol);
          } else if (e.button === 2) {
            return _this.setFlag(new Vector2(selCol, selRow));
          }
        }
      });
      face.on('mouseenter', function(e) {
        if (isFaceDown) {
          return $(this).iconToggle('icon-facepressed');
        }
      });
      face.on('mouseleave', function(e) {
        if (isFaceDown) {
          return $(this).iconToggle('icon-facesmile');
        }
      });
      face.on('mousedown', function(e) {
        isFaceDown = true;
        return $(this).iconToggle('icon-facepressed');
      });
      return face.on('mouseup', function(e) {
        return _this.restartGame();
      });
    };

    Game.prototype.openCell = function(Py, Px) {
      if (!this.gameStarted) {
        this.gameStarted = true;
        if (this.map[Py][Px]) {
          return this.generateMap(new Vector2(Px, Py), (function(__this) {
            __this.openCell(Py, Px);
            return __this.startTimer();
          }));
        } else {
          this.openCell(Py, Px);
          return this.startTimer();
        }
      } else {
        if (this.map[Py][Px]) {
          this.loseGame(new Vector2(Px, Py));
          return;
        }
        this.checkCell(Py, Px);
        return this.checkWin();
      }
    };

    Game.prototype.setMinesAndTimes = function(type, number) {
      var arrayNumbs, countNumbs, i, index, j, k, len, numb, ref, ref1, results, strNumb;
      strNumb = number.toString();
      countNumbs = strNumb.length;
      arrayNumbs = [];
      for (i = j = 0, ref = countNumbs; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        arrayNumbs.push(Number(strNumb[i]));
      }
      ref1 = arrayNumbs.reverse();
      results = [];
      for (index = k = 0, len = ref1.length; k < len; index = ++k) {
        numb = ref1[index];
        if (number >= 0) {
          if (index === 0) {
            $("#" + type + "-ones").iconToggle("icon-numb-" + numb);
          }
          if (index === 1) {
            $("#" + type + "-tens").iconToggle("icon-numb-" + numb);
          }
          if (index === 2) {
            results.push($("#" + type + "-hundreds").iconToggle("icon-numb-" + numb));
          } else {
            results.push(void 0);
          }
        } else if (number < 0) {
          if (index === 0) {
            $("#" + type + "-ones").iconToggle("icon-numb-" + numb);
          }
          if (index === 1) {
            $("#" + type + "-tens").iconToggle("icon-numb-" + numb);
          }
          results.push($("#" + type + "-hundreds").iconToggle("icon-numb-minus"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Game.prototype.checkCell = function(Py, Px) {
      var aroundCells, aroundMines, curCell, item, j, len, ref, ref1;
      aroundMines = 0;
      aroundCells = [
        {
          y: Number(Py) - 1,
          x: Number(Px) - 1
        }, {
          y: Number(Py) - 1,
          x: Number(Px)
        }, {
          y: Number(Py) - 1,
          x: Number(Px) + 1
        }, {
          y: Number(Py),
          x: Number(Px) + 1
        }, {
          y: Number(Py) + 1,
          x: Number(Px) + 1
        }, {
          y: Number(Py) + 1,
          x: Number(Px)
        }, {
          y: Number(Py) + 1,
          x: Number(Px) - 1
        }, {
          y: Number(Py),
          x: Number(Px) - 1
        }
      ];
      for (j = 0, len = aroundCells.length; j < len; j++) {
        item = aroundCells[j];
        if ((0 <= (ref = item.x) && ref < this.sizeX) && (0 <= (ref1 = item.y) && ref1 < this.sizeY)) {
          if (this.map[item.y][item.x]) {
            aroundMines++;
          }
        }
      }
      curCell = $("[id='" + Py + "," + Px + "']");
      if (aroundMines) {
        if (!curCell.hasClass("icon-open-" + aroundMines)) {
          return curCell.iconToggle("icon-open-" + aroundMines);
        }
      } else if (!curCell.hasClass("icon-open-" + aroundMines)) {
        curCell.iconToggle("icon-open-0");
        return this.openNeighbors(Py, Px);
      }
    };

    Game.prototype.openNeighbors = function(Py, Px) {
      var aroundCells, item, j, len, ref, ref1, results;
      aroundCells = [
        {
          y: Number(Py) - 1,
          x: Number(Px) - 1
        }, {
          y: Number(Py) - 1,
          x: Number(Px)
        }, {
          y: Number(Py) - 1,
          x: Number(Px) + 1
        }, {
          y: Number(Py),
          x: Number(Px) + 1
        }, {
          y: Number(Py) + 1,
          x: Number(Px) + 1
        }, {
          y: Number(Py) + 1,
          x: Number(Px)
        }, {
          y: Number(Py) + 1,
          x: Number(Px) - 1
        }, {
          y: Number(Py),
          x: Number(Px) - 1
        }
      ];
      results = [];
      for (j = 0, len = aroundCells.length; j < len; j++) {
        item = aroundCells[j];
        if ((0 <= (ref = item.x) && ref < this.sizeX) && (0 <= (ref1 = item.y) && ref1 < this.sizeY)) {
          if (!$("[id='" + item.y + "," + item.x + "']").hasClass('icon-bombflagged')) {
            if (!this.map[item.y][item.x]) {
              results.push(this.checkCell(item.y, item.x));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Game.prototype.setFlag = function(vector) {
      var FlaggedIndex, element, index, isFlagged, item, j, len, ref;
      isFlagged = false;
      FlaggedIndex = -1;
      ref = this.flaggedCells;
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        item = ref[index];
        if (item.x === vector.x && item.y === vector.y) {
          isFlagged = true;
          FlaggedIndex = index;
        }
      }
      element = $("[id='" + vector.y + "," + vector.x + "']");
      if (isFlagged) {
        this.flaggedCells.splice(FlaggedIndex, 1);
        element.iconToggle("icon-blank");
      } else {
        this.flaggedCells.push(vector);
        element.iconToggle("icon-bombflagged");
      }
      return this.setMinesAndTimes('mines', this.mines - this.flaggedCells.length);
    };

    Game.prototype.checkWin = function() {
      var _this, isWin, searchElems;
      isWin = true;
      _this = this;
      searchElems = $('.icon-blank,.icon-bombflagged');
      searchElems.each(function(index) {
        var col, row;
        row = $(this).attr("data-row");
        col = $(this).attr("data-col");
        if (!_this.map[row][col]) {
          return isWin = false;
        }
      });
      if (isWin) {
        searchElems.each(function() {
          return $(this).iconToggle('icon-bombflagged');
        });
        this.setMinesAndTimes('mines', 0);
        return this.winGame();
      }
    };

    Game.prototype.winGame = function() {
      $('#face').iconToggle('icon-facewin');
      return this.openMap();
    };

    Game.prototype.loseGame = function(loseVector) {
      $('#face').iconToggle('icon-facedead');
      return this.openMap(loseVector);
    };

    Game.prototype.openMap = function(loseVector) {
      var _this, clickable;
      if (loseVector == null) {
        loseVector = false;
      }
      _this = this;
      clickable = $('.clickable');
      clickable.each(function() {
        var col, row;
        row = $(this).attr("data-row");
        col = $(this).attr("data-col");
        if (_this.map[row][col]) {
          if ($(this).hasClass('icon-bombflagged')) {
            $(this).iconToggle('icon-bombflagged');
          } else {
            $(this).iconToggle('icon-bombrevealed');
          }
          if (!!loseVector) {
            if (row === loseVector.y && col === loseVector.x) {
              return $(this).iconToggle('icon-bombdeath');
            }
          }
        } else {
          if ($(this).hasClass('icon-bombflagged')) {
            return $(this).iconToggle('icon-bombmisflagged');
          }
        }
      });
      return this.destroy();
    };

    Game.prototype.startTimer = function() {
      var timerFn;
      this.timerNumb = 1;
      this.setMinesAndTimes("seconds", this.timerNumb);
      timerFn = (function(_this) {
        return function() {
          if (_this.gameStarted) {
            _this.timerNumb += 1;
            return _this.setMinesAndTimes("seconds", _this.timerNumb);
          } else {
            return clearInterval(_this.timer);
          }
        };
      })(this);
      this.timer = setInterval(timerFn, 1000);
    };

    Game.prototype.restartGame = function() {
      this.flaggedCells = [];
      this.destroy();
      return this.generateMap();
    };

    Game.prototype.destroy = function() {
      this.gameStarted = false;
      $('.clickable').unbind('mouseenter').unbind('mouseleave').unbind('mousedown').unbind('mouseup');
      return clearInterval(this.timer);
    };

    return Game;

  })();

  game = new Game();

  game.loadSettings({
    zoom: 200
  });

}).call(this);

//# sourceMappingURL=main.js.map
