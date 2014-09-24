Commerce.Shop = {};

Commerce.Shop.ItemPage = jQuery.klass({

	initialize: function(vid, basketItemId,targetdiv) {

		this.vid = vid;
		if (basketItemId != undefined && basketItemId != '') {
			this.basket = new Commerce.Domain.Basket(vid);
			this.product = this.basket.findProduct(basketItemId);
			if (this.product.domain==undefined || this.product.domain.length==0)
				this.product = undefined;
		}
		this.itemElements = this.collectItemOnPage(targetdiv);
		for (var idx=0; idx<this.itemElements.length; idx++) {
			this.itemElements[idx].show();
		}
	},

	collectItemOnPage: function(targetdiv) {
		var divs = jQuery(targetdiv+'div[id^="js-item"]'); //js-item-propName(attributes, images, description, title, code)-$(itemid)
		var spans = jQuery(targetdiv+'span[id^="js-item"]');
		var p = jQuery(targetdiv+'p[id^="js-item"]');
		var links = jQuery(targetdiv+'a[id^="js-item"]');
		var imgs = jQuery(targetdiv+'img[id^="js-item"]');
		var inputs = jQuery(targetdiv+'input[id^="js-item"]');
		divs = divs.toArray().concat(spans.toArray());
		divs = divs.concat(links.toArray());
		divs = divs.concat(imgs.toArray());
		divs = divs.concat(inputs.toArray());
		divs = divs.concat(p.toArray());

		var items = new Hashtable();
		var itemids = new Hashtable();

		for(var idx=0; idx<divs.length; idx++) {
			var ids = divs[idx].id.split('-');
			if (ids.length>=4 && ids[0]=='js' && ids[1]=='item') {
				itemids.put(ids[3], ids[3]);
			}
		}

		if(itemids.keys().length>0){
            var tmp = new Commerce.Domain.Item(this.vid, itemids.keys());
            var skuIds = [];
            for(var g=0,k=itemids.keys().length; g<k;g++){
                tmp = Commerce.Cache['item'].get(itemids.keys()[g]-0);
                if(tmp && tmp.skuids && tmp.skuids.length >0){
                    jQuery(tmp.skuids).each(function(){
                        //if(skuIds.indexOf(this)<0)skuIds.push(this);});
                        if(jQuery.inArray(this, skuIds))skuIds.push(this);});
                }
            }
            tmp = new Commerce.Domain.Item(this.vid, skuIds);
            for(g=0,k=itemids.keys().length; g<k;g++){
                tmp = new Commerce.Domain.Item(this.vid, itemids.keys()[g]-0);
                if(tmp){
                    tmp.initPricesOpt();
                }
            }
        }

		var basketNumber = 0;
		var divLength = divs.length;
		for(var idx=0; idx<divLength; idx++) {
			ids = divs[idx].id.split('-');
			/** 0: js; 1 : item; 2: propname; 3: itemid; 4: item serial # */

			if (ids.length>=4 && ids[0]=='js' && ids[1]=='item') {
				var key ;
				if (ids[4] != undefined && ids[4] != null)
					key = ids[3]+"-"+ids[4];
				else
					key = ids[3];
				var eItem = items.get(key);

				if (!eItem) {
					eItem = new Commerce.Shop.ItemPage.Item(ids[1], new Commerce.BO.Sku(this.vid, ids[3]), this.product, basketNumber);
					basketNumber++;
				}
				eItem.addContainer(ids[2].toLowerCase(), divs[idx]);
                eItem.addContainerKey(ids[2].toLowerCase());
				items.put(key, eItem);
			}
		}
        var itemList = new Array();
        for(var t=0,l=itemids.keys().length; t<l; t++){
            var	itemId = itemids.keys()[t];
            for(var i=0; i<basketNumber; i++) {
                var key = itemId;
                if (0 < i){
                    var key = itemId + "-"+ i;
                }
                var itemFound = items.get(key);
                if (itemFound !== null){
                    itemList.push(itemFound);
                }
            }
        }
		return itemList;
	},
	refresh: function() {
		for (var idx=0; idx<this.itemElements.length; idx++) {
			this.itemElements[idx].refreshItem();
		}
	},

	cleanCache: function() {
		Commerce.Cache.cleanAll();
	},
	
	refreshCallbacks: [],
	
	addRefreshCallback: function(fn) {
		
		this.refreshCallbacks.push(fn);
		
	},


	getRefreshCallback: function() {
		
		return this.refreshCallbacks;
		
	}

});

