
var clock = {
  init: function( options, elem ) {
    // Mix in the passed-in options with the default options
    this.options = $.extend( {}, this.options, options );

    // cache element with and without jQuery
    this.elem  = elem;
    this.$elem = $(elem);

    // Build the DOM's initial structure
    this._build();

    // call it passing 'this' for the interval calls that are not on the clock object
    this.setTime(this);
    setInterval(this.setTime, 1000, this);

    // return this so that we can chain
    return this;
  },
  options: {
    // allow passing a timeStamp to display a specific time
    timeStamp: undefined,

    // allow passing an offset for different time zones
    offset: 0
  },
  // _build() helper functions
  _creatListItem: function (ulClass, arr) {
    return $('<ul>')
      .addClass(ulClass)
      .append(this._createList(arr));
  },
  _createList: function (arr) {
    return arr.map(function (val) {
      return $('<li>' + val + '</li>')
    })
  },
  _build: function(){
    // craete all child elements
    var innerShell = $('<div>').addClass('inner-shell'),
        clockScreen = $('<div>').addClass('clock-screen'),

        labels = $('<ul>').addClass('labels').append(
          $('<li>').addClass('pm-label').text('pm'),
          $('<li>').addClass('auto-label').text('auto')
        ),
        clockText = $('<p>').addClass('clock-text').text('00:00:00'),
        amFreq = this._creatListItem('am-freq', ['AM','53','60','70','90','110','140','170','KHz']),
        fmFreq = this._creatListItem('fm-freq', ['FM','88','92','96','102','106','108','MHz']);

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
    if (arr[0] > 12) {
      arr[0] -= 12;
      this.$elem.find('.pm-label').removeClass('hidden-label');
    } else {
      this.$elem.find('.pm-label').addClass('hidden-label');
    }
    // arr[0] -= 12 * ~~( parseInt(arr[0]) > 12);
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

$.plugin('clock', clock);
$('.clock').clock();
var a = $('.clock').data('clock');