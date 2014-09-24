
var Commerce = {version : 'C1.500', codeVersion: 'C8EE'};
var cnt_location = "Set 'lp_cnt_location' Store Property to define static content location. Then initialize variable 'cnt_location' in the template by this store property's value.";
var lp_host = "Set 'lp_host' Store Property to define liquid Pixel host and application name question sign included. Then initialize variable 'lp_host' in the template by this store property's value";

Commerce.Element = Class.create({
	initialize: function() {
		this.element;
	},
	
	addCss: function(e, css) {
		if (!Object.isUndefined(css))
			css.each(function(css) {
				e.addClassName(css)
			});
			
		return e;
	},
	
	setStyle: function(e, styles) {
		if (!Object.isUndefined(styles))
			e.setStyle(styles);
			
		return e;		
	},
	
	bindEvents: function(e, events) {
		if (!Object.isUndefined(events)) {
			events.each(function(event) {
				if (event.size()<3) {
					e.observe(event[0], event[1]);
				} else {
					var obj = event[2];
					var func = event[1];
					var x;
					if (event.size()==3) 
						x = obj[func].bindAsEventListener(obj);
					else
						x = obj[func].bindAsEventListener(obj, event[3]);
					e.observe(event[0], x);
				}
			});
		}
		
		return e;
	},
	
	insert: function(e, position) {
		if(Object.isUndefined(position))
			position = 'after';
		if (!['before', 'after', 'top', 'bottom'].include(position.toLowerCase())) {
			position = 'after';
		}
		var insertion = {};
		var el = this.toElement();
		insertion[position]=el;
		e.insert(insertion);
		return el;
	},
	
	 
	insertnewsku: function(e, position) {
		if(Object.isUndefined(position))
			position = 'after';
		if (!['before', 'after', 'top', 'bottom'].include(position.toLowerCase())) {
			position = 'after';
		}
 
		var el = this.toElement();
		e.innerHTML="";
		e.insert(el);
		return el;
	},
	
	
	insertsku: function(e, position) {
		if(Object.isUndefined(position))
			position = 'after';
		if (!['before', 'after', 'top', 'bottom'].include(position.toLowerCase())) {
			position = 'after';
		}
		var insertion = {};
		var el = this.toElement();
		insertion[position]=el;
		e.innerHTML = "";
		e.insert(insertion);
		return el;
	},
	
	toElement: function() {
		alert("please implement this method in your class!");
		return undefined;
	},
	
	getValue: function() {
		return this.element.value;
	}
});

Commerce.Table = Class.create(Commerce.Element, {
	initialize: function(data) {
		this.data = data;
	},
	
	createLine: function(data , row) {
		var tr = document.createElement("tr");
		for(var idx=0; idx<row; idx++) {
  			var td = document.createElement("td");
  			var d = data[idx];
  			if (Object.isUndefined(d))
  				td.appendChild(document.createTextNode(""));
  			else {
  				if (Object.isString(d) || Object.isNumber(d))
  					td.appendChild(document.createTextNode(d));
  				if (Object.isFunction(d)) {
  					var r = d.apply(this); 
  					if (Object.isElement(r))
  						td.appendChild(r);
  					else
  						td.appendChild(document.createTextNode(r));
  				}
  				if (Object.isElement(d))
  					td.appendChild(d);
  			}
  			
  			tr.appendChild(td);
  		} 
  		
  		return tr;
	},
	
	toElement: function() {
		var table = document.createElement("table");
		table = $(table);
		var tb = document.createElement("tbody");
		
		table.appendChild(tb);
		
		if (this.data.tTitle.size()>0) {
			var line = this.createLine(this.data.tTitle, this.data.tRow)
			this.setStyle(line, this.data.titleStyles);
			this.addCss(line, this.data.titleCss);
			tb.appendChild(line);
  	}
  	
  	for (var idx=0, len=this.data.tData.length; idx<len; idx++) {
  		
			tb.appendChild(this.createLine(this.data.tData[idx], this.data.tRow));
  	}
  	
  	this.setStyle(table, this.data.styles);
  	this.addCss(table, this.data.css);
  	this.bindEvents(table, this.data.events);
  	
  	this.element = table;
  	
  	return table;
	}
});

Commerce.TextArea = Class.create(Commerce.Element, {
	initialize: function(controlData) {
		this.data = controlData;
	},
	
	toElement: function() {
		var p = document.createElement("textarea");
		p.cols = this.data.cols;
		p.rows = this.data.rows;
		p.value = this.data.value;
		
		this.setStyle(p, this.data.styles);
  	this.addCss(p, this.data.css);
  	this.bindEvents(p, this.data.events);
  	
  	this.element = p;
		return p;
	}
});

