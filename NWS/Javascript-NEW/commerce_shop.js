Commerce.Shop = {};

Commerce.Shop.ItemPage = Class.create({
	
	initialize: function(vid, basketItemId,targetdiv) {

		this.vid = vid;

		if (Object.isUndefined(basketItemId)== false) {
			this.basket = new Commerce.Domain.Basket(vid);
			this.product = this.basket.findProduct(basketItemId);
			if (this.product.domain==undefined)
				this.product = undefined;
		}
		this.itemElements = this.collectItemOnPage(targetdiv);
		for (var idx=0; idx<this.itemElements.length; idx++) {
			this.itemElements[idx].show();
		}
	},

	collectItemOnPage: function(targetdiv) {
		var divs = $$(targetdiv+'div'); //js-item-propName(attributes, images, description, title, code)-$(itemid)
		var spans = $$(targetdiv+'span');
		var p = $$(targetdiv+'p');
		var links = $$(targetdiv+'a');
		var imgs = $$(targetdiv+'img');
		var inputs = $$(targetdiv+'input');
			
		divs = divs.concat(spans);
		divs = divs.concat(links);
		divs = divs.concat(imgs);
		divs = divs.concat(inputs);
		divs = divs.concat(p);
		var items = new Hash();
		var itemids = new Hash();
		
		for(var idx=0; idx<divs.length; idx++) {
			var ids = divs[idx].id.split('-');
			if (ids.length>=4 && ids[0]=='js' && ids[1]=='item') {
				itemids.set(ids[3], ids[3]);
			}
		}
		
		var tmp = new Commerce.Domain.Item(this.vid, itemids.keys());

		var basketNumber = 0;
		for(var idx=0; idx<divs.length; idx++) {
			var ids = divs[idx].id.split('-');
			/** 0: js; 1 : item; 2: propname; 3: itemid; 4: item serial # */ 

			if (ids.length>=4 && ids[0]=='js' && ids[1]=='item') {
				var key ;
				if (ids[4] != undefined && ids[4] != null)  
					key = ids[3]+"-"+ids[4];
				else
					key = ids[3];
				var eItem = items.get(key);	
				
				if (Object.isUndefined(eItem)) {
					var product = undefined;
					if (this.product!=undefined && this.product.itemid==ids[3])
						product = this.product;

					eItem = new Commerce.Shop.ItemPage.Item(ids[1], new Commerce.BO.Sku(this.vid, ids[3]), this.product, basketNumber);
					basketNumber++;
				}
				eItem.addContainer(ids[2].toLowerCase(), divs[idx]);
				
				items.set(key, eItem); 
			}
		}

		return items.values();
	},
	refresh: function() {
		for (var idx=0; idx<this.itemElements.length; idx++) {
			this.itemElements[idx].refreshItem();
		}
	},
	
	cleanCache: function() {
		Commerce.Cache.cleanAll();
	}
	
});

