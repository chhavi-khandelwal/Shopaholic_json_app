function ImageHelper() {
  var imageHelper = this;
  var imageCount = 3;

  this.bindEvents = function() {
    $('#color-form').on('click', '.add-image', imageHelper.addField);
    $('#color-form').on('click', '.remove-image', imageHelper.removeField);
  }

  this.addField = function() {
    var $link = $(this);
    var visibleImages = $('.color-table .image-field:visible');
    if (visibleImages.size() < imageCount) {
      var new_id = new Date().getTime();
      var regexp = new RegExp("new_" + $link.data('association'), "g");
      $link.parent().before($link.data('content').replace(regexp, new_id));
    }
  }

  this.removeField = function() {
    var $link = $(this);
    $link.prev("input[type='hidden']").val("1");
    $link.closest('span.image-field').hide();
  }
}

function ColorAjaxHelper() {

  this.bindEvents = function() {
    $('.color-box').on('click', '.new-btn', this.getNewForm);
    $('.admin-destroy-color').click(this.destroyColor);
    $('.admin-edit-color').click(this.editColor);
  }

  this.getNewForm = function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).data('href'),
      dataType: 'script'
    }).complete(function(response) {
      $('#color-form').html(response.responseText);
    });
  }

  this.destroyColor = function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      type: 'DELETE',
      dataType: 'json'
    }).complete(function(response) {
      data = (response.responseJSON);
      if(data == undefined)
        alert('Color can not be deleted');
      else { 
        $('#new_color').remove();
        $('div.alert').remove();
        $("#color_" + data.id).remove();
        $('.notice').show();
      }
    });
  }

  this.editColor = function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      dataType: 'script'
    }).complete(function(response) {
      data = response.responseText;
      if(data == undefined)
        alert("Can't edit the color");
      else { 
        $('#color-form').html(data);
      }
    });
  }
}

$(document).ready(function() {
  var ajaxHelper = new ColorAjaxHelper();
  ajaxHelper.bindEvents();
  var imageHelper = new ImageHelper();
  imageHelper.bindEvents();
});
  
