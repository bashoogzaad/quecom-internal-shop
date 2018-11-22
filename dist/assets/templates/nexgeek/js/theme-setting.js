/* Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition */
(function(a){"use strict"; a.fn.prepareTransition=function(){return this.each(function(){var b=a(this);b.one("TransitionEnd webkitTransitionEnd transitionend oTransitionEnd",function(){b.removeClass("is-transitioning")});var c=["transition-duration","-moz-transition-duration","-webkit-transition-duration","-o-transition-duration"];var d=0;a.each(c,function(a,c){d=parseFloat(b.css(c))||d});if(d!=0){b.addClass("is-transitioning");b[0].offsetWidth}})}})(jQuery);

window.timber = window.timber || {};

timber.cacheSelectors = function () {
  timber.cache = {
    $html                    : $('html'),
    $body                    : $(document.body),
    $navigation              : $('#AccessibleNav'),
    $mobileSubNavToggle      : $('.mobile-nav__toggle'),
    $productImage            : $('.ProductPhotoImg'),
    $thumbImages             : $('.ProductThumbs').find('a.product-single_thumbnail'),
  };
};

timber.init = function () {
  FastClick.attach(document.body);
  timber.cacheSelectors();
  timber.accessibleNav();
  timber.drawersInit();
  timber.mobileNavToggle();
  timber.productImageSwitch();
     
};

timber.accessibleNav = function () {
  var $nav = timber.cache.$navigation,
      $allLinks = $nav.find('a'),
      $topLevel = $nav.children('li').find('a'),
      $parents = $nav.find('.site-nav--has-dropdown'),
      $subMenuLinks = $nav.find('.site-nav__dropdown').find('a'),
      activeClass = 'nav-hover',
      focusClass = 'nav-focus';

  // Mouseenter
  $parents.on('mouseenter touchstart', function(evt) {
    var $el = $(this);

    if (!$el.hasClass(activeClass)) {
      evt.preventDefault();
    }

    showDropdown($el);
  });

  // Mouseout
  $parents.on('mouseleave', function() {
    hideDropdown($(this));
  });

  $subMenuLinks.on('touchstart', function(evt) {
    // Prevent touchstart on body from firing instead of link
    evt.stopImmediatePropagation();
  });

  $allLinks.focus(function() {
    handleFocus($(this));
  });

  $allLinks.blur(function() {
    removeFocus($topLevel);
  });

  // accessibleNav private methods
  function handleFocus ($el) {
    var $subMenu = $el.next('ul'),
        hasSubMenu = $subMenu.hasClass('sub-nav') ? true : false,
        isSubItem = $('.site-nav__dropdown').has($el).length,
        $newFocus = null;

    // Add focus class for top level items, or keep menu shown
    if (!isSubItem) {
      removeFocus($topLevel);
      addFocus($el);
    } else {
      $newFocus = $el.closest('.site-nav--has-dropdown').find('a');
      addFocus($newFocus);
    }
  }

  function showDropdown ($el) {
    $el.addClass(activeClass);

    setTimeout(function() {
      timber.cache.$body.on('touchstart', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown ($el) {
    $el.removeClass(activeClass);
    timber.cache.$body.off('touchstart');
  }

  function addFocus ($el) {
    $el.addClass(focusClass);
  }

  function removeFocus ($el) {
    $el.removeClass(focusClass);
  }
};

timber.drawersInit = function () {
  timber.LeftDrawer = new timber.Drawers('NavDrawer', 'left');
  timber.RightDrawer = new timber.Drawers('CartDrawer', 'right');  
};

timber.mobileNavToggle = function () {
  timber.cache.$mobileSubNavToggle.on('click', function() {
    $(this).parent().toggleClass('mobile-nav--expanded');
    $(this).parent().next().slideToggle();
	 return false;
  });
};

timber.getHash = function () {
  return window.location.hash;
};

timber.productImageSwitch = function () {
  if (timber.cache.$thumbImages.length) {
    // Switch the main image with one of the thumbnails
    // Note: this does not change the variant selected, just the image
    timber.cache.$thumbImages.on('click', function(evt) {
      evt.preventDefault();
      var newImage = $(this).attr('href');

      timber.switchImage(newImage, null, timber.cache.$productImage);
	   return false;
    });
  }
};

timber.switchImage = function (src, imgObject, el) {
  // Make sure element is a jquery object
  var $el = $(el);
  $el.attr('src', src);

    // Update new image src to grande
    var zoomSrc = src.replace('_medium.','_1024x1024.').replace('_large.','_1024x1024.').replace('_grande.','_1024x1024.');
  	//alert(zoomSrc);
    $el.attr('data-zoom-image', zoomSrc);

    $(function() {
      $('.zoomWindow').css('background-image', 'url(' + zoomSrc + ')');
    });

};


/*============================================================================
  Drawer modules
==============================================================================*/
timber.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.$nodes = {
      parent: $('body, html'),
      page: $('#PageContainer'),
      moved: $('.is-moved-by-drawer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function () {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
	 return false;
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Notify the drawer is going to open
    timber.cache.$body.trigger('beforeDrawerOpen.timber', this);

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$nodes.moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    this.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) === 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    // Lock scrolling on mobile
    this.$nodes.page.on('touchmove.drawer', function () {
      return false;
    });

    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));

    // Notify the drawer has opened
    timber.cache.$body.trigger('afterDrawerOpen.timber', this);
  };

  Drawer.prototype.close = function () {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    // Notify the drawer is going to close
    timber.cache.$body.trigger('beforeDrawerClose.timber', this);

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$nodes.moved.prepareTransition({ disableExisting: true });
    this.$drawer.prepareTransition({ disableExisting: true });

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    this.removeTrapFocus(this.$drawer, 'drawer_focus');

    this.$nodes.page.off('.drawer');

    // Notify the drawer is closed now
    timber.cache.$body.trigger('afterDrawerClose.timber', this);
  };

  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');

    $container.focus();

    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  return Drawer;
})();

