$(document).ready(function() {
  homeProduct = new HomeProductGrid();
  products = '';
  homeProduct.getRecent();
});

function HomeProductGrid() {
  var $main_container = $('#main-container');
  var homeProduct = this;

  this.resetPageProducts = function() {
    setInterval(function() {
      homeProduct.getRecent();
    }, 40000);
  }
  
  //get recent products from the database
  this.getRecent = function() {
    $.ajax({
      url: $('#latest-products-container').data('href'),
      dataType: 'json',
      async: false, 
    }).done(function(data) {
      products = data;
    }).complete(function() {
      $('#latest-products-container').html('');
      var color = new Color();
      productColors = color.getProductColors();
      var gridPage = new GridPage();
      gridPage.displayFilteredProducts('');
      homeProduct.resetPageProducts();
    });
  }

}