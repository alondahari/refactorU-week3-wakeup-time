;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = 'clock',
      defaults = {

      };

  // The actual plugin constructor
  function Clock( element, options ) {
      this.element = element;
      this.$element = $(element);

      this.options = $.extend( {}, defaults, options) ;

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
  }

  Clock.prototype.init = function () {
    this._build();
  };

  Clock.prototype.init = function () {
    this.$element.append();
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
      return this.each(function () {
          if (!$.data(this, 'plugin_' + pluginName)) {
              $.data(this, 'plugin_' + pluginName,
              new Clock( this, options ));

          }
      });
  };

})( jQuery, window, document );

var a = $('<div>');
a.clock();
