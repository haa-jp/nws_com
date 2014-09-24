(function($){
  var methods = {
    init : function(options){ 
      
      return this.each(function(){
                 
        var settings = $(this).data('quickadd');
         
        //if the plugin hasn't been initialized yet
        if (!settings){
        
          //quickadd settings
          settings = $.extend({
            'vendorId': '',
            'itemId': $(this).find(':hidden').val(),
            'idSeparator': '_',
            'feedback': 'quicklookFeedback'
          }, options);
                                        
          $(this).data('quickadd', settings);

          //buttons settings, saving quicklook reference to elements
          $(this).find(':button').data('quickadd',$(this));   
          $(this).find('input:text').data('quickadd',$(this));         
          
          //buttons events
          $(this).find(':button').click(function(){
            var quickadd = $(this).data('quickadd');
            quickadd.quickadd('addToCart');
          });

          //input text focus in
          $(this).find('input:text').focusin(function(){
            var value = $(this).val().trim();
            if(value == 'Qty.'){
              $(this).val('');
            }
          });

          //input text focus out
          $(this).find('input:text').focusout(function(){
            var value = $(this).val().trim();
            if(value == ''){
              $(this).val('Qty.');
            }
          }); 

          //input text ENTER key event
          $(this).find('input:text').keypress(function(e)
          {
            code= (e.keyCode ? e.keyCode : e.which);
            if (code == 13){
              var quickadd = $(this).data('quickadd');
              quickadd.quickadd('addToCart');
            }
            
          });
          
        }
      });
      
    },
    addToCart : function(){
      var settings = $(this).data('quickadd');               
      var qty = $(this).parent().find(':text').val();
      $(this).parent().find(':text').val('Qty.');
      var params = 'mode=addItems&iid1='+settings.itemId+'&qty1='+qty+'&vid='+settings.vendorId+'&noredirect';      
         
      if(!validate_qty(qty)){
        toastr.warning('Please enter a valid quantity.');
        return false;        
      }
      
      toastr.info('Processing Item to Cart...')
      
      $.ajax({
        url: 'action.html',
        data: params,
        type: 'get',
        dataType : 'json',
        success: function(){ 
          /*
           $('#'+settings.feedback+settings.idSeparator+settings.itemId).html('Item Added to Cart!').fadeOut(2000,function(){
            $(this).html('').show();
           });
*/
           update_minibasket(settings.vendorId); 
           toastr.success('Item Added to Cart!')                          
        },
        error: function(){
          /*
           $('#'+settings.feedback+settings.idSeparator+settings.itemId).html('Failed Adding to Cart!').fadeOut(2000,function(){
            $(this).html('').show();
           });
           */  
           update_minibasket(settings.vendorId);
           toastr.error('Failed Processing Item to Cart!')
           
           if(document.location.href.indexOf('basket.html') >= 0){
             document.location.reload();
           }
        }
      })
      
    }    
  };

  //GLOBAL FUNCTIONS
  
  //quicklook qty field
  function validate_qty(qty){
    return String(qty).search (/^\s*\d+\s*$/) != -1
  }

  //update minibasket 
  function update_minibasket(vid){
    $.ajax({
      url: 'basket.ajx',
      data: 'vid='+vid,
      type: 'get',
      dataType: 'json',
      success: function(data){
        var items = data.Products.length;
        var total = 0;
        var str = '';                

        for(var i=0; i<items; i++){
          total += parseFloat(data.Products[i].totalPrice.replace(',',''));
        }
        
        $('.mini-basket-qty').text(items)
        $('.mini-basket-total').text('$'+total.toFixed(2))
      } 
    });
  }

  $.fn.quickadd = function(method){       
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method [ ' +  method + ' ] does not exist' );
    }        
  }    
   
})(jQuery);