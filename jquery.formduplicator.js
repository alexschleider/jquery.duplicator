(function( $ ) {
	
	var methods = {
		addButton : function(callback) {
			callback = callback || function(){};
			$('.'+globals.uniqueClass+'-add').off();
	     	$('.'+globals.uniqueClass+'-add').on('click', function() {
		        var $newContainer = globals.baseContainer.clone().removeClass('base').addClass('clone').append(globals.removeButton).append(settings.after);

		        $("input, textarea", $newContainer).not("input[type='checkbox']").val("");
		        $("input[type='checkbox']", $newContainer).prop('checked', false);
	        	$("select", $newContainer).each(function(){
	        		$("option:eq(0)", $(this)).prop('selected', true);
	        	});
	    		methods.setFieldIds($newContainer, $(".base, .clone", globals.duplicatorContainer).length);
		        $(".duplicatorAdd", globals.duplicatorContainer).before($newContainer);
				        
		 		methods.removeButton(settings.remove, settings.beforeRemove);
				methods.clearButton(settings.clear);
		 		callback($newContainer);
	     		if(settings.limit > 1 && $(".base, .clone", globals.duplicatorContainer).length >= settings.limit) {
	     			$(this).attr('disabled', 'disabled');
	     		}
		 		return false;
		    });
		},

		removeButton : function(callback, before) {
			before = before || function(item){ return true; };
	    	$('.duplicatorRemove').off();
    		$('.duplicatorRemove').on('click', function() {
				var $item = $(this).parents('div').eq(0);
				if(!before($item)) return false;
		  	 	var $thisContainer = $(this).closest('.duplicator-container');
		  	 	var $addButton = $(".duplicatorAdd", $thisContainer);
		  	 	var addIsDisabled = $addButton.attr('disabled');
		  	 	if(typeof addIsDisabled !== 'undefined' && addIsDisabled !== false) $addButton.removeAttr('disabled');

		        $item.remove();
		        callback();
		        return false;
		    });
		},
		clearButton : function(callback) {
	    	$('.duplicatorClear').off();
    		$('.duplicatorClear').on('click', function() {
	        	$("input, textarea", $(this).closest('div')).val("");
	        	$("select", $(this).closest('div')).each(function(){
	        		$("option:eq(0)", $(this)).prop('selected', true);
	        	});
		        callback();
		        return false;
		    });		
    	},
    	setFieldData : function($container, data) {
    		if($.isPlainObject(data))
    			for(var className in data) {
    				if($("."+className, $container).is(':checkbox')) {
						$("."+className, $container).prop('checked', parseInt(data[className]));
					} else
    					$("."+className, $container).val(data[className]);
    			}
    		else
    			$("input, select, textarea", $container).val(data);
    		
    	},
    	setFieldIds : function($container, i) {
			$('input, select, textarea', $container).attr('id', function(index, attr){if(attr != null)return attr+"-"+i});
			$('label', $container).attr('for', function(index, attr){if(attr != null)return attr+"-"+i});
    	},
    	addRows : function(data, startWithBaseRow, skipCallback) {
    		skipCallback = skipCallback || false;
	    	if($.isArray(data) && data.length > 0) {
	    		if(startWithBaseRow) {
		    		var firstValue = data.shift();
		    		methods.setFieldData(globals.initialContainer, firstValue);
		    	}
	    		for(var i=0; i<data.length; i++){
			        var $newContainer = globals.baseContainer.clone().removeClass('base').addClass('clone').append(globals.removeButton);
			        if(settings.after) $newContainer.append(settings.after);
	    			methods.setFieldData($newContainer, data[i]);
	    			methods.setFieldIds($newContainer, i+1);
			        globals.duplicatorContainer.append($newContainer);
			 		methods.removeButton(settings.remove, settings.beforeRemove);
			 		if(!skipCallback) settings.add($newContainer);
	    		}
	    	}
			methods.clearButton(settings.clear);
	        globals.duplicatorContainer.append(globals.addButton);
        	methods.addButton(settings.add);
		},
		init : function(thisObj, options) {
			settings = $.extend(settings ,options);
			
			globals.uniqueClass = Math.floor((Math.random()*1000000)+1) + "-duplicate";
			globals.addButton = $("<button type='button' class='duplicatorAdd "+globals.uniqueClass+"-add'>"+settings.addButtonText+"</button>");
			globals.removeButton = '<a href="#" class="duplicatorRemove">'+settings.removeButtonText+'</a>';
			globals.clearButton = (settings.includeClear) ? '<a href="#" class="duplicatorClear">'+settings.clearButtonText+'</a>' : '';
	    	thisObj.addClass('base duplicator').append(globals.clearButton).wrap('<div class="duplicator-container" />');
	    	globals.initialContainer = thisObj;
	    	globals.duplicatorContainer = thisObj.closest('.duplicator-container');
			globals.baseContainer = thisObj.clone();
	    	if(settings.after) thisObj.append(settings.after);
		}
	};

	var globals = {
		uniqueClass: null,
		initialContainer: null,
		duplicatorContainer: null,
		baseContainer: null,
		clearButton: null,
		removeButton: null,
		addButton: null
	};

	var settings = {
			addButtonText: "Add",
			removeButtonText: "Remove",
			clearButtonText: "Clear",
			//dontRestructure: false,
			limit: 0,
			data: null,
			after: null,
			includeClear: true,
			add: function(item){},
			remove: function(){},
			beforeRemove: function(){ return true; },
			clear: function(){},
			refresh: function(){}
			
		};

	$.fn.duplicator = function(options) {
		
		methods.init(this, options);

    	//Populate fields with passed in data
    	methods.addRows(settings.data, true);


     	return globals.duplicatorContainer;
	};

	$.fn.duplicator.add = function(data, startWithBaseRow) {
		if(!globals.baseContainer) return this;
		startWithBaseRow = startWithBaseRow || false;
		methods.addRows(data, startWithBaseRow);
		return globals.duplicatorContainer;
	};

	$.fn.duplicator.refresh = function(data) {
		if(!globals.baseContainer) return this;
		$(".clone", globals.duplicatorContainer).remove();
		methods.addRows(data, true, true);
		return globals.duplicatorContainer;
	}

})( jQuery );