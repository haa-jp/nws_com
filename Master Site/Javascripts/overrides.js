try {
  Commerce.Shop.ItemPage.Item.addMethods({
    /*
    * Replace Hyphen from item code
    */
    showCode: function(propName) {
      if (this.isExist(propName)==false) return;
      var _itemCode = this.currentSkuBO.item.domain.code.replace('-','.');
      this.containers.get(propName).update(_itemCode);
      // Remove attr preloader if any
      this.removePreloader();
      // Call lostSale
      this._lostSale(_itemCode);
    },
    refreshCode: function(propName) {
      if (this.isExist(propName)==false) return;
      var _itemCode = this.currentSkuBO.item.domain.code.replace('-','.');
      this.containers.get(propName).update(_itemCode);
      // Remove attr preloader if any
      this.removePreloader();
      // Call lostSale
      this._lostSale(_itemCode);
    },
    /*
    * Fix hardcoding thats refreshing item images with wrong address in commerce shop
    */
    showImage: function(propName) {
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.item.domain.title;

      if(this.currentSkuBO.lp_itemimage) {
        el.src = this.currentSkuBO.lp_itemimage;
      } else {
        if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.image)){
          el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.item.domain.image.length);
        } else {
          el.src = this.currentSkuBO.item.domain.image;
        }
      }
    },
    refreshImage: function(propName) {
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.title;

      if(this.currentSkuBO.lp_itemimage) {
        el.src = this.currentSkuBO.lp_itemimage;
      } else {
        if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.image)){
          el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.item.domain.image.length);
        } else {
          el.src = this.currentSkuBO.item.domain.image;
        }
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
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.item.domain.title;
      if(this.currentSkuBO.lp_largeimage) {
        el.href = this.currentSkuBO.lp_largeimage;
      } else {
        el.href = this.currentSkuBO.item.domain.image3;
      }
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
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.item.domain.title;
      if(this.currentSkuBO.lp_largeimage) {
        el.href = this.currentSkuBO.lp_largeimage;
      } else {
        el.href = this.currentSkuBO.item.domain.image3;
      }
    },
    showCimage: function(propName) {
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.item.domain.title;
      if (this.currentSkuBO.item.domain.cimage == null)
        el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
      else {
        if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.cimage)){
          el.src = this.currentSkuBO.item.domain.cimage.substring(6, this.currentSkuBO.item.domain.cimage.length);
        } else {
          el.src = this.currentSkuBO.item.domain.cimage;
        }
      }
    },
    refreshCimage: function(propName) {
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.item.domain.title;
      if (this.currentSkuBO.item.domain.cimage == null)
        el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
      else {
        if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.cimage)){
          el.src = this.currentSkuBO.item.domain.cimage.substring(6, this.currentSkuBO.item.domain.cimage.length);
        } else {
          el.src = this.currentSkuBO.item.domain.cimage;
        }
      }
    },
    showInventory: function(propName) {
      if (this.isExist(propName)==false) return;
      
      if (this.inventory == undefined) {
        this.containers.get(propName).hide();
        return;
      } else {
        this.containers.get(propName).show();
      }
        
      if (this.inventory.hide==false){
        var m_avai = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.availability"); 
        if (this.inventory.instock > 0) {
          var m_instock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.instock");
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Yes</div></div>");
        } else if (this.inventory.nextshipqty >0) {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">No</div></div>");
        } else if (this.inventory.dropshipminqty >0) {
          this.containers.get(propName).update("<div class=\"f-row\"><div class=\"f-field\">No</div></div>");
        } else if (this.inventory.dropshipminqty==0 && this.inventory.permitnostock==true) {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">No</div></div>");
        } else {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">No</div></div>");
        }
      }   
    },
    refreshInventory: function(propName) {
      if (this.isExist(propName)==false) return;
      
      if (this.inventory == undefined) {
        this.containers.get(propName).hide();
        return;
      } else {
        this.containers.get(propName).show();
      }
        
      if (this.inventory.hide==false){
        var m_avai = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.availability"); 
        if (this.inventory.instock > 0) {
          var m_instock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.instock");
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Yes</div></div>");
        } else if (this.inventory.nextshipqty >0) {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">No</div></div>");
        } else if (this.inventory.dropshipminqty >0) {
          this.containers.get(propName).update("<div class=\"f-row\"><div class=\"f-field\">No</div></div>");
        } else if (this.inventory.dropshipminqty==0 && this.inventory.permitnostock==true) {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">No</div></div>");
        } else {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">No</div></div>");
        }
      }   
    },
    removePreloader: function() {
      jQuery('#preloader').remove();
    },

    _lostSale: function(itemCode) {
      var btn_add_msg = (new Commerce.Domain.Message(this.vid, "vm.itemTemplate.addtocart")).domain.message;
      var btn_backorder = 'Backorder';
      var addToCart = jQuery('.addToCartBtn span');
      var lostSale = jQuery('#lost-sale');
      if (this.inventory.instock > 0) {
        addToCart.text(btn_add_msg);
        lostSale.hide();
      } else {
        //addToCart.text(btn_backorder);
        //lostSale.show();
        jQuery('.addToCartFields').hide();
        jQuery('.addToCartContainer').text('Please check back soon.');
      }
      jQuery('#lost-code').val(itemCode);
    }

  });
} catch (e) {}