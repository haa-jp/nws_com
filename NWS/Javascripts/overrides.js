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
    // showImage: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.item.domain.title;
// 
      // if(this.currentSkuBO.lp_itemimage) {
        // el.src = this.currentSkuBO.lp_itemimage;
      // } else {
        // if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.image)){
          // el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.item.domain.image.length);
        // } else {
          // el.src = this.currentSkuBO.item.domain.image;
        // }
      // }
    // },
    // refreshImage: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.title;
// 
      // if(this.currentSkuBO.lp_itemimage) {
        // el.src = this.currentSkuBO.lp_itemimage;
      // } else {
        // if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.image)){
          // el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.item.domain.image.length);
        // } else {
          // el.src = this.currentSkuBO.item.domain.image;
        // }
      // }
    // },
    // showImagelink: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.item.domain.title;
// 
      // if(this.currentSkuBO.lp_largeimage) {
        // el.href = this.currentSkuBO.lp_largeimage;
      // } else {
        // el.href = this.currentSkuBO.item.domain.image3;
      // }
    // },
    // refreshImagelink: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.item.domain.title;
      // if(this.currentSkuBO.lp_largeimage) {
        // el.href = this.currentSkuBO.lp_largeimage;
      // } else {
        // el.href = this.currentSkuBO.item.domain.image3;
      // }
    // },
    // showImagelink2: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.item.domain.title;
      // if(/store\/http:\/\//.test(this.currentSkuBO.lp_largeimage)){
        // el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.lp_largeimage);
      // } else {
        // el.src = this.currentSkuBO.lp_largeimage;
      // }
// 
// //      if(this.currentSkuBO.lp_largeimage) {
// //        el.href = this.currentSkuBO.lp_largeimage;
// //      } else {
// //        el.href = this.currentSkuBO.item.domain.image3;
// //      }
    // },
    // refreshImagelink2: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.item.domain.title;
      // if(/store\/http:\/\//.test(this.currentSkuBO.lp_largeimage)){
        // el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.lp_largeimage);
      // } else {
        // el.src = this.currentSkuBO.lp_largeimage;
      // }
// //      if(this.currentSkuBO.lp_largeimage) {
// //        el.href = this.currentSkuBO.lp_largeimage;
// //      } else {
// //        el.href = this.currentSkuBO.item.domain.image3;
// //      }
    // },
    // showCimage: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.item.domain.title;
      // if (this.currentSkuBO.item.domain.cimage == null) {
        // el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
      // } else {
        // if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.cimage)){
          // el.src = this.currentSkuBO.item.domain.cimage.substring(6, this.currentSkuBO.item.domain.cimage.length);
        // } else {
          // el.src = this.currentSkuBO.item.domain.cimage;
        // }
      // }
    // },
    // refreshCimage: function(propName) {
      // if (this.isExist(propName)==false) return;
// 
      // var el = this.containers.get(propName);
      // el.title = this.currentSkuBO.item.domain.title;
      // if (this.currentSkuBO.item.domain.cimage == null) {
        // el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
      // } else {
        // if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.cimage)){
          // el.src = this.currentSkuBO.item.domain.cimage.substring(6, this.currentSkuBO.item.domain.cimage.length);
        // } else {
          // el.src = this.currentSkuBO.item.domain.cimage;
        // }
      // }
    // },





// start jp
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
          this.containers.get(propName).update("<div class=\"f-row\"><span><b>"+m_avai.domain.message+"</b></span><div class=\"f-field\">" + this.inventory.instock + "</div></div>");
        }
        else if (this.inventory.instock <= 0) {
          var m_instock = new Commerce.Domain.Message(this.vid, "vm.itemTemplate.instock");
          this.containers.get(propName).update("<div class=\"f-row\"><span><b>"+m_avai.domain.message+"</b></span><div class=\"f-field\">Please Call</div></div>");
        }
        else if (this.inventory.nextshipqty >0) {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Please Call</div></div>");
        }
        else if (this.inventory.dropshipminqty >0) {
          this.containers.get(propName).update("<div class=\"f-row\"><div class=\"f-field\">No</div></div>");
        }
        else if (this.inventory.dropshipminqty==0 && this.inventory.permitnostock==true) {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Please Call</div></div>");
        }
        else {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Please Call</div></div>");
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
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Please Call</div></div>");
        } else if (this.inventory.dropshipminqty >0) {
          this.containers.get(propName).update("<div class=\"f-row\"><div class=\"f-field\">No</div></div>");
        } else if (this.inventory.dropshipminqty==0 && this.inventory.permitnostock==true) {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Please Call</div></div>");
        } else {
          this.containers.get(propName).update("<div class=\"f-row\"><span>"+m_avai.domain.message+"</span><div class=\"f-field\">Call</div></div>");
        }
      }
    },

