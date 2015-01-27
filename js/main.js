;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = 'clock',
      defaults = {
        // allow passing a timeStamp, mainly for testing
        timeStamp: undefined,

        // allow passing an offset for different time zones
        offset: 0
      };

  // The actual plugin constructor
  function Clock( element, options ) {
      this.element = element;
      this.$element = $(element);

      this.options = $.extend({}, defaults, options);

      this._name = pluginName;

      init(this);

  }

  // Clock.prototype = {
  //   setTimeStamp: function (timeStamp) {
  //     this.options.timeStamp = timeStamp;
  //   },
  //   setOffset: function (offset) {
  //     this.options.offset = offset;
  //
  //   }
  // };

  var setTime = function(theClock){
    var time = theClock.options.timeStamp ? new Date(theClock.options.timeStamp) : new Date();
    // sanitize offset
    var offset = parseFloat(theClock.options.offset) || 0;

    time = (time.getHours() + offset ) + ':' + time.getMinutes() + ':' + time.getSeconds();
    theClock.$element.find('.clock-text').text( format(time) );
  };

  var format = function (str) {
    var arr = str.split(':');
    // make it 12 hour clock
    arr[0] -= 12 * ~~( parseInt(arr[0]) > 12);
    return arr.map(function (val) {
      return (parseInt(val) < 10) ? '0' + val : val;
    }).join(':');
  };

  var init = function (theClock) {
    build(theClock);
    setTime(theClock);
    setInterval(setTime,1000, theClock);
  };

  var build = function (theClock) {

    var innerShell = $('<div>').addClass('inner-shell'),
        clockScreen = $('<div>').addClass('clock-screen'),

        labels = $('<ul>').addClass('labels').append(
          $('<li>').addClass('pm-label').text('pm'),
          $('<li>').addClass('auto-label').text('auto')
        ),
        clockText = $('<p>').addClass('clock-text').text('00:00:00'),
        amFreq = $('<ul>').addClass('am-freq').append(
          $('<li>AM</li>'),
          $('<li>53</li>'),
          $('<li>60</li>'),
          $('<li>70</li>'),
          $('<li>90</li>'),
          $('<li>110</li>'),
          $('<li>140</li>'),
          $('<li>170</li>'),
          $('<li>KHz</li>')
        ),
        fmFreq = $('<ul>').addClass('fm-freq').append(
          $('<li>FM</li>'),
          $('<li>88</li>'),
          $('<li>92</li>'),
          $('<li>96</li>'),
          $('<li>102</li>'),
          $('<li>106</li>'),
          $('<li>108</li>'),
          $('<li>MHz</li>')
        );

    //append all to the clock

    clockScreen.append(clockText);
    innerShell.append(labels, clockScreen, amFreq, fmFreq);
    theClock.$element.addClass('outer-shell').append(innerShell);
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
