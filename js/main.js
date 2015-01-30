
var Clock = function (options, elem) {
  var init = function(clock){
    if (options && options.hasOwnProperty('timezone')) {
      if (clock.searchTimezones(options.timezone)) {
        options = $.extend( {}, options, clock.searchTimezones(options.timezone) );
      } else {
        delete options.timezone;
      }
    }

    // Mix in the passed-in options with the default options
    options = $.extend( {}, defaults, options );
    // cache element with and without jQuery
    clock.$elem = $(elem);

    // Build the DOM's initial structure
    _build(clock, this.$elem);

    // call it passing 'this' for the interval calls that are not on the clock object
    clock.setTime(clock);
    // passing extra parameters to setInterval won't work for ltIE10
    setInterval(clock.setTime, 1000, clock);

  };

  defaults = {
    // allow passing a timeStamp to display a specific time
    timeStamp: 0,

    // allow passing an offset for different time zones
    offset: 0,

    timezone: jstz.determine().name()
  };

  this.setOption = function(option, value){

    options[option] = value;

    if (option == 'timezone' && this.searchTimezones(value)) {
    // set timezone if changed
      this.$elem.find('.time-zone').text(this.searchTimezones(value).timezone);
    }
    // setTime with new option immediately
    this.setTime(this);
  };

  this.setTime = function( clock ){
    // allow calling setTime directly, overriding options
    // options = $.extend({}, options, options)
    var time = options.timeStamp ?
        new Date(options.timeStamp) :
        new Date();
    // sanitize offset
    var offset = parseFloat(options.offset) || 0;
    // add offset to time
    time = new Date((offset) + Date.parse(time));

    // in case invalid timeStamp was passed
    if (typeof options.timeStamp != 'number') {
      time = new Date();
    }
    // format time
    time = time.toLocaleTimeString().split(' ');
    // remove the am/pm value and store it
    var ampm = time.splice(1,1);

    _pmLabelOn(ampm == 'PM', clock);

    clock.$elem.find('.clock-text').text(
      _format(time)
    );
  };

  // ;build() helper functions
  var _creatListItem = function (ulClass, arr) {
    return $('<ul>')
      .addClass(ulClass)
      .append(_createList(arr));
  };

  var _createList = function (arr) {
    return arr.map(function (val) {
      return $('<li>' + val + '</li>')
    })
  };

  var _build = function(clock, $elem){
    // craete all child elements
    var innerShell = $('<div>').addClass('inner-shell'),
        timeZone = $('<div>').addClass('time-zone'),
        clockScreen = $('<div>').addClass('clock-screen'),

        labels = $('<ul>').addClass('labels').append(
          $('<li>').addClass('pm-label').text('pm'),
          $('<li>').addClass('auto-label').text('auto')
        ),
        clockText = $('<p>').addClass('clock-text').text('00:00:00'),
        amFreq = _creatListItem('am-freq', ['AM','53','60','70','90','110','140','170','KHz']),
        fmFreq = _creatListItem('fm-freq', ['FM','88','92','96','102','106','108','MHz']);

    //append all to the clock
    timeZone.text(options.timezone);
    clockScreen.append(clockText);
    innerShell.append(timeZone, labels, clockScreen, amFreq, fmFreq);
    clock.$elem.addClass('outer-shell').append(innerShell);
  };

  var _pmLabelOn = function (bool, clock) {
    var label = clock.$elem.find('.pm-label');
    if (bool){
      label.removeClass('hidden-label');
    } else {
      label.addClass('hidden-label');
    }
  };
  var _format = function (time) {
    var arr = time[0].split(':');
    // add 0 before hours when needed
    if (arr[0] < 10) arr[0] = '0' + arr[0];

    return arr.join(':');
  };

  this.searchTimezones = function (str) {
    if (!str) return false;
    var timezone;
    str = new RegExp(str, 'i');
    $.each(timezones, function (i, val) {
      if (val.abbr.match(str) || val.text.match(str) || val.value.match(str))
        timezone = {
          offset: val.offset * 3600000,
          timezone: val.value
        }
    })
    if (timezone) return timezone;
  };

  init(this);

}

// Create a plugin based on a defined object
// Object.create won't work with ltIE9
$.fn.clock = function( options ) {
  return this.each(function() {
    if ( ! $.data( this, 'clock' ) ) {
      $.data( this, 'clock', new Clock(options, this) );
    }
  });
};

$(document).on('ready', function(){
  $('.clock').clock({timeStamp: 12 * 3600000});
});