Commerce.Shop.ItemPage.Item = Class.create({
	initialize: function(type, skuBO, product, basketNumber) {

		if (Object.isUndefined(product)==false)
			this.mode = 'edit';
		else 
			this.mode = 'new';
		this.product = product;
		this.vid = skuBO.vid;
		this.formName = 'F'+skuBO.item.domain.itemid;
		this.currentSkuBO = skuBO;
		this.mainItemBO = skuBO.getMainItemBO();
		this.containers = new Hash();
		this.inserters = new Hash();
		this.type = type; //item
		this.compositeCode = '';
		this.inventoryCode = '';
		this.price = this.currentSkuBO.item.getPrice(this.compositeCode); //Item price
		this.inventory = undefined; //item inventory
		this.qty = 1; //item quantity
		if (this.mode=='edit')
			this.qty = this.product.domain.qty;
		this.allAttributesSelected = false;
		this.hiddenFields;
		this.basketNumber = basketNumber;
	},
	
	addContainer: function(propName, container) {
		this.containers.set(propName, container);
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
			if (this.inventory != undefined && this.qty < this.inventory.minorderqty)
				this.qty = this.inventory.minorderqty;
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
				if (this.inventory != undefined &&this.qty < this.inventory.minorderqty)
					this.qty = this.inventory.minorderqty;
				this.refreshListprice('listprice');
				this.refreshInventory('inventory');
				this.refreshPrice('price');
				this.refreshNoprice('noprice');
				this.refreshPricedollar('pricedollar');
				this.refreshPricecent('pricecent');
				this.refreshSavepercentage('savepercentage');
				this.refreshSaveamount('saveamount');
			}
			
			this.allAttributesSelected = attribute.isAllSelected();
			this.refreshAddtocartbtn('addtocartbtn');
		}

	},
	refreshItemByAttribute: function(event, propName) {
		var attribute = this.inserters.get(propName);
		var newSkuBO = attribute.refresh(event.element());
		if (newSkuBO.item.domain.itemid != this.currentSkuBO.item.domain.itemid) {
			this.currentSkuBO = newSkuBO;
			this.compositeCode = attribute.getCompositeCode();
			this.inventoryCode = attribute.getInventoryCode();
			this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
			this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
			if (this.inventory != undefined && this.qty < this.inventory.minorderqty)
				this.qty = this.inventory.minorderqty;
			this.allAttributesSelected = attribute.isAllSelected();
		}
		else { // no sku refresh, but composite code refresh
			var compCode = attribute.getCompositeCode();

			if (compCode!='' && this.compositeCode!=compCode) {

				this.compositeCode = compCode;
				this.inventoryCode = attribute.getInventoryCode();
				this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
				this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
				if (this.inventory != undefined &&this.qty < this.inventory.minorderqty)
					this.qty = this.inventory.minorderqty;
				this.refreshListprice('listprice');
				this.refreshAwardpoint('awardpoint');
				this.refreshInventory('inventory');
				this.refreshPrice('price');
				this.refreshNoprice('noprice');
				this.refreshPricedollar('pricedollar');
				this.refreshPricecent('pricecent');
				this.refreshSavepercentage('savepercentage');
				this.refreshSaveamount('saveamount');
			}
			
			this.allAttributesSelected = attribute.isAllSelected();
			this.refreshAddtocartbtn('addtocartbtn');
		}
		
		this.currentSkuBO.refreshLpImages(); 
		this.refresh();

	},
	
	show: function() {
		var keys = this.containers.keys();

		for(var idx=0; idx<keys.length; idx++) {
			var container = this.containers.get(keys[idx]);
			var method  = keys[idx].split('_');
			if (this['show'+method[0].capitalize()]==undefined){
				//alert(method[0].capitalize());
			}else
				this['show'+method[0].capitalize()].call(this,  keys[idx]);
		}
	},
	refresh: function() {
		var keys = this.containers.keys();

		for(var idx=0; idx<keys.length; idx++) {
			var container = this.containers.get(keys[idx]);
			var method  = keys[idx].split('_');
			if (this['refresh'+method[0].capitalize()]==undefined)
				alert(method[0].capitalize());
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
		this.inserters.set(propName, attribute);
		attribute.show(this.containers.get(propName), this);

		this.compositeCode =  attribute.getCompositeCode();
		this.inventoryCode = attribute.getInventoryCode();
		this.inventory = this.currentSkuBO.item.getInventory(this.inventoryCode);
		this.price = this.currentSkuBO.item.getPrice(this.compositeCode);
		if (this.inventory != undefined && this.qty < this.inventory.minorderqty)
			this.qty = this.inventory.minorderqty;
		
		this.allAttributesSelected = attribute.isAllSelected();
	},
	
	refreshAttributes: function(propName) {
		if (this.isExist(propName)==false) return;
		//do nothing
	},
	
	showTitle: function(propName) {
		if (this.isExist(propName)==false) return;
		this.containers.get(propName).update(this.currentSkuBO.item.domain.title);
	},
	
	refreshTitle: function(propName) {
		if (this.isExist(propName)==false) return;
		this.containers.get(propName).update(this.currentSkuBO.item.domain.title);
	},
	showCode: function(propName) {
		if (this.isExist(propName)==false) return;
		this.containers.get(propName).update(this.currentSkuBO.item.domain.code);
	},
	
	refreshCode: function(propName) {
		if (this.isExist(propName)==false) return;
		this.containers.get(propName).update(this.currentSkuBO.item.domain.code);
	},
	
	showYousave: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		if (this.price.customerDiscount<1 || this.price.listprice>this.price.price_1) {
			var message = new Commerce.Domain.Message(this.vid, "vm.categoryT_itemList.yousave");
			var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
			var amt = this.price.listprice-this.price.price_1;
			var percentage = Math.round((amt/this.price.listprice)*100);
			var s_amt = new String(amt);
			this.containers.get(propName).update(message.domain.message+" "+currency.domain.sign+" <span class='item-price-saved'>"+this.getDollar(s_amt)+"."+this.getCent(s_amt)+" ("+percentage+"%)</span>").show();
		}
		else {
			this.containers.get(propName).hide();
		} 
	},
	
	refreshYousave: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		if (this.price.customerDiscount<1 || this.price.listprice>this.price.price_1) {
			var message = new Commerce.Domain.Message(this.vid, "vm.categoryT_itemList.yousave");
			var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
			var amt = this.price.listprice-this.price.price_1;
			var percentage = Math.round((amt/this.price.listprice)*100); 
			var s_amt = new String(amt);
			this.containers.get(propName).update(message.domain.message+" "+currency.domain.sign+" <span class='item-price-saved'>"+this.getDollar(s_amt)+"."+this.getCent(s_amt)+" ("+percentage+"%)</span>").show();
		}
		else {
			this.containers.get(propName).hide();
		} 
	},
		
	showSavepercentage: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		var amt = Math.round((this.price.listprice-this.price.price_1)*100)/100;
		var percentage = Math.round((amt/this.price.listprice)*100);
		this.containers.get(propName).update(percentage+"%");
	},
	
	refreshSavepercentage: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var amt = Math.round((this.price.listprice-Math.round((this.price.price_1*this.price.customerDiscount)*100)/100)*100)/100;
		var percentage = Math.round((amt/this.price.listprice)*100);
		this.containers.get(propName).update(percentage+"%");
	},
			
	showSaveamount: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		var amt = this.price.listprice-this.price.price_1;
		var s_amt = new String(amt.toFixed(2));
		this.containers.get(propName).update(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
	},
	
	refreshSaveamount: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		var amt = this.price.listprice-this.price.price_1;
		var s_amt = new String(amt.toFixed(2));
		this.containers.get(propName).update(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
	},	
	
	showListpricewithtag: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var message = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.listprice");
		if (this.price.customerDiscount<1 || this.price.listprice>this.price.price_1) {
			var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
			var amt = new String(this.price.listprice+this.price.setup);
			this.containers.get(propName).update(message.domain.message+": "+currency.domain.sign+" <span class=item-list-price>"+this.getDollar(amt)+"."+this.getCent(amt)+"</span>").show();
		}
		else {
			this.containers.get(propName).hide();
		} 
	},
	
	refreshListpricewithtag: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var message = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.listprice");
		if (this.price.customerDiscount<1 || this.price.listprice>this.price.price_1) {
			var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
			var amt = new String(this.price.listprice+this.price.setup);
			this.containers.get(propName).update(message.domain.message+": "+currency.domain.sign+" <span class=item-list-price>"+this.getDollar(amt)+"."+this.getCent(amt)+"</span>").show();
		}
		else {
			this.containers.get(propName).hide();
		} 
	},

	showListprice: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var amt = new String(Math.round((this.price.listprice+this.price.setup)*100)/100);		 
		this.containers.get(propName).update(this.getDollar(amt)+"."+this.getCent(amt));
	},
	
	refreshListprice: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}

		var amt = new String(Math.round((this.price.listprice+this.price.setup)*100)/100);
		this.containers.get(propName).update(this.getDollar(amt)+"."+this.getCent(amt));
	},
	
	showRegprice : function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price.customerDiscount < 1) {
			if (this.price!=undefined) {
				this.containers.get(propName).parentNode.parentNode.style.display='block';
				this.containers.get(propName).show();
			} else {
				this.containers.get(propName).parentNode.parentNode.style.display='none';
				this.containers.get(propName).hide();
				return;
			}
			var amt = this.price.price_1;
			var s_amt = new String(amt);
			this.containers.get(propName).update(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
		}
	},
	
	refreshRegprice : function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price.customerDiscount < 1) {
			if (this.price!=undefined) {
				this.containers.get(propName).parentNode.parentNode.style.display='block';
				this.containers.get(propName).show();
			} else {
				this.containers.get(propName).parentNode.parentNode.style.display='none';
				this.containers.get(propName).hide();
				return;
			}
			var amt = this.price.price_1;
			var s_amt = new String(amt);
			this.containers.get(propName).update(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
		}
	},
	
	showExtrapercentage : function(propName) {
		if (this.isExist(propName)==false) return;

		if (this.price.customerDiscount < 1) {
			if (this.price!=undefined) {
				this.containers.get(propName).parentNode.parentNode.style.display='block';
				this.containers.get(propName).show();
			} else {
				this.containers.get(propName).parentNode.parentNode.style.display='none';
				this.containers.get(propName).hide();
				return;
			}
			var percentage = Math.round((1 - this.price.customerDiscount)*100);
			this.containers.get(propName).update(percentage+"%");
		}
	},
	
	refreshExtrapercentage : function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price.customerDiscount < 1) {
			if (this.price!=undefined) {
				this.containers.get(propName).parentNode.parentNode.style.display='block';
				this.containers.get(propName).show();
			} else {
				this.containers.get(propName).parentNode.parentNode.style.display='none';
				this.containers.get(propName).hide();
				return;
			}
			var percentage = Math.round((1 - this.price.customerDiscount)*100);
			this.containers.get(propName).update(percentage+"%");
		}
	},
	
	showExtraamount : function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		var amt = Math.round((Math.round((this.price.price_1*(1-this.price.customerDiscount))*100)/100)*100)/100;
		var s_amt = new String(amt);
		this.containers.get(propName).update(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
	},
	
	refreshExtraamount : function(propName) {
if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		var amt = Math.round((Math.round((this.price.price_1*(1-this.price.customerDiscount))*100)/100)*100)/100;
		var s_amt = new String(amt);
		this.containers.get(propName).update(this.getDollar(s_amt)+"."+this.getCent(s_amt)).show();
	},
	
	showAwardpoint:function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		this.containers.get(propName).update(this.price.awardPoint).show();
	},
	
	refreshAwardpoint:function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		this.containers.get(propName).update(this.price.awardPoint).show();
	},
	

	
	showPricedollar:function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var price = new String(this.calculatePrice(this.price, this.qty));
		var format_price=formatCurrency(this.getDollar(price),this.price);
		this.containers.get(propName).update(format_price).show();
		
		if (this.price.customerDiscount < 1) {
			this.containers.get(propName).parentNode.parentNode.className += ' special-price';
		}
	},
	refreshPricedollar:function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var price = new String(this.calculatePrice(this.price, this.qty));			
		this.containers.get(propName).update(this.getDollar(price)).show();
	},
	showPricecent:function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var price = new String(this.calculatePrice(this.price, this.qty));
		this.containers.get(propName).update(this.getCent(price)).show();
	},
	refreshPricecent:function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		
		var price = new String(this.calculatePrice(this.price, this.qty));
		this.containers.get(propName).update(this.getCent(price)).show();
	},	
	showPrice: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
		var price = new String(this.calculatePrice(this.price, this.qty));
		this.containers.get(propName).update('<span class="symbol">'+currency.domain.sign+
			'</span><span class="dollars">'+this.getDollar(price)+'</span><span class=cents>'+this.getCent(price)+'</span>');

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
	refreshPrice: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).show();
		else {
			this.containers.get(propName).hide();
			return;
		}
		var currency = new Commerce.Domain.Currency(this.price.vendorid, this.price.currencyid);
		var price = new String(this.calculatePrice(this.price, this.qty));
		this.containers.get(propName).update('<span class="symbol">'+currency.domain.sign+
			'</span><span class="dollars">'+this.getDollar(price)+'</span><span class=cents>'+this.getCent(price)+'</span>');
	},
	
	showNoprice: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).hide();
		else
			this.containers.get(propName).show();
	},
	
	refreshNoprice: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.price!=undefined)
			this.containers.get(propName).hide();
		else
			this.containers.get(propName).show();
	},
	
	showInventory: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.inventory == undefined) {
			this.containers.get(propName).hide();
			return;
		}else
			this.containers.get(propName).show();
		if(this.inventory.hide==false){
		  var m_avai = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.availability");
		  if (this.inventory.instock > 0) {
			   var m_instock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.instock");
			   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+this.inventory.instock+"</div></div>");
		  }else if(this.inventory.nextshipqty >0){
			  var m_shipson = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.shipson");
			   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_shipson.domain.message+" "+this.inventory.nextshipdate+"</div></div>");
		  }else if(this.inventory.dropshipminqty >0){
			  var m_dropship = new Commerce.Domain.Message(this.vid, "deliveryoption.dropshipMsg2");
			   this.containers.get(propName).update("<div class=\"f-row\"><div class=\"f-field\">"+m_dropship.domain.message.replace("{0}",this.inventory.dropshipminqty)+"</div></div>");
		  }else if(this.inventory.dropshipminqty==0 && this.inventory.permitnostock==true){
			  var m_usualships = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.usualships");
			   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_usualships.domain.message+"</div></div>");
		  }else{
			  var m_outofstock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.outstock");
			   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_outofstock.domain.message+"</div></div>");
		  }
		}
	},
	
	refreshInventory: function(propName) {
		if (this.isExist(propName)==false) return;
		
		if (this.inventory == undefined) {
			this.containers.get(propName).hide();
			return;
		}else
			this.containers.get(propName).show();
		if(this.inventory.hide==false){
		    var m_avai = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.availability");	
		    if (this.inventory.instock > 0) {
				   var m_instock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.instock");
				   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+this.inventory.instock+"</div></div>");
			  }else if(this.inventory.nextshipqty >0){
				  var m_shipson = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.shipson");
				   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_shipson.domain.message+" "+this.inventory.nextshipdate+"</div></div>");
			  }else if(this.inventory.dropshipminqty >0){
				  var m_dropship = new Commerce.Domain.Message(this.vid, "deliveryoption.dropshipMsg2");
				   this.containers.get(propName).update("<div class=\"f-row\"><div class=\"f-field\">"+m_dropship.domain.message.replace("{0}",this.inventory.dropshipminqty)+"</div></div>");
			  }else if(this.inventory.dropshipminqty==0 && this.inventory.permitnostock==true){
				  var m_usualships = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.usualships");
				   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_usualships.domain.message+"</div></div>");
			  }else{
				  var m_outofstock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.outstock");
				   this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_outofstock.domain.message+"</div></div>");
			  }
		}		
	},
	
	showShortdesc: function(propName) {
		if (this.isExist(propName)==false) return;
		
		this.containers.get(propName).update(this.currentSkuBO.item.domain.shortdesc);
	},
	refreshShortdesc: function(propName) {
		if (this.isExist(propName)==false) return;
		
		this.containers.get(propName).update(this.currentSkuBO.item.domain.shortdesc);
	},
	showImage: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		
		if(this.currentSkuBO.lp_itemimage) {
			el.src = this.currentSkuBO.lp_itemimage;
		} else {
			el.src = "store"+this.currentSkuBO.item.domain.image;
		}			
	},
	refreshImage: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.title;
		
		if(this.currentSkuBO.lp_itemimage) {
			el.src = this.currentSkuBO.lp_itemimage;
		} else {
			el.src = "store"+this.currentSkuBO.item.domain.image;
		}		
	},
	showImagelink: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		
		if(this.currentSkuBO.lp_largeimage) {
			el.href = this.currentSkuBO.lp_largeimage;
		} else {
			el.href = "store"+this.currentSkuBO.item.domain.image3;
		}		
	},
	refreshImagelink: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		if(this.currentSkuBO.lp_largeimage) {
			el.href = this.currentSkuBO.lp_largeimage;
		} else {
			el.href = "store"+this.currentSkuBO.item.domain.image3;
		}		
	},
	showImagelink2: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		if(this.currentSkuBO.lp_largeimage) {
			el.href = this.currentSkuBO.lp_largeimage;
		} else {
			el.href = "store"+this.currentSkuBO.item.domain.image3;
		}
	},
	refreshImagelink2: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		if(this.currentSkuBO.lp_largeimage) {
			el.href = this.currentSkuBO.lp_largeimage;
		} else {
			el.href = "store"+this.currentSkuBO.item.domain.image3;
		}		
	},
	showCimage: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		if (this.currentSkuBO.item.domain.cimage == null)
			el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
		else
			el.src = "store"+this.currentSkuBO.item.domain.cimage;
	},
	refreshCimage: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.title = this.currentSkuBO.item.domain.title;
		if (this.currentSkuBO.item.domain.cimage == null)
			el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
		else
			el.src = "store"+this.currentSkuBO.item.domain.cimage;
	},
	showLongdesc: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var desc = this.currentSkuBO.item.domain.longdesc;
		if (desc != undefined && desc !='')
			this.containers.get(propName).update(desc);
		else
			this.containers.get(propName).update('');
	},
	refreshLongdesc: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var desc = this.currentSkuBO.item.domain.longdesc;
		if (desc != undefined && desc !='')
			this.containers.get(propName).update(desc);
		else
			this.containers.get(propName).update('');
	},
	showLongdesc2: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var desc = this.currentSkuBO.item.domain.longdesc2;
		if (desc != undefined && desc !='')
			this.containers.get(propName).update(desc);
		else
			this.containers.get(propName).update('');
	},
	refreshLongdesc2: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var desc = this.currentSkuBO.item.domain.longdesc2;
		if (desc != undefined && desc !='')
			this.containers.get(propName).update(desc);
		else
			this.containers.get(propName).update('');
	},
	showProperties: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var props = this.currentSkuBO.item.domain.properties;

		var content='';
		if (Object.isUndefined(props) == false) {
			for(var idx=0; idx<props.length; idx++) {
				if (idx==props.length-1)
					content+='<div class="details" style="border: none;"><div class="left"><b>'+props[idx].propname+'</b></div><div class="right">'
							+props[idx].propvalue+'</div></div>';			
				else
					content+='<div class="details"><div class="left"><b>'+props[idx].propname+'</b></div><div class="right">'
							+props[idx].propvalue+'</div></div>';
			}
		}
		this.containers.get(propName).update(content);
	},
	refreshProperties: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var props = this.currentSkuBO.item.domain.properties;
		var content='';
		if (Object.isUndefined(props) == false) {
			for(var idx=0; idx<props.length; idx++) {
				if (idx==props.length-1)
					content+='<div class="details" style="border: none;"><div class="left"><b>'+props[idx].propname+'</b></div><div class="right">'
							+props[idx].propvalue+'</div></div>';			
				else
					content+='<div class="details"><div class="left"><b>'+props[idx].propname+'</b></div><div class="right">'
							+props[idx].propvalue+'</div></div>';
			}
		}
		this.containers.get(propName).update(content);
	},
	
	showQtybox: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.value = this.qty;
		el.disabled = false;
		el.onkeypress = this.validateNumber.bindAsEventListener(this);
		el.observe('keyup', this.updatePrice.bindAsEventListener(this));
	},
	validateNumber: function(event) {

		var key;
     if(window.event)
          key = window.event.keyCode;     //IE
     else
          key = event.which;     //firefox
		if (key==13 ||(key>=65 && key<=122)) {
			return false;
		}
		else
			return true;
	},
	updatePrice: function(event) {
		var qty = event.element().value;
		if(isNaN(qty)==false) {
			this.qty = qty;
			this.hiddenFields.setBasketField('quantity', this.qty);
			this.refreshPrice('price');
		}

	},	
	refreshQtybox: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		el.value = this.qty;
	},
	
	showAddtocartbtn: function(propName) {
		if (this.isExist(propName)==false) return;
		
		var el = this.containers.get(propName);
		if (this.allAttributesSelected && this.price!=undefined )
			el.disabled=false;
		else {
			el.disabled=true;
		}
		
		el.observe('click', this.askMinorderQTY.bindAsEventListener(this));
	},
	
	askDeliveryOption: function(event) {
		this.qty = this.containers.get('qtybox').value;
		var devliveryOption = new Commerce.Shop.ItemPage.DeliveryOption(this, this.vid, this.inventoryCode, this.qty, this.hiddenFields.getBasketField('inventoryHistoryId'));
	},
	
	askMinorderQTY: function(event) {
		this.qty = this.containers.get('qtybox').value;
		this.getMinorderQTY(this.vid,this.qty, this.inventoryCode);
	},
	
	getMinorderQTY: function(vid,qty,inventoryCode) {
		var params = new Hash();
		params.set('mode',this.mode);
		params.set('type',1);
		params.set('vid', vid);
		params.set('qty', qty);
		params.set('invcode', inventoryCode);
		this.ajaxCheckMinorderQTY(params.toQueryString(), 'getminorderQTY.ajx');
	},
	
	ajaxCheckMinorderQTY: function(params, URL) {
		new Ajax.Request(URL, {
			method: 'post',
			parameters: params,
			asynchronous: false,
			onSuccess: this.onSuccess.bind(this),
		});
	},

	onSuccess: function(response) {
		var arr = response.responseText.evalJSON();
		var result = arr.__Result;
		var message = result.message;
		if(message!=''){
			var popup = new Commerce.Popup(undefined, message, undefined);
			popup.show();
		}else{
			this.qty = this.containers.get('qtybox').value;
			var result_replaceditemcode=result.replaceditemcode;
			if(result_replaceditemcode!=''){
				this.compositeCode =result_replaceditemcode;
				this.currentSkuBO.item.domain.itemid=result.deliveryitemid;
				document.getElementById('replaceditemmsg_0').value =result.replaceditemmsg;
			}
			var devliveryOption = new Commerce.Shop.ItemPage.DeliveryOption(this, this.vid, this.inventoryCode, this.qty, this.hiddenFields.getBasketField('inventoryHistoryId'),result_replaceditemcode);
		}
	},
	
	
	
	afterDeliveryOption: function(devliveryOption) {
		if (this.allAttributesSelected && this.price!=undefined ) {
			if (devliveryOption.isSuccess) {
				this.hiddenFields.setBasketField('inventoryHistoryId', devliveryOption.getInventoryHistoryId());
				if(devliveryOption.optionid==5) {
					this.containers.get('qtybox').value = devliveryOption.qty;
					this.qty = devliveryOption.qty;
				}
				this.addToCart();
			}
			else if (devliveryOption.isCancel==false) {
				var popup = new Commerce.Popup(undefined, devliveryOption.getErrorMessage(), undefined);
				popup.show();
			}
		}
		if (this.allAttributesSelected==false) {
			var message = new Commerce.Domain.Message(this.vid, "vm.itemtemplate.error.selectoption");
			var popup = new Commerce.Popup(undefined, message.domain.message, undefined);
			popup.show();
		}
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
					this.hiddenFields.setBasketField('attributes['+idx+'].optionId', attribs[idx].getValue);
				else
					this.hiddenFields.setBasketField('attributes['+idx+'].value', attribs[idx].getValue);
			}
		}

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
		if (this.isExist(propName)==false) return;
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