Commerce.Shop.ItemPage.Item = jQuery.klass({
	initialize: function(type, skuBO, product, basketNumber) {
		if (product)
			this.mode = 'edit';
		else
			this.mode = 'new';
		this.product = product;
		this.vid = skuBO.vid;
		this.formName = 'F'+skuBO.item.domain.itemid;
		this.currentSkuBO = skuBO;
		this.mainItemBO = skuBO.getMainItemBO();
		this.containers = new Hashtable();
		this.inserters = new Hashtable();
		this.containerKeys = new Array();
		this.type = type; //item
		this.compositeCode = '';
		this.inventoryCode = '';
		this.price = this.currentSkuBO.item.getPrice(this.compositeCode); //Item price
        this.priceLow = this.currentSkuBO.item.getLowPrice(); // Minimal price of all the child items
        this.priceHigh = this.currentSkuBO.item.getHighPrice(); //Maximum price of all the child items
		this.inventory = undefined; //item inventory
		this.qty = 1; //item quantity
		if (this.mode=='edit')
			this.qty = this.product.domain.qty;
		this.allAttributesSelected = false;
		this.hiddenFields;
		this.basketNumber = basketNumber;
		this.validated = false;
	},

	addContainer: function(propName, container) {
		this.containers.put(propName, container);
	},

	addContainerKey: function(propName) {
		this.containerKeys.push(propName);
	},
	
    presetMinOrderQty: function() {
        if (this.mode=='edit')
        	return;
        var code = this.compositeCode;
        var inv = this.currentSkuBO.item.findInventory(code);
        if (inv.length!=0 && inv[0].minorderqty>1)
        	this.qty=inv[0].minorderqty;
        else
        	this.qty=1;
        console.log(this.qty);
	},	
	
	refreshItem: function() {
		var attribute = this.inserters.get("attributes");
		var newSkuBO = attribute.refreshValue();
		if (newSkuBO.item.domain.itemid != this.currentSkuBO.item.domain.itemid) {
			this.currentSkuBO = newSkuBO;
			this.compositeCode = attribute.getCompositeCode();
			this.inventoryCode = attribute.getInventoryCode();
			this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
			this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
			this.presetMinOrderQty();
			this.allAttributesSelected = attribute.isAllSelected();
			this.refresh();
		}
		else { // no sku refresh, but composite code refresh
			var compCode = attribute.getCompositeCode();

			if (compCode!='' && this.compositeCode!=compCode) {

				this.compositeCode = compCode;
				this.inventoryCode = attribute.getInventoryCode();
				this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
				this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
				this.presetMinOrderQty();
				this.refreshListprice('listprice');
				this.refreshInventory('inventory');
				this.refreshPrice('price');
				this.refreshNoprice('noprice');
				this.refreshPricedollar('pricedollar');
				this.refreshPricecent('pricecent');
                this.refreshPricedollarlow('pricedollarlow');
				this.refreshPricecentlow('pricecentlow');
                this.refreshPricedollarhigh('pricedollarhigh');
				this.refreshPricecenthigh('pricecenthigh');
                this.refreshSavepercentage('savepercentage');
				this.refreshSaveamount('saveamount');
			}

			this.allAttributesSelected = attribute.isAllSelected();
			this.refreshAddtocartbtn('addtocartbtn');
			this.refreshNotifymebtn('notifymebtn');
		}
	},
	refreshItemByAttribute: function(event, propName) {
		var attribute = this.inserters.get(propName);
		var newSkuBO = attribute.refresh(event.target);
		if (newSkuBO.item.domain.itemid != this.currentSkuBO.item.domain.itemid) {
			this.currentSkuBO = newSkuBO;
			this.compositeCode = attribute.getCompositeCode();
			this.inventoryCode = attribute.getInventoryCode();
			this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
			this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
			this.presetMinOrderQty();
			this.allAttributesSelected = attribute.isAllSelected();
		}
		else { // no sku refresh, but composite code refresh
			var compCode = attribute.getCompositeCode();

			if (compCode!='' && this.compositeCode!=compCode) {

				this.compositeCode = compCode;
				this.inventoryCode = attribute.getInventoryCode();
				this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
				this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
				this.presetMinOrderQty();
				this.refreshListprice('listprice');
				this.refreshAwardpoint('awardpoint');
				this.refreshInventory('inventory');
				this.refreshPrice('price');
				this.refreshNoprice('noprice');
				this.refreshPricedollar('pricedollar');
				this.refreshPricecent('pricecent');
                this.refreshPricedollarlow('pricedollarlow');
				this.refreshPricecentlow('pricecentlow');
                this.refreshPricedollarhigh('pricedollarhigh');
				this.refreshPricecenthigh('pricecenthigh');
				this.refreshSavepercentage('savepercentage');
				this.refreshSaveamount('saveamount');
			}

			this.allAttributesSelected = attribute.isAllSelected();
			this.refreshAddtocartbtn('addtocartbtn');
			this.refreshNotifymebtn('notifymebtn');
		}
		jQuery('#parent-code-'+newSkuBO.item.domain.mainitemid).val(this.compositeCode);

		this.currentSkuBO.refreshLpImages();
		this.refresh();
		
		var callbacks = itempage.getRefreshCallback();
		
		if(callbacks.length > 0){
			
			var i = 0,
					len = callbacks.length;
			
			for(i; i < len; i+=1){
				
				callbacks[i].apply(newSkuBO.item.domain);
				
			}
			
		}
		
	},

	show: function() {
		var keys = this.containerKeys;

		for(var idx=0; idx<keys.length; idx++) {
			var container = this.containers.get(keys[idx]);
			var method  = keys[idx].split('_');
			if (!this['show'+method[0].capitalize()]){

			}else
				this['show'+method[0].capitalize()].call(this,  keys[idx]);
		}
	},
	refresh: function() {
		var keys = this.containers.keys();

		for(var idx=0; idx<keys.length; idx++) {
			var container = this.containers.get(keys[idx]);
			var method  = keys[idx].split('_');
			if (!this['refresh'+method[0].capitalize()]){
				//alert(method[0].capitalize());
			}
			else
				this['refresh'+method[0].capitalize()].call(this,  keys[idx]);

		}
	},

	isExist: function(name) {
		var el = this.containers.get(name);

		return el!=undefined;
	},

	showAttributes: function(propName) {
		if (this.isExist(propName)==false) return;
		var attribute = new Commerce.Shop.ItemPage.Attribute(propName, this.currentSkuBO);
		this.inserters.put(propName, attribute);
		attribute.show(this.containers.get(propName), this);

		this.compositeCode =  attribute.getCompositeCode();
		this.inventoryCode = attribute.getInventoryCode();
		this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
		this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
		this.presetMinOrderQty();

		this.allAttributesSelected = attribute.isAllSelected();
	},

	refreshAttributes: function(propName) {
		if (this.isExist(propName)==false) return;
	//do nothing
	},

	showTitle: function(propName) {
		if (this.isExist(propName)==false) return;
		jQuery(this.containers.get(propName)).html(this.currentSkuBO.item.domain.title);
	},

	refreshTitle: function(propName) {
		if (this.isExist(propName)==false) return;
		jQuery(this.containers.get(propName)).html(this.currentSkuBO.item.domain.title);
	},
	showCode: function(propName) {
		if (this.isExist(propName)==false) return;
		jQuery(this.containers.get(propName)).html(this.currentSkuBO.item.domain.code);
	},

	refreshCode: function(propName) {
		this.showCode(propName);
	},

	showYousave: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}

		if (this.price.customerDiscount<1 || this.price.listprice>this.price.price_1) {
			var message = new Commerce.Domain.Message(this.vid, "vm.categoryT_itemList.yousave");
			var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
			var amt = this.price.listprice-this.price.price_1;
			var percentage = Math.round((amt/this.price.listprice)*100);
			var s_amt = new String(amt);
			jQuery(this.containers.get(propName)).html(message.domain.message+" "+currency.domain.sign+" <span class='item-price-saved'>"+this.getDollar(s_amt)+"."+this.getCent(s_amt)+" ("+percentage+"%)</span>").show();
		}
		else {
			jQuery(this.containers.get(propName)).hide();
		}
	},

	refreshYousave: function(propName) {
		this.showYousave(propName);
	},

	showSavepercentage: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}
		var amt = Math.round((this.price.listprice-this.price.price_1)*100)/100;
		var percentage = Math.round((amt/this.price.listprice)*100);
		jQuery(this.containers.get(propName)).html(percentage+"%");
	},

	refreshSavepercentage: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}

		var amt = Math.round((this.price.listprice-Math.round((this.price.price_1*this.price.customerDiscount)*100)/100)*100)/100;
		var percentage = Math.round((amt/this.price.listprice)*100);
		jQuery(this.containers.get(propName)).html(percentage+"%");
	},

	showSaveamount: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}
		var amt = this.price.listprice-this.price.price_1;
		var s_amt = new String(amt.toFixed(2));
		jQuery(this.containers.get(propName)).html(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
	},

	refreshSaveamount: function(propName) {
		this.showSaveamount(propName);
	},

	showListpricewithtag: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}

		var message = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.listprice");
		if (this.price.customerDiscount<1 || this.price.listprice>this.price.price_1) {
			var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
			var amt = new String(this.price.listprice+this.price.setup);
			jQuery(this.containers.get(propName)).html(message.domain.message+": "+currency.domain.sign+" <span class=item-list-price>"+this.getDollar(amt)+"."+this.getCent(amt)+"</span>").show();
		}
		else {
			jQuery(this.containers.get(propName)).hide();
		}
	},

	refreshListpricewithtag: function(propName) {
		this.showListpricewithtag(propName);
	},

	showListprice: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}

		var amt = new String(Math.round((this.price.listprice+this.price.setup)*100)/100);
		jQuery(this.containers.get(propName)).html(this.getDollar(amt)+"."+this.getCent(amt));
	},

	refreshListprice: function(propName) {
		this.showListprice(propName);
	},
	

    showMinorderqty: function(propName) {
	if (this.mainItemBO.item.domain.attributes.length==0)
		return;
	var code = this.compositeCode;
            var inv = this.currentSkuBO.item.findInventory(code);
            if (inv.length!=0 && inv[0].minorderqty>1) {
                    var message = new Commerce.Domain.Message(this.vid, "commerce.shop.minorderqty");
                    if (message.domain!=undefined)
                            jQuery(this.containers.get(propName)).html(message.domain.message.replace("%%MinOrderQty%%", inv[0].minorderqty));
                    else
                            jQuery(this.containers.get(propName)).html(inv[0].minorderqty);

            } else
                    jQuery(this.containers.get(propName)).html('');
    },

    refreshMinorderqty: function(propName) {
            this.showMinorderqty(propName);
    },

    showMinorderqty4pitem: function(propName) {
            var inv = this.mainItemBO.item.findInventory(this.mainItemBO.item.domain.code);

            if (inv.length!=0 && inv[0].minorderqty>1) {
                    var message = undefined;
		if (this.mainItemBO.item.domain.attributes.length>0)
			message = new Commerce.Domain.Message(this.vid, "commerce.shop.minorderqty4pitem");
		else
			message = new Commerce.Domain.Message(this.vid, "commerce.shop.minorderqty4sitem");
                    if (message.domain != undefined) {
                            jQuery(this.containers.get(propName)).html(message.domain.message.replace("%%MinOrderQty%%", inv[0].minorderqty));

                    } else
                            jQuery(this.containers.get(propName)).html(inv[0].minorderqty);
            }
    },

    refreshMinorderqtyi4pitem: function(propName) {
            this.showMinorderqty4pitem(propName);
    },


	showRegprice : function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price.customerDiscount < 1) {
			if (this.price!=undefined) {
				this.containers.get(propName).parentNode.parentNode.style.display='block';
				jQuery(this.containers.get(propName)).show();
			} else {
				this.containers.get(propName).parentNode.parentNode.style.display='none';
				jQuery(this.containers.get(propName)).hide();
				return;
			}
			var amt = this.price.price_1;
			var s_amt = new String(amt);
			jQuery(this.containers.get(propName)).html(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
		}
	},

	refreshRegprice : function(propName) {
		this.showRegprice(propName);
	},

	showExtrapercentage : function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price.customerDiscount < 1) {
			if (this.price!=undefined) {
				this.containers.get(propName).parentNode.parentNode.style.display='block';
				jQuery(this.containers.get(propName)).show();
			} else {
				this.containers.get(propName).parentNode.parentNode.style.display='none';
				jQuery(this.containers.get(propName)).hide();
				return;
			}
			var percentage = Math.round((1 - this.price.customerDiscount)*100);
			jQuery(this.containers.get(propName)).html(percentage+"%");
		}
	},

	refreshExtrapercentage : function(propName) {
		this.showExtrapercentage(propName);
	},

	showExtraamount : function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}
		var amt = Math.round((Math.round((this.price.price_1*(1-this.price.customerDiscount))*100)/100)*100)/100;
		var s_amt = new String(amt);
		jQuery(this.containers.get(propName)).html(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
	},

	refreshExtraamount : function(propName) {
		this.showExtraamount(propName);
	},

	showAwardpoint:function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}
		jQuery(this.containers.get(propName)).html(this.price.awardPoint);
	},

	refreshAwardpoint:function(propName) {
		this.showAwardpoint(propName);
	},

    showPricedollar:function(propName) {
            if (this.isExist(propName)==false) return;

            var priceDollar = '';

            if (this.price==undefined) {
                var message = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.callprice");
                priceDollar = message.domain.message;
            }
            else if (this.price.listprice <= 0.001) {
                var message = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.freeitem");
                priceDollar = message.domain.message;
            }
            else {
                var price = new String(this.calculatePrice(this.price, this.qty));
                priceDollar = formatCurrency(this.getDollar(price).toString(),this.price);;
                if (this.price.customerDiscount < 1) {
                    this.containers.get(propName).parentNode.parentNode.className += ' special-price';
                }
            }
            jQuery(this.containers.get(propName)).html(priceDollar).show();
    },
    refreshPricedollar:function(propName) {
            if (this.isExist(propName)==false) return;

            var priceDollar = '';

            if (this.price==undefined) {
                var message = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.callprice");
                priceDollar = message.domain.message;
            }
            else if (this.price.listprice <= 0.001) {
                var message = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.freeitem");
                priceDollar = message.domain.message;
            }
            else {
                var price = new String(this.calculatePrice(this.price, this.qty));
                priceDollar = formatCurrency(this.getDollar(price).toString(),this.price);;
            }
            jQuery(this.containers.get(propName)).html(priceDollar).show();

    },

	showPricecent:function(propName) {
		if (this.isExist(propName)==false) return;

        var priceCent = '';
        if (this.price!=undefined && this.price.listprice>0.001) {
            var price = new String(this.calculatePrice(this.price, this.qty));
            priceCent = this.getCent(price).toString();
        }

		jQuery(this.containers.get(propName)).html(priceCent).show();
	},
	refreshPricecent:function(propName) {
		this.showPricecent(propName);
	},

    showPricedollarlow:function(propName) {
        if (this.isExist(propName)===false) return;

        var priceDollarLow = '';

        var attributes = jQuery(this.containers.get("attributes")).find("[name^='attribute']");
        if (this.priceLow !== undefined && this.priceLow.listprice > 0.001
                && !this.comparePrice(this.priceLow, this.priceHigh)
                && attributes && !this.isAttributeSelected(attributes)) {

            var priceLow = new String(this.calculatePrice(this.priceLow, this.qty));
            priceDollarLow = formatCurrency(this.getDollar(priceLow).toString(),this.priceLow);

            jQuery(this.containers.get(propName)).parents(".priceRange").siblings().hide();
            jQuery(this.containers.get(propName)).html(priceDollarLow).parents(".priceRange").show();
        } else {
            jQuery(this.containers.get(propName)).parents(".priceRange").siblings().show();
            jQuery(this.containers.get(propName)).parents(".priceRange").hide();
        }
    },
    refreshPricedollarlow:function(propName) {
        this.showPricedollarlow(propName);
    },

	showPricecentlow:function(propName) {
		if (this.isExist(propName)===false) return;

        var priceCent = '';
        if (this.priceLow!==undefined && this.priceLow.listprice>0.001
                &&!this.comparePrice(this.priceLow, this.priceHigh)) {

            var priceLow = new String(this.calculatePrice(this.priceLow, this.qty));
            priceCent = this.getCent(priceLow).toString();

            jQuery(this.containers.get(propName)).html(priceCent).show();
        }
	},
	refreshPricecentlow:function(propName) {
		this.showPricecentlow(propName);
	},

    showPricedollarhigh:function(propName) {
        if (this.isExist(propName)===false) return;

        var priceDollarHigh = '';

        if (this.priceHigh !== undefined && this.priceHigh.listprice > 0.001
                && !this.comparePrice(this.priceLow, this.priceHigh)) {

            var priceHigh = new String(this.calculatePrice(this.priceHigh, this.qty));
            priceDollarHigh = formatCurrency(this.getDollar(priceHigh).toString(),this.priceHigh);

            jQuery(this.containers.get(propName)).html(priceDollarHigh);
        }
    },
    refreshPricedollarhigh:function(propName) {
        this.showPricedollarhigh(propName);
    },

	showPricecenthigh:function(propName) {
		if (this.isExist(propName)===false) return;

        var priceCent = '';
        if (this.priceHigh!==undefined && this.priceHigh.listprice > 0.001
                && !this.comparePrice(this.priceLow, this.priceHigh)) {
            
			var priceHigh = new String(this.calculatePrice(this.priceHigh, this.qty));
            priceCent = this.getCent(priceHigh).toString();
            
            jQuery(this.containers.get(propName)).html(priceCent).show();
        }
	},
	refreshPricecenthigh:function(propName) {
		this.showPricecenthigh(propName);
	},

    comparePrice: function(price1, price2){
        if(!price1 || !price2){
            return false;
        } else if(price1.listprice === price2.listprice
                && price1.price_1 === price2.price_1){
            return true;
        } else {
            return false;
        }
    },

    isAttributeSelected: function(attributes){
        var selected = false;
        attributes.each(function(){
            if(jQuery(this).val() !== "" && jQuery(this).val() !== "0"){
                selected = true;
            }
        });
        return selected;
    },

	showPricesign:function(propName) {
        if (this.isExist(propName)==false) return;

        var priceSign = '';
        if (this.price!=undefined && this.price.listprice>0.001) {
            var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
            priceSign = currency.domain.sign;
        }

        jQuery(this.containers.get(propName)).html(priceSign).show();
	},
	refreshPricesign:function(propName) {
		this.showPricesign(propName);
	},
	showPrice: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}
		var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
		var price = new String(this.calculatePrice(this.price, this.qty));
		jQuery(this.containers.get(propName)).html('<span class="symbol">'+currency.domain.sign+
			'</span><span class="dollars">'+this.getDollar(price).toString()
            +'</span><span class="sign">.<\span><span class=cents>'+this.getCent(price).toString()+'</span>');

	},

	refreshPrice: function(propName) {
		this.showPrice(propName);
	},

	showPricewithtax: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).show();
		else {
			jQuery(this.containers.get(propName)).hide();
			return;
		}
        var taxRate = jQuery("#taxRate").value;
        if(isNaN(taxRate)){
        	taxRate = 1;
        }
		var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
        var priceWithTax = this.calculatePrice(this.price, this.qty)*taxRate*100/100;
		var amt = new String(priceWithTax);
		jQuery(this.containers.get(propName)).html(currency.domain.sign+" "+this.getDollar(amt)+"."+this.getCent(amt)).show();
	},

	refreshPricewithtax: function(propName) {
		this.showPricewithtax(propName);
	},
	
	getDollar: function(price) {
		if (price.indexOf('.')>=0)
			return price.substring(0, price.indexOf('.'));
		else
			return price;
	},
	getCent: function(price) {
		if (price.indexOf('.')>=0) {
			var cent = price.substring(price.indexOf('.')+1);
			if (cent.length==1)
				cent = cent+'0';
			return cent;
		}
		else
			return '00';
	},

	showNoprice: function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price!=undefined)
			jQuery(this.containers.get(propName)).hide();
		else
			jQuery(this.containers.get(propName)).show();
	},

	refreshNoprice: function(propName) {
		this.showNoprice(propName);
	},

	showInventory: function(propName) {
		if (this.isExist(propName)==false) return;

		if (!this.inventory || this.inventory == undefined || this.inventory.length ==0) {
			jQuery(this.containers.get(propName)).hide();
			return;
		}else
			jQuery(this.containers.get(propName)).show();
		if(this.inventory[0].hide==false){
			var instock = this.inventory[0].instock;
			var m_avai = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.availability");
			if (this.mode=='edit')
				instock = this.product.domain.origInstack;
			
			if (this.inventory[0].thirdpartyinventory==true) {
				jQuery(this.containers.get(propName)).html("<div class=\"f-row\"><span>"+this.inventory[0].thirdpartymessage+"</span></div>");
			}else if (instock > 0) {
				var m_instock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.instock");
				jQuery(this.containers.get(propName)).html("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+instock+"</div></div>");
			}else if(this.inventory[0].nextshipqty >0){
				var m_shipson = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.shipson");
				jQuery(this.containers.get(propName)).html("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_shipson.domain.message+" "+this.inventory[0].nextshipdate+"</div></div>");
			}else if(this.inventory[0].dropshipminqty >0){
				var m_dropship = new Commerce.Domain.Message(this.vid, "deliveryoption.dropshipMsg2");
				jQuery(this.containers.get(propName)).html("<div class=\"f-row\"><div class=\"f-field\">"+m_dropship.domain.message.replace("{0}",this.inventory[0].dropshipminqty)+"</div></div>");
			}else if(this.inventory[0].dropshipminqty==0 && this.inventory[0].permitnostock==true){
				var m_usualships = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.usualships");
				jQuery(this.containers.get(propName)).html("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_usualships.domain.message+"</div></div>");
			}else{
				var m_outofstock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.outstock");
				jQuery(this.containers.get(propName)).html("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_outofstock.domain.message+"</div></div>");
			}
		}
	},

	refreshInventory: function(propName) {
		this.showInventory(propName);
	},

	showShortdesc: function(propName) {
		if (this.isExist(propName)==false) return;

		jQuery(this.containers.get(propName)).html(this.currentSkuBO.item.domain.shortdesc);
	},
	refreshShortdesc: function(propName) {
		this.showShortdesc(propName);
	},
	showImage: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;

		if(this.currentSkuBO.lp_itemimage) {
			el.src = this.currentSkuBO.lp_itemimage;
		} else {
			el.src = this.currentSkuBO.item.domain.image;
		}
	},
	refreshImage: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.title;

		if(this.currentSkuBO.lp_itemimage) {
			el.src = this.currentSkuBO.lp_itemimage;
		} else {
			el.src = this.currentSkuBO.item.domain.image;
		}
	},
	showImagelink: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;

		if(this.currentSkuBO.lp_largeimage) {
			el.href = this.currentSkuBO.lp_largeimage;
		} else {
			el.href = this.currentSkuBO.item.domain.image3;
		}
	},
	refreshImagelink: function(propName) {
		this.showImagelink(propName);
	},
	showImagelink2: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		if(this.currentSkuBO.lp_largeimage) {
			el.href = this.currentSkuBO.lp_largeimage;
		} else {
			el.href = this.currentSkuBO.item.domain.image3;
		}
	},
	refreshImagelink2: function(propName) {
		this.showImagelink2(propName);
	},
	showCimage: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		if (this.currentSkuBO.item.domain.cimage == null)
			el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
		else
			el.src = this.currentSkuBO.item.domain.cimage;
	},
	refreshCimage: function(propName) {
		this.showCimage(propName);
	},
	showLongdesc: function(propName) {
		if (this.isExist(propName)==false) return;

		var desc = this.currentSkuBO.item.domain.longdesc;
		if (desc != undefined && desc !='')
			jQuery(this.containers.get(propName)).html(desc);
		else
			jQuery(this.containers.get(propName)).html('');
	},
	refreshLongdesc: function(propName) {
		this.showLongdesc(propName);
	},
	showLongdesc2: function(propName) {
		if (this.isExist(propName)==false) return;

		var desc = this.currentSkuBO.item.domain.longdesc2;
		if (desc != undefined && desc !='')
			jQuery(this.containers.get(propName)).html(desc);
		else
			jQuery(this.containers.get(propName)).html('');
	},
	refreshLongdesc2: function(propName) {
		this.showLongdesc2(propName);
	},
	showProperties: function(propName) {
		if (this.isExist(propName)==false) return;

		var props = this.currentSkuBO.item.domain.properties;

		var content='';
		if (props) {
			for(var idx=0; idx<props.length; idx++) {
				if (idx==props.length-1)
					content+='<div class="details" style="border: none;"><div class="left"><b>'+props[idx].propname+'</b></div><div class="right">'
					+props[idx].propvalue+'</div></div>';
				else
					content+='<div class="details"><div class="left"><b>'+props[idx].propname+'</b></div><div class="right">'
					+props[idx].propvalue+'</div></div>';
			}
		}
		jQuery(this.containers.get(propName)).html(content);
	},
	refreshProperties: function(propName) {
		this.showProperties(propName);
	},

	showQtybox: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = jQuery(this.containers.get(propName));
		el.val(this.qty);
		el.attr('disabled', false);
		var elem = this;
		el.keypress({
			'elem': elem
		}, function(e){
			elem.validateNumber(e);
		});
		el.bind('keyup', {
			'elem': elem
		}, function(e){
			elem.updatePrice(e);
		});
	},
	validateNumber: function(event) {

		var key;
		if(window.event)
			key = window.event.keyCode;     //IE
		else
			key = event.which;     //firefox
		if (key==13 ||(key>=65 && key<=122)) {
			event.preventDefault();
			return false;
		}
		else
			return true;
	},
	updatePrice: function(event) {
		var qty = jQuery(event.target).val();
		if(isNaN(qty)==false) {
			this.qty = qty;
			this.hiddenFields.setBasketField('quantity', this.qty);
			this.refreshPrice('price');
		}
	},
	refreshQtybox: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = jQuery(this.containers.get(propName));
		el.val(this.qty);
	},

	showAddtocartbtn: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = jQuery(this.containers.get(propName));
		if (this.allAttributesSelected && this.price!=undefined )
			el.attr('disabled', false);
		else {
			el.attr('disabled', true);
		}
		var elem=this;
		el.bind('click', {
			'elem':elem
		}, function(e){
			elem.validateAndSubmit(e);
			//elem.askMinorderQTY(e);
			});
	},
	
	showNotifymebtn: function(propName) {
		if (this.isExist(propName)==false) return;
		this.itemid = this.currentSkuBO.item.domain.itemid;
		var el = jQuery(this.containers.get(propName));
		this.subscribedmap = new Hashtable();
		
		for(var idx=0; idx<this.currentSkuBO.item.domain.subscribedcodes.length; idx++){
			this.subscribedmap.put(this.currentSkuBO.item.domain.subscribedcodes[idx],"");
		}
		
		if(this.subscribedmap.containsKey(this.compositeCode)){
			//grey out
			el.css("cursor","not-allowed");
			el.css("border-color","#C0C0C0 #C0C0C0 #C0C0C0 #C0C0C0");
			el.css("background-image","linear-gradient(to bottom, #C0C0C0 0%, #C0C0C0 100%)");
		}//else default view, as this is the first show of the button
		
		var elem=this;
		el.bind('click',function(e){
							elem.notifyme(e,el);
						}
		 		);
	},
	
	notifyme: function(e,notifyMeBtn){
		
		if(this.subscribedmap.containsKey(this.compositeCode)){
			return;
		}
		
		if (this.allAttributesSelected==false) {
			var message = new Commerce.Domain.Message(this.vid, "vm.itemtemplate.error.selectoption");
			popup = new Commerce.Popup(undefined, message.domain.message, undefined);
			popup.show();
			return;
		}
		
		var URL = 'notifyme.ajx';
		var params = {};
		params.vid = this.vid;
		params.ic = this.compositeCode;
		params.iid = this.itemid;
		var thisobj = this;
		jQuery.ajax({
			url: URL,
			type: 'post',
			data: params,
			async: false,
			dataType: 'json',
			success: function(r){
						if(r.__Success == "true"){
							notifyMeBtn.css("cursor","not-allowed");
							notifyMeBtn.css("border-color","#C0C0C0 #C0C0C0 #C0C0C0 #C0C0C0");
							notifyMeBtn.css("background-image","linear-gradient(to bottom, #C0C0C0 0%, #C0C0C0 100%)");
							thisobj.subscribedmap.put(thisobj.compositeCode,"");//put this code to subscribedmap dynamically
							
							var data = {};
							data.href = 'javascript:void(0);';
							data.content = 'OK';
							data.css = ['popup_menuItem'];
							data.events = [['click', 'hidepopup', thisobj]];
							var button = new Commerce.Link(data);
							thisobj.popup = new Commerce.Popup(undefined, r.__Message,undefined, button.toElement());
							thisobj.popup.show();
						}else{
							if(r.__Result.length > 0){
								location.href = r.__Result;
								return;
							}
							thisobj.popup = new Commerce.Popup(undefined, r.__Message,undefined, undefined);
							thisobj.popup.show();
						}
						
		             }
		});
	},
	
	hidepopup: function() {
		this.popup.hide();
	},

	validateAndSubmit: function() {
		var validated = true;
		var checkAllAttributesSel = this.checkAllAttributesSelected();
		
		for (var idx=0; idx<itemsOnPage.length; idx++) {
			var itemElement = itemsOnPage[idx];
            itemElement.allAttributesSelected = checkAllAttributesSel;
						
			//itemElement.askMinorderQTY();
            this.qty = this.containers.get('qtybox').value;
            var devliveryOption = new Commerce.Shop.ItemPage.DeliveryOption(itemElement, itemElement.vid, itemElement.inventoryCode, itemElement.qty, itemElement.hiddenFields.getBasketField('inventoryHistoryId'));

			if (!itemElement.validated){
				validated = itemElement.validated;
				return;
			}
		}

		if (validated){
			this.addToCart();
		}
	},
	askMinorderQTY: function() {
		this.qty = this.containers.get('qtybox').value;
		this.getMinorderQTY(this.vid,this.qty, this.inventoryCode);
	},

	getMinorderQTY: function(vid,qty,inventoryCode) {
		var params = new Hashtable();
		params.put('mode',this.mode);
		params.put('type',1);
		params.put('vid', vid);
		params.put('qty', qty);
		params.put('invcode', inventoryCode);
		this.ajaxCheckMinorderQTY(params, 'getminorderQTY.ajx');
	},

	ajaxCheckMinorderQTY: function(params, URL) {
				var data = {};
		var keys = params.keys();
		for(var key in keys){
			data[keys[key]] = params.get(keys[key]);
		}
		var obj = this;
		jQuery.ajax({
			url: URL,
			type: 'post',
			'data': data,
			async: false,
			dataType: 'json',
			success: function(r){obj.onSuccess(r)}
		})
	},

	onSuccess: function(response) {
		var result = response.__Result;
		var message = result.message;
		if(!message && response.__Message && response.__Message.length>0)
			message = response.__Message;
		if(message!=''){
			var popup = new Commerce.Popup(undefined, message, undefined);
			popup.show();
		}else{
			this.qty = this.containers.get('qtybox').value;
			var devliveryOption = new Commerce.Shop.ItemPage.DeliveryOption(this, this.vid, this.inventoryCode, this.qty, this.hiddenFields.getBasketField('inventoryHistoryId'));
		}
	},

	askDeliveryOption: function(event) {
		this.qty = jQuery(this.containers.get('qtybox')).val()
		var devliveryOption = new Commerce.Shop.ItemPage.DeliveryOption(this, this.vid, this.inventoryCode, this.qty, this.hiddenFields.getBasketField('inventoryHistoryId'));
	},

	afterDeliveryOption: function(devliveryOption) {
		if (this.allAttributesSelected && this.price!=undefined ) {
			if (devliveryOption.isSuccess) {
				this.hiddenFields.setBasketField('inventoryHistoryId', devliveryOption.getInventoryHistoryId());
				if(devliveryOption.optionid==5) {
					jQuery(this.containers.get('qtybox')).val(devliveryOption.qty);
					this.qty = devliveryOption.qty;
				}
				if(itemsOnPage.length==1)
					this.addToCart();
				else
					this.validated = true;
			}
			else if (devliveryOption.isCancel==false) {
				var popup = new Commerce.Popup(undefined, devliveryOption.getErrorMessage(), undefined);
				popup.show();
			}
		}
		if (this.allAttributesSelected==false) {
			var message = new Commerce.Domain.Message(this.vid, "vm.itemtemplate.error.selectoption");
			popup = new Commerce.Popup(undefined, message.domain.message, undefined);
			popup.show();
		}
	},

	checkAllAttributesSelected: function(){
		var allItemAllAttributeSelected = true;
		var attribs = this.inserters.get('attributes').attribs;
		for(var idx=0; idx<attribs.length; idx++) {
			jQuery("[name='attribute_"+attribs[idx].id+"']").each(function(index) {
			    if (jQuery(this).val() == 0){
			    	allItemAllAttributeSelected = false;
			    	return false;
			    }
			});
			if (!allItemAllAttributeSelected){
				break;
			}	
		}
		return allItemAllAttributeSelected;
	},
	
	addToCart: function() {
        	this.refreshHiddenfields('hiddenfields');
        	document[this.formName].submit();
	},

	refreshAddtocartbtn: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = this.containers.get(propName);

		if (this.allAttributesSelected && this.price!=undefined)
			el.disabled=false;
		else
			el.disabled=true;
		
		if (this.inventory && this.inventory != undefined && 
				this.inventory.length !=0 && this.inventory[0].instock == 0) {
			jQuery(el).hide();
		}else{
			jQuery(el).show();
		}
	},
	
	refreshNotifymebtn: function(propName) {
		if (this.isExist(propName)==false) return;

		var el = this.containers.get(propName);
		this.itemid = this.currentSkuBO.item.domain.itemid;
		if (this.allAttributesSelected && this.price!=undefined)
			el.disabled=false;
		else
			el.disabled=true;
		
		var jqel=jQuery(el);
		
		//put to subscribedmap when refresh sku
		for(var idx=0; idx<this.currentSkuBO.item.domain.subscribedcodes.length; idx++){
			this.subscribedmap.put(this.currentSkuBO.item.domain.subscribedcodes[idx],"");
		}
		
		if (this.inventory && this.inventory != undefined && 
				this.inventory.length !=0 && this.inventory[0].instock == 0) {
			
			if(this.subscribedmap.containsKey(this.compositeCode)){
				//grey out
				jqel.css("cursor","not-allowed");
				jqel.css("border-color","#C0C0C0 #C0C0C0 #C0C0C0 #C0C0C0");
				jqel.css("background-image","linear-gradient(to bottom, #C0C0C0 0%, #C0C0C0 100%)");
			}else{
				//light the button
				jqel.css("cursor","pointer");
				jqel.css("border-color","#BAEFF7 #D2DFE8 #D2DFE8 #BAEFF7");
				jqel.css("background-image","linear-gradient(to bottom, #91E2F5 0%, #4BC3E8 100%)");
			}
			jqel.show();
		}else{
			jqel.hide();
		}
	},

	//js-item-hiddenfields-itemidxxx-
	showHiddenfields: function(propName) {
		if (this.isExist(propName)==false) return;

		var locator = this.containers.get(propName);
		this.hiddenFields = new Commerce.Shop.ItemPage.HiddenFields(locator, this.basketNumber);
		if (this.basketNumber == 0) {
			this.hiddenFields.setField('viewMode', 'item');
			this.hiddenFields.setField('actionMode', 'buy');
			this.hiddenFields.setField('selfUri', 'storeitem.html');
			this.hiddenFields.setField('targetUri', 'basket.html');
			this.hiddenFields.setField('mode', 'addItem');
			this.hiddenFields.setField('itemscount', '1');
			this.hiddenFields.setField('_targetaddItem', 'basket.html?vid='+this.vid);
			this.hiddenFields.setBasketField('itemId', this.currentSkuBO.item.domain.itemid);
			this.hiddenFields.setBasketField('vendorId', this.vid);
			this.hiddenFields.setBasketField('itemToProcess', 'true');
			this.hiddenFields.setBasketField('quantity', this.qty);
			this.hiddenFields.setBasketField('inventoryHistoryId', '');
		}
		else {
			this.hiddenFields.setBasketField('itemId', this.currentSkuBO.item.domain.itemid);
			this.hiddenFields.setBasketField('vendorId', this.vid);
			this.hiddenFields.setBasketField('inventoryHistoryId', '');
		}


		if (this.mode=='edit') {
			this.hiddenFields.setBasketField('editMode', 'true');
			this.hiddenFields.setBasketField('basketItemId', this.product.domain.id);
			this.hiddenFields.setBasketField('inventoryHistoryId', this.product.domain.invhistid);
			this.hiddenFields.setBasketField('comment', this.product.domain.comment);
		}

		if (this.allAttributesSelected) {
			var attribs = this.inserters.get('attributes').attribs;
			for(var idx=0; idx<attribs.length; idx++) {
				this.hiddenFields.setBasketField('attributes['+idx+'].attributeId', attribs[idx].domain.attributeid);
				if (attribs[idx].domain.attype=='2')
					this.hiddenFields.setBasketField('attributes['+idx+'].optionId', attribs[idx]["getValue"].call(attribs[idx]));
				else
					this.hiddenFields.setBasketField('attributes['+idx+'].value', attribs[idx]["getValue"].call(attribs[idx]));
			}
		}
	    itemsOnPage.push(this);
	},

	refreshHiddenfields: function(propName) {
		if (this.isExist(propName)==false) return;

		this.hiddenFields.setBasketField('quantity', this.qty);
		this.hiddenFields.setBasketField('itemId', this.currentSkuBO.item.domain.itemid);

		if (this.allAttributesSelected) {
			var attribs = this.inserters.get('attributes').attribs;
			for(var idx=0; idx<attribs.length; idx++) {
				this.hiddenFields.setBasketField('attributes['+idx+'].attributeId', attribs[idx].domain.attributeid);
				if (attribs[idx].domain.attype=='2')
					this.hiddenFields.setBasketField('attributes['+idx+'].optionId', attribs[idx].getValue());
				else
					this.hiddenFields.setBasketField('attributes['+idx+'].value', attribs[idx].getValue());
			}
		}
	},

	showMessage: function(propName) {
		if (this.isExist(propName)==false) return;
	},

	refreshMessage: function(propName) {
		this.showMessage(propName);
	},

	calculatePrice: function(price, qty) {
		var amount = 0;
		if (price.qty_1==0 || price.qty_1>=qty)
			amount = price.price_1+price.setup;
		else if (price.qty_2==0 || price.qty_2>=qty)
			amount = price.price_2+price.setup;
		else if (price.qty_3==0 || price.qty_3>=qty)
			amount = price.price_3+price.setup;
		else if (price.qty_4==0 || price.qty_4>=qty)
			amount = price.price_4+price.setup;
		else
			amount = price.price_5+price.setup;

		return Math.round((amount*price.customerDiscount)*100)/100;
	}
});

