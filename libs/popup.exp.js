// Generated by CoffeeScript 1.12.7
var popup_exp;

popup_exp = (function() {
  function popup_exp(element) {
    this.element = element;
    this.animationTime = 200;
    this.popup = $(this.element);
    this.popup.addClass('popup-exp');
    if (!$('.popup-exp-fs-bg').length) {
      this.BG = $(document.createElement('div')).addClass('popup-exp-fs-bg').appendTo('body');
    } else {
      this.BG = $('.popup-exp-fs-bg');
    }
  }

  popup_exp.prototype.open = function() {
    var bgIsVisible;
    bgIsVisible = this.BG.is(":visible");
    if (bgIsVisible) {
      this.close($(this.BG.attr('popup')), false);
    } else {
      this.BG.show();
    }
    this.BG.attr('popup', this.element);
    this.popup.show();
    this.regEvents();
  };

  popup_exp.prototype.close = function(curElem, hideBG) {
    if (curElem == null) {
      curElem = this.popup;
    }
    if (hideBG == null) {
      hideBG = true;
    }
    if (hideBG) {
      this.BG.hide();
    }
    return curElem.hide();
  };

  popup_exp.prototype.regEvents = function() {
    var _this;
    _this = this;
    return this.BG.on('click', function() {
      return _this.close($($(this).attr('popup')));
    });
  };

  return popup_exp;

})();

//# sourceMappingURL=popup.exp.js.map