Commerce.Shop.ItemPage.Attribute =  Class.create({
	
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
		var e_fieldset = $(document.createElement("fieldset"));
		//e_fieldset.addClassName('f-form');
		container.insert(e_fieldset, 'bottom');
		for(var idx2=0; idx2<attribs.length; idx2++) {
			var events = [];
			var e_div2 = undefined;
			attribs[idx2].optionFilter = this.skuBO.mainItemSkus.values();
			var el;
			if (attribs[idx2].domain.attype=='2') {
				if (attribs[idx2].domain.format!='R') {
					e_div2 = this.createSelectBoxDiv(e_fieldset, attribs[idx2]);
					events = [['change', 'refreshItemByAttribute', eItem, this.propName]];
					attribs[idx2].initializeSelectBox('', [], events);
					if (eItem.mode == 'edit')
						el = attribs[idx2].toSelectBox(true, eItem.product.findOption(attribs[idx2].domain.attributeid));
					else
						el = attribs[idx2].toSelectBox(true, this.findOptionInSku(attribs[idx2].domain.attributeid, sku));
					e_div2.appendChild(el);	
				}
				else {
					e_div2 = this.createRadioButtonDiv(e_fieldset, attribs[idx2]);
					events = [['click', 'refreshItemByAttribute', eItem, this.propName]];
					attribs[idx2].initializeSelectBox('custom1', ['f-row'], events, e_div2);
					if (eItem.mode == 'edit')
						el = attribs[idx2].toRadioButton(true, eItem.product.findOption(attribs[idx2].domain.attributeid));
					else
						el = attribs[idx2].toRadioButton(true, this.findOptionInSku(attribs[idx2].domain.attributeid, sku));
					//this.appendRadioOptionToParent(e_div2, el);
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
				e_div2.appendChild(el);
			}
			el.id = this.assembleElementID(attribs[idx2].domain.attributeid);
			el.enablesku = attribs[idx2].domain.enablesku;
			attribs[idx2].optionWeight = 1000; //initial weight
			this.selectBoxs.push(el);
		}
		if ($('preloader'))	$('preloader').hide();
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
		var e_div = $(document.createElement("fieldset"));
		e_fieldSet.appendChild(e_div);
		e_div.addClassName('f-row');
	
		var e_label = $(document.createElement("legend"));
		e_div.appendChild(e_label);
		
		e_label.innerHTML = attribs.domain.screenname;
		
		return e_div;
	},
	createSelectBoxDiv: function(e_fieldSet, attribs) {
		var e_div = $(document.createElement("div"));
		e_fieldSet.appendChild(e_div);
		e_div.addClassName('f-row');
	
		var e_label = $(document.createElement("label"));
		e_div.appendChild(e_label);
		
		var textNode;
		textNode = new Commerce.InnerHTML({content: attribs.domain.screenname});

		var label = textNode.toElement();
		this.labels.push(label);
		e_label.appendChild(label);

		var e_div2 = $(document.createElement("div"));
		e_div2.addClassName('f-field');
		e_div.appendChild(e_div2);
		
		return e_div2;
	},
	createTextBoxDiv: function(e_fieldSet, attribs) {
		var e_div = $(document.createElement("div"));
		e_fieldSet.appendChild(e_div);
		e_div.addClassName('f-row');
	
		var e_label = $(document.createElement("label"));
		e_div.appendChild(e_label);
		
		var textNode;
		textNode = new Commerce.InnerHTML({content: attribs.domain.screenname});

		var label = textNode.toElement();
		this.labels.push(label);
		e_label.appendChild(label);

		var e_div2 = $(document.createElement("div"));
		e_div2.addClassName('f-field');
		e_div.appendChild(e_div2);
		
		return e_div2;
	},
	
	findOptionInSku: function(attributeid, skuString) {
		
		if (Object.isUndefined(skuString)) return 0;
		
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
		
		var updatedAttrib = this.attribs.find(function(attr) {return updatedAttribID==attr.domain.attributeid;});
		if (updatedAttrib.domain.enablesku == false) {
			return this.skuBO;
		}
		updatedAttrib = this.skuAttribs.find(function(attr) {return updatedAttribID==attr.domain.attributeid;});
		updatedAttrib.setSelected(updatedAttribElement.value);
		updatedAttrib.removeNullOption();		
		if (updatedAttrib.optionWeight == 1000)
			updatedAttrib.optionWeight = this.getOptionWeight();
		
		var lastFilter;
		var attribs = this.skuAttribs.sortBy(function(attr) { return attr.optionWeight;});
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
		var attribs = this.skuAttribs.sortBy(function(attr) { return attr.optionWeight;});
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
		if (attribs == undefined)
			 attribs = this.attribs;
		for(var idx=0; idx<attribs.length; idx++) {
			if (attribs[idx].isSelected() == false)
				return false;
		}
		
		return true;
	},
	
	findSkuId: function(sku) {
		var key;
		this.skuBO.mainItemSkus.each(function(pair) {
			if(pair.value == sku) {
				key = pair.key;
				throw $break;
			}
		});
		
		return key;
	},
	
	assembleElementID: function(attributeid) {
		return attributeid;
	},
	
	parseAttribID: function(attribElement) {
		if (Object.isUndefined(attribElement.id)==false && attribElement.id>0) 
			return attribElement.id;
		else
			return (attribElement.name.split("_"))[1];
	}
	
});