// end Jp
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
        addToCart.text(btn_backorder);
        lostSale.show();
      }
      jQuery('#lost-code').val(itemCode);
    }

  });

  // Overrides the default popup dialog generator
  // To create the popup it is using handlebars.js to handle the template html
  // and load the data in it.
  Commerce.Popup.addMethods({
    initialize: function(header, body, footer, buttons){
      var template = Handlebars.compile(this.template);
      var domModal = $j("#delivery-popup");
      this.buttonsObj = buttons;
      this.radioObj = body;

      // If there is no modal create it using the template and pass the data to it
      if(domModal.length === 0){
        this.modal = $(document.createElement('div'));
        this.modal.innerHTML = template({
          header: header,
          body: this.radio_buttons(body),
          footer: footer,
          buttons: buttons ? this.buttons(buttons) : this.createDefaultButton()
        });
        document.body.appendChild(this.modal);

      // Otherwise use the existing popup and reuse it
      } else {
        this.modal = domModal.parent();
        this.modal.find("inpud:radio:checked").prop("checked", false);
        // remove all events so we dont have any orphan event hanging around
        this.modal.find("*").off();

        this.modal.html(template({
          header: header,
          body: this.radio_buttons(body),
          footer: footer,
          buttons: buttons ? this.buttons(buttons) : this.createDefaultButton()
        }));
      }

      // Uses bootstrap modal calls to generate the popup for the delivery option
      $j("#delivery-popup").modal({
        show: false,
        backdrop: false
      });
      this.initializeEvents();
    },

    // template used for the new delivery popup, used by handlebars.js to create
    // a DOM element that is going to be added to the body.
    template : '<div id="delivery-popup" class="modal hide fade">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                    <h3>{{header}}</h3>\
                  </div>\
                  <div class="modal-body">\
                    <div class="popup-body">\
                      {{#each body}}\
                        {{#if childNodes}}\
                          <label class="radio"><input type="radio" name="delivery" value="{{childNodes.0.value}}">\
                          {{elementText childNodes 1}}\
                          </label>\
                        {{/if}}\
                      {{/each}}\
                    </div>\
                    <div class="popup-footer">{{footer}}</div>\
                  </div>\
                  <div class="modal-footer">\
                  {{#each buttons}}\
                    {{#if innerHTML}}\
                      <a href="#" class="btn btn-primary {{#tolower}}{{innerHTML}}{{/tolower}}">{{innerHTML}}</a>\
                    {{/if}}\
                  {{/each}}\
                  </div>\
                </div>',

    // Creates the events handlers for the new popup (ok,cancel buttons, radios)
    initializeEvents: function(){
      var self = this;
      $j(".ok").click(function(e){
        if($j("input:radio:checked").prop("checked")){
          self.buttonsObj.childNodes[0].click();
          self.hide();
        }
        e.preventDefault();
      });

      $j(".cancel").click(function(e){
        self.buttonsObj.childNodes[1].click();
        e.preventDefault();
      });

      $j(".close").click(function(e){
        self.buttonsObj.childNodes[0].click();
        e.preventDefault();
      });

      $j("input:radio").click(function(e){
        var el = $j(e.target);
        var inputs = self.radioObj.getElementsByTagName("input");
        for(var i = 0; i < inputs.length; i++){
          if(inputs[i].value === el.val() && el.prop("checked")){
            inputs[i].checked = true;
          } else {
            inputs[i].checked = false;
          }
        }
      });
    },

    // Override commerce_shop cancel button to generate one with the bootstrap
    // css style
    createDefaultButton: function() {
      return '<a href="#" class="btn btn-primary">Cancel</a>';
    },

    buttons: function(buttons){
      return buttons.childNodes;
    },

    radio_buttons: function(radios){
      return radios.childNodes;
    },

    show: function() {
      $j("#delivery-popup").modal('show');
    },

    hide: function() {
      $j("#delivery-popup").modal('hide');
    },

    destroy: function() {
      $j("#delivery-popup").off().remove();
    }
  });
} catch (e) {
  console.warn(e.message);
}

