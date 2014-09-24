// c8.5
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

if (!window.console) console = {log: function() {}};

(function($){
  var methods = {
    init : function(options){ 
      console.log('call init');
      var self = $(this)
      return $(this).each(function(){
        console.log('in the esch');
        var settings = $(this).data('quicklook');
         
        //if the plugin hasn't been initialized yet
        if (!settings){
        
          //quicklook settings
          settings = $.extend({
            'vendorId': '',
            'itemId': '',
            'btn_add': 'addToCart',
            'btn_add_label': 'Add To Basket',
            'triggeClass': 'quicklook_trigger',
            'idSeparator': '_',
            'currencySymbol': '$',
            'isLoggedIn': false,
            'feedback': 'quicklookFeedback',
            'nws': 'NWS Part #: ',
            'msrp': 'MSRP: '
          }, options);
                                        
          $(this).data('quicklook', settings);
          
          //quicklook html
          var quicklook_html = {            
            'image' : '<div id="quicklook_image"></div>',
            'description' : '<div id="quicklook_description"></div>',
            'shortdesc' : '<div id="quicklook_shortdesc"></div>',
            'logo' : '<div id="quicklook_logo"></div>',
            'title' : '<h3 class="quicklook_title"></h3>',
            'code' : '<h4 class="quicklook_code"></h4>',
            'price' : '<div id="quicklook_price"></div>',
            'msrp'  : '<div id="quicklook_msrp"></div>',
            'inventory' : '<div id="quicklook_inventory"></div>',
            'quantity' : '<div id="quicklook_quantity_wrapper"><input id="quicklook_quantity" type="text" value="Qty." /></div>'   
          };                              
          var _html = '<div id="quicklook_loading">Geting Item Information...</div>' + 	
                      '<div id="quicklook_content">' +
                         '<div id="quicklook_actions">' +
                            quicklook_html.title +
                            '<div class="left">'  + quicklook_html.image+ '</div>' +
                            '<div class="right">'+ quicklook_html.logo + quicklook_html.code + quicklook_html.price  + quicklook_html.msrp  + quicklook_html.inventory + quicklook_html.quantity +  
                               '<div>' + quicklook_html.shortdesc + '</div>' + 			
                            '</div>'  +
                            quicklook_html.description +
                         '</div>'+

                      '</div>';
          
          $(this).html(_html);

          //buttons events
          $('.'+settings.btn_add).click(function(){
            $(self).quicklook('addToCart');
          });

          $('.'+settings.triggeClass).click(function(e){
            if(e.preventDefault){
              e.preventDefault();
            }
            //checking if modal is open
            if($('.bootbox').length>0){
              return false;
            }
            var settings = $(self).data('quicklook');            
            var itemid = $(this).attr('id').split('_')[1];
            $(self).quicklook('show',itemid);            
          }); 
          
        }
      });
    },

    show : function(itemid){
      console.log('call show');
      //Updating settings
      var settings = $(this).data('quicklook'),
        quicklook = $(this),
        self = $(this);
      settings.itemId = itemid;
      $(this).data('quicklook', settings);

      bootbox.dialog(self.html(),
        [
          {
            "label" : settings.btn_add_label,
            "class" : "btn-primary",
            "callback": function() {
              self.quicklook('addToCart');    
            }
          }, 
          {
            "label" : "Close",
            "class" : "btn"
          }
        ],
        {
          "backdrop": false
        }
      );                       
      
          //input text focus in
          $('.bootbox').find('#quicklook_content #quicklook_quantity').focusin(function(){
            var value = $(this).val().trim();
            if(value == 'Qty.'){
              $(this).val('');
            }
          });

          //input text focus out
          $('.bootbox').find('#quicklook_content #quicklook_quantity').focusout(function(){
            var value = $(this).val().trim();
            if(value == ''){
              $(this).val('Qty.');
            }
          }); 

          //input qty ENTER key event
          $('.bootbox').find('#quicklook_content #quicklook_quantity').keypress(function(e)
          {
            code= (e.keyCode ? e.keyCode : e.which);
            if (code == 13){
              $(self).quicklook('addToCart');
            }
          });

      //ajax call//     
      $.ajax({
        url : 'getitems.ajx',        
        data : "itemid="+settings.itemId+"&vid="+settings.vendorId,
        dataType : 'json',
        type : 'get',
        success : function(data) {
          console.log('item returned');
          //getting response data  
          obj = data.__Result[0];
          
          //handling inventory
          var inv = 0;
          if(obj.invs.length > 0){
            inv = parseInt(obj.invs[0].instock);
          }
          
          var price = 'Login to see Price';
          if(settings.isLoggedIn){
            price = settings.currencySymbol+obj.prices[0].price_1;            
          }

          var msrp = 'Login to see Price';
          if(settings.isLoggedIn){
            msrp = settings.currencySymbol+obj.prices[0].listprice;            
          }

		  var logo = null;             
			$.each( obj.hiddenProperties, function( i, val ) {
			    if (typeof val.propname === "undefined"){
			      return;
			    }
			      if (val.propname == 'Logo'){
			      logo = val.propvalue;
			        //alert(logo);
			   }  
			});

          var quicklook_sections = {
          	'code'        : settings.nws+obj.code.replace('-','.'),
            'description' : obj.longdesc,
            'price'       : price,
            'msrp'        : settings.msrp+msrp,
            'image'       : obj.image.replace('store/','/'),
            'inventory'   : inv,
            'logo'        : logo,
            'shortdesc'   : obj.shortdesc,
            'title'       : obj.title,
            'p_link'       : '<a href="store.html?vid=' + obj.vendorid + '&iid=' + obj.itemid +'"> See full details... </a>'
          };                               
          
          //quicklook content render
          var quicklook_loading   = $('.bootbox').find('#quicklook_loading');   
          var quicklook_content   = $('.bootbox').find('#quicklook_content');
          var quicklook_title     = $('.bootbox').find('.quicklook_title');
          var quicklook_code      = $('.bootbox').find('.quicklook_code');
          var quicklook_shortdesc = $('.bootbox').find('#quicklook_shortdesc');
          var quicklook_description = $('.bootbox').find('#quicklook_description');
          var quicklook_addButton = $('.bootbox').find('.btn-primary');   

          // relpace discription with p_link and offer a link to the item page
          quicklook_content.find('#quicklook_description').html(quicklook_sections.p_link);
          quicklook_content.find('#quicklook_price').html(quicklook_sections.price);
          quicklook_content.find('#quicklook_msrp').html(quicklook_sections.msrp);
          quicklook_content.find('.quicklook_title').html(quicklook_sections.title);
          quicklook_content.find('.quicklook_code').html(quicklook_sections.code);
    
          if(quicklook_sections.shortdesc != ''){
	          quicklook_content.find('#quicklook_shortdesc').html(quicklook_sections.shortdesc);
          }

          
          if(quicklook_sections.image.indexOf('http') >= 0){
            quicklook_content.find('#quicklook_image').html('<img src="'+quicklook_sections.image+'" alt="'+quicklook_sections.title+'" />');          
          }
          else{
            quicklook_content.find('#quicklook_image').html('<img src="store'+quicklook_sections.image+'" alt="'+quicklook_sections.title+'" />');          
          }
          
          var inventory_html = 'In Stock: Please Call';
          if(quicklook_sections.inventory>0)  {
            inventory_html = 'In Stock: ' + inv; 
            quicklook_content.find('#quicklook_quantity_wrapper').show();
            //quicklook_addButton.show();
          }     
          quicklook_content.find('#quicklook_inventory').html(inventory_html);
          
          if(settings.isLoggedIn){
            quicklook_content.find('#quicklook_price').removeClass('noPrice');                        
          }else{
            quicklook_content.find('#quicklook_price').addClass('noPrice');                        
          }
          
          var path = 'https://catalog.northernwholesale.com/logos/';
          if(quicklook_sections.logo != null ) {
          	quicklook_content.find('#quicklook_logo').html ('<img src="' + path + quicklook_sections.logo +'" alt="mfg logo" />');
          }else{
          	quicklook_content.find('#quicklook_logo').html ('<p>No Logo Available</p>');
          }
          
          quicklook_loading.hide();
          quicklook_content.show(); 

          
        },
        error : function (data) {
          console.log('item not returned');
          toastr.error('Failed to get Item!')
        }
      });
      //end ajax call//             
      
    },
    
    hide : function(){ 
      console.log('call hide');      
      $(this).dialog('close');      
    }, 
    
    addToCart : function(){
      console.log('call addToCart');
      var settings = $(this).data('quicklook'),
      qty = $('.bootbox').find('#quicklook_content #quicklook_quantity').val(),          
      params = 'mode=addItems&iid1='+settings.itemId+'&qty1='+qty+'&vid='+settings.vendorId+'&noredirect';
      $('.bootbox').find('#quicklook_content #quicklook_quantity').val('Qty.')
         
      if(!validate_qty(qty)){
        toastr.warning('Please enter a valid quantity.');
        return false;        
      }

      toastr.success('Processing Item to Cart...')

      $.ajax({
        url: 'action.html',
        data: params,
        type: 'get',
        dataType : 'json',
        success: function(resp){ 
           update_minibasket(settings.vendorId);
          if(resp.__Success=='true')
    		  toastr.success('Item Added to Cart!')
    	  else{
    		  var resultmap = resp.result;
    		  var resultmap1=resultmap[0];
    		  var message="";
    		  for(var key in resultmap1){
    			  message=resultmap1[key];
    			  break;
    		  }   		 
    		  toastr.error(message)
    	  }
        },
        error: function(){
           update_minibasket(settings.vendorId);  
           toastr.error('Failed Processing Item to Cart!')
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
      success: function(response){
      	
      	var result = response['__Result'],
      	   i = 0,
      	   len = result['basketItems'].length,
           qty = 0,
           total = 0;

        total = parseFloat(result.total);

//		Remove Coments to dynamically update number of item ins cart
/*        for(var i=0; i<len; i++){
  	       qty = qty + result['basketItems'][i]['qty'];
        }
        
        $('.mini-basket-qty').text(qty)
*/        $('.mini-basket-total').text('$'+total.toFixed(2));
      } 
    });
  }

  $.fn.quicklook = function(method){       
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