Commerce.Shop.ItemPage.Attribute =  jQuery.klass({

	initialize: function(propName, skuBO) {

		this.propName = propName;
		this.skuBO = skuBO;
		this.itemid = skuBO.item.domain.itemid;
		this.labels = new Array();
		this.selectBoxs = new Array();
		this.optionWeight = 0;
		this.attribs = skuBO.attribs;
		this.skuAttribs = skuBO.skuAttribs;
		this.currentAttrib = undefined;
	},
	getCompositeCode: function() {
		var code = this.skuBO.item.domain.code;

		if (this.isAllSelected()==false)
			return '';
		var idx2 = 0;
		for (var idx=0; idx<this.attribs.length; idx++) {
			if (this.attribs[idx].enableSku() == false && this.attribs[idx].domain.attype=='2') {
				idx2++;
				if (idx2==1)
					code += '.'+this.attribs[idx].getSelectedCode();
				else
					code += '-'+this.attribs[idx].getSelectedCode();
			}
		}

		return code;
	},

	getInventoryCode: function() {
		var code = this.skuBO.item.domain.code;

		if (this.isAllSelected()==false)
			return '';
		var idx2 = 0;
		for (var idx=0; idx<this.attribs.length; idx++) {
			if (this.attribs[idx].enableSku() == false && this.attribs[idx].domain.attype=='2' && this.attribs[idx].domain.enableinv == true) {
				idx2++;
				if (idx2==1)
					code += '.'+this.attribs[idx].getSelectedCode();
				else
					code += '-'+this.attribs[idx].getSelectedCode();
			}
		}

		return code;
	},


	show: function(container, eItem) {
		var skuBO = this.skuBO;
		var attribs = this.attribs;
		var sku = skuBO.avaiSkus.get(this.itemid);
		var e_fieldset = jQuery.create("fieldset");
		var e_container = jQuery.create("div");
		//e_fieldset.addClassName('f-form');
		jQuery(container).prepend(e_fieldset);
		for(var idx2=0; idx2<attribs.length; idx2++) {
			var events = [];
			var e_div2 = undefined;
			attribs[idx2].optionFilter = this.skuBO.mainItemSkus.values();
			var el;
			if (attribs[idx2].domain.attype=='2') {
				if (attribs[idx2].domain.format=='D') {
					e_div2 = this.createSelectBoxDiv(e_fieldset, attribs[idx2]);
					events = [['change', 'refreshItemByAttribute', eItem, this.propName]];
					attribs[idx2].initializeSelectBox('', [], events);
					if (eItem.mode == 'edit')
						el = attribs[idx2].toSelectBox(true, eItem.product.findOption(attribs[idx2].domain.attributeid));
					else
						el = attribs[idx2].toSelectBox(true, this.findOptionInSku(attribs[idx2].domain.attributeid, sku));
					e_div2.append(el);
				}
				else if (attribs[idx2].domain.format=='C') {
					e_div2 = this.createSelectBoxDiv(e_fieldset, attribs[idx2]);
					events = [['change', 'refreshItemByAttribute', eItem, this.propName]];
					attribs[idx2].initializeSelectBox('', [], events);
					if (eItem.mode == 'edit')
						el = attribs[idx2].toSelectBox(true, eItem.product.findOption(attribs[idx2].domain.attributeid));
					else
						el = attribs[idx2].toSelectBox(true, this.findOptionInSku(attribs[idx2].domain.attributeid, sku));
					e_div2.append(el);
// 					e_div2 = this.createColorSelectorDiv(e_fieldset, attribs[idx2]);
// 					events = [['click', 'refreshItemByAttribute', eItem, this.propName]];
// 					attribs[idx2].initializeSelectBox('', [], events);
// 					if (eItem.mode == 'edit')
// 						el = attribs[idx2].toColorSwatch(true, eItem.product.findOption(attribs[idx2].domain.attributeid));
// 					else
// 						el = attribs[idx2].toColorSwatch(true, this.findOptionInSku(attribs[idx2].domain.attributeid, sku));
// 					e_div2.append(el);
				}
				else if (attribs[idx2].domain.format=='R') {
					e_div2 = this.createRadioButtonDiv(e_fieldset, attribs[idx2]);
					events = [['click', 'refreshItemByAttribute', eItem, this.propName]];
					attribs[idx2].initializeSelectBox('custom1', ['f-row'], events, e_div2);
					if (eItem.mode == 'edit')
						el = attribs[idx2].toRadioButton(true, eItem.product.findOption(attribs[idx2].domain.attributeid));
					else
						el = attribs[idx2].toRadioButton(true, this.findOptionInSku(attribs[idx2].domain.attributeid, sku));
				//this.appendRadioOptionToParent(e_div2, el);
				}
				else {//default is D
					e_div2 = this.createSelectBoxDiv(e_fieldset, attribs[idx2]);
					events = [['change', 'refreshItemByAttribute', eItem, this.propName]];
					attribs[idx2].initializeSelectBox('', [], events);
					if (eItem.mode == 'edit')
						el = attribs[idx2].toSelectBox(true, eItem.product.findOption(attribs[idx2].domain.attributeid));
					else
						el = attribs[idx2].toSelectBox(true, this.findOptionInSku(attribs[idx2].domain.attributeid, sku));
					e_div2.append(el);
				}
			}
			else if (attribs[idx2].domain.attype=='3') {
				e_div2 = this.createTextBoxDiv(e_fieldset, attribs[idx2]);
				events = [['blur', 'refreshItemByAttribute', eItem, this.propName]];
				attribs[idx2].events = events;
				if (eItem.mode == 'edit')
					el = attribs[idx2].toTextArea(eItem.product.findOption(attribs[idx2].domain.attributeid));
				else
					el = attribs[idx2].toTextArea();
				e_div2.append(el);
				jQuery("#quicklook_itemqty").hide();
				jQuery("#quicklook_continue").hide();
				jQuery("#quicklook_addToCart").hide();
				jQuery("#quicklook_viewItem").show();
			}
			el.attr('id', this.assembleElementID(attribs[idx2].domain.attributeid));
			el.attr('enablesku', attribs[idx2].domain.enablesku);
			attribs[idx2].optionWeight = 1000; //initial weight
			this.selectBoxs.push(el);
		}
		if (jQuery('#preloader'))	jQuery('#preloader').hide();
		eItem.currentSkuBO.refreshLpImages();
	},
	appendRadioOptionToParent: function(p, el) {
		//el.removeChild(el.childNodes[0]);
		var total_radios = el.childNodes.length;
		for(var r_idx = 0; r_idx < total_radios; r_idx++){
			//	temp_element = el.childNodes[r_idx].cloneNode(true);
			p.appendChild(el.childNodes[r_idx]);
		}
	},
	createRadioButtonDiv: function(e_fieldSet, attribs) {
		var e_div =jQuery.create("fieldset");
		e_fieldSet.append(e_div);
		e_div.addClass('f-row');

		var e_label = jQuery.create("legend");
		e_div.append(e_label);

		e_label.html(attribs.domain.screenname);

		return e_div;
	},
	createSelectBoxDiv: function(e_fieldSet, attribs) {
		var e_div = jQuery.create("div");
		e_fieldSet.append(e_div);
		e_div.addClass('f-row');

		var e_label = jQuery.create("label");
		e_div.append(e_label);

		var label = jQuery.create('span',{
			children: attribs.domain.screenname
		});

		this.labels.push(label);
		e_label.append(label);

		var e_div2 = jQuery.create("div");
		e_div2.addClass('f-field');
		e_div.append(e_div2);

		return e_div2;
	},
	
	createColorSelectorDiv: function(e_fieldSet, attribs) {
		var e_div = jQuery.create("div");
		e_fieldSet.append(e_div);
		e_div.addClass('f-row');
		
		var e_label = jQuery.create("label");
		e_div.append(e_label);
		var label = jQuery.create('span', { children: attribs.domain.screenname });
		this.labels.push(label);
		e_label.append(label);
		
		return e_div;
	},
	createTextBoxDiv: function(e_fieldSet, attribs) {
		var e_div = jQuery.create("div");
		e_fieldSet.append(e_div);
		e_div.addClass('f-row');

		var e_label = jQuery.create("label");
		e_div.append(e_label);

		var label = jQuery.create('span',{
			children: attribs.domain.screenname
		}
		);

		this.labels.push(label);
		e_label.append(label);

		var e_div2 = jQuery.create("div");
		e_div2.addClass('f-field');
		e_div.append(e_div2);

		return e_div2;
	},

	findOptionInSku: function(attributeid, skuString) {

		if (!skuString) return 0;

		var skus = skuString.split('_');

		for(var idx=0; idx<skus.length; idx++) {
			var attr = skus[idx].split(':');
			if (attr[0] == attributeid)
				return attr[1];
		}

		return 0;
	},

	getOptionWeight: function() {
		this.optionWeight++;
		return this.optionWeight;
	},

	refresh: function(updatedAttribElement) {

		var updatedAttribID = this.parseAttribID(updatedAttribElement);

		var updatedAttrib = jQuery(this.attribs).filter(function() {
			return updatedAttribID==this.domain.attributeid;
		});
		if (updatedAttrib.attr('domain').enablesku == false) {
			return this.skuBO;
		}
		updatedAttrib = jQuery(this.skuAttribs).filter(function() {
			return updatedAttribID==this.domain.attributeid;
		});
		updatedAttrib[0].setSelected(updatedAttribElement.value);
		updatedAttrib[0].removeNullOption();
		if (updatedAttrib[0].optionWeight == 1000)
			updatedAttrib[0].optionWeight = this.getOptionWeight();

		var lastFilter;
		var attribs = this.skuAttribs.sort(function(a,b) {
			return a.optionWeight-b.optionWeight;
		});
		var changed = false;
		for(var idx=0; idx<attribs.length; idx++) {
			var attrib = attribs[idx];

			if (changed) {
				attrib.optionFilter = lastFilter;
				attrib.updateSelectBox();
			}
			if (updatedAttribID == attrib.domain.attributeid) {
				changed = true;
			}
			if (changed) {
				lastFilter = attrib.updateFilter();
			}
		}

		if (lastFilter.length==1 && this.isAllSelected(this.skuAttribs)) {
			var skuid = this.findSkuId(lastFilter[0]);
			if (this.itemid != skuid) {
				this.itemid = skuid;
				this.skuBO = new Commerce.BO.Sku(this.skuBO.item.domain.vendorid, this.itemid);
			}
		}

		return this.skuBO;
	},

	refreshValue: function() {

		var lastFilter;
		var attribs = this.skuAttribs.sort(function(a,b) {
			return a.optionWeight-b.optionWeight;
		});
		var changed = false;
		for(var idx=0; idx<attribs.length; idx++) {
			var attrib = attribs[idx];

			if (changed) {
				attrib.optionFilter = lastFilter;
				attrib.updateSelectBox();
			}

			changed = true;
			if (changed) {
				lastFilter = attrib.updateFilter();
			}
		}

		if (lastFilter.length==1 && this.isAllSelected(this.skuAttribs)) {
			var skuid = this.findSkuId(lastFilter[0]);
			if (this.itemid != skuid) {
				this.itemid = skuid;
				this.skuBO = new Commerce.BO.Sku(this.skuBO.item.domain.vendorid, this.itemid);
			}
		}

		return this.skuBO;
	},

	isAllSelected: function(attribs) {
		if (!attribs)
			attribs = this.attribs;
		for(var idx=0; idx<attribs.length; idx++) {
			if (attribs[idx].isSelected() == false)
				return false;
		}

		return true;
	},

	findSkuId: function(sku) {
		var keys = this.skuBO.mainItemSkus.keys();
		for(var k = 0; k < keys.length; k++){
			if(this.skuBO.mainItemSkus.get(keys[k]) == sku) {
				return keys[k];
			}
		}
		return undefined;
	},

	assembleElementID: function(attributeid) {
		return attributeid;
	},

	parseAttribID: function(attribElement) {
		if (attribElement.id && attribElement.id>0)
			return attribElement.id;
		else
			return (attribElement.name.split("_"))[1];
	}

});

