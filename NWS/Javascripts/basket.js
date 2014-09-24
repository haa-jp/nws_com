var cal1 ;
var editObj;
var hiddenId;
var overlay1;

YAHOO.util.Event.addListener(window, "load", function() {
createCalendar();
});

function setFocus(qtyid) {
	if (document.getElementById(qtyid))
		document.getElementById(qtyid).focus();
}

function submitForm(form, actionModeHidden) {
	actionModeHidden.value = "refresh";
	form.submit();
}

function returnElementById(id) {
	if (document.getElementById)
		var returnVar = document.getElementById(id);
	else if (document.all)
		var returnVar = document.all[id];
	else if (document.layers)
		var returnVar = document.layers[id];
	return returnVar;
}

function removeItems(idx) {
	var qtyField = returnElementById("qty_" + idx);
	if (qtyField){
		if(qtyField.type=='text'){
			qtyField.value = 0;					
		}else if(qtyField.tagName=='SELECT'){
			qtyField.options[qtyField.selectedIndex].value=0;
		}		
	}
}

function removeFromBasket(idx){
	document.VIEWCART.mode.value='updateBasket';
	removeItems(idx);
	document.VIEWCART.submit();
}


function updateQuantities() {
	var i = 0;
	do {
		var qtyField = returnElementById("QTY_" + i);
		var removeChkBox = returnElementById("REMOVE_ITEM_" + i++);
		if (removeChkBox && qtyField && removeChkBox.checked)
			qtyField.value = "0";
	} while (qtyField || removeChkBox);
}

function createCalendar() {
	cal1 = new YAHOO.widget.Calendar("cal1", "cal1Container");
	cal1.cfg.setProperty("close", true);
	cal1.cfg.setProperty("mindate", new Date());

	cal1.selectEvent.subscribe(handleSelect, cal1, true);
	cal1.render();
	overlay1 = new YAHOO.widget.Overlay("cal1Container", {
		visible :false,
		x :100,
		y :100
	});
	overlay1.render();

	cal1.hide();
}

function showCalendar(obj, id1) {
	editObj = obj;
	hiddenId = id1;
	var xy = YAHOO.util.Dom.getXY(obj);
	var date1 = obj.innerHTML.split(" ");
	if (date1.length == 2) {
		if(date1[0]=='January')date1[0]='1';
		if(date1[0]=='February')date1[0]='2';
		if(date1[0]=='March')date1[0]='3';
		if(date1[0]=='April')date1[0]='4';
		if(date1[0]=='May')date1[0]='5';
		if(date1[0]=='June')date1[0]='6';
		if(date1[0]=='July')date1[0]='7';
		if(date1[0]=='August')date1[0]='8';
		if(date1[0]=='September')date1[0]='9';
		if(date1[0]=='October')date1[0]='10';
		if(date1[0]=='November')date1[0]='11';
		if(date1[0]=='December')date1[0]='12';
		var date2 = date1[1].split(",");
		if(date2.length==2){
			cal1.select(date1[0] + "/" + date2[0] + "/" + date2[1]);
		}
	}
	 
	cal1.render();
	cal1.show();
	overlay1.cfg.setProperty("xy", xy);
	overlay1.cfg.setProperty("visible", true);
	overlay1.cfg.setProperty("mindate", new Date() );
	overlay1.render();
}

function showCalendar(obj, id1, mindate) {
	editObj = obj;
	hiddenId = id1;
    var xy = YAHOO.util.Dom.getXY(obj);
    var calendarbody = obj.innerHTML.replace(/^\s+|\s+$/g,"");
    var date1 = calendarbody.split(" ");
	
	if (date1.length == 2) {
		if(date1[0]=='January')date1[0]='1';
		if(date1[0]=='February')date1[0]='2';
		if(date1[0]=='March')date1[0]='3';
		if(date1[0]=='April')date1[0]='4';
		if(date1[0]=='May')date1[0]='5';
		if(date1[0]=='June')date1[0]='6';
		if(date1[0]=='July')date1[0]='7';
		if(date1[0]=='August')date1[0]='8';
		if(date1[0]=='September')date1[0]='9';
		if(date1[0]=='October')date1[0]='10';
		if(date1[0]=='November')date1[0]='11';
		if(date1[0]=='December')date1[0]='12';
		var date2 = date1[1].split(",");
		if(date2.length==2){
			cal1.select(date1[0] + "/" + date2[0] + "/" + date2[1]);
		}
	}
    var time = new Date();
    if(mindate && mindate!=''){
      var year = mindate.substring(0,4);
      var firstindex = mindate.indexOf("-");
      var lastindex = mindate.lastIndexOf("-");
      var month = mindate.substring(parseInt(firstindex)+1,parseInt(lastindex));
      month = parseInt(month)-1;
      var day = mindate.substring(parseInt(lastindex)+1);
      time.setFullYear(year, month, day);
    }
    cal1.cfg.setProperty("mindate",time);
    
	cal1.render();
	cal1.show();
	overlay1.cfg.setProperty("xy", xy);
	overlay1.cfg.setProperty("visible", true);
	overlay1.cfg.setProperty("mindate", time );
	overlay1.render();
}

function handleSelect(type, args, obj) {
	var dates = args[0];
	var date = dates[0];
	var year = date[0], month = date[1], day = date[2];
	var hiddenEl = document.getElementById(hiddenId);
	if(month=='1')month='January';
	if(month=='2')month='February';
	if(month=='3')month='March';
	if(month=='4')month='April';
	if(month=='5')month='May';
	if(month=='6')month='June';
	if(month=='7')month='July';
	if(month=='8')month='August';
	if(month=='9')month='September';
	if(month=='10')month='October';
	if(month=='11')month='November';
	if(month=='12')month='December';
	
	var txtDate1 = month+" "+day+","+year;
	var flag = hiddenEl.value == txtDate1 ? false : true;

	editObj.innerHTML = txtDate1;
	hiddenEl.value = txtDate1;
	obj.hide();
	if (flag)
		setRequestedDeliveryDate(txtDate1);
}
function setRequestedDeliveryDate(textdate) {
	for (i = 0; i < itemsCount; i++) {
		var el = document.getElementById("basketItems[" + i + "].comment");

		if (el && el.value == "")
			el.value = textdate;
	}
	document.VIEWCART.mode.value = "updateBasket";
	document.VIEWCART.submit();
}

function checkQty(qtyId){
	var qty = document.getElementById(qtyId).value;
	var re = /^[1-9]+[0-9]*]*$/; 
	 if (!re.test(qty))
	 {
	        alert("Quantity must be a positive integer!");
	        document.getElementById(qtyId).focus();
	        return false;
	 }
	 return true;
}