// Loads handlebars helpers after all DOM is loaded.
// Template helpers are used in within the code of the template string defined above.
jQuery(document).ready(function(){

  // Handlebars helper to extract the text from a node element
  Handlebars.registerHelper('elementText', function(context, index) {
    if(!context){
      return "";
    }

    element = context[index];
    if(element.textContent){
      return element.textContent;
    } else {
      return element.innerText;
    }
  });

  // Helper function to change the case of the word in the template
  Handlebars.registerHelper('tolower', function(options) {
    return options.fn(this).toLowerCase();
  });

});

function genCancelButtonRow() {
  var tmp = $("<div id='js-popup-button'><div> \
      <a href='javascript:void(0);' class='popup_button' \
      onClick='closeMenuCancel("+ rowcount + ");'>Cancel</a></div></div>");
  return tmp;
}

// Copied the complete function to add just to add the new modal class so that
// boostrap can initialize it.
function openMenu() {

  var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;
  var itemcount = root.getElementsByTagName("ItemCount")[0].childNodes[0].nodeValue;
  var showpopups = false;
  var index;
  for ( var i = 0; i < itemcount; i++) {
    if(root.getElementsByTagName("showpopup" + i)[0] != undefined ) {
      var showpopup = root.getElementsByTagName("showpopup" + i)[0].childNodes[0].nodeValue;
      if (showpopup && showpopup == 'true') {
        showpopups = true;
        index = i;
      }
    }
  }
  var invhistid = root.getElementsByTagName("invhistid0")[0].childNodes[0].nodeValue;
  var rowcount = root.getElementsByTagName("totalItems")[0].childNodes[0].nodeValue;
  if (showpopups == false) {// no need show popup, ordered<instock OR there
    // is ONLY one option
    document.getElementById(preinvhist_hid).value = invhistid; // set
    // invhistid
    // to a
    // hidden
    // field

    if(itemIndex!=''){
          if (root.getElementsByTagName("changeqtyto0")[0] != null && root.getElementsByTagName("changeqtyto0")[0].childNodes[0] != null) {
        var changeqtyto = root.getElementsByTagName("changeqtyto0")[0].childNodes[0].nodeValue;
        if (changeqtyto != null) {
          var qtyfieldForOne = document.getElementById("qty_" + itemIndex);
          qtyfieldForOne.value = changeqtyto;
        }
      }
        }else{
      for ( var i = 0; i < itemcount; i++) {
        if (root.getElementsByTagName("changeqtyto" + i)[0] != null
            && root.getElementsByTagName("changeqtyto" + i)[0].childNodes[0] != null) {
          var changeqtyto = root.getElementsByTagName("changeqtyto" + i)[0].childNodes[0].nodeValue;
          if (changeqtyto != null) {
            var qtyfieldForOne = document.getElementById("qty_" + i);
            qtyfieldForOne.value = changeqtyto;
          }
        }
      }
      }

    // redirect itempage-->basket catepage-->no basket-->submit form
    if (actionmode == 'redirect') {
      eval("" + actioncontent + "");
    } else if (actionmode == 'exec')
      eval("validateBeforeSubmit(" + rowcount + ")");
  } else {
    var popupel = document.getElementById(popupid);

    var fasterMsg = "If you require faster delivery click OK then on the basket specify a required-by date and our staff will contact you with options.";
    var firstChooseMsg = "Please choose from the following delivery options:";
    var chooseAgainMsg = "The inventory level has changed.  Please reselect a delivery option.";
    var outOfStockMsg = "Sorry there is not enough stock to fulfill your request.";
    var dropshipMsg = "Sorry this item can only be drop shipped but a minimum quantity of {0} must be purchased. Click CANCEL and increase the quantity.";
    if (document.getElementById("fasterMsg") != null
        && document.getElementById("fasterMsg").value != null
        && document.getElementById("fasterMsg").value != "") {
      fasterMsg = document.getElementById("fasterMsg").value;
    }
    if (document.getElementById("firstChooseMsg") != null
        && document.getElementById("firstChooseMsg").value != null
        && document.getElementById("firstChooseMsg").value != "") {
      firstChooseMsg = document.getElementById("firstChooseMsg").value;
    }
    if (document.getElementById("chooseAgainMsg") != null
        && document.getElementById("chooseAgainMsg").value != null
        && document.getElementById("chooseAgainMsg").value != "") {
      chooseAgainMsg = document.getElementById("chooseAgainMsg").value;
    }
    if (document.getElementById("outOfStockMsg") != null
        && document.getElementById("outOfStockMsg").value != null
        && document.getElementById("outOfStockMsg").value != "") {
      outOfStockMsg = document.getElementById("outOfStockMsg").value;
    }
    if (document.getElementById("dropshipMsg") != null
        && document.getElementById("dropshipMsg").value != null
        && document.getElementById("dropshipMsg").value != "") {
      dropshipMsg = document.getElementById("dropshipMsg").value;
    }

    var inventorychanged = root.getElementsByTagName("inventorychanged0")[0].childNodes[0].nodeValue;
    var dsmq = root.getElementsByTagName("dropshipminqty0");
    var dropshipminqty = "";
    if (dsmq && dsmq.length > 0)
      dropshipminqty = dsmq[0].childNodes[0].nodeValue;

    var content = "";
    var options = genDeliveryOptions(root, index);
    if (options == '') {// there is no options
      content = genDivHeader("");
      if (dropshipminqty != "") {
        content += genDivBody(dropshipMsg
            .replace("{0}", dropshipminqty));
      } else {
        content += genDivBody(outOfStockMsg);
      }
      content += genDivFooter("");
      content += genCancelButtonRow();
    } else {
      if (inventorychanged && inventorychanged == 'true') {
        content += genDivHeader(chooseAgainMsg);
      } else {
        content += genDivHeader(firstChooseMsg);
      }
      content += genDivBody(options);
      content += genDivFooter(fasterMsg);
      content += genOKCancelButtonRows(rowcount);
    }

    $(popupel).addClass("modal");
    popupel.innerHTML = content;

    var center_x = (jQuery(window).width() - popupel.clientWidth) / 2
        + document.body.parentNode.scrollLeft;
    var center_y = (jQuery(window).height() - popupel.clientHeight) / 2
        + document.body.parentNode.scrollTop;

    // popupel.style.left = center_x + "px";
    // popupel.style.top = center_y + "px";
    popupel.style.visibility = "visible";
  }
}

