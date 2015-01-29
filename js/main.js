
var clock = {
  init: function( options, elem ) {
    // Mix in the passed-in options with the default options
    this.options = $.extend( {}, this.options, options );

    // cache element with and without jQuery
    this.$elem = $(elem);

    // Build the DOM's initial structure
    this._build();

    // call it passing 'this' for the interval calls that are not on the clock object
    this.setTime(this);
    // passing extra parameters to setInterval won't work for ltIE10
    setInterval(this.setTime, 1000, this);

    // return this so that we can chain
    return this;
  },
  options: {
    // allow passing a timeStamp to display a specific time
    timeStamp: 0,

    // allow passing an offset for different time zones
    offset: 0
  },
  setOption: function(option, value){
    this.options[option] = value;
    // setTime with new option immediately
    this.setTime(this);
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
  setTime: function( clock ){
    // allow calling setTime directly, overriding this.options
    // options = $.extend({}, this.options, options)
    var time = clock.options.timeStamp ?
        new Date(clock.options.timeStamp) :
        new Date();
    // sanitize offset
    var offset = parseFloat(clock.options.offset) || 0;
    // add offset to time
    time = new Date((offset * 3600000) + Date.parse(time));

    // format time
    time = time.toLocaleTimeString().split(' ');
    // remove the am/pm value and store it
    var ampm = time.splice(1,1);

    clock._pmLabelOn(ampm == 'PM');

    clock.$elem.find('.clock-text').text(
      clock._format(time)
    );
  },
  _setOffset: function (offset) {

  },
  _pmLabelOn: function (bool) {
    if (this._pmLabelOn.cache != bool){
      this._pmLabelOn.cache = bool
      this.$elem.find('.pm-label').toggleClass('hidden-label');
    }
  },
  _format: function (time) {
    var arr = time[0].split(':');
    // add 0 before hours when needed
    if (arr[0] < 10) arr[0] = '0' + arr[0];

    return arr.join(':');
  }
};

// Create a plugin based on a defined object
// Object.create won't work with ltIE9
$.fn.clock = function( options ) {
  return this.each(function() {
    if ( ! $.data( this, 'clock' ) ) {
      $.data( this, 'clock', Object.create(clock).init(
      options, this ) );
    }
  });
};

$('.clock').clock();
