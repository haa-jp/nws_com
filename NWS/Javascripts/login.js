var loggedIn = {};

jQuery.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    jQuery.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

jQuery('a.show-forgot, .back-login').on('click', function(e){
  if(jQuery('.forgot-form:visible').length === 0){
    jQuery('.forgot-form').show();
    jQuery('.login-form').hide();
  }
  else{
    jQuery('.forgot-form').hide();
    jQuery('.login-form').show();
  }

  return false;
});

jQuery('.login-form').on('submit', function(e){
  e.preventDefault();
  // toastr.options.timeOut = 0;
  toastr.warning('Processing credentials...');
  loggedIn.formAction = jQuery(this).attr('action');
  loggedIn.form = this;
  loggedIn.check();
});

// Prevents page reload from being triggered twice consecutively
loggedIn.reloadTriggered = false;
loggedIn.timer = null;

loggedIn.check = function(secondPass) {
  	
  // Mod - scrpt breaking on prod. no conext root present
  //var redirecturl = document.location.href.match(/(preview|shop).*/)[0];
   var redirecturl = document.location.href.match(/(preview|shop).*/)[0];
   var redirecturl;
     if(/(preview|shop).*/.test(document.location.href)) {
   	  redirecturl = "preview";
     } else {
   	  redirecturl = document.URL;
     }
  // Mod 0 end
  
  
  jQuery.ajax({
    url: 'getlogin.ajx',
    type: 'GET',
    data: {
      vid: jQuery('[name=vid]').val()
    },
    success: function(data) {
      var jsonResponse, formData;

      try {
        jsonResponse = eval("(" + data + ')')["__Result"];
      }
      catch(e){
        toastr.error('Internal error: could not parse the response.');
      }

      if(jsonResponse.loggedin) {
        if (secondPass === true) {
          loggedIn.success();
        } else {
          loggedIn.reloadTriggered = true;
          window.location = 'basket.html?' + jQuery('[name=vid]').val() + '&login=true';
        }
      } else {
        formData = jQuery(loggedIn.form).serializeObject();
        formData.redirecturl = redirecturl;
        loggedIn.startSession(formData);
      }
    }
  });
};

loggedIn.startSession = function(formData) {
  loggedIn.timer = setTimeout(function(){
    toastr.warning('Still checking.  Please wait...');
    loggedIn.check(true);
  }, 7000);
  jQuery.ajax({
    type : 'POST',
    url : loggedIn.formAction,
    data : formData,
    success : function(response) {
      clearTimeout(loggedIn.timer);
      var error = jQuery.trim(jQuery(response).find('.alert-error li').text());
      if(!error){
        loggedIn.success();      
      }
      else{
        toastr.error(error);
      }
    }
  });
};

loggedIn.success = function() {
  if (loggedIn.reloadTriggered === false) {
    setTimeout(function(){
      window.location = 'basket.html?' + jQuery('[name=vid]').val() + '&login=true';
    }, 2000);
    toastr.success("You have logged in successfully!");
    loggedIn.reloadTriggered = true;
  }
};