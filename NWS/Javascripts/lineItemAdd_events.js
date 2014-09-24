jQuery("#line_addButton").click(function(){   	
	_lineItemAdd = new lineItemAdd();
	_lineItemAdd.set_mode("query");
	_lineItemAdd.readFields();
 
	if(_lineItemAdd.checkItem()) 
	_lineItemAdd.CheckDeliveryoption(); 
});




jQuery("#line_addButton").click(function(){    
  _lineItemAdd = new lineItemAdd();
  _lineItemAdd.readFields();
  _lineItemAdd.LineAdd();
});   