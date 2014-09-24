if (Commerce.Shop.ItemPage.Item !== 'undefined') {
	// Override commerce show cart button
	Commerce.Shop.ItemPage.Item.addMethods({

		showAddtocartbtn: function(propName) {
			if (this.isExist(propName)==false) return;
		
			var el = this.containers.get(propName);
			var warning = document.getElementById('add-to-cart-button-not-available').style;
			if (this.allAttributesSelected && this.price!=undefined && this.inventory.instock > 0) {
				el.style.display = 'block';
				warning.display = 'none';
				el.observe('click', this.askMinorderQTY.bindAsEventListener(this));
			} else {
				el.style.display = 'none';
				warning.display = 'block';
			}
		},
		showInventory: function(propName) {
			if (this.isExist(propName)==false) return;
			
			if (this.inventory == undefined || this.inventory.instock <= 0) {
				this.containers.get(propName).hide();
				return;
			} else {
				this.containers.get(propName).show();
			}
			
			if (this.inventory.hide==false) {
				var m_avai = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.availability");
				if (this.inventory.instock > 0) {
					var m_instock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.instock");
					this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+this.inventory.instock+"</div></div>");
			  	} else if(this.inventory.nextshipqty >0) {
					var m_shipson = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.shipson");
					this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_shipson.domain.message+" "+this.inventory.nextshipdate+"</div></div>");
				} else if(this.inventory.dropshipminqty >0){
					var m_dropship = new Commerce.Domain.Message(this.vid, "deliveryoption.dropshipMsg2");
					this.containers.get(propName).update("<div class=\"f-row\"><div class=\"f-field\">"+m_dropship.domain.message.replace("{0}",this.inventory.dropshipminqty)+"</div></div>");
				} else if(this.inventory.dropshipminqty==0 && this.inventory.permitnostock==true){
					var m_usualships = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.usualships");
					this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_usualships.domain.message+"</div></div>");
				} else {
					var m_outofstock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.outstock");
					this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">"+m_outofstock.domain.message+"</div></div>");
				}
			}
		}
	});
}