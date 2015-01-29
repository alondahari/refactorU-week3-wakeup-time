describe('clock', function() {
  var fixture = $('<div>');
  var inst = fixture.clock().data('clock');


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

  it("should show the right time on document ready", function () {
    expect(fixture.find('.clock-text').text()).not.toBe("00:00:00");
  });

  it("should format the text correctly", function () {
    inst.setOption('timeStamp', 61000);
    expect(fixture.find('.clock-text').text()).toBe("05:01:01");

  });

  it("should allow offset for different time zones", function () {
    fixture.clock({offset: 1});
    // expect(fixture.find('.clock-text').text());

  });
});
