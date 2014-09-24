(function( $ ){
  $.fn.sidenav = function(options) {
    if(this.data('menu') == undefined){
      this.data('menu', 'done');
    }
    else{
      console.log('sidenav is already active');
      return null;
    }

    $('.top-categories a').on('click', function(e){
      var cat = $(this).data('ck');
      store.remove('sidenavData');
      $.cookie('ct', cat, {expires: 365*20, path: '/'});
    });

    var self = this,
      settings = $.extend({
        'topId': ''
      }, options),
      menuCrumbs = [],
      menuLevel = 1,
      methods = {
        submenu: function(menus){
          var menuHtml = '<ul data-level="'+ menuLevel +'">';
          if(menus.childs && menus.childs.length > 0) {
            $.each(menus.childs, function(index){
              menuHtml += methods.li(menus.childs[index]);
            });
          }
          else {
            menuHtml += methods.li(menus);
          }
          return menuHtml += '</ul>';
        },
        li: function(options){
          var cCrumb = [],
            activeLi = 'class="active"',
            liHtml = '',
            chevron = '';

          if(options.childs.length > 0){
            chevron = '<i class="icon-chevron-right pull-right opacity-50"></i>';
          }

          if($.cookie('mc') != null){
            cCrumb = JSON.parse($.cookie('mc')).data;
          }

          if(jQuery.inArray(+options.cid,cCrumb) != -1){
            liHtml = '<li '+ activeLi +' data-crumbid="'+ options.cid +'"><a href="'+ options.URL +'">' + options.name + chevron + '</a>';
          }
          else {
            liHtml = '<li data-crumbid="'+ options.cid +'"><a href="'+ options.URL +'">' + options.name + chevron + '</a>';
          }


          if(options.childs && options.childs.length > 0){
            menuLevel++;
            liHtml += methods.submenu(options);
            menuLevel--;
          }

          liHtml += '</li>';
          return liHtml;
        },
        events: function($this){
          var jsonResponse, liChilds;
          try {
            jsonResponse = eval("(" + settings.jsonData + ')');
          }
          catch(e){
            console.log('can\'t parse JSON string');
            return;
          }

          //get current li from $this and use it to get it from the response
          liChilds = $.map(jsonResponse.childs, function(el, index){
              if(el.name === $this.text()){
                  return el;
              }
          });

          liChilds = liChilds[0];

          // Add all the submenus of the current top menu
          $this.parent().append(methods.submenu(liChilds));
          // move up the submenu if it bottom position is below the window border
          $this.parent().on('mouseenter', function(e){
            var windHeight = window.innerHeight,
              ul = $(this).find('ul:first'),
              parentTop = $(this).position().top,
              offset = 10,
              menuPos = parentTop + ul.height() - $('html').scrollTop();

            if (ul.length == 0){
              return;
            }
            ul.css('top', $(this).position().top + 'px');
            ul.css('left', $(this).width() + 'px');

            if(menuPos > windHeight){
              ul.css('margin-top', windHeight - menuPos - offset);
            }
          });

          $this.parent().find('li').on('mouseenter', function(e){
            var windHeight = window.innerHeight,
              ul = $(this).find('ul:first'),
              mainTop = $('.sub-categories > li:hover').position().top,
              childTotalHeight = mainTop + $(this).position().top + ul.height() + parseInt($(this).parent().css('margin-top').replace('px', ''))
              offset = 10,
              level = $(this).parent().data('level');

            ul.css('height', $(this).parent().height());
            ul.css('margin-top', -($(this).position().top + $(this).height()));
            ul.css('left', $(this).width());
            //ul.css('overflow-y', 'scroll');

            menuCrumbs[level] = $(this).data('crumbid');

          });

          $this.parent().on('click', function(e){
            $.cookie('mc', JSON.stringify({data: menuCrumbs}), {expires: 360, path: "/"});
          });

          $this.parent().find('li a').on('click', function(e){
            $.cookie('mc', JSON.stringify({data: menuCrumbs}), {expires: 360, path: "/"});
          });
        },
        generateAllSubmenus: function(){
          self.each(function() {
            $(this).find('li a').each(function(){
              var $this = $(this),
                menu = '',
                cCrumb = [];

              if($.cookie('mc') != null){
                cCrumb = JSON.parse($.cookie('mc')).data;

                var parentData = $(this).parent();
                if(jQuery.inArray(parentData.data('crumbid'), cCrumb) != -1){
                  $(this).parent().addClass('active');
                }
              }

              $this.on('hover', function(e){
                menuCrumbs[0] = $this.parent().data('crumbid');
              });

              methods.events($this);
            });
          });
        }
    };

    if (!store.get('sidenavData')){
      settings.topId = $('.top-categories a.active').data('topid');
      $.get('subcat.ajx?vid=' + settings.vid + '&cid=' + settings.topId, function(data){
          settings.jsonData = data;
          store.set('sidenavData', data);
          methods.generateAllSubmenus();
        });
    }
    else{
      settings.jsonData = store.get('sidenavData');
      methods.generateAllSubmenus();
    }
  };
})( jQuery );