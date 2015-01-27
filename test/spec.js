describe('clock', function() {

  var fixture = $('<div>');
  fixture.clock();

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
    console.log(fixture);
    fixture.setTimeStamp(1000);
    expect(fixture.find('.clock-text').text()).toBe("00:00:00");

  });

  it("should allow offset for different time zones", function () {
    fixture.clock({offset: 1});
    // expect(fixture.find('.clock-text').text());

  });
});
