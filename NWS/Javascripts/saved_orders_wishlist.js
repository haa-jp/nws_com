jQuery(document).ready(function(){
	jQuery.ajax({
		url : 'wishlist.html',        
        data : "vid="+jQuery('#vid').val()+"&tptm=json",
        dataType : 'text',
        type : 'get',
        success : function(data) {
        	var response = data;  
        	response = response.replace('<!-- start control heading -->','');
        	response = response.replace('<!-- end control heading -->','');
        	var wishlist = jQuery.parseJSON(response);
        	var container = jQuery('#wishlist').find('#container');
          container.html('');
          jQuery('<table id="wishlist_table" class="table table-bordered"><tr><th>&nbsp;</th><th>Items in your wishlist</th><th>Notes</th></tr></table>').appendTo(container);
          var table = jQuery('#wishlist_table');

        	if(wishlist.items.length > 0){
            jQuery('<input type="hidden" name="clientId" value="'+wishlist.items[0].clientId+'">').appendTo(container);
            for(var index in wishlist.items){
              var item = wishlist.items[index]

              var row = jQuery('<tr></tr>').appendTo(table);
              var td1 = jQuery('<td class="ac"><input type="checkbox" name="select" value="'+item.compcode+'"><input type="hidden" id="item_'+item.itemid+'" name="'+item.compcode+'" value="false"></td>');
              var td2 = jQuery('<td><div class="item_img"><a href="'+item.itemURL+'"><img src="store'+item.cimage+'" alt="'+item.title+'" onerror="javascript:this.src=\'store/'+item.vid+'/items/thumbnails/na_sm.png\'"/></a></div></td>');
              if(item.supplier == 'catalog'){
                jQuery('<div class="item-desc"><p class="item-title"><a href="'+item.itemURL+'">'+item.title+'</a><p class="code">Part Number: '+item.compcode.replace("-",".")+'</p></div>').appendTo(td2)
                jQuery('<input type="hidden" id="'+item.compcode+'.'+(index+1)+'" value="catalog">').appendTo(td2);
              }
              if(item.owner){
                var td3 = jQuery('<td class="ac"><textarea rows="7" name="notes_'+item.wishlistid+'">'+item.notes.replace(/<br \/>/g,"\n").replace(/<brr \/>/g,"")+'</textarea><p><input class ="btn btn-primary" name="submitSaveNote_'+item.wishlistid+'" type="submit" value="Save Note"></p>');
              }else{
                var td3 = jQuery('<td class="ac">'+item.notes.replace(/<br \/>/g,"\n").replace(/<brr \/>/g,"")+'</td>');
              }
              td1.appendTo(row);
              td2.appendTo(row);
              td3.appendTo(row);
            }

            var buttons = jQuery('<div class="form-actions"></div>');
            buttons.appendTo(container);
            jQuery('<input class="btn btn-primary" type="button" name="submitAddToCart" id="submitAddToCart" value="Add to Cart">').appendTo(buttons);
            
            jQuery('#submitAddToCart').bind('click', function(){
              var els = jQuery('input[type=checkbox]:checked').toArray();  
              buyItems(els);
            });

            if(wishlist.items[0].owner){
              jQuery('<span>&nbsp;</span><input class="btn" type="submit" name="submitDeleteItems" value="Remove">').appendTo(buttons);
              jQuery('<span>&nbsp;</span><input class="btn" type="submit" name="submitClearWishList" value="Remove All">').appendTo(buttons);
            }

        	}else{
        		container.html('There is no items in the wishlist.');
        	}   
        },
        error : function(data){}
	});

  function buyItems(els){
    var url="action.html?mode=addItems",
    vid = jQuery('#vid').val(),
    items = '',
    param = "&vid="+vid+"&url=basket.html?vid="+vid;
    
    for(var i = 0; i < els.length; i++){
      items += '&ic' + (i+1) + '=' + jQuery(els[i]).val() + '&qty' + (i+1) + '=1';
    }
    
    url += items + param;
    window.location.href=url;
  }
});