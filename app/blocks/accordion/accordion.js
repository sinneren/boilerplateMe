(function($) {
  $.accordionJqModule = function() {
    var privateVar = [];
    var privateMethod = function() {
      console.log('hello from private');
    };
    return {
      publicMethod: function(params) {
        privateMethod();
      }
    };
  };
})(jQuery);

var accordionModule = $.accordionJqModule();
accordionModule.publicMethod();