Commerce.SelectBox = Class.create(Commerce.Element, {
	initialize: function(controlData) {
		this.data = controlData;
	},
		
	toElement: function() {

		var p = document.createElement("select");
		p = $(p);
		p.setAttribute("id", this.data.id);
		p.setAttribute("name", this.data.name);
		var idx = 0;
		var hasDefaultOption = false;
		this.data.options.each(function(option){				
			if (option==undefined)
				return;
			
			p.options[idx] = new Option(option.content, option.value);
			if (option.isDefault == 'yes') {
				
				p.options[idx].selected = true;
				if (p.options[idx].value!=0)
					hasDefaultOption=true;
			}
			idx++;
		});
					
		this.setStyle(p, this.data.styles);
		this.addCss(p, this.data.css);
		this.bindEvents(p, this.data.events);
		
		this.element = p;
		
		if (hasDefaultOption)
			this.removeNullOption();
		
		return p;
	},
	
	updateOptions: function(newOptions, selected) {

		if(this.compareOptions(this.data.options, newOptions)) {
			if (this.element.value == selected)
				return;
			else {
				for(var idx=0, len=this.element.options; idx<len; idx++) {
					var opt = this.element.options[idx];
					if (opt.value == selected) opt.selected = true;
				}
				return;
			}
		}
		this.data.options = newOptions;
		this.removeOptions(this.element);
		this.injectOptions(this.element, newOptions, selected);
	}, 
	injectOptions: function(element, options, selected) {
		var idx = 0;
		var p = element;
		options.each(function(option){				
			p.options[idx] = new Option(option.content, option.value);
			if (option.value == selected) {
				p.options[idx].selected = true;
			}
			idx++;
		});
	},
	
	removeOptions: function(selectObj) {
		var length = selectObj.options.length;
		for(var i=0; i<length; i++) {
			selectObj.remove(0);
		}
	},
	
	removeNullOption: function() {
		if (this.element==undefined) return;
		var length = this.element.options.length;
		for(var i=0; i<length; i++) {
			if (this.element.options[i].value==0) {
				this.element.remove(i);
				return;
			}
		}
	
	},
	
	compareOptions: function(o, n) {
		if (o.length != n.length) return false;
		
		for(var idx=0; idx<o.length; idx++) {
			if(o[idx].value!=n[idx].value)
				return false;
		}
		
		return true;
	},
	isSelected: function() {
		return this.element.value>0;
	},

	setSelected: function(optionId) {
	},
	
	getSelectedOption: function() {
		for(var idx=0; idx<this.data.options.length; idx++) {
			var option = this.data.options[idx];
			
			if(option.value ==  this.element.value) {
				return option;
			}
		}
	}
});

Commerce.RadioButton = Class.create(Commerce.Element, {
	initialize: function(controlData, quickInfo) {
		this.data = controlData;
		this.element = new Array();
		this.selected = 0;
		if (quickInfo == undefined)
			this.isQuickInfo = false;
		else
			this.isQuickInfo = quickInfo;
	},
	
	getValue: function() {
		if (this.selected>0) return this.selected;
		var found = this.elements.find(function(radio) {return radio.checked == true;});
		return found==undefined?undefined:found.value;
	},

	setSelected: function(optionId) {
		this.selected = optionId;
	},
	
	
	toElement: function(p) {
		if(!p){
			p = document.createElement("div");
		}
		//var p = document.createElement("div");
		p.setAttribute("id", this.data.id);
		p.setAttribute("name", this.data.name);
		var id = this.data.id;
		p = $(p);
		var idx = 0;
		var radioName = this.data.name;
		var elements = new Array();
		var data = this.data;
		this.data.options.each(function(opt){
			if (opt == undefined)
				return;
			var div = document.createElement("div");
			p.appendChild(div);
			var radioData = {};
			radioData.name = radioName+"_"+id;
			//radioData.id = id;
			radioData.value = opt.value;
			radioData.type = 'radio';
			radioData.styles = data.styles;
			//radioData.css = data.css;
			radioData.events = data.events;
			var radioButton = new Commerce.InputBox(radioData, opt.isDefault=='yes').toElement();
			elements.push(radioButton);
			div.appendChild(radioButton);
			var labeldiv = document.createElement("div");
			labeldiv = $(labeldiv);
			labeldiv.addClassName('f-field');
			var label = document.createElement("label");
			label.appendChild(document.createTextNode(opt.content));
			div.appendChild(labeldiv);
			labeldiv.appendChild(label);
			div.setAttribute("class", data.css);

			if (opt.isDefault == 'yes') {
				radioButton.checked=true;
				this.selected = opt.value;
			}
		});
		this.elements = elements;	

	  	this.setStyle(p, this.data.styles);
	  	this.addCss(p, this.data.css);
	  	this.bindEvents(p, this.data.events);

		return p;
	},
	
	
	updateOptions: function(newOptions, selected) {

	}, 
	injectOptions: function(element, options, selected) {

	},
	
	removeOptions: function(selectObj) {
	},
	
	removeNullOption: function() {
	},

	compareOptions: function(o, n) {	
		return false;
	},

	toRadioButtonGroup2: function(p) {
		var e_div3 = $(document.createElement("div"));
		var e_div4 = $(document.createElement("div"));
		e_div3.addClassName('radioColumn');
		e_div4.addClassName('radioColumn last');

		p.removeChild(p.childNodes[0]); //removing first option
		var total_radios = p.childNodes.length;
		var max_radios = p.childNodes.length/2;
		if((max_radios - Math.floor(max_radios)) > 0){
		 max_radios = Math.floor(max_radios) + 1;
		}

		var temp_element;
		for(var r_idx = 0; r_idx < total_radios; r_idx++){
				temp_element = p.childNodes[r_idx].cloneNode(true);
				if(max_radios > r_idx){
						e_div3.appendChild(temp_element);
				}
				else{
						e_div4.appendChild(temp_element);
				}
		}
		total_radios--;
		while(total_radios >= 0){
				p.removeChild(p.childNodes[total_radios]);
				total_radios--;
		}
		p.appendChild(e_div3);
		p.appendChild(e_div4);

		return p;
	},

	toRadioButtonGroup: function(p) {
		var e_div3 = $(document.createElement("div"));
		var e_div4 = $(document.createElement("div"));
		var e_div5 = $(document.createElement("div"));
		e_div3.addClassName('radioColumn');
		e_div4.addClassName('radioColumn');
		e_div5.addClassName('radioColumn last');

		p.removeChild(p.childNodes[0]); //removing first option
		var total_radios = p.childNodes.length;
		var max_radios = p.childNodes.length/3;
		if((max_radios - Math.floor(max_radios)) > 0){
		 max_radios = Math.floor(max_radios) + 1;
		}

		var temp_element;
		for(var r_idx = 0; r_idx < total_radios; r_idx++){
				temp_element = p.childNodes[r_idx].cloneNode(true);
				if(max_radios > r_idx){
						e_div3.appendChild(temp_element);
				}
				else if((2*max_radios) > r_idx){
						e_div4.appendChild(temp_element);
				}
				else{
						e_div5.appendChild(temp_element);
				}
		}
		total_radios--;
		while(total_radios >= 0){
				p.removeChild(p.childNodes[total_radios]);
				total_radios--;
		}
		p.appendChild(e_div3);
		p.appendChild(e_div4);
		p.appendChild(e_div5);

		return p;
	},

        isSelected: function() {
                return this.getValue()!=undefined;
        },
    	getSelectedOption: function() {
    		for(var idx=0; idx<this.data.options.length; idx++) {
    			var option = this.data.options[idx];
    			
    			if(option.value ==  this.getValue()) {
    				return option;
    			}
    		}
    	}        

});

