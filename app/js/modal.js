(function($) {
  /*
  * Popup
  */
  var modalWidth = AppConfig.modalWidth || 900;

  function Popup(data) {
    var bodyScroll = $('body').scrollTop();

    $(document).on($.modal.OPEN, function (e, modal) {
      PopupOpen(e, modal);
    });
    $(document).on($.modal.AFTER_CLOSE, function (e, modal) {
      PopupAfterClose(e, modal, bodyScroll);
    });
  };

  function PopupOpen(e, modal) {
    if(($(window).get(0).outerWidth < modalWidth)) {
      var modalHeight = modal.elm.outerHeight();
      $('body').css('max-height', modalHeight);
    }

    $('body').addClass('body--hide').removeClass('nav--open');
  }

  function PopupAfterClose(e, modal, scroll) {
    modal.elm.remove();
    $('body').removeClass('body--hide').scrollTop(scroll);

    if(($(window).get(0).outerWidth < modalWidth)) {
      $('body').css('max-height', '');
    }
  }
})(jQuery);