// Overriding commerce_shop to add bootstrap styling classes
function genOKCancelButtonRows(index) {
  var tmp = "<div id='js-popup-button' class='modal-footer'>"
      + "<div>"
      + "<a href='javascript:void(0);' class='btn btn-primary' onClick='if(getCheckedOptionValue()==-1){alert(\"please check an option.\");} else { closeMenuOK("+index+"); } '>OK</a> "
      + "<a href='javascript:void(0);' class='btn' onClick='closeMenuCancel("+ index + ");'>Cancel</a>" + "</div>" + "</div>";
  return tmp;
}

// Overriding commerce_shop to add bootstrap styling classes
function genCancelButtonRow() {
  var tmp = "<div id='js-popup-button'>"
      + "<div>"
      + "<a href='javascript:void(0);' class='btn' onClick='closeMenuCancel("
      + rowcount + ");'>Cancel</a>" + "</div>" + "</div>";
  return tmp;
}

// Generating the options with handlebars
function genOptionRow(optionvalue, optioncontent) {
  var template = '<label class="radio"> \
                    <input type="radio" name="deliveryoption" value="{{optionvalue}}">\
                    {{optioncontent}}\
                  </label>';
  var row = Handlebars.compile(template);
  return row({
    optionvalue: optionvalue,
    optioncontent: optioncontent
  });
}

// Overriding commerce_shop to add bootstrap styling classes
function genDivHeader(msg) {
  var tmp = "<div id='js-popup-header' class='modal-header'><h4>" + msg + "</h4></div>";
  return tmp;
}

// Overriding commerce_shop to add bootstrap styling classes
function genDivBody(msg) {
  var tmp = "<div id='js-popup-body' class='modal-body'>" + msg + "</div>";
  return tmp;
}

// Overriding commerce_shop to add bootstrap styling classes
function genDivFooter(msg) {
  var tmp = "<div id='js-popup-footer' class='modal-body'>" + msg + "</div>";
  return tmp;
}
