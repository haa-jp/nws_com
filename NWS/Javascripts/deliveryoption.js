var popupid = 'deliverypopup';
var inlineContainerIdPrefix = 'inlinecontainer';
var descriptionIdPrefix = 'description';
var inlineRadioButtonName = 'basketItems[{0}].newDeliveryOption';
var inlineDeliveryOptionChanged = true;
var globalCountryid = 0;
var globalProvinceid = 0;
var globalCity = "";
var globalPostal = "";
var globalAnotherprovince = "";
var addressIndex = 1;
var methodIndex = 2;
var basektFormName = "VIEWCART";

var preinvhist_hid, inventorycode, qtyid, preqty, actionmode, actioncontent, vid, rowcount, itemIndex, _type, _checkedoptionvalue, _preinvhistid;

function checkInventorys() {

	var url = "deliveryoption.html?vid=" + vid + "&type=" + _type
			+ "&checkedoptionvalue=" + _checkedoptionvalue + "&preinvhistid="
			+ _preinvhistid + "&ajax-request=true&count=" + rowcount;
	if (itemIndex != '') {
		var compCodeForOneItem = document.getElementById("compCode_"
				+ itemIndex);
		var curqtyForOneItem = document.getElementById("qty_" + itemIndex).value;
		url += "&compCode0=" + compCodeForOneItem.value;
		url += "&qty0=" + curqtyForOneItem;
	} else {
		for ( var i = 0; i < rowcount; i++) {
			var compCode = document.getElementById("compCode_" + i);
			var qtyid = "qty_" + i;
			var curqty = document.getElementById(qtyid).value;
			if (isNaN(curqty) || curqty.indexOf(".") > -1) {
				closeMenuCancel();
				return false;
			} else if (curqty >= 1) {

				url += "&compCode" + i + "=" + compCode.value;
				url += "&qty" + i + "=" + curqty;
			}
		}
	}

	url += "&total=" + rowcount;

	var ajxObj = new net.ContentLoader(url, openMenu, "get", "text", null);
}

function checkInventorysWithoutPopup() {

	var url = "deliveryoption.html?vid=" + vid + "&type=" + _type
			+ "&checkedoptionvalue=" + _checkedoptionvalue + "&preinvhistid="
			+ _preinvhistid + "&ajax-request=true&count=" + rowcount;
	if (itemIndex != '') {
		var compCodeForOneItem = document.getElementById("compCode_"
				+ itemIndex);
		var curqtyForOneItem = document.getElementById("qty_" + itemIndex).value;
		url += "&compCode0=" + compCodeForOneItem.value;
		url += "&qty0=" + curqtyForOneItem;
	} else {
		for ( var i = 0; i < rowcount; i++) {
			var compCode = document.getElementById("compCode_" + i);
			var qtyid = "qty_" + i;
			var curqty = document.getElementById(qtyid).value;
			if (isNaN(curqty) || curqty.indexOf(".") > -1) {
				closeMenuCancel();
				return false;
			} else if (curqty >= 1) {

				url += "&compCode" + i + "=" + compCode.value;
				url += "&qty" + i + "=" + curqty;
			}
		}
	}

	url += "&total=" + rowcount;

	var ajxObj = new net.ContentLoader(url, openMenuWithoutPopup, "get", "text", null);
}

function checkInventorysInline() {

	var url = "deliveryoption.html?vid=" + vid + "&type=" + _type
			+ "&checkedoptionvalue=" + _checkedoptionvalue + "&preinvhistid="
			+ _preinvhistid + "&ajax-request=true&count=" + rowcount;
	if (itemIndex != '') {
		var compCodeForOneItem = document.getElementById("compCode_"
				+ itemIndex);
		var curqtyForOneItem = document.getElementById("qty_" + itemIndex).value;
		url += "&compCode0=" + compCodeForOneItem.value;
		url += "&qty0=" + curqtyForOneItem;
	} else {
		for ( var i = 0; i < rowcount; i++) {
			var compCode = document.getElementById("compCode_" + i);
			var qtyid = "qty_" + i;
			var curqty = document.getElementById(qtyid).value;
			if (isNaN(curqty) || curqty.indexOf(".") > -1) {
				closeMenuCancel();
				return false;
			} else if (curqty >= 1) {

				url += "&compCode" + i + "=" + compCode.value;
				url += "&qty" + i + "=" + curqty;
			}
		}
	}

	url += "&total=" + rowcount;

	var ajxObj = new net.ContentLoader(url, openMenuInline, "get", "text", null);
}