Commerce.Shop.ItemPage.DeliveryOption = jQuery.klass({

	initialize: function(eItem, vid, invcode, qty, invhistid) {

		this.isSuccess = false;
		this.isCancel = false;
		this.message = '';
		this.vid = vid;
		this.inventoryCode = invcode;
		this.qty = qty;
		this.inventoryHistoryId = invhistid;
		this.optionid = undefined;
		this.mode = 'query';
		this.optionName = 'delivery-option';
		this.eItem = eItem;

		this.getDeliveryOption();
	},

	updateDeliveryOption: function() {
		this.mode='update';
		this.optionid = this.radio.getValue();
		this.getDeliveryOption();
	},
	getDeliveryOption: function() {
		var params = new Hashtable();
		params.put('vid', this.vid);
		params.put('qty', this.qty);
		if (this.inventoryHistoryId != undefined)
			params.put('invhistid', this.inventoryHistoryId);
		if (this.optionid != undefined)
			params.put('optionid', this.optionid);
		params.put('invcode', this.inventoryCode);
		params.put('mode', this.mode);
		this.ajaxGetDeliveryOption(params, 'getdeliveryoptions.ajx');
	},
	getInventoryHistoryId: function() {
		return this.invhistid;
	},
	getErrorMessage: function() {
		return this.message;
	},

	onFailure: function() {
		this.isSuncess = false;
		this.message = 'Communication error!';
		this.eItem.afterDeliveryOption(this);
	},

	onSuccess: function(response) {

		if (response.__Success=='false') {
			this.message = response.__Message;
			this.isSuncess = false;
			this.eItem.afterDeliveryOption(this);
		}
		else {
			var result = response.__Result;
			if (result.status == 2) {
				this.isSuncess = false;
				this.message = result.message;
				if (result.invhistid != undefined) {

					this.invhistid = result.invhistid;
				}
				this.eItem.afterDeliveryOption(this);
			} else if (result.status == 3) {
				if (result.invhistid != undefined) {
					this.invhistid = result.invhistid;
				}
				this.isSuccess = true;
				if(this.optionid==5)
					this.qty=result.changeqtyto;
				if(result.options.length==1) {
					this.optionid = result.options[0].optionid;
					if(result.changeqtyto != undefined)
						this.qty=result.changeqtyto;
				}
				this.eItem.afterDeliveryOption(this);
			}
			else if (result.status == 1) {
				if(this.eItem.currentSkuBO.item.domain.enableDelOpts=='true'){
				   this.showPopup(result);
				}else{
				   if (result.invhistid != undefined) {
					  this.invhistid = result.invhistid;
				   }
				   this.isSuccess = true;	
				   this.eItem.afterDeliveryOption(this);
				}
			}else if (result.status == 5) {
				this.isSuncess = false;
				this.message = result.message;
				this.eItem.afterDeliveryOption(this);
			}
		}
	},
	showPopup: function(deliveryOption) {
		var radioData = {};
		radioData.name = this.optionName;
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
	},
	cancel: function() {
		this.popup.hide();
		this.isCancel = true;
		this.isSuccess = false;
	},

	ajaxGetDeliveryOption: function(params, URL) {
		var data = {};
		var keys = params.keys();
		for(var key in keys){
			data[keys[key]] = params.get(keys[key]);
		}
		var obj = this;
		jQuery.ajax({
			url: URL,
			type: 'post',
			'data': data,
			async: false,
			dataType: 'json',
			success: function(r){obj.onSuccess(r)},
			error: function(r){obj.onFailure(r)}
		})
	}
});

