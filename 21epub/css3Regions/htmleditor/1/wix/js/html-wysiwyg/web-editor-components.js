W.Components.newComponent({name:"wysiwyg.editor.components.AddComponentToolbar",skinParts:{tabs:{type:"wysiwyg.editor.components.Tabs",dataQuery:"#ADD_COMPONENT_TABS"}},Class:{Extends:"wysiwyg.editor.components.Toolbar"}});
W.Components.newComponent({name:"wysiwyg.editor.components.ChooseStyleButton",skinParts:{icon:{type:"htmlElement",optional:"true"},label:{type:"htmlElement"},editStyle:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.WButton",_states:["up","over","selected","pressed"],Binds:["_openCustomizeStylePanel"],initialize:function(c,b,a){this.parent(c,b,a)
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.editStyle.addEvent("click",this._openCustomizeStylePanel);
this._skinParts.editStyle.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","STYLE_CHANGE_BUTTON"))
},_openCustomizeStylePanel:function(a){a.stopPropagation();
var b=this.injects().Utils.getPositionRelativeToWindow(this._skinParts.view);
this.fireEvent("propagateEvent",{type:"editStyleClicked",params:{left:b.x,top:b.y}})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.ColorSetSelector",skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",initialize:function(c,a,b){var d=this.initialize;
if(d._instance){d._instance.dispose()
}d._instance=this;
this.parent(c,a,b)
},dispose:function(){var a=this.initialize;
if(a._instance==this){a._instance=null
}this.parent()
},getItemClassName:function(){return"mobile.core.components.Button"
},_renderItems:function(a){this.parent(a,true)
},_onItemReady:function(c,b,a){c.setParameters({label:a.label,iconSrc:this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")+"icons/"+a.icon});
c.setCommand(this._command,a.id)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.ComponentEditBox",imports:["mobile.core.components.Page"],skinParts:{topLeft:{type:"htmlElement"},left:{type:"htmlElement"},bottomLeft:{type:"htmlElement"},bottom:{type:"htmlElement"},pushKnob:{type:"htmlElement"},bottomRight:{type:"htmlElement"},right:{type:"htmlElement"},topRight:{type:"htmlElement"},top:{type:"htmlElement"},minHeightMark:{type:"htmlElement"},deleteButton:{type:"htmlElement"},duplicateButton:{type:"htmlElement"},moveForwardButton:{type:"htmlElement"},moveBackButton:{type:"htmlElement"},anchorGuides:{type:"htmlElement"},controls:{type:"htmlElement"},topKnob:{type:"htmlElement"},topRightKnob:{type:"htmlElement"},rightKnob:{type:"htmlElement"},bottomRightKnob:{type:"htmlElement"},bottomKnob:{type:"htmlElement"},bottomLeftKnob:{type:"htmlElement"},leftKnob:{type:"htmlElement"},topLeftKnob:{type:"htmlElement"},dragHandle:{type:"htmlElement"},multiSelectLayer:{type:"htmlElement"},richTextEditor:{type:"wysiwyg.editor.components.richtext.WRichTextEditor"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["normalEdit","inPlaceEdit","differentScopeEdit","nonDragEdit"],Binds:["_mouseDownHandler","_mouseDownDragHandler","_mouseUpHandler","_topResizeHandler","_bottomPushResizeHandler","_bottomResizeHandler","_rightResizeHandler","_leftResizeHandler","_topRightResizeHandler","_topLeftResizeHandler","_bottomRightResizeHandler","_bottomLeftResizeHandler","_rightResizeLogic","_leftResizeLogic","_topResizeLogic","_bottomResizeLogic","fitToComp","_deleteButtonClickHandler","_onScreenResize","_doubleClickHandler","_editRichText","stopEditRichText","_dragVerticalyHandler","_moveForwardHandler","_moveBackHandler","showAnchorsHandler","_updateRichTextDataAndSize","_onEditorReady","_onCompAutoSized","_positionResizeAnchors"],initialize:function(c,a,b){this.parent(c,a,b);
W.Classes.get("mobile.core.components.Container",function(f){this._containerBaseClass=f
}.bind(this));
this.setMaxH(this.imports.Page.MAX_HEIGHT+50);
this.setMaxW(5000);
this.setCommand("WEditorCommands.SetSelectedCompPositionSize");
this._siteBody=$$("body");
this._previewManager=this.injects().Preview;
var e=this.injects().Viewer;
e.addEvent(e.SCREEN_RESIZE_EVENT,this._onScreenResize);
this.injects().Commands.registerCommandAndListener(Constants.EditorUI.RESIZE_HANDLES_CHANGED,this,this._positionResizeAnchors);
this.injects().Commands.registerCommandAndListener(Constants.EditorUI.START_EDIT_RICH_TEXT,this,this._editRichText);
var d=this.injects().Editor;
d.addEvent(d.EDITOR_READY,this._onEditorReady)
},_onEditorReady:function(){this.injects().Preview.getPreviewManagers().Commands.registerCommandAndListener("WViewerCommands.ComponentZIndexChanged",this,this._zIndexChangedHandler)
},_onScreenResize:function(){this.fitToComp()
},_onAllSkinPartsReady:function(){this.collapse();
this._addToolTipToSkinPart(this._skinParts.duplicateButton,"Boundary_box_Duplicate_button_ttid");
this._addToolTipToSkinPart(this._skinParts.moveBackButton,"Boundary_box_Arrow_down_ttid");
this._addToolTipToSkinPart(this._skinParts.moveForwardButton,"Boundary_box_Arrow_up_ttid");
this._addToolTipToSkinPart(this._skinParts.deleteButton,"Boundary_box_Trash_can_ttid");
this._addToolTipToSkinPart(this._skinParts.dragHandle,"Boundary_box_drag_handle_ttid");
this._addToolTipToSkinPart(this._skinParts.pushKnob,"Boundary_box_push_knob_ttid")
},_getEditModeState:function(){return this.getState()
},_setEditModeState:function(a){this.setState(a)
},editComponent:function(d,a,c){W.UndoRedoManager._startTransaction(this._getCompScopeId());
if(this._getEditModeState()=="inPlaceEdit"){this.stopEditRichText()
}this._stopListeningToComp();
this._isInScope=true;
this._editedComponent=d;
this._showPotentialHGroups=false;
this._originalLocation=d.getPosition();
this._setEditModeState("normalEdit");
if(this.injects().Editor.getEditMode()=="MASTER_PAGE"){this.injects().Commands.executeCommand("Tooltip.ShowTip",{id:"part_of_master_page_ttid"},d)
}this.fitToComp(d);
this.uncollapse();
this._setDeleteButtonState();
this._setDuplicateButtonState();
this._zIndexChangedHandler(this._editedComponent);
this._positionResizeAnchors();
this._listenToUserEvents();
var b=this;
d.addEvent("autoSizeChange",this._onCompAutoSized);
if(a){this._mouseDownDragHandler(c,d.useLayoutOnDrag(),false)
}this.refreshMultiSelect()
},_positionResizeAnchors:function(){var a=this._editedComponent.getResizableSides();
this._topEnabled=a.contains(W.BaseComponent.ResizeSides.TOP);
this._bottomEnabled=a.contains(W.BaseComponent.ResizeSides.BOTTOM);
this._rightEnabled=a.contains(W.BaseComponent.ResizeSides.RIGHT);
this._leftEnabled=a.contains(W.BaseComponent.ResizeSides.LEFT);
this._setIsMasterPage();
this._view.set("topEnabled",this._topEnabled);
this._view.set("rightEnabled",this._rightEnabled);
this._view.set("bottomEnabled",this._bottomEnabled);
this._view.set("leftEnabled",this._leftEnabled);
this._view.set("topRightEnabled",this._topEnabled&&this._rightEnabled);
this._view.set("bottomRightEnabled",this._bottomEnabled&&this._rightEnabled);
this._view.set("bottomLeftEnabled",this._bottomEnabled&&this._leftEnabled);
this._view.set("topLeftEnabled",this._topEnabled&&this._leftEnabled);
this._showControllers()
},_setIsMasterPage:function(){var a=this.injects().Editor.getComponentScope(this._editedComponent);
this._view.set("isMasterPage",a=="MASTER_PAGE")
},_showControllers:function(){this._skinParts.controls.uncollapse();
this._skinParts.dragHandle.uncollapse();
this._skinParts.topLeftKnob.uncollapse();
this._skinParts.topRightKnob.uncollapse();
this._skinParts.bottomLeftKnob.uncollapse();
this._skinParts.bottomRightKnob.uncollapse();
this._skinParts.pushKnob.uncollapse();
if(!this._leftEnabled){this._skinParts.leftKnob.collapse();
this._skinParts.topLeftKnob.collapse();
this._skinParts.bottomLeftKnob.collapse()
}else{this._skinParts.leftKnob.uncollapse()
}if(!this._rightEnabled){this._skinParts.rightKnob.collapse();
this._skinParts.topRightKnob.collapse();
this._skinParts.bottomRightKnob.collapse()
}else{this._skinParts.rightKnob.uncollapse()
}if(!this._topEnabled){this._skinParts.topKnob.collapse();
this._skinParts.topLeftKnob.collapse();
this._skinParts.topRightKnob.collapse()
}else{this._skinParts.topKnob.uncollapse()
}if(!this._bottomEnabled){this._skinParts.pushKnob.collapse();
this._skinParts.bottomKnob.collapse();
this._skinParts.bottomLeftKnob.collapse();
this._skinParts.bottomRightKnob.collapse()
}else{this._skinParts.bottomKnob.uncollapse()
}},_hideControllers:function(){this._skinParts.controls.collapse();
this._skinParts.dragHandle.collapse();
this._skinParts.leftKnob.collapse();
this._skinParts.topLeftKnob.collapse();
this._skinParts.bottomLeftKnob.collapse();
this._skinParts.rightKnob.collapse();
this._skinParts.topRightKnob.collapse();
this._skinParts.bottomRightKnob.collapse();
this._skinParts.topKnob.collapse();
this._skinParts.topLeftKnob.collapse();
this._skinParts.topRightKnob.collapse();
this._skinParts.pushKnob.collapse();
this._skinParts.bottomKnob.collapse();
this._skinParts.bottomLeftKnob.collapse();
this._skinParts.bottomRightKnob.collapse()
},_onCompAutoSized:function(){this.fitToComp();
this.refreshMultiSelect()
},_isPositionChanged:function(a){a=a>=0?a:1;
var c=this._editedComponent.getPosition();
var b=this._originalLocation;
return Math.abs(b.x-c.x)>a||Math.abs(b.y-c.y)>a||Math.abs(b.width-c.width)>a||Math.abs(b.height-c.height)>a
},_setEditedComponentMinimumHeightToPhysicalHeight:function(){var a=this._editedComponent;
a.setHeight(a.getViewNode().getSize().y-a.getExtraPixels().bottom);
this._hideMinHeightMark()
},fitToComp:function(){if(this._editedComponent==null){return
}var a={};
a.y=this._editedComponent.getSelectableY();
a.x=this._editedComponent.getSelectableX();
var c=this._editedComponent.getViewNode().getParent().getPosition();
a.x+=c.x;
a.y+=c.y;
W.Preview.previewToEditorCoordinates(a);
var d=this._editedComponent.getSizeRefNode().y;
var b=this._editedComponent.getHeight()+this._editedComponent.getExtraPixels().height;
this.setX(a.x-5);
this.setY(a.y-5);
this.setWidth(this._editedComponent.getSelectableWidth()+10);
this.setHeight(d+10);
if(this._editedComponent.isResizable()&&b<d){this._showMinHeightMark(b)
}else{this._hideMinHeightMark()
}this._updateAnchorGuides()
},exitEditMode:function(){if(this._editedComponent!=null){if(this._getEditModeState()=="inPlaceEdit"){this.stopEditRichText()
}}this._stopListeningToComp();
this._stopListeningToUserEvents();
this.collapse();
this._editedComponent=null
},_stopListeningToComp:function(){if(this._editedComponent!=null){this._editedComponent.removeEvent("autoSizeChange",this._onCompAutoSized)
}},_showMinHeightMark:function(b){var a=this._editedComponent.getViewNode().getSize().y-b;
this._skinParts.minHeightMark.setStyle("bottom",a);
this._skinParts.minHeightMark.uncollapse()
},_hideMinHeightMark:function(){this._skinParts.minHeightMark.collapse()
},_listenToUserEvents:function(){this._stopListeningToUserEvents();
this._view.addEvent("mousedown",this._mouseDownHandler);
this._view.addEvent("dblclick",this._doubleClickHandler)
},_stopListeningToUserEvents:function(){this._view.removeEvent("mousedown",this._mouseDownHandler);
this._view.removeEvent("dblclick",this._doubleClickHandler)
},_enabledSides:function(a){return this._editedComponent.getResizableSides().contains(a)
},_actionsMap:{deleteButton:"_deleteButtonClickHandler",moveBackButton:"_moveBackHandler",moveForwardButton:"_moveForwardHandler",duplicateButton:"_duplicateHandler",leftKnob:"_leftResizeHandler",left:"_leftResizeHandler",rightKnob:"_rightResizeHandler",right:"_rightResizeHandler",bottomLeft:"_bottomLeftResizeHandler",bottomLeftKnob:"_bottomLeftResizeHandler",bottomRight:"_bottomRightResizeHandler",bottomRightKnob:"_bottomRightResizeHandler",dragHandle:"_dragVerticalyHandler",pushKnob:"_bottomPushResizeHandler",bottom:"_bottomResizeHandler",topLeft:"_topLeftResizeHandler",topLeftKnob:"_topLeftResizeHandler",topRight:"_topRightResizeHandler",topRightKnob:"_topRightResizeHandler",top:"_topResizeHandler",topKnob:"_topResizeHandler",bottomKnob:"_bottomResizeHandler"},_mouseDownHandler:function(d){W.UndoRedoManager._startTransaction(this._getCompScopeId());
d.stopPropagation();
if(this._actionsMap[d.target.get("skinPart")]){this[this._actionsMap[d.target.get("skinPart")]](d);
return
}var b,e;
if(d.control&&this._editedComponent){b=this._editedComponent.getViewNode().getParent();
e=false
}if(this._getEditModeState()=="inPlaceEdit"){var c=this._previewManager.getGlobalRefNodePositionInEditor(this._editedComponent,true);
if((d.client.y-c.y>this._skinParts.richTextEditor._skinParts.toolbar.offsetTop)||(c.x-d.client.x>this._skinParts.richTextEditor._skinParts.toolbar.offsetLeft)){return
}}var a=this.injects().Preview.componentFromGlobalCoordinates(d.client.x,d.client.y,this.injects().Preview.selectionFilter,b,e);
if(this._editedComponent.isMultiSelect){this._mouseDownDragHandler(d,false,true)
}else{if(a&&a!==this._editedComponent){this.injects().Editor.handleComponentClicked(a,d)
}else{if(this._isInScope){this._mouseDownDragHandler(d,this._editedComponent.useLayoutOnDrag(),true)
}}}},_setDeleteButtonState:function(){var a=this.injects().Editor.canDeleteSelectedComponent();
var b=this.injects().Commands.getCommand("WEditorCommands.WDeleteSelectedComponent");
b.setState(a);
this._skinParts.deleteButton.setAttribute("disabled",a?"false":"true")
},_setDuplicateButtonState:function(){this._skinParts.duplicateButton.setAttribute("disabled",this._editedComponent.isDuplicatable()?"false":"true")
},_deleteButtonClickHandler:function(a){this.injects().Commands.executeCommand("WEditorCommands.WDeleteSelectedComponent",{})
},_zIndexChangedHandler:function(b){if(b===this._editedComponent){if(this._editedComponent.isMultiSelect){this.moveForwardEnabled=false;
this.moveBackEnabled=false
}else{var a=this._editedComponent.getParentComponent();
this.moveForwardEnabled=a.canMoveForward(this._editedComponent);
this.moveBackEnabled=a.canMoveBack(this._editedComponent)
}var c=this.injects().Commands.getCommand("WEditorCommands.MoveForward");
c.setState(this.moveForwardEnabled);
c=this.injects().Commands.getCommand("WEditorCommands.MoveTop");
c.setState(this.moveForwardEnabled);
c=this.injects().Commands.getCommand("WEditorCommands.MoveBottom");
c.setState(this.moveBackEnabled);
c=this.injects().Commands.getCommand("WEditorCommands.MoveBack");
c.setState(this.moveBackEnabled);
this._skinParts.moveBackButton.setAttribute("disabled",this.moveBackEnabled?"false":"true");
this._skinParts.moveForwardButton.setAttribute("disabled",(this.moveForwardEnabled?"false":"true"))
}},_moveBackHandler:function(a){a.stopPropagation();
var b=this.injects().Commands.getCommand("WEditorCommands.MoveBack");
b.execute()
},_moveForwardHandler:function(){var a=this.injects().Commands.getCommand("WEditorCommands.MoveForward");
a.execute()
},showAnchorsHandler:function(a){this._showPotentialHGroups=!this._showPotentialHGroups;
this._updateAnchorGuides()
},_duplicateHandler:function(a){this.injects().Commands.executeCommand("EditCommands.Duplicate")
},_editRichText:function(){var b=this._editedComponent;
var d=this._skinParts.richTextEditor;
var a=this._previewManager.previewToEditorCoordinates(b.getGlobalPositionRefNode());
var c=this._view.getPosition();
a.x-=c.x;
a.y-=c.y;
d.setPositioning(a,b.getWidth(),b.getPhysicalHeight());
d.setWidth(b.getWidth());
d.setMinHeight(b.getMinPhysicalHeight()+b.getExtraPixels().height);
d.setHeight(b.getPhysicalHeight());
b.getRichTextContainer().setStyle("visibility","hidden");
this._setEditModeState("inPlaceEdit");
d.createEditor(b.getDataItem());
d.getDataItem().addEvent(Constants.DataEvents.DATA_CHANGED,this._updateRichTextDataAndSize);
this.injects().Commands.executeCommand(Constants.EditorUI.CLOSE_ALL_PANELS)
},stopEditRichText:function(){if(this._editedComponent&&this._editedComponent.isEditableInPlace()){this._skinParts.richTextEditor.destroy();
var a=this._editedComponent.getRichTextContainer();
if(a){a.setStyle("visibility","visible")
}this._setEditModeState("normalEdit");
if(this._skinParts.richTextEditor&&this._skinParts.richTextEditor.getDataItem()&&this._editedComponent.getDataItem()){this._updateRichTextDataAndSize()
}this._isInScope=true
}},_updateRichTextDataAndSize:function(){this._editedComponent.getDataItem().set("text",this._skinParts.richTextEditor.getDataItem().get("text"));
this._editedComponent.setHeight(this._skinParts.richTextEditor.getOriginalHeight());
this._editedComponent.getDataItem().setMeta("isPreset",false);
this._editedComponent.fireEvent("autoSized",{ignoreLayout:false})
},_dragVerticalyHandler:function(a){this._mouseDownDragHandler(a,true,false)
},_doubleClickHandler:function(b){var a=this._previewManager.componentFromGlobalCoordinates(b.client.x,b.client.y,W.Preview.selectionFilter);
if(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.BOTTOM)){return
}if(a!==this._editedComponent){return
}if(a.isEditableInPlace()){this._editRichText()
}}},_saveMouseDownInitState:function(a){this._mouseStartPoint={x:a.client.x,y:a.client.y};
this._compStartPoint={x:this._editedComponent.getX(),y:this._editedComponent.getY()};
this._originalContainer=this._editedComponent.getParentComponent();
this._dragThresholdReached=false
},_toggleGridScaleIfControlPressed:function(c){var b=this.injects().Editor.getGridScale();
var a=c.control;
if(a){b=(b==1)?Constants.WEditManager.DEFAULT_GRID_SCALE:1
}return b
},_mouseDownDragHandler:function(c,d,b){if(!c||c.rightClick||!this._isInScope){return
}this._saveMouseDownInitState(c);
this._editedComponent.saveCurrentCoordinates();
this._hideControllers();
if(!d){this._containersGeometry=this.getContainersGeometry(this.injects().Editor.getEditingScope())
}if(d){var e=this._editedComponent.getMinDragY()
}var g=$$("body");
var i=false;
var h=function(o){var m=this._toggleGridScaleIfControlPressed(o);
this._clearAnchorGuides();
var k=o.client.x;
var q=o.client.y;
var l=k-this._mouseStartPoint.x;
var j=q-this._mouseStartPoint.y;
this._dragThresholdReached=this._dragThresholdReached||Math.abs(l)>5||Math.abs(j)>5;
if(!this._dragThresholdReached){return
}if(d){var p=Math.max(this.roundToGrid(this._compStartPoint.y+j,m),e);
this.executeCommand({y:p,enforceAnchors:true})
}else{this.executeCommand({x:this.roundToGrid(this._compStartPoint.x+l,m),y:this.roundToGrid(this._compStartPoint.y+j,m)});
this._handlePossibleContainerDragOver(k,q)
}var n=W.Preview.getPreviewManagers().Viewer.getPageGroup();
n.refreshGrid();
this.fireEvent("componentEditBoxMoved")
}.bind(this);
var a=function(j){this._showControllers();
if(!d&&this._dragThresholdReached){this._handlePossibleDropInsideContainer()
}var k=this.injects();
g.removeEvent(Constants.CoreEvents.MOUSE_MOVE,h);
g.removeEvent(Constants.CoreEvents.MOUSE_UP,a);
window.removeEvent(Constants.CoreEvents.BLUR,f);
if(!this._editedComponent){return
}this.injects().Editor.highlightContainer();
if(this._editedComponent.getX()!=this._compStartPoint.x||this._editedComponent.getY()!=this._compStartPoint.y){this.injects().Layout.reportMove(this._getAllSelectedComponents())
}this._updateAnchorGuides();
this.injects().Editor.onComponentChanged(true);
this._mouseUpHandler(j,b);
W.UndoRedoManager._endTransaction(this._getCompScopeId())
}.bind(this);
var f=function(){window.removeEvent(Constants.CoreEvents.BLUR,f);
g.removeEvent(Constants.CoreEvents.MOUSE_MOVE,h);
g.removeEvent(Constants.CoreEvents.MOUSE_UP,a)
};
g.addEvent(Constants.CoreEvents.MOUSE_MOVE,h);
g.addEvent(Constants.CoreEvents.MOUSE_UP,a);
window.addEvent(Constants.CoreEvents.BLUR,f);
this._mouseDownDragHandlerExtra(c,d,b)
},_mouseDownDragHandlerExtra:function(c,b,a){},roundToGrid:function(a,c){var b=c?c:this.injects().Editor.getGridScale();
return a-(a%b)
},_mouseUpHandler:function(c,a){var d=c.control||c.event.metaKey;
if(a&&d&&this._editedComponent.getX()==this._compStartPoint.x&&this._editedComponent.getY()==this._compStartPoint.y){var b=this.injects().Preview.componentFromGlobalCoordinates(c.client.x,c.client.y,W.Preview.selectionFilter);
this.injects().Editor.handleComponentClicked(b,c)
}if(this._dragThresholdReached===false){this.injects().Editor.openComponentPropertyPanel(this._editedComponent)
}},_clearAnchorGuides:function(){this._skinParts.anchorGuides.empty()
},_updateAnchorGuides:function(){var h=2;
var d=20;
var c=40;
var b=20;
this._clearAnchorGuides();
if(!this._isInScope){return
}var g=this.injects().Layout.getOptionalBottomLocks(this._editedComponent);
var f=this._editedComponent.getPhysicalHeight();
var e=20;
var a=0;
g.forEach(function(q){if(q.locked==false&&!this._showPotentialHGroups){return
}a++;
e+=10;
var y=q.target;
var w=this.injects().Preview.getNodeGlobalPosition(y.getViewNode());
var s=w.y+y.getPhysicalHeight()-this.getY();
var i=w.x+y.getWidth()/2-this.getX();
var n=Math.max(f,s)+30+20*a;
var t=Math.min(i,e);
var x=Math.max(i,e);
var u=q.locked?"connectedAnchor":"suggestedAnchor";
var r=q.locked?"connectedAnchorLock":"suggestedAnchorLock";
var B,F;
if(t==e){B=u+"Left";
F=u+"Right"
}else{B=u+"Right";
F=u+"Left"
}var m=new Element("div",{"class":B});
m.setStyles({position:"absolute",left:e,top:f+10,height:n-f-10,width:h});
this._skinParts.anchorGuides.adopt(m);
var C=new Element("div",{"class":u+"Bottom"});
C.setStyles({position:"absolute",left:t-1,top:n,height:h,width:x-t+2});
this._skinParts.anchorGuides.adopt(C);
var p=new Element("div",{"class":F});
p.setStyles({position:"absolute",left:i-2,top:s+d,height:n-s-d,width:h});
this._skinParts.anchorGuides.adopt(p);
var o=5;
var l=w.y-this.getY()-o;
var A=w.x-this.getX()-o;
var k=l+y.getPhysicalHeight()+o*2;
var z=A+y.getWidth()+o*2;
var v=new Element("div",{"class":u+"Left"});
v.setStyles({position:"absolute",left:A,top:l,height:k-l,width:h});
this._skinParts.anchorGuides.adopt(v);
var E=new Element("div",{"class":u+"Top"});
E.setStyles({position:"absolute",left:A,top:l,height:h,width:z-A});
this._skinParts.anchorGuides.adopt(E);
var j=new Element("div",{"class":u+"Right"});
j.setStyles({position:"absolute",left:z,top:l,height:k-l,width:h});
this._skinParts.anchorGuides.adopt(j);
var G=new Element("div",{"class":u+"Bottom"});
G.setStyles({position:"absolute",left:A,top:k,height:h,width:z-A});
this._skinParts.anchorGuides.adopt(G);
var D=new Element("div",{"class":r});
D.setStyles({position:"absolute",left:(i-b),top:s,height:d,width:d*2});
this._skinParts.anchorGuides.adopt(D);
D.addEvent("mousedown",function(H){this.injects().Layout.toggleHGroup(this._editedComponent,y,q.locked);
H.stopPropagation();
this._updateAnchorGuides()
}.bind(this))
},this)
},getContainersGeometry:function(k,h){var e=this.injects().Editor;
h=typeof(h)=="boolean"?h:e.getEditMode()==e.EDIT_MODE.MASTER_PAGE;
var a=[];
var g=k.getElements("[comp]");
var j=this._getAllSelectedComponents();
for(var c=0;
c<g.length;
c++){var b=g[c];
if(!b.getLogic){continue
}var m=b.getLogic();
if(!h||b.getParent("[comp=wysiwyg.viewer.components.PageGroup]")==null){if(instanceOf(m,this._containerBaseClass)&&m.isContainer()&&!this._logicArrayContains(j,m)){var f=m._getEditBoxReferenceNode();
var d=this._previewManager.getNodeGlobalPosition(f);
var l=f.getSize();
a.push({htmlNode:b,logic:m,x:d.x,y:d.y,width:l.x,height:l.y})
}}}return a
},_logicArrayContains:function(a,b){for(var c=0;
c<a.length;
c++){if(a[c].getViewNode().contains(b.getViewNode())){return true
}}return false
},_handlePossibleDropInsideContainer:function(){if(this._draggedOverContainer){this.addEditedComponentToContainer(this._draggedOverContainer.htmlNode)
}else{this.addEditedComponentToContainer(this.injects().Editor.getEditingScope())
}},_getAllSelectedComponents:function(){var a;
if(this._editedComponent.isMultiSelect){a=this._editedComponent.getSelectedComps()
}else{a=[this._editedComponent]
}return a
},_handlePossibleContainerDragOver:function(a,b){this._draggedOverContainer=this.getEditedComponentContainerInPosition(a,b,this._containersGeometry);
this.injects().Editor.highlightContainer(this._draggedOverContainer)
},removeEditedComponentFromContainer:function(){var c=this._editedComponent.getParentComponent();
var a=this._getAllSelectedComponents();
for(var b=0;
b<a.length;
b++){c.removeChild(a[b])
}this.injects().Layout.reportDeleteComponent(c);
this.injects().Editor.onComponentChanged(true)
},addEditedComponentToContainer:function(a,h){var j=this._editedComponent;
var c=j.getViewNode();
if(c!=a&&c.getParent("[comp]")!=a){var k=a.getLogic();
var l=this._getAllSelectedComponents();
var e=this.injects().Preview.getGlobalRefNodePositionInEditor(k);
h=h||this.injects().Preview.getGlobalRefNodePositionInEditor(j);
var b,f;
for(b=0;
b<l.length;
++b){f=l[b];
k.addChild(f)
}this.injects().Layout.reportReparent(l,this._originalContainer);
var d=this.injects().Editor;
var g=d.getComponentScope(k);
if(g!==d.getEditMode()){W.Commands.executeCommand("WEditorCommands.WSetEditMode",{editMode:d.EDIT_MODE[g]});
d.setSelectedComp(j)
}this.executeCommand({x:h.x-e.x,y:h.y-e.y})
}},getEditedComponentContainerInPosition:function(c,h,g){var b;
var a;
c+=window.pageXOffset;
h+=window.pageYOffset;
b=null;
a=this._editedComponent.getViewNode();
for(var f=0;
f<g.length;
f++){var d=g[f];
if(a!=d.htmlNode){if(c>d.x&&c<(d.x+d.width)&&h>d.y&&h<(d.y+d.height)){var e=d.logic;
if(this._editedComponent.isContainable(e)){b=d
}}}}return b
},_topResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.TOP)){return
}this._setEditedComponentMinimumHeightToPhysicalHeight();
this._resizeHandler(this._topResizeLogic,a)
},_bottomPushResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.BOTTOM)){return
}this._pushResize=true;
this._bottomResizeHandler(a)
},_bottomResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.BOTTOM)){return
}this._setEditedComponentMinimumHeightToPhysicalHeight();
this._resizeHandler(this._bottomResizeLogic,a)
},_rightResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.RIGHT)){return
}this._resizeHandler(this._rightResizeLogic,a)
},_leftResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.LEFT)){return
}this._resizeHandler(this._leftResizeLogic,a)
},_topRightResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.RIGHT)){return
}this._setEditedComponentMinimumHeightToPhysicalHeight();
this._resizeHandler(function(b){this._topResizeLogic(b);
this._rightResizeLogic(b)
}.bind(this),a)
},_topLeftResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.LEFT)){return
}this._setEditedComponentMinimumHeightToPhysicalHeight();
this._resizeHandler(function(b){this._topResizeLogic(b);
this._leftResizeLogic(b)
}.bind(this),a)
},_bottomRightResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.RIGHT)){return
}this._setEditedComponentMinimumHeightToPhysicalHeight();
this._resizeHandler(function(b){this._bottomResizeLogic(b);
this._rightResizeLogic(b)
}.bind(this),a)
},_bottomLeftResizeHandler:function(a){if(!this._enabledSides(W.BaseComponent.ResizeSides.LEFT)){return
}this._setEditedComponentMinimumHeightToPhysicalHeight();
this._resizeHandler(function(b){this._bottomResizeLogic(b);
this._leftResizeLogic(b)
}.bind(this),a)
},_resizeHandler:function(e,c){if(!this._isInScope){return
}W.UndoRedoManager._startTransaction(this._getCompScopeId());
this._clearAnchorGuides();
this.injects().Layout.reportResizeStart();
var b=this._editedComponent;
var f=this._siteBody;
this._editedComponent.saveCurrentDimensions();
this._resizeMouseStartPoint={x:c.client.x,y:c.client.y};
this._minCompContentH=this.injects().Layout.getComponentMinResizeHeight(this._editedComponent);
this._resizeStartComponentGeometry={x:b.getX(),y:b.getY(),width:b.getWidth(),height:b.getHeight()};
this._fireChangeEvent("layoutResizeStart",this._resizeStartComponentGeometry);
var d=function(g){e(g)
}.bind(this);
var a=function(){this._pushResize=false;
f.removeEvent("mousemove",d);
f.removeEvent("mouseup",a);
this.injects().Layout.reportResize([b]);
if(this._editedComponent){this._editedComponent.fireEvent("resizeEnd");
window.fireEvent("resizeEnd");
this._updateAnchorGuides();
if(this._getEditModeState()=="inPlaceEdit"){this._skinParts.richTextEditor.stopResize()
}}this._fireChangeEvent("layoutResizeStop");
W.UndoRedoManager._endTransaction(this._getCompScopeId())
}.bind(this);
f.addEvent("mousemove",d);
f.addEvent("mouseup",a)
},_rightResizeLogic:function(c){var b=this._toggleGridScaleIfControlPressed(c);
var a=c.client.x-this._resizeMouseStartPoint.x;
this._setComponentPosSize({width:this.roundToGrid(this._resizeStartComponentGeometry.width+a,b)})
},_leftResizeLogic:function(d){var b=this._toggleGridScaleIfControlPressed(d);
var a=this._resizeMouseStartPoint.x-d.client.x;
var c=this._resizeStartComponentGeometry.width+a;
var e=this.roundToGrid(this._resizeStartComponentGeometry.x-a,b);
var f=this._resizeStartComponentGeometry.x-e;
if(c>this._editedComponent.getSizeLimits().minW){this._setComponentPosSize({x:e,width:this._resizeStartComponentGeometry.width+f})
}},_topResizeLogic:function(d){var c=this._toggleGridScaleIfControlPressed(d);
var b=this._resizeMouseStartPoint.y-d.client.y;
var f=this.roundToGrid(this._resizeStartComponentGeometry.y-b,c);
var g=this._resizeStartComponentGeometry.y-f;
var a=this._resizeStartComponentGeometry.height+g+this._editedComponent.getExtraPixels().height;
var e=this._editedComponent.getSizeLimits().minH;
a=Math.max(a,e);
this._setComponentPosSize({y:f,height:a})
},_bottomResizeLogic:function(d){var b=this._toggleGridScaleIfControlPressed(d);
var a=d.client.y-this._resizeMouseStartPoint.y;
var c=this._resizeStartComponentGeometry.height+a;
c=Math.max(c,this._minCompContentH);
this._setComponentPosSize({height:this.roundToGrid(c,b),enforceAnchors:this._getEnforceAnchors(d)},this);
var e=this._editedComponent.getHeight()+this._editedComponent.getExtraPixels().height;
var f=this._editedComponent.getViewNode().getSize().y;
if(e<f){this._showMinHeightMark(e)
}},_setComponentPosSize:function(b,a){if(this._editedComponent){if(a){this.executeCommand(b,a)
}else{this.executeCommand(b)
}}if(this._editedComponent&&this._editedComponent.isEditableInPlace()){if(!isNaN(b.width)){this._skinParts.richTextEditor.setWidth(b.width)
}if(!isNaN(b.height)){this._skinParts.richTextEditor.setMinHeight(this._editedComponent.getMinPhysicalHeight()+this._editedComponent.getExtraPixels().height);
this._skinParts.richTextEditor.setHeight(b.height)
}}},refreshMultiSelect:function(){this.clearMultiSelectDisplay();
if(this._editedComponent&&this._editedComponent.isMultiSelect){var b=this._editedComponent.getSelectedComps();
for(var a=0;
a<b.length;
a++){this._buildMultiSelectionBox(b[a])
}}},_buildMultiSelectionBox:function(c){var d=this.injects().Preview.getNodeGlobalPosition(c.getViewNode());
var a=c.getExtraPixels();
var b=new Element("div",{state:"selected"});
b.setStyles({left:d.x-this.getX()+a.left,top:d.y-this.getY()+a.top,width:c.getWidth()+a.width,height:c.getPhysicalHeight()});
b.insertInto(this._skinParts.multiSelectLayer)
},clearMultiSelectDisplay:function(){this._skinParts.multiSelectLayer.empty()
},_getEnforceAnchors:function(a){return this._pushResize||a.control||this._editedComponent.useLayoutOnResize()
},highlightEditingFrame:function(){},_blink:function(d,a){var b=0;
for(var c=0;
c<a;
c++){b=b+d;
setTimeout(function(){this.hide()
}.bind(this),b);
b=b+d;
setTimeout(function(){this.show()
}.bind(this),b)
}},_fireChangeEvent:function(a,b){this.injects().Layout.fireEvent(a,b)
},_getCompScopeId:function(){return W.Editor.getSelectedComp().getParentComponent().getComponentId()
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.ContainerHighLight",skinParts:{outline:{type:"htmlElement"},label:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{componentScope:["page","master"]},Binds:["_fitToContainer"],initialize:function(c,a,b){this._siteBody=$$("body");
this._previewManager=this.injects().Preview;
this.parent(c,a,b)
},_onAllSkinPartsReady:function(){this.collapse();
this._skinParts.label.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","CONTAINER_HIGHLIGHT_ATTACH"))
},highlightComponent:function(b,a){this._highlightedComponent=b;
if(b){this._fitToContainer();
this.uncollapse()
}else{this.collapse()
}},_getEditedComponentExtraPixel:function(){var b=this._highlightedComponent.getViewNode().getStyles("padding-top","padding-bottom","margin-top","margin-bottom");
var c=0;
for(var a in b){c+=Number.from(b[a])
}return c
},_fitToContainer:function(){if(this._highlightedComponent==null){return
}var a=this.injects().Editor;
if(a.getComponentScope(this._highlightedComponent.htmlNode)===a.EDIT_MODE.MASTER_PAGE){this.setState("master","componentScope")
}else{this.setState("page","componentScope")
}this.setX(this._highlightedComponent.x-5);
this.setY(this._highlightedComponent.y-5);
this._skinParts.outline.setStyles({width:this._highlightedComponent.width+5,height:this._highlightedComponent.height+5})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.EditModeStateBar",skinParts:{editStateBarBack:{type:"mobile.core.components.Button",autoBindDictionary:"SWITCH_TO_EDITOR_MODE"},helpButton:{type:"mobile.core.components.Button"},title:{type:"htmlElement"},description:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_editStateBarBackHandler"],_onAllSkinPartsReady:function(){this._skinParts.editStateBarBack.addEvent(Constants.CoreEvents.CLICK,this._editStateBarBackHandler);
this._skinParts.helpButton.addEvent("click",function(){switch(W.Editor.getEditMode()){case W.Editor.EDIT_MODE.MASTER_PAGE:W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","MasterPage");
break;
case W.Editor.EDIT_MODE.PREVIEW:break
}}.bind(this))
},refreshState:function(){var a=this.injects().Resources;
switch(W.Editor.getEditMode()){case W.Editor.EDIT_MODE.MASTER_PAGE:this._skinParts.title.set("text",a.get("EDITOR_LANGUAGE","EDIT_MODE_TITLE_MASTER"));
this._skinParts.description.set("text",a.get("EDITOR_LANGUAGE","EDIT_MODE_DESCRIPTION_MASTER"));
this._skinParts.helpButton.uncollapse();
break;
case W.Editor.EDIT_MODE.PREVIEW:this._skinParts.title.set("text",a.get("EDITOR_LANGUAGE","EDIT_MODE_TITLE_PREVIEW"));
this._skinParts.description.set("text","");
this._skinParts.helpButton.collapse();
break
}},_editStateBarBackHandler:function(){var a=this.injects().Commands;
a.getCommand("WEditorCommands.WSetEditMode").execute({editMode:W.Editor.EDIT_MODE.CURRENT_PAGE,previousEditMode:W.Editor.EDIT_MODE.PREVIEW})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.EditorSubMenu",skinParts:{container:{type:"htmlElement"},label:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["closed","open"],initialize:function(c,a,b){this._comp=this._skin="";
this._component=undefined;
this.parent(c,a,b);
this.setState("closed");
this._renderItems=this._renderItems.bind(this);
this._closePanelOnTimer=this._closePanelOnTimer.bind(this);
this._resetCloseTimer=this._resetCloseTimer.bind(this)
},getItemClassName:function(){return"mobile.core.components.ServiceItem"
},openMenu:function(a){this.injects().Data.getDataByQuery(a,this._renderItems);
this._resetCloseTimer()
},_resetCloseTimer:function(){if(this._intervalID){clearTimeout(this._intervalID)
}this._intervalID=setTimeout(this._closePanelOnTimer,5000)
},_closePanelOnTimer:function(){this._intervalID=null;
this.setState("closed");
this._view.removeEvent("mousemove",this._resetCloseTimer)
},_renderItems:function(a){this._itemsList=a;
this._skinParts.label.set("html",a.get("title"));
this._skinParts.container.empty();
for(var b=0;
b<a.getData().list.length;
b++){var d=a.getData().list[b];
var c=new Element("img",{src:this.injects().Theme.getProperty("THEME_DIRECTORY")+"add_component/"+d.icon,title:d.name});
this._skinParts.container.adopt(c)
}this.setState("open");
this._view.addEvent("mousemove",this._resetCloseTimer);
this._resetCloseTimer()
}}});
Constants.EditorUI={SHOW_PANEL:"EditorUI.ShowPanel",SHOW_TOOLBAR:"EditorUI.ShowToolbar",SHOW_SUB_PANEL:"EditorUI.ShowSubPanel",CLOSE_PANEL:"EditorUI.ClosePanel",CLOSE_SUB_PANEL:"EditorUI.HideSubPanel",CLOSE_ALL_PANELS:"EditorUI.HideAllPanels",CLOSE_PROPERTY_PANEL:"EditorUI.ClosePropertyPanel",START_EDIT_RICH_TEXT:"EditorUI.StartEditRichText",RESIZE_HANDLES_CHANGED:"EditorUI.ResizeHandlesChanged",CLOSED_PANELS:"closedPanels",DESIGN_PANEL:"designPanel",ADD_PANEL:"addPanel",PAGES_PANEL:"pagesPanel",SETTINGS_PANEL:"settingsPanel",EDIT_STATE_BAR_VISIBLE:"editStateBarVisible",EDIT_STATE_BAR_HIDDEN:"editStateBarHidden",EDIT_CONTROLS_VISIBLE:"editControlsVisible",EDIT_CONTROLS_HIDDEN:"editControlsHidden",PANEL_CLOSING:"pclose!",MediaQuery:{TIMEOUT:40,Height:{DEFAULT:0,MINIMAL:600},Width:{DEFAULT:0,MINIMAL:960}},Max:{SIDE_PANEL_HEIGHT:530}};
W.Components.newComponent({name:"wysiwyg.editor.components.EditorUI",skinParts:{editStateBar:{type:"wysiwyg.editor.components.EditModeStateBar"},preview:{type:"wysiwyg.editor.components.WEditorPreview"},topContainer:{type:"htmlElement"},panelsContainer:{type:"htmlElement"},mainEditorBar:{type:"wysiwyg.editor.components.panels.MainEditorBar",dataQuery:"#TOP_TABS"},mainTabs:{type:"wysiwyg.editor.components.Tabs",dataQuery:"#TOP_TABS"},subToolbar:{type:"htmlElement"},sidePanel:{type:"wysiwyg.editor.components.panels.base.SidePanel",argObject:{closeCommand:Constants.EditorUI.CLOSE_PANEL}},subPanel:{type:"htmlElement"},propertyPanel:{type:"htmlElement"},componentPanel:{type:"wysiwyg.editor.components.panels.ComponentPanel",autoCreate:false},masterComponents:{type:"wysiwyg.editor.components.panels.MasterComponentPanel",autoCreate:false},addComponent:{type:"wysiwyg.editor.components.panels.AddComponentPanel",autoCreate:false},design:{type:"wysiwyg.editor.components.panels.DesignPanel",autoCreate:false},pagesPanel:{type:"wysiwyg.editor.components.panels.PagesPanel",autoCreate:false},settings:{type:"wysiwyg.editor.components.panels.SettingsPanel",autoCreate:false},containerHighLight:{type:"wysiwyg.editor.components.ContainerHighLight"},componentEditBox:{type:"wysiwyg.editor.components.ComponentEditBox"},pageSettings:{type:"wysiwyg.editor.components.panels.PageSettingsPanel",autoCreate:false,argObject:{closeCommand:Constants.EditorUI.CLOSE_SUB_PANEL}},siteName:{type:"wysiwyg.editor.components.panels.SiteNamePanel",dataQuery:"#SITE_SETTINGS",autoCreate:false,argObject:{closeCommand:Constants.EditorUI.CLOSE_SUB_PANEL}},statistics:{type:"wysiwyg.editor.components.panels.StatisticsPanel",dataQuery:"#SITE_SETTINGS",autoCreate:false,argObject:{closeCommand:Constants.EditorUI.CLOSE_SUB_PANEL}},faviconAndThumbnail:{type:"wysiwyg.editor.components.panels.FaviconAndThumbnailPanel",dataQuery:"#SITE_SETTINGS",autoCreate:false,argObject:{closeCommand:Constants.EditorUI.CLOSE_SUB_PANEL}},seo:{type:"wysiwyg.editor.components.panels.SEOPanel",dataQuery:"#SITE_SETTINGS",autoCreate:false,argObject:{closeCommand:Constants.EditorUI.CLOSE_SUB_PANEL}},backgroundDesign:{type:"wysiwyg.editor.components.panels.BackgroundDesignPanel",autoCreate:false},backgroundEditor:{type:"wysiwyg.editor.components.panels.BackgroundEditorPanel",autoCreate:false,argObject:{closeCommand:Constants.EditorUI.CLOSE_SUB_PANEL}},colorDesign:{type:"wysiwyg.editor.components.panels.ColorsDesignPanel",autoCreate:false},customizeColors:{type:"wysiwyg.editor.components.panels.DynamicPalettePanel",autoCreate:false},fonts:{type:"wysiwyg.editor.components.panels.FontsPanel",autoCreate:false},customizeFonts:{type:"wysiwyg.editor.components.panels.CustomizeFontsPanel",autoCreate:false},toolTip:{type:"wysiwyg.editor.components.ToolTip"},dialogLayer:{type:"htmlElement"},pickerLayer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onWindowResize","_onPanelClosing","_onSiteLoaded","_matchSubPanelHeight"],_states:{editStateBar:[Constants.EditorUI.EDIT_STATE_BAR_VISIBLE,Constants.EditorUI.EDIT_STATE_BAR_HIDDEN],editControls:[Constants.EditorUI.EDIT_CONTROLS_VISIBLE,Constants.EditorUI.EDIT_CONTROLS_HIDDEN],panels:[Constants.EditorUI.CLOSED_PANELS,Constants.EditorUI.DESIGN_PANEL,Constants.EditorUI.ADD_PANEL,Constants.EditorUI.PAGES_PANEL,Constants.EditorUI.SETTINGS_PANEL],mediaQueryWidth:["defaultWidth","minimalWidth"],mediaQueryHeight:["defaultHeight","minimalHeight"]},initialize:function(d,b,c){this.parent(d,b,c);
var a=this.injects().Commands;
this._hideSidePanelCommand=a.registerCommandAndListener(Constants.EditorUI.CLOSE_PANEL,this,this._hideEditorPanel);
this._hideSubPanelCommand=a.registerCommandAndListener(Constants.EditorUI.CLOSE_SUB_PANEL,this,this._hideSubPanel);
this._hideAllPanelsCommand=a.registerCommandAndListener(Constants.EditorUI.CLOSE_ALL_PANELS,this,this._hideAllPanels);
this._closePropertyPanel=a.registerCommandAndListener(Constants.EditorUI.CLOSE_PROPERTY_PANEL,this,this._onClosePropertyPanel);
this._currentPanel={panel:null};
this._currentSubPanel={panel:null};
this._currentToolbar={panel:null};
this.disableDragAndDrop();
$(window).addEvent("resize",this._onWindowResize);
this._history=[];
this._panelsMap={}
},showEditStateBar:function(){this._skinParts.editStateBar.refreshState();
this._skinParts.preview.setState(Constants.EditorUI.EDIT_STATE_BAR_VISIBLE,"editStateBar");
this.setState(Constants.EditorUI.EDIT_STATE_BAR_VISIBLE,"editStateBar");
this._fitEditBoxToComp(400)
},hideEditStateBar:function(){this.setState(Constants.EditorUI.EDIT_STATE_BAR_HIDDEN,"editStateBar");
this._skinParts.preview.setState(Constants.EditorUI.EDIT_STATE_BAR_HIDDEN,"editStateBar");
this._fitEditBoxToComp(400)
},getStateBarSize:function(){return this._skinParts.editStateBar.getViewNode().getSize()
},_fitEditBoxToComp:function(b){var c=this;
var a=50;
if(b>0){setTimeout(function(){c._skinParts.componentEditBox.fitToComp();
c._fitEditBoxToComp(b-a)
},a)
}},showEditControls:function(){this._skinParts.preview.setEditingMode(true);
this.setState(Constants.EditorUI.EDIT_CONTROLS_VISIBLE,"editControls");
this._showGrid()
},hideEditControls:function(){this._hideEditorPanel(null);
this._hideGrid();
this._skinParts.preview.setEditingMode(false);
this.setState(Constants.EditorUI.EDIT_CONTROLS_HIDDEN,"editControls")
},_hideGrid:function(){var a=W.Preview.getPreviewManagers().Viewer.getPageGroup();
var b=a.getState();
if(b=="showGridLines"){this._gridIsShownInEditMode=true;
a.removeState("showGridLines")
}else{this._gridIsShownInEditMode=false
}},_showGrid:function(){if(this._gridIsShownInEditMode){var a=W.Preview.getPreviewManagers().Viewer.getPageGroup();
a.setState("showGridLines")
}},showComponentInPanel:function(a,d,c,f,g){var e=function(h){this.showPanel(h,d,f,{skinPart:a,args:c,state:f});
if(g){g(h)
}}.bind(this);
var b=this._panelsMap[a];
if(b){e(b)
}else{this.createComponentPart(a,d,c,e)
}},createComponentPart:function(a,c,b,g){var e=this.getSkinPartDefinition(a);
var f={type:e.type,skin:e.skin,data:e.dataQuery,args:e.argObject||{},componentReadyCallback:function(h){if(c){this._panelsMap[a]=h
}if(g){g(h)
}}.bind(this)};
if(b){for(var d in b){f.args[d]=b[d]
}}if(e.getDataFromSite){W.Preview.getPreviewManagers().Data.getDataByQuery(f.data,function(h){f.data=h;
W.Components.createComponent(f)
})
}else{W.Components.createComponent(f)
}},showPanel:function(a,b,c,e){c=c||Constants.EditorUI.CLOSED_PANELS;
var d=this._currentPanel;
if(d.panel==a){return
}this.showSubPanel(null);
if(a){this.showToolbar(null)
}this._showPanel(a,d,b,this._skinParts.sidePanel);
this.setState(c,"panels");
if(e){e.name=a.getName();
e.canGoBack=a.canGoBack();
this._history.push(e);
if(this._history.length>10){this._history.splice(0,1)
}}this._updateBreadcrumbState()
},showSubPanel:function(a,b){var c=this._currentSubPanel;
if(c.panel==a){return
}this._showPanel(a,c,b,this._skinParts.subPanel)
},showSubPanelWithParentPanelSize:function(b,c){b._setHeightTimerCounter=0;
b._setHeightTimerCounterMax=10;
var a=this._currentPanel.panel;
a.addEvent("resize",this._matchSubPanelHeight);
a.addEvent(Constants.DataEvents.DATA_CHANGED,this._matchSubPanelHeight);
this.showSubPanel(b,c);
this._matchSubPanelHeight()
},_matchSubPanelHeight:function(){var b=this._currentPanel.panel.getPanelHeight();
var a=this._currentSubPanel.panel;
var c=a._skinParts.topBar.getSize().y+a._skinParts.bottom.getSize().y;
if(a._skinParts.pageActions){c+=a._skinParts.pageActions.getSize().y
}if(!c&&a._setHeightTimerCounter<a._setHeightTimerCounterMax){a._setHeightTimerCounter+=1;
setTimeout(this._matchSubPanelHeight,100);
return
}else{a._setHeightTimerCounter=0
}a._skinParts.view.setStyle("height",b);
a._skinParts.content.setStyle("height",b-c)
},showPropertyPanel:function(a,b){var c=this._currentSubPanel;
if(c.panel==a){return
}this._showPanel(a,c,b,this._skinParts.propertyPanel)
},showToolbar:function(b,a){var c=this._currentToolbar;
if(c.panel==b){return
}if(b){this.showPanel(null)
}this._showPanel(b,c,a,this._skinParts.subToolbar)
},_onAllSkinPartsReady:function(){this._resize();
this.setState(Constants.EditorUI.CLOSED_PANELS,"panels");
this.injects().Editor.addEvent(Constants.EditorEvents.SITE_LOADED,this._onSiteLoaded)
},_showFirstTimeInEditorHelp:function(){var b=!W.CookiesManager.getCookie("showHtmlEditorIntro");
var a=editorModel.siteHeader.documentType=="template";
var c=W.Utils.getQueryParam("noIntro");
if(b&&!c&&a){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","FirstTimeInEditor");
W.CookiesManager.setCookieParam("showHtmlEditorIntro",false)
}},_onSiteLoaded:function(){this.injects().Editor.removeEvent(Constants.EditorEvents.SITE_LOADED,this._onSiteLoaded);
this._showFirstTimeInEditorHelp()
},popHistory:function(){var a=this._history.length;
if(a>1){this._history.pop();
return this._history.pop()
}return null
},getCurrentSubPanel:function(){return this._currentSubPanel
},getPreview:function(){return this._skinParts.preview
},getPagesPanel:function(){return this._skinParts.pagesPanel
},getContainerHighLight:function(){return this._skinParts.containerHighLight
},getComponentEditBox:function(){return this._skinParts.componentEditBox
},getDialogLayer:function(){return this._skinParts.dialogLayer
},getColorPickerLayer:function(){return this._skinParts.pickerLayer
},disableDragAndDrop:function(){var a=function(b){if(b.dataTransfer&&b.dataTransfer.effectAllowed&&b.dataTransfer.dropEffect){b.dataTransfer.effectAllowed="none";
b.dataTransfer.dropEffect="none"
}b.preventDefault()
};
window.ondragover=a;
window.ondragenter=a;
window.ondrop=function(b){b.cancelBubble=true;
b.stopPropagation();
b.preventDefault();
return false
}
},_onWindowResize:function(){this._resize()
},_resize:function(){var b=this._view.getSize();
var f=this._skinParts.topContainer.getSize();
var a=this._skinParts.sidePanel;
var d=this._skinParts.panelsContainer;
var c=d.getPosition();
var e=this._currentPanel.panel;
if(e){d.uncollapse();
d.setStyle("top",f.y);
var i=b.y-c.y;
if(i<0){i=0
}d.setStyle("height",i);
if(e.resizeContentArea){var h=window.getSize().y-a.getHeaderHeight()-a.getResizeOffset();
var g=Constants.EditorUI.Max.SIDE_PANEL_HEIGHT;
e.resizeContentArea(Math.min(h,g))
}}else{d.collapse();
d.setStyle("height",0)
}if(this._mediaQueryTimer){clearTimeout(this._mediaQueryTimer)
}this._mediaQueryTimer=W.Utils.callLater(this._setMediaQueryState,[window.getSize()],this,Constants.EditorUI.MediaQuery.TIMEOUT)
},_showPanel:function(c,g,d,b){var h=g.panel;
if(h==c){return
}if(h){if(this._currentPanel.panel){this._currentPanel.panel.fireEvent("subMenuCloses")
}if(g.dispose){h.dispose()
}else{h.removeEvent(Constants.EditorUI.PANEL_CLOSING,this._onPanelClosing);
h.getViewNode().collapse();
this.injects().Utils.forceBrowserRepaint()
}}if(c){c.uncollapse();
if(b.insertPanel){var a=this._history.length;
var e=a>0&&this._history[a-1];
b.insertPanel(c,e&&e.name)
}else{c.getViewNode().insertInto(b)
}var f=c.getFields();
if(f){f.forEach(function(i){i.renderIfNeeded()
})
}c.addEvent(Constants.EditorUI.PANEL_CLOSING,this._onPanelClosing)
}g.dispose=!d;
g.panel=c;
this.callLater(this._resize,null,100)
},_showEditorPanel:function(a){},_hideEditorPanel:function(a){this.showPanel(null)
},_showSubPanel:function(a){},_hideSubPanel:function(a){this._currentPanel.panel.fireEvent("subMenuCloses");
this.showSubPanel(null)
},_hideAllPanels:function(){if(this._currentPanel.panel){this.showPanel(null)
}if(this._currentSubPanel.panel){this.showSubPanel(null)
}},_onClosePropertyPanel:function(a){this.showPropertyPanel(null)
},_onPanelClosing:function(a){if(a){if(a==this._currentPanel.panel){this.showPanel(null)
}else{if(a==this._currentSubPanel.panel){this.showSubPanel(null)
}}}},_updateBreadcrumbState:function(){var a=this._history.length;
var d=0;
for(var b=a-1;
b>=0;
--b){var c=this._history[b];
if(c.canGoBack){++d
}else{break
}}this._skinParts.sidePanel.setHistoryDepth(d)
},_setMediaQueryState:function(c){var b=c.x;
var a=c.y;
if(b<Constants.EditorUI.MediaQuery.Width.MINIMAL){this.setState("minimalWidth","mediaQueryWidth")
}else{this.removeState("minimalWidth","mediaQueryWidth")
}if(a<Constants.EditorUI.MediaQuery.Height.MINIMAL){this.setState("minimalHeight","mediaQueryHeight")
}else{this.removeState("minimalHeight","mediaQueryHeight")
}},hideDialogLayer:function(){this._skinParts.dialogLayer.collapse()
},showDialogLayer:function(){this._skinParts.dialogLayer.uncollapse()
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.FontButton",skinParts:{icon:{type:"htmlElement",optional:"true"},label:{type:"htmlElement"},extraLabel:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.WButton",_states:["up","over","selected","pressed"],_triggers:["click"],Binds:["_onFontChange","_openFontDialog","_closeFontDialog"],Static:{MAX_FONT_SIZE:52},_canFocus:true,initialize:function(c,a,b){this._themeManager=this.injects().Preview.getPreviewManagers().Theme;
this.parent(c,a,b);
this.setName(b.name);
this.setFont(b.font)
},_onDataChange:function(a){this.parent(a);
this._renderIfReady()
},render:function(){this.parent();
var a=new W.Font(this._font,this._themeManager);
var b=a.getSize();
this.injects().Css.loadFont(a.getFontFamily());
this._skinParts.icon.uncollapse();
this._skinParts.icon.setStyle("background-color",a.getColor());
this._skinParts.extraLabel.set("text",b);
if(parseInt(b)>this.MAX_FONT_SIZE){b=this.MAX_FONT_SIZE+"px";
this._skinParts.extraLabel.addClass("fontSizeExceeded");
this._skinParts.label.set("title",this.injects().Resources.get("EDITOR_LANGUAGE","FONT_PRESET_SIZE_WARNING"))
}else{this._skinParts.extraLabel.removeClass("fontSizeExceeded");
this._skinParts.label.set("title","")
}this._skinParts.label.setStyles({fontFamily:a.getFontFamilyWithFallbacks(),fontStyle:a.getStyle(),fontVariant:a.getVariant(),fontWeight:a.getWeight(),fontSize:b})
},setName:function(a){this._name=a;
this._renderIfReady()
},setFont:function(a){this._font=a;
this._renderIfReady()
},_openFontDialog:function(){var c=this.injects().Utils.getPositionRelativeToWindow(this._skinParts.view);
var a=this._skinParts.view.getSize();
var b={title:this._label,font:this._font,onChange:this._onFontChange,callback:this._closeFontDialog,top:c.y+a.y*0.66,left:c.x+a.x*0.66};
this._initFont=this._font;
this.toggleSelected(true);
this.injects().Commands.executeCommand("WEditorCommands.OpenFontDialogCommand",b)
},_onFontChange:function(a){if(!a){return
}this.setFont(a.font);
this.fireEvent(Constants.CoreEvents.CHANGE,{font:a.font,cause:a.cause})
},_closeFontDialog:function(){this.toggleSelected(false)
},_onEnabled:function(){var a=this._skinParts.view;
a.addEvent(Constants.CoreEvents.CLICK,this._openFontDialog);
a.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
a.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
a.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
a.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
},_onDisabled:function(){var a=this._skinParts.view;
a.removeEvent(Constants.CoreEvents.CLICK,this._openFontDialog);
a.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onOver);
a.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onOut);
a.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
a.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.Iframe",skinParts:{iframe:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{hidden:["hidden","visible"]},initialize:function(c,a,b){this.parent(c,a,b);
this._height=b.height
},_onAllSkinPartsReady:function(){this._skinParts.iframe.setAttribute("height",this._height);
this._skinParts.iframe.setStyle("height",this._height);
this._skinParts.view.setStyle("height",this._height);
this._skinParts.iframe.setAttribute("width","100%")
},setUrl:function(a){this.url=a;
this._skinParts.iframe.setAttribute("src",a)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.PopupMenu",skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.SimpleBaseList",Binds:["_onBodyCloseEvent"],initialize:function(c,a,b){this.parent(c,a,b);
this._closeEvents=[Constants.CoreEvents.BLUR,Constants.CoreEvents.MOUSE_DOWN]
},getItemClassName:function(){return"mobile.core.components.Button"
},close:function(){this._attachBodyEvents(false);
this.dispose()
},open:function(){this._attachBodyEvents(true)
},_renderItems:function(a){this.parent(a,true)
},_onItemReady:function(c,b,a){var d=a&&a.command;
if(d){c.setCommand(d)
}c.setLabel(a.label)
},_onBodyCloseEvent:function(){this.close()
},_attachBodyEvents:function(b){var a=window;
var c=this._onBodyCloseEvent;
this._closeEvents.forEach(function(d){if(b){a.addEvent(d,c)
}else{a.removeEvent(d,c)
}})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.SiteNavigationButton",skinParts:{label:{type:"htmlElement"},menu:{type:"htmlElement"},drag:{type:"htmlElement"}},traits:["wysiwyg.editor.components.traits.TreeItem"],Class:{Extends:"mobile.core.components.Button",_states:{mouse:["up","over","selected","down","pressed"],page:["normal","subPage"]},_triggers:["click"],_renderTriggers:[Constants.DisplayEvents.DISPLAYED],Binds:["_openPageSettings","_updatePageName"],render:function(){this.parent();
if(this._data.getMeta("isHidden")){this._skinParts.label.addClass("hiddenPage")
}else{this._skinParts.label.removeClass("hiddenPage")
}},registerDragHandler:function(a){this._skinParts.drag.addEvent(Constants.CoreEvents.MOUSE_DOWN,a)
},_onAllSkinPartsReady:function(){this._addToolTipToSkinPart(this._skinParts.menu,"Pages_Symbol_ttid");
this._refId=this._data.get("refId");
var b=this.injects().Preview.getPreviewManagers().Data.getDataByQuery(this._refId);
this._label=b.get("title");
b.addEvent("dataChanged",this._updatePageName);
var a=(this._refId.indexOf("#")===0)?this._refId.substr(1):this._refId;
this._skinParts.menu.addEvent(Constants.CoreEvents.CLICK,this._openPageSettings);
this.setCommand("EditorCommands.gotoSitePage",a);
if(W.Preview.getPreviewManagers().Viewer.getCurrentPageId()==a){this.setState("selected","mouse")
}else{this.setState("up","mouse")
}},_updatePageName:function(a){this._label=a.get("title");
this._skinParts.label.set("html",this._label||"")
},_addToolTipToSkinPart:function(b,a){b.addEvent("mouseenter",function(){W.Commands.executeCommand("Tooltip.ShowTip",{id:a},b)
}.bind(this));
b.addEvent("mouseleave",function(){W.Commands.executeCommand("Tooltip.CloseTip")
}.bind(this))
},_openPageSettings:function(){this.injects().Commands.executeCommand("WEditorCommands.PageSettings",{pageId:this._refId})
},isSubItem:function(){if(this.getState("page")=="subPage"){return true
}return false
},setAsSubItem:function(){this.setState("subPage","page")
},setAsParentItem:function(){this.setState("normal","page")
},getAcceptableDataTypes:function(){return["MenuItem"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.SitePageButton",skinParts:{label:{type:"htmlElement",autoBindData:"title"},menu:{type:"htmlElement"},drag:{type:"htmlElement"}},Class:{Extends:"mobile.editor.components.SitePageControllerBtn",_pageSettingsCallback:function(a){this._skinParts.menu.addEvent(Constants.CoreEvents.CLICK,a)
},_registerDragHandler:function(a){this._skinParts.drag.addEvent(Constants.CoreEvents.MOUSE_DOWN,a)
},_onAllSkinPartsReady:function(){this._addToolTipToSkinPart(this._skinParts.menu,"Pages_Symbol_ttid")
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.Tabs",skinParts:{itemsContainer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.BaseList",_itemClassName:"wysiwyg.editor.components.WButton",initialize:function(d,a,b){this.parent(d,a,b);
b=b||{};
var e=new W.Commands.Command("UICommands.tab"+W.Utils.getUniqueId("tabs"));
e.registerListener(this,this._onTab,null);
this._itemCommand=e;
this._currentItem=null;
this._tabItems=[];
this._isToggle=b.isToggle!==false;
this.disable();
var c=W.Commands.getCommand("PreviewIsReady");
if(!c){W.Commands.registerCommandAndListener("PreviewIsReady",this,this.enable.bind(this))
}else{c.registerListener(this,this.enable.bind(this))
}},_registerToolTips:function(){if(!!this._toolTipsWhereRegistered){return
}this._addToolTipToSkinPart(this._skinParts.tbCopy,"Main_Menu_Copy_ttid");
this._addToolTipToSkinPart(this._skinParts.tbPaste,"Main_Menu_Paste_ttid");
this._addToolTipToSkinPart(this._skinParts.tbGrid,"Main_Menu_Grid_ttid");
this._addToolTipToSkinPart(this._skinParts.tbSnapToGrid,"Snap_To_Grip_Toggle_ttid");
this._skinParts.tbSnapToGrid.setAttribute("state","enabled");
this.injects().Commands.executeCommand("EditCommands.SnapToGrid",true);
this._toolTipsWhereRegistered=true
},render:function(){this._renderItems(this._data.get("items"),true);
if(this._skinParts.actions){this._registerToolTips();
if(this._skinParts.tbCopy){this._skinParts.tbCopy.addEvent("click",function(){this.injects().Commands.executeCommand("EditCommands.Copy")
}.bind(this))
}if(this._skinParts.tbPaste){this._skinParts.tbPaste.addEvent("click",function(){this.injects().Commands.executeCommand("EditCommands.Paste")
}.bind(this))
}if(this._skinParts.tbGrid){this._skinParts.tbGrid.addEvent("click",function(){this._toggleButton("tbGrid");
this.injects().Commands.executeCommand("EditCommands.ToggleGridLines")
}.bind(this))
}if(this._skinParts.tbSnapToGrid){this._skinParts.tbSnapToGrid.addEvent("click",function(){this._toggleButton("tbSnapToGrid");
this.injects().Commands.executeCommand("EditCommands.SnapToGrid")
}.bind(this))
}}if(this._skinParts.draggable){var a=new Drag.Move(this._skinParts.view,{snap:0,handle:this._skinParts.draggable,limit:{x:[0,window.innerWidth-100],y:[0,window.innerHeight-100]}})
}},_toggleButton:function(a){var b=this._skinParts[a].getAttribute("state")=="enabled";
b?this._skinParts[a].removeAttribute("state"):this._skinParts[a].setAttribute("state","enabled")
},getItemsContainer:function(){return this._skinParts.itemsContainer
},_getParamsToPassToItem:function(a,b){b(a)
},_onItemReady:function(b,a,e){if(a){if(this._isToggle){b.setCommand(this._itemCommand)
}var c={ui:b,linkedUI:e.ui,command:e.command,commandParameter:e.commandParameter};
this._tabItems.push(c);
if(c.linkedUI){var d=$(c.linkedUI);
if(d){d.collapse()
}}}},_onTab:function(d,a){var c=a.source;
var b=this._findTabByItem(c);
this._setCurrentItem(b)
},_setCurrentItem:function(c){var f=this._currentItem;
var a=this._isToggle;
if(!a||c!=f){if(f){if(a){f.ui.removeState("selected")
}if(f.linkedUI){var b=$(f.linkedUI);
if(b){b.collapse()
}}}this._currentItem=c;
if(c){if(a){c.ui.setState("selected")
}if(c.linkedUI){var e=$(c.linkedUI);
if(e){e.uncollapse()
}}}}if(c.command){var d=W.Commands.getCommand(c.command);
if(d){d.execute(c.commandParameter,c)
}}},_findTabByItem:function(b){var a=this._tabItems.getByField("ui",b);
return a||null
},getAcceptableDataTypes:function(){return["PropertyList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.ThumbGallery",skinParts:{collection:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.SelectionListInput",Binds:["_setRelevantDataProvider","_nextThumb","_prevThumb"],_states:{prev:["noPrev"],next:["noNext"],label:["hasLabel","noLabel"]},initialize:function(c,a,b){this.parent(c,a,b);
this._numToShow=(b&&b.numToShow)||4;
this._currentIndex=0
},_prepareForRender:function(){this._setRelevantDataProvider();
return this.parent()
},_setRelevantDataProvider:function(){if(!this._fullDataProvider){this._fullDataProvider=this._dataProvider
}if(this._fullDataProvider.get("items")){var a=[];
var c=this._fullDataProvider.get("items");
for(var b=this._currentIndex;
b<this._currentIndex+this._numToShow;
b++){if(c[b]){a.push(c[b])
}else{break
}}if(this._selectedIndex>=this._currentIndex&&this._selectedIndex<this._currentIndex+this._numToShow){this._selectItemAtIndex=this._selectedIndex%this._numToShow
}else{this._selectItemAtIndex=-1
}if(this._currentIndex==0){this.setState("noPrev","prev")
}else{this.removeState("noPrev","prev")
}if(this._fullDataProvider.get("items").length>this._currentIndex+this._numToShow){this.removeState("noNext","next")
}else{this.setState("noNext","next")
}this._dataProvider=W.Data.createDataItem({items:a,type:"list"})
}},selectItemAtIndex:function(a){this._selectItemAtIndex=a;
this._selectedIndex=this._selectItemAtIndex
},setValue:function(d){if(this._value!==d){for(var c=0;
c<this._dataProvider.getData().items.length;
c++){var a=this._dataProvider.getData().items[c].value;
var b=d.value;
if(a==b){this.selectItemAtIndex(c+this._currentIndex)
}}this._value=d;
this.fireEvent("inputChanged",{value:d})
}},_onAllSkinPartsReady:function(a){a.prevButton.addEvent("click",this._prevThumb.bind(this));
a.nextButton.addEvent("click",this._nextThumb.bind(this))
},_nextThumb:function(a){if(this._currentIndex+this._numToShow>=this._fullDataProvider.get("items").length){return
}this._currentIndex+=this._numToShow;
this._prepareForRender()
},_prevThumb:function(a){if(this._currentIndex-this._numToShow<0){return
}this._currentIndex-=this._numToShow;
this._prepareForRender()
},getAcceptableDataTypes:function(){return["list",""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.ThumbGalleryItem",imports:[],skinParts:{container:{type:"htmlElement"},icon:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],_states:["selected","up"],_onAllSkinPartsReady:function(){this._skinParts.container.set("title",this._data.get("label"));
this._skinParts.icon.setStyle("background-image","url("+this._data.get("iconUrl")+")");
this._skinParts.icon.setStyle("background-repeat","no-repeat");
this._skinParts.icon.setStyle("background-position","center")
},getAcceptableDataTypes:function(){return["list"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.ToolTip",skinParts:{moreInfo:{type:"htmlElement"},title:{type:"htmlElement"},content:{type:"htmlElement"},isDontShowAgain:{type:"htmlElement"},isDontShowAgainCont:{type:"htmlElement"},moreHelp:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{isMoreLess:["isMoreLess"],isDontShowAgain:["isDontShowAgain"],moreHelp:["isMoreHelp"],hidden:["hidden","visible"]},Binds:["initialize","_callTip","_showTip","_mouseOut","_mouseIn","_timerToClose","_closeToolTipCmd","_showToolTipCmd"],options:{tipId:"",cookieName:"tips",mouseInside:false},actions:{moreInfo:function(){this[0].removeState("isMoreLess","isMoreLess")
},dontShow:function(){this[0]._dontShow(this[1])
},moreHelp:function(){this[0]._goToHellp(this[1])
}},initialize:function(c,a,b){this.parent(c,a,b);
W.Commands.registerCommandAndListener("Tooltip.ShowTip",this,this._showToolTipCmd);
W.Commands.registerCommandAndListener("Tooltip.CloseTip",this,this._closeToolTipCmd);
W.Commands.registerCommandListenerByName("WEditorCommands.WSetEditMode",this,function(d){if(d.editMode==W.Editor.EDIT_MODE.PREVIEW||d.previousEditMode==W.Editor.EDIT_MODE.PREVIEW){this._closeTip()
}});
this.tipNode=this.getViewNode();
this.tipNode.addEvent("click",this._handleEvent);
this.tipNode.addEvent("mouseleave",this._mouseOut);
this.tipNode.addEvent("mouseenter",this._mouseIn);
document.addEvent("keyup",this._mouseOut);
this.setState("hidden");
this.getViewNode().setStyles({top:0,left:0})
},_tipToShow:"",_closeToolTipCmd:function(){this._tipToShow="";
this._hideToolTipTimeOut=setTimeout(function(){if(!this.options.mouseInside){this._closeTip()
}}.bind(this),150)
},_showToolTipCmd:function(b,a){this._shouldShowTooltipAfterTimout=true;
this._tipToShow=b.id;
clearTimeout(this._hideToolTipTimeOut);
window.setTimeout(function(){if(this._shouldShowTooltipAfterTimout&&this._tipToShow===b.id){this._callTip(b,a)
}}.bind(this),100)
},render:function(){this.parent()
},_onAllSkinPartsReady:function(){this._skinParts.moreInfo.set("text",W.Resources.get("EDITOR_LANGUAGE","MORE_INFO"));
this._skinParts.isDontShowAgainCont.appendText(W.Resources.get("EDITOR_LANGUAGE","DONT_SHOW_AGAIN"))
},_handleEvent:function(d){var a=d.target;
if(a.get("href")){d.preventDefault()
}var b=this.getLogic();
var c=a.get("action");
if(c){(b.actions[c].bind([b,a]))()
}},_isToolTipMarkedAsDontShow:function(a){return W.CookiesManager.getCookieParams(this.options.cookieName).indexOf(a)>=0
},_getToolTipFromMap:function(a){return W.Data.dataMap.TOOLTIPS._data.toolTips[a]||false
},_setToolTipValues:function(b){var c=this.injects().Resources;
var d=c.replacePlaceholders("EDITOR_LANGUAGE",b.title);
var a=c.replacePlaceholders("EDITOR_LANGUAGE",b.content);
this._skinParts.title.set("html",d);
this._skinParts.content.set("html",a);
this._setState(b.isMoreLess,"isMoreLess");
this._skinParts.moreInfo.setCollapsed(!b.isMoreLess);
this._setState(b.isDontShowAgain,"isDontShowAgain");
this._skinParts.isDontShowAgainCont.setCollapsed(!b.isDontShowAgain);
this._tipHelp(b.help)
},_getToolTipCallerNode:function(a){if(typeOf(a.source)=="element"){return a.source
}return a.source.getViewNode()
},_callTip:function(c,b){if(this._isToolTipMarkedAsDontShow(c.id)){return
}var a=this._getToolTipFromMap(c.id);
if(!a){return false
}this._resetToolTip();
this.options.tipId=c.id;
this._setToolTipValues(a);
this._showTip(this._getToolTipCallerNode(b))
},_resetToolTip:function(){for(var a in this.skinParts){this._skinParts[a].empty()
}this._skinParts.isDontShowAgain.checked=false
},_showTip:function(a){var c=this.getViewNode();
var b=this._getPosition(a,c);
c.setStyles({top:b.y,left:b.x[0],right:b.x[1]});
this.removeState("hidden","hidden");
this._timerToClose(c,a)
},_timerToClose:function(b,a){var c;
this.onCallerMove=function(){this.options.onCallerMouseMoveWasCalled=true;
$(document.body).removeEvent("mousemove",this.onCallerMove)
}.bind(this);
$(document.body).addEvent("mousemove",this.onCallerMove);
this.checkIfOut=function(){if(this.options.mouseInside||!this.options.onCallerMouseMoveWasCalled){this.createTimer()
}else{}}.bind(this);
this.createTimer=function(){c=setTimeout(this.checkIfOut,3000)
};
this.createTimer()
},_getPosition:function(e,b){var j=e.getPosition();
var c=e.getHeight();
var l=e.getWidth();
var f=j.y;
var g=j.x;
var k=b.getHeight();
var p=b.getWidth();
var a=f-(c/2);
var d=g-(p/2);
var o=window.innerWidth;
var i=window.innerHeight;
var n=f-k;
var h=d;
var q="auto";
if(n-document.body.getScroll().y<0){var m=f+k;
if(m>i+document.body.getScroll().y+k){if(f<0){m=f
}else{m=document.body.getScroll().y
}}n=m>0?m:0
}if(h<0){h=g
}else{if(h>o){h="auto";
q=g+l
}}return{x:[h,q],y:n}
},_tipHelp:function(b){var a=b.isMoreHelp&&!!b.text&&!!b.url&&b.text!=""&&b.url!="";
if(a){this.setState("isMoreHelp");
this._skinParts.moreHelp.set("text",b.text);
this._skinParts.moreHelp.set("href",b.url)
}else{this.removeState("isMoreHelp")
}this._skinParts.moreHelp.setCollapsed(!a)
},_setState:function(a,b){a?this.setState(b):this.removeState(b)
},_goToHellp:function(b){var a=this.injects().Config.getHelpServerUrl();
var c=a+"/"+b.get("href");
W.EditorDialogs.openHelpDialog(c)
},_closeTip:function(){this._shouldShowTooltipAfterTimout=false;
this.options.onCallerMouseMoveWasCalled=false;
this.setState("hidden");
this.getViewNode().setStyles({top:0,left:0})
},_dontShow:function(a){var b=(a.getElement("input")&&a.getElement("input").get("checked"))||a.get("checked");
if(b){W.CookiesManager.setCookieParam(this.options.cookieName,this.options.tipId)
}else{W.CookiesManager.removeCookieParam(this.options.cookieName,this.options.tipId)
}},_mouseOut:function(a){this.options.mouseInside=false;
this._closeTip()
},_mouseIn:function(a){this.options.mouseInside=true
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.Toolbar",Class:{Extends:"mobile.core.components.base.BaseComponent"}});
W.Components.newComponent({name:"wysiwyg.editor.components.TopToolbar",skinParts:{mainTabs:{type:"wysiwyg.editor.components.Tabs",dataQuery:"#TOP_TABS"},mainButtons:{type:"wysiwyg.editor.components.Tabs",dataQuery:"#TOP_BUTTONS",argObject:{isToggle:false}}},Class:{Extends:"mobile.core.components.base.BaseComponent",initialize:function(c,b,a){this.parent(c,b,a)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.WButton",skinParts:{icon:{type:"htmlElement",optional:"true"},label:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.Button",_states:["up","over","selected","pressed"],_triggers:["click"],initialize:function(c,a,b){this._replaceLanguageKey(b);
this.parent(c,a,b);
this._spriteOffset=b.spriteOffset||{x:"50%",y:"50%"};
this._minWidth=b.minWidth||0;
this._iconSize=b.iconSize||null
},_replaceLanguageKey:function(a){if(a&&a.label&&a.labelType==="langKey"&&this.injects().Resources){a.label=this.injects().Resources.get("EDITOR_LANGUAGE",a.label,a.label)
}},render:function(){this._skinParts.label.set("html",this._label||"");
this._skinParts.label.setStyle("min-width",parseInt(this._minWidth,10)+"px");
if(this._skinParts.icon){if(this._iconSrc){var a=this._getIconUrl(this._iconSrc);
if(!isNaN(this._spriteOffset.x)){this._spriteOffset.x+="px"
}if(!isNaN(this._spriteOffset.y)){this._spriteOffset.y+="px"
}var b=["url("+a+")","no-repeat",this._spriteOffset.x,this._spriteOffset.y].join(" ");
this._skinParts.icon.setStyle("background",b);
this._skinParts.icon.uncollapse()
}else{this._skinParts.icon.setStyle("background","");
this._skinParts.icon.collapse()
}if(this._iconSize&&this._iconSize.width&&this._iconSize.height){if(!isNaN(this._iconSize.width)){this._iconSize.width+="px"
}if(!isNaN(this._iconSize.height)){this._iconSize.height+="px"
}this._skinParts.icon.setStyles({width:this._iconSize.width,height:this._iconSize.height,marginTop:(Math.floor(parseInt(this._iconSize.height)/2)*(-1))+"px"});
this._skinParts.label.setStyle("margin-left",this._iconSize.width)
}}},_getIconUrl:function(a){return this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")+a
},setIcon:function(c,a,b){this._iconSrc=c;
this._iconSize=a;
this._spriteOffset=b||{x:"50%",y:"50%"};
this._renderIfReady()
},setMinWidth:function(a){this._minWidth=a;
this._renderIfReady()
},setFocus:function(){this._view.focus()
},setParameters:function(a){a=a||{};
this._spriteOffset=a.spriteOffset||{x:"50%",y:"50%"};
this._minWidth=a.minWidth||0;
this._iconSize=a.iconSize||null;
this.parent(a)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.WEditorPreview",skinParts:{mouseEventCatcher:{type:"htmlElement"},previewLoading:{type:"htmlElement"},previewContainer:{type:"htmlElement"},viewFullSize:{type:"htmlElement"}},Class:{Extends:"mobile.editor.components.EditorPreview",Binds:["_mouseDownHandler","_onPreviewResized","_onWindowScroll"],_states:{readyState:["ready","loading"],editStateBar:[Constants.EditorUI.EDIT_STATE_BAR_VISIBLE,Constants.EditorUI.EDIT_STATE_BAR_HIDDEN]},initialize:function(c,a,b){this.injects().Preview.addEvent("previewResized",this._onPreviewResized);
this.parent(c,a,b)
},render:function(){this.yOffset=this._skinParts.mouseEventCatcher.getPosition().y;
this.initMouseEventsProxy();
this.parent()
},_onAllSkinPartsReady:function(){window.addEvent(Constants.CoreEvents.SCROLL,this._onWindowScroll)
},_onWindowScroll:function(a){this._previewFrame=this._previewFrame||this.injects().Preview.getIFrame();
this._bgNode=this._bgNode||this._previewFrame.contentWindow.document.getElementById("bgNode");
if(this._previewFrame.contentWindow){this._previewFrame.contentWindow.scrollTo(0,window.getScroll().y)
}else{this._previewFrame.contentDocument.window.scrollTo(0,window.getScroll().y)
}if(this._bgNode.style.position==="fixed"){this.injects().Utils.forceBrowserRepaintOnScroll(this._bgNode)
}},_onPreviewResized:function(a){this._previewHeight=a;
this._setHeightAccordingToMode()
},_setHeightAccordingToMode:function(){var a=100;
if(W.Editor.getEditMode()==W.Editor.EDIT_MODE.PREVIEW){a=0
}var b=this._previewHeight+a;
this._skinParts.mouseEventCatcher.setStyle("height",b);
this._skinParts.viewFullSize.setStyle("height",b)
},initMouseEventsProxy:function(){this._lastClickEvent={time:0,x:0,y:0};
this._skinParts.mouseEventCatcher.addEvent("mousedown",this._mouseDownHandler);
this._skinParts.mouseEventCatcherLeft.addEvent("mousedown",this._mouseDownHandler);
this._skinParts.mouseEventCatcherRight.addEvent("mousedown",this._mouseDownHandler);
this._skinParts.mouseEventCatcherTop.addEvent("mousedown",this._mouseDownHandler);
this._skinParts.mouseEventCatcherBottom.addEvent("mousedown",this._mouseDownHandler)
},_mouseDownHandler:function(b){b.stopPropagation();
var a=this.injects().Preview.componentFromGlobalCoordinates(b.client.x,b.client.y,W.Preview.selectionFilter);
this.injects().Editor.handleComponentClicked(a,b)
},_onToggleMouseCatcher:function(){var a=this._skinParts.mouseEventCatcher;
if(a.parentNode){a.parentNode.removeChild(a)
}else{this._skinParts.previewContainer.parentNode.appendChild(a)
}},setEditingMode:function(a){if(a){this._skinParts.mouseEventCatcher.setStyle("display","block")
}else{this._skinParts.mouseEventCatcher.setStyle("display","none")
}this._skinParts.mouseEventCatcherLeft.setStyle("display","none");
this._skinParts.mouseEventCatcherRight.setStyle("display","none");
this._skinParts.mouseEventCatcherTop.setStyle("display","none");
this._skinParts.mouseEventCatcherBottom.setStyle("display","none");
this._setHeightAccordingToMode()
},setInPlaceEditingMode:function(d){if(d){this._skinParts.mouseEventCatcher.setStyle("display","none");
var b=d._view.getPosition().x;
var a=d._view.getPosition().y;
var c=$(document).getSize();
this._skinParts.mouseEventCatcherLeft.setPosition({x:0,y:0});
this._skinParts.mouseEventCatcherLeft.setStyles({width:b,height:"100%",display:"block"});
this._skinParts.mouseEventCatcherRight.setPosition({x:b+d.getWidth(),y:0});
this._skinParts.mouseEventCatcherRight.setStyles({width:c.x-(b+d.getWidth()),height:"100%",display:"block"});
this._skinParts.mouseEventCatcherTop.setPosition({x:b,y:0});
this._skinParts.mouseEventCatcherTop.setStyles({width:d.getWidth(),height:a,display:"block"});
this._skinParts.mouseEventCatcherBottom.setPosition({x:b,y:a+d.getHeight()});
this._skinParts.mouseEventCatcherBottom.setStyles({width:d.getWidth(),height:c.y-(a+d.getHeight()),display:"block"})
}else{this._skinParts.mouseEventCatcher.setStyle("display","block");
this._skinParts.mouseEventCatcherLeft.setStyle("display","none");
this._skinParts.mouseEventCatcherRight.setStyle("display","none");
this._skinParts.mouseEventCatcherTop.setStyle("display","none");
this._skinParts.mouseEventCatcherBottom.setStyle("display","none")
}},getPreviewPosition:function(){return this._skinParts.previewContainer.getPosition()
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.WSitePageController",skinParts:{container:{type:"htmlElement"}},Class:{Extends:"mobile.editor.components.SitePageController",_states:["normal","masterPageMode"],Binds:["_onItemDrag"],_drag:null,initialize:function(c,a,b){this.parent(c,a,b)
},_getItemsData:function(){if(this._data){return this._data.get("pages")
}},getItemClassName:function(){return"wysiwyg.editor.components.SitePageButton"
},_onAllSkinPartsReady:function(){this.parent()
},_onItemReady:function(b,a,d){this.parent(b,a,d);
var c=function(f){this._onItemDrag(f,b)
}.bind(this);
b._registerDragHandler(c);
var e=function(){b.getParentComponent().getParentComponent()._onPageSettings(b._data.get("id"))
};
b._pageSettingsCallback(e)
},_onItemDrag:function(p,a){var k=function(i){if(!i.which&&i.button){if(i.button&1){i.which=1
}else{if(i.button&4){i.which=2
}else{if(i.button&2){i.which=3
}}}}};
k(p.event);
if(p.event.which!=1||this.injects().Editor.getPageCount()==1){return
}if(this._drag){return
}var f=a.getViewNode();
var h=f.getSize();
var e=f.getPosition();
var c=f.clone();
c.set("styles",{opacity:"0.25",position:"absolute",left:String(e.x)+"px",top:String(e.y)+"px",width:h.x+"px",border:"2px solid green"});
var g=$$("body")[0];
g.appendChild(c);
var j=this._itemsNodes;
var o=[];
var b=-1;
for(var m=j.length-1;
m>=0;
--m){var q=j[m];
if(q!=f){q._dragIndex=m;
o.push(q)
}else{b=m
}}var s=function(i){i.destroy();
$$(o).forEach(function(u){var t=u.getLogic().getSkin();
u.removeClass(t.dragAboveClassName).removeClass(t.dragBelowClassName);
u.removeEvents(l);
delete u._dragIndex
});
this._drag=null
}.bind(this);
var d=null;
var r=this;
var l={container:this._view,droppables:o,onComplete:s,onCancel:s,onEnter:function(i,u){if(d){var t=d.getLogic().getSkin();
d.removeClass(t.dragAboveClassName).removeClass(t.dragBelowClassName)
}if(u&&u._dragIndex!=b){u.addClass(u.getLogic().getSkin().dragBelowClassName)
}d=u
},onDrop:function(i,u){var t;
if(!u){if(d){t=0;
u=d
}}else{t=u._dragIndex+1
}if(u){r._onItemDropped(a,t)
}},onLeave:function(i,u){if(u){var t=u.getLogic().getSkin();
u.removeClass(t.dragBelowClassName);
if(u==d){if(0==u._dragIndex){u.addClass(t.dragAboveClassName)
}else{d=null
}}}}};
var n=c.makeDraggable(l);
this._drag=n;
n.start(p);
return false
},_onItemDropped:function(b,a){this._reorderPagesData(b.getDataItem().get("id"),a)
},_reorderPagesData:function(b,e){var a=Array.clone(this._data.get("pages"));
var f=a.indexOf("#"+b);
if(f==e){return
}e=e>f?e-1:e;
a.splice(e,0,a.splice(f,1)[0]);
this._data.set("pages",a);
var d=this.injects().Preview.getPreviewSite();
var c=d.$$(a[e]).dispose();
if(e<a.length-1){c.insertInto(d.$$(a[e+1])[0],"before",Constants.DisplayEvents.MOVED_IN_DOM)
}else{c.insertInto(d.$$(a[e-1])[0],"after",Constants.DisplayEvents.MOVED_IN_DOM)
}this.injects().Utils.callOnNextRender(function(){this.injects().Preview.getPreviewManagers().Viewer.indexPages("#SITE_PAGES")
}.bind(this));
this.injects().Preview.getPreviewManagers().Viewer.indexPages("#SITE_PAGES")
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.ChooseStyleDialog",skinParts:{},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_itemOver","_itemOut","_itemClick","_onDialogClosing","_validateStyle","_editStyleClicked"],initialize:function(c,a,b){this.parent(c,a,b);
this._dialogWindow=b.dialogWindow;
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing)
},getInlineContentContainer:function(){return this._view
},setEditedComponent:function(b){this.disposeFields();
this._editedComponent=b;
this._originalStyle=b.getStyle().getId();
this._currentlySelectedStyle=b.getStyle().getId();
var f=this._data.get("styleItems");
var a=[];
var h=f[this._editedComponent.getOriginalClassName()];
var g;
for(var c=0;
c<h.length;
c++){var d=W.Data.createDataItem({type:"Button",label:this.injects().Resources.get("EDITOR_LANGUAGE","COMPONENT_STYLE_"+h[c]),commandParameter:h[c]},"Button");
if(h[c]==this._originalStyle){g=c
}a.push(d)
}var e=this.addSelectionListInputField("",a,null,{type:"wysiwyg.editor.components.ChooseStyleButton",skin:"wysiwyg.editor.skins.buttons.ChooseStyleButtonSkin",numRepeatersInLine:1});
e.selectItemAtIndex(g);
e.addEvent("itemOver",this._itemOver);
e.addEvent("itemOut",this._itemOut);
e.addEvent("inputChanged",this._itemClick);
e.addEvent("editStyleClicked",this._editStyleClicked)
},_editStyleClicked:function(a){var b=W.Commands.getCommand("WEditorCommands.CustomizeComponentStyle");
a.params.editedComponent=this._editedComponent;
b.execute(a.params)
},_itemOver:function(a){this._styleToApply=a.data.commandParameter;
this._invalidateStyle()
},_itemOut:function(a){this._styleToApply=this._currentlySelectedStyle;
this._invalidateStyle()
},_itemClick:function(a){this._styleToApply=a.value.commandParameter||a.value.get("commandParameter");
this._setStyleByID(this._styleToApply);
this._currentlySelectedStyle=this._styleToApply
},_invalidateStyle:function(){if(!this._styleRenderCall){this._styleRenderCall=this.injects().Utils.callLater(this._validateStyle,undefined,undefined,150)
}},_validateStyle:function(){this._setStyleByID(this._styleToApply);
delete this._styleRenderCall
},_setStyleByID:function(c){var b=this.injects().Preview.getPreviewManagers().Theme.isStyleAvailable(c);
if(b){this.injects().Preview.getPreviewManagers().Theme.getStyle(c,function(d){this._editedComponent.setStyle(d)
}.bind(this))
}else{var a=W.Editor.getDefaultSkinForStyle(c)||W.Editor.getDefaultSkinForComp(this._editedComponent.className)||this._editedComponent.getSkin().className;
this.injects().Preview.getPreviewManagers().Theme.createStyle(c,this._editedComponent.className,a,function(d){this._editedComponent.setStyle(d)
}.bind(this))
}},_createFields:function(){},_onDialogClosing:function(a){if(a.result=="CANCEL"){this._setStyleByID(this._originalStyle)
}},getAcceptableDataTypes:function(){return["StyleList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.ColorAdjuster",skinParts:{color:{type:"htmlElement"},oldColor:{type:"htmlElement"},content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onChange","_onDialogClosing"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._originalColor=b.color;
if(!b.alpha&&b.alpha!=0){this._alpha=this._originalAlpha=100
}else{this._alpha=this._originalAlpha=b.alpha*100
}this._dialogWindow=b.dialogWindow;
this._onClose=b.closeCallback;
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing);
this._changeCB=b.onChange
},_onAllSkinPartsReady:function(){this._skinParts.color.addEvent("mouseenter",function(){W.Commands.executeCommand("Tooltip.ShowTip",{id:"Customize_Color_color_area_right_ttid"},this._skinParts.color)
}.bind(this));
this._skinParts.color.addEvent("mouseleave",function(){W.Commands.executeCommand("Tooltip.CloseTip")
}.bind(this));
this._skinParts.oldColor.addEvent("mouseenter",function(){W.Commands.executeCommand("Tooltip.ShowTip",{id:"Customize_Color_color_area_left_ttid"},this._skinParts.oldColor)
}.bind(this));
this._skinParts.oldColor.addEvent("mouseleave",function(){W.Commands.executeCommand("Tooltip.CloseTip")
}.bind(this))
},_createFields:function(){this._onChange();
this._setOriginalColor();
var a=30;
var b=this.injects().Resources.get("EDITOR_LANGUAGE","ADJUST_DIALOG_OPACITY");
var c=this.addSliderField(b,0,100,1,false,false,true).addEvent("inputChanged",function(d){this._alpha=Number(d.value);
this._onChange()
}.bind(this));
c.setValue(this._alpha)
},_refreshColor:function(){this._color=new W.Color(this._originalColor);
this._color.setAlpha(this._alpha/100)
},_setOriginalColor:function(){var a=new W.Color(this._originalColor);
a.setAlpha(this._originalAlpha/100);
this._skinParts.oldColor.setStyles({"background-color":a.getHex()});
if(!window.Browser.ie){this._skinParts.oldColor.setStyle("opacity",a.getAlpha())
}else{this._skinParts.oldColor.setStyle("filter","alpha(opacity="+a.getAlpha()*100+")")
}},_onChange:function(){this._refreshColor();
this._skinParts.color.setStyles({"background-color":this._color.getHex()});
if(!window.Browser.ie){this._skinParts.color.setStyle("opacity",this._color.getAlpha())
}else{this._skinParts.color.setStyle("filter","alpha(opacity="+this._color.getAlpha()*100+")")
}this._changeCB({alpha:this._alpha/100})
},_onDialogClosing:function(a){if(a.result==W.EditorDialogs.DialogButtons.CANCEL){this._changeCB({alpha:this._originalAlpha/100})
}if(a.result==W.EditorDialogs.DialogButtons.OK||a.result==Constants.DialogWindow.CLICK_OUTSIDE){this._onClose({alpha:this._alpha/100})
}},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.ColorSelector",skinParts:{content:{type:"htmlElement"},customColorLink:{type:"htmlElement",autoBindDictionary:"SELECT_COLOR_DIALOG_CUSTOM"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onColorButtonSelected","_openCustomColorPicker","_onCustomColorPickerReady","_onCustomColorPickerClose"],initialize:function(c,a,b){this.parent(c,a,b);
this._createPaletteButtons();
this._closeCommand=this.injects().Commands.createCommand("cp");
this._changeCB=b.onChange;
this._dialogWindow=b.dialogWindow;
if(b.colorSource==="theme"){this._selectedColorName=b.color;
this._selectedColor=this.injects().Preview.getPreviewManagers().Theme.getProperty(b.color)
}else{this._selectedColorName="";
this._selectedColor=b.color
}this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing)
},render:function(){this.parent();
this._skinParts.customColorLink.addEvent("click",this._openCustomColorPicker)
},_createPaletteButtons:function(){var d=this.injects().Preview.getPreviewManagers().Theme;
var c=d.getPropertiesAccordingToType("color");
this._colorProperties=[];
for(var b=0,a=c.length;
b<a;
b++){this._colorProperties[b]={name:c[b],value:d.getProperty(c[b])}
}},_addColorSelectionButton:function(a){var b=this._selectedColorName;
return this.addColorSelectorButtonField(a.name,a.value).addEvent(Constants.CoreEvents.CLICK,this._onColorButtonSelected).runWhenReady(function(c){c.toggleSelected(a.name==b)
})
},_onColorButtonSelected:function(a){this._onColorSelected(a.value,"theme")
},_createFields:function(){var c=Constants.Theme.COLOR_SUB_PALETTE_SIZE;
var g=this.injects().Preview.getPreviewManagers().Theme.getPropertiesAccordingToType("color");
var e=Constants.Theme.COLOR_PALETTE_INDEX;
var a=((g.length-e))/c;
this.setNumberOfItemsPerLine(c,"0px");
for(var d=0;
d<a;
d++){var b=0;
while(b<c){var h=e+d+(b*c);
var f=g[h];
if(f.indexOf("color_")==0){this._addColorSelectionButton(this._colorProperties[h])
}b++
}}this._addColorSelectionButton(this._colorProperties[1]);
this._addColorSelectionButton(this._colorProperties[2]);
this._addColorSelectionButton(this._colorProperties[3]);
this._addColorSelectionButton(this._colorProperties[4]);
this._addColorSelectionButton(this._colorProperties[5])
},_onColorSelected:function(a,b){this._changeCB(a,b);
this._dialogWindow.closeDialog()
},_openCustomColorPicker:function(b){var a=new W.Color(this._selectedColor);
this.injects().Editor.getColorPicker(this._onCustomColorPickerReady,{color:a,allowAlpha:false,event:b})
},_onCustomColorPickerReady:function(a){this._colorPicker=a;
this._colorPicker.addEvent("close",this._onCustomColorPickerClose)
},_onCustomColorPickerClose:function(a){if(a.cause==="ok"){this._onColorSelected(a.color,"value")
}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.FontPicker",skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onBlur","_onBeforeClose"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._font=b.font;
this._originalFont=this._font;
this._dialogWindow=b.dialogWindow;
this._changeCB=b.onChange;
this.setDataItem(this.injects().Data.createDataItem({font:this._font},"Font"));
this._dialogWindow.addEvent("onDialogClosing",this._onBeforeClose)
},_createFields:function(){this.addInputGroupField(function(){this.addFontFamilyField(this.injects().Resources.get("EDITOR_LANGUAGE","FONT_FAMILY_LABEL")).bindToField("font")
});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(3,"7px");
this.addLabel(this.injects().Resources.get("EDITOR_LANGUAGE","FONT_STYLE_LABEL"));
this.addBreakLine();
this.addFontSizeField().bindToField("font");
this.addFontStyleField().bindToField("font");
this.addFontColorField().bindToField("font")
})
},_onBeforeClose:function(c){var b="cancel";
var a=this._originalFont;
if(c&&c.result=="OK"){b="ok";
a=this._font
}this._changeCB({font:a,cause:b})
},_onDataChange:function(a){this._font=a.get("font");
this._changeCB({font:this._font,cause:"temp"})
},getAcceptableDataTypes:function(){return["","Font"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.InputDialog",skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onDialogClosing","_inputChanged"],initialize:function(c,a,b){this.parent(c,a,b);
this.args=b;
this.addEvent("dialogClosed",this._onDialogClose)
},_onAllSkinPartsReady:function(a){this.parent();
this._labelText=this.args.labelText;
this._placeholderText=this.args.placeholderText;
this._dialogWindow=this.args.dialogWindow;
this._okCallback=this.args.okCallback;
this._inputValue=this._placeholderText;
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing)
},_onDialogClosing:function(a){if(a.result=="OK"){if(this._okCallback){this._okCallback(this._inputValue)
}}},_createFields:function(){this.addInputField(this._labelText,this._placeholderText).addEvent("inputChanged",this._inputChanged)
},_inputChanged:function(a){this._inputValue=a.value
}}});
Constants.LinkState={NO_LINK:"None"};
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.LinkDialog",imports:["mobile.core.components.traits.LinkableComponent"],skinParts:{back:{type:"wysiwyg.editor.components.WButton"},content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_setState","_onDialogClosing","_initValidators","_onRemoveLink","validateEmail","validateWebUrl","_clearLinkData"],initialize:function(c,a,b){this.parent(c,a,b);
this._dialogParts=[];
this._closeDialogCB=b.closeCallback;
this.linkData=b.linkData||null;
this._previewData=b.data;
this._data=this.injects().Data.createDataItem({},"Link");
this._data.copySchemaFieldsFrom(this._previewData,true);
this._state=this._previewData.get("linkType")||Constants.LinkState.NO_LINK;
this._dialogWindow=b.dialogWindow;
this._initValidators();
this._dialogWindow=b.dialogWindow;
if(this._onDialogClosing){this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing)
}this._onDialogOpen()
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.back.setIcon("icons/sidepanel_top_arrows.png",null,{x:0,y:0});
this._skinParts.back.setLabel(this.injects().Resources.getCur("LINK_DLG_BACK_TO_OPTIONS"));
this._skinParts.back.addEvent(Constants.CoreEvents.CLICK,function(){this._setState(this.imports.LinkableComponent.linkType.FREE_LINK)
}.bind(this))
},_onDialogOpen:function(){var a=this._data.get("href");
if(a){switch(this._state){case this.imports.LinkableComponent.linkType.PAGE:break;
case this.imports.LinkableComponent.linkType.WEBSITE:break;
case this.imports.LinkableComponent.linkType.DOCUMENT:break;
case this.imports.LinkableComponent.linkType.EMAIL:this._data.set("href",W.Utils.getMailFromMailtoURL(a));
break;
default:}}},_onDialogClosing:function(b){var a=this._data.get("href");
if(a){switch(this._state){case this.imports.LinkableComponent.linkType.PAGE:this._setTargetSameWindow();
this.getDataItem().set("target",this.imports.LinkableComponent.linkTarget.SAME_WINDOW);
break;
case this.imports.LinkableComponent.linkType.WEBSITE:this._verifyWebProtocol(this.getDataItem());
break;
case this.imports.LinkableComponent.linkType.DOCUMENT:this._setTargetNewWindow();
break;
case this.imports.LinkableComponent.linkType.EMAIL:this._setTargetNewWindow();
this._verifyEmailProtocol(this.getDataItem());
break;
case this.imports.LinkableComponent.linkType.LOGIN:if(this._loginDialogData){this._data.set("text",JSON.stringify(this._loginDialogData))
}break;
default:}}else{this._clearLinkData()
}this._data.copySchemaFieldsTo(this._previewData);
if(this._closeDialogCB){this._closeDialogCB(this._state,this._data,b)
}},_setTargetNewWindow:function(){this.getDataItem().set("target",this.imports.LinkableComponent.linkTarget.NEW_WINDOW)
},_setTargetSameWindow:function(){this.getDataItem().set("target",this.imports.LinkableComponent.linkTarget.SAME_WINDOW)
},_onRemoveLink:function(){this._clearLinkData();
this._dialogWindow.endDialog("OK")
},_setState:function(a){if(typeof(this.imports.LinkableComponent.linkType[a])=="undefined"){throw ("Error. bad state/link type: "+a)
}if(a!=this.imports.LinkableComponent.linkType.FREE_LINK){if(this._data.get("linkType")!=a){this._clearLinkData()
}this._data.set("linkType",a)
}this._state=a;
this._createFields()
},_createFields:function(){this._clearDialogParts();
switch(this._state){case this.imports.LinkableComponent.linkType.PAGE:this._createPageDialog();
break;
case this.imports.LinkableComponent.linkType.WEBSITE:this._createWebSiteDialog();
break;
case this.imports.LinkableComponent.linkType.DOCUMENT:this._createDocumentDialog();
break;
case this.imports.LinkableComponent.linkType.EMAIL:this._createEmailDialog();
break;
case this.imports.LinkableComponent.linkType.LOGIN:this._createLoginDialog();
break;
default:this._createLinkDialog()
}},_initValidators:function(){this._validators={};
this._validators.WEBSITE=[this.validateWebUrl];
this._validators.EMAIL=[this.validateEmail]
},_showBackButton:function(){this._skinParts.back.uncollapse()
},_hideBackButton:function(){this._skinParts.back.collapse()
},_createLinkDialog:function(){this._dialogWindow.setTitle(this.injects().Resources.getCur("LINK_DIALOG_DEFAULT_TITLE"));
this._dialogWindow.setDescription(this.injects().Resources.getCur("LINK_DIALOG_DESCRIPTION"));
this._hideBackButton();
var a=this.addInputGroupField(function(b){W.Data.getDataByQuery("#LINK_BUTTONS_TYPE",function(g){var c=g.get("items");
var f=0;
var e,d;
this.setNumberOfItemsPerLine(2,"5px");
c.forEach(function(h){d=b.injects().Resources.getCur(h.buttonLabel);
e=this.addButtonField(null,d,null,{iconSrc:"icons/link_icons.png",iconSize:{width:16,height:18},spriteOffset:h.spriteOffset},null,"95px").addEvent(Constants.CoreEvents.CLICK,function(){var i=b.imports.LinkableComponent.linkType[h.linkType];
b._setState(i)
}.bind(this));
if(h.onCreateCB){h.onCreateCB.apply(b,[e])
}}.bind(this));
if(b.getDataItem().get("href")){this.addBreakLine("20px");
this.setNumberOfItemsPerLine(1);
this.addButtonField("",b.injects().Resources.getCur("LINK_DLG_REMOVE_LINK"),null,null,"linkRight").addEvent(Constants.CoreEvents.CLICK,b._onRemoveLink)
}}.bind(this))
});
this._dialogParts.push(a)
},_createPageDialog:function(){this._dialogWindow.setTitle(this.injects().Resources.getCur("LINK_DIALOG_PAGE_TITLE"));
this._dialogWindow.setDescription("");
this._showBackButton();
var a=this.addInputGroupField(function(b){var f;
var e=[{label:"",value:""}];
var i=W.Preview.getPreviewManagers().Viewer.getPagesData();
if(i){for(f in i){var g=i[f];
var j=g.get("title");
var c=g.get("id");
var d="#!"+j+"/"+c;
e.push({label:j,value:d})
}var h=this.addComboBoxField(this.injects().Resources.getCur("LINK_DLG_SELECT_PAGE"),e).bindToField("href");
h.setFocus()
}if(this.getDataItem().get("href")){this.addBreakLine("20px");
this.addButtonField("",this.injects().Resources.getCur("LINK_DLG_REMOVE_LINK"),null,null,"linkRight").addEvent(Constants.CoreEvents.CLICK,b._onRemoveLink)
}});
this._dialogParts.push(a)
},_createWebSiteDialog:function(){this._dialogWindow.setTitle(this.injects().Resources.getCur("LINK_DIALOG_WEB_TITLE"));
this._dialogWindow.setDescription("");
this._showBackButton();
var a=this.addInputGroupField(function(b){var d={text:"href",href:"href",target:"target"};
var e=this.addInputField(b.injects().Resources.getCur("LINK_DLG_TYPE_URL"),b.injects().Resources.getCur("LINK_DLG_URL_EXAMPLE"),null,null,{validators:b._validators.WEBSITE}).bindToField("href");
e.setFocus();
var c=[{label:b.injects().Resources.getCur("LINK_DLG_OPT_OPEN_IN_NEW"),value:b.imports.LinkableComponent.linkTarget.NEW_WINDOW},{label:b.injects().Resources.getCur("LINK_DLG_OPT_OPEN_IN_SAME"),value:b.imports.LinkableComponent.linkTarget.SAME_WINDOW}];
this.addRadioButtonsField("",c,b.imports.LinkableComponent.linkTarget.NEW_WINDOW,"webSiteWindow").bindToField("target");
if(this.getDataItem().get("href")){this.addBreakLine("20px");
this.addButtonField("",this.injects().Resources.getCur("LINK_DLG_REMOVE_LINK"),null,null,"linkRight").addEvent(Constants.CoreEvents.CLICK,b._onRemoveLink)
}});
this._dialogParts.push(a)
},_createDocumentDialog:function(){var c=this;
this._dialogWindow.setTitle(this.injects().Resources.getCur("LINK_DIALOG_DOC_TITLE"));
this._dialogWindow.setDescription("");
this._showBackButton();
var b="";
var e=serviceTopology.staticMediaUrl.replace("media","ugd")+"/";
e=e.replace("static.","media.")+"/";
var a=e.length;
var f={text:"title",href:"uri",target:"target"};
var h=function(i){if(i&&i.href){i.href=i.href.substr(e.length)
}return i
};
var d=function(i){if(i&&i.uri){i.uri=e+i.uri
}i.target=c.imports.LinkableComponent.linkTarget.NEW_WINDOW;
return i
};
var g=this.addInputGroupField(function(i){var j=this.addUserDocField(i.injects().Resources.getCur("LINK_DLG_SELECT_DOC"),b).bindToRemappedDataFields(f).bindHooks(d,h);
j.setFocus();
if(this.getDataItem().get("href")){this.addBreakLine("20px");
this.addButtonField("",this.injects().Resources.getCur("LINK_DLG_REMOVE_LINK"),null,null,"linkRight").addEvent(Constants.CoreEvents.CLICK,i._onRemoveLink)
}});
this._dialogParts.push(g)
},_createEmailDialog:function(){this._dialogWindow.setTitle(this.injects().Resources.getCur("LINK_DIALOG_EMAIL_TITLE"));
this._dialogWindow.setDescription("");
this._showBackButton();
var a=this.addInputGroupField(function(b){var c=this.addInputField(b.injects().Resources.getCur("LINK_DLG_TYPE_EMAIL"),this.injects().Resources.getCur("LINK_DLG_EMAIL_EXAMPLE"),undefined,undefined,{validators:b._validators.EMAIL}).bindToField("href");
c.setFocus();
this.addInputField(b.injects().Resources.getCur("LINK_DLG_EMAIL_TITLE"),this.injects().Resources.getCur("LINK_DLG_EMAIL_TITLE_EXAMPLE")).bindToField("text");
if(this.getDataItem().get("href")){this.addBreakLine("20px");
this.addButtonField("",this.injects().Resources.getCur("LINK_DLG_REMOVE_LINK"),null,null,"linkRight").addEvent(Constants.CoreEvents.CLICK,b._onRemoveLink)
}});
this._dialogParts.push(a)
},_createLoginDialog:function(){this._dialogWindow.setTitle(this.injects().Resources.getCur("LINK_DIALOG_LOGIN_TITLE"));
this._dialogWindow.setDescription("");
this._showBackButton();
var a=this.addInputGroupField(function(b){this._data.set("href","#");
var c=this._data.get("text")||"{}";
c=JSON.parse(c);
this.addInputField(b.injects().Resources.getCur("LINK_DLG_TYPE_POST_LOGIN_URL"),"",undefined,undefined,null).runWhenReady(function(d){b._initializeLoginDialogField(d,"postLoginUrl",c)
});
this.addInputField(b.injects().Resources.getCur("LINK_DLG_TYPE_POST_SIGNUP_URL"),"",undefined,undefined,null).runWhenReady(function(d){b._initializeLoginDialogField(d,"postSignupUrl",c)
});
this.addComboBoxField("Start With",[{label:b.injects().Resources.getCur("LINK_DLG_LOGIN_OPT_LOGIN_TAB"),value:"login"},{label:b.injects().Resources.getCur("LINK_DLG_LOGIN_OPT_SIGNUP_TAB"),value:"createUser"}],"login",2).runWhenReady(function(d){b._initializeLoginDialogField(d,"type",c)
})
});
this._dialogParts.push(a)
},_initializeLoginDialogField:function(b,c,a){this._loginDialogData=this._loginDialogData||{};
b._view.addEvent("change",function(){this._loginDialogData[c]=b.getValue()
}.bind(this));
if(a[c]){b.setValue(a[c])
}this._loginDialogData[c]=b.getValue()
},_clearDialogParts:function(){for(var a=0;
a<this._dialogParts.length;
a++){this._dialogParts[a].dispose()
}this._dialogParts=[]
},validateWebUrl:function(a){var b=W.Utils.isValidUrlNoProtocol(a)||W.Utils.isValidUrl(a);
if(b){return false
}return this.injects().Resources.getCur("LINK_DLG_BAD_URL")
},validateEmail:function(b){var a=W.Utils.isValidEmail(b);
if(a){return false
}return this.injects().Resources.getCur("LINK_DLG_BAD_EMAIL")
},_verifyWebProtocol:function(c){var a=c.get("href");
a=a.trim();
if(!a){return
}var b=/^((http[s]?|ftp[s]?):\/\/)/;
if(!b.test(a)){a="http://"+a
}c.set("href",a);
if(!c.get("target")){c.set("target",this.imports.LinkableComponent.linkTarget.NEW_WINDOW)
}},_verifyEmailProtocol:function(c){var a=c.get("href");
var d=c.get("text");
a=a.trim();
d=d.trim();
if(!a){return
}var b=/^(mailto:)/;
if(!b.test(a)){a="mailto:"+a
}if(d){a=a+"?subject="+encodeURIComponent(d)
}c.set("href",a)
},_clearLinkData:function(){var a=this.getDataItem();
this._state=Constants.LinkState.NO_LINK;
a.setData({})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.ListEditDialog",imports:[],skinParts:{content:{type:"htmlElement"},splashScreen:{type:"wysiwyg.editor.components.inputs.AddImageScreen"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onPhotosAdded"],_states:{content:["normalContent","splashscreen"]},initialize:function(c,a,b){this.parent(c,a,b);
this._galleryConfigID=b.galleryConfigID||"photos";
this._showDescription=b.showDescription;
this._showTitle=b.showTitle;
this._showSplashScreen=b.showSplashScreen
},_onAllSkinPartsReady:function(){this._skinParts.splashScreen.addEvent("addImageRequested",function(){this.injects().EditorDialogs.openMediaDialog(this._onPhotosAdded,true,this._galleryConfigID)
}.bind(this));
this._skinParts.splashScreen.addEvent("keepPreset",function(){this._data.setMeta("isPreset",false);
this.injects().Preview.getPreviewManagers().Data.markDirtyObject(this._data);
this.setState("normalContent")
}.bind(this))
},_createFields:function(){var b=W.Resources.get("EDITOR_LANGUAGE","ADD_"+this._galleryConfigID.toUpperCase()+"_BUTTON_TEXT");
var a=W.Resources.get("EDITOR_LANGUAGE","GALLERY_OBJECT_"+this._galleryConfigID.toUpperCase());
var d=null;
var c;
this.setNumberOfItemsPerLine(2,"20px");
this.addInputGroupField(function(e){this.addButtonField(null,b,false,null,"blue").addEvent(Constants.CoreEvents.CLICK,function(){this.injects().EditorDialogs.openMediaDialog(e._onPhotosAdded,true,e._galleryConfigID)
});
this.addBreakLine("15px");
d=this.addDataItemSelectionListInputFieldWithDataProvider(null,this._data,null,{type:"wysiwyg.editor.components.inputs.SelectableListItem",skin:"wysiwyg.editor.skins.inputs.SelectableListItemSkin",numRepeatersInLine:1,height:"400px",width:"160px",scrollable:true,args:{width:95,height:95,unit:"px"}},"imagesList");
c.bindDataItemToValueOf(d);
d.selectFirst();
e._imageList=d
},"skinless");
c=this.addInputGroupField(function(e){var f=this.injects().Resources;
this.addImageField(null,100,450,W.Resources.get("EDITOR_LANGUAGE","IMAGE_REPLACE_ALT"),e._galleryConfigID,null,"gallery").bindToDataItem(this.getDataItem());
if(e._showTitle){this.addInputField(f.get("EDITOR_LANGUAGE","GENERAL_TITLE"),f.get("EDITOR_LANGUAGE","ORGANIZE_PHOTOS_DIALOG_IMAGE_TITLE_PH"),0,36,null,null).bindToField("title")
}if(e._showDescription){this.addTextAreaField(f.get("EDITOR_LANGUAGE","GENERAL_DESCRIPTION"),160,null,500,null,null,"Organize_Images_Dialog_Description_ttid").bindToField("description")
}this.addLinkField(f.get("EDITOR_LANGUAGE","LINK_LINK_TO"),null,null).bindToDataItem(this.getDataItem())
},"menus",null,null,{width:300,padding:"5px 0 0 0"}).createFieldsAfterDataUpdate();
this._imageDetailsListView=c.getHtmlElement();
this._checkDataState()
},_checkDataState:function(){if(this._skinParts){if(!this._showSplashScreen){this.setState("normalContent")
}else{if(this._data.get("items").length==0){this.setState("splashscreen");
this._skinParts.splashScreen.setState("emptyList")
}else{if(this._data.getMeta("isPreset")===true){this.setState("splashscreen");
this._skinParts.splashScreen.setState("presetList")
}else{this.setState("normalContent")
}}}}if(this._imageDetailsListView&&this._imageDetailsListView.getLogic){if(this._data.get("items").length==0){this._imageDetailsListView.getLogic().disable()
}else{this._imageDetailsListView.getLogic().enable()
}}},_onDataChange:function(){this.parent();
this._checkDataState()
},_onPhotosAdded:function(d){var a=this._data.get("items");
if(this._galleryConfigID!=="social_icons"){if(this._data.getMeta("isPreset")===true){a.splice(0,a.length);
this._data.setMeta("isPreset",false)
}}for(var c=0;
c<d.length;
c++){var b=this._getDataManager().addDataItemWithUniqueId("image",d[c]);
b.dataObject.setMeta("isPreset",false);
a.push("#"+b.id)
}this._imageList.selectItemAtIndex(a.length-1);
this._data.fireDataChangeEvent();
var e=this._imageList.getHtmlElement().getLogic();
e.addEvent("inputChanged",function(f){e.getViewNode().scrollTop=e.getViewNode().scrollHeight;
e.removeEvent("inputChanged",arguments.callee)
})
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.PublishFbSiteDialog",skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onPublishClick","_onSetUpFacebookPageClick","_onHelpSetUpFacebookPageClick","_onSupportPageClick"],initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._editorStatusAPI=this.injects().Editor.getEditorStatusAPI();
this._firstTimePublish=!this._editorStatusAPI.isPreviouslyPublished()
},_createFields:function(a){this.setSkinSet("FLOATING_DIALOG");
var b=this._firstTimePublish?this._translate("PUBLISH_FB_MAIN_LABEL_FIRSTTIME"):this._translate("PUBLISH_FB_MAIN_LABEL_NOT_FIRSTTIME");
this.addLabel(b);
if(this._firstTimePublish){this.addInlineTextLinkField(null,this._translate("PUBLISH_FB_SETUP_FB_PREFIX"),this._translate("PUBLISH_FB_SETUP_FB_LINK"),this._translate("PUBLISH_FB_SETUP_FB_POSTFIX")).addEvent(Constants.CoreEvents.CLICK,this._onSetUpFacebookPageClick)
}else{this.addSubLabel(this._translate("PUBLISH_FB_AUTOMATIC_CHANGE_LABEL"))
}this.addBreakLine("15px");
this.addInputGroupField(function(){var c=a._firstTimePublish?this._translate("PUBLISH_FB_PUBLISH_BUTTON_FIRSTTIME"):this._translate("PUBLISH_FB_PUBLISH_BUTTON_NOT_FIRSTTIME");
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addBreakLine("20px");
this.addButtonField(null,c,null,null,"blue").addEvent(Constants.CoreEvents.CLICK,a._onPublishClick)
},"skinless",null,null,null,"center")
},"skinless",null,null,null,"center");
this.addBreakLine("15px");
if(a._firstTimePublish){this.addInputGroupField(function(c){this.setNumberOfItemsPerLine(0);
this.addInlineTextLinkField(null,this._translate("PUBLISH_FB_HELP_SET_FB_PREFIX"),this._translate("PUBLISH_FB_HELP_SET_FB_LINK"),null).addEvent(Constants.CoreEvents.CLICK,c._onHelpSetUpFacebookPageClick);
this.addInlineTextLinkField(null,this._translate("PUBLISH_FB_MORE_INFO_PREFIX"),this._translate("PUBLISH_FB_MORE_INFO_LINK"),null).addEvent(Constants.CoreEvents.CLICK,c._onSupportPageClick)
},"skinless",null,null,null,"center")
}},_onPublishClick:function(a){this._dialogWindow.closeDialog();
this.injects().Commands.executeCommand("WEditorCommands.Publish");
this._openFacebookApplicationPage()
},_openFacebookApplicationPage:function(){var d=this.injects().Config.getUserPublicUrl();
var b=this.injects().Config.getMetaSiteId();
var c=this.injects().Preview.getPreviewManagers().Viewer.getSiteHeight();
var e=20;
var a=c+e;
window.open("http://fb.flashquix.com/wix/start.php?siteUrl="+d+"&h="+a+"&metaSiteId="+b+"&callback=json")
},_onSetUpFacebookPageClick:function(a){window.open("https://www.facebook.com/pages/create.php")
},_onHelpSetUpFacebookPageClick:function(a){window.open("https://www.facebook.com/pages/create.php")
},_onSupportPageClick:function(a){window.open("http://www.wix.com/support/main/html5/facebook/using-facebook-templates")
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.PublishFbSiteSuccessDialog",skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onViewLiveSiteClick","_onUpgradeNowClick","_closeDialog","_onCreateWebsiteClick","_onCreateMobileSiteClick","_onPromotePremiumClick","_markSiteAsPublishedBefore"],initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._editorStatusAPI=this.injects().Editor.getEditorStatusAPI();
this._firstTimePublish=!this._editorStatusAPI.isPreviouslyPublished();
this._isPremiumUser=this.injects().Config.isPremiumUser();
this._userHasWebSite=this.injects().Config.userHasWebSite();
this._userHasMobileSite=this.injects().Config.userHasMobileSite()
},_onAllSkinPartsReady:function(){this.parent();
this._dialogWindow.getViewNode().addEvent("dialogClosed",this._markSiteAsPublishedBefore)
},_createFields:function(a){this.setSkinSet("FLOATING_DIALOG");
this.addLabel(this._translate("PUBLISH_FB_SUCCESS_MAIN_LABEL"),null,null,"icons/save_publish.png",{x:"-2px",y:"-28px"},{width:"30px",height:"30px"});
var b=this._firstTimePublish?this._translate("PUBLISH_FB_SUCCESS_SUB_LABEL_FIRSTTIME"):this._translate("PUBLISH_FB_SUCCESS_SUB_LABEL_NOT_FIRSTTIME");
this.addSubLabel(b);
if(!this._isPremiumUser){this.addInputGroupField(function(){this.setSkinSet("FLOATING_DIALOG");
this.setNumberOfItemsPerLine(2,"210px");
this.addSubLabel(this._translate("PUBLISH_FB_SUCCESS_RMV_WIX_ADS"),null,null,null);
this.addButtonField(null,this._translate("PUBLISH_FB_SUCCESS_UPGRADE_BUTTON"),null,null,"upgrade").addEvent(Constants.CoreEvents.CLICK,a._onUpgradeNowClick)
})
}else{this.addInputGroupField(function(){this.setNumberOfItemsPerLine(2,"120px");
if(!this._userHasWebSite){this.addLabel(this._translate("PUBLISH_FB_SUCCESS_CREATE_WEBSITE_BUTTON_LABEL"));
this.addButtonField(null,this._translate("PUBLISH_FB_SUCCESS_CREATE_WEBSITE_BUTTON"),null,null,"action","150px").addEvent(Constants.CoreEvents.CLICK,a._onCreateWebsiteClick)
}else{this.addLabel(this._translate("PUBLISH_FB_WEBSITE_CREATED"),null,null,"icons/save_publish.png",{x:"-2px",y:"-28px"},{width:"30px",height:"30px"})
}});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(2,"80px");
if(!this._userHasMobileSite){this.addLabel(this._translate("PUBLISH_FB_SUCCESS_MOBILE_BUTTON_LABEL"));
this.addButtonField(null,this._translate("PUBLISH_FB_SUCCESS_MOBILE_BUTTON"),null,null,"action","150px").addEvent(Constants.CoreEvents.CLICK,a._onCreateMobileSiteClick)
}else{this.addLabel(this._translate("PUBLISH_FB_MOBILE_SITE_CREATED"),null,null,"icons/save_publish.png",{x:"-2px",y:"-28px"},{width:"30px",height:"30px"})
}})
}this.addBreakLine("15px");
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addInlineTextLinkField(null,null,this._translate("PUBLISH_FB_SUCCESS_CONTINUE_EDIT_LINK"),null).addEvent(Constants.CoreEvents.CLICK,a._closeDialog)
},"skinless",null,null,null,"right")
},_onUpgradeNowClick:function(a){this.injects().Commands.executeCommand("WEditorCommands.UpgradeToPremium",{referralAdditionalInfo:Constants.WEditManager.UPGRADE_SRC.PUBLISH_FB_SITE_SUCCESS_DIALOG})
},_onCreateWebsiteClick:function(b){var a=this.injects().Config.getCreateWebsiteLink();
window.open(a)
},_onCreateMobileSiteClick:function(b){var a=this.injects().Config.getCreateMobileSiteLink();
window.open(a)
},_onPromotePremiumClick:function(a){},_closeDialog:function(){this._markSiteAsPublishedBefore();
this._dialogWindow.closeDialog()
},_markSiteAsPublishedBefore:function(){this._editorStatusAPI.markSiteAsPublishedBefore()
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.PublishWebsiteDialog",imports:["wysiwyg.editor.utils.InputValidators"],skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onPublishNowClick","_onAllowSearchChanged","_onOptimizeSEOClick","_onSiteURLClick"],initialize:function(d,b,a){this.parent(d,b,a);
this._dialogWindow=a.dialogWindow;
var c=new this.imports.InputValidators();
this._charactersValidator=c.charactersValidator;
this._editorStatusAPI=this.injects().Editor.getEditorStatusAPI();
this._websiteUrl=this.injects().Config.getUserPublicUrl();
this._firstTimePublish=!this._editorStatusAPI.isPreviouslyPublished()
},_createFields:function(){this.setSkinSet("FLOATING_DIALOG");
var b="#999999";
var a=this;
var c=(this._firstTimePublish)?W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_PUBLISH_NOW_BUTTON"):W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_UPDATE_BUTTON");
var d=(this._firstTimePublish)?W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_MAIN_LABEL_FIRSTTIME"):W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_MAIN_LABEL_NOT_FIRSTTIME");
this.addLabel(d,null,null,"icons/save_publish.png",{x:"-2px",y:"-56px"},{width:"30px",height:"30px"});
if(this._firstTimePublish){this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_URL_LABEL")+" "+this._websiteUrl)
}else{this.addSubLabel();
this.addInlineTextLinkField(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_URL_LABEL"),"",this._websiteUrl,"").addEvent(Constants.CoreEvents.CLICK,this._onSiteURLClick)
}this._checkBoxProxy=this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_ALLOW_SE_FIND_MY_SITE")).bindToField("allowSEFindSite");
if(this._firstTimePublish){this._inputGroupProxy=this.addInputGroupField(function(){this.addLabel(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SEO_LABEL"));
this.addInputField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_SITE_TITLE_LABEL"),"",undefined,Constants.Page.TITLE_SEO_MAX_LENGTH,{validators:[a._charactersValidator]},null,"Settings_SEO_Site_Title_ttid").bindToField("siteTitleSEO");
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SEO_TITLE_EXAMPLE"),b);
this.addTextAreaField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_SITE_DESCRIPTION_LABEL"),"",undefined,Constants.Page.DESCRIPTION_SEO_MAX_LENGTH,{validators:[a._charactersValidator]},null,"Settings_SEO_Site_Description_ttid").bindToField("siteDescriptionSEO");
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SEO_DESCRIPTION_EXAMPLE"),b);
this.addInputField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_KEYWORD_LABEL"),"",undefined,Constants.Page.KEYWORD_SEO_MAX_LENGTH,{validators:[a._charactersValidator]},null,"Settings_SEO_Keywords_ttid").bindToField("keywordsSEO");
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SEO_KEYWORDS_EXAMPLE"),b)
},null,null,null,null,null,false,!(this._data.get("allowSEFindSite")));
this._checkBoxProxy.addEvent("inputChanged",this._onAllowSearchChanged).runWhenReady(function(e){if(e&&this._inputGroupProxy.uncollapseGroup){this._inputGroupProxy.uncollapseGroup()
}}.bind(this))
}else{this.addInlineTextLinkField("","",W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_OPTIMIZE_SEO_LABEL"),W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_OPTIMIZE_SEO_POSTFIX")).addEvent(Constants.CoreEvents.CLICK,this._onOptimizeSEOClick)
}this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addBreakLine("20px");
this.addButtonField(null,c,null,null,"blue").addEvent(Constants.CoreEvents.CLICK,a._onPublishNowClick)
},"skinless",null,null,null,"center")
},_onAllowSearchChanged:function(a){this._inputGroupProxy.runWhenReady(function(b){b.toggleCollapseState()
});
this._allowSEO=!!a.value
},_onPublishNowClick:function(){this._dialogWindow.closeDialog();
this.injects().Commands.executeCommand("WEditorCommands.Publish");
var a=(this._allowSEO)?1:0;
if(this._firstTimePublish){LOG.reportEvent(wixEvents.PUBLISH_BUTTON_CLICKED_IN_PUBLISH_DIALOG,{g1:W.Editor._templateId,i1:a})
}else{LOG.reportEvent(wixEvents.UPDATE_BUTTON_CLICKED_IN_PUBLISH_DIALOG,{i1:a})
}},_onSiteURLClick:function(){window.open(this._websiteUrl)
},_onOptimizeSEOClick:function(){this._dialogWindow.closeDialog();
var a=function(b){this.injects().Commands.executeCommand("WEditorCommands.ShowSEO")
}.bind(this);
this.injects().Commands.executeCommand("WEditorCommands.Settings",{callback:a})
},getAcceptableDataTypes:function(){return["SiteSettings"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.PublishWebsiteShareDialog",skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onPostInFacebookClick","_onTweetInTwitterClick","_onLearnMoreClick","_closeDialog","_onGoToMyAccountClick","_markSiteAsPublishedBefore"],initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._editorStatusAPI=this.injects().Editor.getEditorStatusAPI();
this._websiteUrl=this.injects().Config.getUserPublicUrl();
this._firstTimePublish=!this._editorStatusAPI.isPreviouslyPublished();
this._isPremiumUser=this.injects().Config.isPremiumUser()
},_onAllSkinPartsReady:function(){this.parent();
this._dialogWindow.getViewNode().addEvent("dialogClosed",this._markSiteAsPublishedBefore)
},_createFields:function(){this.setSkinSet("FLOATING_DIALOG");
this.addLabel(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_MAIN_LABEL"),null,null,"icons/save_publish.png",{x:"-2px",y:"-56px"},{width:"30px",height:"30px"});
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_SUB_LABEL"));
var a=this;
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addButtonField(null,W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_FACEBOOK_BUTTON"),null,"icons/facebook_icon.png","facebook","195px").addEvent(Constants.CoreEvents.CLICK,a._onPostInFacebookClick);
this.addButtonField(null,W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_TWITTER_BUTTON"),null,"icons/twitter_icon.png","twitter","175px").addEvent(Constants.CoreEvents.CLICK,a._onTweetInTwitterClick)
},null,null,null,null,"center");
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addBreakLine("20px");
this.addInlineTextLinkField("","",W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_CONTINUE_EDIT_LINK"),"o").addEvent(Constants.CoreEvents.CLICK,a._closeDialog);
this.addInlineTextLinkField("","r",W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_MY_ACCOUNT"),"").addEvent(Constants.CoreEvents.CLICK,a._onGoToMyAccountClick)
},"skinless",null,null,null,"center")
},_onPostInFacebookClick:function(a){var b={url:this._websiteUrl,text:this._firstTimePublish?W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_FB_MSG_FIRSTTIME"):W.Resources.get("EDITOR_LANGUAGE","PUBLISH_WEB_SHARE_FB_MSG_NOT_FIRSTTIME")};
this.injects().Commands.executeCommand("WEditorCommands.PostInFacebook",b);
LOG.reportEvent(wixEvents.POST_IN_FB_CLICKED_IN_PUBLISH_SHARE_DIALOG)
},_onTweetInTwitterClick:function(a){var b={siteUrl:this._websiteUrl,isPremium:this._isPremiumUser};
this.injects().Commands.executeCommand("WEditorCommands.ShareInTwitter",b);
LOG.reportEvent(wixEvents.POST_IN_TWITTER_CLICKED_IN_PUBLISH_SHARE_DIALOG)
},_onLearnMoreClick:function(a){window.open("http://promote.wix.com/seo/")
},_onGoToMyAccountClick:function(a){this.injects().Commands.executeCommand("WEditorCommands.GoToMyAcount")
},_closeDialog:function(){this._markSiteAsPublishedBefore();
this._dialogWindow.closeDialog()
},_markSiteAsPublishedBefore:function(){this._editorStatusAPI.markSiteAsPublishedBefore();
this._dialogWindow.getViewNode().removeEvent("dialogClosed",this._markSiteAsPublishedBefore)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.PublishWebsiteSuccessDialog",skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onViewLiveSiteClick","_onUpgradeNowClick","_onNotNowClick","_goToPublishShareDialog","_onCreateFacebookSiteClick","_onCreateMobileSiteClick"],initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._isPremiumUser=this.injects().Config.isPremiumUser();
this._userHasFacebookSite=this.injects().Config.userHasFacebookSite();
this._userHasMobileSite=this.injects().Config.userHasMobileSite()
},_onAllSkinPartsReady:function(){this.parent();
this._dialogWindow.getViewNode().addEvent("dialogClosed",this._goToPublishShareDialog)
},_createFields:function(){this.setSkinSet("FLOATING_DIALOG");
var a=this;
this._websiteUrl=this.injects().Config.getUserPublicUrl();
this.addLabel(this._translate("PUBLISH_WEB_SUCCESS_MAIN_LABEL"),null,null,"icons/save_publish.png",{x:"-2px",y:"-28px"},{width:"30px",height:"30px"});
this.addSubLabel();
this.addInlineTextLinkField(this._translate("PUBLISH_WEB_SUCCESS_URL_LABEL"),"",this._websiteUrl,"").addEvent(Constants.CoreEvents.CLICK,this._onViewLiveSiteClick);
this.addBreakLine("20px");
if(!this._isPremiumUser){var b=this;
this.addInputGroupField(function(){this.setSkinSet("FLOATING_DIALOG");
this.setNumberOfItemsPerLine(2,"124px");
this.addSubLabel(this._translate("PUBLISH_WEB_SUCCESS_UPGRADE_FEATURES"),null,null,null);
this.addButtonField(null,this._translate("PUBLISH_WEB_SUCCESS_UPGRADE_BUTTON"),null,null,"upgrade").addEvent(Constants.CoreEvents.CLICK,b._onUpgradeNowClick)
})
}else{this.addInputGroupField(function(){this.setNumberOfItemsPerLine(2,"140px");
if(!a._userHasFacebookSite){this.addLabel(this._translate("PUBLISH_WEB_SUCCESS_PROMOTE_BUTTON_LABEL"));
this.addButtonField(null,this._translate("PUBLISH_WEB_SUCCESS_PROMOTE_BUTTON"),null,"icons/facebook_icon.png","facebook","80px").addEvent(Constants.CoreEvents.CLICK,a._onCreateFacebookSiteClick)
}else{this.addLabel(this._translate("PUBLISH_WEB_SUCCESS_FB_CREATED"),null,null,"icons/save_publish.png",{x:"-2px",y:"-28px"},{width:"30px",height:"30px"})
}});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(2,"144px");
if(!a._userHasMobileSite){this.addLabel(this._translate("PUBLISH_WEB_SUCCESS_MOBILE_BUTTON_LABEL"));
this.addButtonField(null,this._translate("PUBLISH_WEB_SUCCESS_MOBILE_BUTTON"),null,null,"action",null).addEvent(Constants.CoreEvents.CLICK,a._onCreateMobileSiteClick)
}else{this.addLabel(this._translate("PUBLISH_WEB_SUCCESS_MOBILE_CREATED"),null,null,"icons/save_publish.png",{x:"-2px",y:"-28px"},{width:"30px",height:"30px"})
}})
}this.addBreakLine("20px");
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
var d=a._userHasMobileSite&&a._userHasFacebookSite;
var c=d?this._translate("ok"):this._translate("PUBLISH_WEB_SUCCESS_CONTINUE_EDIT_LINK");
this.addInlineTextLinkField("","",c,"").addEvent(Constants.CoreEvents.CLICK,a._onNotNowClick)
},"skinless",null,null,null,"right")
},_onViewLiveSiteClick:function(a){window.open(this._websiteUrl)
},_onUpgradeNowClick:function(a){this.injects().Commands.executeCommand("WEditorCommands.UpgradeToPremium",{referralAdditionalInfo:Constants.WEditManager.UPGRADE_SRC.PUBLISH_WEBSITE_SUCCESS_DIALOG})
},_onNotNowClick:function(a){this._dialogWindow.closeDialog()
},_goToPublishShareDialog:function(){this.injects().Commands.executeCommand("WEditorCommands.OpenPublishWebsiteShareDialog");
this._dialogWindow.getViewNode().removeEvent("dialogClosed",this._goToPublishShareDialog)
},_onCreateFacebookSiteClick:function(b){var a=this.injects().Config.getCreateFacebookSiteLink();
window.open(a)
},_onCreateMobileSiteClick:function(b){var a=this.injects().Config.getCreateMobileSiteLink();
window.open(a)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.SaveDialog",skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_inputChanged","_sanitizeSiteName","_cloneSite","_onCloneSuccess","_onCloneError","_onCloneFail","_onLoadSite","_onContinueEditingClick","_onSaveClick","executeOnEnterKey","_validateSiteName","_onDialogClosing","_validationSiteNameOkCallback","_validationSiteNameFailCallback"],initialize:function(c,a,b){this.parent(c,a,b);
this._dialogWindow=b.dialogWindow;
this._saveAs=b.saveAs||false;
this._appType=this.injects().Config.getApplicationType();
this._placeHolderKey=(this._appType==Constants.WEditManager.SITE_TYPE_FACEBOOK)?"FACEBOOK_PAGE_NAME_PLACEHOLDER":"SITE_NAME_PLACEHOLDER";
this._hasMetaSite=this.injects().Config.getMetaSiteId()?true:false;
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing);
this._disbaleSiteNameInsersion=this._hasMetaSite&&!this._saveAs;
this.injects().Editor.disableAutoSave()
},_createFields:function(){this.setSkinSet("FLOATING_DIALOG");
if(this._appType==Constants.WEditManager.SITE_TYPE_FACEBOOK){this.addLabel(W.Resources.get("EDITOR_LANGUAGE","SAVE_YOUR_FACEBOOK_PAGE"))
}else{this.addLabel(W.Resources.get("EDITOR_LANGUAGE","SAVE_YOUR_SITE"),null,null,"icons/save_publish.png",{x:"-2px",y:0},{width:"30px",height:"30px"});
var a=(this._disbaleSiteNameInsersion)?W.Resources.get("EDITOR_LANGUAGE","SAVE_YOUR_SITE_DESC_META_SITE_EXISTS"):W.Resources.get("EDITOR_LANGUAGE","SAVE_YOUR_SITE_DESC");
this.addSubLabel(a)
}this.addInputGroupField(function(b){var d=b._disbaleSiteNameInsersion?"30px":null;
this.setNumberOfItemsPerLine(0,d);
if(b._disbaleSiteNameInsersion){var c=b.injects().Config.getUserPublicUrl();
this.addSubLabel(c)
}b._inputFieldProxy=this.addInputField("",W.Resources.get("EDITOR_LANGUAGE",b._placeHolderKey),null,null,{validators:[b._validateSiteName],validationOkCallback:b._validationSiteNameOkCallback,validationFailCallback:b._validationSiteNameFailCallback},"floating").addEvent(Constants.CoreEvents.KEY_UP,b._inputChanged).addEvent(Constants.CoreEvents.KEY_UP,b.executeOnEnterKey);
b._inputFieldProxy.runWhenReady(function(e){b._inputChanged({value:e.getValue()});
if(b._disbaleSiteNameInsersion){e.hide()
}});
b._saveButton=this.addButtonField(null,W.Resources.get("EDITOR_LANGUAGE","SAVE"),null,null,"blue","80px").addEvent(Constants.CoreEvents.CLICK,b._onSaveClick);
b._saveButton.runWhenReady(function(e){if(b._disbaleSiteNameInsersion){e.enable()
}else{e.disable()
}});
this.addBreakLine();
if(b._appType==Constants.WEditManager.SITE_TYPE_WEB){b._subLabelProxy=this.addSubLabel()
}},"skinless");
this.addBreakLine("20px");
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","SAVE_WAIT_FOR_EDITOR_RELOAD"));
this.addInputGroupField(function(b){this.setNumberOfItemsPerLine(0);
this.addInlineTextLinkField(null,null,W.Resources.get("EDITOR_LANGUAGE","SAVE_DIALOG_CONTINUE_EDIT_LINK"),null).addEvent(Constants.CoreEvents.CLICK,b._onContinueEditingClick)
},"skinless",null,null,null,"right")
},_validateSiteName:function(g){var e="[^a-zA-Z0-9 -]";
var h=new RegExp(e);
if(g.match(h)){this._saveButton.disable();
return g.match(e)[0]+" "+W.Resources.get("EDITOR_LANGUAGE","SITE_NAME_INVALID_CHAR")
}if(g.length<4){return W.Resources.get("EDITOR_LANGUAGE","SITE_NAME_TOO_SHORT")
}if(g.length>20){return W.Resources.get("EDITOR_LANGUAGE","SITE_NAME_TOO_LONG")
}var d=window.editorModel.usedMetaSiteNames;
if(d==null){return
}if(this._isSiteNameAlreadyExist(g)){var f=true;
var b=0;
var a="";
var c=g.match(/(.*)(_\d*)/);
if(c){g=c[1]
}while(f){b++;
a=g+"-"+b;
if(!this._isSiteNameAlreadyExist(a)){f=false
}}return this._translate("SITE_NAME_EXISTS_SUGGEST")+a+"?"
}return null
},_isSiteNameAlreadyExist:function(c){var b=window.editorModel.usedMetaSiteNames;
for(var a=0;
a<b.length;
++a){if(c.toLowerCase()===b[a].toLowerCase()){return true
}}return false
},_validationSiteNameOkCallback:function(){this._saveButton.enable();
if(this._appType==Constants.WEditManager.SITE_TYPE_WEB){this._subLabelProxy.uncollapse()
}},_validationSiteNameFailCallback:function(){if(this._appType==Constants.WEditManager.SITE_TYPE_WEB){this._subLabelProxy.collapse()
}this._saveButton.disable()
},_onContinueEditingClick:function(){this._dialogWindow.closeDialog();
LOG.reportEvent(wixEvents.CLOSE_SAVE_DIALOG_CLICKED,{g1:W.Editor._templateId})
},executeOnEnterKey:function(b){b=b||window.event;
if(b.code==13){var a=this._inputFieldProxy.getValue();
if(!this._validateSiteName(a)){this._onSaveClick()
}}},_onSaveClick:function(){if(this._disbaleSiteNameInsersion){this._cloneSite(window.editorModel.metaSiteData.siteName);
this.closeDialogAndLog()
}else{if(!this._siteLabel||this._siteLabel==""||this._siteLabel==W.Resources.get("EDITOR_LANGUAGE",this._placeHolderKey)||this._siteLabel==this._sanitizeSiteName(W.Resources.get("EDITOR_LANGUAGE",this._placeHolderKey))){return
}this._data.set("siteName",this._siteLabel);
this._cloneSite(this._siteLabel)
}this.closeDialogAndLog()
},closeDialogAndLog:function(){this._dialogWindow.closeDialog();
LOG.reportEvent(wixEvents.SAVE_CLICKED_IN_SAVE_DIALOG,{g1:W.Editor._templateId})
},_inputChanged:function(b){var a=this._inputFieldProxy.getValue();
if(this._appType==Constants.WEditManager.SITE_TYPE_FACEBOOK){this._siteLabel=this._sanitizeSiteName(a)
}else{if(this._subLabelProxy&&this._subLabelProxy.runWhenReady){this._subLabelProxy.runWhenReady(function(d){if(a.length==0){a=W.Resources.get("EDITOR_LANGUAGE","SITE_NAME_SANITIZED")
}this._siteLabel=this._sanitizeSiteName(a);
if(!this._saveAs){d.setValue(this.injects().Config.getUserPublicUrl()+"/"+this._siteLabel)
}else{var e=this.injects().Config.getUserPublicUrl();
var c=e.substr(0,e.indexOf(window.editorModel.metaSiteData.siteName));
d.setValue(c+"/"+this._siteLabel)
}}.bind(this))
}}},_sanitizeSiteName:function(a){return a.replace(/([^\s\w\d_-])/g,"").replace(/\s+/g,"-").toLowerCase()
},_cloneSite:function(b){var a=(this._saveAs)?"saveAs":"cloneDocument";
W.ServerFacade[a](W.Preview.getPreviewSite(),window.siteHeader.id,b,this._onCloneSuccess,this._onCloneError)
},_onCloneSuccess:function(a){window.enableNavigationConfirmation=false;
window.editorModel.metaSiteId=a.metaSiteId;
window.siteHeader.id=a.id;
this._navigateToEditOnFirstSave()
},_onLoadSite:function(a){this._setGlobalStatusFlags(a)
},_onCloneError:function(a,c,b){switch(c){case -40003:W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","ERROR_SAVE_TITLE"),W.Resources.get("EDITOR_LANGUAGE","ERROR_SAVE_40003"),W.Resources.get("EDITOR_LANGUAGE","ERROR_CODE_IS")+" "+c,W.EditorDialogs.DialogButtonSet.OK,function(){this.injects().Commands.executeCommand("WEditorCommands.Save")
});
break;
default:W.EditorDialogs.openPromptDialog(W.Resources.get("EDITOR_LANGUAGE","ERROR_SAVE_TITLE"),W.Resources.get("EDITOR_LANGUAGE","ERROR_CLONE_SITE"),W.Resources.get("EDITOR_LANGUAGE","ERROR_CODE_IS")+" "+c,W.EditorDialogs.DialogButtonSet.OK,function(){})
}},_onCloneFail:function(){},_setGlobalStatusFlags:function(a){window.siteHeader.id=a.id;
this.injects().Config.setMetaSiteId(a.metaSiteId)
},_navigateToEditOnFirstSave:function(){if(this.injects().Config.siteNeverSavedBefore()||this._saveAs){var b=this.getExperimentsFromUrl();
var a=W.Utils.getQueryParam("appDefinitionId",location.href);
if(a){b=b.concat(["appDefinitionId="+a])
}var c="&"+b.join("&");
window.location=W.ServerFacade.getEditUrl(window.siteHeader.id)+c+"#save=1"
}},getExperimentsFromUrl:function(){var c=window.location.search.slice(1);
var b=c.split("&");
var a=[];
if(b){a=b.filter(function(e,d){return e.test(/^experiment|override_featureToggles/)
})
}return a
},_onDialogClosing:function(a){if(a.result=="CANCEL"){LOG.reportEvent(wixEvents.CLOSE_SAVE_DIALOG_CLICKED,{g1:W.Editor._templateId})
}},getAcceptableDataTypes:function(){return["SiteSettings"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.SaveSuccessDialog",skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onPreviewClick","_onContinueEditingClick","_onPublishNowClick","_onSiteLoaded"],initialize:function(c,b,a){this.parent(c,b,a);
this._dialogWindow=a.dialogWindow;
this._siteType=this.injects().Config.getApplicationType();
W.Commands.registerCommandListenerByName("EditorCommands.SiteLoaded",this,this._onSiteLoaded)
},_onSiteLoaded:function(){this.buttonLogic.enable()
},_onAllSkinPartsReady:function(){this.parent()
},_createFields:function(){var a=this;
this.setSkinSet("FLOATING_DIALOG");
var d=(this._siteType==Constants.WEditManager.SITE_TYPE_WEB)?W.Resources.get("EDITOR_LANGUAGE","SAVE_SUCCESS_MAIN_LABEL_WEB"):W.Resources.get("EDITOR_LANGUAGE","SAVE_SUCCESS_MAIN_LABEL_FB");
var b=(this._siteType==Constants.WEditManager.SITE_TYPE_WEB)?W.Resources.get("EDITOR_LANGUAGE","SAVE_SUCCESS_PUBLISH_BUTTON_WEB"):W.Resources.get("EDITOR_LANGUAGE","SAVE_SUCCESS_PUBLISH_BUTTON_FB");
var c=this.injects().Utils.getTimestamp();
this.addLabel(d,null,null,"icons/save_publish.png",{x:"-2px",y:"-28px"},{width:"30px",height:"30px"});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addInlineTextLinkField(null,c,W.Resources.get("EDITOR_LANGUAGE","SAVE_SUCCESS_PREVIEW_BUTTON"),null,null,null,"floating").addEvent(Constants.CoreEvents.CLICK,a._onPreviewClick);
this.addBreakLine();
this.addButtonField("",b,null,null,"blue").addEvent(Constants.CoreEvents.CLICK,a._onPublishNowClick).runWhenReady(function(f){f.disable();
a.buttonLogic=f;
var e=a.injects().Commands.getCommand("EditorCommands.SiteLoaded");
if(e&&e.getNumTimesExecuted()>0){f.enable()
}})
},"skinless",null,null,null,"center");
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addBreakLine("70px");
this.addInlineTextLinkField("","",W.Resources.get("EDITOR_LANGUAGE","SAVE_SUCCESS_CONTINUE_EDIT_BUTTON"),"").addEvent(Constants.CoreEvents.CLICK,a._onContinueEditingClick)
},"skinless",null,null,null,"right")
},_onPreviewClick:function(a){this.injects().Commands.executeCommand("WEditorCommands.WSetEditMode",{editMode:W.Editor.EDIT_MODE.PREVIEW});
this._dialogWindow.closeDialog()
},_onContinueEditingClick:function(a){this._dialogWindow.closeDialog()
},_onPublishNowClick:function(){this.injects().Commands.executeCommand("WEditorCommands.OpenPublishDialog");
this._dialogWindow.closeDialog()
}}});
Constants.WAddPageDialog={PREVIEW_ICONS_DIRECTORY:"/images/wysiwyg/addPageIcons/"};
W.Components.newComponent({name:"wysiwyg.editor.components.dialogs.WAddPageDialog",traits:["mobile.core.components.traits.InputFieldEvents","wysiwyg.editor.components.traits.FiltersDataByTags"],skinParts:{contentLabel:{type:"htmlElement"},content:{type:"htmlElement"},nameYourPageInput:{type:"wysiwyg.editor.components.inputs.Input"},newPageSettings:{type:"htmlElement"},nameYourPageTitle:{type:"htmlElement"},pageDescription:{type:"htmlElement"},namePageLabel:{type:"htmlElement"},subPage:{type:"htmlElement"},subPageTitle:{type:"htmlElement"},subPageCheckBox:{type:"wysiwyg.editor.components.inputs.CheckBox"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onDialogClosing","_onKeyUp","_setPageTypesList","_setSubPage"],initialize:function(d,c,a){this.parent(d,c);
this._dialogWindow=a.dialogWindow;
this._dialogOptionsSet=false;
this._selectedPageId="#"+this.injects().Preview.getPreviewManagers().Viewer.getCurrentPageId();
var f=W.Preview.getPreviewManagers().Data.getDataByQuery("#MAIN_MENU");
this._isCurrentPageSubPage=f.isSubItemByRefId(this._selectedPageId);
if(this._isCurrentPageSubPage){var b=f.getItemParentByRedId(this._selectedPageId);
this._currentPageParentRef=b.get("refId");
this._isSubPage=true
}else{this._isSubPage=false
}var e=this;
this._linkListener=function(g){if(g.type=="click"){e._onItemClick(this)
}else{e._onItemDoubleClick(this)
}};
this._dialogWindow.addEvent("onDialogClosing",this._onDialogClosing);
this.filterEditorDataListByTags("#PAGE_TYPES","pagesFilterTags","tags",this._setPageTypesList)
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.contentLabel.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","ADD_PAGE_CONTENT_LABEL"));
this._skinParts.namePageLabel.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","NAME_YOUR_PAGE"));
this._skinParts.subPageTitle.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","ADD_AS_SUB_PAGE"));
this._skinParts.nameYourPageInput.addEvent(Constants.CoreEvents.KEY_UP,this._onKeyUp);
this._skinParts.nameYourPageInput.setMaxLength(Constants.Page.NAME_MAX_LENGTH);
this._skinParts.subPageCheckBox.setChecked(this._isSubPage);
this._skinParts.subPageCheckBox.addEvent("inputChanged",this._setSubPage)
},_prepareForRender:function(){if(this._dialogOptionsSet){return true
}this._dialogWindow.setDialogOptions({width:500,title:this.injects().Resources.get("EDITOR_LANGUAGE","ADD_PAGE_DIALOG_HEADER"),buttonSet:W.EditorDialogs.DialogButtonSet.OK_CANCEL},function(){this._refreshLinkList(function(){this._dialogOptionsSet=true;
this._renderIfReady()
}.bind(this))
}.bind(this));
return this._dialogOptionsSet
},_setPageTypesList:function(b){var a=this.injects().Config.getApplicationType();
this._pageTypes=b.filter(function(d){var c=window.debugMode!="debug"&&d.group=="ADD_PAGE_DEBUG_GROUPNAME";
return(d.applicationType==a&&!c)
})
},setDialogOptions:function(){this._clearSelection();
this._view.fireEvent("dialogOptionsSet",this)
},_refreshLinkList:function(c){if(!this._skinParts||!this._skinParts.content){return
}this._skinParts.content.empty();
var f=this.injects().Resources;
var g=[];
for(var b=0;
b<this._pageTypes.length;
b++){var e=f.get("EDITOR_LANGUAGE",this._pageTypes[b].group);
if(!g.contains(e)){var a=new Element("strong",{text:e,styles:{display:"block","font-size":"13px","margin-bottom":"6px"}});
this._skinParts.content.adopt(a);
g.push(e)
}this._pageTypes[b].isReady=false;
var d=this;
this._createItem(this._pageTypes[b],function(h){h.isReady=true;
this._checkPageListReady(c)
}.bind(this),function(j,h){if(j==0){d._onItemClick(h.getViewNode())
}}.bind(this,b))
}},_checkPageListReady:function(c){var a=true;
for(var b=0;
b<this._pageTypes.length;
b++){if(!this._pageTypes[b].isReady){a=false;
break
}}if(a&&c){c()
}},_createItem:function(b,e,f){resources=this.injects().Resources;
var a={type:"Page",linkType:"FREE_LINK",title:resources.get("EDITOR_LANGUAGE",b.name),target:"",additionalObj:b,icon:""};
var d=this.injects().Data.createDataItem(a);
var c=this.injects().Components.createComponent("mobile.core.components.MenuButton","wysiwyg.editor.skins.dialogs.WAddPageItemSkin",d,{listSubType:"PAGES"},e(b),f);
c.setStyles({width:"100%","margin-bottom":"6px"});
c.addEvent(Constants.CoreEvents.CLICK,this._linkListener);
c.addEvent("dblclick",this._linkListener);
c.insertInto(this._skinParts.content)
},_onDialogClosing:function(a){if(a.result=="OK"){this._reportSelectedLink()
}},_reportSelectedLink:function(){var b=this._selectedItem._data.get("additionalObj");
var a=b.name;
b.name=this._skinParts.nameYourPageInput.getValue();
if(b.name==""){b.name=this.injects().Resources.get("EDITOR_LANGUAGE",b.group)
}var c={page:b};
if(this._isSubPage){if(this._isCurrentPageSubPage){c.parent=this._currentPageParentRef
}else{c.parent=this._selectedPageId
}}this.injects().Commands.executeCommand("WEditorCommands.AddPage",c);
b.name=a;
LOG.reportEvent(wixEvents.PAGE_ADDED,{c1:this._selectedItem._data.get("additionalObj").name})
},_onItemClick:function(c){if(this._selectedItem==c.getLogic()){return
}var d=this.injects().Resources;
var g=(this._selectedItem&&d.get("EDITOR_LANGUAGE",this._selectedItem._data.get("additionalObj").name))||"";
var f=this._skinParts.nameYourPageInput.getValue();
var b=(f!=g);
this._clearSelection();
this._selectedItem=c.getLogic();
c.getLogic().setState("selected");
if(this._selectedItem){this._skinParts.nameYourPageInput.enable();
this._dialogWindow.enableButton(this.injects().EditorDialogs.DialogButtons.OK);
this._skinParts.preview.setStyle("visibility","visible");
this._skinParts.preview.set("src",W.Config.getServiceTopologyProperty("staticSkinUrl")+Constants.WAddPageDialog.PREVIEW_ICONS_DIRECTORY+this._selectedItem._data.get("additionalObj").previewPic);
var e=d.get("EDITOR_LANGUAGE",this._selectedItem._data.get("additionalObj").pageDescription);
this._skinParts.pageDescription.set("html",e);
var a=(b)?f:d.get("EDITOR_LANGUAGE",this._selectedItem._data.get("additionalObj").name);
this._skinParts.nameYourPageInput.setValue(a)
}},_onItemDoubleClick:function(a){this._clearSelection();
this._onItemClick(a);
this._reportSelectedLink();
this._dialogWindow.closeDialog()
},_clearSelection:function(){if(this._selectedItem){this._selectedItem.setState("idle");
this._selectedItem=null
}this._dialogWindow.disableButton(this.injects().EditorDialogs.DialogButtons.OK);
this._skinParts.preview.setStyle("visibility","hidden");
this._skinParts.nameYourPageInput.setValue("");
this._skinParts.nameYourPageInput.disable();
this._skinParts.pageDescription.set("html","")
},_getPreviewRoot:function(){return this.injects().Theme.getProperty("THEME_DIRECTORY")+"addPage/"
},_onKeyUp:function(a){a=a||window.event;
if(a.code==13){this._reportSelectedLink();
this._dialogWindow.closeDialog()
}},_setSubPage:function(b){var a=b.value||false;
this._isSubPage=a
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.AddImageScreen",imports:[],skinParts:{background:{type:"htmlElement"},heading:{type:"htmlElement"},paragraph1:{type:"htmlElement"},addButton:{type:"wysiwyg.editor.components.WButton"},keepPresetButton:{type:"htmlElement"}},traits:[],Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onClick","_onKeepPreset"],_states:{situation:["emptyList","presetList"]},initialize:function(c,a,b){this.parent(c,a,b)
},_onStateChange:function(b,a){if(this._componentReady===true){this._updateLabels()
}},render:function(){this._updateLabels()
},_onAllSkinPartsReady:function(){this._skinParts.addButton.addEvent(Constants.CoreEvents.CLICK,this._onClick);
this._skinParts.keepPresetButton.addEvent(Constants.CoreEvents.CLICK,this._onKeepPreset)
},_updateLabels:function(){this._skinParts.heading.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","ADDIMAGESCREEN_HEADING"));
var a=this.getState();
var b=this.injects().Resources.get("EDITOR_LANGUAGE",a.contains("emptyList")===true?"ADDIMAGESCREEN_PAR1":"ADDIMAGESCREEN_PAR2");
this._skinParts.paragraph1.set("text",b);
this._skinParts.addButton.setLabel(this.injects().Resources.get("EDITOR_LANGUAGE","ADDIMAGESCREEN_ADD_BUTTON"));
this._skinParts.keepPresetButton.set("text",this.injects().Resources.get("EDITOR_LANGUAGE","ADDIMAGESCREEN_KEEP_PRESET_BUTTON"))
},_onClick:function(a){a.stopPropagation();
this.fireEvent("addImageRequested")
},_onKeepPreset:function(a){this.fireEvent("keepPreset")
}}});
Constants.Inputs={Default:{MIN:0,TICKER_MAX:1024,SLIDER_MAX:100,MIN_LENGTH:0,MAX_LENGTH:1024,STEP:1}};
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.BaseInput",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{label:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:{label:["hasLabel","noLabel"]},Binds:["_changeEventHandler","_stopListeningToInput","_listenToInput"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._labelText=b.labelText||"";
if(b.toolTip){this._toolTipId=b.toolTip.toolTipId||null;
this._toolTipAsQuestionMark=b.toolTip.addQuestionMark||false;
this._getToolTipSkinPart=b.toolTip.toolTipGetter&&b.toolTip.toolTipGetter.bind(this)||function(){return this._skinParts.label
}.bind(this)
}else{this._toolTipId=b.toolTipId||null;
this._toolTipAsQuestionMark=false;
this._getToolTipSkinPart=function(){return this._skinParts.view
}.bind(this)
}},render:function(){this.setLabel(this._labelText)
},isValidInput:function(){return true
},_onAllSkinPartsReady:function(){if(this.isEnabled()){this._listenToInput()
}this._addToolTip(this._toolTipId)
},_addToolTip:function(d){d=d||this._toolTipId;
if(!d){return
}var c=this._getToolTipSkinPart();
if(this._toolTipAsQuestionMark){var a=this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")+"icons/property_panel_help_sprite.png";
var b=new Element("span",{html:"&nbsp;",events:{mouseenter:function(){W.Commands.executeCommand("Tooltip.ShowTip",{id:d},b)
},mouseleave:function(){W.Commands.executeCommand("Tooltip.CloseTip")
}},"class":"tooltipIcon",styles:{backgroundImage:"url("+a+")"}});
c.grab(b,"after").setStyles({width:"80%",display:"inline"})
}else{c.addEvent("mouseenter",function(){W.Commands.executeCommand("Tooltip.ShowTip",{id:d},c)
}.bind(this));
c.addEvent("mouseleave",function(){W.Commands.executeCommand("Tooltip.CloseTip")
}.bind(this))
}},setLabel:function(a){if(a&&typeof a=="string"){this._labelText=a;
this.setState("hasLabel","label");
this._skinParts.label.set("html",a);
this._skinParts.label.uncollapse()
}else{this._labelText="";
this.setState("noLabel","label");
this._skinParts.label.set("html","");
this._skinParts.label.collapse()
}},setTextContent:function(a){this.setLabel(a)
},fireChangeEvent:function(a){this._changeEventHandler(a||{})
},_onEnabled:function(){this._listenToInput()
},_onDisabled:function(){this._stopListeningToInput()
},setFocus:function(){},_changeEventHandler:function(c){var b=this.getValue();
if(typeof b=="string"){b=this.injects().Utils.convertToHtmlText(b)
}var a={value:b,origEvent:c,compLogic:this};
this.fireEvent("inputChanged",a)
},dispose:function(){this._stopListeningToInput();
this._removeDataListeners();
this.parent()
},_listenToInput:function(){LOG.reportError(wixErrors.MISSING_METHOD,this.className,"_listenToInput")
},_stopListeningToInput:function(){LOG.reportError(wixErrors.MISSING_METHOD,this.className,"_stopListeningToInput")
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.BorderRadiusInput",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{label:{type:"htmlElement"},topLeft:{type:"wysiwyg.editor.components.inputs.TickerInput"},topRight:{type:"wysiwyg.editor.components.inputs.TickerInput"},bottomRight:{type:"wysiwyg.editor.components.inputs.TickerInput"},bottomLeft:{type:"wysiwyg.editor.components.inputs.TickerInput"},topLeftUnit:{type:"htmlElement"},topRightUnit:{type:"htmlElement"},bottomRightUnit:{type:"htmlElement"},bottomLeftUnit:{type:"htmlElement"},topLeftPreview:{type:"htmlElement"},topRightPreview:{type:"htmlElement"},bottomRightPreview:{type:"htmlElement"},bottomLeftPreview:{type:"htmlElement"},lockCorners:{type:"wysiwyg.editor.components.inputs.CheckBox"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_cornersLockHandler"],initialize:function(c,a,b){this.parent(c,a,b);
this._value=b.radiusString||"";
this._unit="";
this._isCornersLocked=false
},render:function(){this.parent();
var a=new W.BorderRadius(this._value);
this._unit=a.getUnits()[0];
this._skinParts.topLeftPreview.setStyle("border-top-left-radius",a.getTopLeft());
this._skinParts.topRightPreview.setStyle("border-top-right-radius",a.getTopRight());
this._skinParts.bottomRightPreview.setStyle("border-bottom-right-radius",a.getBottomRight());
this._skinParts.bottomLeftPreview.setStyle("border-bottom-left-radius",a.getBottomLeft());
this._skinParts.topLeftUnit.set("text",this._unit);
this._skinParts.topRightUnit.set("text",this._unit);
this._skinParts.bottomRightUnit.set("text",this._unit);
this._skinParts.bottomLeftUnit.set("text",this._unit);
this._skinParts.topLeft.setValue(a.getTopLeft());
this._skinParts.topRight.setValue(a.getTopRight());
this._skinParts.bottomRight.setValue(a.getBottomRight());
this._skinParts.bottomLeft.setValue(a.getBottomLeft());
this._isCornersLocked=a.getIsLocked();
this._skinParts.lockCorners.setValue(this._isCornersLocked)
},_onAllSkinPartsReady:function(){this._skinParts.lockCorners.setLabel(this.injects().Resources.get("EDITOR_LANGUAGE","BORDER_RADIUS_LOCK"));
this.parent();
if(this.isEnabled()){this._skinParts.topLeft.enable();
this._skinParts.topRight.enable();
this._skinParts.bottomRight.enable();
this._skinParts.bottomLeft.enable();
this._skinParts.lockCorners.enable()
}else{this._skinParts.topLeft.disable();
this._skinParts.topRight.disable();
this._skinParts.bottomRight.disable();
this._skinParts.bottomLeft.disable();
this._skinParts.lockCorners.disable()
}},setValue:function(b){var a=new W.BorderRadius(b);
this._value=a.getCssValue();
this._unit=a.getUnits()[0];
this._renderIfReady()
},getValue:function(){var b=null;
if(this._isCornersLocked){b=this._skinParts.topLeft.getValue()+this._unit
}else{b=[this._skinParts.topLeft.getValue()+this._unit,this._skinParts.topRight.getValue()+this._unit,this._skinParts.bottomRight.getValue()+this._unit,this._skinParts.bottomLeft.getValue()+this._unit]
}var a=new W.BorderRadius(b);
this._value=a.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.topLeft.enable();
this._skinParts.topRight.enable();
this._skinParts.bottomRight.enable();
this._skinParts.bottomLeft.enable();
this._skinParts.lockCorners.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.topLeft.disable();
this._skinParts.topRight.disable();
this._skinParts.bottomRight.disable();
this._skinParts.bottomLeft.disable();
this._skinParts.lockCorners.disable()
}},_cornersLockHandler:function(a){this._isCornersLocked=this._skinParts.lockCorners.getValue();
if(this._isCornersLocked){this.setValue(this._skinParts.topLeft.getValue()+this._unit)
}else{this.setValue([this._skinParts.topLeft.getValue()+this._unit,this._skinParts.topLeft.getValue()+this._unit])
}a.compLogic=this._skinParts.topLeft;
this._changeEventHandler(a)
},_changeEventHandler:function(a){a=a||{};
if(this._isCornersLocked){this.setValue(a.compLogic&&a.compLogic.getValue()+this._unit)
}this.parent(a)
},_listenToInput:function(){this._skinParts.topLeft.addEvent("inputChanged",this._changeEventHandler);
this._skinParts.topRight.addEvent("inputChanged",this._changeEventHandler);
this._skinParts.bottomRight.addEvent("inputChanged",this._changeEventHandler);
this._skinParts.bottomLeft.addEvent("inputChanged",this._changeEventHandler);
this._skinParts.lockCorners.addEvent("inputChanged",this._cornersLockHandler)
},_stopListeningToInput:function(){this._skinParts.topLeft.removeEvent("inputChanged",this._changeEventHandler);
this._skinParts.topRight.removeEvent("inputChanged",this._changeEventHandler);
this._skinParts.bottomRight.removeEvent("inputChanged",this._changeEventHandler);
this._skinParts.bottomLeft.removeEvent("inputChanged",this._changeEventHandler);
this._skinParts.lockCorners.removeEvent("inputChanged",this._cornersLockHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ButtonInput",skinParts:{label:{type:"htmlElement"},button:{type:"wysiwyg.editor.components.WButton"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],editable:["disabled","enabled"]},Binds:["_tunnelButtonEvent"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._buttonLabel=b.buttonLabel||"";
this._toggleMode=b.toggleMode||false;
this._iconSrc=b.iconSrc||"";
this._value="";
this._spriteOffset=b.spriteOffset||{x:"50%",y:"50%"};
this._minWidth=b.minWidth||0;
this._iconSize=b.iconSize||null;
this._command=b.command;
this._commandParameter=b.commandParameter
},render:function(){this.parent();
this._skinParts.button.setParameters({label:this._buttonLabel,toggleMode:this._toggleMode,command:this._command,commandParameter:this._commandParameter},true);
if(this._skinParts.button.setMinWidth){this._skinParts.button.setMinWidth(this._minWidth)
}if(this._skinParts.button.setIcon){this._skinParts.button.setIcon(this._iconSrc,this._iconSize,this._spriteOffset)
}this._skinParts.button.setLabel(this._buttonLabel)
},_onAllSkinPartsReady:function(){this.parent();
(this.isEnabled())?this._skinParts.button.enable():this._skinParts.button.disable();
this.setIcon(this._iconSrc)
},setValue:function(a){this._value=a
},getValue:function(){return this._value
},setButtonLabel:function(a){this._buttonLabel=a;
this._skinParts.button.setLabel(a)
},getButtonState:function(){this._skinParts.button.getState()
},toggleSelected:function(a){this._skinParts.button.toggleSelected(a)
},_onEnabled:function(){this._skinParts.button.enable()
},_onDisabled:function(){this._skinParts.button.disable()
},setToggleMode:function(a){this._toggleMode=!!a;
this._skinParts.button.setToggleMode(this._toggleMode)
},setIcon:function(a){if(a){this._iconSrc=a;
this._skinParts.button.setIcon(this._iconSrc)
}},setFocus:function(){this._skinParts.button.setFocus()
},_tunnelButtonEvent:function(c){var a=c.type;
switch(c.type){case"mouseover":a="over";
break;
case"mouseout":a="up";
break
}var b={value:this._value,origEvent:c,compLogic:this};
this.fireEvent(a,b)
},_listenToInput:function(){this._skinParts.button.addEvent("click",this._changeEventHandler);
this._skinParts.button.addEvent("click",this._tunnelButtonEvent);
this._skinParts.button.addEvent("over",this._tunnelButtonEvent);
this._skinParts.button.addEvent("up",this._tunnelButtonEvent)
},_stopListeningToInput:function(){this._skinParts.button.removeEvent("click",this._changeEventHandler);
this._skinParts.button.removeEvent("click",this._tunnelButtonEvent);
this._skinParts.button.removeEvent("over",this._tunnelButtonEvent);
this._skinParts.button.removeEvent("up",this._tunnelButtonEvent)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.CheckBox",skinParts:{label:{type:"htmlElement"},checkBox:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_changeEventHandler"],setValue:function(a){if(typeof a=="string"){this._skinParts.checkBox.setProperty("value",a)
}this.setChecked(a)
},getValue:function(){return this.getChecked()
},setChecked:function(a){if(a){this._skinParts.checkBox.setProperty("checked","checked")
}else{this._skinParts.checkBox.removeProperty("checked")
}},getChecked:function(){return !!this._skinParts.checkBox.getProperty("checked")
},toggleChecked:function(){var a=this.getChecked();
this.setChecked(!a)
},_onEnabled:function(){this.parent();
this._skinParts.checkBox.removeAttribute("disabled")
},_onDisabled:function(){this.parent();
this._skinParts.checkBox.setAttribute("disabled","disabled")
},_changeEventHandler:function(c){var b=this.getValue();
var a={value:b,origEvent:c,compLogic:this};
this.fireEvent("inputChanged",a)
},_listenToInput:function(){this._skinParts.checkBox.addEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.checkBox.removeEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.CheckBoxImage",skinParts:{checkBoxContainer:{type:"htmlElement"},label:{type:"htmlElement"},checkBox:{type:"htmlElement"},checkBoxImage:{type:"htmlElement"},checkBoxIcon:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.CheckBox",_states:{label:["hasLabel","noLabel"],display:["inline","block"]},Binds:["_onImageClick"],initialize:function(c,a,b){this.parent(c,a,b);
this._icon=b.icon||"";
this._image=b.image||"";
this._dimensions=b.dimensions||{w:0,h:0};
this._basePath=this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")
},render:function(){this.setBackground(this._image,this._icon,this._dimensions);
this.parent()
},setChecked:function(a){this.parent(a);
if(a){this._skinParts.checkBoxImage.addClass("checked")
}else{this._skinParts.checkBoxImage.removeClass("checked")
}},setBackground:function(e,c,d){var a=this._skinParts.checkBoxImage;
var b=this._skinParts.checkBoxIcon;
if(e&&d){a.setStyles({width:d.w,height:d.h,backgroundImage:"url("+this._basePath+e+")"})
}if(c&&d){b.setStyles({width:d.w,height:d.h,backgroundImage:"url("+this._basePath+c+")"})
}else{b.collapse()
}},_onImageClick:function(a){this.toggleChecked();
a.preventDefault();
this._skinParts.checkBox.fireEvent(Constants.CoreEvents.CHANGE,a)
},_listenToInput:function(){this.parent();
this._skinParts.checkBoxImage.addEvent(Constants.CoreEvents.CLICK,this._onImageClick)
},_stopListeningToInput:function(){this.parent();
this._skinParts.checkBoxImage.removeEvent(Constants.CoreEvents.CLICK,this._onImageClick)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ColorGroup",skinParts:{mainColor:{type:"wysiwyg.editor.components.inputs.ColorInput",argObject:{enableAlpha:false}},content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",_states:{label:["hasLabel","noLabel"],mouse:["over"]},Binds:["_colorGroupChanged","_setOver","_removeOver"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._colorList=b.colorList||[]
},_onAllSkinPartsReady:function(){this.parent();
this._themeData=W.Preview.getPreviewManagers().Theme.getDataItem();
var a=this._colorList[Math.round((this._colorList.length-1)/2)];
this._skinParts.mainColor.bindToDataItemField(this._themeData,"color_"+a);
this._listenToInput()
},render:function(){this.parent()
},_createFields:function(){var c,a,b;
if(!this._colorList||!this._colorList.length){return
}for(c=0,a=this._colorList.length;
c<a;
c++){b=this._colorList[c];
this.addColorField(this.injects().Resources.get("EDITOR_LANGUAGE","color_"+b),false,"small").bindToThemeProperty("color_"+b)
}},_colorGroupChanged:function(p){var n,k,m,d,f,q,a;
var c=new W.Color(p.value);
var b=c.getLuminous();
var o=this._getDistanceToWhite(c);
var t=Math.floor(5*b/(b+o));
var s=new W.Color(this._themeData.get("color_"+this._colorList[0]));
var j=new W.Color(this._themeData.get("color_"+this._colorList.getLast()));
var r=this._getDistanceToWhite(s);
var g=this._getDistanceToWhite(j);
var h={};
for(n=0,k=this._colorList.length;
n<k;
n++){m=this._colorList[n];
d=c.getSaturation();
if(n<t){f=(n+1)/(t+1)*b
}else{if(n==t){f=b
}else{f=(n-t)/(5-t)*(100-b)+b;
d=c.getSaturation()/(n-t+1)
}}q=new W.Color();
q.setHsl(c.getHue()+","+d+","+f);
if(r>g){a=this._colorList[n]
}else{a=this._colorList[k-1-n]
}h["color_"+a]=q.toString()
}this._themeData.setFields(h)
},_getDistanceToWhite:function(a){return Math.sqrt((100-a.getLuminous())*(100-a.getLuminous())+a.getSaturation()*a.getSaturation())
},dispose:function(){this._stopListeningToInput();
this.parent()
},_setOver:function(){this.setState("over","mouse")
},_removeOver:function(){this.removeState("over","mouse")
},_stopListeningToInput:function(){this._skinParts.mainColor.removeEvent("inputChanged",this._colorGroupChanged);
this._skinParts.mainColor.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._setOver);
this._skinParts.mainColor.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._removeOver)
},_listenToInput:function(){this._skinParts.mainColor.addEvent("inputChanged",this._colorGroupChanged);
this._skinParts.mainColor.addEvent(Constants.CoreEvents.MOUSE_OVER,this._setOver);
this._skinParts.mainColor.addEvent(Constants.CoreEvents.MOUSE_OUT,this._removeOver)
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ColorInput",skinParts:{colorButton:{type:"mobile.editor.components.ColorButton"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],mouse:["over","pressed"]},Binds:["_showPicker","_onMouseOver","_onMouseOut","_onMouseDown","_onMouseUp"],initialize:function(c,a,b){this.parent(c,a,b);
this._enableAlpha=(typeof b.enableAlpha!="undefined")?b.enableAlpha:true
},render:function(){this.parent();
this._skinParts.colorButton.enableAlpha(this._enableAlpha)
},setValue:function(a){this.setColor(a)
},getValue:function(){return this._skinParts.colorButton.getColor().getRgba()
},setColor:function(a){this._skinParts.colorButton.setColor(a)
},_showPicker:function(a){this._skinParts.colorButton.openColorPicker(a)
},_onMouseOver:function(){this.setState("over","mouse");
this.fireEvent(Constants.CoreEvents.MOUSE_OVER)
},_onMouseOut:function(){this.removeState("over","mouse");
this.removeState("pressed","mouse");
this.fireEvent(Constants.CoreEvents.MOUSE_OUT)
},_onMouseDown:function(){this.setState("pressed","mouse");
this.fireEvent(Constants.CoreEvents.MOUSE_DOWN)
},_onMouseUp:function(){this.removeState("pressed","mouse");
this.fireEvent(Constants.CoreEvents.MOUSE_UP)
},_listenToInput:function(){this._skinParts.view.addEvent(Constants.CoreEvents.CLICK,this._showPicker);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.colorButton.addEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.view.removeEvent(Constants.CoreEvents.CLICK,this._showPicker);
this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.colorButton.removeEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ColorSelectorButtonField",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{label:{type:"htmlElement"},name:{type:"htmlElement"},icon:{type:"htmlElement"},iconBg:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],mouse:["over","pressed","selected"]},Binds:["_onMouseOver","_onMouseOut","_onMouseDown","_onMouseUp","_changeEventHandler"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._color=b.colorObj||new W.Color();
this._value=b.colorName;
this._name=(this._value)?this.injects().Resources.get("EDITOR_LANGUAGE",this._value):"";
this._selected=b.selected||false
},render:function(){this.parent();
this._skinParts.iconBg.setStyle("background",this._color.getHex());
this._skinParts.name.set("text",this._name);
this.toggleSelected(this._selected)
},toggleSelected:function(a){if(typeof a!="undefined"){this._selected=!!a
}if(this._selected){this.setState("selected","mouse");
this._stopListeningToInput()
}else{this.removeState("selected","mouse");
this._stopListeningToInput();
this._listenToInput()
}},_onMouseOver:function(){this.setState("over","mouse")
},_onMouseOut:function(){this.removeState("over","mouse");
this._onMouseUp()
},_onMouseDown:function(){this.setState("pressed","mouse")
},_onMouseUp:function(){this.removeState("pressed","mouse")
},_changeEventHandler:function(c){var b=this.getValue();
if(typeof b=="string"){b=this.injects().Utils.convertToHtmlText(b)
}var a={value:b,origEvent:c,compLogic:this};
this.fireEvent("inputChanged",a);
this.fireEvent(Constants.CoreEvents.CLICK,a)
},_listenToInput:function(){this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.view.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.view.addEvent(Constants.CoreEvents.CLICK,this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.view.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.view.removeEvent(Constants.CoreEvents.CLICK,this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ColorSelectorField",skinParts:{label:{type:"htmlElement"},colorSelector:{type:"htmlElement"},color:{type:"htmlElement"},adjustButton:{type:"htmlElement"},selectorDropdown:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],adjustment:["hasAdjustment","noAdjustment"],mouse:["pressedColor","overColor","pressedAdjust","overAdjust"]},Binds:["setColor","_openColorAdjusterDialog","_onColorAdjusterClose","_onAdjustChange","_openColorSelectorDialog","_onColorChange","_onMouseDown","_onMouseUp","_onMouseOver","_onMouseOut"],initialize:function(c,a,b){this.parent(c,a,b);
this.setAlpha(b.alpha);
this.setColor(b.colorValue,b.colorSource)
},setAlpha:function(a){if(!isNaN(a)&&a!==-1){this._alpha=a;
this.setState("hasAdjustment","adjustment")
}else{this._alpha=1;
this.setState("noAdjustment","adjustment")
}},render:function(){this.parent();
this.refresh()
},refresh:function(){var a=new W.Color(this._color);
a.setAlpha(this._alpha);
if(this._skinParts){if(this._skinParts.color){this._skinParts.color.setStyles({"background-color":a.getHex()});
if(!window.Browser.ie||window.Browser.ie9){this._skinParts.color.setStyle("opacity",a.getAlpha())
}else{this._skinParts.color.setStyle("filter","alpha(opacity="+a.getAlpha()*100+")")
}}}},setValue:function(a){},_openColorSelectorDialog:function(){var b=this.injects().Utils.getPositionRelativeToWindow(this._skinParts.colorSelector);
var a={color:this._colorValue,colorSource:this._colorSource,onChange:this._onColorChange,top:b.y,left:b.x};
this.injects().Commands.executeCommand("WEditorCommands.OpenColorSelectorDialogCommand",a)
},_onColorChange:function(a,b){this.fireEvent("colorChanged",{color:a,source:b,cause:"temp"});
this.setColor(a,b);
this._alpha=1
},_openColorAdjusterDialog:function(a){var c=this.injects().Utils.getPositionRelativeToWindow(this._skinParts.colorSelector);
var b={color:this._color,alpha:this._alpha,closeCallback:this._onColorAdjusterClose,onChange:this._onAdjustChange,top:c.y,left:c.x};
this.injects().Commands.executeCommand("WEditorCommands.OpenColorAdjusterDialogCommand",b)
},_onAdjustChange:function(a){this._onColorAdjusterClose(a)
},_onColorAdjusterClose:function(a){this._alpha=a.alpha;
this.refresh();
this.fireEvent("adjustmentChanges",a)
},setColor:function(a,b){this._colorValue=a||"#000000";
this._colorSource=b||"value";
this._updateColorValue();
this.refresh()
},_updateColorValue:function(){if(this._colorSource==="theme"){this._color=this.injects().Preview.getPreviewManagers().Theme.getProperty(this._colorValue)
}else{this._color=new W.Color(this._colorValue)
}},_onMouseDown:function(a){if(a.target&&a.target.getAttribute("skinPart")=="adjustButton"){this.setState("pressedAdjust","mouse")
}else{this.setState("pressedColor","mouse")
}},_onMouseUp:function(a){this.removeState("pressedAdjust","mouse");
this.removeState("pressedColor","mouse")
},_onMouseOver:function(a){if(a.target&&a.target.getAttribute("skinPart")=="adjustButton"){this.setState("overAdjust","mouse")
}else{this.setState("overColor","mouse")
}},_onMouseOut:function(a){this.removeState("pressedAdjust","mouse");
this.removeState("pressedColor","mouse");
this.removeState("overAdjust","mouse");
this.removeState("overColor","mouse")
},isEnabled:function(){return true
},_listenToInput:function(){this._skinParts.colorSelector.addEvent(Constants.CoreEvents.CLICK,this._openColorSelectorDialog);
this._skinParts.color.addEvent(Constants.CoreEvents.CLICK,this._openColorSelectorDialog);
this._skinParts.colorSelector.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.colorSelector.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.colorSelector.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.colorSelector.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.adjustButton.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.adjustButton.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.adjustButton.addEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.adjustButton.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
if(this.getState("adjustment")=="hasAdjustment"){this._skinParts.adjustButton.addEvent(Constants.CoreEvents.CLICK,this._openColorAdjusterDialog)
}},_stopListeningToInput:function(){this._skinParts.color.removeEvent(Constants.CoreEvents.CLICK,this._openColorSelectorDialog);
this._skinParts.colorSelector.removeEvent(Constants.CoreEvents.CLICK,this._openColorSelectorDialog);
this._skinParts.colorSelector.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.colorSelector.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.colorSelector.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.colorSelector.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.adjustButton.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.adjustButton.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.adjustButton.removeEvent(Constants.CoreEvents.MOUSE_OVER,this._onMouseOver);
this._skinParts.adjustButton.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.adjustButton.removeEvent(Constants.CoreEvents.CLICK,this._openColorAdjusterDialog)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ComboBox",skinParts:{label:{type:"htmlElement"},collection:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.SelectionListInput",_states:{label:["hasLabel","noLabel"]},initialize:function(c,a,b){this.parent(c,a,b);
this._htmlItems={};
this._omitBreakLinesUsage=true
},_createSingleRepeater:function(b){var a=new Element("option");
a.set({value:b.value,html:b.label||b.value});
if(b.styles){a.setStyles(b.styles)
}this._htmlItems[b.value]=a;
return a
},setValue:function(b){var c=this._skinParts.collection.getSelected()[0];
var a=this._htmlItems[b];
if(a){c&&c.erase("selected");
a.set("selected","selected")
}},getValue:function(){return this._skinParts.collection.get("value")
},_listenToInput:function(){this._skinParts.collection.addEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.collection.removeEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
},setFocus:function(){this._skinParts.collection.focus()
},getAcceptableDataTypes:function(){return["list",""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.DataItemSelectionListInput",skinParts:{label:{type:"htmlElement"},collection:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.SelectionListInput",Binds:["_onRepeaterClick"],_onRepeaterClick:function(a){this.setValue(a.data);
this._updateSelection(a.target.getLogic())
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.DocInput",skinParts:{label:{type:"htmlElement"},docName:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_openMediaDialog","_onDocSelect"],initialize:function(c,a,b){this.parent(c,a,b);
this._buttonText=b.buttonText||"";
this._docRawData=null
},render:function(){this.parent();
if(this._data){this._buttonText=this._data.get("text")
}this.setButton(this._buttonText);
if(this._dataIsOfTypeDoc()){this._docRawData=this._data.getData()
}if(this._docRawData){this.setValue(this._docRawData)
}this._listenToInput()
},setValue:function(a){if(a){this._docRawData=a;
if(this._dataIsOfTypeDoc()){this._data.setData(a)
}}},getValue:function(){return this._docRawData||null
},setButton:function(a){if(a){this._skinParts.docName.set("value",a)
}else{this._skinParts.docName.set("value","")
}},_dataIsOfTypeDoc:function(){return this._data&&this._data.getType&&this._data.getType()=="Document"
},_openMediaDialog:function(){W.EditorDialogs.openMediaDialog(this._onDocSelect,false,"documents")
},_onDocSelect:function(a){this._buttonText=a.title;
this.setValue(a);
this._changeEventHandler()
},_changeEventHandler:function(a){this.parent(a)
},setFocus:function(){this._skinParts.docName.focus()
},_listenToInput:function(){this._view.addEvent(Constants.CoreEvents.CLICK,this._openMediaDialog)
},_stopListeningToInput:function(){this._view.removeEvent(Constants.CoreEvents.CLICK,this._openMediaDialog)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.FlashInput",skinParts:{label:{type:"htmlElement"},imageContainer:{type:"htmlElement"},image:{type:"mobile.core.components.Image",argObject:{cropMode:"fill",scaleMode:"width_height"}},changeButton:{type:"wysiwyg.editor.components.WButton"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],"delete":["hasDelete"]},Binds:["_openFlashDialog","_onFlashSelect"],HeightWidth:{height:null,width:null},initialize:function(c,a,b){this.parent(c,a,b);
this._buttonText=b.buttonText||"";
this._flashRawData=null;
this._hasDeleteButton=false;
this.HeightWidth.height=b.height;
this.HeightWidth.width=b.width
},render:function(){this.parent();
this.setButton(this._buttonText);
if(this.HeightWidth.height&&this.HeightWidth.height<64){var b=(64-this.HeightWidth.height)/2;
this._skinParts.imageContainer.setStyles({height:this.HeightWidth.height,width:this.HeightWidth.width,margin:b})
}var a=W.Data.createDataItem({type:"Image",uri:W.Theme.getProperty("THEME_DIRECTORY")+"flash_swf_icon.png"});
this._skinParts.image._useWebUrl=true;
this._skinParts.image.setDataItem(a)
},setValue:function(e){if(!e||!e.uri||e==this._flashRawData){return
}this._flashRawData=e;
var a=this._data.getData();
for(var d in e){var c=e[d];
var b=a[d];
if(c!=b){this._data.set(d,c,true)
}}this._data.fireDataChangeEvent("uri",this._data.get("uri"))
},getValue:function(){return this._flashRawData||null
},setButton:function(a){if(a){this._skinParts.changeButton.uncollapse();
this._skinParts.changeButton.setLabel(a)
}else{this._skinParts.changeButton.collapse();
this._skinParts.changeButton.setLabel("")
}},_openFlashDialog:function(){W.EditorDialogs.openMediaDialog(this._onFlashSelect,false,"swf",false)
},_onFlashSelect:function(b){b.width=Number(b.width);
b.height=Number(b.height);
var a=this.injects().Data.createDataItem(b);
this.setValue(a.getData());
this._changeEventHandler({})
},_changeEventHandler:function(a){this.parent(a)
},_listenToInput:function(){this._skinParts.imageContainer.addEvent(Constants.CoreEvents.CLICK,this._openFlashDialog);
this._skinParts.changeButton.addEvent(Constants.CoreEvents.CLICK,this._openFlashDialog)
},_stopListeningToInput:function(){this._skinParts.imageContainer.removeEvent(Constants.CoreEvents.CLICK,this._openFlashDialog);
this._skinParts.changeButton.removeEvent(Constants.CoreEvents.CLICK,this._openFlashDialog)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.FontButtonInput",skinParts:{label:{type:"htmlElement"},button:{type:"wysiwyg.editor.components.FontButton"}},Class:{Extends:"wysiwyg.editor.components.inputs.ButtonInput",_states:{label:["hasLabel","noLabel"],editable:["disabled","enabled"]},initialize:function(c,a,b){this.parent(c,a,b);
this._name=b.name||"";
this._label=b.label||b.buttonLabel||"";
this._font=b.font||""
},render:function(){this._skinParts.button.setLabel(this._label);
this._skinParts.button.setFont(this._font);
this._skinParts.button.setName(this._name)
},setValue:function(a){this._font=a;
this._renderIfReady()
},getValue:function(){return this._font
},_changeEventHandler:function(c){if(c&&c.font){this.setValue(c.font)
}var b=this.getValue();
if(typeof b=="string"){b=this.injects().Utils.convertToHtmlText(b)
}var a={value:b,origEvent:c,compLogic:this};
this.fireEvent("inputChanged",a)
},_listenToInput:function(){this._skinParts.button.addEvent("change",this._changeEventHandler);
this._skinParts.button.addEvent("click",this._tunnelButtonEvent);
this._skinParts.button.addEvent("over",this._tunnelButtonEvent);
this._skinParts.button.addEvent("up",this._tunnelButtonEvent)
},_stopListeningToInput:function(){this._skinParts.button.removeEvent("change",this._changeEventHandler);
this._skinParts.button.removeEvent("click",this._tunnelButtonEvent);
this._skinParts.button.removeEvent("over",this._tunnelButtonEvent);
this._skinParts.button.removeEvent("up",this._tunnelButtonEvent)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ImageInput",skinParts:{label:{type:"htmlElement"},imageContainer:{type:"htmlElement"},image:{type:"mobile.core.components.Image",argObject:{cropMode:"fill"}},changeButton:{type:"wysiwyg.editor.components.WButton"},deleteButton:{type:"wysiwyg.editor.components.WButton"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],"delete":["hasDelete"],image:["missingImage"]},Binds:["_openImageDialog","_onImgSelect","_onImageDelete","_dataIsOfTypeImage"],HeightWidth:{height:null,width:null},initialize:function(c,a,b){this.parent(c,a,b);
this._buttonText=b.buttonText||"";
this._deleteText=b.deleteText||"";
this._galleryTypeID=b.galleryConfigID||"photos";
this._imageRawData=null;
this._hasDeleteButton=b.hasDelete||false;
this.HeightWidth.height=b.height;
this.HeightWidth.width=b.width;
this.setCommand("WEditorCommands.OpenImageDialog")
},render:function(){this.parent();
this.setButton(this._buttonText);
this.setDelete(this._deleteText);
this._skinParts.deleteButton.getViewNode().setStyles({textAlign:"right",color:"#aa0000"});
if(this._dataIsOfTypeImage()){this._imageRawData=this._data.getData()
}this.setValue(this._imageRawData);
if(this.HeightWidth.height&&this.HeightWidth.height<64){var a=(64-this.HeightWidth.height)/2;
this._skinParts.imageContainer.setStyles({height:this.HeightWidth.height,width:this.HeightWidth.width,margin:a})
}},setValue:function(b){var a=null;
this._imageRawData=b;
if(this._imageRawData&&this._imageRawData.uri&&this._imageRawData.uri!="none"){if(this._dataIsOfTypeImage()){this._data.setData(b);
a=this._data
}else{a=W.Data.createDataItem(this._imageRawData)
}this._skinParts.image.setDataItem(a);
this.removeState("missingImage","image")
}else{this.setState("missingImage","image")
}},getValue:function(){return this._imageRawData||null
},setButton:function(a){if(a){this._skinParts.changeButton.uncollapse();
this._skinParts.changeButton.setLabel(a)
}else{this._skinParts.changeButton.collapse();
this._skinParts.changeButton.setLabel("")
}},setDelete:function(a){if(a){this._skinParts.deleteButton.uncollapse();
this._skinParts.deleteButton.setLabel(a);
this.setState("hasDelete","delete");
this._skinParts.deleteButton.addEvent(Constants.CoreEvents.CLICK,this._onImageDelete)
}else{this._skinParts.deleteButton.collapse();
this._skinParts.deleteButton.setLabel("");
this.removeState("hasDelete","delete");
this._skinParts.deleteButton.removeEvent(Constants.CoreEvents.CLICK,this._onImageDelete)
}},_onImageDelete:function(a){this.setValue(null);
this._changeEventHandler(a)
},_dataIsOfTypeImage:function(){return this._data&&this._data.getType&&this._data.getType()=="Image"
},_openImageDialog:function(){this.executeCommand({callback:this._onImgSelect,galleryTypeID:this._galleryTypeID})
},_onImgSelect:function(b){b.width=Number(b.width);
b.height=Number(b.height);
var a=this.injects().Data.createDataItem(b);
this.setValue(a.getData());
this._changeEventHandler({})
},_changeEventHandler:function(a){this.parent(a)
},_listenToInput:function(){this._skinParts.imageContainer.addEvent(Constants.CoreEvents.CLICK,this._openImageDialog);
this._skinParts.changeButton.addEvent(Constants.CoreEvents.CLICK,this._openImageDialog)
},_stopListeningToInput:function(){this._skinParts.imageContainer.removeEvent(Constants.CoreEvents.CLICK,this._openImageDialog);
this._skinParts.changeButton.removeEvent(Constants.CoreEvents.CLICK,this._openImageDialog);
this._skinParts.deleteButton.removeEvent(Constants.CoreEvents.CLICK,this._onImageDelete)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.InlineTextLinkInput",skinParts:{label:{type:"htmlElement"},prefixText:{type:"htmlElement"},postfixText:{type:"htmlElement"},button:{type:"wysiwyg.editor.components.WButton"}},Class:{Extends:"wysiwyg.editor.components.inputs.ButtonInput",initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._prefixText=b.prefixText||"";
this._postfixText=b.postfixText||""
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.prefixText.set("text",this._prefixText+" ");
this._skinParts.postfixText.set("text"," "+this._postfixText)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.Input",skinParts:{label:{type:"htmlElement"},input:{type:"htmlElement"},message:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],validation:["invalid"]},Binds:["_fireBlur","_fireKeyUp","_setLastValidInput","_revertToLastValidInputIfCurrentInvalid"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._placeholderText=b.placeholderText||"";
this._minLength=b.minLength||Constants.Inputs.Default.MIN_LENGTH;
this._maxLength=b.maxLength||Constants.Inputs.Default.MAX_LENGTH;
this._minLengthErrorMessage="Error: text length is below minimum length.";
this._maxLengthErrorMessage="Error: text length is higher than maximum length.";
this._labelText=b.labelText||"";
this.setValidators(b.validatorArgs||{})
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.input.addEvent("focus",this._setLastValidInput);
this._skinParts.input.addEvent("blur",this._revertToLastValidInputIfCurrentInvalid)
},_setLastValidInput:function(){this._lastValidInput=this.getValue()
},_revertToLastValidInputIfCurrentInvalid:function(){if(this.getInputValidationErrorMessage()){this._skinParts.input.set("value",this._lastValidInput);
this._resetInvalidState()
}},render:function(){this.parent();
this.setPlaceholder(this._placeholderText);
this.setMaxLength(this._maxLength);
if(this.getState("validation")=="invalid"){this.setState("invalid","validation")
}else{this._resetInvalidState()
}},isValidInput:function(){return(!(this.getState("validation")=="invalid"))
},setFocus:function(){this._skinParts.input.focus()
},setMaxLength:function(a){this._maxLength=a;
this._skinParts.input.setProperty("maxlength",a)
},setValue:function(c,b){var a=this._skinParts.input;
if(this.hasPlaceholder){a.removeClass("isPlaceholder")
}a.set("value",c);
if(b){a.set("isPreset","true")
}else{a.erase("isPreset")
}},getValue:function(){var a=this._skinParts.input;
var b="";
if(!a.hasClass("isPlaceholder")){b=a.get("value")
}return b
},_onEnabled:function(){this.parent();
this._skinParts.input.removeAttribute("disabled")
},_onDisabled:function(){this.parent();
this._skinParts.input.setAttribute("disabled","disabled")
},getInputValidationErrorMessage:function(){var e=this.getValue();
var d="";
if(e.length>this._maxLength){d=this._maxLengthErrorMessage+" "+this._maxLength
}else{if(e.length<this._minLength){d=this._minLengthErrorMessage+" "+this._minLength
}else{if(this._validators&&this._validators.length){for(var c=0,a=this._validators.length;
c<a;
c++){var b=this._validators[c];
d=b(e);
if(d){break
}}}}}return d
},_showValidationMessage:function(a){this.setState("invalid","validation");
if(this._skinParts.message){this._skinParts.message.set("text",a);
this._skinParts.message.uncollapse()
}},_resetInvalidState:function(){this.removeState("invalid","validation");
if(this._skinParts.message){this._skinParts.message.set("text","");
this._skinParts.message.collapse()
}},setPlaceholder:function(a){this._skinParts.input.set("placeholder",a);
if(window.Modernizr&&!window.Modernizr.input.placeholder){this._placeholderPolyFill()
}},setValidators:function(a){this._validators=a.validators||[];
this._validationOkCallback=a.validationOkCallback||function(){};
this._validationFailCallback=a.validationFailCallback||function(){}
},_placeholderPolyFill:function(){function b(d){var c=d.target;
if(c.get("value")==""&&c.get("placeholder")){c.addClass("isPlaceholder");
c.set("value",c.get("placeholder"))
}}function a(d){var c=d.target;
if(c.hasClass("isPlaceholder")){c.removeClass("isPlaceholder");
c.set("value","")
}}if(!this.hasPlaceholder){this.hasPlaceholder=true;
this._skinParts.input.addEvent("focus",a);
this._skinParts.input.addEvent("blur",b)
}b({target:this._skinParts.input})
},_changeEventHandler:function(b){if(b.code&&!W.Utils.isInputKey(b.code)){return
}var a=this.getInputValidationErrorMessage();
if(a){this._showValidationMessage(a);
this._validationFailCallback(a);
return false
}else{this._resetInvalidState();
this._validationOkCallback();
this._setLastValidInput()
}this._skinParts.input.set("isPreset","");
this.parent(b)
},_selectPresetFieldContent:function(a){if(a.target.get("isPreset")){if(!a.target.get("isSelected")){a.target.set("isSelected","true");
a.target.select()
}}},_deselectPresetFieldContent:function(a){a.target.erase("isSelected")
},_fireBlur:function(a){this.fireEvent(Constants.CoreEvents.BLUR,a)
},_fireKeyUp:function(a){this.fireEvent(Constants.CoreEvents.KEY_UP,a)
},showValidationMessage:function(a){this._showValidationMessage(a)
},resetInvalidState:function(){this._resetInvalidState()
},_listenToInput:function(){this._skinParts.input.addEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.KEY_UP,this._fireKeyUp);
this._skinParts.input.addEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.CLICK,this._selectPresetFieldContent);
this._skinParts.input.addEvent(Constants.CoreEvents.BLUR,this._deselectPresetFieldContent);
this._skinParts.input.addEvent(Constants.CoreEvents.BLUR,this._fireBlur)
},_stopListeningToInput:function(){this._skinParts.input.removeEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.KEY_UP,this._fireKeyUp);
this._skinParts.input.removeEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.CLICK,this._selectPresetFieldContent);
this._skinParts.input.removeEvent(Constants.CoreEvents.BLUR,this._deselectPresetFieldContent);
this._skinParts.input.removeEvent(Constants.CoreEvents.BLUR,this._fireBlur)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.InputGroup",skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",_states:{label:["hasLabel","noLabel"],collapsibiliy:["collapsed","uncollapsed"]},Binds:["toggleCollapseState"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
if(b.width){this.setWidth(b.width)
}this._padding=b.padding||0;
this._createFields=b.createFieldsFunc||function(){};
this._labels={collapse:b.collapseLabel||this.injects().Resources.get("EDITOR_LANGUAGE","GROUP_COLLAPSE"),expand:b.expandLabel||this.injects().Resources.get("EDITOR_LANGUAGE","GROUP_EXPAND")};
this._buttonLabel=this._labels.collapse;
this._useCollapseButton=b.useCollapseButton||false;
this._collapseAtStart=b.collapseAtStart||false;
this._data=b.groupData||null;
this._previewComponent=b.previewComponent;
this._inlineAlignment=b.align||""
},_onAllSkinPartsReady:function(){if(this._useCollapseButton){this._isCollapsed=false
}else{}this.setState("uncollapsed","collapsibiliy");
if(this._collapseAtStart){this.toggleCollapseState()
}},render:function(){this.parent();
this._buttonLabel=(this._isCollapsed)?this._labels.collapse:this._labels.expand;
if(this._inlineAlignment){this._skinParts.content.setStyle("text-align",this._inlineAlignment)
}this._skinParts.view.setStyle("padding",this._padding)
},toggleCollapseState:function(){if(this._isCollapsed){this.uncollapseGroup()
}else{this.collapseGroup()
}},collapseGroup:function(){this._skinParts.content.collapse();
this._isCollapsed=true;
this.setState("collapsed","collapsibiliy")
},uncollapseGroup:function(){this._skinParts.content.uncollapse();
this._isCollapsed=false;
this.setState("uncollapsed","collapsibiliy")
},dispose:function(){this._stopListeningToInput();
this.parent()
},_stopListeningToInput:function(){},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.Label",skinParts:{label:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],icon:["hasIcon"]},initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._styles=b.styles||null;
this._spriteSrc=b.spriteSrc||null;
this._spriteOffset=b.spriteOffset||{x:0,y:0};
this._spriteSize=b.spriteSize||{width:"16px",height:"16px"}
},render:function(){this.parent();
if(this._styles){this._skinParts.view.setStyles(this._styles)
}if(this._spriteSrc){this.setState("hasIcon","icon");
var a=this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")+this._spriteSrc;
this._skinParts.icon.setStyles({background:"url("+a+") no-repeat "+this._spriteOffset.x+" "+this._spriteOffset.y,width:this._spriteSize.width,height:this._spriteSize.height})
}},setValue:function(a){this.setLabel(a)
},getValue:function(){return this._skinParts.label.get("html")
},_changeEventHandler:function(a){this.parent(a)
},_listenToInput:function(){},_stopListeningToInput:function(){}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.Link",skinParts:{label:{type:"htmlElement"},input:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.Input",Binds:["_openLinkDialog","_onLinkDialogClosed"],_states:{label:["hasLabel","noLabel"],validation:["invalid"]},initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._placeholderText=b.placeholderText||this.injects().Resources.get("EDITOR_LANGUAGE","LINK_ADD_LINK");
this._changeCallBack=b.changeCallBack;
this._state="Link";
this._previewData=b.previewData
},setValue:function(c,a){this._linkData=Object.subset(c,["href","icon","linkType","target","text","type"]);
var b=this._linkStringFromObj(c);
return this.parent(b,a)
},getValue:function(){return this._linkStringFromObj(this._linkData)
},_linkStringFromObj:function(e){var c="";
var g="";
if(!e){return g
}var d=e.linkType;
switch(d){case"WEBSITE":c=e.href;
break;
case"PAGE":var b=W.Utils.hash.getHashParts(e.href);
var f=b.title,h=b.id;
c="Page - "+f;
break;
case"DOCUMENT":c="Document - "+e.text;
break;
case"EMAIL":c="Email - "+W.Utils.getMailFromMailtoURL(e.href);
break;
case"LOGIN":c="Login / Signup Dialog";
break;
default:c=g;
break
}return c
},_onAllSkinPartsReady:function(){this._skinParts.input.set("readonly","readonly");
this.parent()
},getInputValidationErrorMessage:function(){return""
},_openLinkDialog:function(a){var c=this.injects().Utils.getPositionRelativeToWindow(this._skinParts.view);
var b={data:this._previewData,closeCallback:this._onLinkDialogClosed,top:c.y,left:c.x};
this.injects().Commands.executeCommand("WEditorCommands.OpenLinkDialogCommand",b)
},_onLinkDialogClosed:function(b,a){if(this._changeCallBack){this._changeCallBack(b,a)
}},_listenToInput:function(){this._skinParts.input.addEvent(Constants.CoreEvents.CLICK,this._openLinkDialog);
this._skinParts.input.addEvent(Constants.CoreEvents.BLUR,this._deselectPresetFieldContent)
},_stopListeningToInput:function(){this._skinParts.input.removeEvent(Constants.CoreEvents.CLICK,this._openLinkDialog);
this._skinParts.input.removeEvent(Constants.CoreEvents.BLUR,this._deselectPresetFieldContent)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.ListEditorButton",skinParts:{label:{type:"htmlElement"},button:{type:"wysiwyg.editor.components.WButton"}},Class:{Extends:"wysiwyg.editor.components.inputs.ButtonInput",_states:{label:["hasLabel","noLabel"],editable:["disabled","enabled"]},Binds:["_tunnelButtonEvent","_openPanel"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._labelText=b.labelText||"";
this._listData=b.listData;
this._galleryConfigID=b.galleryConfigID;
this.setCommand("WEditorCommands.OpenListEditDialog")
},_listenToInput:function(){this.parent();
this._view.addEvent("click",this._openPanel)
},_stopListeningToInput:function(){this.parent();
this._view.removeEvent("click",this._openPanel)
},_openPanel:function(){this.executeCommand({data:this._listData,galleryConfigID:this._galleryConfigID})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.Radio",skinParts:{radioContainer:{type:"htmlElement"},label:{type:"htmlElement"},radio:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"],display:["inline","block"],editable:["disabled","enabled"]},initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._labelText=b.labelText||"";
this._group=b.group||"";
this._value=b.value||"";
this._display=(b.display=="inline")?b.display:"block"
},render:function(){this.setLabel(this._labelText);
this.setGroup(this._group);
this.setDisplay(this._display);
this.setValue(this._value)
},setValue:function(a){this._skinParts.radio.set("value",a)
},getValue:function(){return this._skinParts.radio.get("value")
},setChecked:function(a){if(a){this._skinParts.radio.set("checked","checked")
}else{this._skinParts.radio.erase("checked")
}},getChecked:function(){return !!this._skinParts.radio.get("checked")
},setDisplay:function(a){if(a=="inline"){this.setState("inline","display")
}else{this.setState("block","display")
}},setGroup:function(a){this._skinParts.radio.set("name",a)
},_onEnabled:function(){this.parent();
this._skinParts.radio.removeAttribute("disabled")
},_onDisabled:function(){this.parent();
this._skinParts.radio.setAttribute("disabled","disabled")
},_changeEventHandler:function(a){this.parent(a)
},_listenToInput:function(){this._skinParts.radio.addEvent("change",this._changeEventHandler);
this._skinParts.radio.addEvent("click",this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.radio.removeEvent("change",this._changeEventHandler);
this._skinParts.radio.removeEvent("click",this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.RadioButtons",skinParts:{label:{type:"htmlElement"},radioButtons:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_onRadioReady"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._presetList=b.presetList||[];
this._initialValue=b.defaultValue||null;
this._labelText=b.labelText||"";
this._display=(b.display=="inline")?b.display:"block";
this._group=b.group||"radios_"+new Date().getTime();
this._radioButtonsLogic={};
this._radioButtonsElements={};
this._value="";
this._isButtonsLogicReady=false
},render:function(){this.setLabel(this._labelText)
},_prepareForRender:function(){if(this._isButtonsLogicReady){return true
}this.setRadioButtons(this._presetList,this._initialValue);
return this._isButtonsLogicReady
},setRadioButtons:function(d,b){if(d&&d.length){this._initialValue=b||this._initialValue;
var a=this._skinParts.radioButtons;
var c;
if(this._presetList!=d){this._presetList=d
}a.empty();
this._radioButtonsLogic={};
this._radioButtonsElements={};
d.forEach(function(e){e=(typeof e!="undefined")?e:{};
if(e==Constants.AutoPanel.BREAK){a.grab(new Element("br"),"bottom")
}else{if(this._radioButtonsElements[e.value]){}c=this.injects().Components.createComponent("wysiwyg.editor.components.inputs.Radio","wysiwyg.editor.skins.inputs.RadioSkin",undefined,{labelText:e.label,group:this._group,value:e.value,display:this._display},null,this._onRadioReady);
this._radioButtonsElements[e.value]=c;
c.insertInto(a)
}},this)
}else{this._isButtonsLogicReady=true;
this._renderIfReady()
}},_onRadioReady:function(a){a.addEvent("inputChanged",this._changeEventHandler);
var b=Object.every(this._radioButtonsElements,function(c,d){return(c.getLogic&&c.getLogic().isReady())
},this);
if(b){this._radioButtonsLogic=Object.map(this._radioButtonsElements,function(c){return c.getLogic()
},this);
if(this._initialValue&&this._radioButtonsLogic[this._initialValue]){this._radioButtonsLogic[this._initialValue].setChecked(true)
}this._isButtonsLogicReady=true;
this._renderIfReady()
}},setValue:function(d,b){for(var a in this._radioButtonsLogic){var c=this._radioButtonsLogic[a];
if(a===d.toString()){c.setChecked(true);
this._value=a;
if(b){this._skinParts.radioButtons.set("isPreset","true")
}else{this._skinParts.radioButtons.erase("isPreset")
}}else{c.setChecked(false)
}}},getValue:function(){return this._value
},_onEnabled:function(){this.parent();
Object.forEach(this._radioButtonsLogic,function(a){a.enable()
})
},_onDisabled:function(){this.parent();
Object.forEach(this._radioButtonsLogic,function(a){a.disable()
})
},_changeEventHandler:function(a){this.setValue(a.value);
this.parent(a)
},_listenToInput:function(){},_stopListeningToInput:function(){Object.forEach(this._radioButtonsLogic,function(a){a.removeEvent("inputChanged",this._changeEventHandler)
})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.RadioImage",skinParts:{radioContainer:{type:"htmlElement"},label:{type:"htmlElement"},radio:{type:"htmlElement"},radioImage:{type:"htmlElement"},radioIcon:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.Radio",_states:{label:["hasLabel","noLabel"],display:["inline","block"]},initialize:function(c,a,b){this.parent(c,a,b);
this._icon=b.icon||"";
this._image=b.image||"";
this._dimensions=b.dimensions||{w:0,h:0};
this._basePath=this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")
},render:function(){this.setBackground(this._image,this._icon,this._dimensions);
this.parent()
},setChecked:function(a){this.parent(a);
if(a){this._skinParts.radioImage.addClass("selected")
}else{this._skinParts.radioImage.removeClass("selected")
}},setBackground:function(e,c,d){var a=this._skinParts.radioImage;
var b=this._skinParts.radioIcon;
if(e&&d){a.setStyles({width:d.w,height:d.h,backgroundImage:"url("+this._basePath+"/"+e+")"})
}if(c&&d){b.setStyles({width:d.w,height:d.h,backgroundImage:"url("+this._basePath+"/"+c+")"})
}else{b.collapse()
}a.addEvent("click",function(f){this.setChecked(true)
}.bind(this))
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.RadioImages",skinParts:{label:{type:"htmlElement"},radioButtons:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.RadioButtons",_states:{label:["hasLabel","noLabel"]},Binds:["_onRadioReady"],initialize:function(c,a,b){this.parent(c,a,b);
this._display="inline"
},setRadioButtons:function(d,b){if(d&&d.length){this._initialValue=b||this._initialValue;
var a=this._skinParts.radioButtons;
var c;
if(this._presetList!=d){this._presetList=d
}a.empty();
this._radioButtonsLogic={};
this._radioButtonsElements={};
d.forEach(function(e){e=(typeof e!="undefined")?e:{};
if(e==Constants.AutoPanel.BREAK){a.grab(new Element("br"),"bottom")
}else{if(this._radioButtonsElements[e.value]){}c=this.injects().Components.createComponent("wysiwyg.editor.components.inputs.RadioImage","wysiwyg.editor.skins.inputs.RadioImageSkin",undefined,{labelText:e.label,group:this._group,value:e.value,image:e.image,icon:e.icon,dimensions:e.dimensions,bgposition:e.bgposition,display:this._display},null,this._onRadioReady);
this._radioButtonsElements[e.value]=c;
c.insertInto(a)
}},this)
}else{this._isButtonsLogicReady=true;
this._renderIfReady()
}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.SelectableListItem",skinParts:{img:{type:"mobile.core.components.Image",dataRefField:"*"},trashButton:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_onDeleteClicked","_onMoveUpClicked","_onMoveDownClicked"],_states:{selection:["up","selected"],position:["firstItem","lastItem","singleItem","middleItem"]},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.trashButton.addEvent("click",this._onDeleteClicked);
this._skinParts.upButton.addEvent("click",this._onMoveUpClicked);
this._skinParts.downButton.addEvent("click",this._onMoveDownClicked)
},_onDeleteClicked:function(a){a.stopPropagation();
this.fireEvent(Constants.SelectionListEvents.DELETE_ITEM,this._data)
},_onMoveUpClicked:function(a){a.stopPropagation();
this.fireEvent(Constants.SelectionListEvents.MOVE_UP_ITEM,this._data)
},_onMoveDownClicked:function(a){a.stopPropagation();
this.fireEvent(Constants.SelectionListEvents.MOVE_DOWN_ITEM,this._data)
},getAcceptableDataTypes:function(){return["Image"]
}}});
Constants.SelectionListEvents={DELETE_ITEM:"deleteItem",MOVE_UP_ITEM:"moveUpItem",MOVE_DOWN_ITEM:"moveDownItem"};
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.SelectionListInput",skinParts:{label:{type:"htmlElement"},collection:{type:"htmlElement"}},traits:["wysiwyg.editor.components.traits.BindDataProvider"],imports:["mobile.core.managers.data.DataItemBase"],Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",Binds:["_onRepeaterClick","_propagateEvent","_deleteItem","_moveUpItem","_moveDownItem"],initialize:function(d,b,c){this.parent(d,b,c);
c=c||{};
var a=c.repeaterArgs||{};
this._repeaterComp=a.type;
this._repeaterSkin=a.skin;
this._repeaterArgs=a.args||{};
this._repeaterArgsFilter=a.repeaterArgsFilter;
this._repeaterDataFilter=a.repeaterDataFilter;
this._numRepeatersInLine=a.numRepeatersInLine;
this._dataItemFilter=c.dataItemFilter;
this._componentArgs=a;
this._disableReRender=false;
this._selectItemAtIndex=-1;
this._repeatersSelectable=(typeof c.repeatersSelectable!="undefined")?c.repeatersSelectable:true;
if(c.dataProvider){if(typeof c.dataProvider=="string"&&c.dataProvider.indexOf("#")==0){this.injects().Data.getDataByQuery(c.dataProvider,function(e){this.bindToDataProvider(e)
}.bind(this))
}else{this.bindToDataProvider(c.dataProvider)
}}else{LOG.reportError(wixErrors.INVALID_INPUT_BIND,this.className,"initialize","xx")()
}this.addEvent("subMenuCloses",function(){this._clearSelection()
}.bind(this))
},_onAllSkinPartsReady:function(){this.parent();
if(this._componentArgs&&this._componentArgs.scrollable){this._view.setStyles({overflow:"auto",height:this._componentArgs.height,width:this._componentArgs.width})
}},selectItemAtIndex:function(a){this._selectItemAtIndex=a
},bindToDataItemAndFilterFromDataProvider:function(b,a){var c=null;
if(Array.isArray(a)){c=Object.filter(this.getDataProviderItem(0),function(e,d){return !a.contains(d)
})
}else{c=this.getDataProviderItem(0)
}this.bindToDataItemsFilteredFields(b,c)
},dispose:function(){this._repeaterArgsFilter=null;
this._repeaterDataFilter=null;
this._dataItemFilter=null;
this._comps=null;
this._disposeChildren();
this.parent()
},_prepareForRender:function(){if(!this._dataProvider){return false
}this._items=this._dataProvider.get("items")||[];
if(this._dataItemFilter){this._items=this._items.filter(this._dataItemFilter)
}this._explicitBreakLineExist=this._items.some(function(a){return a===Constants.SelectionListInput.BREAK_LINE
});
this._setItems();
return true
},_getComps:function(){return this._comps
},_setItems:function(){if(this._disableReRender){return
}this._comps=[];
var e=this._skinParts.collection;
var a,c;
this._storeCollectionForReuse(e);
var b=this._view.scrollTop;
e.empty();
if(this._omitBreakLinesUsage||(this._numRepeatersInLine==1&&!this._explicitBreakLineExist)){for(c=0;
c<this._items.length;
c++){a=this._createSingleRepeater(this._items[c],c===this._selectItemAtIndex,c);
this._comps.push(a);
a.insertInto(e)
}}else{var d=new Element("div",{"class":"inline-component-group"});
for(c=0;
c<this._items.length;
c++){if(this._items[c]!==Constants.SelectionListInput.BREAK_LINE){a=this._createSingleRepeater(this._items[c],c===this._selectItemAtIndex,c);
this._comps.push(a);
a.addClass("inline-component");
a.insertInto(d)
}if(this._items[c]===Constants.SelectionListInput.BREAK_LINE||(this._numRepeatersInLine>0&&(c+1)%this._numRepeatersInLine==0)){d.insertInto(e);
d=new Element("div",{"class":"inline-component-group"})
}}if(d.getChildren().length>0){d.insertInto(e)
}}this._view.scrollTop=b
},_listenToInput:function(){},_getSingleRepeaterDataItem:function(d){if(instanceOf(d,this.imports.DataItemBase)){return d
}var a=this._dataProvider.getDataManager();
if(typeof d=="string"){return a.getDataByQuery(d,function(){})
}var b={};
for(var c in d){b[c]=d[c]
}if(b.type==null){b.type="list"
}return a.createDataItem(b)
},_storeCollectionForReuse:function(b){this._repeaterPool=[];
for(var a=0;
a<b.children.length;
a++){if(b.children[a].getLogic){this._repeaterPool.push(b.children[a])
}}},_findExistingRepeater:function(c){var a;
var d=this._repeaterPool;
for(var b=0;
b<d.length;
b++){if(d[b].getLogic){a=d[b].getLogic();
if(a.getDataItem()===c){return d[b]
}}}return null
},_setupRepeaterStates:function(a,e,d,c){if(d){if(a.hasState("selected")&&this._repeatersSelectable){a.setState("selected")
}}var b="middleItem";
if(c===0&&a.hasState("firstItem")){b="firstItem"
}if(c===this._items.length-1&&a.hasState("lastItem")){b="lastItem"
}if(this._items.length==1&&a.hasState("singleItem")){b="singleItem"
}if(a.hasState(b)){a.setState(b)
}},_createSingleRepeater:function(f,d,c){var a;
var b=this._repeaterArgsFilter?this._repeaterArgsFilter(e,this._repeaterArgs):this._repeaterArgs;
var e=this._getSingleRepeaterDataItem(f);
if(this._repeaterDataFilter){e=this._repeaterDataFilter(e)
}a=this._findExistingRepeater(e);
if(a){this._setupRepeaterStates(a.getLogic(),e,d,c)
}else{a=this.injects().Components.createComponent(this._repeaterComp,this._repeaterSkin,e,b,null,function(g){a.addEvent("click",function(){var h={data:e,target:a};
g.fireEvent("click",h)
});
a.addEvent("mouseenter",function(){var h={data:e.getData(),target:a};
this.fireEvent("itemOver",h)
}.bind(this));
a.addEvent("mouseleave",function(){var h={data:e.getData(),target:a};
this.fireEvent("itemOut",h)
}.bind(this));
g.addEvent("click",this._onRepeaterClick);
g.addEvent("propagateEvent",this._propagateEvent);
g.addEvent(Constants.SelectionListEvents.DELETE_ITEM,this._deleteItem);
g.addEvent(Constants.SelectionListEvents.MOVE_UP_ITEM,this._moveUpItem);
g.addEvent(Constants.SelectionListEvents.MOVE_DOWN_ITEM,this._moveDownItem);
if(d){g.fireEvent("click",{data:e,target:a})
}this._setupRepeaterStates(g,e,d,c)
}.bind(this))
}return a
},_propagateEvent:function(a){this.fireEvent(a.type,a)
},_getItemIndex:function(a){var b=this._dataProvider.get("items");
var c=a._data.id;
return b.indexOf("#"+c)
},_deleteItem:function(a){var b=this._dataProvider.get("items");
var c=this._getItemIndex(a);
if(c>-1){b.splice(c,1);
this._comps.splice(c,1);
this._selectItemAtIndex=Math.min(this._selectItemAtIndex,b.length-1);
this._clearSelection();
if(this._selectItemAtIndex>=0){setTimeout(function(){this._selectItem(this._comps[this._selectItemAtIndex])
}.bind(this),250)
}else{this._selectItem(null)
}}this._updateSelection();
this._renderIfReady();
this._dataProvider.fireDataChangeEvent()
},_moveUpItem:function(a){var b=this._dataProvider.get("items");
var c=this._getItemIndex(a);
b.splice(c,1);
if(c>0){c--
}b.splice(c,0,"#"+a.get("id"));
this._updateSelection();
this._renderIfReady();
this._dataProvider.fireDataChangeEvent()
},_moveDownItem:function(a){var b=this._dataProvider.get("items");
var c=this._getItemIndex(a);
if(c<b.length-1){b.splice(c,1);
c++;
b.splice(c,0,"#"+a.get("id"))
}this._updateSelection();
this._renderIfReady();
this._dataProvider.fireDataChangeEvent()
},_selectItem:function(b,c){if(b){var a=b.getLogic();
if(c===undefined){c=a.getDataItem()
}this._disableReRender=true;
this.setValue(c);
this._disableReRender=false;
this._updateSelection(a)
}else{this.setValue(null)
}},_onRepeaterClick:function(a){var b;
if(a&&a.data){b=a.data.getData()
}this._selectItem(a.target,b);
this._updateSelection(a.target.getLogic())
},_updateSelection:function(a){a=a||this._selectedItem;
if(a&&a.hasState("selected")&&a.hasState("up")&&this._repeatersSelectable){this._selectedItem=a;
this._clearSelection();
a.setState("selected")
}},_clearSelection:function(){var b=this._getComps();
for(var a=0;
a<b.length;
a++){if(b[a].getLogic){b[a].getLogic().setState("up")
}}},getValue:function(){return this._value
},setValue:function(a){if(this._value!==a){this._value=a;
this.fireEvent("inputChanged",{value:a})
}},_onEnabled:function(){this.parent();
this._skinParts.collection.removeAttribute("disabled")
},_onDisabled:function(){this.parent();
this._skinParts.collection.setAttribute("disabled","disabled")
},_changeEventHandler:function(a){this.parent(a)
},_disposeChildren:function(){var c=this._skinParts.collection.getChildren();
for(var b=0;
b<c.length;
b++){var d=c[b];
var a=d.getLogic&&d.getLogic();
if(a){a.dispose()
}else{d.destroy()
}}this._skinParts.collection.empty()
},getAcceptableDataTypes:function(){return[""]
},_stopListeningToInput:function(){}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.Slider",skinParts:{label:{type:"htmlElement"},input:{type:"wysiwyg.editor.components.inputs.TickerInput",hookMethod:"_setInputParams"},sliderContainer:{type:"htmlElement"},leftCorner:{type:"htmlElement"},rightCorner:{type:"htmlElement"},sliderKnob:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_changeEventHandler","_stopListeningToInput","_listenToInput","_sliderMouseDownHandler","_sliderMouseUpHandler","_sliderMouseMoveHandler"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this.max=(typeof b.max==="undefined")?Constants.Inputs.Default.SLIDER_MAX:b.max;
this.min=b.min||Constants.Inputs.Default.MIN;
this.step=b.step||Constants.Inputs.Default.STEP;
this._labelText=b.labelText||"";
this._hideInput=b.hideInput||false;
this._noFloats=b.noFloats||false;
this._updateOnEnd=b.updateOnEnd||false;
this._value=0;
if(this.step>this.max||this.step<=0){LOG.reportError()
}if(this.min>this.max){LOG.reportError()
}},_setInputParams:function(a){a.argObject.min=this.min;
a.argObject.max=this.max;
a.argObject.step=this.step;
a.argObject.isFireChangeOnBlur=true;
a.argObject.isFireChangeOnEnter=true;
return a
},render:function(){this.parent();
var a=this._value;
var b=this._percentFromValue(a);
this._skinParts.sliderKnob.setStyle("left",b+"%")
},_onAllSkinPartsReady:function(){this.parent();
if(this._hideInput){this._skinParts.input.collapse()
}this._skinParts.input.setValue(this._value)
},setValue:function(a){this._value=this._normalizeNumber(a);
this._skinParts.input.setValue(this._value);
this._renderIfReady()
},getValue:function(){var a=this._skinParts.input.getValue();
var b=this._normalizeNumber(a);
if(b!=this._value||b!=a){this.setValue(b)
}return this._value
},_roundIfNoFloats:function(a){if(this._noFloats){return Math.round(a)
}else{return a
}},_onEnabled:function(){this.parent();
this._skinParts.input.enable()
},_onDisabled:function(){this.parent();
this._skinParts.input.disable()
},_normalizeNumber:function(a){var b=this._roundIfNoFloats(Number(a));
if(isNaN(b)){b=0
}if(b%this.step){b=Math.round(b/this.step)*this.step
}if(b>this.max){b=this.max
}else{if(b<this.min){b=this.min
}}if(b!=Math.round(b)){b=b.toFixed(2)
}return b
},_percentFromValue:function(b){var a=this.max-this.min;
var d=b-this.min;
var c=(d/a)*100;
return c
},_valueFromPercent:function(c){var a=this.max-this.min;
var d=(c*a)/100;
var b=d+this.min;
return b
},_sliderMouseDownHandler:function(b){document.removeEvent(Constants.CoreEvents.MOUSE_MOVE,this._sliderMouseMoveHandler);
document.removeEvent(Constants.CoreEvents.MOUSE_UP,this._sliderMouseUpHandler);
var a=this._skinParts.sliderContainer;
this._sliderPos={mouseX:b.page.x,sliderX:a.getPosition().x,sliderWidth:a.getWidth()};
this._sliderMouseMoveHandler(b);
document.addEvent(Constants.CoreEvents.MOUSE_MOVE,this._sliderMouseMoveHandler);
document.addEvent(Constants.CoreEvents.MOUSE_UP,this._sliderMouseUpHandler)
},_sliderMouseMoveHandler:function(b){this._sliderPos.mouseX=b.page.x;
var a=((this._sliderPos.mouseX-this._sliderPos.sliderX)/this._sliderPos.sliderWidth)*100;
this.setValue(this._valueFromPercent(a));
if(!this._updateOnEnd){this._changeEventHandler(b)
}},_sliderMouseUpHandler:function(a){if(!this._hideInput){this._skinParts.input.setFocus()
}if(this._updateOnEnd){this._changeEventHandler(a)
}document.removeEvent(Constants.CoreEvents.MOUSE_MOVE,this._sliderMouseMoveHandler);
document.removeEvent(Constants.CoreEvents.MOUSE_UP,this._sliderMouseUpHandler)
},_changeEventHandler:function(a){this.parent(a)
},_listenToInput:function(){this._skinParts.input.addEvent("inputChanged",this._changeEventHandler);
this._skinParts.sliderContainer.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._sliderMouseDownHandler)
},_stopListeningToInput:function(){this._skinParts.input.removeEvent("inputChanged",this._changeEventHandler);
this._skinParts.sliderContainer.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._sliderMouseDownHandler);
document.removeEvent(Constants.CoreEvents.MOUSE_UP,this._sliderMouseUpHandler);
document.removeEvent(Constants.CoreEvents.MOUSE_MOVE,this._sliderMouseMoveHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.SubmitInput",skinParts:{label:{type:"htmlElement"},input:{type:"htmlElement"},button:{type:"wysiwyg.editor.components.WButton",argsObject:{}},message:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.Input",_states:{label:["hasLabel","noLabel"],validation:["invalid"]},Binds:["_inputEventHandler","_preSubmitEventHandler"],initialize:function(c,a,b){this.parent(c,a,b);
this._iconSrc=b.iconSrc||"";
this._buttonLabel=b.buttonLabel||"";
this._preSubmitFunction=b.preSubmitFunction||null
},render:function(){this.parent();
this._skinParts.button.setLabel(this._buttonLabel);
this._skinParts.button.setIcon(this._iconSrc)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.button.enable()
}else{this._skinParts.button.disable()
}},setValue:function(b,a){this.parent(b,a)
},setMessage:function(a){this._skinParts.message.set("html",a)
},getButton:function(){return this._skinParts.button
},getValue:function(){return this.parent()
},_onEnabled:function(){this.parent();
this._skinParts.input.removeAttribute("disabled");
this._skinParts.button.enable()
},_onDisabled:function(){this.parent();
this._skinParts.input.setAttribute("disabled","disabled");
if(this.isReady()){this._skinParts.button.disable()
}},_inputEventHandler:function(a){if(a&&a.code&&a.code==13){this._preSubmitEventHandler(a)
}return !W.Utils.isInputKey(a.code)
},_selectPresetFieldContent:function(a){if(a.target.get("isPreset")){if(!a.target.get("isSelected")){a.target.set("isSelected","true");
a.target.select()
}}},_deselectPresetFieldContent:function(a){a.target.erase("isSelected")
},_preSubmitEventHandler:function(a){if(this._preSubmitFunction){this._preSubmitFunction(a,this._changeEventHandler)
}else{this._changeEventHandler(a)
}},_listenToInput:function(){this._skinParts.input.addEvent(Constants.CoreEvents.KEY_UP,this._inputEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.CLICK,this._selectPresetFieldContent);
this._skinParts.input.addEvent(Constants.CoreEvents.BLUR,this._deselectPresetFieldContent);
this._skinParts.button.addEvent(Constants.CoreEvents.CLICK,this._preSubmitEventHandler)
},_stopListeningToInput:function(){this._skinParts.input.removeEvent(Constants.CoreEvents.KEY_UP,this._inputEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.CLICK,this._selectPresetFieldContent);
this._skinParts.input.removeEvent(Constants.CoreEvents.BLUR,this._deselectPresetFieldContent);
this._skinParts.button.removeEvent(Constants.CoreEvents.CLICK,this._preSubmitEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.SubmitTextArea",skinParts:{label:{type:"htmlElement"},input:{type:"htmlElement"},button:{type:"wysiwyg.editor.components.WButton",argsObject:{}},message:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.SubmitInput",initialize:function(c,a,b){this.parent(c,a,b);
this._height=b.height||null
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.input.setStyle("height",this._height)
},_inputEventHandler:function(a){if(a&&a.code&&a.code==13){return false
}return !W.Utils.isInputKey(a.code)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.TextArea",skinParts:{label:{type:"htmlElement"},textarea:{type:"htmlElement"},message:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",Binds:["_checkMaxLength","_setLastValidInput","_revertToLastValidInputIfCurrentInvalid"],_states:{label:["hasLabel","noLabel"],validation:["invalid"]},initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._labelText=b.labelText||"";
this._validators=b.validators||[];
this._height=b.height||null;
this._width=b.width||null;
this._maxLength=b.maxLength||Constants.Inputs.Default.MAX_LENGTH
},render:function(){this.setLabel(this._labelText);
this.setMaxLength(this._maxLength);
if(this.getState("validation")=="invalid"){this.setState("invalid","validation")
}else{this._resetInvalidState()
}},_onAllSkinPartsReady:function(){if(this._height){this._skinParts.textarea.setStyle("height",this._height);
this._skinParts.textarea.setStyle("max-height",this._height);
this._skinParts.textarea.setStyle("min-height",this._height)
}if(this._width){this._skinParts.textarea.setStyle("width",this._width);
this._skinParts.textarea.setStyle("max-width",this._width);
this._skinParts.textarea.setStyle("min-width",this._width)
}if(Browser.ie){this._skinParts.textarea.addEvent(Constants.CoreEvents.KEY_UP,this._checkMaxLength)
}this._skinParts.textarea.addEvent("focus",this._setLastValidInput);
this._skinParts.textarea.addEvent("blur",this._revertToLastValidInputIfCurrentInvalid);
this._addToolTip()
},_setLastValidInput:function(){this._lastValidInput=this.getValue()
},_revertToLastValidInputIfCurrentInvalid:function(){if(this.getTextAreaValidationErrorMessage()){this.setValue(this._lastValidInput,"");
this._resetInvalidState()
}},setMaxLength:function(a){this._maxLength=a;
this._skinParts.textarea.setProperty("maxlength",a)
},setFocus:function(){this._skinParts.textarea.focus()
},setValue:function(c,b){var a=this._skinParts.textarea;
a.set("value",c);
if(b){a.set("isPreset","true")
}else{a.erase("isPreset")
}},getValue:function(){var a=this._skinParts.textarea;
return a.get("value")
},getTextAreaValidationErrorMessage:function(){var a=this.getValue();
var e="";
if(this._validators.length){for(var d=0,b=this._validators.length;
d<b;
d++){var c=this._validators[d];
e=c(a);
if(e){break
}}}return e
},_showValidationMessage:function(a){this.setState("invalid","validation");
if(this._skinParts.message){this._skinParts.message.set("text",a);
this._skinParts.message.uncollapse()
}},_resetInvalidState:function(){this.removeState("invalid","validation");
if(this._skinParts.message){this._skinParts.message.set("text","");
this._skinParts.message.collapse()
}},_changeEventHandler:function(b){b=b||{};
if(b.code==13){return false
}if(b.code&&!W.Utils.isInputKey(b.code)){return
}var a=this.getTextAreaValidationErrorMessage();
if(a){this._showValidationMessage(a);
return false
}else{this._resetInvalidState()
}this._skinParts.textarea.set("isPreset","");
this.parent(b)
},_onEnabled:function(){this.parent();
this._skinParts.textarea.removeAttribute("disabled")
},_checkMaxLength:function(d){var a=this._skinParts.textarea.get("value");
var b=a.length;
if(a.length>this._maxLength){var c=this._maxLength-b;
a=a.slice(0,c);
this._skinParts.textarea.set("value",a)
}},_onDisabled:function(){this.parent();
this._skinParts.textarea.setAttribute("disabled","disabled")
},_listenToInput:function(){this._skinParts.textarea.addEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.textarea.addEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.textarea.addEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.textarea.addEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.textarea.removeEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.textarea.removeEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler);
if(Browser.ie){this._skinParts.textarea.removeEvent(Constants.CoreEvents.KEY_UP,this._checkMaxLength)
}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.TickerInput",skinParts:{label:{type:"htmlElement"},input:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_changeEventHandler","_stopListeningToInput","_listenToInput","_keyDownHandler"],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this.max=(typeof b.max=="undefined")?Constants.Inputs.Default.TICKER_MAX:b.max;
this.min=b.min||Constants.Inputs.Default.MIN;
this.step=b.step||Constants.Inputs.Default.STEP;
this._isInputTypeNumber=Modernizr&&Modernizr.inputtypes.number;
this._labelText=b.labelText||"";
this._value=0;
this._isFireChangeOnBlur=b.isFireChangeOnBlur||false;
this._isFireChangeOnEnter=b.isFireChangeOnEnter||false;
if(this.step>this.max||this.step<=0){LOG.reportError()
}if(this.min>this.max){LOG.reportError()
}},_onAllSkinPartsReady:function(){if(this._isInputTypeNumber){this._skinParts.input.setProperties({step:this.step,min:this.min,max:this.max})
}},render:function(){this.parent()
},setFocus:function(){this._skinParts.input.focus()
},setValue:function(c,b){var a=this._skinParts.input;
if(isNaN(c)){if(!isNaN(parseFloat(c))){c=parseFloat(c)
}else{if(c!="-"||c!="."){c=0
}}}a.set("value",c);
if(b){a.set("isPreset","true")
}else{a.erase("isPreset")
}this._value=c
},getValue:function(){var a=this._skinParts.input;
this._value=a.get("value");
if(isNaN(this._value)){return 0
}return this._value
},_onEnabled:function(){this.parent();
this._skinParts.input.removeAttribute("disabled")
},_onDisabled:function(){this.parent();
this._skinParts.input.setAttribute("disabled","disabled")
},_keyDownHandler:function(a){switch(a.code){case 40:if(!this._isInputTypeNumber){this.setValue(Number(this.getValue())-this.step)
}this._changeEventHandler(a);
return true;
case 38:if(!this._isInputTypeNumber){this.setValue(Number(this.getValue())+this.step)
}this._changeEventHandler(a);
return true;
case 13:if(this._isFireChangeOnEnter){this._changeEventHandler(a);
return true
}}},_changeEventHandler:function(a){this._skinParts.input.set("isPreset","");
this.parent(a)
},_listenToInput:function(){this._skinParts.input.addEvent(Constants.CoreEvents.KEY_DOWN,this._keyDownHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.MOUSE_UP,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.MOUSE_WHEEL,this._changeEventHandler);
if(this._isFireChangeOnBlur){this._skinParts.input.addEvent(Constants.CoreEvents.BLUR,this._changeEventHandler)
}else{this._skinParts.input.addEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.input.addEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler)
}},_stopListeningToInput:function(){this._skinParts.input.removeEvent(Constants.CoreEvents.KEY_DOWN,this._keyDownHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.KEY_UP,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.CUT,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.PASTE,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.CHANGE,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.MOUSE_UP,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.MOUSE_WHEEL,this._changeEventHandler);
this._skinParts.input.removeEvent(Constants.CoreEvents.BLUR,this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.bg.BgAlign",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{alignMatrix:{type:"wysiwyg.editor.components.inputs.RadioImages",argObject:{},hookMethod:"_setRadioButtonsInit"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},initialize:function(c,a,b){this.parent(c,a,b);
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme
},_setRadioButtonsInit:function(b){var a={w:"22px",h:"22px"};
b.argObject.presetList=[{value:"left top",image:"icons/bg_align_top_left.png",dimensions:a},{value:"center top",image:"icons/bg_align_empty.png",dimensions:a},{value:"right top",image:"icons/bg_align_top_right.png",dimensions:a},Constants.AutoPanel.BREAK,{value:"left center",image:"icons/bg_align_empty.png",dimensions:a},{value:"center center",image:"icons/bg_align_center.png",dimensions:a},{value:"right center",image:"icons/bg_align_empty.png",dimensions:a},Constants.AutoPanel.BREAK,{value:"left bottom",image:"icons/bg_align_bottom_left.png",dimensions:a},{value:"center bottom",image:"icons/bg_align_empty.png",dimensions:a},{value:"right bottom",image:"icons/bg_align_bottom_right.png",dimensions:a}];
return b
},render:function(){this._skinParts.alignMatrix.setLabel(this._labelText)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.alignMatrix.enable()
}else{this._skinParts.alignMatrix.disable()
}},setValue:function(b){var a=new W.Background(b,this._themeManager);
this._value=b;
this._skinParts.alignMatrix.setValue(a.getPosition())
},getValue:function(){if(!this._value){return""
}var a=this._skinParts.alignMatrix.getValue();
var b=new W.Background(this._value,this._themeManager);
b.setPosition(a);
this._value=b.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.alignMatrix.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.alignMatrix.disable()
}},_listenToInput:function(){this._skinParts.alignMatrix.addEvent("inputChanged",this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.alignMatrix.removeEvent("inputChanged",this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.bg.BgColor",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{colorInput:{type:"wysiwyg.editor.components.inputs.ColorSelectorField",argObject:{enableAlpha:false}}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_onColorChange"],initialize:function(c,a,b){this.parent(c,a,b);
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme
},render:function(){this._skinParts.colorInput.setLabel(this._labelText)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.colorInput.enable()
}else{this._skinParts.colorInput.disable()
}},setValue:function(b){this._value=b;
var a=new W.Background(b,this._themeManager);
var c=a.getColorReference();
if(c!==""){this._skinParts.colorInput.setColor(c,"theme")
}else{this._skinParts.colorInput.setColor(a.getColor(),"value")
}},getValue:function(){if(!this._value){return""
}return this._value
},_onColorChange:function(b){var a=new W.Background(this._value,this._themeManager);
if(b.source==="theme"){a.setColorReference(b.color)
}else{a.setColor(b.color)
}this._value=a.getThemeString();
this._changeEventHandler(b)
},_onEnabled:function(){this.parent();
this._skinParts.colorInput.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.colorInput.disable()
}},_listenToInput:function(){this._skinParts.colorInput.addEvent("colorChanged",this._onColorChange)
},_stopListeningToInput:function(){this._skinParts.colorInput.removeEvent("colorChanged",this._onColorChange)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.bg.BgImage",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{imageSelector:{type:"wysiwyg.editor.components.inputs.ImageInput",argObject:{galleryConfigID:"backgrounds"}}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:[],initialize:function(c,a,b){this.parent(c,a,b);
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme;
this._imageData={type:"Image",uri:"",width:0,height:0,title:"",borderSize:"",description:""}
},render:function(){this._skinParts.imageSelector.setLabel(this._labelText);
this._skinParts.imageSelector.setValue(this._imageData);
var a=(this._imageData&&this._imageData.uri&&this._imageData.uri!="none")?"IMAGE_REPLACE":"IMAGE_ADD";
this._skinParts.imageSelector.setButton(this.injects().Resources.get("EDITOR_LANGUAGE",a));
this._skinParts.imageSelector.setDelete(this.injects().Resources.get("EDITOR_LANGUAGE","IMAGE_REMOVE"))
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.imageSelector.enable()
}else{this._skinParts.imageSelector.disable()
}},setValue:function(b){var a=new W.Background(b,this._themeManager);
this._value=b;
this._imageData.uri=a.getImageId();
this._imageData.width=parseInt(a.getImageSize()[0]);
this._imageData.height=parseInt(a.getImageSize()[1]);
this._renderIfReady()
},getValue:function(){if(!this._value){return""
}this._imageData=this._skinParts.imageSelector.getValue()||{};
var a=new W.Background(this._value,this._themeManager);
a.setImage(this._imageData.uri,this._imageData.width,this._imageData.height);
this._value=a.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.imageSelector.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.imageSelector.disable()
}},_listenToInput:function(){this._skinParts.imageSelector.addEvent("inputChanged",this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.imageSelector.removeEvent("inputChanged",this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.bg.BgPresetSelector",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{background:{type:"htmlElement"},image:{type:"mobile.core.components.Image",argObject:{cropMode:"fill"}}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:[],initialize:function(c,a,b){this.parent(c,a,b);
this._themeManager=this.injects().Preview.getPreviewManagers().Theme;
this._imageData={type:"Image",uri:"",width:60,height:50,title:"",borderSize:"",description:""};
this._bgColor=null
},_onAllSkinPartsReady:function(){this._imageData.uri=this._data.get("thumbnail");
this._skinParts.image.setDataItem(this.injects().Data.createDataItem(this._imageData))
},getAcceptableDataTypes:function(){return["list",""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.bg.BgScroll",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{scrollTypes:{type:"wysiwyg.editor.components.inputs.CheckBox"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},initialize:function(c,a,b){this.parent(c,a,b);
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme
},render:function(){this._skinParts.scrollTypes.setLabel(this._labelText)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.scrollTypes.enable()
}else{this._skinParts.scrollTypes.disable()
}},setValue:function(b){var a=new W.Background(b,this._themeManager);
this._value=b;
this._skinParts.scrollTypes.setValue(a.getAttachment()=="scroll")
},getValue:function(){if(!this._value){return""
}var a=(this._skinParts.scrollTypes.getValue())?"scroll":"fixed";
var b=new W.Background(this._value,this._themeManager);
b.setAttachment(a);
this._value=b.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.scrollTypes.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.scrollTypes.disable()
}},_listenToInput:function(){this._skinParts.scrollTypes.addEvent("inputChanged",this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.scrollTypes.removeEvent("inputChanged",this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.bg.BgTile",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{tileTypes:{type:"wysiwyg.editor.components.inputs.RadioButtons",argObject:{display:"block"},hookMethod:"_setRadioButtonsInit"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},initialize:function(c,a,b){this.parent(c,a,b);
this.bgSizes=["cover","contain"];
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme
},_setRadioButtonsInit:function(a){a.argObject.presetList=[{value:"cover",label:this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_COVER")},{value:"contain",label:this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_CONTAIN")},{value:"repeat repeat",label:this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_REPEAT")},{value:"no-repeat repeat",label:this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_REPEAT_Y")},{value:"repeat no-repeat",label:this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_REPEAT_X")},{value:"no-repeat no-repeat",label:this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_REPEAT_NONE")}];
return a
},render:function(){this._skinParts.tileTypes.setLabel(this._labelText)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.tileTypes.enable()
}else{this._skinParts.tileTypes.disable()
}this._skinParts.tileTypes.setRadioButtons(this._presetList)
},setValue:function(b){var a=new W.Background(b,this._themeManager);
this._value=b;
if(this.bgSizes.contains(a.getWidth())){this._skinParts.tileTypes.setValue(a.getWidth())
}else{this._skinParts.tileTypes.setValue(a.getRepeat())
}},getValue:function(){if(!this._value){return""
}var b=this._skinParts.tileTypes.getValue();
var a=new W.Background(this._value,this._themeManager);
if(this.bgSizes.contains(b)){a.setWidth(b);
a.setRepeat("no-repeat no-repeat")
}else{a.setWidth("auto");
a.setRepeat(b)
}this._value=a.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.tileTypes.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.tileTypes.disable()
}},_listenToInput:function(){this._skinParts.tileTypes.addEvent("inputChanged",this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.tileTypes.removeEvent("inputChanged",this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.font.FontColor",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{colorSelector:{type:"wysiwyg.editor.components.inputs.ColorSelectorField",argObject:{enableAlpha:false}}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_onColorSelectorChange"],initialize:function(c,a,b){this.parent(c,a,b);
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme
},render:function(){this._skinParts.colorSelector.setLabel(this._labelText)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.colorSelector.enable()
}else{this._skinParts.colorSelector.disable()
}},setValue:function(b){this._value=b;
var a=new W.Font(b,this._themeManager);
var c=a.getColorReference();
if(c!==""){this._skinParts.colorSelector.setColor(c,"theme")
}else{this._skinParts.colorSelector.setColor(a.getColor(),"value")
}},getValue:function(){if(!this._value){return""
}return this._value
},_onColorSelectorChange:function(b){var a=new W.Font(this._value,this._themeManager);
if(b.source==="theme"){a.setColorReference(b.color)
}else{a.setColor(b.color)
}this._value=a.getThemeString();
this._changeEventHandler(b)
},_onEnabled:function(){this.parent();
this._skinParts.colorSelector.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.colorSelector.disable()
}},_listenToInput:function(){this._skinParts.colorSelector.addEvent("colorChanged",this._onColorSelectorChange)
},_stopListeningToInput:function(){this._skinParts.colorSelector.removeEvent("colorChanged",this._onColorSelectorChange)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.font.FontFamily",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{comboBox:{type:"wysiwyg.editor.components.inputs.ComboBox",hookMethod:"_setComboInit"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},initialize:function(d,a,c){this.parent(d,a,c);
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme;
var b=this._createComboOptionsFromArray(this.injects().Css.getFontList());
this._dataItem=this.injects().Data.createDataItem(b)
},_setComboInit:function(a){a.argObject.dataProvider=this._dataItem;
return a
},_createComboOptionsFromArray:function(c){var a=new W.Font();
var b={type:"list",items:[]};
c.forEach(function(d){a.setFontFamily(d);
b.items.push({value:d,styles:{font:a.getCssValue()}})
});
return b
},render:function(){this._skinParts.comboBox.setLabel(this._labelText)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.comboBox.enable()
}else{this._skinParts.comboBox.disable()
}},setValue:function(b){var a=new W.Font(b,this._themeManager);
this._value=b;
this._skinParts.comboBox.setValue(a.getFontFamily())
},getValue:function(){if(!this._value){return""
}var b=this._skinParts.comboBox.getValue();
var a=new W.Font(this._value,this._themeManager);
a.setFontFamily(b);
this._value=a.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.comboBox.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.comboBox.disable()
}},_listenToInput:function(){this._skinParts.comboBox.addEvent("inputChanged",this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.comboBox.removeEvent("inputChanged",this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.font.FontPresetSelector",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{label:{type:"htmlElement"},paragraph:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.WButton",_states:["up","over","selected","pressed"],_triggers:["click"],Binds:[],initialize:function(c,a,b){this.parent(c,a,b);
this._themeManager=this.injects().Preview.getPreviewManagers().Theme;
this._cssManager=this.injects().Css;
this._title={font:"font_0",size:22};
this._paragraph={font:"font_7",size:14};
this.fontData=b
},render:function(){var c=this.injects().Resources.get("EDITOR_LANGUAGE","FONT_PRESET_TITLE");
var d=this.injects().Resources.get("EDITOR_LANGUAGE","FONT_PRESET_SUB_TITLE");
var a=new W.Font(this.fontData[this._title.font],this._themeManager);
a.setSize(this._title.size);
var b=new W.Font(this.fontData[this._paragraph.font],this._themeManager);
b.setSize(this._paragraph.size);
this._cssManager.loadFont(a.getFontFamily());
this._cssManager.loadFont(b.getFontFamily());
this._skinParts.label.set("text",c);
this._skinParts.label.setStyles({font:a.getCssValue()});
this._skinParts.paragraph.set("text",d);
this._skinParts.paragraph.setStyles({font:b.getCssValue()});
delete this.fontData.name;
this._fontTags=this._fontTags||this.fontData.tags;
delete this.fontData.tags
},getFonts:function(){return this.fontData
},getFontTags:function(){return this._fontTags
},_onDataChange:function(){},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.font.FontSelectorField",skinParts:{label:{type:"htmlElement"},fontCombo:{type:"wysiwyg.editor.components.inputs.ComboBox",hookMethod:"_setComboInit"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_fontSelected","_getFontList","_setComboInit"],initialize:function(c,a,b){this.parent(c,a,b);
this._fontName=b.fontName;
this._fontListDataItem=this.injects().Data.createDataItem({items:[],type:"list"});
this._getFontList()
},_setComboInit:function(a){a.argObject.dataProvider=this._fontListDataItem;
return a
},_onAllSkinPartsReady:function(){this._skinParts.fontCombo.setValue(this._fontName)
},_getFontList:function(){this._fontList=[];
W.Data.getDataByQuery("#FONT_STYLE_NAMES",function(a){if(a){var e=a.get("items");
if(e){for(var c in e){var d=e[c];
var b=this.injects().Resources.get("EDITOR_LANGUAGE",d.label);
this._fontList.push({value:c,label:b})
}}}this._fontListDataItem.setData({items:this._fontList,type:"list"})
}.bind(this))
},_fontSelected:function(a){this.fireEvent("fontChanged",a)
},_listenToInput:function(){this._skinParts.fontCombo.addEvent("inputChanged",this._fontSelected)
},_stopListeningToInput:function(){this._skinParts.fontCombo.removeEvent("inputChanged",this._fontSelected)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.font.FontSize",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{input:{type:"wysiwyg.editor.components.inputs.TickerInput"},upArrow:{type:"htmlElement"},downArrow:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},Binds:["_onMouseUp","_onMouseDown","_onMouseOut"],initialize:function(c,a,b){this.parent(c,a,b);
this._value="";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme
},render:function(){this._skinParts.input.setLabel(this._labelText)
},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.input.enable()
}else{this._skinParts.input.disable()
}},setValue:function(b){var a=new W.Font(b,this._themeManager);
this._value=b;
this._skinParts.input.setValue(parseFloat(a.getSize()))
},getValue:function(){if(!this._value){return"0"
}var b=this._skinParts.input.getValue();
var a=new W.Font(this._value,this._themeManager);
a.setSize(b);
this._value=a.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.input.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.input.disable()
}},_onMouseDown:function(b){if(b&&b.target){var a=this._skinParts.input;
if(b.target.getProperty("skinpart")=="upArrow"){a.setValue(Number(a.getValue())+Number(a.step))
}else{if(b.target.getProperty("skinpart")=="downArrow"){a.setValue(Number(a.getValue())-Number(a.step))
}}if(a.getValue()>a.min&&a.getValue()<a.max){this._mouseDownTimer=this.callLater(this._onMouseDown,[b],150)
}}},_onMouseUp:function(a){clearTimeout(this._mouseDownTimer);
this._skinParts.input.fireChangeEvent(a)
},_onMouseOut:function(a){this._onMouseUp(a)
},_listenToInput:function(){this._skinParts.input.addEvent("inputChanged",this._changeEventHandler);
this._skinParts.upArrow.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.downArrow.addEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.upArrow.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.downArrow.addEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.upArrow.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.downArrow.addEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut)
},_stopListeningToInput:function(){this._skinParts.input.removeEvent("inputChanged",this._changeEventHandler);
this._skinParts.upArrow.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.downArrow.removeEvent(Constants.CoreEvents.MOUSE_DOWN,this._onMouseDown);
this._skinParts.upArrow.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.downArrow.removeEvent(Constants.CoreEvents.MOUSE_UP,this._onMouseUp);
this._skinParts.upArrow.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut);
this._skinParts.downArrow.removeEvent(Constants.CoreEvents.MOUSE_OUT,this._onMouseOut)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.inputs.font.FontStyle",traits:["wysiwyg.editor.components.traits.BindValueToData"],skinParts:{bold:{type:"wysiwyg.editor.components.inputs.CheckBoxImage",argObject:{}},italic:{type:"wysiwyg.editor.components.inputs.CheckBoxImage",argObject:{}}},Class:{Extends:"wysiwyg.editor.components.inputs.BaseInput",_states:{label:["hasLabel","noLabel"]},initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._value=b.value||"";
this._themeManager=this.injects().Preview.getPreviewManagers().Theme
},render:function(){},_onAllSkinPartsReady:function(){this.parent();
if(this.isEnabled()){this._skinParts.bold.enable();
this._skinParts.italic.enable()
}else{this._skinParts.bold.disable();
this._skinParts.italic.disable()
}this._skinParts.bold.setBackground("icons/font/fonts_bold.png",null,{w:27,h:33});
this._skinParts.italic.setBackground("icons/font/fonts_italic.png",null,{w:27,h:33})
},setValue:function(b){this._value=b;
var a=new W.Font(this._value,this._themeManager);
this._skinParts.bold.setValue(a.getWeight()=="bold");
this._skinParts.italic.setValue(a.getStyle()=="italic")
},getValue:function(){if(!this._value){return""
}var c=(this._skinParts.bold.getValue())?"bold":"normal";
var b=(this._skinParts.italic.getValue())?"italic":"normal";
var a=new W.Font(this._value,this._themeManager);
a.setWeight(c);
a.setStyle(b);
this._value=a.getThemeString();
return this._value
},_onEnabled:function(){this.parent();
this._skinParts.bold.enable();
this._skinParts.italic.enable()
},_onDisabled:function(){this.parent();
if(this.isReady()){this._skinParts.bold.disable();
this._skinParts.italic.disable()
}},_changeEventHandler:function(c){var b=this.getValue();
var a={value:b,origEvent:c,compLogic:this};
this.fireEvent("inputChanged",a)
},_listenToInput:function(){this._skinParts.bold.addEvent("inputChanged",this._changeEventHandler);
this._skinParts.italic.addEvent("inputChanged",this._changeEventHandler)
},_stopListeningToInput:function(){this._skinParts.bold.removeEvent("inputChanged",this._changeEventHandler);
this._skinParts.italic.removeEvent("inputChanged",this._changeEventHandler)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.AddComponentPanel",skinParts:{content:{type:"htmlElement"},scrollableArea:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:[],initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="ADD_COMPONENT_TITLE";
this._descriptionKey="ADD_COMPONENT_DESCRIPTION";
this._category=b&&b.category
},canGoBack:function(){return true
},_createFields:function(){var b;
if(typeof(this._category)=="string"){var a=this._category;
b=function(c){return c&&(c.category==a||(!c.category&&!a))
}
}this.addSelectionListInputFieldWithDataProvider("","#ADD_COMPONENT_TABS",{dataItemFilter:b,repeatersSelectable:false},{type:"wysiwyg.editor.components.WButton",skin:"wysiwyg.editor.skins.buttons.ButtonMenuSkin",numRepeatersInLine:1})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.AdminLoginButtonPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel","_createFields"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},getAcceptableDataTypes:function(){return["SiteButton"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.BackgroundDesignPanel",skinParts:{scrollableArea:{type:"htmlElement"},content:{type:"htmlElement"},actions:{type:"htmlElement"},customize:{type:"mobile.core.components.Button",autoBindDictionary:"BACKGROUND_DESIGN_CUSTOMIZE",command:"WEditorCommands.ShowBackgroundEditorPanel"},cancel:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"DISCARD_CHANGES"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:["_cancelPalletApply","_onThemeDataChanged"],initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="BACKGROUND_DESIGN_TITLE";
this._descriptionKey="BACKGROUND_DESIGN_DESCRIPTION";
this._panelName="BACKGROUND_DESIGN_TITLE";
this._themeManagerData=this.injects().Preview.getPreviewManagers().Theme.getDataItem();
this._themeManagerData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onThemeDataChanged)
},_onThemeDataChanged:function(){this._skinParts.cancel.enable();
LOG.reportEvent(wixEvents.BACKGROUND_CHANGED)
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.cancel.addEvent(Constants.CoreEvents.CLICK,this._cancelPalletApply)
},canGoBack:function(){return true
},canCancel:function(){return true
},_createFields:function(){this.addSelectionListInputFieldWithDataProvider("","#BACKGROUND_STYLES",{repeatersSelectable:false},{type:"wysiwyg.editor.components.inputs.bg.BgPresetSelector",skin:"wysiwyg.editor.skins.inputs.bg.BgPresetSelectorSkin",args:{width:70,height:50,unit:"px"}}).bindToDataItemAndFilterFromDataProvider(["thumbnail"])
},saveCurrentState:function(){this._skinParts.cancel.disable();
var a=this.injects().Preview.getPreviewManagers().Theme;
this._initialBackground={siteBg:a.getRawProperty("siteBg"),color_0:a.getRawProperty("color_0")}
},_cancelPalletApply:function(){var a=this.injects().Preview.getPreviewManagers().Theme;
a.getDataItem().setFields(this._initialBackground);
this.injects().Commands.executeCommand(Constants.EditorUI.CLOSE_ALL_PANELS)
},dispose:function(){this._themeManagerData.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onThemeDataChanged);
this.parent()
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.BackgroundEditorPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{scrollableArea:{type:"htmlElement"},content:{type:"htmlElement"},cancel:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"DISCARD_CHANGES"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:["_setBgTileByImageSize","_cancelPalletApply","_onThemeDataChanged"],Static:{TILE_IMAGE_WIDTH:600,TILE_IMAGE_HEIGHT:600},initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="BACKGROUND_EDITOR_TITLE";
this._descriptionKey="BACKGROUND_EDITOR_DESCRIPTION";
this._panelName="BACKGROUND_EDITOR_TITLE";
this._themeManagerData=this.injects().Preview.getPreviewManagers().Theme.getDataItem();
this._themeManagerData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onThemeDataChanged)
},_onThemeDataChanged:function(a){this._skinParts.cancel.enable()
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.cancel.addEvent(Constants.CoreEvents.CLICK,this._cancelPalletApply)
},_createFields:function(){this.addInputGroupField(function(a){this.addBgImageField().bindToThemeProperty("siteBg").bindHooks(a._setBgTileByImageSize,null)
});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(2);
this.addBgTileField(this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_LABEL_REPEAT"),"Customize_Background_Image_Scaling_ttid").bindToThemeProperty("siteBg");
this.addBgAlignField(this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_LABEL_ALIGN")).bindToThemeProperty("siteBg")
});
this.addInputGroupField(function(){this.addBgScrollField(this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_LABEL_SCROLL"),"Customize_Background_Scroll_ttid").bindToThemeProperty("siteBg")
});
this.addInputGroupField(function(){this.addBgColorField(this.injects().Resources.get("EDITOR_LANGUAGE","BACKGROUND_BUTTON_COLOR")).bindToThemeProperty("siteBg")
})
},_setBgTileByImageSize:function(a){var b=new W.Background(a);
if(b.getImageSize()[0]<this.TILE_IMAGE_WIDTH&&b.getImageSize()[1]<this.TILE_IMAGE_HEIGHT){b.setRepeat("repeat");
b.setWidth("auto")
}else{b.setRepeat("no-repeat");
b.setWidth("cover")
}return b.getThemeString()
},canGoBack:function(){return true
},canCancel:function(){return true
},saveCurrentState:function(){this._skinParts.cancel.disable();
var a=this.injects().Preview.getPreviewManagers().Theme;
this._initialBackground={siteBg:a.getRawProperty("siteBg"),color_0:a.getRawProperty("color_0")}
},_cancelPalletApply:function(){var a=this.injects().Preview.getPreviewManagers().Theme;
a.getDataItem().setFields(this._initialBackground)
},dispose:function(){this._themeManagerData.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onThemeDataChanged);
this.parent()
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.ButtonPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel","_createFields"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this.injects().Resources;
this.addInputGroupField(function(){this.addInputField(a.get("EDITOR_LANGUAGE","BUTTON_LABEL_TEXT"),"Enter Text").bindToField("label");
this.addLinkField(this.injects().Resources.get("EDITOR_LANGUAGE","LINK_LINK_TO")).bindToDataItem(this.getDataItem())
});
this.addInputGroupField(function(){var d={min:0,max:100,step:1};
var b="radiobuttons/radio_button_states.png";
var e={w:"35px",h:"33px"};
var c=[{value:"left",image:b,dimensions:e,icon:"radiobuttons/alignment/left.png"},{value:"center",image:b,dimensions:e,icon:"radiobuttons/alignment/center.png"},{value:"right",image:b,dimensions:e,icon:"radiobuttons/alignment/right.png"}];
this.addRadioImagesField(a.get("EDITOR_LANGUAGE","BUTTON_TEXT_ALIGN"),c,null,null,"inline").bindToProperty("align");
this.addSliderField(a.get("EDITOR_LANGUAGE","BUTTON_MARGIN"),d.min,d.max,d.step).bindToProperty("margin")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},getAcceptableDataTypes:function(){return["SiteButton"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.ClipArtMenuPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.WPhotoMenuPanel",initialize:function(c,a,b){b.galleryConfigName="clipart";
this.parent(c,a,b)
},_createFields:function(){var a=this;
this.addInputGroupField(function(){var b=this._translate("CLIP_ART_REPLACE_IMAGE");
this.addImageField(null,null,null,b,a._galleryConfigName,false).bindToDataItem(this._data)
});
this.addInputGroupField(function(){this.addLinkField(this.injects().Resources.get("EDITOR_LANGUAGE","LINK_LINK_TO"),this.injects().Resources.get("EDITOR_LANGUAGE","LINK_ADD_LABEL")).bindToDataItem(this.getDataItem())
})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.ColorsDesignPanel",imports:["mobile.core.managers.utils.BufferFunction"],traits:["wysiwyg.editor.components.traits.FiltersDataByTags"],skinParts:{scrollableArea:{type:"htmlElement"},content:{type:"htmlElement"},customize:{type:"mobile.core.components.Button",autoBindDictionary:"COLOR_DESIGN_CUSTOMIZE",command:"WEditorCommands.CustomizeColors"},cancel:{type:"mobile.core.components.Button",autoBindDictionary:"DISCARD_CHANGES"},actions:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:["_onPaletteReady","_onPaletteClick","_cancelPalletApply"],_panelName:"COLOR_DESIGN_TITLE",initialize:function(d,b,c){this.parent(d,b,c);
this._titleKey="COLOR_DESIGN_TITLE";
this._descriptionKey="COLOR_DESIGN_DESCRIPTION";
this._showBackButton=true;
this._showCancelButton=true;
this._mediaURL=this.injects().Config.getServiceTopologyProperty("staticMediaUrl");
var a=new this.imports.BufferFunction(this,"_updateColors");
a.setBufferTime(1000)
},canGoBack:function(){return true
},canCancel:function(){return true
},_createFields:function(){var a=function(d){for(var c=0;
c<d.length;
c++){var b=this.injects().Components.createComponent("wysiwyg.editor.components.panels.StaticPalettePanel","wysiwyg.editor.skins.panels.StaticPalettePanelSkin",null,d[c],null,this._onPaletteReady);
b.insertInto(this._skinParts.content)
}}.bind(this);
this.filterEditorDataListByTags("#COLOR_PALETTES","palletsFilterTags","paletteTags",a);
this._skinParts.cancel.addEvent(Constants.CoreEvents.CLICK,this._cancelPalletApply)
},_onPaletteReady:function(a){a.addEvent("click",this._onPaletteClick)
},_onPaletteClick:function(b){var a=b.target.getLogic().getColors();
this._updateColors(a);
this._skinParts.cancel.enable();
LOG.reportEvent(wixEvents.COLOR_PRESET_CHANGED)
},_updateColors:function(a){var c={};
for(var b in a){if(b){c[b]=a[b].toString()
}}var d=this.injects().Preview.getPreviewManagers().Theme;
d.getDataItem().setFields(c)
},saveCurrentState:function(){this._skinParts.cancel.disable();
this._initialColorProperties={};
var c=this.injects().Preview.getPreviewManagers().Theme;
var d=c.getPropertiesAccordingToType("color");
for(var b=0,a=d.length;
b<a;
b++){this._initialColorProperties[d[b]]=c.getProperty(d[b])
}},_cancelPalletApply:function(){this._updateColors(this._initialColorProperties);
this.injects().Commands.executeCommand(Constants.EditorUI.CLOSE_ALL_PANELS)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.ComponentPanel",traits:[],skinParts:{dataPanelContainer:{type:"htmlElement"},panelLabel:{type:"htmlElement"},panelDescription:{type:"htmlElement"},xInput:{type:"htmlElement"},yInput:{type:"htmlElement"},wInput:{type:"htmlElement"},hInput:{type:"htmlElement"},help:{type:"htmlElement"},close:{type:"htmlElement",command:Constants.EditorUI.CLOSE_PROPERTY_PANEL},generalProperties:{type:"htmlElement"},scopeButtonContainer:{type:"htmlElement"},isInMasterCB:{type:"wysiwyg.editor.components.inputs.CheckBox"},allowAnchorsButton:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onFieldChange","_onKeyUp","_setPanelHeightRelativeToWindowHeight","_onAllowAnchorsButtonClick"],Static:{DRAG_OFFSET:40},_states:{moveScope:["moveToMaster","moveToPage","disabled"]},initialize:function(c,a,b){this.parent(c,a,b);
this.last={x:-99999999,y:-99999999,width:-99999999,height:-99999999};
this._heightCalcTimerCounter=0;
this._heightCalcTimerCounterMax=10;
this.setState("moveToMaster","moveScope")
},render:function(){this.parent();
this._setPanelHeightRelativeToWindowHeight();
this._enableDrag()
},exitEditMode:function(){this._skinParts.dataPanelContainer.getChildren("*").forEach(function(a){a.getLogic&&a.getLogic().dispose()
});
this._editedComponent=null;
this.hide()
},hide:function(){this.fireEvent(Constants.EditorUI.PANEL_CLOSING,this)
},editComponent:function(e){if(this._editedComponent==e){return
}if(this._editedComponent){this._editedComponent.removeEvent("positionChange",this._updateComponentPos)
}this._editedComponent=e;
this._skinParts.panelLabel.empty();
this._skinParts.panelDescription.empty();
var i=this._getComponentLabel();
var d=this.injects().Resources.get("EDITOR_LANGUAGE","COMP_"+i);
var g=this.injects().Resources.get("EDITOR_LANGUAGE","COMP_DESC_"+i);
this._skinParts.panelLabel.set("html",d);
this._skinParts.panelDescription.set("html",g);
if(!this._editedComponent.canMoveToOtherScope()){this.setState("disabled","moveScope")
}else{var c=this._editorMode==this.injects().Editor.EDIT_MODE.CURRENT_PAGE;
this.setState(c?"moveToMaster":"moveToPage","moveScope");
this._skinParts.isInMasterCB.setValue(!c)
}this._skinParts.dataPanelContainer.empty();
var a=e.getDataItem();
var h=(a)?a.getType():"";
var f=W.Editor.getDataPanel(h,e.className);
if(f){var b=this._createComponentDataPanel(f,e);
this._skinParts.dataPanelContainer.adopt(b)
}this._editedComponent.addEvent("positionChange",this._updateComponentPos);
this._view.uncollapse();
this.updateCompPosSize();
this._setShowAnchorsButtonState(false);
this._enableLayoutLocks=!this._editedComponent.isMultiSelect&&this._editedComponent.allowHeightLock();
this._skinParts.allowAnchorsButton.setAttribute("disabled",this._enableLayoutLocks?"false":"true");
this._disableInputsAccordingToComponent();
this._setPanelHeightRelativeToWindowHeight()
},_createComponentDataPanel:function(a,b){return W.Components.createComponent(a.logic,a.skin,b.getDataItem(),{previewComponent:this._editedComponent})
},updateCompPosSize:function(){this.last.x=this._editedComponent.getX();
this.last.y=this._editedComponent.getY();
this.last.width=this._editedComponent.getWidth();
this.last.height=this._editedComponent.getHeight();
this._skinParts.xInput.setProperty("value",this.last.x);
this._skinParts.yInput.setProperty("value",this.last.y);
this._skinParts.wInput.setProperty("value",this.last.width);
this._skinParts.hInput.setProperty("value",this.last.height)
},_onAllSkinPartsReady:function(){this._view.collapse();
var c=this._skinParts;
c.xInput.addEvent("blur",this._onFieldChange);
c.yInput.addEvent("blur",this._onFieldChange);
c.wInput.addEvent("blur",this._onFieldChange);
c.hInput.addEvent("blur",this._onFieldChange);
c.xInput.addEvent("keyup",this._onKeyUp);
c.yInput.addEvent("keyup",this._onKeyUp);
c.wInput.addEvent("keyup",this._onKeyUp);
c.hInput.addEvent("keyup",this._onKeyUp);
c.allowAnchorsButton.addEvent(Constants.CoreEvents.CLICK,this._onAllowAnchorsButtonClick);
this._addToolTipToSkinPart(c.allowAnchorsButton,"Boundary_box_Anchor_button_ttid");
window.addEvent("resize",this._setPanelHeightRelativeToWindowHeight);
this.injects().Editor.addEvent(Constants.EditorEvents.SITE_PAGE_CHANGED,function(){if(this._editedComponent){this.updateCompPosSize()
}}.bind(this));
this._skinParts.dataPanelContainer.addEvent(Constants.CoreEvents.MOUSE_WHEEL,this.injects().Utils.stopMouseWheelPropagation);
this._skinParts.help.addEvent("click",function(){this._onHelpClick()
}.bind(this));
var b=this.injects().Editor;
this._skinParts.isInMasterCB.addEvent("inputChanged",function(d){b.moveCurrentComponentToOtherScope(d.value?b.EDIT_MODE.MASTER_PAGE:b.EDIT_MODE.CURRENT_PAGE)
});
c.isInMasterCB.setValue(false);
c.isInMasterCB.setLabel(this.injects().Resources.get("EDITOR_LANGUAGE","SHOW_ON_ALL_PAGES"));
var a=this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")+"icons/property_panel_help_sprite.png";
this._tooltipIcon=new Element("span",{html:"&nbsp;","class":"tooltipIcon",styles:{backgroundImage:"url("+a+")"}});
this._skinParts.isInMasterCB._skinParts.label.grab(this._tooltipIcon,"after").setStyles({display:"inline"});
this._addToolTipToSkinPart(this._tooltipIcon,"Component_Panel_is_in_master_ttid")
},_onHelpClick:function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","COMPONENT_PANEL_"+this._getComponentLabel())
},_enableDrag:function(){var b=window.getSize();
var a={x:[10,b.x-this.DRAG_OFFSET],y:[this.DRAG_OFFSET,b.y-this.DRAG_OFFSET]};
this._drag=new Drag.Move(this._skinParts.view,{snap:0,handle:this._skinParts.panelLabel,limit:a})
},_onAllowAnchorsButtonClick:function(){if(this._skinParts.allowAnchorsButton.getAttribute("disabled")=="true"){return
}this.injects().Editor._editorUI._skinParts.componentEditBox.showAnchorsHandler();
this._setShowAnchorsButtonState(!this._isAllowAnchorsButtonClicked)
},_setShowAnchorsButtonState:function(a){if(a){this._skinParts.allowAnchorsButton.addClass("selected");
this._isAllowAnchorsButtonClicked=true
}else{this._skinParts.allowAnchorsButton.removeClass("selected");
this._isAllowAnchorsButtonClicked=false
}},_getComponentLabel:function(){return this._editedComponent&&this._editedComponent.getOriginalClassName()&&this._editedComponent.getOriginalClassName().split(".").getLast()
},_disableInputsAccordingToComponent:function(){if(!this._editedComponent.isHorizResizable()){this._skinParts.wInput.setAttribute("disabled","disabled")
}else{this._skinParts.wInput.removeAttribute("disabled")
}if(!this._editedComponent.isVertResizable()){this._skinParts.hInput.setAttribute("disabled","disabled")
}else{this._skinParts.hInput.removeAttribute("disabled")
}if(!this._editedComponent.isHorizontallyMovable()){this._skinParts.xInput.setAttribute("disabled","disabled")
}else{this._skinParts.xInput.removeAttribute("disabled")
}if(!this._editedComponent.isVerticallyMovable()){this._skinParts.yInput.setAttribute("disabled","disabled")
}else{this._skinParts.yInput.removeAttribute("disabled")
}},_onKeyUp:function(a){if(a.key=="enter"){this._onFieldChange(a)
}},_onFieldChange:function(b){var e=b.target.getProperty("value");
if(isNaN(parseInt(e,10))){this.updateCompPosSize()
}else{e=parseInt(e,10);
var c=W.Commands.getCommand("WEditorCommands.SetSelectedCompPositionSize");
if(!c){return
}var a;
var d=this._editedComponent.getSizeLimits();
switch(b.target){case this._skinParts.xInput:a={x:Math.min(Math.max(e,this.MINIMUM_X_DEFAULT),this.MAXIMUM_X_DEFAULT)};
if(a.x!=this.last.x){this.last.x=a.x
}else{a=null
}break;
case this._skinParts.yInput:a={y:Math.min(Math.max(e,this.MINIMUM_Y_DEFAULT),this.MAXIMUM_Y_DEFAULT)};
if(a.y!=this.last.y){this.last.y=a.y
}else{a=null
}break;
case this._skinParts.wInput:if(this._editedComponent&&this._editedComponent.isHorizResizable()){a={width:Math.min(Math.max(e,d.minW),d.maxW)};
if(a.width!=this.last.width){this.last.width=a.width
}else{a=null
}}break;
case this._skinParts.hInput:if(this._editedComponent&&this._editedComponent.isVertResizable()){a={height:Math.min(Math.max(e,d.minH),d.maxH)};
if(a.height!=this.last.height){this.last.height=a.height
}else{a=null
}}break
}if(a){a.updateLayout=true;
c.execute(a,this);
if(a.width||a.height){this._editedComponent.fireEvent("resizeEnd")
}}}},_measureHeightWithoutContent:function(){var a=this._panelDetailsHeight||this._skinParts.panelDescription.getSize().y+this._skinParts.topBar.getSize().y+this._skinParts.scopeButtonContainer.getSize().y+this._skinParts.generalProperties.getSize().y;
return a
},_setPanelHeightRelativeToWindowHeight:function(){var d=120;
var c=150;
var b=0;
var a=0;
this._panelDetailsHeight=this._measureHeightWithoutContent();
if(!this._panelDetailsHeight){if(this._measureAgainLater()){return
}}else{this._heightCalcTimerCounter=0
}b=window.getSize().y-this._panelDetailsHeight-d;
a=Math.max(b,c);
this._skinParts.dataPanelContainer.setStyle("height",a)
},_measureAgainLater:function(){if(this._heightCalcTimerCounter<this._heightCalcTimerCounterMax){this._heightCalcTimerCounter++;
this._heightCalcTimer=setTimeout(this._setPanelHeightRelativeToWindowHeight,100);
return true
}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.ContactFormPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this;
this.addInputGroupField(function(){this.addInputField(this._translate("ContactFormPanel.emailTo"),this._translate("ContactFormPanel.emailTo.tip"),1,200,{validators:[a._validateEmailAddress]},null,"Contact_Form_Settings_Contact_Form_Styles_ttid").bindToField("toEmailAddress");
this.addInputField(this._translate("ContactFormPanel.emailBcc"),"",0,200,{validators:[a._validateEmailAddress]}).bindToField("bccEmailAddress")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_validateEmailAddress:function(a){if(!a.match(/^(([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+|\s*)$/)){return"Please enter a valid email"
}},getAcceptableDataTypes:function(){return["ContactForm"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.ContainerPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_createStylePanel:function(b){var c;
if(!b||!(c=b.get("styleItems"))){return LOG.reportError(wixErrors.STYLES_DO_NOT_EXIST,this.className,"addComponentToContainer")
}var a=c[this._previewComponent.className];
if(a){this.addStyleSelector(a)
}},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.CustomizeFontsPanel",skinParts:{content:{type:"htmlElement"},scrollableArea:{type:"htmlElement"},cancel:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"DISCARD_CHANGES"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:["_cancelPalletApply","_onThemeDataChanged"],_fontsData:{font_0:{name:"FONT_0_NAME",label:"FONT_0_LABEL"},font_1:{name:"FONT_1_NAME",label:"FONT_1_LABEL"},font_2:{name:"FONT_2_NAME",label:"FONT_2_LABEL"},font_3:{name:"FONT_3_NAME",label:"FONT_3_LABEL"},font_4:{name:"FONT_4_NAME",label:"FONT_4_LABEL"},font_5:{name:"FONT_5_NAME",label:"FONT_5_LABEL"},font_6:{name:"FONT_6_NAME",label:"FONT_6_LABEL"},font_7:{name:"FONT_7_NAME",label:"FONT_7_LABEL"},font_8:{name:"FONT_8_NAME",label:"FONT_8_LABEL"},font_9:{name:"FONT_9_NAME",label:"FONT_9_LABEL"},font_10:{name:"FONT_10_NAME",label:"FONT_10_LABEL"}},initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="FONTS_DESIGN_CUSTOMIZE";
this._descriptionKey="FONTS_DESIGN_DESCRIPTION";
this._themeManagerData=this.injects().Preview.getPreviewManagers().Theme.getDataItem();
this._themeManagerData.addEvent(Constants.DataEvents.DATA_CHANGED,this._onThemeDataChanged)
},_onThemeDataChanged:function(){this._skinParts.cancel.enable()
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.cancel.addEvent(Constants.CoreEvents.CLICK,this._cancelPalletApply)
},canGoBack:function(){return true
},canCancel:function(){return true
},_addFontButtonWithFontData:function(b){var a=this.injects().Resources;
return this.addFontButtonField("",a.get("EDITOR_LANGUAGE",this._fontsData[b].label),a.get("EDITOR_LANGUAGE",this._fontsData[b].name)).bindToThemeProperty(b)
},_createFields:function(){this._addFontButtonWithFontData("font_0");
this._addFontButtonWithFontData("font_1");
this._addFontButtonWithFontData("font_2");
this._addFontButtonWithFontData("font_3");
this._addFontButtonWithFontData("font_4");
this._addFontButtonWithFontData("font_5");
this._addFontButtonWithFontData("font_6");
this._addFontButtonWithFontData("font_7");
this._addFontButtonWithFontData("font_8");
this._addFontButtonWithFontData("font_9");
this._addFontButtonWithFontData("font_10")
},getAcceptableDataTypes:function(){return[""]
},saveCurrentState:function(){this._skinParts.cancel.disable();
this._initialFontProperties={};
var c=this.injects().Preview.getPreviewManagers().Theme;
var d=c.getPropertiesAccordingToType("font");
for(var b=0,a=d.length;
b<a;
b++){this._initialFontProperties[d[b]]=c.getProperty(d[b])
}},_cancelPalletApply:function(){this._updateFonts(this._initialFontProperties);
this.injects().Commands.executeCommand(Constants.EditorUI.CLOSE_ALL_PANELS)
},_updateFonts:function(f){var c=this.injects().Preview.getPreviewManagers().Theme;
var b={};
for(var a in f){if(a){var d=f[a];
var e=new W.Font(d,c);
b[a]=e.getThemeString()
}}c.getDataItem().setFields(b)
},dispose:function(){this._themeManagerData.removeEvent(Constants.DataEvents.DATA_CHANGED,this._onThemeDataChanged);
this.parent()
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.DesignPanel",skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:[],_panelName:"DESIGN_TITLE",initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="DESIGN_TITLE";
this._descriptionKey="DESIGN_DESCRIPTION"
},_createFields:function(){this.addSelectionListInputFieldWithDataProvider("","#DESIGN_SUB_PANELS",{repeatersSelectable:false},{type:"wysiwyg.editor.components.WButton",skin:"wysiwyg.editor.skins.buttons.ButtonMenuSkin",numRepeatersInLine:1})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.DynamicPalettePanel",skinParts:{content:{type:"htmlElement"},scrollableArea:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:["_invertColors"],initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="COLOR_DESIGN_CUSTOMIZE";
this._descriptionKey="COLOR_DYNAMIC_DESCRIPTION"
},canGoBack:function(){return true
},canCancel:function(){return true
},_createFields:function(){var b=this.injects().Resources;
var c=5;
var a=[[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25],[26,27,28,29,30],[31,32,33,34,35]];
this.addInputGroupField(function(d){this.addLabel(b.get("EDITOR_LANGUAGE","DYNAMIC_PALETTE_MAIN_COLORS"),{textAlign:"left",margin:"0 20px"},null,null,null,null,"Customize_Palette_Main_Colors_ttid");
this.addBreakLine();
this.setNumberOfItemsPerLine(c);
this.addColorGroupField(a[0]);
this.addColorGroupField(a[1]);
this.addColorGroupField(a[2]);
this.addColorGroupField(a[3]);
this.addColorGroupField(a[4])
},"skinless",null,null,null,"center");
this.addBreakLine(20,"1px solid #ccc",20);
this.addInputGroupField(function(d){this.addLabel(b.get("EDITOR_LANGUAGE","DYNAMIC_PALETTE_MORE_COLORS"),{textAlign:"left",margin:"0 20px"},null,null,null,null,"Customize_Palette_More_Colors_ttid");
this.addBreakLine();
this.setNumberOfItemsPerLine(c);
this.addColorField(b.get("EDITOR_LANGUAGE","color_1"),false,"narrow").bindToThemeProperty("color_1");
this.addColorField(b.get("EDITOR_LANGUAGE","color_2"),false,"narrow").bindToThemeProperty("color_2");
this.addColorField(b.get("EDITOR_LANGUAGE","color_3"),false,"narrow").bindToThemeProperty("color_3");
this.addColorField(b.get("EDITOR_LANGUAGE","color_4"),false,"narrow").bindToThemeProperty("color_4");
this.addColorField(b.get("EDITOR_LANGUAGE","color_5"),false,"narrow").bindToThemeProperty("color_5")
},"skinless",null,null,null,"center");
this.addBreakLine(20,"1px solid #ccc",20);
this.addInputGroupField(function(d){this.setNumberOfItemsPerLine(0);
var e={iconSrc:"button/inverse_icon.png",iconSize:{width:20,height:20}};
this.addButtonField(null,b.get("EDITOR_LANGUAGE","COLOR_PALETTE_INVERT"),null,e,null,null,"Customize_Palette_Invert_Palette_ttid").addEvent("inputChanged",d._invertColors)
},"skinless",null,null,{padding:"0 15px"},"right")
},_invertColors:function(){var f={};
var e=this.injects().Preview.getPreviewManagers().Theme;
this._saveSwapValuesToMap("color_1","color_2",f);
var h=e.getPropertiesAccordingToType("color");
var c=Constants.Theme.COLOR_SUB_PALETTE_SIZE;
var g=Constants.Theme.COLOR_PALETTE_INDEX;
var b=((h.length-g))/c;
for(var d=0;
d<b;
d++){var a=g+(d*c);
this._saveSwapValuesToMap("color_"+a,"color_"+(a+4),f);
this._saveSwapValuesToMap("color_"+(a+1),"color_"+(a+3),f)
}e.getDataItem().setFields(f)
},_saveSwapValuesToMap:function(f,c,e){var a=this.injects().Preview.getPreviewManagers().Theme;
var b=a.getProperty(f);
var d=a.getProperty(c);
e[f]=d.toString();
e[c]=b.toString()
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.EbayItemsBySellerPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel","_isEbayUser","_onEbayUserCheckDone"],_lastSelectedBg:0,initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this;
var b="radiobuttons/ebay/ebay_thumb_btns.png";
var e={w:"78px",h:"48px"};
var d=[{value:"0",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_none.png"},{value:"2",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_blue.png"},{value:"3",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_blue3.png"},{value:"4",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_blue2.png"},{value:"5",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_pink.png"},{value:"6",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_orange.png"},{value:"7",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_red.png"},{value:"8",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_green1.png"},{value:"9",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_green2.png"},{value:"10",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_gray.png"},{value:"11",image:b,dimensions:e,icon:"radiobuttons/ebay/ebay_brown.png"}];
var c=this;
this.addInputGroupField(function(){c._sellerIdInput=this.addSubmitInputField(this._translate("EbayItemsBySellerPanel.sellerId"),this._translate("EbayItemsBySellerPanel.sellerId.placeholder"),null,null,this._translate("EbayItemsBySellerPanel.sellerId.button"),null).addEvent("inputChanged",c._isEbayUser);
if(c._data.get("sellerId")){c._sellerIdInput.setValue(c._data.get("sellerId"))
}c._checkingUserLabel=this.addSubLabel(c._translate("EbayItemsBySellerPanel.checkingUser"));
c._checkingUserLabel.collapse();
c._userDoesNotExistLabel=this.addSubLabel(c._translate("EbayItemsBySellerPanel.Errors.userDoesNotExist"),"#600");
c._userDoesNotExistLabel.collapse()
});
this.addInputGroupField(function(){this.addRadioImagesField(this._translate("EbayItemsBySellerPanel.headerImage"),d,null,null,"inline").bindToProperty("headerImage")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_isEbayUser:function(a){var d=a.value;
var c="http://open.api.ebay.com/shopping?callname=GetUserProfile&responseencoding=JSON&version=757&callback=true&appid=Wixpress-100d-4e1c-905b-3bc0f3b60757&UserID=";
c=c+encodeURIComponent(d);
this._checkingUserLabel.uncollapse();
this._userDoesNotExistLabel.collapse();
window._cb_GetUserProfile=function(e){this._onEbayUserCheckDone(d,e)
}.bind(this);
var b=new Element("script",{type:"text/javascript",src:c});
document.head.grab(b,"bottom")
},_onEbayUserCheckDone:function(b,a){this._checkingUserLabel.collapse();
if(a.Ack=="Success"){this._data.set("registrationSite",a.User.RegistrationSite,true);
this._data.set("sellerId",b)
}else{this._userDoesNotExistLabel.uncollapse()
}},getAcceptableDataTypes:function(){return["EbayItemsBySeller"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.FacebookCommentPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.addInputGroupField(function(){this.addSliderField(this._translate("FB_COMMENTS_NUM_OF_COMMENTS"),1,10,1,false,true).bindToProperty("numPosts");
this.addComboBox(this._translate("GENERAL_COLOR_SCHEME")).bindToProperty("colorScheme")
})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.FacebookLikePanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this;
this.addInputGroupField(function(){this.addComboBox(this._translate("FB_LIKE_BUTTON_STYLE")).bindToProperty("layout");
this.addComboBox(this._translate("FB_LIKE_ACTION")).bindToProperty("action");
this.addComboBox(this._translate("GENERAL_COLOR_SCHEME")).bindToProperty("colorScheme");
var b=this.addCheckBoxField(this._translate("FB_LIKE_SHOW_PROFILE_PICS")).bindToProperty("show_faces");
this.addVisibilityCondition(b,function(){return(a._previewComponent.getComponentProperty("layout")=="standard")
})
})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.FaviconAndThumbnailPanel",imports:[],skinParts:{panelLabel:{type:"htmlElement"},help:{type:"htmlElement"},close:{type:"htmlElement",command:"this._closeCommand"},doneButton:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"done",command:"this._closeCommand"},content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SettingsSubPanel",Binds:["_onUpgradeClick"],initialize:function(c,a,b){this.parent(c,a,b);
this._appType=this.injects().Config.getApplicationType()
},_onAllSkinPartsReady:function(){this.parent();
var a=this._appType==Constants.WEditManager.SITE_TYPE_WEB?"FAVICON_AND_THUMBNAIL_TITLE":"ONLY_THUMBNAIL_TITLE";
this._skinParts.panelLabel.set("html",this._translate(a))
},_onCancel:function(){this._data.restoreSnapshot();
this.injects().Commands.executeCommand(this._closeCommand)
},_onSave:function(){this.injects().Commands.executeCommand(this._closeCommand)
},_showHelp:function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","SETTINGS_SUB_PANEL_FaviconAndThumbnail")
},_createFields:function(){if(this._appType==Constants.WEditManager.SITE_TYPE_WEB){this.addTitle(this.injects().Resources.get("EDITOR_LANGUAGE","SOCIAL_PANEL_FAVICON_FAVICON"),null,"bold");
this.addSubLabel(this._translate("FAVICON_AND_THUMBNAIL_PANEL_FAVICON_DESCRIPTION"),null);
if(this.injects().Config.isPremiumUser()){this.addImageField(null,150,150,this._translate("FAVICON_AND_THUMBNAIL_PANEL_CHANGE"),"favicon").bindToRemappedDataFields({favicon:"uri"})
}else{this.addSubLabel(this._translate("FAVICON_AND_THUMBNAIL_PANEL_UPGRADE_TO_UPLOAD_FAVICON_DESCRIPTION"),null);
this.addButtonField("",this._translate("FAVICON_AND_THUMBNAIL_PANEL_UPGRADE_NOW")).addEvent("click",this._onUpgradeClick)
}this.addBreakLine();
this.addTitle(this._translate("FAVICON_AND_THUMBNAIL_PANEL_FAVICON_THUMBNAIL"),null,"bold")
}this.addSubLabel(this._translate("FAVICON_AND_THUMBNAIL_PANEL_THUMBNAIL_DESCRIPTION"),null);
this.addImageField(null,150,150,this._translate("FAVICON_AND_THUMBNAIL_PANEL_CHANGE"),"clipart").bindToRemappedDataFields({thumbnail:"uri"})
},_onUpgradeClick:function(){this.injects().Commands.executeCommand("WEditorCommands.UpgradeToPremium",{referralAdditionalInfo:Constants.WEditManager.UPGRADE_SRC.FAVICON_AND_THUMBNAIL_PANEL})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.FlashComponentPanel",traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel","_onDataChange","_updateComponentEditBox"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.setNumberOfItemsPerLine(1);
this.addFlashField(null,150,150,this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_CHANGE")).bindToDataItem(this._data);
var d=this.addComboBox(this.injects().Resources.get("EDITOR_LANGUAGE","FLASH_DISPLAY_MODE"),"Flash_Component_Settings_Display_Mode_ttid").bindToProperty("displayMode");
this._previewComponent.addEvent(Constants.PropertyEvents.PROPERTY_CHANGED,this._onDataChange);
d.runWhenReady(function(f){this._updateComponentEditBox(f.getValue())
}.bind(this));
var b=this;
this.addInputGroupField(function(){var f=b._data.getDataManager();
var g=this._data.get("placeHolderImage");
f.getDataByQuery(g,function(h){this.addImageField(this.injects().Resources.get("EDITOR_LANGUAGE","FLASH_REPLACEMENT_IMAGE"),null,null,this.injects().Resources.get("EDITOR_LANGUAGE","PHOTO_REPLACE_IMAGE"),null,null,null,"Flash_Component_Settings_Fallback_Image_ttid").bindToDataItem(h)
}.bind(this))
});
var c=this.injects().Resources.get("EDITOR_LANGUAGE","LINK_LINK_TO");
var e="http://www.wix.com";
var a=this.addLinkField(c,e).bindToDataItem(this.getDataItem())
},_onDataChange:function(a){this._updateComponentEditBox(a)
},_updateComponentEditBox:function(a){if(a!="original"){this._previewComponent._resizableSides=[W.BaseComponent.ResizeSides.TOP,W.BaseComponent.ResizeSides.LEFT,W.BaseComponent.ResizeSides.BOTTOM,W.BaseComponent.ResizeSides.RIGHT]
}else{this._previewComponent._resizableSides=[]
}this.injects().Commands.executeCommand(Constants.EditorUI.RESIZE_HANDLES_CHANGED)
},getAcceptableDataTypes:function(){return["FlashComponent"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.FlickrBadgeWidgetPanel",imports:["mobile.core.external_apis.flickr.FlickrAPI"],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onGetUserIDComplete","_getUserID"],_userNameInput:undefined,_tagsInput:undefined,_userNameValue:undefined,_firstRun:true,_userNameInputCB:undefined,initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this;
var d=[{label:this._translate("FLICKR_SHOW_ITEM_LATEST"),value:"latest"},{label:this._translate("FLICKR_SHOW_ITEM_RANDOM"),value:"random"}];
var c="radiobuttons/radio_button_states.png";
var f={w:"35px",h:"33px"};
var e=[{value:"1",image:c,dimensions:f,icon:"radiobuttons/flickr/flickr1.png"},{value:"3",image:c,dimensions:f,icon:"radiobuttons/flickr/flickr3.png"},{value:"5",image:c,dimensions:f,icon:"radiobuttons/flickr/flickr5.png"},{value:"10",image:c,dimensions:f,icon:"radiobuttons/flickr/flickr10.png"}];
var b=[{label:this._translate("FLICKR_LAYOUT_ITEM_VERT"),value:"v"},{label:this._translate("FLICKR_LAYOUT_ITEM_HORZ"),value:"h"}];
var h=[{value:"s",image:c,dimensions:f,icon:"radiobuttons/flickr/flickr_square.png"},{value:"t",image:c,dimensions:f,icon:"radiobuttons/flickr/flickr_thumb.png"},{value:"m",image:c,dimensions:f,icon:"radiobuttons/flickr/flickr_large.png"}];
var g=[];
var i=this._data.get("userId")!=undefined&&this._data.get("userId")!="";
if(i){this._firstRun=false;
g.push({label:"All",value:""});
g.push({label:this._data.get("tag"),value:this._data.get("tag")})
}this.addInputGroupField(function(){var j=this._translate("FLICKR_USERNAME_PLACEHOLDER");
this.addSubmitInputField(this._translate("FLICKR_USERNAME"),j,0,30,this._translate("GENERAL_UPDATE"),null,null,a._getUserID).bindToField("userName").runWhenReady(function(k){a._userNameInput=k
})
});
this.addInputGroupField(function(){this.addComboBoxField(this._translate("FLICKR_TAG_TITLE"),g,"latest",2,"Flickr_Gallery_Display_by_tag_ttid").bindToField("tag").runWhenReady(function(j){a._tagsInput=j;
if(i){a._getTags()
}});
this.addComboBoxField(this._translate("FLICKR_SHOW_TITLE"),d,"latest",2,"Flickr_Gallery_Show_ttid").bindToField("whichImages");
this.addComboBoxField(this._translate("FLICKR_LAYOUT_TITLE"),b,"v",2).bindToField("layoutOrientation");
this.addRadioImagesField(this._translate("FLICKR_GALLERY_SIZE"),e,"3",null,"inline").bindToField("imageCount");
this.addRadioImagesField(this._translate("FLICKR_IMAGE_SIZE"),h,"t",3,"inline").bindToField("imageSize")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_getUserID:function(d,a){var c;
var b;
this._userNameInputCB={event:d,handler:a};
b=W.Data.createDataItem({items:[{label:"",value:""}],type:"list"});
this._tagsInput.bindToDataProvider(b);
this._userNameValue=this._userNameInput.getValue();
c=new this.imports.FlickrAPI();
c.getUserID(this._userNameValue,(this._onGetUserIDComplete).bind(this))
},_onGetUserIDComplete:function(b,a){if(b){this._userID=a;
this._data.set("userName",this._userNameValue);
this._data.set("userId",a);
this._getTags();
this._userNameInput.resetInvalidState();
this._userNameInputCB.handler(this._userNameInputCB.event)
}else{this._userNameInput.showValidationMessage(a)
}},_getTags:function(){var a;
a=new this.imports.FlickrAPI();
a.getTags(this._data.get("userId"),(this._onGetTagsComplete).bind(this))
},_onGetTagsComplete:function(e,a){if(e){var c;
var d;
d=[];
d.push({label:"All",value:""});
for(var b in a){if(a[b].hasOwnProperty("_content")){d.push({label:a[b]._content,value:a[b]._content})
}}c=W.Data.createDataItem({items:d,type:"list"});
this._tagsInput.bindToDataProvider(c);
if(!this._firstRun){this._tagsInput.setValue(this._data.get("tag"))
}}else{this._tagsInput.showValidationMessage(a)
}},getAcceptableDataTypes:function(){return["FlickrBadgeWidget"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.FontsPanel",imports:["mobile.core.managers.utils.BufferFunction"],traits:["wysiwyg.editor.components.traits.FiltersDataByTags"],skinParts:{content:{type:"htmlElement"},customize:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"FONTS_DESIGN_CUSTOMIZE",command:"WEditorCommands.CustomizeFonts"},cancel:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"DISCARD_CHANGES"},actions:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:["_onPaletteReady","_onPaletteClick","_cancelPalletApply"],initialize:function(d,b,c){this.parent(d,b,c);
this._titleKey="FONTS_DESIGN_CUSTOMIZE";
this._descriptionKey="FONTS_DESIGN_DESCRIPTION";
this._panelName="FONTS_DESIGN_TITLE";
var a=new this.imports.BufferFunction(this,"_updateFonts");
a.setBufferTime(1000)
},_createFields:function(){this.filterEditorDataListByTags("#FONT_STYLES","fontsFilterTags","tags",function(c){for(var b=0;
b<c.length;
b++){var a=this.injects().Components.createComponent("wysiwyg.editor.components.inputs.font.FontPresetSelector","wysiwyg.editor.skins.inputs.font.FontPresetSelectorSkin",null,c[b],null,this._onPaletteReady);
a.insertInto(this._skinParts.content)
}}.bind(this));
this._skinParts.cancel.addEvent(Constants.CoreEvents.CLICK,this._cancelPalletApply)
},_onPaletteReady:function(a){a.addEvent(Constants.CoreEvents.CLICK,this._onPaletteClick)
},_onPaletteClick:function(a){this._skinParts.cancel.enable();
var b=a.target.getLogic().getFonts();
this._updateFonts(b);
LOG.reportEvent(wixEvents.FONT_PRESET_CHANGED)
},_updateFonts:function(e){var c={};
var b=this._discardFontColor(e);
for(var a in b){if(a){c[a]=b[a]
}}var d=this.injects().Preview.getPreviewManagers().Theme;
d.getDataItem().setFields(c)
},_discardFontColor:function(f){var c=this.injects().Preview.getPreviewManagers().Theme;
var g={};
for(var b in f){var e=f[b];
var h=new W.Font(e,c);
var d=c.getProperty(b);
var a=d.getColorReference();
if(a!==""){h.setColorReference(a)
}else{h.setColor(d.getColor())
}h.setSize(d.getSize());
g[b]=h.getThemeString()
}return g
},canGoBack:function(){return true
},canCancel:function(){return true
},saveCurrentState:function(){this._skinParts.cancel.disable();
this._initialFontProperties={};
var c=this.injects().Preview.getPreviewManagers().Theme;
var d=c.getPropertiesAccordingToType("font");
for(var b=0,a=d.length;
b<a;
b++){this._initialFontProperties[d[b]]=c.getProperty(d[b])
}},_cancelPalletApply:function(){this._updateFonts(this._initialFontProperties);
this.injects().Commands.executeCommand(Constants.EditorUI.CLOSE_ALL_PANELS)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.GalleryPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.addListEditorButton("Manage Gallery",this._data)
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.GoogleMapPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_getGeoLocationFromAddress"],API_KEY:"AIzaSyDMbN5wvwwR2ePDQ1QquKP_0VAhvAFNWes",initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this;
this.addInputGroupField(function(){this.addSubmitInputField(this._translate("GOOGLE_MAP_ADDRESS"),this._translate("GOOGLE_MAP_ADDRESS_PH"),null,null,this._translate("GENERAL_FIND"),null,null).bindToField("address").bindHooks(a._getGeoLocationFromAddress).runWhenReady(function(b){this._addressInput=b
}.bind(a))
});
this.addInputGroupField(function(){var b=this.addSubmitTextAreaField(this._translate("GENERAL_DESCRIPTION"),this._translate("GOOGLE_MAP_DESCRIPTION_PH"),null,null,"50px",this._translate("GENERAL_SET"),null).bindToField("addressInfo");
this.addEnabledCondition(b,function(){return(a._previewComponent.getState()!="error")
}.bind(a))
});
this.addInputGroupField(function(){this.addComboBox(this._translate("GOOGLE_MAP_MAP_TYPE")).bindToProperty("mapType")
});
this.addInputGroupField(function(){this.addLabel(this._translate("GOOGLE_MAP_ALLOW"));
this.addCheckBoxField(this._translate("GOOGLE_MAP_SHOW_CONTROL_MAP_TYPE")).bindToProperty("showMapType");
this.addCheckBoxField(this._translate("GOOGLE_MAP_SHOW_CONTROL_ZOOM")).bindToProperty("showZoom");
this.addCheckBoxField(this._translate("GOOGLE_MAP_SHOW_CONTROL_POSITION")).bindToProperty("showPosition");
this.addCheckBoxField(this._translate("GOOGLE_MAP_SHOW_CONTROL_STREET_VIEW")).bindToProperty("showStreetView");
this.addCheckBoxField(this._translate("GOOGLE_MAP_ALLOW_MAP_DRAGGING")).bindToProperty("mapDragging")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_getGeoLocationFromAddress:function(a){var b=new Request.JSONP({url:"http://maps.googleapis.com/maps/api/js?key=AIzaSyDMbN5wvwwR2ePDQ1QquKP_0VAhvAFNWes&sensor=true",onComplete:function(){var c=new google.maps.Geocoder();
c.geocode({address:a},function(e,d){if(d==google.maps.GeocoderStatus.OK){this._previewComponent.setState("normal");
var f=e[0].geometry.location;
this._data.setFields({latitude:f.lat(),longitude:f.lng()});
this._addressInput.resetInvalidState()
}else{this._previewComponent.setState("error");
this._addressInput.showValidationMessage(this._translate("GOOGLE_MAP_INVALID_ADDRESS_VAL_ERR"));
this._data.setFields({latitude:null,longitude:null})
}}.bind(this))
}.bind(this)}).send();
return a
},getAcceptableDataTypes:function(){return["GeoMap"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.GooglePlusOnePanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.addComboBox(this._translate("GOOGLE_PLUS_ONE_BUTTON_SIZE")).bindToProperty("size");
this.addComboBox(this._translate("GOOGLE_PLUS_ONE_BUTTON_STYLE")).bindToProperty("annotation")
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.HorizontalMenuPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var d={min:0,max:100,step:1};
var b={placeholder:"Label Text",showInput:true};
var c=this.injects().Resources;
var a=this;
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
var e="radiobuttons/radio_button_states.png";
var i={w:"35px",h:"33px"};
var h={options:[{value:"left",image:e,dimensions:i,icon:"radiobuttons/alignment/left.png"},{value:"center",image:e,dimensions:i,icon:"radiobuttons/alignment/center.png"},{value:"right",image:e,dimensions:i,icon:"radiobuttons/alignment/right.png"}],display:"inline",defaultValue:"",group:""};
var g=this.addRadioImagesField(c.get("EDITOR_LANGUAGE","MENU_BUTTONS_ALIGNMENT"),h.options,h.defaultValue,h.group,h.display).bindToProperty("alignButtons");
var f={options:[{value:"left",image:e,dimensions:i,icon:"radiobuttons/alignment/left.png"},{value:"center",image:e,dimensions:i,icon:"radiobuttons/alignment/center.png"},{value:"right",image:e,dimensions:i,icon:"radiobuttons/alignment/right.png"}],display:"inline",defaultValue:"",group:""};
this.addRadioImagesField(c.get("EDITOR_LANGUAGE","MENU_BUTTON_TEXT_ALIGNMENT"),f.options,f.defaultValue,f.group,f.display).bindToProperty("alignText");
this.addCheckBoxField(c.get("EDITOR_LANGUAGE","MENU_BUTTONS_CONSTANT_WIDTH")).bindToProperty("sameWidthButtons");
this.addCheckBoxField(c.get("EDITOR_LANGUAGE","MENU_BUTTONS_FILL_MENU_WIDTH")).bindToProperty("stretchButtonsToMenuWidth")
});
this.addInputGroupField(function(){this.addInputField(c.get("EDITOR_LANGUAGE","MENU_MORE_BUTTON_LABEL"),b.placeholder,null,null,null,null,"Menu_Settings_More_menu_button_ttid").bindToProperty("moreButtonLabel")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_getStretchButtonsMode:function(){return this.getComponentProperty("stretchButtonsToMenuWidth")
},getAcceptableDataTypes:function(){return["Menu","Document"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.HtmlComponentPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_preview","_onComboChange","_hideInvalidUrlMessage","_fromUrlToHtml","_fromHtmlToTempUrl"],initialize:function(c,a,b){this.parent(c,a,b);
this._src=null;
this._html=null;
this._stateCombo=null;
this._saveButton=null;
this._loadingLabel=null;
this._errorLabel=null
},_createFields:function(){var c=[{value:"external",label:this._translate("HtmlComponentPanel.stateCombo.external")},{value:"embedded",label:this._translate("HtmlComponentPanel.stateCombo.embedded")}];
this._stateCombo=this.addComboBoxField(this._translate("HtmlComponentPanel.HtmlMode"),c);
this._stateCombo.addEvent("inputChanged",this._onComboChange);
this._src=this.addInputField(this._translate("HtmlComponentPanel.HtmlSource"),this._translate("HtmlComponentPanel.HtmlSourceSample"),0,400);
this._html=this.addTextAreaField(this._translate("HtmlComponentPanel.HtmlCode"),"250px",null,8192);
this._srcMessage=this.addSubLabel(this._translate("HtmlComponentPanel.InvalidUrl"),"#600");
this._src.addEvent(Constants.CoreEvents.KEY_UP,function(d){this._hideInvalidUrlMessage();
if(d.code==13){this._preview()
}}.bind(this));
this._hideInvalidUrlMessage();
var a=this;
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
a._saveButton=this.addButtonField("",this._translate("HtmlComponentPanel.UpdateButton"),false,null,"smaller");
a._saveButton.addEvent("click",a._preview);
a._setCorrectVisibility(a._data.get("sourceType")=="external")
},"skinless",null,null,null,"right");
this._loadingLabel=this.addLabel(this._translate("HtmlComponentPanel.Loading"));
this._loadingLabel.collapse();
this._errorLabel=this.addSubLabel("","#600");
this._errorLabel.collapse();
var b=function(){var d=this._getTargetLogic();
return d&&d.getValue&&d.getValue()
};
this._src.getValue=b;
this._html.getValue=b;
this._stateCombo.getValue=b
},_isValidUrl:function(b){var a=this.injects().Utils;
return a.isValidUrl(b)||a.isValidUrlNoProtocol(b)
},_hideInvalidUrlMessage:function(){this._srcMessage.collapse()
},_showErrorMessage:function(a){this._errorLabel.setValue(this._translate(a));
this._errorLabel.uncollapse()
},_hideErrorMessage:function(){this._errorLabel.collapse()
},render:function(){this.parent();
var b=this._data.get("sourceType");
var a=this._data.get("url");
if(b=="external"){this._stateCombo.setValue("external");
this._src.setValue(a)
}else{this._stateCombo.setValue("embedded");
if(a){this._showLoading(true);
this._fromUrlToHtml(a,function(c){this._showLoading(false);
if(c.success){this._html.setValue(c.html)
}else{this._showErrorMessage("HtmlComponentPanel.Errors.HtmlCannotBeRetrieved")
}}.bind(this))
}}this._setCorrectVisibility(b=="external")
},_onComboChange:function(a){if(a&&a.value){this._hideErrorMessage();
this._setCorrectVisibility(a.value=="external")
}},_preview:function(){var b=this._stateCombo.getValue();
if(b=="external"){var c=this._src.getValue();
if(!this._isValidUrl(c)){this._srcMessage.uncollapse();
return
}this._hideInvalidUrlMessage();
this._data.set("sourceType","external",true);
this._data.set("url",c)
}else{var a=this._html.getValue();
if(a.test(/^\s*$/)){this._data.set("sourceType","htmlEmbedded",true);
this._data.set("url",null);
return
}this._showLoading(true);
this._fromHtmlToTempUrl(a,function(d){this._showLoading(false);
if(d.success){this._data.set("sourceType","tempUrl",true);
this._data.set("url",d.url)
}else{if(d.errorCode==-15){this._showErrorMessage("HtmlComponentPanel.Errors.NotLoggedIn")
}else{this._showErrorMessage("HtmlComponentPanel.Errors.UnableToStoreHtml")
}}}.bind(this))
}},_setCorrectVisibility:function(a){if(a){this._src.uncollapse();
this._html.collapse()
}else{this._hideInvalidUrlMessage();
this._src.collapse();
this._html.uncollapse()
}},_showLoading:function(a){if(this._saveButton){if(a){this._hideErrorMessage();
this._saveButton.disable();
this._loadingLabel.uncollapse()
}else{this._saveButton.enable();
this._loadingLabel.collapse()
}}},_fromUrlToHtml:function(a,b){this.injects().ServerFacade.getContentFromStaticUrl(a,function(c){b({success:true,html:c})
},function(c,d){b({success:false,errorCode:d,errorDescription:c})
})
},_fromHtmlToTempUrl:function(a,b){this.injects().ServerFacade.saveHtmlAsTempStaticUrl(a,function(c){b({success:true,url:c})
},function(c,d){b({success:false,errorCode:d,errorDescription:c})
})
},getAcceptableDataTypes:function(){return["HtmlComponent"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.LinesPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel);
var a={options:[{value:"fill",label:"Auto-Crop"},{value:"full",label:"Center"},{value:"stretch",label:"Stretch"},{value:"fitWidth",label:"Fit-Width"}]}
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.LinkBarPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},propertiesSchemaName:"LinkBarProperties",Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_renderPanel"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.injects().Data.getDataByQuery("#STYLES",this._renderPanel)
},_renderPanel:function(b){var a=this;
this.addInputGroupField(function(){var c=this._previewComponent.getComponentProperty("gallery")||"clipart";
this.addListEditorButton(this.injects().Resources.get("EDITOR_LANGUAGE","SOCIAL_BAR_MNG_ICONS"),a._data,c)
});
this.addInputGroupField(function(){this.addSliderField(this.injects().Resources.get("EDITOR_LANGUAGE","SOCIAL_BAR_ICON_SIZE"),16,128,1,false,false).bindToProperty("iconSize");
this.addSliderField(this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_SPACING"),1,50,1,false,false).bindToProperty("spacing");
this.addComboBoxField(this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_LAYOUT"),[{label:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_HORIZONTAL"),value:"HORIZ"},{label:this.injects().Resources.get("EDITOR_LANGUAGE","GENERAL_VERTICAL"),value:"VERT"}],"HORIZ",2).bindToProperty("orientation")
})
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.MainEditorBar",imports:[],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_enableOnPreviewReadyEvent"],initialize:function(c,a,b){this.parent(c,a,b);
this.disable();
this._enableOnPreviewReadyEvent()
},_enableOnPreviewReadyEvent:function(){var a=W.Commands.getCommand("PreviewIsReady");
if(!a){W.Commands.registerCommandAndListener("PreviewIsReady",this,this.enable)
}else{a.registerListener(this,this.enable)
}},_addEditActions:function(){this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addButtonField(null,this._translate("MAIN_BAR_COPY"),false,{iconSrc:"maineditortabs/dark-icon-sprite.png",iconSize:{width:26,height:26},spriteOffset:{x:0,y:-27}},"mainBarEditActions",null,"Main_Menu_Copy_ttid","EditCommands.Copy");
this.addButtonField(null,this._translate("MAIN_BAR_PASTE"),false,{iconSrc:"maineditortabs/dark-icon-sprite.png",iconSize:{width:26,height:26},spriteOffset:{x:0,y:0}},"mainBarEditActions",null,"Main_Menu_Paste_ttid","EditCommands.Paste");
this.addButtonField(null,this._translate("MAIN_BAR_GRID"),true,{iconSrc:"maineditortabs/dark-icon-sprite.png",iconSize:{width:26,height:26},spriteOffset:{x:0,y:-54}},"mainBarEditActions",null,"Main_Menu_Grid_ttid","EditCommands.ToggleGridLines");
this.addButtonField(null,this._translate("MAIN_BAR_SNAP"),true,{iconSrc:"maineditortabs/dark-icon-sprite.png",iconSize:{width:26,height:26},spriteOffset:{x:0,y:-81}},"mainBarEditActions",null,"Snap_To_Grip_Toggle_ttid","EditCommands.SnapToGrid").runWhenReady(function(a){a.toggleSelected(true);
W.Commands.executeCommand("EditCommands.SnapToGrid",true)
})
},"skinless")
},_addDocumentActions:function(){var a={iconSrc:"maineditortabs/dark-help-sprite.png",iconSize:{width:18,height:18},spriteOffset:{x:0,y:0}};
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(0);
this.addButtonField(null,this._translate("MAIN_BAR_PREVIEW"),false,null,"mainBarDocActions",null,null,"WEditorCommands.WSetEditMode",{editMode:W.Editor.EDIT_MODE.PREVIEW,src:"previewBtn"});
this.addButtonField(null,this._translate("MAIN_BAR_SAVE"),false,null,"mainBarDocActions",null,null,"WEditorCommands.Save",{promptResultDialog:true,src:"saveBtn"});
this.addButtonField(null,this._translate("MAIN_BAR_PUBLISH"),false,null,"mainBarDocActions",null,null,"WEditorCommands.OpenPublishDialog",{});
this.addButtonField(null,this._translate("MAIN_BAR_UPGRADE"),false,null,"mainBarDocActions",null,null,"WEditorCommands.UpgradeToPremium",{referralAdditionalInfo:Constants.WEditManager.UPGRADE_SRC.TOP_PANEL});
this.addButtonField(null,this._translate("MAIN_BAR_HELP"),false,a,"mainBarHelpIcon",null,null,"WEditorCommands.ShowHelpDialog","TopBar")
},"skinless")
},_addUndoActions:function(){},_addDebugActions:function(){},_createFields:function(){this.setNumberOfItemsPerLine(0,"5px");
this._addDebugActions();
this._addUndoActions();
this._addEditActions();
this._addDocumentActions()
},getAcceptableDataTypes:function(){return["PropertyList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.MasterComponentPanel",skinParts:{content:{type:"htmlElement"},scrollableArea:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",Binds:[],_panelName:"MASTER_COMPONENT_TITLE",initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="ADD_COMPONENT_TITLE";
this._descriptionKey="ADD_COMPONENT_DESCRIPTION"
},_createFields:function(){this.addSelectionListInputFieldWithDataProvider("","#COMPONENT_SECTIONS",{repeatersSelectable:false},{type:"wysiwyg.editor.components.WButton",skin:"wysiwyg.editor.skins.buttons.ButtonMenuSkin",numRepeatersInLine:1})
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.MatrixGalleryPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addListEditorButton(W.Resources.get("EDITOR_LANGUAGE","GALLERY_ORGANIZE_PHOTOS"),this._data,"MatrixGallery")
});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addComboBox(W.Resources.get("EDITOR_LANGUAGE","GALLERY_IMAGE_MODE"),"Gallery_Settings_Image_Scaling_ttid").bindToProperty("imageMode");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","MATRIX_GALLERY_COLUMNS"),1,10,1,false,false).bindToProperty("numCols");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","MATRIX_GALLERY_ROWS"),1,10,1,false,false).bindToProperty("maxRows");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","MATRIX_GALLERY_SHOW_MORE"),1,10,1,false,true,null,"Grid_Gallery_Settings_Show_More_ttid").bindToProperty("incRows");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","GALLERY_MARGIN"),0,250,1,false,false).bindToProperty("margin")
});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","GALLERY_EXPAND_MODE"),"Gallery_Settings_Expand_Mode_ttid").bindToProperty("expandEnabled")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.MultiSelectProxyPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel","getIsRelative","_align","_matchBoth","_distributeBoth","_undo","_setCheckboxState"],initialize:function(c,a,b){this.parent(c,a,b);
this._checkboxState=false
},getIsRelative:function(){return this._relativeCheckBox.getValue()
},wrapUpAlignments:function(){var a=this._previewComponent;
a.setSelectedComps(a.getSelectedComps());
a.fireEvent("autoSizeChange")
},_align:function(b){var a=this._previewComponent;
W.AlignmentTools.arrangeComponents(a.getSelectedComps(),b.value.command,this._checkboxState);
this.wrapUpAlignments()
},_matchBoth:function(b){var a=this._previewComponent;
W.AlignmentTools.arrangeComponents(a.getSelectedComps(),Constants.AlignmentCommands.HSIZE,false);
W.AlignmentTools.arrangeComponents(a.getSelectedComps(),Constants.AlignmentCommands.VSIZE,false);
this.wrapUpAlignments()
},_distributeBoth:function(b){var a=this._previewComponent;
W.AlignmentTools.arrangeComponents(a.getSelectedComps(),Constants.AlignmentCommands.HDISTR,this._checkboxState);
W.AlignmentTools.arrangeComponents(a.getSelectedComps(),Constants.AlignmentCommands.VDISTR,this._checkboxState);
this.wrapUpAlignments()
},_undo:function(a){W.AlignmentTools.undo(this._previewComponent.getSelectedComps());
this.wrapUpAlignments()
},_createFields:function(){var c=this.injects().Resources;
var b="radiobuttons/alignment/";
var a="alignButton";
this.addInputGroupField(function(d){this.addLabel(c.get("EDITOR_LANGUAGE","MULTI_SELECT_ALIGN")+":",null,null,null,null,null,"Element_Settings_Align_ttid");
this.addInputGroupField(function(e){this.setNumberOfItemsPerLine(3);
this.addButtonField(null,null,false,b+"left.png",a,null,"Element_Settings_Left_ttid").setValue({command:Constants.AlignmentCommands.LEFT}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"center.png",a,null,"Element_Settings_Center_H_ttid").setValue({command:Constants.AlignmentCommands.HCENTER}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"right.png",a,null,"Element_Settings_Right_ttid").setValue({command:Constants.AlignmentCommands.RIGHT}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"top.png",a,null,"Element_Settings_Under_ttid").setValue({command:Constants.AlignmentCommands.UP}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"middle.png",a,null,"Element_Settings_Center_V_ttid").setValue({command:Constants.AlignmentCommands.VCENTER}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"bottom.png",a,null,"Element_Settings_Above_ttid").setValue({command:Constants.AlignmentCommands.DOWN}).addEvent(Constants.CoreEvents.CLICK,e._align)
},"skinless");
this.addLabel(c.get("EDITOR_LANGUAGE","MULTI_SELECT_DISTRIBUTE")+":",null,null,null,null,null,"Element_Settings_Distribute_ttid");
this.addInputGroupField(function(e){this.setNumberOfItemsPerLine(3);
this.addButtonField(null,null,false,b+"dist_horiz.png",a,null,"Element_Settings_Horizontal_ttid").setValue({command:Constants.AlignmentCommands.HDISTR}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"dist_vert.png",a,null,"Element_Settings_Vertical_ttid").setValue({command:Constants.AlignmentCommands.VDISTR}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"dist_both.png",a,null,"Element_Settings_Both_ttid").addEvent(Constants.CoreEvents.CLICK,e._distributeBoth)
},"skinless");
this.addCheckBoxField(c.get("EDITOR_LANGUAGE","MULTI_SELECT_RELATIVE_TO_PARENT")).addEvent("inputChanged",d._setCheckboxState)
});
this.addInputGroupField(function(d){this.addLabel(c.get("EDITOR_LANGUAGE","MULTI_SELECT_MATCH_SIZE")+":",null,null,null,null,null,"Element_Settings_Match_Size_ttid");
this.addInputGroupField(function(e){this.setNumberOfItemsPerLine(3);
this.addButtonField(null,null,false,b+"match_width.png",a,null,"Element_Settings_To_width_ttid").setValue({command:Constants.AlignmentCommands.HSIZE}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"match_height.png",a,null,"Element_Settings_To_height_ttid").setValue({command:Constants.AlignmentCommands.VSIZE}).addEvent(Constants.CoreEvents.CLICK,e._align);
this.addButtonField(null,null,false,b+"match_both.png",a,null,"Element_Settings_To_both_ttid").addEvent(Constants.CoreEvents.CLICK,e._matchBoth)
},"skinless")
});
this.addInputGroupField(function(d){this.addButtonField(null,null,false,b+"undo.png",a,null,"Elements_Settings_Undo_ttid").addEvent(Constants.CoreEvents.CLICK,d._undo)
})
},_setCheckboxState:function(){this._checkboxState=!this._checkboxState
},_createStylePanel:function(b){var c;
if(!b||!(c=b.get("styleItems"))){return W.Utils.debugTrace("WEditor: missing component data or data list")
}var a=c[this._previewComponent.className];
if(a){this.addStyleSelector(a)
}},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.PageSettingsPanel",imports:["wysiwyg.editor.utils.InputValidators"],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{panelLabel:{type:"htmlElement",autoBindDictionary:"PAGE_SETTINGS"},help:{type:"htmlElement"},close:{type:"htmlElement",command:"this._closeCommand"},duplicate:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"duplicate"},deletePage:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"delete"},doneButton:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"done",command:"this._closeCommand"},content:{type:"htmlElement"},topBar:{type:"htmlElement"},pageActions:{type:"htmlElement"},bottom:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["closePanel","_onDelete","_onDuplicateButtonClick","_onSitePageChanged","_validatePageUrlString"],_states:["hidden","shown"],initialize:function(c,a,b){this.parent(c,a,b);
this.inputValidators=new this.imports.InputValidators();
this._closeCommand=b&&b.closeCommand;
this._data=b.data
},render:function(){this.parent();
this.setState("hidden");
if(!W.Preview.getPreviewManagers().Viewer.isHomePage()){this._skinParts.deletePage.show()
}else{this._skinParts.deletePage.hide()
}setTimeout(function(){this.setState("shown")
}.bind(this),0)
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.deletePage.addEvent(Constants.CoreEvents.CLICK,this._onDelete);
this._skinParts.deletePage.getViewNode().setStyles({color:"#aa0000"});
this._skinParts.help.addEvent("click",this._showHelp);
this._skinParts.duplicate.addEvent(Constants.CoreEvents.CLICK,this._onDuplicateButtonClick);
this._currentPageId=this._data.get("id");
this._uriBeforeChanges=this.getDataItem().get("pageUriSEO");
this._pageNameBeforeChanges=this.getDataItem().get("title")
},_onDataChange:function(a){this.parent(a);
if(this._currentPageId!=this._data.get("id")){this._currentPageId=this._data.get("id");
this._uriBeforeChanges=this.getDataItem().get("pageUriSEO");
this._pageNameBeforeChanges=this.getDataItem().get("title")
}},_createFields:function(){var a=this;
this._previewComponent=W.Preview.getHtmlElement(this._data.get("id")).getLogic();
this.addLabel(this._translate("PAGE_SETTINGS_PAGE_NAME_AND_URL_LABEL"),null,"bold");
this.addInputField(this._translate("PAGE_SETTINGS_PAGE_NAME_LABEL"),null,1,Constants.Page.NAME_MAX_LENGTH).bindToField("title");
this.addInputField(this._translate("PAGE_SETTINGS_SEO_PAGE_URL_LABEL"),null,null,Constants.Page.URL_MAX_LENGTH,{validators:[a.inputValidators.pageNameCharactersValidator]},null,"Pages_Settings_Page_Address_ttid").bindToField("pageUriSEO").addEvent(Constants.CoreEvents.BLUR,this._validatePageUrlString);
if(!W.Preview.getPreviewManagers().Viewer.isHomePage()){this.addCheckBoxField(this._translate("PAGE_SETTINGS_HIDE_PAGE_LABEL"),"Page_Settings_Hide_from_menu_ttid").bindToField("hidePage")
}this.addBreakLine("20px");
this.addLabel(this._translate("PAGE_SETTINGS_SEO_SETTINGS_LABEL"),null,"bold");
this.addInputField(this._translate("PAGE_SETTINGS_SEO_PAGE_TITLE_LABEL"),null,null,Constants.Page.TITLE_SEO_MAX_LENGTH,null,null,"Pages_Settings_Page_Title_ttid").bindToField("pageTitleSEO");
this.addTextAreaField(this._translate("PAGE_SETTINGS_SEO_SITE_DESCRIPTION_LABEL"),"3em",null,Constants.Page.DESCRIPTION_SEO_MAX_LENGTH,null,null,"Pages_Settings_Page_Description_ttid").bindToField("descriptionSEO");
this.addInputField(this._translate("PAGE_SETTINGS_SEO_KEYWORDS_LABEL"),null,null,Constants.Page.KEYWORD_SEO_MAX_LENGTH,{validators:[this.inputValidators.numKeywordValidator]},null,"Pages_Settings_Keywords_ttid").bindToField("metaKeywordsSEO");
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_showHelp:function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","PAGE_SETTINGS_SUB_PANEL")
},_onSitePageChanged:function(a){if(!this._view.isCollapsed()){this.closePanel()
}},_onDelete:function(){this.injects().Commands.executeCommand("WEditorCommands.DeletePage",this._data);
this.closePanel()
},_onDuplicateButtonClick:function(){W.EditorDialogs.openInputDialog({title:W.Resources.get("EDITOR_LANGUAGE","INPUT_DIALOG_DUPLICATE_PAGE"),labelText:this._translate("DUPLICATE_PAGE_LABEL"),placeholderText:this._translate("DUPLICATE_PAGE_COPY_OF")+" "+this._data.get("title"),okCallback:function(c){var d=W.Preview.getPreviewManagers().Data.getDataByQuery("#MAIN_MENU");
var b=this._data.get("id");
var f=d.getItemByRefId("#"+b);
var a=d.getItemLevel(f)!=0;
var e;
if(a){e=d.getItemParent(f).get("refId")
}this.injects().Commands.executeCommand("WEditCommands.DuplicatePage",{pageHtmlId:b,newPageName:c,pageParent:e})
}.bind(this)})
},_validatePageUrlString:function(){var b=this.getDataItem().get("pageUriSEO");
var a=this.injects().Utils.convertToValidUrlPart(b);
if(a!=b){this.getDataItem().set("pageUriSEO",a);
this._uriBeforeChanges=a
}},closePanel:function(){this.injects().Commands.executeCommand(this._closeCommand)
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.PagesContainerPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_createStylePanel:function(c){var d;
if(!c||!(d=c.get("styleItems"))){return LOG.reportError(wixErrors.STYLES_DO_NOT_EXIST,this.className,"addComponentToContainer")
}var e=this.injects().Preview.getPreviewCurrentPageId();
var b=this.injects().Preview.getHtmlElement(e).getLogic();
var a=d[b.getOriginalClassName()];
if(a){this.addStyleSelector(a,b)
}},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.PagesPanel",skinParts:{siteMenu:{type:"wysiwyg.editor.components.panels.navigation.SiteNavigationEditor"},scrollableArea:{type:"htmlElement"},pageTransitionLabel:{type:"htmlElement",autoBindDictionary:"CHOOSE_TRANSITION"},transitionMenu:{type:"htmlElement",command:"WEditorCommands.PageTransition"},addPage:{type:"wysiwyg.editor.components.WButton",command:"WEditorCommands.AddPageDialog",autoBindDictionary:"ADD_PAGE_BUTTON",argObject:{iconSrc:"icons/top-bar-icons.png",spriteOffset:{x:"0",y:"-122px"}}},pageSettings:{type:"wysiwyg.editor.components.WButton",command:"this._pageSettingsCommand",autoBindDictionary:"PAGE_SETTINGS"},actions:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",_states:["normal","masterPageMode"],Binds:["_onTransitionsChanged","_onSitePageChanged"],initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey="PAGES_TITLE";
this._descriptionKey="PAGES_DESCRIPTION";
this._pageSettingsCommand=this.injects().Commands.createCommand("page settings");
this._pageSettingsCommand.registerListener(this,this._onPageSettings);
this.injects().Editor.addEvent(Constants.EditorEvents.SITE_PAGE_CHANGED,this._onSitePageChanged)
},_onAllSkinPartsReady:function(){this.collapse();
var b=function(d){this._transitionData=d;
this._buildTransitionMenu(d);
d.addEvent(Constants.DataEvents.DATA_CHANGED,this._onTransitionsChanged)
};
this.injects().Data.getDataByQuery("#PAGE_TRANSITIONS",b.bind(this));
var a=this.injects().Theme.getProperty("WEB_THEME_DIRECTORY")+"icons/property_panel_help_sprite.png";
var c=new Element("span",{html:"&nbsp;","class":"tooltipIcon",styles:{backgroundImage:"url("+a+")"}});
this._skinParts.pageTransitionLabel.grab(c,"after").setStyles({width:"80%",display:"inline"});
this._skinParts.siteMenu.setScrollArea(this._skinParts.scrollableArea);
this._addToolTipToSkinPart(c,"Pages_Page_Transistions_ttid")
},_onTransitionsChanged:function(){this._buildTransitionMenu(this._transitionData)
},_buildTransitionMenu:function(e){var b=this.injects().Resources;
var j=e.get("items");
var a=this._skinParts.transitionMenu;
a.empty();
var h;
if(!j||!(h=j.length)){return
}var c=false;
for(var f=0;
f<h;
++f){var d=j[f];
var g=new Element("option");
var k=b.get("EDITOR_LANGUAGE",d.langKey);
g.value=d.value;
g.set("html",k);
c=!!d.selected;
g.set("selected",c);
a.appendChild(g)
}},_onSitePageChanged:function(b){var a=W.Editor.getEditorUI().getCurrentSubPanel().panel;
if(a){a.closePanel();
this._onPageSettings("#"+b)
}},_onPageSettings:function(a){if(typeof a!="string"){a="#"+W.Preview.getPreviewManagers().Viewer.getCurrentPageId()
}if(a){this.injects().Commands.executeCommand("WEditorCommands.PageSettings",{pageId:a})
}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.PaginatedGridGalleryPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onPanelChange","_onCompPropChange"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var c=this._previewComponent.getComponentProperties()._schema;
var e=c.transDuration;
var b=c.autoplayInterval;
var d=c.bidirectional;
var a=this;
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addListEditorButton(W.Resources.get("EDITOR_LANGUAGE","GALLERY_ORGANIZE_PHOTOS"),this._data,"MatrixGallery")
});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","MATRIX_GALLERY_COLUMNS"),1,10,1,false,false).bindToProperty("numCols");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","MATRIX_GALLERY_ROWS"),1,10,1,false,false).bindToProperty("maxRows");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","GALLERY_MARGIN"),0,250,1,false,false).bindToProperty("margin")
});
this.addInputGroupField(function(){this.addComboBox(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_TRANSITIONS")).bindHooks(a._onPanelChange,a._onCompPropChange).bindToProperty("transition");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_DURATION"),e.minimum,e.maximum,0.1,false,true).bindHooks(a._onPanelChange,a._onCompPropChange).bindToProperty("transDuration")
});
this.addInputGroupField(function(){this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_AUTOPLAY")).bindToProperty("autoplay");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_INTERVAL"),b.minimum,b.maximum,0.1,false,true).bindToProperty("autoplayInterval");
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_SHOW_AUTOPLAY")).bindToProperty("showAutoplay")
});
this.addInputGroupField(function(){this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","GALLERY_EXPAND_MODE"),"Gallery_Settings_Expand_Mode_ttid").bindToProperty("expandEnabled");
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_SHOW_NAVIGATION")).bindToProperty("showNavigation")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_onPanelChange:function(a){setTimeout(this._previewComponent.next,250);
return a
},_onCompPropChange:function(a){return a
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.PayPalButtonPanel",traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel","_updateDetails","_loadDetails","_isBuyButton","_isDonateButton"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.setNumberOfItemsPerLine(1);
var c=this;
this._buttonType=this.addComboBox(this._translate("PAYPAL_BUTTON_TYPE")).bindToProperty("buttonType");
this.addInputGroupField(function(){c._merchantID=this.addInputField(this._translate("PAYPAL_MERCHANT_EMAIL"),"",0,100);
c._itemName=this.addInputField(this._translate("PAYPAL_ITEM_NAME"),"");
c._itemID=this.addInputField(this._translate("PAYPAL_ITEM_ID"),"");
c._organization=this.addInputField(this._translate("PAYPAL_ORG_NAME"),"",0,127);
c._organizationID=this.addInputField(this._translate("PAYPAL_ORG_ID"),"",0,127);
c._amount=this.addInputField(this._translate("PAYPAL_PRICE"),"",0,30);
this.addComboBoxField(this._translate("PAYPAL_CURRENCY"),W.Data.dataMap.CURRENCY_DATA._data,"USD").bindToProperty("currencyCode");
this.addButtonField("",this._translate("GENERAL_UPDATE"),false).runWhenReady(function(d){d.addEvent("click",c._updateDetails)
});
this.addVisibilityConditions([{ref:c._organization,predicate:c._isDonateButton},{ref:c._organizationID,predicate:c._isDonateButton},{ref:c._itemName,predicate:c._isBuyButton},{ref:c._itemID,predicate:c._isBuyButton}]);
c._loadDetails()
});
this.addComboBox(this._translate("PAYPAL_OPEN_IN")).bindToProperty("target");
this.addCheckBoxField(this._translate("PAYPAL_USE_SMALL_BUTTON")).bindToProperty("smallButton");
var b=function(d){return !d
};
var a=this.addCheckBoxField(this._translate("PAYPAL_HIDE_CREDIT_CARD_LOGOS")).bindToProperty("showCreditCards").bindHooks(b,b);
this.addVisibilityCondition(a,function(){return(!this._previewComponent.getComponentProperty("smallButton"))
}.bind(this))
},_loadDetails:function(){this._merchantID.setValue(this._data.get("merchantID"));
this._itemName.setValue(this._previewComponent.getComponentProperty("itemName"));
this._itemID.setValue(this._previewComponent.getComponentProperty("itemID"));
this._organization.setValue(this._previewComponent.getComponentProperty("organizationName"));
this._organizationID.setValue(this._previewComponent.getComponentProperty("organizationID"));
this._amount.setValue(this._previewComponent.getComponentProperty("amount"))
},_updateDetails:function(){var d=this._merchantID.getValue();
var c=this._amount.getValue();
var b=W.Utils.isValidEmail(d);
var a=W.Utils.isNumber(c);
if(!b){this._merchantID.showValidationMessage(this.injects().Resources.getCur("LINK_DLG_BAD_EMAIL"))
}if(!a){this._amount.showValidationMessage(this.injects().Resources.getCur("NOT_A_NUMBER"))
}else{if(c<0){this._amount.showValidationMessage(this.injects().Resources.getCur("NEGATIVE_NUMBER"))
}}if(b&&a){this._merchantID.resetInvalidState();
this._amount.resetInvalidState();
this._data.set("merchantID",d);
this._previewComponent.setComponentProperty("amount",c.replace("+",""));
this._previewComponent.setComponentProperty("itemName",this._itemName.getValue());
this._previewComponent.setComponentProperty("itemID",this._itemID.getValue());
this._previewComponent.setComponentProperty("organizationName",this._organization.getValue());
this._previewComponent.setComponentProperty("organizationID",this._organizationID.getValue())
}},_isBuyButton:function(){return(this._previewComponent.getComponentProperty("buttonType")=="buy")
},_isDonateButton:function(){return(this._previewComponent.getComponentProperty("buttonType")=="donate")
},getAcceptableDataTypes:function(){return["PayPalButton"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SEOPanel",imports:["wysiwyg.editor.utils.InputValidators"],skinParts:{panelLabel:{type:"htmlElement",autoBindDictionary:"SEO_TITLE"},help:{type:"htmlElement"},close:{type:"htmlElement",command:"this._closeCommand"},doneButton:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"done",command:"this._closeCommand"},content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SettingsSubPanel",Binds:[],initialize:function(d,a,c){this.parent(d,a,c);
var b=new this.imports.InputValidators();
this._charactersValidator=b.charactersValidator
},_createFields:function(){this.addTitle(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_TITLE_FULL"),null,"bold");
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_DESCRIPTION"));
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_ALLOW_SE_FIND_MY_SITE")).bindToField("allowSEFindSite").addEvent("inputChanged",this._seoChecked);
this.addInputField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_SITE_TITLE_LABEL"),"",undefined,Constants.Page.TITLE_SEO_MAX_LENGTH,{validators:[this._charactersValidator]},null,"Settings_SEO_Site_Title_ttid").bindToField("siteTitleSEO");
this.addTextAreaField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_SITE_DESCRIPTION_LABEL"),null,null,Constants.Page.DESCRIPTION_SEO_MAX_LENGTH,{validators:[this._charactersValidator]},null,"Settings_SEO_Site_Description_ttid").bindToField("siteDescriptionSEO");
this.addInputField(W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_KEYWORD_LABEL"),"",undefined,Constants.Page.KEYWORD_SEO_MAX_LENGTH,{validators:[this._charactersValidator]},null,"Settings_SEO_Keywords_ttid").bindToField("keywordsSEO");
this.addButtonField("",W.Resources.get("EDITOR_LANGUAGE","SEO_PANEL_LEARN_MORE")).addEvent("click",this._showHelp)
},_showHelp:function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","SETTINGS_SUB_PANEL_SEO")
},_seoChecked:function(a){if(a.value){LOG.reportEvent(wixEvents.SEO_CHECKED_IN_SEO_PANEL)
}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SettingsPanel",skinParts:{scrollableArea:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SideContentPanel",_panelName:"SETTINGS_PANEL_TITLE",initialize:function(c,a,b){this.parent(c,a,b);
this._appType=this.injects().Config.getApplicationType();
this._titleKey="SETTINGS_PANEL_TITLE";
this._descriptionKey=this._appType==Constants.WEditManager.SITE_TYPE_WEB?"SETTINGS_PANEL_DESCRIPTION":"SETTINGS_PANEL_DESCRIPTION_FB_MODE"
},render:function(){this.parent();
this._skinParts.scrollableArea.setStyle("height","400px")
},_createFields:function(){var b=this._appType==Constants.WEditManager.SITE_TYPE_WEB?"#SETTINGS_PANEL":"#SETTINGS_PANEL_FB_MODE";
var a=this.addSelectionListInputFieldWithDataProvider(null,b,{repeatersSelectable:true},{type:"wysiwyg.editor.components.WButton",skin:"wysiwyg.editor.skins.buttons.ButtonMenuSkin",numRepeatersInLine:1});
a.runWhenReady(function(c){this._contentComp=c
}.bind(this));
this.addEvent("subMenuCloses",function(){this._contentComp.fireEvent("subMenuCloses")
}.bind(this))
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SettingsSubPanel",imports:[],skinParts:{panelLabel:{type:"htmlElement"},help:{type:"htmlElement"},close:{type:"htmlElement",command:"this._closeCommand"},doneButton:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"done",command:"this._closeCommand"},topBar:{type:"htmlElement"},bottom:{type:"htmlElement"},content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._closeCommand=b.closeCommand
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.help.addEvent("click",this._showHelp)
},_createFields:function(){},_showHelp:function(){},getAcceptableDataTypes:function(){return["SiteSettings"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SideContentPanel",skinParts:{content:{type:"htmlElement"},scrollableArea:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],_panelName:"",_containerPanel:null,initialize:function(c,a,b){this.parent(c,a,b);
this._titleKey=this._descriptionKey="EMPTY"
},_onAllSkinPartsReady:function(){this.parent();
this._skinParts.scrollableArea.addEvent(Constants.CoreEvents.MOUSE_WHEEL,this.injects().Utils.stopMouseWheelPropagation)
},hide:function(){this.fireEvent(Constants.EditorUI.PANEL_CLOSING,this)
},setContainerPanel:function(a){this._containerPanel=a;
this._containerPanel.addEvent("resize",function(b){this.fireEvent("resize",b)
}.bind(this))
},getPanelHeight:function(){return this._containerPanel.getPanelHeight()
},getTitle:function(){this._category?this._title="ADD_COMP_TITLE_"+this._category:this._title=this._titleKey;
this._title=this.injects().Resources.get("EDITOR_LANGUAGE",this._title);
return this._title
},getDescription:function(){this._category?this._description="ADD_COMP_DESC_"+this._category:this._description=this._descriptionKey;
this._description=this.injects().Resources.get("EDITOR_LANGUAGE",this._description);
return this._description
},getHelplet:function(){var c=this.$className&&this.$className.split(".").getLast();
var a=this._category?"_"+this._category:"";
var b="SIDE_PANEL_"+c+a;
if(!W.Data.dataMap.HELP_IDS._data[b]){b=undefined
}return b
},tryClose:function(a){a.execute()
},cancel:function(a){a.execute()
},resizeContentArea:function(a){if(this._skinParts.scrollableArea){this._skinParts.scrollableArea.setStyle("max-height",a+"px")
}},getName:function(){if(this._panelName){return this.injects().Resources.get("EDITOR_LANGUAGE",this._panelName)
}return""
},getActionsHeight:function(){if(this._skinParts&&this._skinParts.actions){this._actionsHeight=this._skinParts.actions.getSize().y;
return this._actionsHeight
}return 0
},canCancel:function(){return false
},canGoBack:function(){return false
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SiteNamePanel",imports:[],skinParts:{panelLabel:{type:"htmlElement",autoBindDictionary:"SITE_NAME"},help:{type:"htmlElement"},close:{type:"htmlElement",command:"this._closeCommand"},doneButton:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"done",command:"this._closeCommand"},content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SettingsSubPanel",Binds:[],_states:["SiteNamePanel"],initialize:function(c,a,b){this.parent(c,a,b);
this.setState("SiteNamePanel");
this._editorStatusAPI=this.injects().Editor.getEditorStatusAPI();
this._appType=this.injects().Config.getApplicationType()
},_getStates:function(){this._states={isPremium:this.injects().Config.isPremiumUser(),isSaved:!this.injects().Config.siteNeverSavedBefore()};
return this._states
},_createFields:function(){if(this._appType==Constants.WEditManager.SITE_TYPE_WEB){this._addPanelHeader()
}this._addPanelContent();
this._addManageDomainsButton();
this._addPremiumLabel()
},_showHelp:function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","SETTINGS_SUB_PANEL_SiteName")
},_addPanelHeader:function(){this.addTitle(this._translate("SITE_NAME_TITLE_FULL"),null,"bold");
this.addSubLabel(this._translate("SITE_NAME_DESCRIPTION"),null)
},_addPanelContent:function(){var a=this._getStates();
if(!a.isSaved){this._contentLabel=this._translate("SITE_NAME_SITE_ADDRESS_DESCRIPTION_BEFORE_SAVE");
this._contentSublabel=this.injects().Config.getUserPublicUrl()+"/"+this._translate("SITE_NAME_LITERALLY")
}else{this._contentLabel=this._translate("SITE_NAME_SITE_ADDRESS_LABEL_BEFORE_PUBLISH");
this._contentSublabel=this.injects().Config.getUserPublicUrl()
}this.addLabel(this._contentLabel,null,"bold");
if(this._editorStatusAPI.isPreviouslyPublished()){this.addInlineTextLinkField(null,null,this._contentSublabel,null,null,null,null).addEvent("click",this._gotoSiteUrl)
}else{this.addSubLabel(this._contentSublabel)
}},_gotoSiteUrl:function(){window.open(this.injects().Config.getUserPublicUrl(),"blank")
},_addPremiumLabel:function(){var a=this._getStates();
if(a.isPremium){this._template="premiumSlogan";
this._callback=this._onUpgradeClick;
this._label=this._translate("SITE_NAME_WIX_UPGRADE_AD_VOUCHERS");
this._action=this._translate("SITE_NAME_SWITCH_TO_YEARLY_PLAN")
}else{this._template="slogan";
this._callback=this._onManageYourDomainClick;
this._label=this._appType==Constants.WEditManager.SITE_TYPE_WEB?this._translate("SITE_NAME_CONNECT_THIS_DOMAIN"):this._translate("SITE_NAME_REMOVE_ADS");
this._action=this._translate("SITE_NAME_CLICK_HERE")
}this.addInlineTextLinkField(null,this._label,this._action,null,null,null,this._template).addEvent("click",this._callback)
},_addManageDomainsButton:function(){if(this._getStates().isPremium){this.addButtonField(this._translate("SITE_NAME_CONNECT_THIS_DOMAIN"),this._translate("SITE_NAME_MANAGE_DOMAINS")).addEvent(Constants.CoreEvents.CLICK,this._onManageYourDomainClick);
this.addSubLabel(this._translate("SITE_NAME_MANAGE_DOMAIN_NOTE"),null)
}},_onUpgradeClick:function(){this.injects().Commands.executeCommand("WEditorCommands.UpgradeToPremium",{referralAdditionalInfo:Constants.WEditManager.UPGRADE_SRC.SITE_NAME_PANEL})
},_onManageYourDomainClick:function(){this.injects().Commands.executeCommand("WEditorCommands.ManageDomain")
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SlideShowGalleryPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_onPanelChange","_onCompPropChange","_onImageModeChange"],_createFields:function(){var c=this._previewComponent.getComponentProperties()._schema;
var e=c.transDuration;
var b=c.autoplayInterval;
var d=c.bidirectional;
var a=this;
this.addInputGroupField(function(){this.addListEditorButton(W.Resources.get("EDITOR_LANGUAGE","GALLERY_ORGANIZE_PHOTOS"),this._data,"SlideShowGallery");
this.addComboBox(W.Resources.get("EDITOR_LANGUAGE","GALLERY_IMAGE_MODE"),"Gallery_Settings_Image_Scaling_ttid").bindHooks(a._onImageModeChange,a._onCompPropChange).bindToProperty("imageMode")
});
this.addInputGroupField(function(){this.addComboBox(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_TRANSITIONS")).bindHooks(a._onPanelChange,a._onCompPropChange).bindToProperty("transition");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_DURATION"),e.minimum,e.maximum,0.1,false,true).bindHooks(a._onPanelChange,a._onCompPropChange).bindToProperty("transDuration");
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_REVERSE")).bindHooks(a._onPanelChange,a._onCompPropChange).bindToProperty("reverse")
});
this.addInputGroupField(function(){this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_AUTOPLAY")).bindToProperty("autoplay");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_INTERVAL"),b.minimum,b.maximum,0.1,false,true).bindToProperty("autoplayInterval");
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_SHOW_AUTOPLAY")).bindToProperty("showAutoplay")
});
this.addInputGroupField(function(){this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","GALLERY_EXPAND_MODE"),"Gallery_Settings_Expand_Mode_ttid").bindToProperty("expandEnabled");
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDESHOW_GALLERY_SHOW_NAVIGATION")).bindToProperty("showNavigation")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_onPanelChange:function(a){setTimeout(this._previewComponent.gotoNext,250);
return a
},_onImageModeChange:function(a){setTimeout(function(){this.injects().Editor.setSelectedComp(this._previewComponent,false)
}.bind(this),250);
return a
},_onCompPropChange:function(a){return a
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SliderGalleryPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],_createFields:function(){var a=this._previewComponent.getComponentProperties()._schema;
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addListEditorButton(W.Resources.get("EDITOR_LANGUAGE","GALLERY_ORGANIZE_PHOTOS"),this._data,"SliderGallery")
});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addComboBox(W.Resources.get("EDITOR_LANGUAGE","GALLERY_IMAGE_MODE"),"Gallery_Settings_Image_Scaling_ttid").bindToProperty("imageMode");
var b="radiobuttons/aspRatio/radio_button_states.png";
var e={w:"46px",h:"52px"};
var d={options:[{value:"16:9",image:b,dimensions:e,icon:"radiobuttons/aspRatio/16-9.png"},{value:"4:3",image:b,dimensions:e,icon:"radiobuttons/aspRatio/4-3.png"},{value:"1:1",image:b,dimensions:e,icon:"radiobuttons/aspRatio/1-1.png"},{value:"3:4",image:b,dimensions:e,icon:"radiobuttons/aspRatio/3-4.png"},{value:"9:16",image:b,dimensions:e,icon:"radiobuttons/aspRatio/9-16.png"}],display:"inline",defaultValue:"",group:""};
var c=this.addRadioImagesField(W.Resources.get("EDITOR_LANGUAGE","SLIDER_GALLERY_ASPECT_RATIO"),d.options,d.defaultValue,d.group,d.display).bindToProperty("aspectRatioPreset");
this.addVisibilityCondition(c,function(){return this._previewComponent.getComponentProperty("imageMode")=="clipImage"
}.bind(this))
});
this.addInputGroupField(function(){this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","GALLERY_MARGIN"),0,250,1,false,false).bindToProperty("margin");
this.addSliderField(W.Resources.get("EDITOR_LANGUAGE","SLIDER_GALLERY_SPEED"),1,30,1,false,true).bindToProperty("maxSpeed");
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","SLIDER_GALLERY_LOOP")).bindToProperty("loop")
});
this.addInputGroupField(function(){this.setNumberOfItemsPerLine(1);
this.addCheckBoxField(W.Resources.get("EDITOR_LANGUAGE","GALLERY_EXPAND_MODE"),"Gallery_Settings_Expand_Mode_ttid").bindToProperty("expandEnabled")
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.SoundCloudWidgetPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_extractURLFromEmbed"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this;
this.addInputGroupField(function(){this.addSubmitInputField(this._translate("SOUNDCLOUD_EMBED_TITLE"),this._translate("SOUNDCLOUD_EMBED_PH"),0,1024,this._translate("SOUNDCLOUD_UPDATE"),null,{validators:[a._extractURLFromEmbed]},null,"SoundCloud_Embed_Code_ttid");
this.addCheckBoxField(this._translate("SOUNDCLOUD_SHOW_ARTWORK")).bindToField("showArtWork");
this.addCheckBoxField(this._translate("SOUNDCLOUD_AUTOPLAY")).bindToField("autoPlay")
})
},_extractURLFromEmbed:function(b){var c=false;
var a=this.validateEmbed(b);
if(a!=undefined&&a!=""){c=true
}if(c){this._data.set("url",a);
return""
}else{return this._translate("SOUNDCLOUD_INVALID_EMBED_CODE")
}},validateEmbed:function(d){var c;
var a;
var b="http://w.soundcloud.com/player/?url=";
if(/^<iframe.*<\/iframe>\s*$/.test(d)){if(d.indexOf("http://w.soundcloud.com/player/")!=-1){a=/src=[\"\']([^'"]*)[\"\']/.exec(d);
if(a){c=a[1]
}}}else{if(/^<object.*<\/span>\s*$/.test(d)){if(d.indexOf("https://player.soundcloud.com/player.swf")!=-1){a=/src=[\"\']([^'"]*)[\"\']/.exec(d);
if(a){a=/url=(.*)/.exec(a[1]);
if(a){c=b+a[1]
}}}}}return c
},getAcceptableDataTypes:function(){return["SoundCloudWidget"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.StaticPalettePanel",imports:[],skinParts:{label:{type:"htmlElement"},colors:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.Button",Binds:[],initialize:function(c,a,b){this.parent(c,a,b);
b=b||{};
this._paletteName=b.paletteName;
this._colors=Object.filter(b,function(e,d){return d!="paletteName"&&d!="type"&&d!="paletteTags"
});
this._colorHeight=b.height||"100%"
},render:function(){this._skinParts.label.set("text",this._paletteName);
this._colorsCount=5;
this._addColor(this._colors.color_13);
this._addColor(this._colors.color_19);
this._addColor(this._colors.color_23);
this._addColor(this._colors.color_29);
this._addColor(this._colors.color_33)
},getColors:function(){return this._colors
},_onDataChange:function(){},_addColor:function(a){var b=new Element("div",{styles:{display:"inline-block","background-color":a,height:this._colorHeight,width:100/this._colorsCount+"%"}});
this._skinParts.colors.adopt(b)
},getAcceptableDataTypes:function(){return["","list"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.StatisticsPanel",imports:[],skinParts:{panelLabel:{type:"htmlElement",autoBindDictionary:"STATISTICS_TITLE"},help:{type:"htmlElement"},close:{type:"htmlElement",command:"this._closeCommand"},doneButton:{type:"wysiwyg.editor.components.WButton",autoBindDictionary:"done",command:"this._closeCommand"},content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.SettingsSubPanel",Binds:["_onClose"],initialize:function(c,a,b){this.parent(c,a,b);
this._isPremiumUser=this.injects().Config.isPremiumUser()
},_createFields:function(){this.addTitle(W.Resources.get("EDITOR_LANGUAGE","STATISTICS_PANEL_TITLE_FULL"),null,"bold");
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","STATISTICS_PANEL_DESCRIPTION"),null);
this.addBreakLine("20px");
this._isPremiumUser?this._siteHasDomain():this._createFreeNoDomain()
},_createFreeNoDomain:function(){this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","THIS_IS_PREMIUM_FEATURE"),null);
this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","UPGRADE"),null);
this.addButtonField("",W.Resources.get("EDITOR_LANGUAGE","UPGRADE_BUTTON")).addEvent("click",this._upgrade)
},_siteHasDomain:function(){this.addSubLabel(W.Resources.get("EDITOR_LANGUAGE","SET_ANALYTICS"),null);
var a=this.injects().Config.getUserDomainListUrl();
var b=W.Resources.get("EDITOR_LANGUAGE","SET_ANALYTICS_BUTTON");
this.addSubLabel('<a target="_blank" class="selectable" href="'+a+'">'+b+"</a>",null)
},_showHelp:function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog","SETTINGS_SUB_PANEL_Statistics")
},_onClose:function(){this.injects().Commands.executeCommand(this._closeCommand)
},_upgrade:function(){this.injects().Commands.executeCommand("WEditorCommands.UpgradeToPremium",{referralAdditionalInfo:Constants.WEditManager.UPGRADE_SRC.STATISTICS_PANEL})
},getAcceptableDataTypes:function(){return["SiteSettings"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.TwitterFeedPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_userValidationMessage"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var b=[this._userValidationMessage];
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel);
var a=this._translate("TWITTER_USER_TO_FOLLOW_PLACEHOLDER");
this.addInputGroupField(function(){this.addSubmitInputField(this._translate("TWITTER_USER"),a,null,null,this._translate("GENERAL_UPDATE"),null,{validators:b},null,"Twitter_Settings_Username_ttid").bindToField("accountToFollow");
this.addSliderField(this._translate("TWITTER_FEED_NUMBER_OF_TWEETS"),1,30,1,false,true).bindToProperty("numOfTweets")
})
},_createStylePanel:function(b){var c;
if(!b||!(c=b.get("styleItems"))){return W.Utils.debugTrace("WEditor: missing component data or data list")
}var a=c[this._previewComponent.className];
if(a){this.addStyleSelector(a)
}},_userValidationMessage:function(a){if(!this.injects().Utils.isValidTwitterUser(a)){return this._translate("TWITTER_USER_VAL_ERR")
}},getAcceptableDataTypes:function(){return["TwitterFollow"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.TwitterFollowPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_userValidationMessage"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this._translate("TWITTER_USER_TO_FOLLOW_PLACEHOLDER");
this.addSubmitInputField(this._translate("TWITTER_USER"),a,1,15,this._translate("GENERAL_UPDATE"),null,{validators:[this._userValidationMessage]},null,"Twitter_Settings_Username_ttid").bindToField("accountToFollow");
this.addCheckBoxField(this._translate("TWITTER_FOLLOW_DISPLAY_TOTAL_FOLLOWERS")).bindToProperty("showCount");
this.addCheckBoxField(this._translate("TWITTER_FOLLOW_DISPLAY_TWITTER_HANDLE")).bindToProperty("showScreenName")
},_userValidationMessage:function(a){if(!this.injects().Utils.isValidTwitterUser(a)){return this._translate("TWITTER_USER_VAL_ERR")
}},getAcceptableDataTypes:function(){return["TwitterFollow"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.TwitterTweetPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_updateTwitterDetails","_userValidationMessage"],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var a=this;
this.addInputGroupField(function(){var b=this._translate("TWITTER_USER_TO_FOLLOW_PLACEHOLDER");
this.addInputField(this._translate("TWITTER_USER"),b,0,15,null,null,"Twitter_Link_Button_Twitter_Username_ttid").runWhenReady(function(c){c.setValue(a._data.get("accountToFollow"));
a._inUserName=c
});
this.addInputField(this._translate("TWITTER_TWEET_TWEET_TEXT"),this._translate("TWITTER_TWEET_TWEET_DEF_TEXT"),0,140,null,null,"Twitter_Link_Button_Tweet_Text_ttid").runWhenReady(function(c){c.setValue(a._data.get("defaultText"));
a._inDefText=c
});
this.addButtonField("",this._translate("GENERAL_UPDATE"),false).runWhenReady(function(c){c.addEvent("click",a._updateTwitterDetails)
})
});
this.addComboBox(this._translate("TWITTER_TWEET_BUTTON_STYLE")).bindToProperty("dataCount")
},_updateTwitterDetails:function(){var a=this._inUserName.getValue();
var b=this._userValidationMessage(a);
if(b){this._inUserName.showValidationMessage(b)
}else{this._inUserName.resetInvalidState();
this._data.set("accountToFollow",a);
this._data.set("defaultText",this._inDefText.getValue())
}},_userValidationMessage:function(a){if(!a||a==""){return
}if(!this.injects().Utils.isValidTwitterUser(a)){return this._translate("TWITTER_USER_VAL_ERR")
}},getAcceptableDataTypes:function(){return["TwitterTweet"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.VideoPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_getVideoDataFromVideoUrl","_getVideoUrlFromVideoData","_videoUrlValidationMessage"],_videoUrl:{YOUTUBE:"http://youtu.be/",VIMEO:"http://vimeo.com/"},initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){var b=[this._videoUrlValidationMessage];
var a=this;
this.addInputGroupField(function(){this.addSubmitInputField(this._translate("VIDEO_URL"),this._translate("VIDEO_URL_PLACE_HOLDER"),null,null,this._translate("GENERAL_UPDATE"),null,{validators:b}).bindToFields(["videoId","videoType"]).bindHooks(a._getVideoDataFromVideoUrl,a._getVideoUrlFromVideoData);
var d=this.addComboBox(this._translate("VIDEO_PLAYER_CONTROLS")).bindToProperty("showControls");
var e=this.addCheckBoxField(this._translate("VIDEO_PLAYER_AUTO_PLAY")).bindToProperty("autoplay");
this.addCheckBoxField(this._translate("VIDEO_PLAYER_LOOP")).bindToProperty("loop");
this.addCheckBoxField(this._translate("VIDEO_TITLE")).bindToProperty("showinfo");
var c=this.addCheckBoxField(this._translate("VIDEO_PLAYER_LIGHT_THEME")).bindToProperty("lightTheme");
this.addVisibilityConditions([{ref:c,predicate:function(){return(a._getVideoType()=="YOUTUBE")
}},{ref:d,predicate:function(){return(a._getVideoType()=="YOUTUBE")
}},{ref:e,predicate:function(){return !this.injects().Config.isFacebookSite()
}.bind(this)}])
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},_getVideoType:function(){return this._data&&this._data.get("videoType")
},_videoUrlValidationMessage:function(b){var c=W.Utils.isValidUrl(b);
var a=this._getYoutubeId(b)||this._getVimeoId(b);
if(c&&a){return false
}return this._translate("VIDEO_VALIDATION_ERR")
},_getYoutubeId:function(c){var d="";
var a=/(?:youtube\.com\/watch[^\s]*[\?&]v=)([\w-]+)/g;
var e=/(?:youtu\.be\/)([\w-]+)/g;
var b=a.exec(c)||e.exec(c);
if(b&&b.length&&b[1]){d=b[1]
}return d
},_getVimeoId:function(c){var d="";
var a=/vimeo\.com\/(\d+)$/gi;
var b=a.exec(c);
if(b&&b.length&&b[1]){d=b[1]
}return d
},_getVideoDataFromVideoUrl:function(a){var b=null;
var c=this._getYoutubeId(a);
if(c){b="YOUTUBE"
}else{c=this._getVimeoId(a);
if(c){b="VIMEO"
}}if(c&&b){return{videoId:c,videoType:b}
}else{return{}
}},_getVideoUrlFromVideoData:function(a){var c=a.videoId;
var b=a.videoType;
if(!c||!b){return""
}return this._videoUrl[b]+c
},getAcceptableDataTypes:function(){return["Video"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.WGalleryPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.addListEditorButton("Manage Photos",this._data)
},getAcceptableDataTypes:function(){return["ImageList"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.WPhotoMenuPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_createStylePanel"],initialize:function(c,a,b){this.parent(c,a,b);
this._galleryConfigName=b.galleryConfigName||"photos"
},_createFields:function(){var a=this;
this.addInputGroupField(function(){var c;
var b=function(d){if(d=="fitWidth"&&a._previewComponent.getHorizontalGroup()){c.setValue("fill");
return"fill"
}return d
};
this.addImageField(null,null,null,this.injects().Resources.get("EDITOR_LANGUAGE","PHOTO_REPLACE_IMAGE"),a._galleryConfigName,false).bindToDataItem(this._data);
c=this.addComboBox(this.injects().Resources.get("EDITOR_LANGUAGE","PHOTO_IMAGE_MODE"),"Image_Settings_Image_Scaling_ttid").bindToProperty("displayMode").bindHooks(b)
});
this.addInputGroupField(function(){this.addInputField(this.injects().Resources.get("EDITOR_LANGUAGE","PHOTO_TITLE"),null,null,100,null,null,"Image_Settings_Title_ttid").bindToField("title");
this.addInputField(this.injects().Resources.get("EDITOR_LANGUAGE","PHOTO_ALT_TEXT"),null,null,256,null,null,"Image_Settings_Alt_Text_ttid").bindToField("alt")
});
this.addInputGroupField(function(){var b=this.injects().Resources.get("EDITOR_LANGUAGE","LINK_LINK_TO");
var c="http://www.wix.com";
this.addLinkField(b,c).bindToDataItem(this.getDataItem())
});
this.injects().Data.getDataByQuery("#STYLES",this._createStylePanel)
},getAcceptableDataTypes:function(){return["Image"]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.WRichTextPanel",imports:[],traits:["mobile.editor.components.traits.DataPanel"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:[],initialize:function(c,a,b){this.parent(c,a,b)
},_createFields:function(){this.addInputGroupField(function(){this.addButtonField(null,this._translate("EDIT_RICH_TEXT")).addEvent(Constants.CoreEvents.CLICK,function(){this.injects().Commands.executeCommand(Constants.EditorUI.START_EDIT_RICH_TEXT)
})
})
},getAcceptableDataTypes:function(){return["RichText","Text"]
}}});
Constants.AutoPanel={ALL_INLINE:0,ALL_BLOCK:1,INLINE_CLASS:"inline-component",GROUP_CLASS:"inline-component-group",COMPONENT_CLASS:"autopanel-component",BREAK:null,Skins:{DEFAULT:{Title:{"default":"wysiwyg.editor.skins.inputs.TitleSkin",bold:"wysiwyg.editor.skins.inputs.LabelBoldSkin"},Label:{"default":"wysiwyg.editor.skins.inputs.LabelSkin",bold:"wysiwyg.editor.skins.inputs.LabelBoldSkin"},SubLabel:{"default":"wysiwyg.editor.skins.inputs.SubLabelSkin",small:"wysiwyg.editor.skins.inputs.SubLabelSkinSmall",bold:"wysiwyg.editor.skins.inputs.SubLabelSkinBold",upgrade:"wysiwyg.editor.skins.inputs.SubLabelLeftSkin"},ButtonInput:{"default":"wysiwyg.editor.skins.inputs.button.ButtonInputSkin",smaller:"wysiwyg.editor.skins.inputs.button.ButtonInputSmallerSkin",withArrow:"wysiwyg.editor.skins.inputs.button.ButtonInputArrowSkin",blueWithArrow:"wysiwyg.editor.skins.inputs.button.ButtonInputBlueArrowSkin",blue:"wysiwyg.editor.skins.inputs.button.ButtonInputBlueSkin",action:"wysiwyg.editor.skins.inputs.button.ButtonInputActionSkin",facebook:"wysiwyg.editor.skins.inputs.button.ButtonInputFacebookSkin",twitter:"wysiwyg.editor.skins.inputs.button.ButtonInputTwitterSkin",upgrade:"wysiwyg.editor.skins.inputs.button.ButtonInputUpgradeSkin",blueSmaller:"wysiwyg.editor.skins.inputs.button.ButtonInputBlueSmallerSkin",link:"wysiwyg.editor.skins.inputs.button.ButtonInputLinkSkin",linkRight:"wysiwyg.editor.skins.inputs.button.ButtonInputLinkRightSkin",linkLeft:"wysiwyg.editor.skins.inputs.button.ButtonInputLinkLeftSkin",alignButton:"wysiwyg.editor.skins.inputs.button.ButtonInputAlignSkin",mainBarEditActions:"wysiwyg.editor.skins.inputs.button.ButtonInputMainBarEditSkin",mainBarDocActions:"wysiwyg.editor.skins.inputs.button.ButtonInputMainBarDocSkin",mainBarHelpIcon:"wysiwyg.editor.skins.inputs.button.ButtonInputMainBarHelpSkin"},InlineTextLinkInput:{"default":"wysiwyg.editor.skins.inputs.InlineTextLinkInputSkin",floating:"wysiwyg.editor.skins.inputs.InlineTextLinkFloatingSkin",slogan:"wysiwyg.editor.skins.inputs.InlineTextLinkSloganSkin",premiumSlogan:"wysiwyg.editor.skins.inputs.InlineTextLinkPremiumSloganSkin"},ListEditorButton:"wysiwyg.editor.skins.inputs.button.ButtonInputBlueArrowSkin",InputGroup:{"default":"wysiwyg.editor.skins.inputs.InputGroupSkin",skinless:"wysiwyg.editor.skins.inputs.InputGroupSkinlessSkin",menus:"wysiwyg.editor.skins.inputs.InputGroupMenusSkin"},ComboBox:"wysiwyg.editor.skins.inputs.ComboBoxSkin",SelectionListInput:{"default":"wysiwyg.editor.skins.inputs.SelectionListInputSkin",imagesList:"wysiwyg.editor.skins.inputs.SelectionListImagesSkin"},RadioButton:"wysiwyg.editor.skins.inputs.RadioButtonSkin",RadioImage:"wysiwyg.editor.skins.inputs.RadioImageSkin",RadioButtons:"wysiwyg.editor.skins.inputs.RadioButtonsSkin",RadioImages:"wysiwyg.editor.skins.inputs.RadioImagesSkin",Input:{"default":"wysiwyg.editor.skins.inputs.InputSkin",floating:"wysiwyg.editor.skins.inputs.InputFloatingSkin"},Link:"wysiwyg.editor.skins.inputs.InputSkin",SubmitInput:"wysiwyg.editor.skins.inputs.SubmitInputSkin",SubmitTextArea:"wysiwyg.editor.skins.inputs.SubmitTextAreaSkin",TextArea:"wysiwyg.editor.skins.inputs.TextAreaSkin",Slider:"wysiwyg.editor.skins.inputs.SliderSkin",CheckBox:"wysiwyg.editor.skins.inputs.CheckBoxSkin",CheckBoxImage:"wysiwyg.editor.skins.inputs.CheckBoxImageSkin",ImageInput:{"default":"wysiwyg.editor.skins.inputs.ImageInputSkin",organizeBlueAction:"wysiwyg.editor.skins.inputs.ImageInputSkin",gallery:"wysiwyg.editor.skins.inputs.ImageInputForGallerySkin"},FlashInput:{"default":"wysiwyg.editor.skins.inputs.ImageInputSkin",organizeBlueAction:"wysiwyg.editor.skins.inputs.ImageInputSkin"},DocInput:"wysiwyg.editor.skins.inputs.DocInputSkin",ColorInput:{"default":"wysiwyg.editor.skins.inputs.ColorInputSkin",small:"wysiwyg.editor.skins.inputs.ColorInputSmallSkin",narrow:"wysiwyg.editor.skins.inputs.ColorInputNarrowSkin"},ColorGroup:"wysiwyg.editor.skins.inputs.ColorGroupSkin",ColorSelectorField:"wysiwyg.editor.skins.inputs.ColorSelectorFieldSkin",ColorSelectorButton:"wysiwyg.editor.skins.inputs.ColorSelectorButtonFieldSkin",FontSelectorField:"wysiwyg.editor.skins.inputs.font.FontSelectorFieldSkin",BgScroll:"wysiwyg.editor.skins.inputs.bg.BgScrollSkin",BgAlign:"wysiwyg.editor.skins.inputs.bg.BgAlignSkin",BgTile:"wysiwyg.editor.skins.inputs.bg.BgTileSkin",BgColor:"wysiwyg.editor.skins.inputs.bg.BgColorSkin",BgImage:"wysiwyg.editor.skins.inputs.bg.BgImageSkin",FontButton:"wysiwyg.editor.skins.inputs.button.FontButtonInputSkin",FontColor:"wysiwyg.editor.skins.inputs.font.FontColorSkin",FontSize:"wysiwyg.editor.skins.inputs.font.FontSizeSkin",FontStyle:"wysiwyg.editor.skins.inputs.font.FontStyleSkin",FontFamily:"wysiwyg.editor.skins.inputs.font.FontFamilySkin",BoxShadow:"wysiwyg.editor.skins.inputs.BoxShadowInputSkin",BorderRadius:"wysiwyg.editor.skins.inputs.BorderRadiusInputSkin"},FLOATING_DIALOG:{Extends:"DEFAULT",ButtonInput:{"default":"wysiwyg.editor.skins.inputs.button.FloatingDialogButtonInputSkin",upgrade:"wysiwyg.editor.skins.inputs.button.ButtonInputUpgradeSkin"},Label:"wysiwyg.editor.skins.inputs.FloatingDialogTitleSkin",SubLabel:"wysiwyg.editor.skins.inputs.FloatingDialogDescriptionSkin"}}};
W.Components.newComponent({name:"wysiwyg.editor.components.panels.base.AutoPanel",imports:["wysiwyg.editor.components.panels.base.InputFieldProxy"],skinParts:{content:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_createStylePanel","_showContentIfReady"],initialize:function(c,a,b){b=b||{};
this.parent(c,a,b);
this._inlineItemsPerLine=Constants.AutoPanel.ALL_BLOCK;
this._inlineItemsSpacing=0;
this._componentCount=0;
this._currentComponentGroup=null;
this._skinSet=b.skinSet||Constants.AutoPanel.Skins.DEFAULT;
this._fieldsProxies=[];
this._createFieldsOnRender=true;
this._parentPanel=b.parentPanel||this
},dontCreateFieldsOnNextDataUpdate:function(){this._createFieldsOnRender=false
},render:function(){if(this._createFieldsOnRender){this._createFieldsOnRender=false;
this._createFields(this._parentPanel)
}this._updateChildrenState()
},_prepareForRender:function(){if(this._createFieldsOnRender){this.disposeFields()
}return this.parent()
},_addField:function(e,a,d,c){if(!this._skinParts){return
}this._skinParts.content.setStyle("visibility","hidden");
var f=this.injects().Components.createComponent(e,a,undefined,d,undefined,this._showContentIfReady);
f.addClass(Constants.AutoPanel.COMPONENT_CLASS);
++this._componentCount;
this._addFieldToDom(f);
var b=this._createInputProxy(f,c);
this._fieldsProxies.push(b);
return b
},_showContentIfReady:function(){if(this._fieldsProxies==0){return
}for(var a=0;
a<this._fieldsProxies.length;
a++){if(!this._fieldsProxies[a].isReady()){return
}}this._skinParts.content.setStyle("visibility","visible")
},disposeFields:function(){this._fieldsProxies.forEach(function(a){a.dispose()
});
this._fieldsProxies=[];
this._skinParts&&this._skinParts.content&&this._skinParts.content.empty()
},getFields:function(){return this._fieldsProxies
},setDataItem:function(a){this._createFieldsOnRender=true;
this.parent(a)
},setSkinSet:function(a){this._skinSet=Constants.AutoPanel.Skins[a]
},getSkinFromSet:function(a,b){return this._getSkinFromSet(a,this._skinSet,b)
},_getSkinFromSet:function(a,e,d){var f=null;
var c=e.Extends;
var b=a&&e[a];
if(!b){if(c){return this._getSkinFromSet(a,Constants.AutoPanel.Skins[c],d)
}else{return LOG.reportError(wixErrors.AUTOPANEL_SKIN_DOES_NOT_EXIST,this.className,"_getSkinFromSet","Skin Set: "+e+" Skin Name: "+a)
}}if(typeof b=="string"){f=b
}if(typeof b=="object"){if(d&&b[d]){f=b[d]
}else{if(b["default"]){f=b["default"]
}else{return LOG.reportError(wixErrors.AUTOPANEL_SKIN_STYLES_DOES_NOT_EXIST,this.className,"_getSkinFromSet","Skin Set: "+e+" Skin Name: "+a+" Skin Style: "+d)
}}}return f
},_addFieldToDom:function(c){if(!c){return
}var a=this._skinParts.content;
var b=null;
if(this._inlineItemsPerLine==Constants.AutoPanel.ALL_BLOCK){c.insertInto(a)
}else{b=this._getComponentGroup();
c.addClass(Constants.AutoPanel.INLINE_CLASS);
c.insertInto(b);
if(this._componentCount%this._inlineItemsPerLine==0){this._addNewComponentGroup()
}else{c.setStyle("margin-right",this._inlineItemsSpacing+"px")
}}},_getComponentGroup:function(){return this._currentComponentGroup||this._addNewComponentGroup()
},_addNewComponentGroup:function(b,c,a){this._currentComponentGroup=null;
this._currentComponentGroup=new Element("div",{"class":Constants.AutoPanel.GROUP_CLASS,styles:{marginTop:b||0,paddingTop:a||0,borderTop:c||"none"}});
this._currentComponentGroup.insertInto(this._skinParts.content);
return this._currentComponentGroup
},addBreakLine:function(b,c,a){this._componentCount=0;
this._addNewComponentGroup(b,c,a)
},_createInputProxy:function(e,c){var b;
if(this._previewComponent){b=this._previewComponent.getComponentProperties()
}var d=this.injects().Preview.getPreviewManagers();
var a=d&&d.Theme.getDataItem();
return new this.imports.InputFieldProxy(e,this._data,b,a,c)
},_createDataProvider:function(b){var a=W.Data.createDataItem({items:b,type:"list"});
return a
},setNumberOfItemsPerLine:function(a,b){this._inlineItemsPerLine=parseInt(a,10)||0;
this._inlineItemsSpacing=parseInt(b,10)||0
},addTitle:function(b,a,c){return this._addField("wysiwyg.editor.components.inputs.Label",this.getSkinFromSet("Title",c),{labelText:b,color:a})
},addLabel:function(b,g,f,a,e,d,c){return this._addField("wysiwyg.editor.components.inputs.Label",this.getSkinFromSet("Label",f),{labelText:b,styles:g,spriteSrc:a,spriteOffset:e,spriteSize:d,toolTip:{toolTipId:c,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addSubLabel:function(b,a,c){return this._addField("wysiwyg.editor.components.inputs.Label",this.getSkinFromSet("SubLabel",c),{labelText:b,color:a})
},addButtonField:function(i,d,b,e,h,a,f,c,g){if(!e||typeof e=="string"){e={iconSrc:e}
}return this._addField("wysiwyg.editor.components.inputs.ButtonInput",this.getSkinFromSet("ButtonInput",h),{labelText:i,buttonLabel:d,toggleMode:b,iconSrc:e.iconSrc,iconSize:e.iconSize,spriteOffset:e.spriteOffset,minWidth:a,toolTip:{addQuestionMark:false,toolTipId:f,toolTipGetter:function(){return this._skinParts.view
}},command:c,commandParameter:g})
},addInlineTextLinkField:function(b,e,f,g,d,a,c){return this._addField("wysiwyg.editor.components.inputs.InlineTextLinkInput",this.getSkinFromSet("InlineTextLinkInput",c),{labelText:b,prefixText:e,buttonLabel:f,postfixText:g,toggleMode:d,iconSrc:a})
},addListEditorButton:function(c,b,a){return this._addField("wysiwyg.editor.components.inputs.ListEditorButton",this.getSkinFromSet("ListEditorButton"),{buttonLabel:c,listData:b,galleryConfigID:a})
},addInputGroupField:function(c,g,a,f,d,e,i,h){var b={createFieldsFunc:c,useCollapseButton:i,collapseAtStart:h,groupData:this._data,previewComponent:this._previewComponent,collapseLabel:a,expandLabel:f,align:e,parentPanel:this._parentPanel};
if(d){b.width=d.width;
b.height=d.height;
b.padding=d.padding
}return this._addField("wysiwyg.editor.components.inputs.InputGroup",this.getSkinFromSet("InputGroup",g),b)
},addComboBoxForType:function(d){var c=W.Editor.getSelectedComp();
var f=c.className;
var e=W.Editor.getAvailableTypes(f);
var g=[];
for(var a in e){g.push({value:a,label:W.Resources.get("EDITOR_LANGUAGE",a)})
}var b=f;
var h=this.addComboBoxField(d,g,b,e.length);
h.runWhenReady(function(i){i.addEvent("inputChanged",function(k){var j=e[k.value];
W.Editor.replaceCurrentComponent(this,j)
})
});
return h
},addComboBoxField:function(b,f,a,e,d){var c=this._createDataProvider(f);
return this.addComboBoxFieldWithDataProvider(b,c,a,d)
},addComboBoxFieldWithDataProvider:function(b,d,a,c){return this._addField("wysiwyg.editor.components.inputs.ComboBox",this.getSkinFromSet("ComboBox"),{labelText:b,defaultValue:a,dataProvider:d,toolTip:{toolTipId:c,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addComboBox:function(a,c){var b=this._createDataProvider([]);
return this._addField("wysiwyg.editor.components.inputs.ComboBox",this.getSkinFromSet("ComboBox"),{labelText:a,dataProvider:b,toolTip:{toolTipId:c,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}},b)
},addSelectionListInputField:function(c,e,b,a){var d=this._createDataProvider(e);
return this.addSelectionListInputFieldWithDataProvider(c,d,b,a)
},addRadioButtonsField:function(b,e,a,d,c){return this._addField("wysiwyg.editor.components.inputs.RadioButtons",this.getSkinFromSet("RadioButtons"),{labelText:b,presetList:e,defaultValue:a,group:d,display:c})
},addSelectionListInputFieldWithDataProvider:function(c,d,b,a,e){b=b||{};
b.labelText=c;
b.dataProvider=d;
b.repeaterArgs=a;
return this._addField((b&&b.type)||"wysiwyg.editor.components.inputs.SelectionListInput",(b&&b.skin)||this.getSkinFromSet("SelectionListInput",e),b)
},addDataItemSelectionListInputFieldWithDataProvider:function(c,d,b,a,e){return this._addField((b&&b.type)||"wysiwyg.editor.components.inputs.DataItemSelectionListInput",(b&&b.skin)||this.getSkinFromSet("SelectionListInput",e),{labelText:c,dataProvider:d,repeaterArgs:a})
},addRadioImagesField:function(b,e,a,d,c){return this._addField("wysiwyg.editor.components.inputs.RadioImages",this.getSkinFromSet("RadioImages"),{labelText:b,presetList:e,defaultValue:a,group:d,display:c})
},addInputField:function(d,c,b,a,f,g,e){return this._addField("wysiwyg.editor.components.inputs.Input",this.getSkinFromSet("Input",g),{labelText:d,placeholderText:c,minLength:b,maxLength:a,validatorArgs:f,toolTip:{toolTipId:e,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addLinkField:function(c,b,a,d){return this._addField("wysiwyg.editor.components.inputs.Link",this.getSkinFromSet("Link"),{labelText:c,placeholderText:b,previewData:this._data,changeCallBack:a,toolTip:{toolTipId:d,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addSubmitInputField:function(f,h,b,a,c,i,g,e,d){return this._addField("wysiwyg.editor.components.inputs.SubmitInput",this.getSkinFromSet("SubmitInput"),{labelText:f,placeholderText:h,minLength:b,maxLength:a,validatorArgs:g,buttonLabel:c,iconSrc:i,preSubmitFunction:e,toolTip:{toolTipId:d,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addSubmitTextAreaField:function(e,g,b,a,h,c,i,f,d){return this._addField("wysiwyg.editor.components.inputs.SubmitTextArea",this.getSkinFromSet("SubmitTextArea"),{labelText:e,placeholderText:g,minLength:b,maxLength:a,height:h,validatorArgs:f,buttonLabel:c,iconSrc:i,preSubmitFunction:d})
},addTextAreaField:function(c,a,f,b,e,g,d){return this._addField("wysiwyg.editor.components.inputs.TextArea",this.getSkinFromSet("TextArea"),{labelText:c,height:a,maxLength:b,validatorArgs:e,toolTip:{toolTipId:d,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addSliderField:function(b,e,a,g,d,h,f,c){return this._addField("wysiwyg.editor.components.inputs.Slider",this.getSkinFromSet("Slider"),{labelText:b,min:e,max:a,step:g,hideInput:d,updateOnEnd:h,noFloats:f,toolTip:{toolTipId:c,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addCheckBoxField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.CheckBox",this.getSkinFromSet("CheckBox"),{labelText:a,toolTip:{toolTipId:b,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addCheckBoxImageField:function(a,b,d,c){return this._addField("wysiwyg.editor.components.inputs.CheckBoxImage",this.getSkinFromSet("CheckBoxImage"),{labelText:a,icon:b,image:d,dimensions:c})
},addImageField:function(c,e,a,g,b,h,f,d){return this._addField("wysiwyg.editor.components.inputs.ImageInput",this.getSkinFromSet("ImageInput",f),{labelText:c,width:e,height:a,buttonText:g,galleryConfigID:b,deleteText:h,toolTip:{toolTipId:d,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.label
}}})
},addFlashField:function(b,c,a,e,d){return this._addField("wysiwyg.editor.components.inputs.FlashInput",this.getSkinFromSet("FlashInput",d),{labelText:b,width:c,height:a,buttonText:e})
},addUserDocField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.DocInput",this.getSkinFromSet("DocInput"),{labelText:a,buttonText:b})
},addColorField:function(a,b,c){return this._addField("wysiwyg.editor.components.inputs.ColorInput",this.getSkinFromSet("ColorInput",c),{labelText:a,enableAlpha:b})
},addColorGroupField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.ColorGroup",this.getSkinFromSet("ColorGroup",b),{colorList:a})
},addBgScrollField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.bg.BgScroll",this.getSkinFromSet("BgScroll"),{labelText:a,toolTip:{toolTipId:b,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.scrollTypes._skinParts.label
}}})
},addBgAlignField:function(a){return this._addField("wysiwyg.editor.components.inputs.bg.BgAlign",this.getSkinFromSet("BgAlign"),{labelText:a})
},addBgTileField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.bg.BgTile",this.getSkinFromSet("BgTile"),{labelText:a,toolTip:{toolTipId:b,addQuestionMark:true,toolTipGetter:function(){return this._skinParts.tileTypes._skinParts.label
}}})
},addBgColorField:function(a){return this._addField("wysiwyg.editor.components.inputs.bg.BgColor",this.getSkinFromSet("BgColor"),{labelText:a})
},addBgImageField:function(a){return this._addField("wysiwyg.editor.components.inputs.bg.BgImage",this.getSkinFromSet("BgImage"),{labelText:a})
},addFontButtonField:function(b,d,e,c,a){return this._addField("wysiwyg.editor.components.inputs.FontButtonInput",this.getSkinFromSet("FontButton"),{labelText:b,label:d,name:e,toggleMode:c,iconSrc:a})
},addFontColorField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.font.FontColor",this.getSkinFromSet("FontColor"),{labelText:a,value:b})
},addFontSizeField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.font.FontSize",this.getSkinFromSet("FontSize"),{labelText:a,value:b})
},addFontStyleField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.font.FontStyle",this.getSkinFromSet("FontStyle"),{labelText:a,value:b})
},addFontFamilyField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.font.FontFamily",this.getSkinFromSet("FontFamily"),{labelText:a,value:b})
},addBorderRadiusField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.BorderRadiusInput",this.getSkinFromSet("BorderRadius"),{labelText:a,radiusString:b})
},addColorSelectorField:function(b,a,d,e,c){return this._addField("wysiwyg.editor.components.inputs.ColorSelectorField",this.getSkinFromSet("ColorSelectorField"),{labelText:b,colorValue:a,colorSource:d,alpha:e,toolTip:{toolTipId:c,addQuestionMark:false,toolTipGetter:function(){return this._skinParts.adjustButton
}}})
},addColorSelectorButtonField:function(a,b){return this._addField("wysiwyg.editor.components.inputs.ColorSelectorButtonField",this.getSkinFromSet("ColorSelectorButton"),{colorName:a,colorObj:b})
},addFontSelectorField:function(b,a){return this._addField("wysiwyg.editor.components.inputs.font.FontSelectorField",this.getSkinFromSet("FontSelectorField"),{labelText:b,fontName:a})
},_createStylePanel:function(b){var c;
if(!b||!(c=b.get("styleItems"))){return LOG.reportError(wixErrors.STYLES_DO_NOT_EXIST,this.getOriginalClassName(),"_createStylePanel")
}var a=c[this._previewComponent.getOriginalClassName()];
if(a){this.addStyleSelector(a)
}},addStyleSelector:function(f,d){d=d||this._previewComponent;
var e=[];
for(var c=0;
c<f.length;
c++){e[c]={value:f[c],label:f[c]}
}var g;
if(d.getStyle()){g=d.getStyle().getId()
}else{g=e[0].value;
var b=W.Preview.getPreviewManagers().Theme.isStyleAvailable(g);
if(b){this.injects().Preview.getPreviewManagers().Theme.getStyle(g,function(h){d.setStyle(h)
}.bind(this))
}else{var a=W.Editor.getDefaultSkinForStyle(g)||W.Editor.getDefaultSkinForComp(d.className);
this.injects().Preview.getPreviewManagers().Theme.createStyle(g,d.className,a,function(h){d.setStyle(h)
}.bind(this))
}}this.addInputGroupField(function(){var i=this;
var h=this.injects().Resources.get("EDITOR_LANGUAGE","CHOOSE_STYLE_TITLE","Change Style");
this.addButtonField(null,h,null,null,"blueWithArrow").addEvent(Constants.CoreEvents.CLICK,function(){var k=this.injects().Utils.getPositionRelativeToWindow(this._skinParts.view);
if(e.length>1){i.injects().EditorDialogs.openStyleSelector(d,{left:k.x,top:k.y})
}else{var j=W.Commands.getCommand("WEditorCommands.CustomizeComponentStyle");
j.execute({editedComponent:d,left:k.x,top:k.y})
}})
})
},dispose:function(){this.disposeFields();
this.parent()
},_createFields:function(a){},addVisibilityConditions:function(d){for(var c=0,a=d.length;
c<a;
c++){var b=d[c];
this.addVisibilityCondition(b.ref,b.predicate)
}},addVisibilityCondition:function(a,b){this._addCondition(a,function(c){c.setCollapsed(!b())
})
},addEnabledCondition:function(a,b){this._addCondition(a,function(d){var c=b();
if(c){d.enable()
}else{d.disable()
}})
},_addCondition:function(a,b){a.runWhenReady(function(c){if(this._data){this._data.addEvent(Constants.DataEvents.DATA_CHANGED,function(){b(c)
})
}this._previewComponent.getComponentProperties().addEvent(Constants.DataEvents.DATA_CHANGED,function(){b(c)
});
b(c)
}.bind(this));
return a
},enable:function(){this.parent();
this._updateChildrenState()
},disable:function(){this.parent();
this._updateChildrenState()
},_updateChildrenState:function(){if(this._isEnabled){this._fieldsProxies.forEach(function(a){a.enable()
})
}else{this._fieldsProxies.forEach(function(a){a.disable()
})
}},_translate:function(a){return this.injects().Resources.get("EDITOR_LANGUAGE",a)
}}});
W.Classes.newClass({name:"wysiwyg.editor.components.panels.base.InputFieldProxy",Class:{Binds:["_onFieldReady","_onFieldWixified","_executeOrAddToQueue"],initialize:function(d,b,f,e,c){this._wixefyMethodsCallsQueue=[];
this._methodCallsQueue=[];
this._callbacks=[];
this._dataItem=b;
this._propertiesDataItem=f;
this._themeDataItem=e;
this._dataProvider=c;
this._isBound=false;
this._isHooked=false;
var a=d.getViewNode&&d.getViewNode();
if(a){this._htmlElement=a;
this._onFieldWixified();
this._onFieldReady()
}else{this._htmlElement=d;
d.addEvent(Constants.ComponentEvents.WIXIFIED,this._onFieldWixified);
d.addEvent(Constants.ComponentEvents.READY,this._onFieldReady)
}},isReady:function(){var a=this._htmlElement.getLogic&&this._htmlElement.getLogic();
if(!a){return false
}return a.isReady()
},isValidInput:function(){return this._htmlElement.getLogic().isValidInput()
},bindToProperty:function(a){return this._bindToField(this._propertiesDataItem,a)
},bindToThemeProperty:function(a){return this._bindToField(this._themeDataItem,a)
},bindToRemappedThemeProperties:function(a){return this._bindToRemappedFields(this._themeDataItem,a)
},bindToRemappedDataFields:function(a){return this._bindToRemappedFields(this._dataItem,a)
},bindToDataItemAndFilterFromDataProvider:function(a){if(this._isBound){LOG.reportError();
throw new Error("this input is already bound")
}return this._executeOrAddToQueue("bindToDataItemAndFilterFromDataProvider",[this._themeDataItem,a])
},bindToFields:function(a){return this._bindToFilteredFields(this._dataItem,a)
},bindToField:function(a){return this._bindToField(this._dataItem,a)
},bindToDataItem:function(a){return this._bindToDataItem(a)
},bindDataItemToValueOf:function(a){return a.addEvent("inputChanged",function(b){this.setDataItem(b.value)
}.bind(this))
},bindHooks:function(a,b){if(this._isHooked){LOG.reportError();
throw new Error("this input is already bound")
}this._isHooked=true;
return this._executeOrAddToQueue("bindHooks",arguments,true)
},addEvent:function(a,b){return this._executeOrAddToQueue("addEvent",arguments)
},setValue:function(a){return this._executeOrAddToQueue("setValue",arguments)
},getValue:function(b){var a=this._getTargetLogic();
if(a){return a.getValue()
}else{return undefined
}},setDataItem:function(a){return this._executeOrAddToQueue("setDataItem",arguments)
},disable:function(){return this._executeOrAddToQueue("disable",arguments)
},enable:function(){return this._executeOrAddToQueue("enable",arguments)
},setFocus:function(){return this._executeOrAddToQueue("setFocus",arguments)
},collapse:function(){return this._executeOrAddToQueue("collapse",arguments)
},uncollapse:function(){return this._executeOrAddToQueue("uncollapse",arguments)
},getHtmlElement:function(){return this._htmlElement
},runWhenReady:function(b){var a=this._getTargetLogic();
if(a){this.injects().Utils.callLater(b,[a])
}else{this._callbacks.push(b)
}},selectItemAtIndex:function(a){return this._executeOnWixified("selectItemAtIndex",arguments)
},selectFirst:function(){return this.selectItemAtIndex(0)
},createFieldsAfterDataUpdate:function(){return this._executeOnWixified("dontCreateFieldsOnNextDataUpdate")
},_getTargetLogic:function(b){var a=this._htmlElement.getLogic&&this._htmlElement.getLogic();
if(!b&&a){return a.isReady()&&a
}return a
},_bindToField:function(a,k,h,j){if(this._isBound){LOG.reportError();
throw new Error("this input is already bound")
}this._isBound=true;
this._executeOrAddToQueue("bindToDataItemField",arguments);
if(this._dataProvider){var e=[];
var d=a.getFieldSchema(k);
var g=d&&d["enum"];
if(g){for(var b=0;
b<g.length;
b++){var c=g[b];
var f=W.Resources.get("EDITOR_LANGUAGE","Types."+a.getType()+"."+k+"."+c);
e.push({value:c,label:f})
}}this._dataProvider.set("items",e)
}return this
},_bindToFilteredFields:function(a,b){if(this._isBound){LOG.reportError();
throw new Error("this input is already bound")
}this._isBound=true;
this._executeOrAddToQueue("bindToDataItemsFilteredFields",arguments);
return this
},_bindToRemappedFields:function(){if(this._isBound){LOG.reportError();
throw new Error("this input is already bound")
}this._isBound=true;
this._executeOrAddToQueue("bindToDataItemsRemappedFields",arguments);
return this
},_bindToDataItem:function(){if(this._isBound){LOG.reportError();
throw new Error("this input is already bound")
}this._isBound=true;
this._executeOrAddToQueue("bindToDataItem",arguments);
return this
},_executeOrAddToQueue:function(c,d,e,a){var b=this._getTargetLogic(!!a);
if(b){b[c].apply(b,d)
}else{a=a||this._methodCallsQueue;
if(e){a.unshift({method:c,args:d})
}else{a.push({method:c,args:d})
}}return this
},_executeOnWixified:function(a,b,c){this._executeOrAddToQueue(a,b,c,this._wixefyMethodsCallsQueue);
return this
},_onFieldWixified:function(){this._wixefyMethodsCallsQueue.forEach(function(a){this._executeOrAddToQueue(a.method,a.args,false,this._wixefyMethodsCallsQueue)
}.bind(this))
},_onFieldReady:function(){var a=this._getTargetLogic(false);
this._methodCallsQueue.forEach(function(b){this._executeOrAddToQueue(b.method,b.args)
}.bind(this));
this._callbacks.forEach(function(b){b(a)
})
},dispose:function(){return this._executeOrAddToQueue("dispose",arguments)
},showValidationMessage:function(a){return this._executeOrAddToQueue("showValidationMessage",arguments)
},resetInvalidState:function(){return this._executeOrAddToQueue("resetInvalidState",arguments)
},renderIfNeeded:function(){var a=this._getTargetLogic();
if(a){a.renderIfNeeded()
}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.base.SidePanel",skinParts:{backButton:{type:"htmlElement",command:"WEditorCommands.BackToParentPanel"},backLabel:{type:"htmlElement",autoBindDictionary:"BACK_TO"},backName:{type:"htmlElement",autoBindThis:"_prevPanelName"},title:{type:"htmlElement"},description:{type:"htmlElement"},helplet:{type:"htmlElement",autoBindDictionary:"HELPLET_LEARN_MORE"},cancelButton:{type:"htmlElement"},closeButton:{type:"htmlElement",command:"this._closeCommand"},content:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",_states:["breadcrumb_0","breadcrumb_1","breadcrumb_2"],Binds:["_onWindowResize"],initialize:function(d,b,c){this.parent(d,b,c);
var a=this.injects().Commands;
var e=a.createCommand("cancel");
this._cancelCommand=e;
e.registerListener(this,this._onCancel);
e.disable();
this._realCloseCommand=c&&a.getCommand(c.closeCommand);
this._closeCommand=e=a.createCommand("close");
e.registerListener(this,this._onClose);
this._contentPanel=null;
this._prevPanelName=""
},_onAllSkinPartsReady:function(){this._skinParts.cancelButton.collapse();
this._skinParts.backButton.collapse();
window.addEvent("resize",this._onWindowResize)
},insertPanel:function(b,a){if(!Browser.safari){this._delayedInsertPanel(b,a)
}else{setTimeout(function(){this._delayedInsertPanel(b,a)
}.bind(this),100)
}},_delayedInsertPanel:function(b,a){var c=this._skinParts;
c.content.empty();
this._contentPanel=b;
this._contentPanel.setContainerPanel(this);
if(!b){this._skinParts.cancelButton.collapse();
this._skinParts.backButton.collapse();
return
}if(!b.hasClassAncestor("SideContentPanel",true)){this.injects().Utils.debugTrace("side panel content must inherit from SideContentPanel");
return
}b.getViewNode().insertInto(c.content);
c.title.uncollapse();
c.description.uncollapse();
this._panelTitle=b.getTitle();
this._skinParts.title.set("html",this._panelTitle);
this._panelDescription=b.getDescription();
this._skinParts.description.set("html",this._panelDescription);
this._helplet=b.getHelplet();
this._skinParts.helplet.setCollapsed(!this._helplet);
if(this._helplet&&!this._helpletAlreadyRegistered){this._helpletAlreadyRegistered=true;
this._skinParts.helplet.addEvent("click",function(){W.Commands.executeCommand("WEditorCommands.ShowHelpDialog",this._helplet)
}.bind(this))
}this._skinParts.cancelButton.setCollapsed(!b.canCancel());
this._skinParts.backButton.setCollapsed(!b.canGoBack());
this._prevPanelName=a;
this._renderIfReady()
},setHistoryDepth:function(a){this.setState("breadcrumb_"+a)
},getResizeOffset:function(){if(this._contentPanel&&this._contentPanel.getActionsHeight){return this._contentPanel.getActionsHeight()+200
}return 0
},getHeaderHeight:function(){if(!this._skinParts||!this._skinParts.title){return 0
}this._headerHeight=this._skinParts.title.getSize().y+this._skinParts.description.getSize().y;
return this._headerHeight
},getPanelHeight:function(){return this._skinParts.view.getSize().y
},_onCancel:function(){if(this._contentPanel){this._contentPanel.cancel(this._realCloseCommand)
}},_onClose:function(){if(this._contentPanel&&this._realCloseCommand){this._contentPanel.tryClose(this._realCloseCommand);
this.injects().Utils.forceBrowserRepaint()
}},_onWindowResize:function(a){this.fireEvent("resize",a)
}}});
Constants.AdavancedStyling={COMPONENT_MODE:"Component",ADVANCED_MODE:"Advanced",TYPE_COLORS:"colors",TYPE_FONTS:"fonts",TYPE_RADIUS:"radius",TYPE_ADDITIONAL:"additional",TYPE_GROUPS:"groups"};
W.Components.newComponent({name:"wysiwyg.editor.components.panels.design.AdvancedStyling",imports:[],skinParts:{content:{type:"htmlElement"}},traits:["mobile.editor.components.traits.DataPanel"],Class:{Extends:"wysiwyg.editor.components.panels.base.AutoPanel",Binds:["_componentSelected","_styleSelected","_updateSkinListDataItem","_skinSelected","_resetAndRebuildSkinTree"],Static:{LineBreak:null},initialize:function(c,a,b){this.parent(c,a,b);
if(b.selectedComponent){this._mode=Constants.AdavancedStyling.COMPONENT_MODE;
this._selectedComp=b.selectedComponent
}else{this._mode=Constants.AdavancedStyling.ADVANCED_MODE
}this._styleItems=b.styleList;
this._fieldTree=[]
},_createFields:function(){var a=this.injects().Resources;
this._componentListItem=W.Data.createDataItem({items:[],type:"list"});
this._componentCombo=this.addComboBoxFieldWithDataProvider(a.get("EDITOR_LANGUAGE","SELECT_COMPONENT_FOR_STYLE"),this._componentListItem).addEvent("inputChanged",this._componentSelected);
this.addBreakLine();
this._stylesDataItem=W.Data.createDataItem({items:[],type:"list"});
this._styleCombo=this.addComboBoxFieldWithDataProvider(a.get("EDITOR_LANGUAGE","SELECT_STYLE_FOR_COMPONENT"),this._stylesDataItem).addEvent("inputChanged",this._styleSelected);
this._styleCombo.disable();
this.addBreakLine();
if(this._mode==Constants.AdavancedStyling.COMPONENT_MODE){this._componentCombo.collapse();
this._styleCombo.collapse()
}this._skinItem=W.Data.createDataItem({items:[],type:"list"});
this._skinGallery=this.addSelectionListInputFieldWithDataProvider(a.get("EDITOR_LANGUAGE","REPLACE_COMPONENT_SKIN"),this._skinItem,{type:"wysiwyg.editor.components.ThumbGallery",skin:"wysiwyg.editor.skins.ThumbGallerySkin"},{type:"wysiwyg.editor.components.ThumbGalleryItem",skin:"wysiwyg.editor.skins.ThumbGalleryItemSkin",numRepeatersInLine:4});
this._skinGallery.addEvent("inputChanged",this._skinSelected);
if(this._mode==Constants.AdavancedStyling.COMPONENT_MODE){this.setupComponentModeParams()
}else{this._updateComponentList()
}},setupComponentModeParams:function(){this._selectedCompName=this._selectedComp.getOriginalClassName();
this._componentCombo.setValue(this._selectedCompName);
var a=this._selectedComp.getStyle().getId();
this._styleSelected({value:a})
},_updateComponentList:function(){var b=[{value:"",label:""}];
for(var a in this._styleItems){b.push({value:a,label:this.injects().Resources.get("EDITOR_LANGUAGE",a)})
}this._componentListItem.setData({type:"list",items:b},false)
},_componentSelected:function(a){this._resetFieldTree();
if(a){this._selectedCompName=a.value
}this._resetSkinCombo();
this._updateStyleCombo()
},_updateStyleCombo:function(){var c=[];
if(this._selectedCompName){c=this._styleItems[this._selectedCompName]
}var b=[{value:"",label:""}];
for(var a=0;
a<c.length;
a++){b[a+1]={value:c[a],label:c[a]}
}this._stylesDataItem.setData({type:"list",items:b},false);
this._styleCombo.enable()
},_styleSelected:function(b){this._resetFieldTree();
var a=b.value;
W.Data.getDataByQuery("#SKINS",function(e){if(!e||!e.get("components")){return W.Utils.debugTrace("WEditor: missing component data or data list")
}var f=this.injects().Preview.getPreviewManagers().Theme;
this._skinList=e.get("components");
var d=f.isStyleAvailable(a);
if(d){f.getStyle(a,this._updateSkinListDataItem)
}else{var c=this._skinList[this._selectedCompName][0];
f.createStyle(a,this._selectedCompName,c,this._updateSkinListDataItem)
}}.bind(this))
},_updateSkinListDataItem:function(a){W.Data.getDataByQuery("#SKIN_DESCRIPTION",function(b){var f=b.get("skins");
this._styleData=a;
var d=this._skinList[this._selectedCompName];
var g=[];
var h=this._styleData.getSkin();
for(var c=0;
c<d.length;
c++){var j=f[d[c]].description;
var e=this.injects().Config.getServiceTopologyProperty("staticSkinUrl")+f[d[c]].iconUrl;
g[c]={value:d[c],label:j,iconUrl:e};
if(h==d[c]){this._skinGallery.selectItemAtIndex(c)
}}this._skinItem.setData({type:"list",items:g},false);
this._resetAndRebuildSkinTree()
}.bind(this))
},_skinSelected:function(a){this._styleData.addEvent(Constants.StyleEvents.READY,this._resetAndRebuildSkinTree);
this._styleData.setSkin(a.value.value)
},_resetAndRebuildSkinTree:function(){this._resetFieldTree();
this._buildStyleGui(this._styleData)
},_buildStyleGui:function(c){var a=this._classifyStyleProperties(c);
for(var b in a){this._createGroupTree(b,a[b],c)
}},_classifyStyleProperties:function(j){var h={};
var d=[];
var c=[];
var a=[];
var k=[];
var m=j.getProperties();
for(var g in m){var b=j.getPropertyType(g);
if(b==Constants.SkinParamCssTypesToGeneralTypesMap.color){d.push(g)
}else{if(b==Constants.SkinParamCssTypesToGeneralTypesMap.cssFont){c.push(g)
}else{if(b==Constants.SkinParamCssTypesToGeneralTypesMap.cssBorderRadius){a.push(g)
}else{if(b==Constants.SkinParamCssTypesToGeneralTypesMap.size||b==Constants.SkinParamCssTypesToGeneralTypesMap.boxShadow){k.push(g)
}}}}}if(d.length>0){h[Constants.AdavancedStyling.TYPE_COLORS]=d
}if(c.length>0){h[Constants.AdavancedStyling.TYPE_FONTS]=c
}if(a.length>0){h[Constants.AdavancedStyling.TYPE_RADIUS]=a
}if(k.length>0){h[Constants.AdavancedStyling.TYPE_ADDITIONAL]=k
}var e=[];
var i=j.getGroups();
for(var l in i){var f=i[l];
if(!this._isGroupEmpty(f)){e.push({groupName:l,groupStyleData:f})
}}if(e.length>0){h[Constants.AdavancedStyling.TYPE_GROUPS]=e
}return h
},_isGroupEmpty:function(e){var c=e.getProperties();
for(var a in c){var b=e.getPropertyType(a);
if(b==Constants.SkinParamCssTypesToGeneralTypesMap.color||b==Constants.SkinParamCssTypesToGeneralTypesMap.cssFont||b==Constants.SkinParamCssTypesToGeneralTypesMap.cssBorderRadius||b==Constants.SkinParamCssTypesToGeneralTypesMap.size||b==Constants.SkinParamCssTypesToGeneralTypesMap.boxShadow){return false
}}var f=e.getGroups();
for(var d in f){return this._isGroupEmpty(d)
}return true
},_createGroupTree:function(e,h,f){var a=this;
var j;
var g;
var c=this.injects().Resources;
switch(e){case Constants.AdavancedStyling.TYPE_COLORS:g=this.addLabel(c.get("EDITOR_LANGUAGE","ADVANCED_COLORS"));
j=this.addInputGroupField(function(){a._buildColorGroup.call(this,h,f)
});
break;
case Constants.AdavancedStyling.TYPE_FONTS:g=this.addLabel(c.get("EDITOR_LANGUAGE","ADVANCED_FONTS"));
j=this.addInputGroupField(function(){this.addBreakLine();
a._buildFontGroup.call(this,h,f)
});
break;
case Constants.AdavancedStyling.TYPE_RADIUS:this._buildRadiusGroups(h,f);
break;
case Constants.AdavancedStyling.TYPE_ADDITIONAL:g=this.addLabel(c.get("EDITOR_LANGUAGE","ADVANCED_ADDITIONAL"));
j=this.addInputGroupField(function(){this.addBreakLine();
a._buildAdditionalConfigsGroup.call(this,h,f)
});
break;
case Constants.AdavancedStyling.TYPE_GROUPS:for(var d=0;
d<h.length;
d++){var b=this.addLabel(h[d].groupName);
this._buildStyleGui(h[d].groupStyleData);
this._fieldTree.push(b)
}break;
default:break
}if(j){this._fieldTree.push(j)
}if(g){this._fieldTree.push(g)
}},_buildColorGroup:function(d,e){var c=function(i){var f;
var g=e.getPropertySource(i);
if(g==="theme"){f=e.get(i)
}else{f=e.get(i)
}var h=this.addColorSelectorField(this.injects().Resources.get("EDITOR_LANGUAGE",e.getPropertyLangKey(i)),f,g,e.getPropertyExtraParamValue(i,"alpha"),"Edit_Style_button_to_Customize_Color_ttid");
h.addEvent("colorChanged",function(k){var j=k.color;
e.setPropertyExtraParamValue(i,"alpha",1,true);
e.changePropertySource(i,j.toString(),k.source)
}.bind(this));
h.addEvent("adjustmentChanges",function(j){e.setPropertyExtraParamValue(i,"alpha",j.alpha,true)
}.bind(this))
}.bind(this);
for(var b=0;
b<d.length;
b++){var a=d[b];
c(a)
}},_buildFontGroup:function(d,e){var b=function(g){var f=e.get(g);
var h=this.injects().Resources.get("EDITOR_LANGUAGE",e.getPropertyLangKey(g));
var i=this.addFontSelectorField(h,f);
i.addEvent("fontChanged",function(k){var j=k.value;
if(e.getPropertySource(g)!="theme"){j=this.injects().Preview.getPreviewManagers().Theme.getProperty(j)
}e.set(g,j)
})
}.bind(this);
for(var c=0;
c<d.length;
c++){var a=d[c];
b(a)
}},_buildRadiusGroups:function(d,e){var b=function(i){var g=this.injects().Resources.get("EDITOR_LANGUAGE",e.getPropertyLangKey(i))||this.injects().Resources.get("EDITOR_LANGUAGE","ADVANCED_RADIUS");
var h=this.addLabel(g);
var f=this;
var j=this.addInputGroupField(function(){this.addBreakLine();
f._buildRadiusGroup.call(this,i,e)
});
this._fieldTree.push(j);
this._fieldTree.push(h)
}.bind(this);
for(var c=0;
c<d.length;
c++){var a=d[c];
b(a)
}},_buildRadiusGroup:function(e,f){var c=f.getPropertySource(e);
var b;
if(c=="theme"){b=this.injects().Preview.getPreviewManagers().Theme.getProperty(f.get(e))
}else{b=f.get(e)
}var a=this.addBorderRadiusField(null,b);
var d=b.split(String(parseFloat(b))).join("");
a.addEvent("inputChanged",function(h){var g=h.value;
if(c=="theme"){}if(c=="value"){f.set(e,g)
}})
},_buildAdditionalConfigsGroup:function(c,d){var e=function(i){var g=d.getPropertySource(i);
var l;
var k=this.injects().Resources.get("EDITOR_LANGUAGE",d.getPropertyLangKey(i));
if(g=="theme"){l=this.injects().Preview.getPreviewManagers().Theme.getProperty(d.get(i))
}else{l=d.get(i)
}var j=d.getPropertyType(i);
switch(j){case Constants.SkinParamCssTypesToGeneralTypesMap.size:var n=new W.Size(l);
var h=this.addSliderField(k,0,15,1,false);
h.setValue(n.getAmount());
h.addEvent("inputChanged",function(p){var o=p.value;
if(g=="theme"){}if(g=="value"){n.setAmount(o);
d.set(i,n.getCssValue())
}});
break;
case Constants.SkinParamCssTypesToGeneralTypesMap.boxShadow:var m=new W.BoxShadow(l,d.getPropertyExtraParamValue(i,"isOn"));
var f=this.addCheckBoxField(k);
f.setValue(m.getToggleOn()===true);
f.addEvent("inputChanged",function(o){var p=o.value;
if(g=="theme"){}if(g=="value"){m.setToggleOn(p);
d.setPropertyExtraParamValue(i,"isOn",m.getToggleOn().toString(),true)
}});
break
}}.bind(this);
for(var b=0;
b<c.length;
b++){var a=c[b];
e(a)
}},_resetSkinCombo:function(){this._skinItem.setData({type:"list",items:[]},false)
},_resetFieldTree:function(){for(var a=0;
a<this._fieldTree.length;
a++){this._fieldTree[a].dispose()
}this._fieldTree=[]
},getAcceptableDataTypes:function(){return[""]
}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.navigation.SiteNavigationEditor",skinParts:{treeEditor:{type:"wysiwyg.editor.components.panels.navigation.TreeStructureEditor"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["_handleMenuData","_onSitePageChanged","_reorderPagesData"],initialize:function(c,a,b){this.parent(c,a,b);
W.Commands.registerCommandAndListener("W.EditorCommands.TreeItemMoveComplete",this,this._reorderPagesData)
},_onAllSkinPartsReady:function(){this._treeEditor=this._skinParts.treeEditor;
this.injects().Editor.addEvent(Constants.EditorEvents.SITE_PAGE_CHANGED,this._onSitePageChanged);
this.injects().Preview.getPreviewManagers().Data.getDataByQuery("#MAIN_MENU",this._handleMenuData)
},setScrollArea:function(a){this._treeEditor.setScrollContainer(a)
},_handleMenuData:function(b){this.setDataItem(b);
this._treeEditor.setDataItem(this._data);
this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._treeEditor.updatePanel);
var a=b.getItems();
this._treeEditor.setSingleItemComponentType("wysiwyg.editor.components.SiteNavigationButton","wysiwyg.editor.skins.WSiteMenuItemSkin");
this._treeEditor.createTreeItemsFromDataItems(a,0)
},_onSitePageChanged:function(c){var b=this._treeEditor.getTreeButtons();
for(var d=0;
d<b.length;
d++){var e=b[d];
var a=(e._refId.indexOf("#")===0)?e._refId.substr(1):e._refId;
if(c===a){b[d].setState("selected")
}else{b[d].setState("up")
}}},_reorderPagesData:function(d){var b=d.parentData;
var c=d.index;
var e=d.sourceItem;
var a=e.getDataItem();
this._data.moveItemToParentAtIndex(a,b,c);
this._reorderSiteStructureData(e)
},_reorderSiteStructureData:function(k){var g=this._data.getAllItems();
var d=W.Preview.getPreviewManagers().Data.getDataByQuery("#SITE_STRUCTURE");
var b=d.get("pages");
var e=[];
for(var c=0;
c<g.length;
c++){e.push(g[c].get("refId"))
}var f=k.getDataItem().get("refId");
var j=e.indexOf(f);
var h=b.indexOf(f);
if(j==h){return
}d.set("pages",e);
var a=this.injects().Preview.getPreviewSite();
var l=a.$$(e[j]).dispose();
if(j<e.length-1){l.insertInto(a.$$(e[j+1])[0],"before",Constants.DisplayEvents.MOVED_IN_DOM)
}else{l.insertInto(a.$$(e[j-1])[0],"after",Constants.DisplayEvents.MOVED_IN_DOM)
}this.injects().Utils.callOnNextRender(function(){this.injects().Preview.getPreviewManagers().Viewer.indexPages("#SITE_PAGES")
}.bind(this));
this.injects().Preview.getPreviewManagers().Viewer.indexPages("#SITE_PAGES")
}}});
W.Classes.newClass({name:"wysiwyg.editor.components.panels.navigation.TreeStructureDragHandler",Class:{Binds:["onItemDrag","_onItemDrop","_scrollUp","_scrollDown"],Static:{INDENT:20},initialize:function(){this._duringDrag=false;
this._deltaY=0
},setDragContainer:function(a){this._dragContainer=a;
this._dragContainerPosition=a.getPosition();
this._dragContainerPosition.y-=window.pageYOffset
},setScrollContainer:function(a){this._scrollContainer=a;
this._scrollContainerPosition=a.getPosition();
this._scrollContainerPosition.y-=window.pageYOffset
},onItemDrag:function(f,e,g,d){var b=this._filterDragEvent(f.event);
if(!b){return
}if(this._duringDrag){return
}this._sourceItem=e;
this._sourceItemIndex=g;
this._subItems=d;
this._dragContainerSize=this._dragContainer.getSize();
this._sourceItemPosition=this._sourceItem.getViewNode().getPosition();
this._sourceItemPosition.y-=window.pageYOffset;
this._sourceItemHeight=this._sourceItem.getViewNode().getSize().y;
var c=f.client;
this._deltaY=c.y-this._sourceItemPosition.y;
if(this._sourceItem.isSubItem()){this._dragSubItem=true
}this._createTempDragItem();
this._duringDrag=true;
this._initialScrollPosition=this._scrollContainer.scrollTop;
var a=$$("body");
a.addEvent(Constants.CoreEvents.MOUSE_MOVE,function(h){this._followMouseOnDrag(h,this._sourceItem)
}.bind(this));
a.addEvent(Constants.CoreEvents.MOUSE_UP,this._onItemDrop);
this.disableSelection(this._scrollContainer)
},setSourceItemIndex:function(a){this._sourceItemIndex=a
},_filterDragEvent:function(a){if(!a.which&&a.button){if(a.button&1){a.which=1
}else{if(a.button&4){a.which=2
}else{if(a.button&2){a.which=3
}}}}if(a.which!=1||this.injects().Editor.getPageCount()==1){return null
}else{return a
}},_createTempDragItem:function(){var a=this._sourceItem.getViewNode();
var c=a.getSize();
this._draggedItemPosition=Object.clone(this._sourceItemPosition);
this._draggedItemPosition.y+=window.pageYOffset;
var d=new Element("div",{styles:{left:String(this._draggedItemPosition.x)+"px",top:String(this._draggedItemPosition.y)+"px",width:c.x+"px","margin-left":"0px",position:"absolute"}});
d.addClass("z-topLayer");
d.adopt(this._createTempDragParts(this._sourceItem));
for(var b=0;
b<this._subItems.length;
b++){d.adopt(this._createTempDragParts(this._subItems[b],b))
}$$("body")[0].appendChild(d);
this._draggedItemSize=d.getSize();
this._draggedItem=d
},_createTempDragParts:function(f,c){var b=f.getViewNode();
var d=b.getSize();
var e=b.clone();
var a={};
var g;
if(typeof c==="number"){a.x=this.INDENT;
a.y=c*d.y;
g=""
}else{a={x:0,y:0};
g="2px solid #0099ff"
}e.set("styles",{opacity:"0.25",left:String(a.x)+"px",top:"0px","margin-left":"0px",width:d.x+"px",border:"2px solid #0099ff","border-top":g,position:"relative"});
b.set("styles",{opacity:"0.6"});
return e
},_followMouseOnDrag:function(b){this._dragX=b.client.x;
this._dragY=b.client.y;
var a=this._dragY-this._deltaY;
if(!this._isInDragBoundaries(a)){return
}this._draggedItemPosition.y=a+window.pageYOffset;
this._draggedItem.setStyle("top",this._draggedItemPosition.y);
this._handleSubItem();
this._moveItemIfNeeded()
},_handleSubItem:function(){var a=this._dragX-this._dragContainerPosition.x;
if(!this._dragSubItem&&a>this.INDENT&&this._canBeSubItem()){this._changeState(true)
}else{if(this._dragSubItem&&a<this.INDENT&&this._canBeParentItem()){this._changeState(false)
}}},_changeState:function(c){var b;
if(c){b=this.INDENT;
this._dragSubItem=true
}else{b=(-1)*this.INDENT;
this._dragSubItem=false
}this._draggedItemPosition.x=this._draggedItemPosition.x+b;
this._draggedItemSize.x=this._draggedItemSize.x-b;
var a=this._draggedItem.children[0];
this._draggedItem.setStyles({left:String(this._draggedItemPosition.x)+"px",width:String(this._draggedItemSize.x)+"px"});
a.setStyles({width:String(this._draggedItemSize.x)+"px"});
W.Commands.executeCommand("W.EditorCommands.TreeItemStateChanged",{sourceItem:this._sourceItem,isSubItem:this._dragSubItem})
},setAsSubItem:function(a){this._changeState(true);
this.forceToBeSubItem(a)
},setAsParentItem:function(){this._changeState(false)
},forceToBeSubItem:function(a){this._forceAsSubItem=a
},_canBeParentItem:function(){return !this._forceAsSubItem
},_canBeSubItem:function(){if(this._subItems&&this._subItems.length>0){return false
}if(this._dragSubItem){return false
}var a=this._sourceItemIndex==0;
if(a){return false
}return true
},_moveItemIfNeeded:function(){var a=this._scrollContainer.scrollTop-this._initialScrollPosition;
var b=this._draggedItemPosition.y-window.pageYOffset+a;
if(this._sourceItemPosition.y-b>this._sourceItemHeight/2){this._sourceItemPosition.y=this._sourceItemPosition.y-this._sourceItemHeight;
this._sourceItemIndex=this._sourceItemIndex-1;
W.Commands.executeCommand("W.EditorCommands.TreeItemMoved",{sourceItem:this._sourceItem,newIndex:this._sourceItemIndex})
}else{if(this._subItems.length==0&&(b-this._sourceItemPosition.y>this._sourceItemHeight/2)){this._sourceItemPosition.y=this._sourceItemPosition.y+this._sourceItemHeight;
this._sourceItemIndex=this._sourceItemIndex+1;
W.Commands.executeCommand("W.EditorCommands.TreeItemMoved",{sourceItem:this._sourceItem,newIndex:this._sourceItemIndex})
}else{if(this._subItems.length>0&&(b-(this._sourceItemPosition.y+this._draggedItemSize.y))>this._sourceItemHeight/2){this._sourceItemPosition.y=this._sourceItemPosition.y+this._sourceItemHeight;
this._sourceItemIndex=this._sourceItemIndex+1;
W.Commands.executeCommand("W.EditorCommands.TreeItemMoved",{sourceItem:this._sourceItem,newIndex:this._sourceItemIndex})
}}}},_isInDragBoundaries:function(a){var b=Math.min(this._dragContainerSize.y,this._scrollContainer.clientHeight);
var c=a-this._scrollContainerPosition.y;
if(c<0){if(this._isInScroll()){this._scrollUp()
}return false
}if(c>b){if(this._isInScroll()){this._scrollDown()
}return false
}clearTimeout(this._scrolldelay);
return true
},_scrollUp:function(){if(this._scrollContainer.scrollTop>0){this._scrollContainer.scrollTop-=10;
this._scrolldelay=setTimeout(this._scrollUp,500)
}else{clearTimeout(this._scrolldelay)
}},_scrollDown:function(){if(this._scrollContainer.scrollTop+this._scrollContainer.clientHeight<this._dragContainerSize.y){this._scrollContainer.scrollTop+=10;
this._scrolldelay=setTimeout(this._scrollDown,500)
}else{clearTimeout(this._scrolldelay)
}},_isInScroll:function(){if(this._scrollContainer.clientHeight-parseInt(this._scrollContainer.getStyle("padding-bottom"))==this._dragContainerSize.y){return false
}return true
},_onItemDrop:function(){this._setItemsOpacity();
this._duringDrag=false;
this._draggedItem.dispose();
var a=$$("body");
a.removeEvents(Constants.CoreEvents.MOUSE_MOVE);
a.removeEvents(Constants.CoreEvents.MOUSE_UP);
W.Commands.executeCommand("W.EditorCommands.TreeItemDrop",{sourceItem:this._sourceItem});
this._dragSubItem=false
},_setItemsOpacity:function(){this._sourceItem.getViewNode().set("styles",{opacity:"1"});
for(var a=0;
a<this._subItems.length;
a++){this._subItems[a].getViewNode().set("styles",{opacity:"1"})
}},disableSelection:function(a){if(typeof a.onselectstart!="undefined"){a.onselectstart=function(){return false
}
}else{if(typeof a.style.MozUserSelect!="undefined"){a.style.MozUserSelect="none"
}}}}});
W.Components.newComponent({name:"wysiwyg.editor.components.panels.navigation.TreeStructureEditor",skinParts:{container:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["createTreeItemsFromDataItems","_createSingleTreeItem","_onButtonReady","updatePanel","_reorderTree"],initialize:function(c,a,b){this.parent(c,a,b);
var d=W.Classes.get("wysiwyg.editor.components.panels.navigation.TreeStructureDragHandler");
this._dragHandler=new d();
W.Commands.registerCommandAndListener("W.EditorCommands.TreeItemMoved",this,this._reorderTree);
W.Commands.registerCommandAndListener("W.EditorCommands.TreeItemStateChanged",this,this._ItemStateChanged);
W.Commands.registerCommandAndListener("W.EditorCommands.TreeItemDrop",this,this._executeDataReorder)
},_onAllSkinPartsReady:function(){this._treeButtons=[]
},setScrollContainer:function(a){this._scrollContainer=a
},setSingleItemComponentType:function(a,b){this._itemCompName=a;
this._compSkin=b
},createTreeItemsFromDataItems:function(c,f,a){for(var e=0;
e<c.length;
e++){var d=c[e];
this._createSingleTreeItem(d,f,a);
var b=d.get("items");
if(b&&b.length>0){this.createTreeItemsFromDataItems(b,f+1,d)
}}},_createSingleTreeItem:function(b,c,a){return this.injects().Components.createComponent(this._itemCompName,this._compSkin,b,null,null,function(d){this._onButtonReady(d,c,a)
}.bind(this))
},updatePanel:function(e){var d=e.cause;
var c=e.item;
var a=e.parentItem;
if(d=="CREATED_AND_ADDED"){this._addItemToTree(c,a)
}else{if(d=="DELETE"){this._removeItemFromTree(c)
}else{if(d=="MOVE"){var b=e.newIndex;
this._moveItemInTree(c,a,b)
}}}},_addItemToTree:function(b,a){var c=this._data.getItemLevel(b);
this._createSingleTreeItem(b,c,a);
if(!a){this._addedNew=true
}},_removeItemFromTree:function(d){var e=this._findButtonByData(d);
if(!e){return
}var c=this._findButtonIndex(e);
var a=this._getSubItems(e);
if(a&&a.length>0){for(var b=0;
b<a.length;
b++){var f=a[b];
f.setAsParentItem()
}}this._treeButtons.erase(e);
e.dispose();
this.drawPanel()
},_moveItemInTree:function(e,a,b){if(!this._moveDoneInPanel){var f=this._findButtonByData(e);
var d=this._findButtonIndex(f);
this._reorderSingleItem(f,b,d);
var c=this._findButtonByData(a);
if(f.isSubItem()&&!c){f.setAsParentItem()
}}else{this._moveDoneInPanel=false
}},_onButtonReady:function(d,b,a){this._updateButtons(d,b,a);
if(this._treeButtons.length==this._data.getAllItems().length){this.drawPanel()
}var c=function(h){this._setDragContainerOnce();
this._dragHandler.setScrollContainer(this._scrollContainer);
var g=this._findButtonIndex(d);
var f=this._getSubItems(d);
if(d.isSubItem()&&!this._isLastSubItem(g)){this._dragHandler.forceToBeSubItem(true)
}else{this._dragHandler.forceToBeSubItem(false)
}this._dragHandler.onItemDrag(h,d,g,f)
}.bind(this);
d.registerDragHandler(c)
},_updateButtons:function(e,c,a){if(a){e.setAsSubItem();
var f=this._findButtonByData(a);
var d=this._findButtonIndex(f);
var b=this._getSubItems(f).length;
this._treeButtons.splice(d+b+1,0,e)
}else{this._treeButtons.push(e)
}},_getSubItems:function(d){if(d.isSubItem()){return[]
}var c=this._findButtonIndex(d);
var a=[];
for(var b=c+1;
b<this._treeButtons.length;
b++){if(!this._treeButtons[b].isSubItem()){break
}else{a.push(this._treeButtons[b])
}}return a
},drawPanel:function(){var a=this._scrollContainer.scrollTop;
this._skinParts.container.empty();
for(var b=0;
b<this._treeButtons.length;
b++){this._treeButtons[b]._view.insertInto(this._skinParts.container)
}if(this._addedNew){this._scrollContainer.scrollTop=this._skinParts.container.clientHeight-this._scrollContainer.clientHeight;
this._addedNew=false
}else{this._scrollContainer.scrollTop=a
}},_locateDropIndexes:function(e,h){var b=[];
var a=this._findButtonIndex(e);
var d=e.isSubItem();
var g=this._getSubItems(e);
if(d||(!d&&g.length==0)){for(var f=0;
f<this._treeButtons.length;
f++){b.push(f)
}return b
}if(h=="UP"){for(var c=0;
c<this._treeButtons.length;
c++){var k=this._treeButtons[c];
if(!k.isSubItem()){b.push(c)
}}}else{for(var c=0;
c<this._treeButtons.length;
c++){var l=a+g.length;
if(c<=a||c>l){var k=this._treeButtons[c];
if((this._getSubItems(k).length==0&&!k.isSubItem())||(k.isSubItem()&&this._isLastSubItem(c))){b.push(c)
}}}}return b
},_reorderTree:function(c){var e=c.sourceItem;
var b=c.newIndex;
var a=this._getSubItems(e)||[];
var d=this._findButtonIndex(e);
if(a.length==0){this._reorderSingleItem(e,b,d)
}else{this._reorderWithSubItems(e,b,d)
}this._dragHandler.setSourceItemIndex(b);
this.drawPanel()
},_reorderWithSubItems:function(f,c,e){var a=this._getSubItems(f)||[];
var d;
var b;
if(c>e){d=this._locateDropIndexes(f,"DOWN");
b=c+a.length
}else{d=this._locateDropIndexes(f,"UP");
b=c
}if(!d.contains(b)){return
}this._moveSingleItem(b,e);
this._reorderSubItems(a,b,e)
},_reorderSubItems:function(a,c,d){if(c<d){for(var b=0;
b<a.length;
b++){this._moveSingleItem(c+b+1,d+b+1)
}}else{for(var b=0;
b<a.length;
b++){this._moveSingleItem(c,d)
}}},_reorderSingleItem:function(d,a,c){var b=this._treeButtons[a];
if(!b){return
}if(!d.isSubItem()&&(b.isSubItem()||this._getSubItems(b).length>0)){this._dragHandler.setAsSubItem(true)
}this._moveSingleItem(a,c);
if(d.isSubItem()){if(a==0){this._dragHandler.setAsParentItem()
}if(this._isLastSubItem(a)){this._dragHandler.forceToBeSubItem(false)
}else{this._dragHandler.forceToBeSubItem(true)
}}},_moveSingleItem:function(a,b){this._treeButtons.splice(a,0,this._treeButtons.splice(b,1)[0])
},_ItemStateChanged:function(c){var d=c.sourceItem;
var a=c.isSubItem;
var b=this._findButtonIndex(d);
if(a){this._treeButtons[b].setAsSubItem()
}else{this._treeButtons[b].setAsParentItem()
}},_executeDataReorder:function(d){var j=d.sourceItem;
var a=this._findButtonIndex(j);
var g;
if(j.isSubItem()){this._treeButtons[a].setAsSubItem();
var b=this._getParentButton(a);
g=b.getDataItem();
var e=this._findButtonIndex(b);
a=a-e-1
}else{var h=0;
this._treeButtons[a].setAsParentItem();
for(var f=a-1;
f>=0;
f--){var c=this._treeButtons[f];
if(c.isSubItem()){h++
}}a=a-h
}this._moveDoneInPanel=true;
W.Commands.executeCommand("W.EditorCommands.TreeItemMoveComplete",{sourceItem:j,parentData:g,index:a})
},_getParentButton:function(c){for(var b=c-1;
b>=0;
b--){var a=this._treeButtons[b];
if(!a.isSubItem()){return a
}}},_isLastSubItem:function(d){var a=this._getParentButton(d);
var b=this._findButtonIndex(a);
for(var c=b+1;
c<this._treeButtons.length;
c++){if(c==d&&(!this._treeButtons[c+1]||!this._treeButtons[c+1].isSubItem())){return true
}}return false
},_findButtonIndex:function(b){for(var a=0;
a<this._treeButtons.length;
a++){if(this._treeButtons[a]==b){return a
}}},_findButtonByData:function(a){for(var b=0;
b<this._treeButtons.length;
b++){if(this._treeButtons[b].getDataItem()==a){return this._treeButtons[b]
}}},getTreeButtons:function(){return this._treeButtons
},_setDragContainerOnce:function(){if(!this._dragContainerSet){this._dragHandler.setDragContainer(this._skinParts.container);
var a=this._skinParts.container.getPosition();
if(a.y!=0||a.x!=0){this._dragContainerSet=true
}}},getAcceptableDataTypes:function(){return["Menu",""]
}}});
Constants.RichText={ALLOWED_FONTS:["font_0","font_1","font_2","font_3","font_4","font_5","font_6","font_7","font_8","font_9","font_10"],MAX_LIMIT:50000};
W.Components.newComponent({name:"wysiwyg.editor.components.richtext.WRichTextEditor",imports:["mobile.core.components.base.BaseComponent"],skinParts:{editor:{type:"htmlElement"},toolbar:{type:"htmlElement"},editorDisableLayer:{type:"htmlElement"}},Class:{Extends:"mobile.core.components.base.BaseComponent",Binds:["createEditor","destroy","_addCss","_ckEditorReady","_ckEditorUiReady","_ckEditorChange","_ckEditorLinkSelected","_openLinkDialog","_keyHandler"],_states:["noResize","onResize"],_getCkEditorSettings:function(){var a={docType:"<!DOCTYPE HTML>",removePlugins:"elementspath,contextmenu,resize,link,stylescombo,styles",disableNativeSpellChecker:false,extraPlugins:"autogrow,onchange,wixlink,wixstylescombo,wixstyles",autoGrow_onStartup:false,autoGrow_minHeight:0,autoGrow_maxHeight:0,contentsCss:[this.injects().Config.getServiceTopologyProperty("scriptsRoot")+"/css/wysiwyg/viewerWeb.css",this.injects().Preview.getPreviewManagers().Css.getUsedFontsUrl()],coreStyles_bold:{element:"span",attributes:{"class":"bold"},childRule:this._childRuleMethod("coreStyles_bold")},coreStyles_italic:{element:"span",attributes:{"class":"italic"},childRule:this._childRuleMethod("coreStyles_italic")},coreStyles_underline:{element:"span",attributes:{"class":"underline"},childRule:this._childRuleMethod("coreStyles_underline")},justifyClasses:["alignLeft","alignCenter","alignRight","alignJustify"],colorButton_foreStyle:{element:"span",attributes:{"class":"#(color)"},overrides:[{element:"span",attributes:{"class":/color.*/}}],childRule:this._childRuleMethod("colorButton_foreStyle")},toolbarCanCollapse:false,forcePasteAsPlainText:true,stylesSet:CKEDITOR.stylesSet.get("styles"),colorButton_colors:this._getRichTextColors(),colorButton_enableMore:false,skin:"kama",language:window.wixEditorLangauge||"en",pasteFromWordRemoveFontStyles:false,autoUpdateElement:true,enterMode:CKEDITOR.ENTER_P,toolbar:[{name:"styles",items:["Styles","TextColor"]},{name:"basicstyles",items:["Bold","Italic","Underline"]},{name:"align",items:["JustifyBlock","JustifyLeft","JustifyCenter","JustifyRight","-","BidiLtr","BidiRtl"]},{name:"paragraph",items:["BulletedList","NumberedList"]},{name:"link",items:["WixLink"]}]};
return a
},_lockCreation:function(a){this._locked=a
},_childRuleMethod:function(a){return function(b){return(!CKEDITOR.config[a].childRule||CKEDITOR.config[a].childRule(b))&&this._isNotFontElement(b)
}.bind(this)
},_isNotFontElement:function(a){return(!a||!a.getAttribute("class")||a.getAttribute("class").indexOf("font")<0)
},setPositioning:function(c,b,a){this._skinParts.editor.setStyles({top:c.y+"px",left:c.x+"px",width:b+"px",height:a+"px"});
this._skinParts.editorDisableLayer.setStyles({top:c.y+"px",left:c.x+"px",width:b+"px",height:a+"px"})
},createEditor:function(h,c,a,g){c=c||"richTextToolbar";
a=a||function(){};
g=g||function(){};
this._initialScrollPosition=window.getScroll().y;
this.setState("noResize");
if(this._locked){return
}this._lockCreation(true);
this.defaultFontStyle=h.getData().defaultStyle;
this._editorHeight=parseInt(this._skinParts.editor.getStyle("height"),10);
this._initialHeight=this._editorHeight;
this.setDataItem(h);
this._skinParts.editor.set("html",h.get("text"));
var d=this._skinParts.editor;
var f=this._getCkEditorSettings();
f.width=parseInt(this._skinParts.editor.getStyle("width"),10)+12;
f.height=this._editorHeight;
f.autoGrow_minHeight=this._editorHeight;
f.stylesSet=this._getRichTextStyles();
f.sharedSpaces={top:c};
this.editor=CKEDITOR.replace(d,f);
var b=function(i){this._ckEditorReady(i);
a(i)
}.bind(this);
CKEDITOR.on("instanceReady",b);
var e=function(i){this._ckEditorUiReady(i);
g(i)
}.bind(this);
CKEDITOR.ui.on("ready",e)
},_ckEditorReady:function(f){this._css=this._getThemeCssClassesString();
this.editor=f.editor;
var c=this.editor.element.$;
this.editor.document.appendStyleText(this._css);
var b="body { background-color: transparent !important; height:auto !important}html{height:auto !important}ul {list-style: disc inside;}ol {list-style: decimal inside;}li {margin-bottom: 12px;}";
this.editor.document.appendStyleText(b);
$$(this.editor.container.$)[0].getElements("iframe").setProperty("scrolling","no");
var a={top:parseInt(c.getStyle("top"),10),left:parseInt(c.getStyle("left"),10)};
this.editor.container.$.setStyles({visibility:"visible",top:a.top+"px",left:a.left+"px",padding:"0 !important",position:"absolute",outline:"0 !important"});
var e=this._skinParts.toolbar;
e.addEvent("dblclick",function(h){h.stopPropagation()
});
e.addEvent("mousedown",function(h){h.stopPropagation()
});
e.setStyles({visibility:"visible",top:-40,left:0,width:475});
this.editor.on("change",this._ckEditorChange);
this.editor.on("key",this._keyHandler);
this.editor.on("wixLinkOpen",this._ckEditorLinkSelected);
var d=this.editor.document.$.defaultView;
d.ondragover=this._preventDragDefault;
d.ondragenter=this._preventDragDefault;
d.ondrop=this._disableEvent;
this.editor.dataProcessor.htmlFilter.addRules({elements:{span:function(h){if((!h.children||h.children.length==0)&&(h.attributes&&Object.getLength(h.attributes)>0)){h.children=[];
h.children.push(new CKEDITOR.htmlParser.text("\u200B"))
}}}});
if(CKEDITOR.env.webkit){this.editor.document.$.execCommand("styleWithCSS",true)
}var g=window.getScroll().y;
if(this._initialScrollPosition!=g){window.scrollTo(0,this._initialScrollPosition)
}},_placeCursorAtTheEnd:function(){var a=this.editor.document.getBody().$;
var c=Element.getLast(a,'span[class^="font"]');
if(!c){c=Element.getLast(a,"p")
}if(!c){c=a
}var b=c.childNodes.length;
this._placeSelectionAt(c,b,c,b)
},_disableEvent:function(a){a.cancelBubble=true;
a.stopPropagation();
a.preventDefault();
return false
},_preventDragDefault:function(a){if(a.dataTransfer&&a.dataTransfer.effectAllowed&&a.dataTransfer.dropEffect){a.dataTransfer.effectAllowed="none";
a.dataTransfer.dropEffect="none"
}a.preventDefault()
},setWidth:function(b,a,d){if(this.getState()=="noResize"){this.setState("onResize")
}if(b<0){return
}this.parent(b);
try{this._editorHeight=Math.max(this._editorHeight,this._editorMinHeight);
this.editor.resize(b,this._editorHeight,true)
}catch(c){}this._skinParts.editorDisableLayer.setStyle("width",b);
this._skinParts.editor.setStyle("width",b);
this._editorWidth=b
},setHeight:function(a){if(this.getState()=="noResize"){this.setState("onResize")
}if(a<0){return
}this.parent(a);
if(a<this._editorMinHeight){return
}try{this.editor.resize(this._editorWidth,a,true)
}catch(b){}this._skinParts.editorDisableLayer.setStyle("height",a);
this._skinParts.editor.setStyle("height",a);
this._editorHeight=a;
this._initialHeight=a
},setMinHeight:function(a){this._editorMinHeight=a
},stopResize:function(){this.setState("noResize")
},_ckEditorUiReady:function(){var d=$$("iframe[role='listbox']");
for(var b=0;
b<d.length;
b++){var c=d[b].contentWindow.document;
var a=this._getThemeCssClassesForMenuString();
this._addCss(c,a);
this._addCss(c,"a.cke_colorauto {display:none !important}")
}},_ckEditorChange:function(b){if(CKEDITOR.env.webkit){if(this.isDeleting){this._moveSelectionAnchorToParent()
}this._removeInlineStyle()
}this._surroundFreeTextWithSpan();
b.editor.updateElement();
var a=(parseInt(this.editor.document.$.documentElement.offsetHeight,10));
if(this._editorHeight!=a){this._data.set("text",this._skinParts.editor.get("html"));
this._editorHeight=a
}},_keyHandler:function(c){var b=c.data.keyCode;
this.isDeleting=b==8||b==46;
var a=c.editor.getData().length;
if(a>Constants.RichText.MAX_LIMIT&&!this.isDeleting){c.cancel();
return false
}},_surroundFreeTextWithSpan:function(){var c=this.editor.getSelection().getNative();
var b=this;
var a=Element.getElements(b.editor.document.$.body,"p, div, li, pre, td, dt, dd, h1, h2, h3, h4, h5, h6");
Array.forEach(a,function(d){var e=d.childNodes;
var f=Array.filter(e,function(g){return g.nodeType===CKEDITOR.NODE_TEXT
});
Array.forEach(f,function(k){var j;
if(b.isDeleting){var g=c.anchorNode;
var i=k.cloneNode();
j=b._applySelectionStyleToTextNode(i,g);
if(j.nodeType===CKEDITOR.NODE_TEXT){j=b._applyDefaultStyleToTextNode(k,b.defaultFontStyle)
}}else{j=b._applyDefaultStyleToTextNode(k,b.defaultFontStyle)
}var h;
if(c.isCollapsed&&c.anchorNode==k){h=c.anchorOffset
}d.replaceChild(j,k);
if(h){b._placeSelectionAt(j.firstChild,h,j.firstChild,h)
}})
})
},_applySelectionStyleToTextNode:function(c,a){var b=c;
if(a&&a.parentElement&&a.parentElement.className){var e=a.parentElement;
var d=e.className;
b=new Element("span",{"class":d});
b.adopt(c);
return this._applySelectionStyleToTextNode(b,e)
}else{return b
}},_applyDefaultStyleToTextNode:function(b,c){var a=new Element("span",{"class":c});
a.set("text",b.data);
return a
},_removeInlineStyle:function(){var a=Element.getElements(this.editor.document.$.body,"span[style]");
a.forEach(function(b){this.replaceElementWithItsChildNodes(b)
},this)
},replaceElementWithItsChildNodes:function(b){if(b.childNodes.length>0){var a=b.parentNode;
var c=b.childNodes[b.childNodes.length-1];
a.replaceChild(c,b);
while(b.childNodes.length>0){a.insertBefore(b.childNodes[0],c)
}}else{b.parentNode.removeChild(b)
}},_moveSelectionAnchorToParent:function(){var d=this.editor.document.$;
var c=d.getSelection();
if(c.type=="Caret"&&c.anchorOffset==0){var b=c.anchorNode.parentNode;
var a=Array.indexOf(b.childNodes,c.anchorNode);
this._placeSelectionAt(b,a,b,a)
}},_placeSelectionAt:function(c,e,g,a){var f=this.editor.document.$;
var b=f.createRange();
var d=f.getSelection();
b.setStart(c,e);
b.setEnd(g,a);
d.removeAllRanges();
d.addRange(b)
},_ckEditorLinkSelected:function(b){var a=b.data.element;
var c;
if(a){c=a.getAttribute("dataquery");
if(c){this.injects().Preview.getPreviewManagers().Data.getDataByQuery("#"+c,this._openLinkDialog)
}}else{this._openLinkDialog(null,null)
}},_openLinkDialog:function(b,c){this.editor.getSelection().lock();
if(!b){var d=this.injects().Preview.getPreviewManagers().Data.addDataItemWithUniqueId("#Link",{type:"TextLink"});
b=d.dataObject;
c=d.id
}else{c=b.getData().id
}this.injects().Commands.executeCommand("WEditorCommands.OpenLinkDialogCommand",{position:Constants.DialogWindow.POSITIONS.CENTER,previewComponent:this._previewComponent,data:b,state:b.get("linkType")||Constants.LinkState.NO_LINK,closeCallback:a.bind(this)});
function a(h,f,g){this.editor.focus();
this.editor.getSelection().unlock();
if(g.result==W.EditorDialogs.DialogButtons.CANCEL){return
}b.copySchemaFieldsFrom(f);
if(h==Constants.LinkState.NO_LINK){c=null;
b=null;
try{this.editor.fire("wixLinkApply",{removeAttributes:["dataQuery","href","target"]})
}catch(i){}}else{try{this.editor.fire("wixLinkApply",{attributes:{dataQuery:c}})
}catch(i){}}this.editor.updateElement();
this._data.set("text",this._skinParts.editor.get("html"))
}},_addCss:function(c,b){var a=c.createElement("style");
a.type="text/css";
if(a.styleSheet){a.styleSheet.cssText=b
}else{a.appendChild(c.createTextNode(b))
}c.getElementsByTagName("head")[0].appendChild(a)
},destroy:function(){if(this.editor){try{this._skinParts.toolbar.setStyle("visibility","hidden");
CKEDITOR.remove(this.editor);
this.editor.destroy();
this._data.set("text",this._skinParts.editor.get("html"))
}catch(c){LOG.reportError(wixErrors.CKEDITOR__FAILED_DESTROY,this.className,"destroy");
this._skinParts.toolbar.setStyle("visibility","hidden")
}finally{var d=this._skinParts.toolbar.children;
for(var b=0;
b<d.length;
b++){this._skinParts.toolbar.removeChild(d[b])
}if(this._view){var a=this._view.getChildren('span[id^="cke_editor"]');
for(var b=0;
b<a.length;
b++){this._view.removeChild(a[b])
}}this._lockCreation(false)
}}},_getRichTextStyles:function(){var h=[];
var a=this.injects().Preview.getPreviewManagers().Theme;
var d=a.getPropertiesAccordingToType("font");
var g="";
for(var f=0;
f<d.length;
f++){if(Constants.RichText.ALLOWED_FONTS.contains(d[f])){var c=a.getProperty(d[f]);
var j=c.getSize();
var e=c.getColor();
var b={};
b.name=this.injects().Resources.get("EDITOR_LANGUAGE",d[f].toUpperCase()+"_LABEL");
b.element="span";
b.attributes={"class":d[f]};
b.overrides=[{element:"span",attributes:{"class":/font.*|color.*|bold|italic|underline/}}];
b.color=e;
b.size=j;
h.push(b)
}}return h
},_getRichTextColors:function(){var a=this.injects().Preview.getPreviewManagers().Theme;
var h=Constants.Theme.COLOR_SUB_PALETTE_SIZE;
var k=a.getPropertiesAccordingToType("color");
var c=Constants.Theme.COLOR_PALETTE_INDEX;
var l=((k.length-c)-1)/h;
var f="";
for(var d=0;
d<l;
d++){var g=0;
while(g<h){var j=d+(g*h)+c;
var e=k[j];
if(e.indexOf("color_")==0){var b=this._getColorDefString(e);
f+=b+","
}g++
}}f+=this._getColorDefString("color_1")+",";
f+=this._getColorDefString("color_2")+",";
f+=this._getColorDefString("color_3")+",";
f+=this._getColorDefString("color_4")+",";
f+=this._getColorDefString("color_5");
return f
},_getColorDefString:function(c){var b=this.injects().Preview.getPreviewManagers().Theme;
var a=b.getProperty(c).getHex(false).substring(1);
return c+"/"+a
},_getThemeCssClassesString:function(){var a=this.injects().Preview.getPreviewManagers();
var f=a.Theme;
var e=a.Css;
var g="";
var b=f.getPropertiesAccordingToType("font");
for(var d=0;
d<b.length;
d++){var h=e.getThemeGlobalPropertyCssDefinition(b[d],"font");
g+=h.selector+"{"+h.rules+"}"
}var c=f.getPropertiesAccordingToType("color");
for(var d=0;
d<c.length;
d++){if(c[d].indexOf("color_")==0){var h=e.getThemeGlobalPropertyCssDefinition(c[d],"color");
g+=h.selector+"{"+h.rules+"}"
}}return g
},_getThemeCssClassesForMenuString:function(){var c=this.injects().Preview.getPreviewManagers();
var a=c.Theme;
var h=c.Css;
var f="";
var b=a.getPropertiesAccordingToType("font");
for(var d=0;
d<b.length;
d++){var j=a.getProperty(b[d]);
j.setSize("14px");
var g={selector:"."+b[d],rules:"font:"+j.getCssValue()};
f+=g.selector+"{"+g.rules+"}"
}var e=a.getPropertiesAccordingToType("color");
for(var d=0;
d<e.length;
d++){if(e[d].indexOf("color_")==0){var g=h.getThemeGlobalPropertyCssDefinition(e[d],"color");
f+=g.selector+"{"+g.rules+"}"
}}return f
},getOriginalHeight:function(){return this._initialHeight
},getAcceptableDataTypes:function(){return["Text","RichText",""]
}}});
Constants.BindDataProvider={DATA_PROVIDER_CHANGED:"dataProviderChanged"};
W.Classes.newTrait({name:"wysiwyg.editor.components.traits.BindDataProvider",trait:{Binds:["_dataProviderUpdated"],initialize:function(){},bindToDataProvider:function(a){if(this._dataProvider){this._dataProvider.removeEvent(Constants.DataEvents.DATA_CHANGED,this._dataProviderUpdated)
}this._dataProvider=a;
this._dataProvider.addEvent(Constants.DataEvents.DATA_CHANGED,this._dataProviderUpdated);
this._dataProviderUpdated()
},getDataProvider:function(){return this._dataProvider
},getDataProviderItems:function(){return this._dataProvider.get("items")
},getDataProviderItem:function(a){return this._dataProvider.get("items")[a]
},_dataProviderUpdated:function(){this._isDataProviderValid(function(a){if(!a){LOG.reportError(wixErrors.INVALID_INPUT_BIND,this.className,"_dataProviderUpdated",this._dataProvider)();
return
}else{this._renderIfReady();
this.fireEvent(Constants.BindDataProvider.DATA_PROVIDER_CHANGED)
}}.bind(this))
},_isDataProviderValid:function(e){var l=this.getDataProviderItems();
if(!(typeOf(l)=="array")){return e(false)
}for(var h=0;
h<l.length;
h++){if(!(typeof l[h]=="object"||typeof l[h]=="string")){return e(false)
}}if(l.length){if(l[0]===Constants.SelectionListInput.BREAK_LINE){return e(false)
}if(typeof l[0]=="object"){var c=Object.keys(l[0]).sort();
for(h=1;
h<l.length;
h++){if(l[h]===Constants.SelectionListInput.BREAK_LINE){continue
}var b=Object.keys(l[h]).sort();
if(b.length!=c.length){return e(false)
}for(var g=0;
g<b.length;
g++){if(b[g]!=c[g]){return e(false)
}}}return e(true)
}else{if(typeof l[0]=="string"){var k;
var d;
var a=1;
if(l[0].indexOf("#")!=0){return e(false)
}if(l.length==1){return e(true)
}var f=this._dataProvider.getDataManager();
f.getDataByQuery(l[0],function(i){k=i;
d=i.getType();
for(h=1;
h<l.length;
h++){if(l[h].indexOf("#")!=0){return e(false)
}f.getDataByQuery(l[h],function(j){if(!j||j.getType()!=d){e(false)
}a++;
if(a==l.length){e(true)
}}.bind(this))
}}.bind(this))
}}}else{e(true)
}}}});
W.Classes.newTrait({name:"wysiwyg.editor.components.traits.BindValueToData",trait:{Extends:Events,Binds:["_updateInputFromDataField","_updateDataFieldFromInput","_updateInputFromDataObject","_updateDataObjectFromInput","_updateDataFilteredFieldFromInput","_updateInputFromDataFilteredFields","_updateDataFromInputRemappedFields","_updateInputFromDataRemappedFields"],initialize:function(){this._isPreset=true;
this._dataChangedHandler=this._trivialMethod;
this._inputChangedHandler=this._trivialMethod;
this.bindHooks()
},setValue:function(b,a){this._value=b;
this.fireEvent("inputChanged",{value:b})
},getValue:function(){return this._value
},bindToDataItemField:function(a,b){this._removeDataListeners();
this.setDataItem(a);
this.bindToField(b)
},bindToDataItemsFilteredFields:function(b,a){this._removeDataListeners();
this.setDataItem(b);
this._dataFieldsFilter=this.getFilterArray(a);
this.bindToFilteredFields(a)
},bindToFilteredFields:function(b){this._removeDataListeners();
var a=this.injects().Classes.get("mobile.core.managers.data.DataItemBase");
this._dataFieldsFilter=a.getFieldsFilterArray(b);
this._addListeners(this._updateInputFromDataFilteredFields,this._updateDataFilteredFieldFromInput);
this._dataChangedHandler()
},bindToDataItemsRemappedFields:function(b,a){this._removeDataListeners();
this.setDataItem(b);
this.bindRemappedFields(a)
},bindRemappedFields:function(a){this._removeDataListeners();
this._fieldsRemapping=a;
this._addListeners(this._updateInputFromDataRemappedFields,this._updateDataFromInputRemappedFields);
this._dataChangedHandler()
},_getRemappedData:function(d,c,b){var a={};
d=d||{};
Object.forEach(c,function(f,e){if(b){a[e]=d[f]
}else{a[f]=d[e]
}});
return a
},bindToDataItem:function(a){this._removeDataListeners();
this.setDataItem(a);
this._addListeners(this._updateInputFromDataObject,this._updateDataObjectFromInput);
this._dataChangedHandler()
},bindToField:function(a){if(this._data){this._removeDataListeners();
this._dataFieldName=a;
this._addListeners(this._updateInputFromDataField,this._updateDataFieldFromInput);
this._dataChangedHandler(this._data,a)
}else{LOG.reportError(wixErrors.INVALID_INPUT_BIND,this.className,"bindToField","data not set",a)
}},bindHooks:function(a,b){this._inputToDataHook=typeof a=="function"?a:this._trivialHook;
this._dataToInputHook=typeof b=="function"?b:this._trivialHook;
this._dataChangedHandler()
},setDataItem:function(a){this._removeDataListeners();
this.parent(a);
this._data=a;
this._isPreset=a&&!!a.getMeta("isPreset")
},_removeDataListeners:function(){if(this._data){this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._updateInputFromDataField);
this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._updateInputFromDataObject);
this._data.removeEvent(Constants.DataEvents.DATA_CHANGED,this._updateInputFromDataFilteredFields)
}this.removeEvents("inputChanged");
this._dataChangedHandler=this._trivialMethod;
this._inputChangedHandler=this._trivialMethod
},_addListeners:function(a,b){this._dataChangedHandler=a;
this._inputChangedHandler=b;
if(this._data){this._data.addEvent(Constants.DataEvents.DATA_CHANGED,a)
}this.addEvent("inputChanged",b)
},_addFilteredFieldsChangeListeners:function(){this._data.addEvent(Constants.DataEvents.DATA_CHANGED,this._updateInputFromDataFilteredFields);
this.addEvent("inputChanged",this._updateDataFilteredFieldFromInput)
},_trivialHook:function(a){return a
},_trivialMethod:function(){},_updateDataFieldFromInput:function(c){var b=this._inputToDataHook(this.getValue());
var a=this._data.get(this._dataFieldName);
if(b!==a){this._isPreset=false;
this._data.set(this._dataFieldName,b)
}},_hasInterestInDataChange:function(b,d,c){var a=this._isFieldIncludedInDataChange;
if(this._dataFieldName){return a(b,d,c,this._dataFieldName)
}if(this._fieldsRemapping){return Object.some(this._fieldsRemapping,function(f,e){return a(b,d,c,e)
})
}if(this._dataFieldsFilter){return this._dataFieldsFilter.some(function(e){return a(b,d,c,e)
})
}return true
},_isFieldIncludedInDataChange:function(b,d,c,a){return !d||(typeof d=="string"&&d==a)||(typeof d=="object"&&a in d)
},_updateInputFromDataField:function(b,e,c){if(this._hasInterestInDataChange(b,e,c)){var d=this._dataToInputHook(this._data.get(this._dataFieldName));
var a=this.getValue();
if(d!==a){this.setValue(d,this._isPreset)
}}},_updateInputFromDataObject:function(){if(this._data){var b=this._dataToInputHook(this._data.getData());
var a=this.getValue();
if(!this.injects().Utils.isEquivalent(a,b)){this.setValue(b,this._isPreset)
}}},_updateDataObjectFromInput:function(){this._isPreset=false;
var a=this._inputToDataHook(this.getValue());
var b=this.getDataItem().getData();
if(!this.injects().Utils.isEquivalent(b,a)){this.getDataItem().setData(a)
}},_updateDataFilteredFieldFromInput:function(){var b=this._inputToDataHook(this.getFilteredMap(this.getValue(),this._dataFieldsFilter));
var a=this._data.getFields(this._dataFieldsFilter);
if(this.hasNonEqualFields(this._dataFieldsFilter,a,b)){this._data.setFields(b)
}},_updateInputFromDataFilteredFields:function(c,f,d){if(this._hasInterestInDataChange(c,f,d)){var a=this._data.getFields(this._dataFieldsFilter);
var e=this._dataToInputHook(a);
var b=this.getValue();
if(this.hasNonEqualFields(this._dataFieldsFilter,b,e)){this.setValue(e,this._isPreset)
}}},_updateDataFromInputRemappedFields:function(){var b=this._inputToDataHook(this.getValue());
var a=this._getRemappedData(b,this._fieldsRemapping,true);
var c=this._data.getFields(a);
if(!this.injects().Utils.isEquivalent(c,a)){this._isPreset=false;
this._data.setFields(a)
}},_updateInputFromDataRemappedFields:function(b,f,d){if(this._data&&this._hasInterestInDataChange(b,f,d)){var g=this._data.getFields(this._fieldsRemapping);
var c=this._dataToInputHook(g);
var e=this._getRemappedData(c,this._fieldsRemapping);
var a=this.getValue();
if(!this.injects().Utils.isEquivalent(a,e)){this.setValue(e,this._isPreset)
}}},_preventRenderOnDataChange:function(a,c,b){return !this._hasInterestInDataChange(a,c,b)
},getFilteredMap:function(c,a){if(typeof c!="object"){return c
}var b={};
a.forEach(function(d){b[d]=c[d]
});
return b
},hasNonEqualFields:function(a,c,b){if(b==undefined||c==undefined){return true
}if(typeof b!="object"){return b!==c
}return a.some(function(d){return c[d]!==b[d]
})
},getFilterArray:function(a){if(a instanceof Array){return a
}var b=[];
for(var c in a){b.push(c)
}return b
}}});
W.Classes.newTrait({name:"wysiwyg.editor.components.traits.Draggable",trait:{Binds:["_dragStartMouseDownHandler"],initialize:function(){if(this._dragHandleSkinPart==null){LOG.reportError(wixErrors.SET_ALPHA_OF_NOT_COLOR_PROPERTY,"Draggable Trait","initialize",this)()
}var a=this._onAllSkinPartsReady.bind(this);
this._onAllSkinPartsReady=function(){this._skinParts[this._dragHandleSkinPart].addEvent("mousedown",this._dragStartMouseDownHandler);
a()
}.bind(this)
},_dragStartMouseDownHandler:function(g){var a=$$("body");
var h={x:g.client.x,y:g.client.y};
var d={x:this.getX(),y:this.getY()};
var c=function(l){var j=l.client.x;
var m=l.client.y;
var k=j-h.x;
var i=m-h.y;
this.setX(d.x+k);
this.setY(d.y+i)
}.bind(this);
var b=function(e){a.removeEvent(Constants.CoreEvents.MOUSE_MOVE,c);
a.removeEvent(Constants.CoreEvents.MOUSE_UP,b);
window.removeEvent(Constants.CoreEvents.BLUR,f)
}.bind(this);
var f=function(){window.removeEvent(Constants.CoreEvents.BLUR,f);
a.removeEvent(Constants.CoreEvents.MOUSE_MOVE,c);
a.removeEvent(Constants.CoreEvents.MOUSE_UP,b)
};
a.addEvent(Constants.CoreEvents.MOUSE_MOVE,c);
a.addEvent(Constants.CoreEvents.MOUSE_UP,b);
window.addEvent(Constants.CoreEvents.BLUR,f)
}}});
W.Classes.newTrait({name:"wysiwyg.editor.components.traits.FiltersDataByTags",trait:{filterEditorDataListByTags:function(c,a,b,e){var d=this.injects().Preview.getPreviewManagers().Data;
this.injects().Data.getDataByQuery(c,function(f){if(!d.isDataAvailable("#EDITOR_SETTINGS")){e(f.get(["items"]));
return
}d.getDataByQuery("#EDITOR_SETTINGS",function(g){var i=g.get(a);
if(!i||!i.isIntersecting){e(f.get(["items"]));
return
}var h=f.get(["items"]).filter(function(j){return j[b]&&g.get(a).isIntersecting(j[b])
});
e(h)
})
})
}}});
W.Classes.newTrait({name:"wysiwyg.editor.components.traits.TreeItem",trait:{isSubItem:function(){if(this.getState()=="subItem"){return true
}return false
},setAsSubItem:function(){this.setState("subItem")
},setAsParentItem:function(){this.setState("normal")
}}});
W.HtmlScriptsLoader.notifyScriptLoad();