Commerce.Shop.ItemPage.DeliveryOption = Class.create({
	
	initialize: function(eItem, vid, invcode, qty, invhistid,replaceditemcode) {
		//alert(vid+":"+invcode+":"+qty+":"+invhistid);
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
		this.replaceditemcode=replaceditemcode;
		this.getDeliveryOption();
	},
	
	updateDeliveryOption: function() {
		this.mode='update';
		this.optionid = this.radio.getValue();
		this.getDeliveryOption();
	},
	getDeliveryOption: function() {
		var params = new Hash();
		params.set('vid', this.vid);
		params.set('qty', this.qty);
		if (this.inventoryHistoryId != undefined)
			params.set('invhistid', this.inventoryHistoryId);
		if (this.optionid != undefined)
			params.set('optionid', this.optionid);
		params.set('invcode', this.inventoryCode);
		params.set('mode', this.mode);
		params.set('replaceditemcode', this.replaceditemcode);
		this.ajaxGetDeliveryOption(params.toQueryString(), 'getdeliveryoptions.ajx');
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
		var arr = response.responseText.evalJSON();
		
		if (arr.__Success=='false') {
			this.message = arr.__Message;
			this.isSuncess = false; 
			this.eItem.afterDeliveryOption(this);
		}
		else {
			var result = arr.__Result;
			var result_replaceditemcode=result.replaceditemcode;
			if(result_replaceditemcode!=''){
				if(result.deliveryitemid!=0){
					this.eItem.currentSkuBO.item.domain.itemid=result.deliveryitemid;
					document.getElementById('replaceditemmsg_0').value =result.replaceditemmsg;
				}
			}
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
				this.showPopup(result);
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
		var options = deliveryOption.options.sortBy(function(opt) { return opt.optionid;});
		options.each(function(opt) {
			var optdata = {};
			optdata.value = opt.optionid;
			optdata.content = opt.option;
			if (idx==0)
				optdata['default'] = 'true';
			else
				optdata['default'] = 'false';
			idx++;
			radioData.options.push(optdata);
		});
		this.radio = new Commerce.RadioButton(radioData);

		var buttonDiv = document.createElement('div');
		
		
		var okData = {};
		okData.href = 'javascript:void(0);';
		okData.content = deliveryOption.ok;
		okData.css = ['popup_button'];
		okData.events = [['click', 'updateDeliveryOption', this]];
		var button = new Commerce.Link(okData);
		buttonDiv.appendChild(button.toElement());
		
		var cancelData = {};
		cancelData.href = 'javascript:void(0);';
		cancelData.content = deliveryOption.cancel;
		cancelData.css = ['popup_button'];
		cancelData.events = [['click', 'cancel', this]];
		button = new Commerce.Link(cancelData);
		buttonDiv.appendChild(button.toElement());
		var el_radio = this.radio.toElement();

		this.popup = new Commerce.Popup(deliveryOption.title, el_radio, deliveryOption.note, $(buttonDiv));
		this.popup.show();
	},
	cancel: function() {
		this.popup.hide();
		this.isCancel = true;
		this.isSuccess = false;
	},
	
	ajaxGetDeliveryOption: function(params, URL) {
		new Ajax.Request(URL, {
			method: 'post',
			parameters: params,
			asynchronous: false,
			onSuccess: this.onSuccess.bind(this),
			onFailure: this.onFailure.bind(this)
		});
	}
});

Commerce.Shop.ItemPage.HiddenFields = Class.create({
	
	initialize: function(locator, num) {
		if (num == undefined)
			this.bn = 0; //basket number
		else
			this.bn = num;
		this.fields = new Hash();
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
		if (el == undefined)
			this.fields.set(name, this.newElement(name, value));
		else
			el.value = value;
	},
	
	getField: function(name) {
		var el = this.fields.get(name);
		if (el == undefined)
			return undefined;
		else
			return el.value;
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
function initPage(targetdiv) {
	var vid = $F('js-vid');
	
	var gup = function( name ) {
		var results = (new RegExp("[\\?&]"+name+"=([^&#]*)")).exec(window.location.href);
		if ( results == null ) 
			{return ""}
		else 
			{return results[1]}
	};
	var divstring = (typeof(targetdiv)=='string' && targetdiv!='') ? targetdiv+' ' : '';

	itempage = new Commerce.Shop.ItemPage(vid, gup('biid'),divstring);
}
function closePage() {
         itempage.cleanCache();
}
Event.observe(document, "dom:loaded", initPage);
Event.observe(window, 'unload', closePage);

