jQuery(document).ready(function(){

  jQuery('.savedBasket').click(function(event){
    event.preventDefault();
    toastr.info('Loading Saved Order: '+jQuery(this).find('li').attr('name'));
    data = {
      "mode": "updateBasketData",
      "_targetupdateBasket": "basket.html?vid="+jQuery('#vid').val(),
      "_targetupdateBasketData": "basket.html?vid="+jQuery('#vid').val(),
      "_targetcheckout": "checkout.html?vid="+jQuery('#vid').val(),
      "bd_nickname" : jQuery(this).find('li').attr('name'),
      "bd_mode" : 'r'
    };
    var redirectURL = data._targetupdateBasket;

    jQuery.ajax({
      url: 'basket.html?tptm=json_en&vid='+jQuery('#vid').val(),
      type: 'POST',
      data: data,
      success: function(data, textStatus, jqXHR){
        console.log(data.match(/saved/)[0]);
        toastr.success("Saved Order Loaded Successfuly.<br/>Redirecting to Basket...");
        window.location.replace(redirectURL);
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
        toastr.error("Couldn't Load your Saved Order.");
      }
    });
    
  });

});