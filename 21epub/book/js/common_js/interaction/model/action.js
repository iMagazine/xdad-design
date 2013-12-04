var ActionDetailTemplate=require("text!template/actionitemdetail.js");
(function(interaction){
	interaction.model.Action=interaction.model.Base.extend({
		defaults:{
			iType:'101',//define type
			iDetail:null,
			//iAction:{},
			overlay_id:null,
		},
		initialize: function(){
			if(!this.id){//if isnew
				this.set("id",this.get('iType')+"_"+this.cid+(new Date()).getTime());
				this.setcollection();
				this.setmodel();
			}
			else {
				this.setmodel();
			}
		},
		setmodel:function(){
			if(!interaction.elementlist.get(this.get('overlay_id'))){
				this.destroy();
				return;
			}
			if(!this.get('iDetail')||!this.get('iDetail').results){
				var iDetail={};
				iDetail.results=[{iAction:0,values:[]}];
				this.set('iDetail',iDetail);
			}
			if(!interaction.iActionList.get(this.id)) interaction.iActionList.add(this);
			this.setlist();
			this.setview();
			this.setsyncmodel();
		},
		setlist:function(){},
		setresourcesmodel:function(){ 
		},
		validate:function(attributes){
		//	console.info(attributes);
		},
		setsyncmodel:function(){
			this.elementmodel=interaction.elementlist.get(this.get('overlay_id'));
		},
		setcollection:function(){},
		setview:function(){
			this.iview=new interaction.view.Action({model:this});
		},
		url:function(){
		}, //default set to root 
		sync: function(method, model, options) {
		}
	});
	interaction.collection.Action=interaction.collection.Base.extend({
		setonremove:function(){
			var collection=this;
		},
		setonadd:function(){
			var collection=this;
		},
		confirm:function(){
			interaction.iActionForSave.save();
		}
	});
	interaction.view.Action = interaction.view.Base.extend({
		events:{
			'click div.btn-draged':'focus',
			'click a.action-edit':'focus',
			'click a.action-del':'remove',
			'mouseover .wraparea':'mouseover',
			'mouseout .wraparea':'mouseout',
			'click a.action-confirm':'unfocus',
			'click a.action-play':'preview',
		},
		bindhover:function(){
			var view=this;
			this.$el.find('ul.detailitems').children('li').each(function(){
				$(this).on('mouseover',function(){
					var detail=view.getdetail();
					actiontype=detail.results[0].iAction;
					if(actiontype==0){
						var overlayid=interaction.iAnimationGroupList.get($(this).attr('id')).toJSON().overlay_id;
						var overlay=interaction.elementlist.get(overlayid);
					}
					else var overlay=interaction.elementlist.get($(this).attr('id'));
					overlay.iview.highlight();
				})
				$(this).on('mouseout',function(){
					var detail=view.getdetail();
					actiontype=detail.results[0].iAction;
					if(actiontype==0){
						var overlayid=interaction.iAnimationGroupList.get($(this).attr('id')).toJSON().overlay_id;
						var overlay=interaction.elementlist.get(overlayid);
					}
					else var overlay=interaction.elementlist.get($(this).attr('id'));
					overlay.iview.cancelhighlight();
				})
			})
		},
		bindinfo:function(){
			var view=this;
			this.$el.find('.actiondetail').find('input,select,textarea').bind('change',function(){
				var iAction_data=interaction.serializeValueSimple(view.$el.find('.actiondetail'));
				//view.model.set('iTiming',iTiming_data);		
				var iDetail=view.getdetail();
				iDetail.results=[];
				iAction_data.values=[];
				iDetail.results.push(iAction_data);
				interaction.iActionList.get(view.model.id).set('iDetail',iDetail);
				var detailel=_.template(ActionDetailTemplate,view.model.toJSON());
				view.$el.find('fieldset.actionitem').replaceWith(detailel);
				view.bindinfo();
				view.bindhover();
			})
			this.$el.find('.detailitems').find('input,select,textarea').bind('change',function(){
				var iDetail_data=interaction.serializeValueSimple(view.$el.find('.detailitems'));
				var iDetail=view.getdetail();
				if(!iDetail.results){
					iDetail.results=[{iAction:0,values:[]}];
				}
				iDetail.results[0].values=iDetail_data.values;
				interaction.iActionList.get(view.model.id).set('iDetail',iDetail);
			})
		},
		destroy:function(){
			var view=this;
			//var elementdetail=this.model.elementmodel.iview.getdetail();
			//elementdetail.Actions=_.reject(elementdetail.Actions,function(i){return i.id==view.model.id});
			//this.model.elementmodel.set('iDetail',elementdetail);
			//this.model.elementmodel.iview.updateActiongroup('remove',this.model.id);
			this.$el.remove();
		},
		remove:function(){
			var view=this;
			interaction.confirmDelete(function(){
				if(view.focused) view.close();
				interaction.iActionList.get(view.model.id).destroy();
			})
		},
		render:function(){
			this.actionel=$('#info_action').children('.setting-body').find('.actions');
			this.elementactionel=$('#info_attributes').find('fieldset.action');
			var Model_JSON=this.model.toJSON();
			//div_createaddDiv(this.model.id,this.model.get('iType'));
			var el=interaction.template.ActionItem(Model_JSON);
			this.actionel.children('ul').append(el);
			if(interaction.current&&interaction.current.id==this.model.get('overlay_id')) {
				this.elementactionview=new interaction.view.ActionItem({model:this.model});
			}
			this.setElement(this.actionel.find('li[id="'+this.model.id+'"]'));
			this.elementel=interaction.div_find(this.model.get('overlay_id'));
	    	return this;
		},
		mouseover:function(){
			this.model.elementmodel.iview.highlight();
		},
		mouseout:function(){
			this.model.elementmodel.iview.cancelhighlight();
		},
		change:function(){
			
		},
		focus:function(){
			var view=this;
			if(interaction.action.current&&interaction.action.current.id!=this.model.id){
				interaction.action.current.iview.unfocus();
			}
			if(!this.focused) {
				this.focused=true;
				this.$el.addClass('edit');
				interaction.action.current=this.model;
				var Model_JSON=this.model.toJSON();
				var detailel=_.template(ActionDetailTemplate,Model_JSON);
				this.$el.append(detailel);
				//interaction.Action.set(this.model.id,this.model.get('overlay_id'),this.model.get('iType'));
				this.bindinfo();
				this.bindhover();
			}
			else{
				this.$el.find('fieldset.actionitem').remove();
				var detail=this.getdetail();
				//interaction.Action.save(this.model.id,this.model.get('overlay_id'),this.model.get('iType'));
				interaction.action.current=null;
				this.focused=false;
				this.$el.removeClass('edit');
			}
		},
		unfocus:function(){
			//interaction.action.save(this.model.id,this.model.get('overlay_id'),this.model.get('iType'))
			interaction.iActionList.confirm();
			//interaction.Action.close(this.model.id,this.model.get('overlay_id'),this.model.get('iType'));
			this.$el.find('fieldset.actionitem').remove();
			var detail=this.getdetail();
			interaction.action.current=null;
			this.focused=false;
			this.$el.removeClass('edit');
		},
		close:function(){
			this.$el.find('fieldset.actionitem').remove();
			//interaction.Action.save(this.model.id,this.model.get('overlay_id'),this.model.get('iType'));
			interaction.action.current=null;
			this.focused=false;			
		},
		preview:function(){
			interaction_view.SinglePreview=true;
			var view=this;
			interaction.animation.preview();
			interaction_view.iAnimationlist.afterTimeLineCreated=function(){
				//var labeltime=interaction_view.iActionList.timeline.getLabelTime(view.model.id+'_start');
				//console.info(labeltime);
				//if(labeltime!=0) labeltime-=0.01;
				//interaction_view.iActionList.timeline.seek(labeltime,false);
			}
		}
	})
	interaction.view.ActionItem=interaction.view.Action.extend({
		render:function(){
			this.actionel=$('#info_action').children('.setting-body').find('.actions');
			this.elementactionel=$('#info_attributes').find('fieldset.actions');
			var Model_JSON=this.model.toJSON();
			//div_createaddDiv(this.model.id,this.model.get('iType'));
			var el=interaction.template.ActionItem(Model_JSON);
			this.elementactionel.children('ul').append(el);
			this.setElement(this.elementactionel.find('li[id="'+this.model.id+'"]'));
			this.elementel=interaction.div_find(this.model.get('overlay_id'));
	    	return this;
		},		
	})
	interaction.model.ActionForSave=Backbone.Model.extend({
		initialize:function(){
			this.set('id','Actions');
		},
		sync: function(method, model, options) {
			var Model_JSON=interaction.iActionList.toJSON();
			this.attributes=Model_JSON;
			if(method=='create'){
				return;
			}
			if(method=='update'){
				options.url=context_url+interaction.currentpage.id+'/setactions';
			}
			if(method=='delete'){
				return;
			}
			if(method=='read'){
				options.url=context_url+interaction.currentpage.id+'/getactions';
			}
			Backbone.emulateHTTP = true ;
			Backbone.emulateJSON = true ;
			Backbone.sync(method, model, options);
		}
	})
	interaction.iActionList=new interaction.collection.Action();
	interaction.iActionList.on('remove',function(){
		interaction.iActionList.confirm();
	})
	interaction.iActionForSave=new interaction.model.ActionForSave({id:'Actions'});
})(interaction);