describe('clock', function() {

  var fixture = $('<div>');
  fixture.clock();

  it('should append all elements to the DOM', function() {
    expect(fixture).toContainElement('.outer-shell');
  });
});
