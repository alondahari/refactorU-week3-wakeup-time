describe('clock', function() {
  var fixture = $('<div>');
  var inst = fixture.clock();


  it('should append all elements to the DOM', function() {
    expect(fixture).toHaveClass('outer-shell');
    expect(fixture).toContainElement('.inner-shell');
    expect(fixture.find('.inner-shell')).toContainElement('.pm-label');
    expect(fixture.find('.inner-shell')).toContainElement('.auto-label');
    expect(fixture.find('.inner-shell')).toContainElement('.clock-screen');
    expect(fixture.find('.clock-screen')).toContainElement('.clock-text');
    expect(fixture.find('.inner-shell')).toContainElement('.am-freq');
    expect(fixture.find('.inner-shell')).toContainElement('.fm-freq');
  });

  it("should return jQuery object for chaining", function () {
    expect(inst.jquery).toBeTruthy();
  });

  it("should allow access to clock methods and property through .data()", function () {
    inst = inst.data('clock');
    expect(inst.$elem).toEqual(fixture);
  });

  it("should show the right time on document ready", function () {
    expect(fixture.find('.clock-text').text()).not.toBe("00:00:00");
  });

  it("should format the text correctly", function () {
    inst.setOption('timeStamp', 61000);
    expect(fixture.find('.clock-text').text()).toBe("05:01:01");

  });

  it("should allow offset for different time zones", function () {
    inst.setOption('offset', 3600000);
    expect(fixture.find('.clock-text').text()).toBe('01:01:01');

  });

  it("should sanitize passed options", function () {
    inst.setOption('offset', 'a');
    expect(fixture.find('.clock-text').text()).toBe('12:01:01');
    inst.setOption('offset', '-3600000');
    expect(fixture.find('.clock-text').text()).toBe('11:01:01');
    inst.setOption('offset', {});
    expect(fixture.find('.clock-text').text()).toBe('12:01:01');
    inst.setOption('timeStamp', 'a');
    expect(fixture.find('.clock-text').text()).not.toBe('Invalid');

  });

  it("should allow passing options on init", function () {
    fixture = $('<div>').clock({timeStamp: 61000, offset: 3600000})
    expect(fixture.find('.clock-text').text()).toBe('01:01:01');

  });

  it("should allow passing timezones", function () {
    fixture = $('<div>').clock({timezone: 'AKDT'});
    expect(fixture.find('.time-zone').text()).toBe('Alaskan Standard Time (-8)');
    fixture = $('<div>').clock({timezone: 'jer'});
    expect(fixture.find('.time-zone').text()).toBe('Israel Standard Time (+3)');

    fixture = $('<div>').clock({timezone: 'adsfre'});
    expect(fixture.find('.time-zone').text()).toBe('America/Denver (-7)');

    fixture = $('<div>').clock({timezone: ''});
    expect(fixture.find('.time-zone').text()).toBe('America/Denver (-7)');
  });

  it("should allow passing timezone in setOption", function () {
    inst = fixture.data('clock');
    inst.setOption('timezone', 'libYa');
    expect(fixture.find('.time-zone').text()).toBe('Libya Standard Time (+2)');
  });

  it("should display the pm labal correctly", function () {
    fixture = $('<div>').clock({timeStamp: 1000});
    expect(fixture.find('.pm-label')).not.toHaveClass('hidden-label');
    fixture.data('clock').setOption('timeStamp', 43200000);
    expect(fixture.find('.pm-label')).toHaveClass('hidden-label');
  });
});