Commerce.TextNode = Class.create(Commerce.Element, {
	initialize: function(controlData) {
		this.data = controlData;
	},
		
	toElement: function() {

		var p = document.createElement("span");
		p = $(p);
		p.setAttribute("id", this.data.id);
		p.setAttribute("name", this.data.name);
		p.appendChild(document.createTextNode(this.data.content));
					
  	this.setStyle(p, this.data.styles);
  	this.addCss(p, this.data.css);
  	this.bindEvents(p, this.data.events);
		
		this.element = p;
		
		
		return p;
	}
});



Commerce.InnerHTML = Class.create(Commerce.Element, {
	initialize: function(controlData) {
		this.data = controlData;
	},

	toElement: function() {

		var p = document.createElement("span");
		p = $(p);
		
		p.setAttribute("id", this.data.id);
		p.setAttribute("name", this.data.name);
		p.innerHTML = this.data.content;

		this.setStyle(p, this.data.styles);
		this.addCss(p, this.data.css);
		this.bindEvents(p, this.data.events);

		this.element = p;

		return p;
	}
});
;

Commerce.InputBox = Class.create(Commerce.Element, {
	initialize: function(controlData, checked) {
		this.data = controlData;
		this.checked = checked;
	},
		
	toElement: function() {

		var p
		if (this.data.type=='radio' && Prototype.Browser.IE) {
			if (this.checked==true) {
				p = document.createElement('<input type="radio" name="'+this.data.name+'" checked/>');
			}else {
				p = document.createElement('<input type="radio" name="'+this.data.name+'"/>');
			}
		}else {
			p = document.createElement("input");
			p.setAttribute("type", this.data.type);
		}
			
		p = $(p);
		if (this.data.id !=undefined)
			p.setAttribute("id", this.data.id);
		p.setAttribute("name", this.data.name);	
		p.setAttribute("value", this.data.value);
		this.setStyle(p, this.data.styles);
		this.addCss(p, this.data.css);
		this.bindEvents(p, this.data.events);
		
		this.element = p;
		
		return p;
	}
});

Commerce.Link = Class.create(Commerce.Element, {
	initialize: function(controlData) {
		this.data = controlData;
	},
		
	toElement: function() {

		var p = document.createElement("a");
		p = $(p);
		p.setAttribute("id", this.data.id);
		p.setAttribute("name", this.data.name);
		p.setAttribute("href", this.data.href);
		p.appendChild(document.createTextNode(this.data.content));
					
  	this.setStyle(p, this.data.styles);
  	this.addCss(p, this.data.css);
  	this.bindEvents(p, this.data.events);
		
		this.element = p;
		
		return p;
	}
});

Commerce.FieldSet = Class.create(Commerce.Element, {
	initialize: function(controlData) {
		this.data = controlData;
	},
		
	toElement: function() {

		var p = document.createElement("fieldset");
		p = $(p);
					
  	this.setStyle(p, this.data.styles);
  	this.addCss(p, this.data.css);
  	this.bindEvents(p, this.data.events);
		
		this.element = p;
		
		return p;
	}
});

