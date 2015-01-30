
var Clock = function (options, elem) {
  var init = function(clock){
    if (options && options.hasOwnProperty('timezone')) {
      if (_searchTimezones(options.timezone)) {
        options = $.extend( {}, options, _searchTimezones(options.timezone) );
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
    setTime(clock);
    // passing extra parameters to setInterval won't work for ltIE10
    setInterval(setTime, 1000, clock);

  };

  defaults = {
    // allow passing a timeStamp to display a specific time
    timeStamp: 0,

    // get system offset and convert to ms from utc (inverted)
    offset: new Date().getTimezoneOffset() * -60000,

    timezone: jstz.determine().name()
  };

  defaults.localOffset = defaults.offset;

  /////////////////
  //exposed methods
  /////////////////

  this.setOption = function(option, value){


    if (option == 'timezone' && _searchTimezones(value)) {
      options = $.extend( {}, options, _searchTimezones(value) );
    // set timezone if changed
      this.$elem.find('.time-zone').text(_formatTimezone);
    } else {
      options[option] = value;
    }
    // setTime with new option immediately
      setTime(this);
  };

  /////////////////
  // hidden methods
  /////////////////

    var setTime = function( clock ){
    // allow calling setTime directly, overriding options
    var time = options.timeStamp ?
        new Date(options.timeStamp) :
        new Date();
    // sanitize offset
    var offset = parseFloat(options.offset) || 0;
    // add offset to time
    time = new Date(offset - options.localOffset + Date.parse(time));

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

  var _formatTimezone = function(args){
    var offsetSign = (options.offset > 0) ? '+' : '';
    return options.timezone + ' (' + offsetSign + (options.offset / 3600000) + ')'
  };

  var _createList = function (arr) {
    return arr.map(function (val) {
      return {el: 'li.' + val, text: val}
    })
  };

  var _createElements = function (arr) {
    var cache = '';
      arr.forEach(function (val) {
        var elArr = val.el.split('.');
        // console.log(!!elArr[0]);
        cache += !elArr[0] ? '<div' : '<' + elArr[0];
        cache += ' class="' + elArr[1] + '">';
        if (val.hasOwnProperty('text')) cache += val.text;
        if (val.hasOwnProperty('append')) cache += _createElements(val.append);
        cache += !elArr[0] ? '</div>' : '</' + elArr[0] + '>';
      })
    console.log(cache);
    return cache;
  }

  var _build = function(clock, $elem){

    clock.$elem.addClass('outer-shell')
      .append(_createElements([
      {el: '.inner-shell', append: [
        {el: '.time-zone', text: _formatTimezone()},
        {el: 'ul.labels', append: [
          {el: 'li.pm-label', text: 'pm'},
          {el: 'li.auto-label', text: 'auto'}
        ]},
        {el: '.clock-screen', append: [
          {el: 'p.clock-text'}
        ]},
        {el: 'ul.am-freq',
          append: _createList(['AM','53','60','70','90','110','140','170','KHz'])},
        {el: 'ul.fm-freq',
          append: _createList(['FM','88','92','96','102','106','108','MHz'])
        }
      ]}
    ]));

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

  var _searchTimezones = function (str) {
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
  $('.clock').clock();
});
