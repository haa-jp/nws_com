// Prototype trim for general use
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

var lostDialog = jQuery('#dialog');
var formDialog = jQuery('#lost-form');
var notificationDialog = jQuery("#dialog-notifications");
var sendButton;
jQuery(document).ready(function(){

  lostDialog.dialog({
      autoOpen: false,
      width: 400,
      modal: true,
      resizable: false,
      buttons: {
          "Send": function (evt) {
            formDialog.trigger('submit');
          },
          "Cancel": function () {
            jQuery(this).dialog("close");
          }
      },
      open: function(event, ui) {
        lostSale._dialogErrorHide();
      }
  });

  jQuery('#lost-sale').on('click', function(evt){
    evt.preventDefault();
    lostDialog.dialog('open');
  });

  formDialog.on('submit', function(evt){
    evt.preventDefault();
    lostSale.sendMessage();
  });

});


var lostSale = {
  
  sendMessage: function() {
    if (data = this._readInputs(jQuery('#lost-form'))) {
      toastr.info("Sending request...");
      jQuery.ajax({
        data: data,
        url: lost_sale_url + 'lost-sale.php',
        type: 'post',
        dataType: 'json',
        success: this._messageSuccess(data)
      });
    }
  },

  _readInputs: function(form) {
    this._dialogErrorHide();
    var qty = form.find('#lost-qty');
    var comment = form.find('#lost-comment');
    var regex = /^\d+$/;
    if (!regex.match($(qty).val()) || parseInt($(qty).val()) < 1) {
      this._dialogError(qty, 'Please input a valid quantity');
      return false;
    }

    if (!$(comment).val().trim()) {
      this._dialogError(comment, 'Please type in a comment.');
      return false;
    }
    return form.serialize();
  },

  _dialogError: function(target, message) {
    $(target).addClass('highlight-red');
    this._dialogErrorShow().text(message);
  },

  _dialogErrorShow: function() {
    return notificationDialog.addClass('notification-error').show();
  },

  _dialogErrorHide: function() {
    notificationDialog.removeClass('notification-error').hide();
    lostDialog.find('.highlight-red').removeClass('highlight-red');
  },

  _messageSuccess: function(data) {
    this._success(data);
  },

  _success: function(data) {
    toastr.success('Lost sale request send');
    lostDialog.dialog('close');
  }
};