Commerce.Popup = Class.create({
	initialize: function(header, body, footer, buttons){
		this.popup = $('js-popup-message');
		if (this.popup == undefined) {
			this.popup = $(document.createElement('div'));
			this.popup.id = 'js-popup-message';
			this.popup.addClassName('popup');
			document.body.appendChild(this.popup);
		}
		this.reset();
		if (header != undefined) 
			this.header.insert(header);
		if (body != undefined)
			this.body.insert(body);		
		if (footer != undefined)
			this.footer.insert(footer);		
		if (buttons != undefined)
			this.button.insert(buttons);
		else
			this.createDefaultButton();												
	},
	
	createDefaultButton: function() {
		var data = {};
		data.href = 'javascript:void(0);';
		data.content = 'CANCEL';
		data.css = ['popup_menuItem'];
		data.events = [['click', 'hide', this]];
		var button = new Commerce.Link(data);
		
		this.button.insert(button.toElement());
	},
	
	show: function() {

		this.popup.show();
		var center_x=(window.screen.width-this.popup.clientWidth)/2 +document.body.parentNode.scrollLeft;
		var center_y=(window.screen.height-this.popup.clientHeight-200)/2 + document.body.parentNode.scrollTop;

		this.popup.style.left = center_x + "px";
		this.popup.style.top  = center_y + "px";
		this.popup.style.visibility = "visible";

	},
	hide: function() {
		this.popup.hide();
	},
	reset: function() {
		this.popup.childElements().each(function(el) {Element.remove(el);});

		this.header = $(document.createElement('div'));
		this.header.id = 'js-popup-header';
		this.body = $(document.createElement('div'));
		this.body.id = 'js-popup-body';
		this.footer = $(document.createElement('div'));
		this.footer.id = 'js-popup-footer';
		this.button = $(document.createElement('div'));
		this.button.id = 'js-popup-button';
		
		this.popup.appendChild(this.header);
		this.popup.appendChild(this.body);
		this.popup.appendChild(this.footer);
		this.popup.appendChild(this.button);
	},
	destroy: function() {
		Element.remove(this.popup);
	}
});

Commerce.Cache = {
	cleanAll: function() {
		Commerce.Cache['item'] = new Hash();
		Commerce.Cache['currency'] = new Hash();
		Commerce.Cache['attribute'] = new Hash();
		Commerce.Cache['basket'] = new Hash();
		Commerce.Cache['product'] = new Hash();
		Commerce.Cache['message'] = new Hash();
		Commerce.Cache['addInfo'] = new Hash();
	}
};

Commerce.Cache['item'] = new Hash();
Commerce.Cache['currency'] = new Hash();
Commerce.Cache['attribute'] = new Hash();
Commerce.Cache['basket'] = new Hash();
Commerce.Cache['product'] = new Hash();
Commerce.Cache['message'] = new Hash();
Commerce.Cache['addInfo'] = new Hash();

function processAdditionalInfo(result) {}

Commerce.Domain = Class.create({
	initialize: function() {
		this.id=0;
		this.domainName;
	},
	
	getDomain: function(domainName, vid, id, URL) {
		var domain = Commerce.Cache[domainName].get(id);
		if (Object.isUndefined(domain)) {
			this.ajaxGetRequest(this.assembleGetRequestParams(), URL);
			domain = Commerce.Cache[domainName].get(id);
		} else {
			this.processAddInfo(id, this.assembleGetRequestParams());
		}
		return domain;
	},
	
	ajaxGetRequest: function(params, URL) {
		new Ajax.Request(URL, {
			method: 'get',
			parameters: params,
			asynchronous: false,
			encoding: 'UTF-8',
			onSuccess: this.onGetSuccess.bind(this),
			onFailure: this.onGetFailure.bind(this),
			onComplete: this.onGetComplete.bind(this)
		});
	},
	
	assembleGetRequestParams: function() {
		alert("please implement FUNC assembleGetRequestParams in your class!");
		return undefined;
	},
	onGetFailure: function() {
		alert("please implement FUNC onGetFailure in your class!");
		return undefined;
	},
	onGetSuccess: function(response) {
		var arr = unescape(response.responseText);
		var jsonArr = JSON.parse(arr);
		var addInfo = jsonArr.__AddInfo;
		var result = jsonArr.__Result;

		if (Object.isArray(result)) {
			for (var i=0; i<result.length; i++) {
				this.cacheDomain(result[i]);
				this.cacheAddInfo(result[i], addInfo);
			}
		}
		else {
			 this.cacheDomain(result);
			 this.cacheAddInfo(result, addInfo);
		}
		processAdditionalInfo(addInfo);
	},
	
	onGetComplete: function() {
	},
	
	clearCache: function(){
		Commerce.Cache[this.domainName].unset(this.id);
	},
	
	cacheDomain: function(domain) {
		alert("please implement FUNC cache in your class!");
		return undefined;
	},
	
	cacheAddInfo: function(domain, addInfo) {
		return undefined;
	},
	
	processAddInfo: function(id) {
		return undefined;
	},
	
	initAdditionalParams: function () { //override it on page
		return undefined;
	}
 
});

function FormParam(name, value) {
	this.name = name;
	this.value = value;
	return this;
}

FormParam.prototype = {
	name : null,
	value: null
}

function FormParams() {
	this.params = new Array();
	return this;
}

