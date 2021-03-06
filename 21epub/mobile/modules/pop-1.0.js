/*
*var ins = $(xxx).pop()
* ins.show({
	direction:horizontal||vertical
	thumb:[
		'../public/thumb_01.jpg',
		'../public/thumb_02.jpg',
		'../public/thumb_03.jpg'
	],
	cover:[
		'../public/cover2.jpg'
	],
	dt:'2012年现代设计重点项目',
	dd:[
		'建筑地点：上海浦东陆家嘴金融贸易开发区的中心区',
		'总建筑面积（m<sup>2</sup>）：289500',
		'建筑高度（m）：420.5',
		'合作设计单位：芝加哥SOM公司'
	]

})
*/
epub.def(function(){
	epub["import"]('epub.modules.tmpl@1.0')
	$.fn.autoMiddle = function(){
		return this.each(function(){
			$(this).css("position","absolute");
			$(this).css({
	              "left": ($(this).parent('.slideshow .foto').width() - $(this).outerWidth())/2,
	              "top": ($(this).parent('.slideshow .foto').height() - $(this).outerHeight())/2
	     	});
		});
	}
	$(function(){
		
		$.pop = function (el,options){
			this._setoptions(el,options);
		}
		$.pop.prototype = {
			_setoptions:function(el,options){
				this.$el = $(el);
				this.options = $.extend(true,$.pop.defaults,options||{});
				
				this._render();
			},
			_render:function(){
				this.$pop = $('<div class="lightbox" id="_pop_"></div>');
				this.$pop.appendTo($('body'));
				this.$pop.html(this.options.templates.pop);
				this.$pop.appendTo($('body'));
				this.$foto = this.$pop.find('.foto');
				this.$dl = this.$pop.find('dl');
				this.$ul = this.$pop.find('ul');
				this.$close = this.$pop.find('.close').find('a');
				this.$overlay = this.$pop.find('.overlay');
				this.$prev = this.$pop.find('.prev');
				this.$next = this.$pop.find('.next');

				this._delegateEvents();
			},
			_destory:function(){
				this.$pop.remove();
				this.data('pop',null)
			},
			show:function(opt){
				if(opt.foto.length<1)return;
				this.$foto.html('');
				$.tmpl(this.options.templates.foto,{
					covers:opt.foto
				}).appendTo(this.$foto);
				this.$dl.html('');

				$.tmpl(this.options.templates.dl,{
					dt:opt.dt,
					dd:opt.dd
				}).appendTo(this.$dl);
				this.$ul.html('');
				$.tmpl(this.options.templates.ul,{
					thumbs:opt.ul
				}).appendTo(this.$ul);
				if(opt.direction=='horizontal'){
					this.$pop.removeClass('vertical').addClass('horizontal')
				}else if(opt.direction=='vertical'){
					this.$pop.removeClass('horizontal').addClass('vertical')
				}
				this.$pop.fadeIn();
				this.$foto.find('img').autoMiddle();
				this.$foto_imgs = this.$foto.find('img');
				this.$ul_imgs = this.$ul.find('img');
				this.total = this.$foto_imgs.length-1;
				this.index = 0;
				//this.$pop.show();
			},
			hide:function (){
				//this.$pop.hide();
				this.$pop.fadeOut();
			},
			_delegateEvents:function(){
				var self = this;
				this.$close.click(function(){
					self.hide();
				})
				this.$overlay.click(function(){
					self.hide();
				})
				this.$foto.click(function(){

				})
				this.$ul.click(function(event){
					var el = event.target;
			        switch(el.nodeName.toLowerCase()){
			            case "img" :
			            	var temp = null;
			            	for (var i = self.$ul_imgs.length - 1; i >= 0; i--) {
			            		var img = self.$ul_imgs[i];
			            		if(img == el){
			            			temp = i
			            			break;
			            		}
			            	};
			            	foto_show(temp);
							ul_show(temp)
							self.index = temp;
			            break;
			           
			            case "p" :
			                //do somethings
			            break;
			           
			            default:
			                //do somethings
			        }
				})
				this.$prev.click(function(event){
					var temp = self.index-1;
					if(temp<0)temp = self.total;
					foto_show(temp);
					ul_show(temp)
					self.index = temp;
				})
				this.$next.click(function(){
					var temp = self.index+1;
					if(temp>self.total)temp = 0;
					foto_show(temp);
					ul_show(temp)
					self.index = temp;
				})
				function foto_show(temp){
					if(temp == self.index)return;
					$(self.$foto_imgs[self.index]).fadeOut();
						$(self.$foto_imgs[temp]).fadeIn();
						
				}	
				function ul_show(temp){
					if(temp == self.index)return;
					$(self.$ul_imgs[self.index]).parent().removeClass('active');
					$(self.$ul_imgs[temp]).parent().addClass('active');
					
				}
			}



		}
		$.pop.defaults = {
			templates:{
				foto:[
					'		 {{each covers}}	',
					'			{{if !$index}}',
					'      		<img src="${$value}" alt="">',
					'			{{else}}	',
					'      		<img src="${$value}" alt="" style="display:none;">',
					'			{{/if}}',
					'		 {{/each}}'
				].join(''),
				dl:[
					'        <dt>${dt}</dt>',
					'		 {{each dd}}	',
					'        <dd>${$value}</dd>',
					'		 {{/each}}'			
				].join(''),
				ul:[
					'		 {{each thumbs}}	',
					'			{{if !$index}}',
					'           <li><a href="javascript:void(0);" class="active"><img src="${$value}" alt=""></a></li>',
					'			{{else}}	',
					'        	<li><a href="javascript:void(0);"><img src="${$value}" alt=""></a></li>',
					'			{{/if}}',
					'		 {{/each}}'
				].join(''),
				pop:[
					'  <div class="lightbox-container">',
					'    <div class="close"><a href="javascript:void(0);">CLOSE [X]</a></div>',
					'    <div class="loading">Loading...</div>',
					'    <div class="slideshow">',
					'	 	<div class="foto"></div>',
					'		<dl></dl>',
					'		<ul></ul>',
					'       <div class="prev"><a href="javascript:void(0);">prev</a></div>',
					'       <div class="next"><a href="javascript:void(0);">next</a></div>',
					'    </div>',
					'  </div>',
					'  <div class="overlay"></div>',
					'</div>'
				].join('')

			}
		}
		$.fn.pop = function (opt){
			var instance = this.data('pop');
			if(instance){
				return instance;
			}else {
				this.data('pop',instance = new $.pop(this,opt));
				return instance;
			}
		}	
	})
	
})
