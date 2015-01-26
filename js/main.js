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

      init(this);
  }

  var init = function (theClock) {
    build(theClock);
  };

  var build = function (theClock) {
    var outerShell = $('<div>').addClass('outer-shell'),
        innerShell = $('<div>').addClass('inner-shell'),
        pmLabel = $('<p>').addClass('pm-label'),
        autoLabel = $('<p>').addClass('auto-label'),
        clockScreen = $('<div>').addClass('clock-screen'),
        pmIndicator = $('<div>').addClass('pm-indicator'),
        autoIndicator = $('<div>').addClass('auto-indicator'),
        clockText = $('<p>').addClass('clock-text'),
        amFreq = $('<p>').addClass('am-freq'),
        fmFreq = $('<p>').addClass('fm-freq');

    //append all to the clock

    clockScreen.append(autoLabel, pmIndicator, autoIndicator, clockText);
    innerShell.append(pmLabel, autoLabel, clockScreen, amFreq, fmFreq);
    outerShell.append(innerShell);
    theClock.$element.append(outerShell);
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
$('.clock').clock();