FormParams.prototype = {
	params : new Array(),	
	
	addParam: function(param) {
		this.params[this.params.length] = param;
	},

	getParams: function() {
		return this.params;
	}
}
function initAdditionalParams() {
	return undefined;
}
Commerce.Domain.Item = Class.create(Commerce.Domain, {
	initialize: function(vid, itemid, itemcode, refreshMode) {
		this.url = 'getitems.ajx';
		this.domainName = 'item';
		this.id = itemid;
		this.vid = vid;
		this.addParams = initAdditionalParams(itemcode);
		this.refreshMode = refreshMode; 
		if (refreshMode)
			this.addParams[this.addParams.length]=new FormParam(refreshMode.name, refreshMode.value);
		this.domain = this.getDomain(this.domainName, vid, itemid, this.url);
	},
	
	assembleGetRequestParams: function() {
		var params = {};
		params.vid = this.vid;
		if (Object.isArray(this.id))
			params.itemid = this.id.toString();
		else
			params.itemid = this.id;
		if (this.addParams) {
			for (var i=0;i<this.addParams.length;i++) {
				params[this.addParams[i].name]=this.addParams[i].value;
			}
		}
		return params;
	},
	
	cacheDomain: function(domain) {
		Commerce.Cache[this.domainName].set(domain.itemid, domain);
	},
	
	cacheAddInfo: function(domain, addInfo) {
		Commerce.Cache['addInfo'].set(domain.itemid, addInfo);
	},
	
	processAddInfo: function(id, params) {
		if (this.refreshMode) {
			params["newItemSku"] = Commerce.Cache[this.domainName].get(id).code; 
			new Ajax.Request("updateaddinfo.ajx", {
					method: 'post',
					parameters: params,
					asynchronous: false,
					encoding: 'UTF-8',
					onSuccess: function(response) {
						var arr = unescape(response.responseText);
						var addInfo = arr.evalJSON().__AddInfo;
						processAdditionalInfo(addInfo);
					},
					onFailure: function() {},
					onComplete: function() {}
			});
		}
	},
	
	getPrice: function(code) {
		if (this.domain.prices.length == 0)
			return undefined;
		
		var price;

		if (code=='' || code == undefined) {
			price = this.findPrice(this.domain.code);
			if (price == undefined)
				price = this.domain.prices[0];
		}
		else {
			price = this.findPrice(code);
			if (price==undefined)
				price=this.findPrice(this.domain.code);
		} 
		if (price != undefined)
			price.customerDiscount = 1-this.domain.discount;
		return price;
	},

	getInventory: function(code) {
		if (this.domain.invs.length == 0)
			return undefined;
		if (code=='') {
			var inv = {};
			inv.instock = this.sumInStock();
			inv.minorderqty = this.domain.invs[0].minorderqty;
			
			return inv;
		}
		else {
			var inv = this.findInventory(code);
			
			return inv;
		}
	},
	
	findPrice: function(code) {
		return this.domain.prices.find(function(price) { return price.itemcode==code ;});
	},
	
	findInventory: function(code) {
		return this.domain.invs.find(function(inv) { return inv.code==code ;});
	},
	
	sumInStock: function() {
		var sum = 0;
		this.domain.invs.each(function(inv) {sum+=inv.instock;});
		return sum;
	}
});

Commerce.Domain.Currency = Class.create(Commerce.Domain, {
	initialize: function(vid, currencyid) {
		this.url = 'getcurrency.ajx';
		this.domainName = 'currency';
		this.id = currencyid;
		this.vid = vid;
		this.domain = this.getDomain(this.domainName, vid, currencyid, this.url);
	},
	
	assembleGetRequestParams: function() {
		var params = {};
		params.vid = this.vid;
		params.currencyid = this.id;
		return params;
	},
	
	cacheDomain: function(domain) {
		Commerce.Cache[this.domainName].set(domain.currencyId, domain);
	}

});

Commerce.Domain.Message = Class.create(Commerce.Domain, {
	initialize: function(vid, messageid) {
		this.url = 'getmessage.ajx';
		this.domainName = 'message';
		this.id = messageid;
		this.vid = vid;
		this.domain = this.getDomain(this.domainName, vid, messageid, this.url);
	},
	
	assembleGetRequestParams: function() {
		var params = {};
		params.vid = this.vid;
		params.messageid = this.id;
		return params;
	},
	
	cacheDomain: function(domain) {
		Commerce.Cache[this.domainName].set(domain.messageid, domain);
	}

});

Commerce.Domain.Product = Class.create({
	initialize: function(product) {
		this.domain=product;
	},
	
	findOption: function(attributeId) {
		var attribute = this.findAttribute(attributeId);
		if (Object.isUndefined(attribute))
			return undefined;
			
		if (attribute.attype==2)
			return attribute.optionId;
	
		if (attribute.attype==3)
			return attribute.value;	
	},
	
	findAttribute: function(attributeId) {
		return this.domain.attributes.find(function(attrib) { return attrib.attributeId==attributeId;});
	}
	
});

Commerce.Domain.Basket = Class.create(Commerce.Domain, {
	initialize: function(vid) {
		this.url = 'getbasket.ajx';
		this.domainName = 'basket';
		this.id = 0;
		this.vid = vid;
		this.domain = this.getDomain(this.domainName, vid, 0, this.url);
	},
	
	findProduct: function(basketItemId) {
		return new Commerce.Domain.Product(this.domain.products.find(function(product) {return basketItemId==product.id;}));
	},
	
	assembleGetRequestParams: function() {
		var params = {};
		params.vid = this.vid;
		params.basketid = this.id;
		return params;
	},
	
	cacheDomain: function(domain) {
		Commerce.Cache[this.domainName].set(0, domain);
	}
});