function openMenuInline() {
	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;
	var itemcount = root.getElementsByTagName("ItemCount")[0].childNodes[0].nodeValue;
	var showpopups = false;
	var index;
	for ( var i = 0; i < itemcount; i++) {
		var showpopup = root.getElementsByTagName("showpopup" + i)[0].childNodes[0].nodeValue;
		if (showpopup && showpopup == 'true') {
			showpopups = true;
			index = i;
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
        	if (root.getElementsByTagName("changeqtyto0")[0] != null
					&& root.getElementsByTagName("changeqtyto0")[0].childNodes[0] != null) {
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
		// make post call to basket.html to update inventory history id
		jQuery("input[name='mode'][type='hidden']").val('updateBasket');
		// var url =
		// jQuery("input[name='_targetupdateBasket'][type='hidden']").val();
		var url = "updatebasket.ajx?vid=" + vid;
		var ajaxRequest = new AjaxRequest(url, jQuery(
				"form[name='" + basektFormName + "']").serialize(),
				updateBasketCallback);
		ajaxRequest.addUrlParameter("ajax-request", true);
		ajaxRequest.doRequest('POST', null, true);

		var qtyUpdatedMsg = "The quantity has been updated.";
		var qtyUpdatedMsg_i18n_el = document.getElementById("qtyUpdatedMsg");
		if (qtyUpdatedMsg_i18n_el != null
				&& qtyUpdatedMsg_i18n_el.value != null
				&& qtyUpdatedMsg_i18n_el.value != "") {
			qtyUpdatedMsg = qtyUpdatedMsg_i18n_el.value;
		}

		if (actionmode == 'redirect') {
			var descel = document.getElementById(descriptionIdPrefix
					+ itemIndex);
			var content = "<br><span style='color:red'>" + qtyUpdatedMsg
					+ "</span>";
			descel.innerHTML = content;
		}

	} else {
		var inlineel = document.getElementById(inlineContainerIdPrefix
				+ itemIndex);

		var reviewMsg = "Please review your delivery options.";
		var fasterMsg = "If you require faster delivery click OK then on the basket specify a required-by date and our staff will contact you with options.";
		var firstChooseMsg = "Please choose from the following delivery options:";
		var chooseAgainMsg = "The inventory level has changed.  Please reselect a delivery option.";
		var outOfStockMsg = "Sorry there is not enough stock to fulfill your request.";
		var dropshipMsg = "Sorry this item can only be drop shipped but a minimum quantity of {0} must be purchased.";

		var fasterMsg_i18n_el = document.getElementById("fasterMsg");
		if (fasterMsg_i18n_el != null && fasterMsg_i18n_el.value != null
				&& fasterMsg_i18n_el.value != "") {
			fasterMsg = fasterMsg_i18n_el.value;
		}

		var firstChooseMsg_i18n_el = document.getElementById("firstChooseMsg");
		if (firstChooseMsg_i18n_el != null
				&& firstChooseMsg_i18n_el.value != null
				&& firstChooseMsg_i18n_el.value != "") {
			firstChooseMsg = firstChooseMsg_i18n_el.value;
		}

		var chooseAgainMsg_i18n_el = document.getElementById("chooseAgainMsg");
		if (chooseAgainMsg_i18n_el != null
				&& chooseAgainMsg_i18n_el.value != null
				&& chooseAgainMsg_i18n_el.value != "") {
			chooseAgainMsg = chooseAgainMsg_i18n_el.value;
		}

		var outOfStockMsg_i18n_el = document.getElementById("outOfStockMsg");
		if (outOfStockMsg_i18n_el != null
				&& outOfStockMsg_i18n_el.value != null
				&& outOfStockMsg_i18n_el.value != "") {
			outOfStockMsg = outOfStockMsg_i18n_el.value;
		}

		var dropshipMsg_i18n_el = document.getElementById("dropshipMsg");
		if (dropshipMsg_i18n_el != null && dropshipMsg_i18n_el.value != null
				&& dropshipMsg_i18n_el.value != "") {
			dropshipMsg = dropshipMsg_i18n_el.value;
		}

		var reviewMsg_i18n_el = document.getElementById("reviewMsg");
		if (reviewMsg_i18n_el != null && reviewMsg_i18n_el.value != null
				&& reviewMsg_i18n_el.value != "") {
			reviewMsg = reviewMsg_i18n_el.value;
		}

		var inventorychanged = root.getElementsByTagName("inventorychanged0")[0].childNodes[0].nodeValue;
		var dsmq = root.getElementsByTagName("dropshipminqty0");
		var dropshipminqty = "";
		if (dsmq && dsmq.length > 0)
			dropshipminqty = dsmq[0].childNodes[0].nodeValue;

		var content = "";
		var options = genInlineDeliveryOptions(root, index);
		if (options == '') {// there is no options
			if (dropshipminqty != "") {
				content += dropshipMsg.replace("{0}", dropshipminqty);
			} else {
				content += outOfStockMsg;
			}
		} else {
			if (inventorychanged && inventorychanged == 'true') {
				content += chooseAgainMsg + "<br><br>";
				;
			} else {
				content += firstChooseMsg + "<br><br>";
			}
			content += options;
			if (true || inlineDeliveryOptionChanged) {
				var descel = document.getElementById(descriptionIdPrefix
						+ itemIndex);
				var desc = "<br><span style='color:red'>" + reviewMsg
						+ "</span>";
				descel.innerHTML = desc;
			}
		}
		inlineel.innerHTML = content;

		// make post call to basket.html to update qty

		jQuery("input[name='mode'][type='hidden']").val('updateBasketQty');
		// var url =
		// jQuery("input[name='_targetupdateBasket'][type='hidden']").val();
		var url = "updatebasket.ajx?vid=" + vid;
		var ajaxRequest = new AjaxRequest(url, jQuery(
				"form[name='" + basektFormName + "']").serialize(),
				updateBasketCallback);
		ajaxRequest.addUrlParameter("ajax-request", true);
		ajaxRequest.doRequest('POST', null, true);
	}
}

function updateBasketCallback(data) {
	if(jQuery("#js-update-mode").val()=='refresh'){
		window.location.reload();
	}
	if (data.__Success == "true") {
		var subtotal = 0;
		var regtotal = 0;
		var regsubtotal = 0;
		var totalQty = 0;
		var shippingCostTotal = data.__Result.shippingCostTotal;
		var taxTotal = data.__Result.taxTotal;
		var discountTotal = data.__Result.discountTotal;

		var items = data.__Result.items;
		jQuery.each(items, function(i, val) {
			var total = val.total;
			var listPrice = val.listPrice;
			var compcode = val.compcode;
			var qty = val.qty;
			subtotal += total;
			regtotal += listPrice * qty;
			totalQty += qty;
			jQuery("input[ref-qty="+compcode+"]").val(qty);
			jQuery("#total_" + compcode).text(
					jQuery.formatCurrencyEn(total.toString()));
		});
		var subtotallabel = jQuery("#subtotallabel").text();
		subtotallabel = subtotallabel.replace(/\d+/, totalQty);
		jQuery("#subtotallabel").text(subtotallabel);
		jQuery("#yoursaved")
				.text(
						"$"
								+ jQuery.formatCurrencyEn((regtotal - subtotal)
										.toString()));
		jQuery("#showsubtotal").text(
				"$" + jQuery.formatCurrencyEn(subtotal.toString()));
		jQuery("#subtotal").val(subtotal);
		jQuery("#totalcost").text(
				jQuery.formatCurrencyEn((subtotal + shippingCostTotal
						+ taxTotal - discountTotal).toString()));

	}
	if (typeof (loadRegion) == "function") {
		loadRegion();
	}
}

function checkMinOrderQTY(itemIndex_in, rowcount_in, vid_in, type,
		checkedoptionvalue, preinvhist_hid_in, preqty_in, actionmode_in,
		actioncontent_in) {
	itemIndex = itemIndex_in;
	rowcount = rowcount_in;
	vid = vid_in;
	preqty = preqty_in;
	actionmode = actionmode_in;
	actioncontent = actioncontent_in;
	preinvhist_hid = preinvhist_hid_in;
	_type = type;
	_checkedoptionvalue = checkedoptionvalue;
	_preinvhistid = document.getElementById(preinvhist_hid).value;
	var url = "getminorderQTY.ajx?type=2&vid=" + vid + "&count=" + rowcount;
	if (itemIndex != '') {
		var compCodeForOneItem = document.getElementById("compCode_"
				+ itemIndex);
		var curqtyForOneItem = document.getElementById("qty_" + itemIndex).value;
		url += "&compCode0=" + compCodeForOneItem.value;
		url += "&qty0=" + curqtyForOneItem;
	} else {
		for ( var i = 0; i < rowcount; i++) {
			var compCode = document.getElementById("compCode_" + i);
			var qtyid = "qty_" + i;
			var curqty = document.getElementById(qtyid).value;
			if (isNaN(curqty) || curqty.indexOf(".") > -1) {
				closeMenuCancel();
				return false;
			} else if (curqty >= 1) {
				url += "&compCode" + i + "=" + compCode.value;
				url += "&qty" + i + "=" + curqty;
			}
		}
	}
	var ajxObj = new net.ContentLoader(url, openMenu2, "get", "text", null);
}

function checkMinOrderQTYWithoutPopup(itemIndex_in, rowcount_in, vid_in, type,
		checkedoptionvalue, preinvhist_hid_in, preqty_in, actionmode_in,
		actioncontent_in) {
	itemIndex = itemIndex_in;
	rowcount = rowcount_in;
	vid = vid_in;
	preqty = preqty_in;
	actionmode = actionmode_in;
	actioncontent = actioncontent_in;
	preinvhist_hid = preinvhist_hid_in;
	_type = type;
	_checkedoptionvalue = checkedoptionvalue;
	_preinvhistid = document.getElementById(preinvhist_hid).value;
	var url = "getminorderQTY.ajx?type=2&vid=" + vid + "&count=" + rowcount;
	if (itemIndex != '') {
		var compCodeForOneItem = document.getElementById("compCode_"
				+ itemIndex);
		var curqtyForOneItem = document.getElementById("qty_" + itemIndex).value;
		url += "&compCode0=" + compCodeForOneItem.value;
		url += "&qty0=" + curqtyForOneItem;
	} else {
		for ( var i = 0; i < rowcount; i++) {
			var compCode = document.getElementById("compCode_" + i);
			var qtyid = "qty_" + i;
			var curqty = document.getElementById(qtyid).value;
			if (isNaN(curqty) || curqty.indexOf(".") > -1) {
				closeMenuCancel();
				return false;
			} else if (curqty >= 1) {
				url += "&compCode" + i + "=" + compCode.value;
				url += "&qty" + i + "=" + curqty;
			}
		}
	}
	var ajxObj = new net.ContentLoader(url, openMenu2WithoutPopup, "get", "text", null);
}
/*
 * the delivery option will be displayed in basket page
 */
function checkMinOrderQTYInLineDeliveryOption(itemIndex_in, rowcount_in,
		vid_in, type, checkedoptionvalue, preinvhist_hid_in, preqty_in,
		actionmode_in, actioncontent_in) {
	inlineDeliveryOptionChanged = true;
	itemIndex = itemIndex_in;
	rowcount = rowcount_in;
	vid = vid_in;
	preqty = preqty_in;
	actionmode = actionmode_in;
	actioncontent = actioncontent_in;
	preinvhist_hid = preinvhist_hid_in;
	_type = type;
	_checkedoptionvalue = checkedoptionvalue;
	_preinvhistid = document.getElementById(preinvhist_hid).value;
	var url = "getminorderQTY.ajx?type=2&vid=" + vid + "&count=" + rowcount;
	if (itemIndex != '') {
		var compCodeForOneItem = document.getElementById("compCode_"
				+ itemIndex);
		var curqtyForOneItem = document.getElementById("qty_" + itemIndex).value;
		url += "&compCode0=" + compCodeForOneItem.value;
		url += "&qty0=" + curqtyForOneItem;
	} else {
		for ( var i = 0; i < rowcount; i++) {
			var compCode = document.getElementById("compCode_" + i);
			var qtyid = "qty_" + i;
			var curqty = document.getElementById(qtyid).value;
			if (isNaN(curqty) || curqty.indexOf(".") > -1) {
				closeMenuCancel();
				return false;
			} else if (curqty >= 1) {
				url += "&compCode" + i + "=" + compCode.value;
				url += "&qty" + i + "=" + curqty;
			}
		}
	}
	var ajxObj = new net.ContentLoader(url, openMenu2ForInline, "get", "text",
			null);
}

function openMenu2ForInline() {
	var popupel = document.getElementById(popupid);
	var res = eval("(" + this.req.responseText + ")");
	if (res.__Result != null && res.__Result.length != 0) {
		var content = genDivHeader("");
		content += genDivBody(res.__Result[0]);
		content += genDivFooter("");
		content += genCancelButtonRow();
		popupel.innerHTML = content;

		var center_x = (window.screen.width - popupel.clientWidth) / 2
				+ document.body.parentNode.scrollLeft;
		var center_y = (window.screen.height - popupel.clientHeight - 200) / 2
				+ document.body.parentNode.scrollTop;

		popupel.style.left = center_x + "px";
		popupel.style.top = center_y + "px";
		popupel.style.visibility = "visible";
	} else {
		checkInventorysInline();
	}

}

function openMenu2() {
	var popupel = document.getElementById(popupid);
	var res = eval("(" + this.req.responseText + ")");
	if (res.__Result != null && res.__Result.length != 0) {
		var content = genDivHeader("");
		content += genDivBody(res.__Result[0]);
		content += genDivFooter("");
		content += genCancelButtonRow();
		popupel.innerHTML = content;

		var center_x = (window.screen.width - popupel.clientWidth) / 2
				+ document.body.parentNode.scrollLeft;
		var center_y = (window.screen.height - popupel.clientHeight - 200) / 2
				+ document.body.parentNode.scrollTop;

		popupel.style.left = center_x + "px";
		popupel.style.top = center_y + "px";
		popupel.style.visibility = "visible";
	} else {
		checkInventorys();
	}

}

function openMenu2WithoutPopup() {
	var popupel = document.getElementById(popupid);
	var res = eval("(" + this.req.responseText + ")");
	if (res.__Result != null && res.__Result.length != 0) {
		var content = genDivHeader("");
		content += genDivBody(res.__Result[0]);
		content += genDivFooter("");
		content += genCancelButtonRow();
		popupel.innerHTML = content;

		var center_x = (window.screen.width - popupel.clientWidth) / 2
				+ document.body.parentNode.scrollLeft;
		var center_y = (window.screen.height - popupel.clientHeight - 200) / 2
				+ document.body.parentNode.scrollTop;

		popupel.style.left = center_x + "px";
		popupel.style.top = center_y + "px";
		popupel.style.visibility = "visible";
	} else {
		checkInventorysWithoutPopup();
	}

}

var messageid = "";
function setMessageID(id) {
	var messageDest = document.getElementById(messageid);
	if (messageDest) {
		messageDest.innerHTML = "";
	}
	messageid = id;
}

function getMessageID() {
	return messageid;
}

function openMenu() {

	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;
	var itemcount = root.getElementsByTagName("ItemCount")[0].childNodes[0].nodeValue;
	var showpopups = false;
	var index;
	for ( var i = 0; i < itemcount; i++) {
		var showpopup = root.getElementsByTagName("showpopup" + i)[0].childNodes[0].nodeValue;
		if (showpopup && showpopup == 'true') {
			showpopups = true;
			index = i;
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

		// redirect itempage-->basket catepage-->no basket-->submit form
		if (actionmode == 'redirect') {
			eval("" + actioncontent + "");
		} else if (actionmode == 'exec')
			eval("validateBeforeSubmit(" + rowcount + ")");
	} else {
		var popupel = document.getElementById(popupid);

		var fasterMsg = "If you require faster delivery click OK then on the basket specify a required-by date and our staff will contact you with options.";   //
		var firstChooseMsg = "Please choose from the following delivery options:";																				//  Backorder Alert
		var chooseAgainMsg = "The inventory level has changed.  Please reselect a delivery option.";															//
		var outOfStockMsg = "Sorry there is not enough stock to fulfill your request.";																			//
		var dropshipMsg = "Sorry this item can only be drop shipped but a minimum quantity of {0} must be purchased. Click CANCEL and increase the quantity.";	//	
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
		popupel.innerHTML = content;

		var center_x = (jQuery(window).width() - popupel.clientWidth) / 2
				+ document.body.parentNode.scrollLeft;
		var center_y = (jQuery(window).height() - popupel.clientHeight) / 2
				+ document.body.parentNode.scrollTop;

		popupel.style.left = center_x + "px";
		popupel.style.top = center_y + "px";
		popupel.style.visibility = "visible";
	}
}

function openMenuWithoutPopup() {

	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;
	var itemcount = root.getElementsByTagName("ItemCount")[0].childNodes[0].nodeValue;
	var showpopups = false;
	var index;

	var invhistid = root.getElementsByTagName("invhistid0")[0].childNodes[0].nodeValue;
	var rowcount = root.getElementsByTagName("totalItems")[0].childNodes[0].nodeValue;

	document.getElementById(preinvhist_hid).value = invhistid; // set
	// invhistid
	// to a
	// hidden
	// field

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

	// redirect itempage-->basket catepage-->no basket-->submit form
	if (actionmode == 'redirect') {
		eval("" + actioncontent + "");
	} else if (actionmode == 'exec')
		eval("validateBeforeSubmit(" + rowcount + ")");

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
		content += genOptionRow(optionvalue, optioncontent);
	}
	content += "</div>";
	return content;
}

function genInlineDeliveryOptions(root, index) {
	var content = "<ul class='radios-list'>";
	var options = root.getElementsByTagName("deliveryoption" + index);
	if (options.length == 0) {
		return "";
	}
	for (i = 0; options && i < options.length; i++) {
		var optionvalue = options[i].childNodes[0].childNodes[0].nodeValue;
		var optioncontent = options[i].childNodes[1].childNodes[0].nodeValue;
		content += genInlineOptionRow(optionvalue, optioncontent);
	}
	content += "</div>";
	return content;
}

function genRedMsgRow(msg) {
	var tmp = "<tr>" + "<td>&nbsp;&nbsp;</td>"
			+ "<td align='left' class='popup_menuItem_red'>" + msg + "</td>"
			+ "</tr>";
	return tmp;
}

function genDivHeader(msg) {
	var tmp = "<div id='js-popup-header'>" + msg + "</div>";
	return tmp;
}

function genDivBody(msg) {
	var tmp = "<div id='js-popup-body'>" + msg + "</div>";
	return tmp;
}

function genDivFooter(msg) {
	var tmp = "<div id='js-popup-footer'>" + msg + "</div>";
	return tmp;
}

function genMsgRow(msg) {
	var tmp = "<tr>" + "<td>&nbsp;&nbsp;</td>"
			+ "<td align='left' class='popup_menuItem'>" + msg + "</td>"
			+ "</tr>";
	return tmp;
}

function genOptionRow(optionvalue, optioncontent) {
	var tmp = "<div>" + "<input name='deliveryoption' value='" + optionvalue
			+ "' type='radio'>" + "<div class='f-field'><label>"
			+ optioncontent + "</label></div>" + "</div>";
	return tmp;
}

function genInlineOptionRow(optionvalue, optioncontent) {
	var tmp = "<li style='line-height:20px'>";
	tmp += "<label>";
	tmp += "<div class='input'><input onclick='checkMinOrderQTYInLineDeliveryOption("
			+ itemIndex
			+ ","
			+ rowcount
			+ ",\""
			+ vid
			+ "\",\"dooks\","
			+ optionvalue
			+ ",\""
			+ preinvhist_hid
			+ "\","
			+ preqty
			+ ",\"\",\"\");' name='"
			+ inlineRadioButtonName.replace("{0}", itemIndex)
			+ "' value='"
			+ optionvalue + "' type='radio'";
	if (optionvalue == _checkedoptionvalue) {
		tmp += " checked ";
		// previous selected option is sill there.
		inlineDeliveryOptionChanged = false;
	}
	tmp += ">";
	tmp += optioncontent + "</div>"
	tmp += "</label>";
	tmp += "</li>";
	return tmp;
}

function genOKCancelButtonRows(rowcount) {
	var tmp = "<div id='js-popup-button'>"
			+ "<div>"
			+ "<a href='javascript:void(0);' class='popup_button' onClick='if(getCheckedOptionValue()==-1){alert(\"please check an option.\");} else { closeMenuOK(); } '>OK</a>"
			+ "<a href='javascript:void(0);' class='popup_button' onClick='closeMenuCancel("
			+ rowcount + ");'>Cancel</a>" + "</div>" + "</div>";
	return tmp;
}

function genCancelButtonRow() {
	var tmp = "<div id='js-popup-button'>"
			+ "<div>"
			+ "<a href='javascript:void(0);' class='popup_button' onClick='closeMenuCancel("
			+ rowcount + ");'>Cancel</a>" + "</div>" + "</div>";
	return tmp;
}

function closeMenuCancel(rowcount) {
	var el = document.getElementById(popupid);
	el.style.visibility = "hidden";
	if (itemIndex != '') {
		var qtyfieldForOne = document.getElementById("qty_" + itemIndex);
		qtyfieldForOne.value = preqty;
	} else {
		for ( var i = 0; i < rowcount; i++) {
			var qtyfield = document.getElementById("qty_" + i);
			if (qtyfield) {
				qtyfield.value = preqty;
			}
		}
	}

}

function closeMenuOK() {
	var el = document.getElementById(popupid);
	el.style.visibility = "hidden";
	var checkedoptionvalue = getCheckedOptionValue();
	checkMinOrderQTY(itemIndex, rowcount, vid, 'dooks', checkedoptionvalue,
			preinvhist_hid, preqty, actionmode, actioncontent)
}

function getCheckedOptionValue() {
	var alloptions = document.getElementsByName("deliveryoption");
	for (i = 0; i < alloptions.length; i++) {
		var tmp = alloptions[i];
		if (tmp.checked)
			return tmp.value;
	}

	return -1;
}

function makeCompCode(itemCode) {

	var attr = getAttributeOption("basketItems[0].attributes");

	return attr != "" ? itemCode + "." + attr : itemCode;

}

function getAttributeOption(matchstr) {
	var selectArray = document.getElementsByTagName('select');
	var options = "";
	for ( var i = 0; i < selectArray.length; i++) {
		var selectAttr = selectArray[i];
		if (selectAttr && beginWith(selectAttr.name, matchstr)) {
			options += selectAttr.options[selectAttr.selectedIndex].title;
			options += "-";
		}
	}

	options = options.substring(0, options.length - 1);

	return options;
}

function beginWith(sourcestr, matchstr) {
	var index = sourcestr.indexOf(matchstr);

	if (index == 0)
		return true;
	else
		return false;
}

function calcShipCost(vid,checkPostCode) {
	var countryid = $("#countryid").val();
	var provinceid = $("#provinceid").val();
	var city = $("#city").val();
	var postal = $("#postal").val();
	var otherprovince = $("#otherprovince").val();
	var ordertype = undefined;
	/*
	 * var el = frm.elements["orderType"]; for(var i=0;i<el.length;i++){
	 * if(el[i].type=="radio" && el[i].checked==true){ ordertype = el[i].value; } }
	 * 
	 * if( ordertype=="undefined" || (ordertype!="B" && ordertype!="P") ) {
	 * alert("Please choose order type!"); return false; }
	 */
	if (countryid == undefined || countryid <= 0) {
		alert("Please select country!");
		return false;
	}
	if ((provinceid == undefined || provinceid <= 0) && otherprovince == "") {
		alert("Please select province!");
		return false;
	}
	if (city == undefined || city == "") {
		alert("Please input city!");
		return false;
	}
	if (checkPostCode && (postal == undefined || postal == "")) {
		alert("Please input postal/zip!");
		return false;
	}

	var url = "calcshipcost.ajx?vid=" + vid + "&ordertype=" + ordertype
			+ "&countryid=" + countryid + "&provinceid=" + provinceid
			+ "&anotherprovince=" + otherprovince + "&city=" + city + "&postal="
			+ postal;
	url = url + "&time=" + new Date();
	var ajxObj = new net.ContentLoader(url, showPriceMsg, "get", "text", null);
}

function calcshipcostOnePage(vid, country, region, city, postcode) {
	if (country == "undefined" || country <= 0) {
		alert("Please select country!");
		return false;
	}
	if (region == "undefined" || region <= 0) {
		alert("Please select province!");
		return false;
	}
	if (city == "undefined" || city == "") {
		alert("Please input city!");
		return false;
	}
	if (postcode == "undefined" || postcode == "") {
		alert("Please input postal/zip!");
		return false;
	}
	var url = "calcshipcost.ajx?vid=" + vid + "&ordertype=&countryid="
			+ country + "&provinceid=" + region + "&city=" + city + "&postal="
			+ postcode;
	url = url + "&time=" + new Date();
	var ajxObj = new net.ContentLoader(url, showShippingCost, "get", "text",
			null);
	return true;
}

function showShippingCost() {
	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;
	var errmsg = root.getElementsByTagName("error")[0].textContent;

	var shipcost = root.getElementsByTagName("shipcost")[0];
	var haserror = root.getElementsByTagName("haserror")[0].textContent;
	var costes = shipcost.getElementsByTagName("cost");
	var price = "";
	if (haserror == "true") {
		alert(errmsg);
		return;
	}
	if (costes != null && costes != "undefined" && costes.length > 0) {
		price = costes[0].lastChild.textContent;
	}
	var ship_priceEl = document.getElementById("ship_price_id");
	if (ship_priceEl == null) {
		var priceblock = document.getElementById("cost-container");
		var container = document.createElement("div");
		container.className = "yui-gc totalRow";
		var childEl = document.createElement("div");
		childEl.className = "yui-u first desc";
		childEl.innerHTML = "Shipping:";
		container.appendChild(childEl);
		var childEl2 = document.createElement("div");
		childEl2.className = "yui-u price";
		childEl2.id = "ship_price_id"
		childEl2.innerHTML = price;
		container.appendChild(childEl2);
		priceblock.appendChild(container);
	} else {
		ship_priceEl.innerHTML = price;
	}
}

function checkFeilds(vid) {
	var cityEl = document
			.getElementById("customerDTO.customerAddresses['1'].city");
	var city = document
			.getElementById("customerDTO.customerAddresses['1'].city").value;
	var country = document.getElementById("country_id").value;
	var province = document.getElementById("region").value;
	var postcode = document
			.getElementById("customerDTO.customerAddresses['1'].postal").value;

	if (city == null || city == '')
		return;
	if (country == null || country == 0)
		return;
	if (province == null || province == 0)
		return;
	if (postcode == null || postcode == '')
		return;
	calcshipcostOnePage(vid, country, province, postcode);
}

function showPriceMsg() {
	var divEstimatedshipping = document.getElementById("estimatedshipping");
	var divEstimatedtax = document.getElementById("estimatedtax");
	var divTotalcost = document.getElementById("totalcost");
	var dicshippingdiscount = document
			.getElementById("estimatedshippingdiscount");
	var totalDiscount = 0;
	var shippingPromotionDiscount = 0;

	if (document.getElementById("totalDiscount")) {
		totalDiscount = document.getElementById("totalDiscount").value;
	}

	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;
	var errmsgNode = root.getElementsByTagName("error")[0];
	var errmsg = "";
	if (errmsgNode.hasChildNodes()) {
		errmsg = errmsgNode.firstChild.nodeValue;
	}
	var shipcost = root.getElementsByTagName("shipcost")[0];

	var haserrorNode = root.getElementsByTagName("haserror");
	var haserror = haserrorNode[0].firstChild.nodeValue;
	// var
	// shipcosttatal=root.getElementsByTagName("shipcosttotal")[0].textContent;
	var shipcosttatal = 0;
	var shippingdiscountNode = root.getElementsByTagName("pershippingdiscount");
	var shippingdiscount = shippingdiscountNode[0].firstChild.nodeValue;

	var taxtotalNode = root.getElementsByTagName("taxtotal");
	var taxtotal = taxtotalNode[0].firstChild.nodeValue;

	var popupel = document.getElementById(popupid);

	var subtotal = document.getElementById("subtotal").value;

	if (shipcost != null) {
		var content = "<table border='0' width='420px'>";
		var Msg = "<ul>";

		var costes = shipcost.getElementsByTagName("cost");
		if (costes == null || costes.length == 0) {
			Msg = Msg + "<li>$0.00</li>";
		} else {
			for ( var i = 0; i < costes.length; i++) {
				var cost = costes[i];
				if (cost.firstChild.firstChild.nodeValue == 'subtotal') {
					subtotal = cost.lastChild.firstChild.nodeValue;
				}
				if (cost.firstChild.firstChild.nodeValue == 'shiptotal') {
					shipcosttatal = cost.lastChild.firstChild.nodeValue;
				} else {
					Msg = Msg + "<li>" + cost.firstChild.firstChild.nodeValue
							+ " : $" + cost.lastChild.firstChild.nodeValue
							+ "</li>";
				}
			}
		}
		Msg = Msg + "</ul>";

		if (haserror == "true")
			Msg = errmsg;

		content += genRedMsgRow(Msg);

		content += genPriceOkButtonRow();

		content += "</table>";
		popupel.innerHTML = content;

		var center_x = (window.screen.width - popupel.clientWidth) / 2
				+ document.body.parentNode.scrollLeft;
		var center_y = (window.screen.height - popupel.clientHeight - 200) / 2
				+ document.body.parentNode.scrollTop;

		popupel.style.left = center_x + "px";
		popupel.style.top = center_y + "px";
		// popupel.style.visibility = "visible";
	}
	if (shipcosttatal == 0)
		divEstimatedshipping.innerHTML = "$0.00";
	else
		divEstimatedshipping.innerHTML = "$"
				+ $.formatCurrencyEn(shipcosttatal);

	divEstimatedtax.innerHTML = "$" + $.formatCurrencyEn(taxtotal);

	dicshippingdiscount.innerHTML = "$" + $.formatCurrencyEn(shippingdiscount);

	if (shippingdiscount > 0 && shipcosttatal > 0) {
		document.getElementById("shippingDiscount").style.display = "";
	} else {
		document.getElementById("shippingDiscount").style.display = "none";
	}

	var total = parseFloat(subtotal) - parseFloat(totalDiscount)
			- parseFloat(shippingdiscount) + parseFloat(shipcosttatal)
			+ parseFloat(taxtotal);
	total = Math.round(total * 100) / 100;
	divTotalcost.innerHTML = "$" + $.formatCurrencyEn(total.toString());
	

	$("#taxlab1").addClass("hide");
	$("#taxlab2").removeClass("hide");
	$("tr.tax").removeClass("hide");

	if (taxtotal <= 0) {
		$("tr.tax").addClass("hide");
	}
	
	jQuery( "#shipcostestimator-new" ).dialog('close');
}

function genPriceOkButtonRow() {
	var tmp = "<tr>"
			+ "<td>&nbsp;</td>"
			+ "<td align='center'>"
			+ "<table border='0' width='50%'>"
			+ "<tr>"
			+ "<td width='50%' align='center'><a href='javascript:void(0);' class='popup_menuItem' onClick='closePriceOk();'>OK</a></td>"
			+ "</tr>" + "</table>" + "</td>" + "</tr>";
	return tmp;
}

function closePriceOk() {
	var el = document.getElementById(popupid);
	el.style.visibility = "hidden";

}
/**
 * listener listens whether the shipping address is changed. If changed,
 * asynchronously call the ajax to get the shipping cost and tax cost for the
 * new address.
 * 
 * @param vid -
 *            vendor identifier
 * @param frm -
 *            form
 * @param addressIndexIn -
 *            the column index of shipping address in the products detail table
 * @param methodIndexIn -
 *            the column index of shipping method in the products detail table
 * @param flag -
 *            <code>true</code> indicates to make an ajax call no matter the
 *            address changed or not. If the value of it is <code>true</code>,
 *            means the ajax registration is successful and shipping and tax
 *            cost should be recalculated based on customer segment and
 *            discount.
 * @returns {Boolean}
 */
function shippingAddressListener(vid, frm, addressIndexIn, methodIndexIn, flag) {
	var address1 = document
			.getElementById("customerDTO.customerAddresses['1'].address1").value;
	var city = document
			.getElementById("customerDTO.customerAddresses['1'].city").value;
	var country = document.getElementById("country_id").value;
	var region = document.getElementById("region").value;
	var postal = document
			.getElementById("customerDTO.customerAddresses['1'].postal").value;
	var anotherprovince = document.getElementById("otherregionForBilling").value;
	addressIndex = addressIndexIn;
	methodIndex = methodIndexIn;
	if (address1 == null || address1 == "")
		return;
	if (city == null || city == "")
		return;
	if (country == null || country == 0)
		return;
	if ((region == null || region == 0)
			&& (anotherprovince == null || anotherprovince == ""))
		return;
	if (postal == null || postal == "")
		return;
	// in case it does not set "enable checkout in one page" enabled
	if (document.getElementById("productItems")) {
		if (flag
				|| !(globalCountryid == country
						&& (globalProvinceid == region || (globalAnotherprovince == anotherprovince && region == 0))
						&& globalCity == city && globalPostal == postal)) {
			if (region != 0)
				var url = "calcshipcost.ajx?vid=" + vid
						+ "&ordertype=&countryid=" + country + "&provinceid="
						+ region + "&city=" + city + "&postal=" + postal
						+ "&address1=" + address1 + "";
			else
				var url = "calcshipcost.ajx?vid=" + vid
						+ "&ordertype=&countryid=" + country
						+ "&anotherprovince=" + anotherprovince + "&city="
						+ city + "&postal=" + postal + "&address1=" + address1
						+ "";
			url = url + "&time=" + new Date() + "&shipping=shippingindetail";
			var ajxObj = new net.ContentLoader(url, changeShippingInfo, "get",
					"text", null);

			// set location information in the global variables
			globalCountryid = country;
			globalProvinceid = region;
			globalCity = city;
			globalPostal = postal;
			return true;
		}
	}
}
/**
 * change shipping information like shipping cost, tax cost when shipping
 * address is changed before registration or after it
 * 
 */
function changeShippingInfo() {
	var productTable = document.getElementById("productItems");
	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;

	// check the brower type of client: IE or FireFox
	var isTextContentSupported = (root.textContent == undefined ? false : true)
	if (isTextContentSupported) {
		var errmsg = root.getElementsByTagName("error")[0].textContent;
		var haserror = root.getElementsByTagName("haserror")[0].textContent;
	} else {
		var errmsg = root.getElementsByTagName("error")[0].text;
		var haserror = root.getElementsByTagName("haserror")[0].text;
	}
	if (haserror != true) {
		var rowCount = productTable.rows.length;
		var productsElement = root.getElementsByTagName("products")[0];
		var productsSet = productsElement.getElementsByTagName("product");
		for ( var i = 1; i < rowCount; i++) {
			row = productTable.rows[i];
			if (row.cells.length == 5) {
				if (isTextContentSupported) {
					row.cells[0].innerHTML = productsSet[i - 1]
							.getElementsByTagName("title")[0].textContent;
					row.cells[addressIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingaddress")[0].textContent;
					row.cells[methodIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingmethod")[0].textContent;
					row.cells[3].innerHTML = productsSet[i - 1]
							.getElementsByTagName("quantity")[0].textContent;
					row.cells[4].innerHTML = productsSet[i - 1]
							.getElementsByTagName("itemprice")[0].textContent;
				} else {
					row.cells[0].innerHTML = productsSet[i - 1]
							.getElementsByTagName("title")[0].text;
					row.cells[addressIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingaddress")[0].text;
					row.cells[methodIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingmethod")[0].text;
					row.cells[3].innerHTML = productsSet[i - 1]
							.getElementsByTagName("quantity")[0].text;
					row.cells[4].innerHTML = productsSet[i - 1]
							.getElementsByTagName("itemprice")[0].text;
				}

			}
		}
		// add shipping rate label in "cost-container"
		if (isTextContentSupported) {
			var dicountValue = root.getElementsByTagName("totaldiscount")[0].textContent;
			var shippingValue = root.getElementsByTagName("totalshippingrate")[0].textContent;
			var taxValue = root.getElementsByTagName("totaltax")[0].textContent;
			var totalBillValue = root.getElementsByTagName("totalcost")[0].textContent;
		} else {
			var dicountValue = root.getElementsByTagName("totaldiscount")[0].text;
			var shippingValue = root.getElementsByTagName("totalshippingrate")[0].text;
			var taxValue = root.getElementsByTagName("totaltax")[0].text;
			var totalBillValue = root.getElementsByTagName("totalcost")[0].text;
		}

		// set ids
		var discountId = "register_discount_id";
		var shippingId = "register_shipping_id";
		var taxId = "register_tax_id";
		var totalBillId = "register_total_bill_id";
		var payment = "paymentGateway";

		// set comment values
		var discountEl = document.getElementById(discountId);
		var shippingEl = document.getElementById(shippingId);
		var taxEl = document.getElementById(taxId);
		var totalBillEl = document.getElementById(totalBillId);
		if (discountEl)
			discountEl.innerHTML = dicountValue;
		if (shippingEl)
			shippingEl.innerHTML = shippingValue;
		if (taxEl)
			taxEl.innerHTML = taxValue;
		if (totalBillEl)
			totalBillEl.innerHTML = totalBillValue;

		var grandtoal = totalBillValue.substring(1, totalBillValue.length);
		if (grandtoal > 0)
			document.getElementById(payment).style.display = "";
		else{
			document.getElementById(payment).style.display = "none";
			$("#paymentGateway_title").hide();
            $("#paymentGateway_promo").hide();
		}
	}

}
function shippingAddressListenerForCheckout(vid, frm) {
	var address1 = document.getElementById("addresses.billingAddress.address1").value;
	var city = document.getElementById("addresses.billingAddress.city").value;
	var country = document.getElementById("addresses.billingAddress.countryId").value;
	var region = document.getElementById("region").value;
	var postal = document.getElementById("addresses.billingAddress.postal").value;
	var anotherprovince = document.getElementById("otherregionForBilling").value;
	if (address1 == null || address1 == "")
		return;
	if (city == null || city == "")
		return;
	if (country == null || country == 0)
		return;
	if ((region == null || region == 0)
			&& (anotherprovince == null || anotherprovince == ""))
		return;
	if (postal == null || postal == "")
		return;
	// in case it does not set "enable checkout in one page" enabled
	if (document.getElementById("productItems")) {
		if (!(globalCountryid == country
				&& (globalProvinceid == region || (globalAnotherprovince == anotherprovince && region == 0))
				&& globalCity == city && globalPostal == postal)) {
			if (region != 0)
				var url = "calcshipcost.ajx?vid=" + vid
						+ "&ordertype=&countryid=" + country + "&provinceid="
						+ region + "&city=" + city + "&postal=" + postal
						+ "&address1=" + address1 + "";
			else
				var url = "calcshipcost.ajx?vid=" + vid
						+ "&ordertype=&countryid=" + country
						+ "&anotherprovince=" + anotherprovince + "&city="
						+ city + "&postal=" + postal + "&address1=" + address1
						+ "";
			url = url + "&time=" + new Date() + "&shipping=shippingindetail";
			var ajxObj = new net.ContentLoader(url,
					changeShippingInfoForCheckout, "get", "text", null);

			// set location information in the global variables
			globalCountryid = country;
			globalProvinceid = region;
			globalCity = city;
			globalPostal = postal;
			return true;
		}
	}
}
function changeShippingInfoForCheckout() {
	var productTable = document.getElementById("productItems");
	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;
	// whether the client brower is firefox of ie
	var isTextContentSupported = (root.textContent == undefined ? false : true)
	if (isTextContentSupported) {
		var errmsg = root.getElementsByTagName("error")[0].textContent;
		var haserror = root.getElementsByTagName("haserror")[0].textContent;
	} else {
		var errmsg = root.getElementsByTagName("error")[0].text;
		var haserror = root.getElementsByTagName("haserror")[0].text;
	}
	if (haserror != true) {
		var rowCount = productTable.rows.length;
		var productsElement = root.getElementsByTagName("products")[0];
		var productsSet = productsElement.getElementsByTagName("product");
		for ( var i = 1; i < rowCount; i++) {
			row = productTable.rows[i];
			if (row.cells.length == 5) {
				if (isTextContentSupported) {
					row.cells[2].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingaddress")[0].textContent;
					row.cells[3].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingmethod")[0].textContent;
				} else {
					row.cells[2].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingaddress")[0].text;
					row.cells[3].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingmethod")[0].text;
				}

			}
		}
		// add shipping rate label in "cost-container"
		if (isTextContentSupported) {
			var totalshippingrate = root
					.getElementsByTagName("totalshippingrate")[0].textContent;
			var subtotal = root.getElementsByTagName("subtotal")[0].textContent;
			var totaldiscount = root.getElementsByTagName("totaldiscount")[0].textContent;
			var totaltax = root.getElementsByTagName("totaltax")[0].textContent;
			var totalcost = root.getElementsByTagName("totalcost")[0].textContent;
		} else {
			var totalshippingrate = root
					.getElementsByTagName("totalshippingrate")[0].text;
			var subtotal = root.getElementsByTagName("subtotal")[0].text;
			var totaldiscount = root.getElementsByTagName("totaldiscount")[0].text;
			var totaltax = root.getElementsByTagName("totaltax")[0].text;
			var totalcost = root.getElementsByTagName("totalcost")[0].text;
		}

		document.getElementById("totalshippingrate").innerHTML = totalshippingrate;
		document.getElementById("totalcost").innerHTML = totalcost;

	}
}
/**
 * listener for shipping address change when customer is logged in
 * <p>
 * see {@link #shippingAddressListener(any, any, any, any, any)} for further
 * detail
 * </p>
 * 
 * @param vid -
 *            vendor identifier
 * @param frm -
 *            document form object
 * @param addressIndexIn -
 *            the column index of shipping address in the products detail table
 * @param methodIndexIn -
 *            the column index of shipping method in the products detail table
 * @returns {Boolean}
 * 
 */
function shippingAddressListenerAfterReg(vid, frm, addressIndexIn,
		methodIndexIn) {
	var address1 = document
			.getElementById("customerDTO.customerAddresses['1'].address1").value;
	var city = document
			.getElementById("customerDTO.customerAddresses['1'].city").value;
	var country = document.getElementById("country_id").value;
	var region = document.getElementById("region").value;
	var postal = document
			.getElementById("customerDTO.customerAddresses['1'].postal").value;
	var anotherprovince = document.getElementById("otherregionForBilling").value;
	addressIndex = addressIndexIn;
	methodIndex = methodIndexIn;
	if (address1 == null || address1 == "")
		return;
	if (city == null || city == "")
		return;
	if (country == null || country == 0)
		return;
	if ((region == null || region == 0)
			&& (anotherprovince == null || anotherprovince == ""))
		return;
	if (postal == null || postal == "")
		return;
	// in case it does not set "enable checkout in one page" enabled
	if (document.getElementById("productItems")) {
		if (!(globalCountryid == country
				&& (globalProvinceid == region || (globalAnotherprovince == anotherprovince && region == 0))
				&& globalCity == city && globalPostal == postal)) {
			if (region != 0)
				var url = "calcshipcost.ajx?vid=" + vid
						+ "&ordertype=&countryid=" + country + "&provinceid="
						+ region + "&city=" + city + "&postal=" + postal
						+ "&address1=" + address1 + "";
			else
				var url = "calcshipcost.ajx?vid=" + vid
						+ "&ordertype=&countryid=" + country
						+ "&anotherprovince=" + anotherprovince + "&city="
						+ city + "&postal=" + postal + "&address1=" + address1
						+ "";
			url = url + "&time=" + new Date() + "&shipping=shippingindetail";
			var ajxObj = new net.ContentLoader(url, changeShippingInfoAfterReg,
					"get", "text", null);

			// set location information in the global variables
			globalCountryid = country;
			globalProvinceid = region;
			globalCity = city;
			globalPostal = postal;
			return true;
		}
	}
}
/**
 * change shipping information like shipping cost, tax cost when address is
 * modified
 * 
 */
function changeShippingInfoAfterReg() {
	var productTable = document.getElementById("productItems");
	var root = this.req.responseXML.documentElement; // xmlhttp.responseXML.documentElement;

	// check the brower type of client: IE or FireFox
	var isTextContentSupported = (root.textContent == undefined ? false : true)
	if (isTextContentSupported) {
		var errmsg = root.getElementsByTagName("error")[0].textContent;
		var haserror = root.getElementsByTagName("haserror")[0].textContent;
	} else {
		var errmsg = root.getElementsByTagName("error")[0].text;
		var haserror = root.getElementsByTagName("haserror")[0].text;
	}
	if (haserror != true) {
		var rowCount = productTable.rows.length;
		var productsElement = root.getElementsByTagName("products")[0];
		var productsSet = productsElement.getElementsByTagName("product");
		var oriProductLines = document.getElementById("subtotal_row_id").rowIndex - 1;
		for ( var i = 1; i < rowCount && oriProductLines == productsSet.length; i++) {
			row = productTable.rows[i];
			if (row.cells.length == 5) {
				if (isTextContentSupported) {
					row.cells[0].innerHTML = productsSet[i - 1]
							.getElementsByTagName("title")[0].textContent;
					row.cells[addressIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingaddress")[0].textContent;
					row.cells[methodIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingmethod")[0].textContent;
					row.cells[3].innerHTML = productsSet[i - 1]
							.getElementsByTagName("quantity")[0].textContent;
					row.cells[4].innerHTML = productsSet[i - 1]
							.getElementsByTagName("itemprice")[0].textContent;
				} else {
					row.cells[0].innerHTML = productsSet[i - 1]
							.getElementsByTagName("title")[0].text;
					row.cells[addressIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingaddress")[0].text;
					row.cells[methodIndex].innerHTML = productsSet[i - 1]
							.getElementsByTagName("shippingmethod")[0].text;
					row.cells[3].innerHTML = productsSet[i - 1]
							.getElementsByTagName("quantity")[0].text;
					row.cells[4].innerHTML = productsSet[i - 1]
							.getElementsByTagName("itemprice")[0].text;
				}

			}
		}
		// add shipping rate label in "cost-container"
		if (isTextContentSupported) {
			var shippingValue = root.getElementsByTagName("totalshippingrate")[0].textContent;
			var taxValue = root.getElementsByTagName("totaltax")[0].textContent;
			var totalBillValue = root.getElementsByTagName("totalcost")[0].textContent;
			var giftcertValue = root.getElementsByTagName("giftcerticates")[0].textContent;
			var totalValue = root.getElementsByTagName("totalcost")[0].textContent;
		} else {
			var shippingValue = root.getElementsByTagName("totalshippingrate")[0].text;
			var taxValue = root.getElementsByTagName("totaltax")[0].text;
			var totalBillValue = root.getElementsByTagName("totalcost")[0].text;
			var giftcertValue = root.getElementsByTagName("giftcerticates")[0].text;
			var totalValue = root.getElementsByTagName("totalcost")[0].text;
		}

		// set ids
		var shippingId = "register_shipping_id";
		var taxId = "register_tax_id";
		var totalBillId = "register_total_bill_id";
		var giftcertId = "register_giftcert_id";
		var totalId = "register_total_id";
		var payment = "paymentGateway";
		// set comment values
		var giftcertEl = document.getElementById(giftcertId);
		var shippingEl = document.getElementById(shippingId);
		var taxEl = document.getElementById(taxId);
		var totalEl = document.getElementById(totalId);
		var totalBillEl = document.getElementById(totalBillId);

		if (giftcertEl)
			giftcertEl.innerHTML = giftcertValue;
		if (shippingEl)
			shippingEl.innerHTML = shippingValue;
		if (taxEl)
			taxEl.innerHTML = taxValue;
		if (totalEl)
			totalEl.innerHTML = totalValue;
		if (totalBillEl)
			totalBillEl.innerHTML = totalBillValue;

		var grandtoal = totalBillValue.substring(1, totalBillValue.length);
		if (grandtoal > 0)
			document.getElementById(payment).style.display = "";
		else
			document.getElementById(payment).style.display = "none";
	}

}

// append basket comment to "cost-container"
function appendBasketComment(container, commentId, commentLabel, commentValue) {
	var subContainer = document.createElement("div");
	subContainer.className = "yui-gc totalRow";
	var childEl = document.createElement("div");
	childEl.className = "yui-u first desc";
	childEl.innerHTML = commentLabel;
	subContainer.appendChild(childEl);
	var childEl2 = document.createElement("div");
	childEl2.className = "yui-u price";
	childEl2.id = commentId;
	childEl2.innerHTML = commentValue;
	subContainer.appendChild(childEl2);
	container.appendChild(subContainer);
}