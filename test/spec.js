describe('clock', function() {

  var fixture = $('<div>');
  fixture.clock();

  it('should append all elements to the DOM', function() {
    expect(fixture).toHaveClass('outer-shell');
    expect(fixture).toContainElement('.inner-shell');
    expect(fixture.find('.inner-shell')).toContainElement('.pm-label');
    expect(fixture.find('.inner-shell')).toContainElement('.auto-label');
    expect(fixture.find('.inner-shell')).toContainElement('.clock-screen');
    expect(fixture.find('.clock-screen')).toContainElement('.pm-indicator');
    expect(fixture.find('.clock-screen')).toContainElement('.auto-indicator');
    expect(fixture.find('.clock-screen')).toContainElement('.clock-text');
    expect(fixture.find('.inner-shell')).toContainElement('.am-freq');
    expect(fixture.find('.inner-shell')).toContainElement('.fm-freq');
  });
});
