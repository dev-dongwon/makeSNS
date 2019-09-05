// new Isotope( '.main-grid', {});
var elem = document.querySelector('.grid');
var msnry = new Masonry( elem, {
  itemSelector: '.grid-item',
  columnWidth: 200
});

// element argument can be a selector string
//   for an individual element
var msnry = new Masonry( '.grid', {
  // options
});