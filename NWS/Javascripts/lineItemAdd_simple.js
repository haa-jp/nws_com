<script type="text/javascript">
  jQuery("#line_itemCode").focus()
  jQuery("#nws-add").bind('click', function(){
    if(jQuery("#line_itemCode").val() == '' || jQuery("#line_qty").val() == ''){
      return false;
    }
    
    var params = 'mode=addItems&ic1='+ jQuery("#line_itemCode").val().replace(/\./g, "-") +'&qty1='+ jQuery('#line_qty').val() +'&vid='+ $vendorSettingsDTO.vendorId +'&noredirect';
    jQuery("#line_itemCode").val('')
    jQuery('#line_qty').val('')
    toastr.success('Processing Item to Cart...')

    jQuery.ajax({
      url: 'action.html',
      type: 'get',
      data: params,
      dataType : 'json',
      success: function(data){
        
        toastr.success('Item Added to Cart!') 
          
        jQuery.ajax({
          url: 'basket.ajx',
          data: 'vid='+$vendorSettingsDTO.vendorId,
          type: 'get',
          dataType: 'json',
          success: function(response){
            var result = response['__Result'],
            len = result['basketItems'].length;
//            var items = data.Products.length;
            var total = 0;
            var str = '';                
            
            total = parseFloat(result.total);
            jQuery('.mini-basket-total').text('$'+total.toFixed(2));

/*            for(var i=0; i<len; i++){
 *             total += parseFloat(data.Products[i].totalPrice.replace(',',''));
 *           }
 *           jQuery('.mini-basket-qty').text(items)
 *           jQuery('.mini-basket-total').text('$'+total.toFixed(2));
 *                      
 */           if(document.location.href.indexOf('basket.html') >= 0) {
               document.location.reload();
            }
          },
          error: function(){
            toastr.error('Failed Processing Item to Cart!')
          } 
        });

      }
    });
  });  