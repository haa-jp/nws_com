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
      if(/store\/http:\/\//.test(this.currentSkuBO.lp_largeimage)){
        el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.lp_largeimage);
      } else {
        el.src = this.currentSkuBO.lp_largeimage;
      }

//      if(this.currentSkuBO.lp_largeimage) {
//        el.href = this.currentSkuBO.lp_largeimage;
//      } else {
//        el.href = this.currentSkuBO.item.domain.image3;
//      }
    },
    refreshImagelink2: function(propName) {
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.item.domain.title;
      if(/store\/http:\/\//.test(this.currentSkuBO.lp_largeimage)){
        el.src = this.currentSkuBO.item.domain.image.substring(6, this.currentSkuBO.lp_largeimage);
      } else {
        el.src = this.currentSkuBO.lp_largeimage;
      }
//      if(this.currentSkuBO.lp_largeimage) {
//        el.href = this.currentSkuBO.lp_largeimage;
//      } else {
//        el.href = this.currentSkuBO.item.domain.image3;
//      }
    },
    showCimage: function(propName) {
      if (this.isExist(propName)==false) return;

      var el = this.containers.get(propName);
      el.title = this.currentSkuBO.item.domain.title;
      if (this.currentSkuBO.item.domain.cimage == null) {
        el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
      } else {
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
      if (this.currentSkuBO.item.domain.cimage == null) {
        el.src = "store/"+this.vid+"/assets/images5/no_img.gif";
      } else {
        if(/store\/http:\/\//.test(this.currentSkuBO.item.domain.cimage)){
          el.src = this.currentSkuBO.item.domain.cimage.substring(6, this.currentSkuBO.item.domain.cimage.length);
        } else {
          el.src = this.currentSkuBO.item.domain.cimage;
        }
      }
    },





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

  Commerce.Shop.ItemPage.DeliveryOption.addMethods({
/*
    onSuccess: function(response) {
      var arr = response.responseText.evalJSON();
      arr = this.shipAvailableOnly(arr);

      if (arr.__Success=='false') {
        this.message = arr.__Message;
        this.isSuncess = false;
        this.eItem.afterDeliveryOption(this);
      }
      else {
        var result = arr.__Result;
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
*/
    shipAvailableOnly: function(res){
      this.availableQty = res.__Result.options[0].option.match(/Yes, ship ([0-9]+) now/)[1];

      res.__Result.options.push({
        option: "Ship "+ this.availableQty +" now, I do not want to create a backorder",
        optionid: 21
      });

      return res;
    },

    deleteRadioOption :function(res){
      res.__Result.options.push({
        option: "Remove line from order",
        optionid: 20
      });

      return res;
    },

    getDeliveryOption: function() {
      var params = new Hash();
      params.set('vid', this.vid);
      params.set('qty', this.qty);

      if (this.inventoryHistoryId != undefined){
        params.set('invhistid', this.inventoryHistoryId);
      }

      params.set('invcode', this.inventoryCode);
      params.set('mode', this.mode);

      if (this.optionid !== undefined){
        if(this.optionid === "21"){
          debugger;
          this.eItem.qty = this.availableQty;
          this.eItem.addToCart();
          return false;
        }

        params.set('optionid', this.optionid);
      }
      this.ajaxGetDeliveryOption(params.toQueryString(), 'getdeliveryoptions.ajx');
    }
  });

  Commerce.Popup.addMethods({
    initialize: function(header, body, footer, buttons){
      var template = Handlebars.compile(this.template);
      var domModal = $j("#delivery-popup");
      this.buttonsObj = buttons;
      this.radioObj = body;

      if(domModal.length === 0){
        this.modal = $(document.createElement('div'));
        this.modal.innerHTML = template({
          header: header,
          body: this.radio_buttons(body),
          footer: footer,
          buttons: buttons ? this.buttons(buttons) : this.createDefaultButton()
        });
        document.body.appendChild(this.modal);

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

      $j("#delivery-popup").modal({
        show: false,
        backdrop: false
      });
      this.initializeEvents();
    },

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

// Loads handlebars helpers after all is loaded
jQuery(document).ready(function(){

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

  Handlebars.registerHelper('tolower', function(options) {
    return options.fn(this).toLowerCase();
  });

});

// window.qty_to_update = 0;

// function checkMinOrderQTY(index, checkedOption, mode, action){
//   var vid = $("#vid").val(),
//       prevInv = $("input:hidden[id='basketItems["+index+"].inventoryHistoryId']").val(),
//       compCode = $("#compCode_" + index).val(),
//       qty = $("#qty_" + index).val(),
//       url = "getminorderQTY.ajx",
//       typeForDelivery = $("#type-" + index).val(),
//       delete_line_from_basket = "20";

//   var modal = $('<div id="delivery-popup" class="modal hide fade" style="top:100%"> \
//                 <div class="modal-header"></div> \
//                 <div class="modal-body"></div> \
//                 <div class="modal-footer"> \
//                   <a href="#" class="btn">close</a> \
//                 </div> \
//               </div>');

//   var data = {
//     type: 1,
//     vid: vid,
//     mode: 'query',
//     invcode: compCode,
//     qty: qty
//   };

//   var minOrderDeferred = $.ajax({
//     url: url,
//     type: 'GET',
//     data: data,
//     dataType : "json",
//   }).done(function(res){
//     if (res.__Result.message !== "") {
//       modal.find(".modal-body").text(res.__Result.message);
//       $('body').append(modal);

//       if($("#delivery-popup").length !== 0){
//         $("#delivery-popup").show();
//       } else {
//         $("#delivery-popup").modal({
//           backdrop: false
//         });
//       }
//     } else {
//       if(checkedOption === delete_line_from_basket){
//         showToastr('remove');
//         removeFromBasket(index);
//       } else{
//         checkInventorys(index, typeForDelivery, checkedOption, mode, action);
//       }
//     }
//   });
// }

function genCancelButtonRow() {
  var tmp = $("<div id='js-popup-button'><div> \
      <a href='javascript:void(0);' class='popup_button' \
      onClick='closeMenuCancel("+ rowcount + ");'>Cancel</a></div></div>");
  return tmp;
}

// function checkInventorys(index, type, checkedOption, mode, action){
//   var url = "getdeliveryoptions.ajx";
//       vid = $("#vid").val(),
//       prevInv = $("input:hidden[id='basketItems["+index+"].inventoryHistoryId']").val(),
//       compCode = $("#compCode_" + index).val(),
//       qty = parseInt($("#qty_" + index).val());


//   var modal = Handlebars.compile('<div id="delivery-popup" class="modal hide fade"> \
//                 <div class="modal-header">{{{title}}}</div> \
//                 <div class="modal-body"> \
//                   {{{body}}} \
//                   <div class="popup-footer">{{{footer}}}</div> \
//                 </div> \
//                 <div class="modal-footer"> \
//                   {{{buttons}}} \
//                 </div> \
//               </div>');

//   var data = {
//     vid: vid,
//     mode: mode,
//     invhistid: prevInv,
//     invcode: compCode,
//     qty: qty
//   };

//   var minOrderDeferred = $.ajax({
//     url: url,
//     type: 'GET',
//     data: data,
//     dataType : "json",
//   }).done(function(res){
//     var delOpt = window.deliveryOption;
//     // if(!checkedOption){
//     //   res = deleteRadioOption(res);
//     //   var sections = openMenu(res, index, mode, action);
//     //   $('body').append(modal({
//     //     title: sections.header,
//     //     body: sections.body,
//     //     footer: sections.footer,
//     //     buttons: sections.buttons
//     //   }));

//     //   $("#delivery-popup").modal({
//     //     backdrop: false
//     //   });
//     // } else {
//     //   var rowcount = res.getElementsByTagName("totalItems")[0].childNodes[0].nodeValue;
//     //   // redirect itempage-->basket catepage-->no basket-->submit form
//     //   if (mode == 'redirect') {
//     //     eval("" + action + "");
//     //   } else if (mode == 'exec'){
//     //     eval("validateBeforeSubmit(" + rowcount + ")");
//     //   }
//     // }
//     if(res.__Success === 'true'){
//       var result = res.__Result;
//       if (result.status == 2) {
//         delOpt.isSuccess = false;
//         delOpt.message = result.message;
//         if (result.invhistid !== undefined) {
//           delOpt.invhistid = result.invhistid;
//         }
//         afterDeliveryOption(delOpt, index);
//       } else if (result.status == 3) {
//         if (result.invhistid !== undefined) {
//           delOpt.invhistid = result.invhistid;
//         }
//         delOpt.isSuccess = true;
//         if(delOpt.optionid==5){
//           delOpt.qty=result.changeqtyto;
//         }
//         afterDeliveryOption(delOpt, index);
//       } else if (result.status == 1) {
//         delOpt.showPopup(result);
//       } else if (result.status == 5) {
//         delOpt.isSuccess = false;
//         delOpt.message = result.message;
//         afterDeliveryOption(delOpt, index);
//       }
//     } else {
//       delOpt.message = res.__Message;
//       delOpt.isSuccess = false;
//       afterDeliveryOption(delOpt, index);
//     }
//   });
// }

// function afterDeliveryOption(devliveryOption, index) {
//   if (devliveryOption.isSuccess) {
//     $("input:hidden[id='basketItems["+index+"].inventoryHistoryId']").val(deliveryOption.invhistid);
//     if(devliveryOption.optionid==5) {
//       this.containers.get('qtybox').value = devliveryOption.qty;
//       this.qty = devliveryOption.qty;
//     }
//     this.addToCart();
//   }
//   else if (devliveryOption.isCancel==false) {
//     var popup = new Commerce.Popup(undefined, devliveryOption.getErrorMessage(), undefined);
//     popup.show();
//   }

//   var message = new Commerce.Domain.Message(this.vid, "vm.itemtemplate.error.selectoption");
//   var popup = new Commerce.Popup(undefined, message.domain.message, undefined);
//   popup.show();
// }

// function deleteRadioOption(res){
//   res.__Result.options.push({
//     optionid: 20,
//     option:"Remove line from order"
//   });
//   return res;
// }

// function openMenu(res, index, actionmode, actioncontent) {
//   var result = res.__Result
//   var itemcount = result.options.length
//   var showpopups = false;

//   var showpopup = result.title;
//   if (showpopup !== '') {
//     showpopups = true;
//   }

//   var invhistid = result.invhistid;
//   if (showpopups === false) { // no need show popup, ordered<instock OR there
//     // is ONLY one option
//     $("input:hidden[id='basketItems["+index+"].inventoryHistoryId']").val(invhistid); // set invhistid to a hidden field

//     if (result.changeqtyto) {
//       var changeqtyto = result.changeqtyto;
//       if (changeqtyto !== null) {
//         var qtyfieldForOne = $("#qty_" + index);
//         qtyfieldForOne.value = changeqtyto;
//       }
//     }
//   } else {
//     var popupel = $(popupid);

//     var fasterMsg = "If you require faster delivery click OK then on the basket specify a required-by date and our staff will contact you with options.";
//     var firstChooseMsg = "Please choose from the following delivery options:";
//     var chooseAgainMsg = "The inventory level has changed.  Please reselect a delivery option.";
//     var outOfStockMsg = "Sorry there is not enough stock to fulfill your request.";
//     var dropshipMsg = "Sorry this item can only be drop shipped but a minimum quantity of {0} must be purchased. Click CANCEL and increase the quantity.";

//     if ($("fasterMsg") !== null && $("fasterMsg").value !== null && $("fasterMsg").value !== "") {
//       fasterMsg = $("fasterMsg").value;
//     }
//     if ($("firstChooseMsg") !== null && $("firstChooseMsg").value !== null && $("firstChooseMsg").value !== "") {
//       firstChooseMsg = $("firstChooseMsg").value;
//     }
//     if ($("chooseAgainMsg") !== null && $("chooseAgainMsg").value !== null && $("chooseAgainMsg").value !== "") {
//       chooseAgainMsg = $("chooseAgainMsg").value;
//     }
//     if ($("outOfStockMsg") !== null && $("outOfStockMsg").value !== null && $("outOfStockMsg").value !== "") {
//       outOfStockMsg = $("outOfStockMsg").value;
//     }
//     if ($("dropshipMsg") !== null && $("dropshipMsg").value !== null && $("dropshipMsg").value !== "") {
//       dropshipMsg = $("dropshipMsg").value;
//     }

//     var inventorychanged = root.getElementsByTagName("inventorychanged0")[0].childNodes[0].nodeValue;
//     var dsmq = root.getElementsByTagName("dropshipminqty0");
//     var dropshipminqty = "";
//     if (dsmq && dsmq.length > 0)
//       dropshipminqty = dsmq[0].childNodes[0].nodeValue;

//     var content = {};
//     var options = genDeliveryOptions(root, index);
//     if (options == '') { // there is no options
//       content.header = genDivHeader("");
//       if (dropshipminqty != "") {
//         content.body = genDivBody(dropshipMsg
//           .replace("{0}", dropshipminqty));
//       } else {
//         content.body = genDivBody(outOfStockMsg);
//       }
//       content.footer = genDivFooter("");
//       content.buttons = genCancelButtonRow();
//     } else {
//       if (inventorychanged && inventorychanged == 'true') {
//         content.header = genDivHeader(chooseAgainMsg);
//       } else {
//         content.header = genDivHeader(firstChooseMsg);
//       }
//       content.body = genDivBody(options);
//       content.footer = genDivFooter(fasterMsg);
//       content.buttons = genOKCancelButtonRows(index);
//     }
//     return content;
//   }
//   return {}
// }

function genOKCancelButtonRows(index) {
  var tmp = "<div id='js-popup-button'>"
      + "<div>"
      + "<a href='javascript:void(0);' class='btn btn-primary' onClick='if(getCheckedOptionValue()==-1){alert(\"please check an option.\");} else { closeMenuOK("+index+"); } '>OK</a>"
      + "<a href='javascript:void(0);' class='btn' onClick='closeMenuCancel("+ index + ");'>Cancel</a>" + "</div>" + "</div>";
  return tmp;
}

function genCancelButtonRow() {
  var tmp = "<div id='js-popup-button'>"
      + "<div>"
      + "<a href='javascript:void(0);' class='btn' onClick='closeMenuCancel("
      + rowcount + ");'>Cancel</a>" + "</div>" + "</div>";
  return tmp;
}

/*
function closeMenuCancel (rowcount) {
  $("#delivery-popup").modal("hide");
}
*/

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

/*
function closeMenuOK(index) {
  $("#delivery-popup").modal("hide");
  var checkedoptionvalue = getCheckedOptionValue();
  if(checkedoptionvalue === "1"){
    var qty = $("#delivery-popup input:radio:checked").parent().text().match(/Yes, ship ([0-9]+) now/)[1];
    $("#qty_" + index).val(qty);
  }

  checkMinOrderQTY(index, checkedoptionvalue, 'redirect', 'document.VIEWCART.mode.value=\'updateBasket\';document.VIEWCART.submit()');
}


function genDeliveryOptions(root, index) {
  var content = "<div name='delivery-option'>";
  var options = root.getElementsByTagName("deliveryoption" + index);
  if (options.length == 0) {
    return "";
  }
  for (i = 0; options && i < options.length; i++) {
    var optionvalue = options[i].childNodes[0].childNodes[0].nodeValue;
    var optioncontent = options[i].childNodes[1].childNodes[0].nodeValue;
    if (optioncontent.indexOf("when they become available") != -1
        || optionvalue == 20 || optionvalue == 21){
      content += genOptionRow(optionvalue, optioncontent);
    }
  }
  content += "</div>";
  return content;
}
*/