// Initialize Timber's JS on docready
$(timber.init);


  /// STICKY HEADER
  $(window).scroll(function(e) {
	if($(window).width()>992) {
	  if($(window).scrollTop()>145) {
		$('.nav-bar').addClass("stickyNav");
		$('.is-moved-by-drawer').removeClass("is-moved-by-drawer");
	  } else {
		$('.nav-bar').removeClass("stickyNav");
		$('.is-moved-by-drawer').addClass("is-moved-by-drawer");
	  }
	}
  });


   /// SITE SCROLLER
  $("#scroll-top").on('click',function() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    return false;
  });


   /// PROMOTION HEADER load one time on site load
  if(Cookies.get('promotion') != 'true') {   
     $(".promotion-header").show();         
  }
 
  $(".closeHeader").on('click',function() {
    $(".promotion-header").slideUp();  
    Cookies.set('promotion', 'true', { expires: 1});  
	return false;
  });



$(document).on('ready',function(e) {    

  /// NEWSLETTER load one time on site load
  if(Cookies.get('visited') != 'true') {   
    $("#newsletter-modal").show();
    $(".newsletter-wrap").show();      
    Cookies.set('visited', 'true', { expires: 1});    
  } else {
    $("#newsletter-modal").hide();
    $(".newsletter-wrap").hide();
  }
  
  $(document).mouseup(function (e){
   	var container = $("#newsletter-modal");
    if (!container.is(e.target)
        && container.has(e.target).length === 0)
    	{
          container.hide();
          $(".newsletter-wrap").fadeOut();
    	}
	});
  
  $(".closepopup").on('click',function() {
    $("#newsletter-modal").fadeOut();
    $(".newsletter-wrap").fadeOut();
	 return false;
  });
  
  /// CLOSE MODEL	
   $(".closeModal").on('click',function() {
    $(".quickshop").fadeOut();
	 return false;
  });
  
  ///Footer links for mobiles
  $(".footer-links h3").on('click',function() {
    if($(window).width() < 767){
      $(this).toggleClass("active");
      $(this).next().slideToggle();
	   return false;
  	}
  });
   
   
  /// SET MARGIN FOR SOLD OUT	
  marginSoldOut();
  setTimeout(marginSoldOut, 5000)
  $(window).resize(marginSoldOut);
  
    /// SHOW HIDE PRODUCT TAG
  $(".product-tags 	li").eq(10).nextAll().hide(); 
  $('.btnview').on( 'click',function(){
    $(".product-tags li").not('.filter--active').show();
    $(this).hide();
	 return false;
  });
  
    /// MOBILE CUSOTMER LINK  
  $('.mobile-customer-links .fa').on('click',function(){
    $(this).next().slideToggle();
	 return false;
   });      
   
  // TAB TO ACCORDIAN 
  if($('.product-tabs .nav-tabs').length){
	  $('.product-tabs .nav-tabs').tabCollapse();
  }
 
  /// HOME PAGE BLOG
  if($('.blogs-grid').length){
	$(".blogs-grid").owlCarousel({
	  dots: false,
	  nav:true,
	  responsive:{             
		0:{items:1},
		479:{items:2}}
	});
  }
  
  // BRAND CAROUSEL
  if($('.list-brand').length){
	  $(".list-brand .owl-carousel").owlCarousel({
		dots:false,
		items:6,
		nav : true,
		responsive:{      	    
			0:{items:1},
			480:{items:2},
			768:{items:4},
			991:{items:5},
			1200:{items:6}
		 }
	  });
  }
  
  // HOME FEATURED COLLECTION CAROUSEL
  if($('.list-featured-collection').length){
	   $(".list-featured-collection .collections-grid").owlCarousel({
		  dots: false,
		  nav:true,
		  responsive:{
			0:{items:1},
			480:{items:2},
			767:{items:3},
			992:{items:4},
			1280:{items:5},
			1500:{items:6}
		  }
		});
  }

	// HOME FEATURED PRODUCTS CAROUSEL
	if($(".productSlider").length){
		$(".productSlider").owlCarousel({
			dots: false,
			nav:true,
			items: 5,
			responsive:{
				0:{items:1},       
				479:{items:2},
				768:{items:3},
				991:{items:4},
				1200:{items:5}
			}
		});
	}
		
	if($(".product-single_thumbnails").length){
		$(".product-single_thumbnails").owlCarousel({
			  dots: false,
			  nav:true,
			  items : 4,
			  itemsTablet: [767,3],
			  itemsTabletSmall: [721,2]
		});
		$('.ProductThumbs a').click(function(){						
		  $('.product-single_photos .ProductPhotoImg').attr('src',$(this).attr('href'));   					 
		});
	}
	
	// SPINNER 
	 $('.spinner .btnplus').on('click', function() {
      var btn = $(this);
      var input = btn.closest('.spinner').find('input');
      if (input.attr('max') === undefined || parseInt(input.val(),10) < parseInt(input.attr('max'),10)) {    
        input.val(parseInt(input.val(), 10) + 1);
      } else {
        btn.next("disabled", true);
      }
	   return false;
    });
    $('.spinner .btnminus').on('click', function() {
      var btn = $(this);
      var input = btn.closest('.spinner').find('input');
      if (input.attr('min') === undefined || parseInt(input.val(),10) > parseInt(input.attr('min'),10)) {    
        input.val(parseInt(input.val(), 10) - 1);
      } else {
        btn.prev("disabled", true);
      }
	   return false;
    });

  
});

// SET MARGIN FOR SOLD OUT	
function marginSoldOut(){ 
  $('.products-grid .grid_item').each(function(){  
  		var sm =  $(this).find('.product_image').height()/2 - 10;
  	    $('.not-available').css("padding-top",sm);
  });
}

function productimagesize(){ 
  $('.products-grid .product_image').each(function(){
    	var pimgWidth = $(this).width();
    	if(pimgWidth < 270)
    		$(this).children("a").height(pimgWidth);
    	else {
          $(this).children("a").height(270);
        }
    	//alert(pimgWidth);
	});	
}

$(window).on('load resize', function () {
  productimagesize();
});



            