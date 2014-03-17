function Color() {
  this.getProductColors = function() {
    var productColors = [];
    for (var key in products) {
      var product = products[key];
      var colors = product.colors;
      for (var color_key in colors) {
        var color = colors[color_key];
        color['product_id'] = product.id;
        color['title'] = product.title;
        color['description'] = product.description;
        color['brand'] = { 'id': product.brand.id, 'name': product.brand.name };
        color['category'] = { 'id': product.category.id, 'name': product.category.name };
        productColors.push(color);
      }
    }
    return productColors;
  }
}