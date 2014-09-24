function lineItemAdd(){	
	
    //properties 	
    this.invhistidtmp= '';
    this.optionid = '';
    this.itemCode = '';
    this.mode = '';
    this.qty = '';
    this.vid = jQuery('#line_vid').val();
    this.htmlField = {
        'itemCode':'#line_itemCode',
	'qty':'#line_qty',
	'addButton':'#line_addButton',
	'notification': '#line_notification',
	'loading': '#line_loading',
	'vid': '#line_vid'	
    };
	
    //Setters	
    this.set_itemCode = function (val){
	this.itemCode = val.replace('.','-').replace('<','+').replace('>','+').replace('(','+').replace(')','+');
    }
    this.set_qty = function (val){
   	this.qty = val;
    }
    this.set_mode = function (val){
	this.mode = val;
    }
    this.set_vid = function (val){
    	this.vid = val;
    }
    this.set_htmlField = function(field, val){		
	this.htmlField[field] = val;		
    }
    this.set_invhistidtmp = function (val){
    	this.invhistidtmp = val;
    }
    this.set_optionid = function (val){
	this.optionid = val;
    }
    this.get_optionid = function (){
	return this.optionid;
    }
	
	
    //Getters	
    this.get_invhistidtmp = function (){
    	return this.invhistidtmp;
    }
    this.get_itemCode = function (){
	return this.itemCode;
    }
    this.get_mode = function (){
	return this.mode;
    }
    this.get_qty = function (){
	return this.qty;
    }
    this.get_vid = function (){
	return this.vid;
    }
    this.get_htmlField = function(field){		
	return this.htmlField[field];		
    }

    //Methods		
    this.CheckDeliveryoption = function(){
        var obj=this;
        jQuery.ajax({
            url: 'getdeliveryoptions.ajx',
            data : "vid="+this.get_vid()+"&qty=" + this.get_qty() + "&invcode=" + this.get_itemCode() + "&mode="+this.get_mode()+"&optionid="+this.get_optionid(),
            dataType : 'json',
            type : 'get',
            success : function(data) {
                var responseText = data;							
                if(!responseText.error){
                var deliveryOption = responseText.__Result;
					
                if (deliveryOption.status == 2) {
                    this.isSuncess = false;
                    this.message = deliveryOption.message;
                        jQuery(obj.get_htmlField('loading')).hide();
                        jQuery(obj.get_htmlField('notification')).html(this.message);
                        jQuery(obj.get_htmlField('notification')).fadeOut(10000, function(){							
                        jQuery(obj.get_htmlField('addButton')).show();
		});
		} else if (deliveryOption.status == 3) {
                    this.isSuccess = true;
                    if(obj.optionid==5)
                        jQuery(obj.get_htmlField('qty')).val(deliveryOption.changeqtyto);
                            _lineItemAdd = new lineItemAdd();
                            _lineItemAdd.set_mode("query");
                    if (deliveryOption.invhistid != undefined) {
                            _lineItemAdd.set_invhistidtmp(deliveryOption.invhistid);
                    }
                    _lineItemAdd.readFields();
                    _lineItemAdd.LineAdd(); 
                    jQuery("#js-popup-message").hide();
		}
                else if (deliveryOption.status == 1) {
                    var radioData = {};
                    radioData.name = 'delivery-option';
                    radioData.options = new Array();
                    var idx = 0;
                    var options = deliveryOption.options.sort(function(a,b) {
                return a.optionid-b.optionid;
                });
		
                for(var k = 0; k < options.length; k++){
                    var optdata = {};
                    optdata.value = options[k].optionid;
                    optdata.content = options[k].option;
                    if (idx==0)
                        optdata['default'] = 'true';
                    else
                        optdata['default'] = 'false';
                    idx++;
                    radioData.options.push(optdata);
                }

                this.radio = new Commerce.RadioButton(radioData);

                var buttonDiv = jQuery.create('div');
                var okData = {};
                okData.href = 'javascript:void(0);';
                okData.content = deliveryOption.ok;
                okData.css = ['popup_button'];
                okData.events = [['click', 'updateDeliveryOption', this]];
                var button = new Commerce.Link(okData);
                buttonDiv.append(button.toElement());

                var cancelData = {};
                cancelData.href = 'javascript:void(0);';
                cancelData.content = deliveryOption.cancel;
                cancelData.css = ['popup_button'];
                cancelData.events = [['click', 'cancel', this]];
                button = new Commerce.Link(cancelData);
                buttonDiv.append(button.toElement());
                var el_radio = this.radio.toElement();

                this.popup = new Commerce.Popup(deliveryOption.title, el_radio, deliveryOption.note, buttonDiv);
                this.popup.show();
                } 

                }
            }, // end success
            error: function(){},
            cancel: function() {
                this.popup.hide();
                _lineItemAdd = new lineItemAdd();
                jQuery(_lineItemAdd.get_htmlField('loading')).hide();
                jQuery(_lineItemAdd.get_htmlField('addButton')).show();
            },
            updateDeliveryOption: function(){
                _lineItemAdd = new lineItemAdd();
                _lineItemAdd.set_mode("update");
                _lineItemAdd.set_optionid(this.radio.getValue());
                _lineItemAdd.readFields();
                _lineItemAdd.CheckDeliveryoption(); 
            }
        });	
    } //end function CheckDeliveryoption 
	
	
    this.LineAdd = function(){

		var _this = this;
		this.clearNotification();
		jQuery(this.get_htmlField('addButton')).hide();
		jQuery(this.get_htmlField('loading')).show();		
		jQuery(this.get_htmlField('notification')).show();
		
		jQuery.ajax({
			url: 'action.html',
			data : "mode=addItems&ic1=" + this.get_itemCode() + "&qty1=" + this.get_qty() + "&vid=" + this.get_vid() + "&url=basket.html?vid=" + this.get_vid()+"&invhistidtmp="+this.get_invhistidtmp(),
			dataType : 'html',
			type : 'get',
			success : function() {
// modJp
                            toastr.success('Processing item #' + _this.get_itemCode() + '<br />' + ' successfully added to the order');
//
//				jQuery(_this.get_htmlField('notification')).html('Item <span>' + _this.get_itemCode() + '</span> was added to cart');
                            jQuery(_this.get_htmlField('notification')).fadeOut(3000, function(){
                            jQuery(_this.get_htmlField('loading')).hide();
                            jQuery(_this.get_htmlField('addButton')).show();
// modJp                                        if(typeof(update_top_basket) == 'function') update_top_basket();

                            });
//$('#thisdiv').load(document.URL +  '#thisdiv');
//

                            jQuery.ajax({
                                url: 'basket.ajx',
   //       data: 'vid='+$vendorSettingsDTO.vendorId,
                                data: 'vid=20120606532',
                                type: 'get',
                                dataType: 'json',
                                    success: function(response){
                                        var result = response['__Result'],
                                        len = result['basketItems'].length;
                                        var total = 0;
                                        var str = '';                
            
                                        total = parseFloat(result.total);
                                        jQuery('.mini-basket-total').text('$'+total.toFixed(2));
                                        //reset the form
                                        jQuery(_this.get_htmlField('itemCode')).val('');
                                        jQuery(_this.get_htmlField('qty')).val('');
                                        jQuery('#line_itemCode').focus();

            }  });
//
//                     jQuery('.mini-basket-total').load(document.URL +  '.mini-basket-total');


				if(location.href.search('basket.html') != -1){
					location.reload(true);
				}
			},
			error: function(){
				jQuery(_this.get_htmlField('notification')).html('Item <span>' + _this.get_itemCode() + '</span> was not added to cart');
				jQuery(_this.get_htmlField('notification')).fadeOut(3000, function(){
					jQuery(_this.get_htmlField('loading')).hide();
					jQuery(_this.get_htmlField('addButton')).show();
                                        jQuery(_this.get_htmlField('itemCode')).focus();
                                        jQuery(_this.get_htmlField('itemCode')).val('');
				});
			}
		});	
	
    } // end function LineAdd


    this.checkItem = function(){
        var _this = this;
        this.clearNotification();
            jQuery(this.get_htmlField('addButton')).hide();
            jQuery(this.get_htmlField('loading')).show();		
            jQuery(this.get_htmlField('notification')).show();
        var checkItemResult = false;
		
        jQuery.ajax({
            url : 'checkitem.ajx',
            data : 'vid='+ this.get_vid() +'&ic='+ this.get_itemCode()+'&qty='+this.get_qty(),
            dataType : 'json',
            type : 'get',
            async : false,
            success : function(data) {
                var success = data.__Success; 
                    if(success == "false") {
                        var message = data.__Message;
                        var type = data.__Type;
                        var delaytime = 3000;
                        
                        if(type == "Complex") {
                            delaytime = 5000;
                        }
// begin modJp
        toastr.error('Processing item #' + _this.get_itemCode().replace("-",".") + '<br />' + message);
//
// comment out line	jQuery(_this.get_htmlField('notification')).html(message);
// end modJp
                        jQuery(_this.get_htmlField('notification')).fadeOut(delaytime, function(){
                        jQuery(_this.get_htmlField('loading')).hide();
                        jQuery(_this.get_htmlField('addButton')).show();
                        });
                    } else {
			checkItemResult = true;
                    }
            }, // end success
            error: function(){
                jQuery(_this.get_htmlField('notification')).html('Item <span>' + _this.get_itemCode() + '</span> was not added to cart');
                jQuery(_this.get_htmlField('notification')).fadeOut(3000, function(){
                jQuery(_this.get_htmlField('loading')).hide();
                jQuery(_this.get_htmlField('addButton')).show();
                jQuery('.mini-basket-total').text('$'+total.toFixed(2));
                                                        jQuery(_this.get_htmlField('itemCode')).focus();
                                                       jQuery(_this.get_htmlField('itemCode')).val('');
            });
            }
		});	
		return checkItemResult;
    } // end function checkItem
	
    this.readFields = function(){
        this.set_itemCode(jQuery(this.get_htmlField('itemCode')).val());
        this.set_qty(jQuery(this.get_htmlField('qty')).val());
    } // end function readFields
	
    this.clearNotification = function(){
        jQuery(this.get_htmlField('notification')).text('');
    } // end function clearNotification
	

		
}