Commerce.Shop.ItemPage.HiddenFields = jQuery.klass({

	initialize: function(locator, num) {
		if (!num)
			this.bn = 0; //basket number
		else
			this.bn = num;
		this.fields = new Hashtable();
		this.locator = locator;//where to insert the hidden fields
	},

	fieldName: function(name) {
		return 'basketItems['+this.bn+'].'+name;
	},
	newElement: function(name, value) {
		var data = {};
		data.type = 'hidden';
		data.id=name;
		data.name = name;
		data.value = value;
		var input = new Commerce.InputBox(data);
		input.insert(this.locator, 'bottom');

		return input.element;
	},
	setBasketField: function(name, value) {
		var fn = this.fieldName(name);
		this.setField(fn, value);
	},
	getBasketField: function(name) {
		var fn = this.fieldName(name);
		return this.getField(fn);
	},
	setField: function(name, value) {

		var el = this.fields.get(name);
		if (!el)
			this.fields.put(name, this.newElement(name, value));
		else
			el.val(value);
	},

	getField: function(name) {
		var el = this.fields.get(name);
		if (!el)
			return undefined;
		else
			return el.val();
	}
});

/**format currency**/
function formatCurrency(num,price) {
	num = num.toString().replace(/\$|\,/g,'');
	var sign=",";
	if((price.langcode=="de"||price.langcode=="DE")&&price!=undefined)
		sign=".";

	if(!isNaN(num)){
		num = Math.floor(num*100+0.50000000001);
		num = Math.floor(num/100).toString();
		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++){
			num = num.substring(0,num.length-(4*i+3))+sign+
			num.substring(num.length-(4*i+3));
		}
	}
	return num;
}

/**  Main Entry */
var itempage;
var itemsOnPage = new Array();
function initPage(targetdiv) {
	var vid = jQuery('#js-vid').attr('value');

	var gup = function( name ) {
		var results = (new RegExp("[\\?&]"+name+"=([^&#]*)")).exec(window.location.href);
		if ( results == null )
		{
			return ""
		}
		else
		{
			return results[1]
		}
	};
	var divstring = (typeof(targetdiv)=='string' && targetdiv!='') ? targetdiv+' ' : '';
	itempage = new Commerce.Shop.ItemPage(vid, gup('biid'),divstring);
}
function closePage() {
	itempage.cleanCache();
}
jQuery(document).ready(function(){initPage();});
jQuery(window).unload(function(){closePage();});