/*
*$().wallterfall({
	masonry:{
		
		itemSelector:'.masonry_brick',
		columnWidth:223,
		gutterWidth:15,
	},
	infinitescroll:{
		navSelector  	: "#more",
		nextSelector 	: "#more a",
		itemSelector 	: "body",
		destUrl:"http://localhost/dev/appserv/21epub/project/site20130101/template/works/test.php"
	}
	

})
*/
epub.def(function(){
	epub["import"]('epub.modules.tmpl@1.0')
	epub["import"]('epub.modules.masonry@1.0')
	epub["import"]('epub.modules.infinitescroll@1.0')
	epub["import"]('epub.modules.lazyload@1.0')
	epub["import"]('epub.modules.page@1.0')
	var url = "";
	function getURL(page,screen){
		var ret  = url+"?page="+page+"&screen="+screen;
		
		return ret;
		//return '../../../data/'+page+'-'+screen+'.json';
	}
	var totalPages = 1;
	function initPage($el){
		return;
		if($("#pagination")[0].style.display=='none'){
			var el = $el[0];

			for(var i=2;i<=totalPages;i++){
				//var temp = el.cloneNode(false);  
				//temp.setAttribute('id',"_wallterfall_"+i)$('<p>Test</p>').insertAfter('.inner');
				//temp.setAttribute('style',"display:none;");
				$('<div class="item_list infinite_scroll" id="_wallterfall_'+i+'"></div>').insertAfter($(el));
				//el.parentNode.appendChild(temp);
			}
			el.setAttribute('id',"_wallterfall_"+1);
			
    		$('#pagination').page({
				totalPages:totalPages,
				goto:function(no){
					scrollTo(0,0);
					$(el).parent().find('.infinite_scroll').hide();
					$('#_wallterfall_'+no).show();
					$('#_wallterfall_'+no).wallterfall({page:no});
				}
			});
			$("#pagination").show();
    	}
	}
	$.wallterfall = function (el,options){
		this._setoptions(el,options);
	}
	$.wallterfall.prototype = {
		_setoptions:function(el,options){
			this.$el = $(el);
			this.options = $.extend(true,$.wallterfall.defaults,options||{});
			
			url = this.options.infinitescroll.destUrl;
			this._render();
		},
		_render:function(){
			this.totalScreens = 10;
			this.currentScreen = 1;
			this._delegateEvents();
			this._init();
		},
		_delegateEvents:function(){
			var self = this;
			this.$el.masonry({ 
				itemSelector: this.options.masonry.itemSelector||'.masonry_brick',
				columnWidth:this.options.masonry.columnWidth||223,
				gutterWidth:this.options.masonry.gutterWidth||15								
			});	
			this.$el.infinitescroll({
				navSelector  	: this.options.infinitescroll.navSelector||"#more",
				nextSelector 	: this.options.infinitescroll.nextSelector||"#more a",
				itemSelector 	: this.options.infinitescroll.itemSelector||"body",
				loading:{
					img: "../img/loading.gif",
					msgText: ' ',
					finishedMsg: '木有了',
					finished: function(){
						console.log('finished',self.currentScreen,self.totalScreens)
						if(self.currentScreen>=self.totalScreens){ //到第10页结束事件
							self.$el.find("#infscr-loading").hide();

							$(window).unbind('.infscr');
							console.log('finished end')
							initPage(self.$el);
							//$("#more").remove();
							
						}
					}		
				},
				errorCallback	:function(){ 
					console.log('errorCallback')
					self.$el.find("#infscr-loading").hide();
					$(window).unbind('.infscr');
					initPage(self.$el)
					
				},
				debug:false,
				appendCallback	:true,
				dataType	 	: 'json',
				path: function(index) {
					 console.log("path",index)
					self.currentScreen = index;

					return getURL(self.options.page,self.currentScreen);//self.options.infinitescroll.destUrl+"?page="+self.options.page+"&screen="+self.currentScreen;
				},
				template:function(data){
					 console.log("template")
					 console.log(data)
					  var data = data;
					  var template = [
					   '{{each(i, name) results}}',
					   '<div class="item masonry_brick ">',
				
					   '     <div class="cover"> <a href="javascript:void(0);"><img src="/xdad/html/site/public/paper.jpg" alt="${description}" data-original="${thumbnail}" style="height:${height}px;width:221px;"/></a>',
					   '     </div>',
					   '     <div class="title"><span>${title}</span></div>',
					   '     <div class="action">',
					   '     	<div class="like"> <a href="javascript:void(0);">喜欢</a> <em class="count">${likes}</em> </div>',
					   '     	<div class="comment"><a href="javascript:void(0);">评论</a><em class="bold">(${comments})</em></div>',
					   '   	 </div>',
					   ' </div> ',
					   '{{/each}}'
					   ].join('');
					   console.log($.tmpl(template,data))
					return $.tmpl(template,data)
				}
			}
			,function(newElements){
				console.log('callback')
				var $newElems = $(newElements);

				self.$el.masonry('appended', $newElems, false);
				//$newElems.fadeIn();
				$newElems.find("img").lazyload({
					effect       : "fadeIn",
	             	failurelimit : 0,
	             	auto:true
				});
				var tmplItem = $newElems.tmplItem();
				var data = tmplItem.data.results;
				var nodes = tmplItem.nodes;
				for (var i = nodes.length - 1; i >= 0; i--) {
					var node = nodes[i];
					$(node).data('infinite_scroll_data',data[i])
				};
				//item_callback();
				return;
			});
			
		},
		_init:function(){

			var self = this;
			var instance = this.$el.data('infinitescroll'),
           		condition,
				opts = instance.options,
				box = $(opts.contentSelector).is('table') ? $('<tbody/>') : $('<div/>');
		    $(opts.navSelector).hide();
		    console.log(opts)
            opts.loading.msg
	            .appendTo(opts.loading.selector)
	            .show(opts.loading.speed,function(){
	            	beginAjax();
	            });
	            
	        function beginAjax(){
	        	console.log("beginAjax")
	        	$.ajax({
	                dataType: 'json',
	                type: 'GET',
	                url: getURL(self.options.page,self.currentScreen),//self.options.infinitescroll.destUrl+"?page="+self.options.page+"&screen="+self.currentScreen,
	                success: function (data, textStatus, jqXHR) {
	                    var data = data.data;
	                    condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
	                    console.log("beginAjax end")
	                    if (opts.appendCallback) {
	                        // if appendCallback is true, you must defined template in options.
	                        // note that data passed into _loadcallback is already an html (after processed in opts.template(data)).
	                        if (opts.template !== undefined) {

	                            var theData = opts.template(data);
	                           	console.log(box)
	                            box.append(theData);
	                            if (condition) {
	                            	self.totalScreens = data.totalScreens||1;
	                            	if($("#pagination")[0].style.display=='none'){
	                            		totalPages = data.numspage;
	                            		
	                            	}
	                            	instance._loadcallback(box, theData);
	                            } else {
	                                instance._error('end');
	                            }
	                            console.log("self.totalScreens",self.totalScreens)
	                        } else {
	                            instance._debug("template must be defined.");
	                            instance._error('end');
	                        }
	                    } else {
	                         
	                        // if appendCallback is false, we will pass in the JSON object. you should handle it yourself in your callback.
	                        if (condition) {
	                            instance._loadcallback(box, data, desturl);
	                        } else {
	                            instance._error('end');
	                        }
	                    }
	                },
	                error: function() {
	                    instance._debug("JSON ajax request failed.");
	                    instance._error('end');
	                }
	            });
	        }
		}
	}
	$.wallterfall.defaults = {
		page:1,
		masonry:{
			itemSelector:'.masonry_brick',
			columnWidth:223,
			gutterWidth:15,
		},
		infinitescroll:{
			navSelector  	: "#more",
			nextSelector 	: "#more a",
			itemSelector 	: "body",
			destUrl:"../../../data/test.php"
		}
	}
	$.fn.wallterfall = function (opt){
		var instance = this.data('wallterfall');
		if(instance){
			return instance;
		}else {
			instance = new $.wallterfall(this,opt||{});
			this.data('wallterfall',instance);
			return instance;
		}
	}
})
	
	