Commerce.Domain.Attribute = Class.create(Commerce.Domain, {
	initialize: function(vid, attributeid) {
		this.url = 'getattributes.ajx';
		this.domainName = 'attribute';
		this.id = attributeid;
		this.vid = vid;
		this.domain = this.getDomain(this.domainName, vid, attributeid, this.url);
		this.domain.options = this.domain.options.sortBy(function(option) {return option.choice;});
		this.optionFilter = new Array();
		this.css = [];
		this.name = '';
		this.events = [];
	},
	
	assembleGetRequestParams: function() {
		var params = {};
		params.vid = this.vid;
		params.attributeid = [this.id];
		return params;
	},
	
	cacheDomain: function(domain) {
		Commerce.Cache[this.domainName].set(domain.attributeid, domain);
	},

	filterOption: function(skus, option) {
	if (skus.length==0)
			return true;
		for(var idx=0; idx<skus.length; idx++) {
			if (skus[idx].indexOf(':'+option.optionid+'_')>0 || skus[idx].endsWith(':'+option.optionid))
				return true;
		}
		
		return false;
	},
	initializeSelectBox: function(name, css, events, container) {
		this.css = css;
		this.name = name;
		this.events = events;
		this.container = container;
	},
	toSelectBox: function(enableDefault, optionid) {
		var filter = this.optionFilter;
		if (Object.isUndefined(enableDefault))
			enableDefault = false;
			
		if (Object.isUndefined(optionid))
			optionid = 0;
			
		if (Object.isUndefined(filter))
			filter = [];
			
		var data = {};
		data.css = this.css;
		data.name = 'attribute_'+this.id;
		data.events = this.events;
		data.id = 'attribute_'+this.id;
		var options = new Array();
		var dropOpt = {};
		dropOpt.value=0;
		dropOpt.content = this.domain.dropname;
		dropOpt.isDefault = 'no';
		options[0] = dropOpt;
		for(var idx=0; idx<this.domain.options.length; idx++) {

			if (this.domain.enablesku==false || this.filterOption(filter, this.domain.options[idx])) {

				var option = this.domain.options[idx];
				var opt = {};
				opt.value = option.optionid;
				opt.content = option.ddtext;
				if (optionid==0 && enableDefault && this.domain.enablesku==false)
					opt.isDefault = ((option.def==2)?'yes':'no');
				if (optionid>0) {
					opt.isDefault = ((option.optionid==optionid)?'yes':'no');
				}
				opt.textValue = option.text_value;
				options[idx+1] = opt;	
			}
		}
		data.options = options;
		this.selectBox = new Commerce.SelectBox(data);
		return this.selectBox.toElement();
	},
	
	toRadioButton: function(enableDefault, optionid, quickinfo) {
		var filter = this.optionFilter;
		if (Object.isUndefined(enableDefault))
			enableDefault = false;
			
		if (Object.isUndefined(optionid))
			optionid = 0;
			
		if (Object.isUndefined(filter))
			filter = [];
			
		var data = {};
		data.css = this.css;
		data.name = this.name;
		data.events = this.events;
		data.id = this.id;
		var options = new Array();
		var dropOpt = {};
		dropOpt.value=0;
		dropOpt.content = this.domain.dropname;
		dropOpt.isDefault = 'no';
		//options[0] = dropOpt;
		for(var idx=0; idx<this.domain.options.length; idx++) {

			if (this.domain.enablesku==false || this.filterOption(filter, this.domain.options[idx])) {

				var option = this.domain.options[idx];
				var opt = {};
				opt.value = option.optionid;
				opt.content = option.ddtext;
				if (optionid==0 && enableDefault && this.domain.enablesku==false)
					opt.isDefault = ((option.def==2)?'yes':'no');
				if (optionid>0) {
					opt.isDefault = ((option.optionid==optionid)?'yes':'no');
				}
				opt.textValue = option.text_value;
				options[idx] = opt;	
			}
		}
		data.options = options;
		this.selectBox = new Commerce.RadioButton(data, quickinfo);
		return this.selectBox.toElement(this.container);
	},
	
	toTextArea: function(value) {
		var data = {};
		if (Object.isUndefined(value)) 
			data.value = this.domain.defvalue;
		else 
			data.value = value;
		data.cols = this.domain.cols;
		data.rows = this.domain.rows;
		data.events = this.events;
		
		
		this.textArea = new Commerce.TextArea(data);
		return this.textArea.toElement();
	},
	
	updateFilter: function() {
		if (this.selectBox.isSelected()==false) return this.optionFilter;
		var pattern=this.domain.attributeid+':'+this.selectBox.getValue();
		return this.optionFilter.findAll(function(sku) { return sku.indexOf(pattern)>=0;});
	},
	
	updateSelectBox: function() {

		if (this.domain.enablesku==false) return;
		var filter = this.optionFilter;
		var optionid = this.selectBox.getValue();
		var options = this.getOptions(filter, optionid);
		this.selectBox.updateOptions(options, this.optionid);	
	},
	
	removeNullOption: function() {
		this.selectBox.removeNullOption();
	},
	
	getOptions: function(filter, optionid) {
		var options = new Array();
		var opts = this.domain.options;
		
		var dropOpt = {};
		dropOpt.value=0;
		dropOpt.content = this.domain.dropname;
		
		var hit = false;
		var oneSku = (filter.length==1);
		if (optionid == 0 && oneSku==false) {
			dropOpt.isDefault = 'yes';
			hit = true;
		}
		else 
			dropOpt.isDefault = 'no';
		
		options.push(dropOpt);
		
		for(var idx=0; idx<opts.length; idx++) {
			var option = opts[idx];
			if (this.filterOption(filter, opts[idx])) {
				var opt = {};
				opt.value = option.optionid;
				opt.content = option.ddtext;
				if (option.optionid == optionid || oneSku) {
					opt.isDefault = 'yes';
					hit = true;
					optionid = option.optionid;
				}
				else 
					opt.isDefault = 'no';
					
				options.push(opt);
			} 
		}
		if (hit==false) {
			dropOpt.isDefault = 'yes';
			this.optionid = 0;
		}
		else
			this.optionid = optionid; 
			
		return options;
	},
	
	isSelected: function() {
		if (this.domain.attype=='3')
			return true;
		else
			return this.selectBox.isSelected();
	},
	
	getValue: function() {
		if (this.domain.attype=='3')
			return this.textArea.element.value;
		else
			return this.selectBox.getValue();
	},
	
	enableSku: function() {
		return this.domain.enablesku;
	},
	
	getSelectedCode: function() {
		var optionid = this.selectBox.getValue()
		if (this.domain.attype=='3')
			return '';
		else
			return this.domain.options.find(function(option) {return option.optionid==optionid;}).code;
	},
  
	setSelected: function(optionId) {
		this.selectBox.setSelected(optionId);
	}
});

