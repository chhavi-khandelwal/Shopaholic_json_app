// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require twitter/bootstrap
//= require jquery.remotipart
//= require jquery.ui.all
//= require turbolinks
//= require home
//= require color
//= require grid_page
//= require categories
//= require products
//= require carts


// #FIXME_AB: Don't use require tree, include what you need manually

function CategoryProduct() {
  this.addPolling = function() {
    setTimeout(function() {
      categoryProduct.getProducts();
    }, 40000);
  }
}