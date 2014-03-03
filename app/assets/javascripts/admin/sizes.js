$(document).ready(function() {
  var ajaxHelper = new AjaxHelper();
  ajaxHelper.bindEvents();
});

function AjaxHelper() {
  var ajaxHelper = this;
  this.bindEvents = function() {
    $('.size-box').on('click', '.form-btn', this.getNewForm);
    $('.size-box').on('click', '#size-create', this.createSize);
  }

  this.getNewForm = function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).data('href'),
      dataType: 'script'
    }).complete(function(response) {
      $('#size-form').html(response.responseText);
    });
  }

  this.createSize = function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).data('href'),
      type: 'POST',
      data: $('#new_size').serialize(),
      dataType: 'JSON'
    }).complete(function(data) {
      response = JSON.parse(data.responseText)
      if(response.error)
        $('#error-content').html(response.error);
      else {
        var size_text = ajaxHelper.getSizeText(response);
        $('#new_size').remove();
        $('#error-content').hide();
        var color_name = 'color_' + response.size.color_id;
        var $current_row = ajaxHelper.getCurrentRow(response);
        ajaxHelper.createCurrentRow($current_row, size_text, response);
        ajaxHelper.displayCurrentRow(color_name, $current_row);
      }
    });
  }

  this.displayCurrentRow = function(color_name, $current_row) {
    if ($('.size-table tr.' + color_name).length >= 1)
      $current_row.insertAfter($(".size-table tr." + color_name).last());
    else
      $current_row.appendTo($('.size-table'));
    $current_row.effect("highlight", {}, 3000);

  }

  this.getSizeText = function(response) {
    return [response.size.name, response.size.sku, response.color, response.size.price, response.size.discounted_price, response.size.quantity];
  }

  this.createCurrentRow = function($current_row, size_text, response) {
    for(var i = 0, len = size_text.length; i < len; i++) {
      $current_row.append($('<td/>').html(size_text[i]));
    }
    var link_data = $('<td/>');
    ajaxHelper.createEditLink(response, link_data);
    ajaxHelper.createDestroyLink(response, link_data);
    link_data.appendTo($current_row);
  }

  this.createEditLink = function(response, link_data) {
    var edit_link = $('<a/>').addClass('btn-primary btn').attr({'href': ('/admin/sizes/' + response.size.id + '/edit'), 'data-remote': 'true'}).html('Edit');
    edit_link.appendTo(link_data);
  }

  this.createDestroyLink = function(response, link_data) {
    var delete_link = $('<a/>').addClass('btn-primary btn').attr({'href': ('/admin/sizes/' + response.size.id), 'data-confirm': "You are going to delete 12 size. Sure?", 'data-method': 'delete', 'data-remote': 'true', 'rel': 'nofollow'}).html('Destroy');
    delete_link.appendTo(link_data);
  }

  this.getCurrentRow = function(response) {
    $current_row = $('<tr/>', {
      id: ("size_" + response.size.id)
      }).addClass('color_' + response.color);
    return $current_row;
  }
}