function refreshAdditionalParams(item) {}
Commerce.BO = {};

Commerce.BO.Sku = Class.create({
	
	initialize: function(vid, item, itemcode, refreshMode) {
		if (Object.isNumber(item) || Object.isString(item))
			this.item = new Commerce.Domain.Item(vid, item, itemcode, refreshMode);
		else
			this.item = item;
		this.mainItemBO;
			
		this.attribs = new Array();
		this.skuAttribs = new Array();
		this.mainItemSkus = new Hash();
		
		var attributes2 = this.item.domain['attributes'];
		var attributes= attributes2.sortBy(function(attribute) {return attribute.position;});

		for(var idx=0, len=attributes.length; idx<len; idx++) {
			var attribute = attributes[idx];
			var attrib = new Commerce.Domain.Attribute(vid, attribute.attributeid);
			this.attribs.push(attrib);
			if (attrib.domain.enablesku==true) {
				this.skuAttribs.push(attrib);
			}
		};
		//this.skuAttribs= this.skuAttribs.sortBy(function(attribute) {return attribute.domain.position;});
		//this.attribs =this.attribs.sortBy(function(attribute) {return attribute.domain.position;});
		this.skus = this.item.skus;
		this.vid = vid;
		this.initAllSkus();
		this.initAvailableSkus();
		this.initMainItemSkus();
		
		this.lp_itemimage = "";
		this.lp_largeimage="";
	},
	
	refreshLpImages: function() {
		if(this.item.domain.lp_itemimage && this.item.domain.lp_largeimage) {
			
			this.lp_itemimage = lp_host+this.item.domain.lp_itemimage.replace(new RegExp("\\$\{cnt_location\}",'g'),cnt_location);
			this.lp_largeimage = lp_host+this.item.domain.lp_largeimage.replace(new RegExp("\\$\{cnt_location\}",'g'),cnt_location);
			for(var idx=0; idx<this.attribs.length; idx++) {
				var attribute = this.attribs[idx];
				
				var tegName = attribute.domain.dataname.replace(new RegExp("\\s+",'g'),"_");
				
				if(attribute.selectBox) {
					var textValue = attribute.selectBox.getSelectedOption().textValue;
				} else if(attribute.textArea) {
					var textValue = attribute.textArea.getValue();
				}
				
				this.lp_itemimage = this.lp_itemimage.replace(new RegExp("\\$\{lp_"+tegName+"\}",'gi'),escape(textValue))
				this.lp_largeimage = this.lp_largeimage.replace(new RegExp("\\$\{lp_"+tegName+"\}",'gi'),escape(textValue))
				
			}
		}
	},
	
	hasSkuEnabledAttribute: function() {
		return this.skuAttribs.length>0;
	},
	
	isMainItem: function() {
		return this.item.domain.mainitemid==0;
	},
	
	getMainItemBO: function() {
		if (Object.isUndefined(this.mainItemBO))
			return this;
		else 
			return this.mainItemBO;
	},
	
	initMainItemSkus: function() {
		if (this.isMainItem()) {
			this.mainItemSkus = this.avaiSkus;
			return;
		}
		
		this.mainItemBO = new Commerce.BO.Sku(this.vid, this.item.domain.mainitemid, this.item.domain.code);
		this.mainItemSkus = this.mainItemBO.avaiSkus;
		refreshAdditionalParams(this.item.domain)
	},
	initAllSkus: function() {
			
		
		var compCodes = new Array();
		
		
		compCodes.push(this.item.domain.code+"-"); 
		var skus = new Array();
		skus.push('sku');
		for(var idx=0, len=this.skuAttribs.length; idx<len; idx++) {
			var attrib = this.skuAttribs[idx]; 
			for(var idx2=0, len2=skus.length; idx2<len2; idx2++) {
				var sku = skus.shift();
				var compCode = compCodes.shift();
				for(var idx3=0, len3=attrib.domain.options.length; idx3<len3; idx3++) {
					var option = attrib.domain.options[idx3];
					skus.push(sku+"_"+option.attributeid+':'+option.optionid);
					if (compCode.endsWith('-'))
						compCodes.push(compCode+option.code);
					else
						compCodes.push(compCode+"."+option.code);
				}
			}
		}
		
		this.allSkus = (skus.length>1)?skus:[];
		this.compCodes = (compCodes.length>1)?compCodes:[];
	},
	
	getDefaultSkuId: function() {		
		var skus =  this.item.domain.skus;
		if (this.skuAttribs.length>0)
		for (var idx=0; idx<this.skuAttribs[0].domain.options.length; idx++) {
			for( var idx2=0; idx2<skus.length; idx2++) {
				if (this.skuAttribs[0].domain.options[idx].optionid==skus[idx2].optionid){
					return skus[idx2].skuid;
				}
			}
		}
	},
	
	needSwitchImage: function() {
		for(var idx=0, len=this.skuAttribs.length; idx<len; idx++) {
			var attrib = this.skuAttribs[idx];
			if (attrib.domain.switchimage=='Y')
				return true;
		}
		return false;
	},
	
	initAvailableSkus: function() {
		var skus = this.item.domain.skus;
		this.avaiSkus = new Hash();
		if (skus.length<=0)
			return this.avaiSkus;
		
		var skus2 = new Array();
		var items = skus.pluck('skuid').uniq();

		for(var idx=0; idx<items.length; idx++) {
			var itemskus = skus.findAll(function(sku) {
				return sku.skuid==items[idx];
			});
			skus2.push(itemskus);
		}
		
		for(var idx=0; idx<skus2.length; idx++) {
			var sku = skus2[idx];
			if (sku !='') { 
				var newSku = sku.sortBy(this.sortAttributeById.bind(this));
				var sku_value = 'sku';
				for(var idx2=0; idx2<newSku.length; idx2++) {
					sku_value += '_'+newSku[idx2].attributeid+':'+newSku[idx2].optionid;
				}
				this.avaiSkus.set(sku[0].skuid, sku_value);
			}
		}
	},
	
	sortAttributeById: function(sku) {

		var attribute = this.item.domain.attributes.find(function(attr) {
			if (sku.attributeid==attr.attributeid)
				return true;
			});
			if (attribute != undefined)
					return attribute.position;
			else {
					return 1;
			}

	}
	
});

