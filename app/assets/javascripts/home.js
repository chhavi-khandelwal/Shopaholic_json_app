$(document).ready(function() {
  homeProduct = new HomeProductGrid();
  products = '';
  homeProduct.getRecent();
});

function HomeProductGrid() {
  var $main_container = $('#main-container');
  var homeProduct = this;

  this.addPolling = function() {
    setTimeout(function() { homeProduct.getRecent(); }, 40000);
  }
  
  //get recent products from the database
  this.getRecent = function() {
    // if($('#new-today').length == 1) {
      $.ajax({
        url: $('#latest-products-container').data('href'),
        dataType: 'json',
        async: false, 
      }).done(function(data) {
        $('#latest-products-container').html('');
        products = data;
      //   var url_hash = window.location.hash.split('-')[0];
      //   if (url_hash != '#products' && url_hash != '#categories') {
      //     for (var i in products) {
      //       var gridProduct = products[i];
      //       homeProduct.displayProducts(gridProduct);
      //     }
      //   }
      // }).complete(function() {
      //   homeProduct.addPolling();
      });
    // }    
  }

}