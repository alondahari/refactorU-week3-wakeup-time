
var clock = {
  init: function( options, elem ) {
    // Mix in the passed-in options with the default options
    this.options = $.extend( {}, this.options, options );

    this.elem  = elem;
    this.$elem = $(elem);

    // Build the DOM's initial structure
    this._build();

    // call it passing 'this' for the interval calls that are not on the clock object
    this.setTime(this);
    setInterval(this.setTime,1000, this);

    // return this so that we can chain
    return this;
  },
  options: {
    // allow passing a timeStamp, mainly for testing
    timeStamp: undefined,

    // allow passing an offset for different time zones
    offset: 0
  },
  _build: function(){
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
    this.$elem.addClass('outer-shell').append(innerShell);
  },
  setTime: function( theClock ){
    // allow calling setTime directly, overriding this.options
    // options = $.extend({}, this.options, options)
    var time = theClock.options.timeStamp ? new Date(theClock.options.timeStamp) : new Date();
    // sanitize offset
    var offset = parseFloat(theClock.options.offset) || 0;

    time = (time.getHours() + offset ) + ':' + time.getMinutes() + ':' + time.getSeconds();
    theClock.$elem.find('.clock-text').text( theClock._format(time) );
  },
  _format: function (str) {
    var arr = str.split(':');
    // make it 12 hour clock
    arr[0] -= 12 * ~~( parseInt(arr[0]) > 12);
    return arr.map(function (val) {
      return (parseInt(val) < 10) ? '0' + val : val;
    }).join(':');
  }
};

// Object.create support test, and fallback for browsers without it
if ( typeof Object.create !== 'function' ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// Create a plugin based on a defined object
$.plugin = function( name, object ) {
  $.fn[name] = function( options ) {
    return this.each(function() {
      if ( ! $.data( this, name ) ) {
        $.data( this, name, Object.create(object).init(
        options, this ) );
      }
    });
  };
};

// Usage:
// With clock, we could now essentially do this:
// $.plugin('myobj', clock);

// and at this point we could do the following
// $('#elem').myobj({name: "John"});
// var inst = $('#elem').data('myobj');
// inst.myMethod('I am a method');
//
$.plugin('clock', clock);
$('.clock').clock();
var a = $('.clock').data('clock');
console.log(a._format('0:0:0'));