Commerce.BO.ChoosenSku = Class.create({
	

	
	initialize: function(vid, item, attributesIds) {
		if (Object.isNumber(item) || Object.isString(item))
			this.item = new Commerce.Domain.Item(vid, item);
		else
			this.item = item;
		this.mainItemBO;
		
		this.attribs = new Array();
		this.skuAttribs = new Array();
		this.mainItemSkus = new Hash();
		
		var attributes2 = this.item.domain['attributes'];
		var attributes= attributes2.sortBy(function(attribute) {return attribute.position;});

		for(var idx=0, len=attributes.length; idx<len; idx++) {
			var attribute = attributes[idx];
			if(typeof attributesIds !="undefined"){
				for(var aidx=0,alen=attributesIds.length;aidx<alen;aidx++){
					var tempattr = attributesIds[aidx];
					if(attribute.attributeid == tempattr){
						var attrib = new Commerce.Domain.Attribute(vid, attribute.attributeid);
						this.attribs.push(attrib);
						if (attrib.domain.enablesku==true) {
							this.skuAttribs.push(attrib);
						}
					}
				}
			}
			
		};
		//this.skuAttribs= this.skuAttribs.sortBy(function(attribute) {return attribute.domain.position;});
		//this.attribs =this.attribs.sortBy(function(attribute) {return attribute.domain.position;});
		this.skus = this.item.skus;
		this.vid = vid;
		this.initAllSkus();
		this.initAvailableSkus();
		this.initMainItemSkus();
	},
	
	hasSkuEnabledAttribute: function() {
		return this.skuAttribs.length>0;
	},
	
	isMainItem: function() {
		return this.item.domain.mainitemid==0;
	},
	
	getMainItemBO: function() {
		if (Object.isUndefined(this.mainItemBO))
			return this;
		else 
			return this.mainItemBO;
	},
	
	initMainItemSkus: function() {
		if (this.isMainItem()) {
			this.mainItemSkus = this.avaiSkus;
			return;
		}
		
		this.mainItemBO = new Commerce.BO.Sku(this.vid, this.item.domain.mainitemid);
		this.mainItemSkus = this.mainItemBO.avaiSkus;
			
	},
	initAllSkus: function() {
			
		var skus = new Array();
		var compCodes = new Array();
		
		skus.push('sku');
		compCodes.push(this.item.domain.code+"-");
		
		for(var idx=0, len=this.skuAttribs.length; idx<len; idx++) {
			var attrib = this.skuAttribs[idx];
			for(var idx2=0, len2=skus.length; idx2<len2; idx2++) {
				var sku = skus.shift();
				var compCode = compCodes.shift();
	
				for(var idx3=0, len3=attrib.domain.options.length; idx3<len3; idx3++) {
					var option = attrib.domain.options[idx3];
					skus.push(sku+"_"+option.attributeid+':'+option.optionid);
					if (compCode.endsWith('-'))
						compCodes.push(compCode+option.code);
					else
						compCodes.push(compCode+"."+option.code);
				}
			}
		}
		
		this.allSkus = (skus.length>1)?skus:[];
		this.compCodes = (compCodes.length>1)?compCodes:[];
	},
	
	initAvailableSkus: function() {
		var skus = this.item.domain.skus;
		this.avaiSkus = new Hash();
		if (skus.length<=0)
			return this.avaiSkus;
		
		var skus2 = new Array();
		var items = skus.pluck('skuid').uniq();

		for(var idx=0; idx<items.length; idx++) {
			var itemskus = skus.findAll(function(sku) {
				return sku.skuid==items[idx];
			});
			skus2.push(itemskus);
		}
		
		for(var idx=0; idx<skus2.length; idx++) {
			var sku = skus2[idx];
			if (sku !='') { 
				var newSku = sku.sortBy(this.sortAttributeById.bind(this));
				var sku_value = 'sku';
				for(var idx2=0; idx2<newSku.length; idx2++) {
					sku_value += '_'+newSku[idx2].attributeid+':'+newSku[idx2].optionid;
				}
				this.avaiSkus.set(sku[0].skuid, sku_value);
			}
		}
	},
	
	sortAttributeById: function(sku) {

		var attribute = this.item.domain.attributes.find(function(attr) {
			if (sku.attributeid==attr.attributeid)
				return true;
			});
			if (attribute != undefined)
					return attribute.position;
			else {
					return 1;
			}
	}
});

