(function(){
	if(typeof global=="undefined"){
		 global={};
		 global.template={};
	};
	global.template=$.extend({},global.template,{
		modal:_.template(
					[
					'<div class="modal hide <%=type%>" id=<%=name%> tabindex="-1" role="dialog" aria-labelledby="<%=name%>Label" data-backdrop=false aria-hidden="true">',
					'<%if(options.header){%>',
					'	<div class="modal-header">',
'							<button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>',
					'	</div>',
					'<%}%>',
					'<%if(options.body){%>',
					'	<div class="modal-body">',
					'	</div>',
					'<%}%>',
					'<%if(options.footer){%>',
					'	<div class="modal-footer">',
					'	</div>',
					'<%}%>',
					'</div>'
					].join("")
		),
		modal_preview:_.template(
			[
'			<div class="modal hide large-modal preview-modal" id=<%=name%> tabindex="-1" role="dialog" aria-labelledby="previewLabel" aria-hidden="true">',
'			</div>',
			].join("")
		),
		list:_.template(
			[
'	      <div class="left-column">',
'	        <div class="column-hd">',
'	          <h3>分类目录</h3>',
'	        </div>',
'	        <div class="column-bd nanoscrollbar">',
'	          <div class="categories list-tree" id="contentstree">',
'	            <ul>',
'	              <li class="active">',
'					<div class="wraparea">',
'	                	<h4><a href="#">所有</a></h4>',
'					</div>',
'	              </li>',
'	              <li id="owner">',
'					<div class="wraparea">',
'	                <h4><a href="#">我的内容</a></h4>',
'					</div>',
'	              </li>',
'	              <li id="unset">',
'					<div class="wraparea">',
'	                <h4><a href="#">未分类</a></h4>',
'					</div>',
'	              </li>',
'				</ul>',
'	          </div>',
'	        </div>',
'	      </div>',
'	      <div class="right-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'	        <div class="column-bd nanoscrollbar list-content">',
'	          <table cellspacing="0" class="hascheckbox units hascover list">',
'	            <tbody>',
'	            </tbody>',
'	          </table>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_chapter:_.template(
			[
'	      <div class="left-column">',
'	        <div class="column-hd">',
'	          <h3>目录</h3>',
'	        </div>',
'	        <div class="column-bd nanoscrollbar">',
'	          <div class="categories list-tree" id="contentstree">',
'	            <ul>',
'				</ul>',
'	          </div>',
'	        </div>',
'	      </div>',
'	      <div class="right-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'	        <div class="column-bd nanoscrollbar list-content">',
'	          <table cellspacing="0" class="hascheckbox units hascover list">',
'	            <tbody>',
'	            </tbody>',
'	          </table>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_project:_.template(
			[
'	      <div class="left-column">',
'	        <div class="column-hd">',
'	          <h3>项目列表</h3>',
'	        </div>',
'	        <div class="column-bd nanoscrollbar">',
'	          <div class="categories list-tree" id="project">',
'	            <ul>',
'				</ul>',
'	          </div>',
'	        </div>',
'	      </div>',
'	      <div class="right-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'	        <div class="column-bd nanoscrollbar list-content">',
'	          <table cellspacing="0" class="hascheckbox nocover list">',
'	            <tbody>',
'	            </tbody>',
'	          </table>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_single:_.template(
			[
'	      <div class="main-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'        <div class="column-bd nanoscrollbar">',
'	          <div class="categories list-content">',
'	            <ul>',
'				</ul>',
'	          </div>',
'			</div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_single_1:_.template(
			[
'	      <div class="main-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'	        <div class="column-bd nanoscrollbar list-content">',
'	          <table cellspacing="0" class="hascheckbox hascover units list">',
'	            <tbody>',
'	            </tbody>',
'	          </table>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_single_1_nocover:_.template(
			[
'	      <div class="main-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'	        <div class="column-bd nanoscrollbar list-content">',
'	          <table cellspacing="0" class="hascheckbox nocover units list">',
'	            <tbody>',
'	            </tbody>',
'	          </table>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_single_1_nocheckbox:_.template(
			[
'	      <div class="main-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'	        <div class="column-bd nanoscrollbar list-content">',
'	          <table cellspacing="0" class="list">',
'	            <tbody>',
'	            </tbody>',
'	          </table>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_2:_.template(
			[
'	      <div class="left-column">',
'	        <div class="column-hd">',
'	          <h3>分类目录</h3>',
'	        </div>',
'	        <div class="column-bd nanoscrollbar">',
'	          <div class="categories list-tree" id="contentstree">',
'	            <ul>',
'	              <li class="active">',
'					<div class="wraparea">',
'	                	<h4><a href="#">所有</a></h4>',
'					</div>',
'	              </li>',
'				</ul>',
'	          </div>',
'	        </div>',
'	      </div>',
'	      <div class="right-column">',
'	        <div class="column-hd list-menu">',
'	        </div>',
'	        <div class="column-bd nanoscrollbar">',
' 		         <div class="categories list-content"></div>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_3:_.template(
			[
'	      <div class="left-column">',
'	        <div class="column-hd">',
'	          <h3>分类目录</h3>',
'	        </div>',
'	        <div class="column-bd nanoscrollbar">',
'	          <div class="categories list-tree" id="contentstree">',
'	            <ul>',
'	              <li class="active">',
'					<div class="wraparea">',
'	                	<h4><a href="#">所有</a></h4>',
'					</div>',
'	              </li>',
'				</ul>',
'	          </div>',
'	        </div>',
'	      </div>',
'	      <div class="right-column">',
'			<div class="column-hd list-menu">',
'        		<h3>内容分类</h3>',
 '      			 <div style="position:absolute; top:8px; right:30px; font-size:12px; line-height:20px;">',
 '         		<input type="checkbox" value="checked_children">',
 '         		勾选子分类</div>',
 '     		</div>',
'	        <div class="column-bd nanoscrollbar">',
' 		         <div class="categories list-content"></div>',
'	        </div>',
'	        <div class="column-ft list-page">',
'	        </div>',
'	      </div>',
			].join("")
		),
		list_left:_.template(
			[
			'	<ul>',
'	              <li class="active">',
'	                <h4><a href="#">所有</a></h4>',
'	              </li>',
'	              <li id="owner">',
'	                <h4><a href="#">我的内容</a></h4>',
'	              </li>',
'	              <li id="unset">',
'	                <h4><a href="#">未分类</a></h4>',
'	              </li>',
'				</ul>',
			].join("")
		),
		list_menu:_.template(
			[
'	          <table cellspacing="0" class="hascheckbox  units hascover list">',
'	            <thead>',
'	              <tr>',
'	                <th scope="col" width="5%"><input type="checkbox" value="selectall"></th>',
'	                <th scope="col" colspan="2">标题</th>',
'	                <th scope="col" width="12%">创建时间</th>',
'	              </tr>',
'	            </thead>',
'	          </table>',
			].join("")
		),
		list_menu1:_.template(
			[
'	          <table cellspacing="0" class="hascheckbox list">',
'	            <thead>',
'	              <tr>',
'	                <th scope="col" width="5%"></th>',
'	                <th scope="col" colspan="2">标题</th>',
'	              </tr>',
'	            </thead>',
'	          </table>',
			].join("")
		),
		ref_menu:_.template(
			[
'	          <table cellspacing="0" class="hascheckbox list">',
'	            <thead>',
'	              <tr>',
'	                <th scope="col" width="5%"><input type="checkbox" value="selectall"></th>',
'	                <th scope="col" colspan="2">标题</th>',
'	                <th scope="col">类型</th>',
'	              </tr>',
'	            </thead>',
'	          </table>',
			].join("")
		),
		update_menu:_.template(
			[
'	          <table cellspacing="0" class="hascheckbox list">',
'	            <thead>',
'	              <tr>',
'	                <th scope="col" width="5%"><input type="checkbox" value="selectall"></th>',
'	                <th scope="col" colspan="2">标题</th>',
'	                <th scope="col" width="12%">引用版本</th>',
'	                <th scope="col" width="12%">最新版本</th>',
'	              </tr>',
'	            </thead>',
'	          </table>',
			].join("")
		),
		list_page:_.template(
			[
'			  <div class="result-stats">共<%=numpages%>页，<%=sum%>条记录</div>',
'	          <div class="pagination pagination-centered">',
'	            <ul>',
'				 <% var startpage=global.get_page(page,numpages,10).start; var endpage=global.get_page(page,numpages,10).end; %>',
'	              <li <% var left=(page!=1&&numpages>1)?"":"class=disabled";%><%=left%>><a class="first" href="#">«</a></li>',
'	              <li <% var left=(page!=1&&numpages>1)?"":"class=disabled";%><%=left%>><a class="prev" href="#">‹</a></li>',
'				<% for(i=startpage;i<=endpage;i++){ %>',
'					<li <% var current=(i==page)?"class=active":""; %><%=current%>><a class="page" href="#"><%=i%></a></li>',
'				<% } %>',
'	              <li <% var right=(page!=numpages&&numpages>0)?"":"class=disabled";%><%=right%>><a class="next" href="#">›</a></li>',
'	              <li <% var right=(page!=numpages&&numpages>0)?"":"class=disabled";%><%=right%>><a class="last" href="#">»</a></li>',
'	            </ul>',
'	          </div>',
			].join("")
		),
		msg:_.template(
			[
'  			<div class="status <%=type%>">',
'   			 <p><%=global.dict.query(msg)%></p>',
 '   		<a href="#" class="close">Close</a></div>',
 			].join("")
		),
		preview:_.template(
			[
'	  <div class="modal-header">',
'	    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
'	    <h3><%=title%></h3>',
'	    <!--<div class="pages">1/7</div>-->',
'	  </div>',
'	  <div class="modal-body">', 
'	    <div class="preview-content"><%=preview%></div>',
// '	    <div class="more-info"><a href="javascript:void(0)">更多信息</a></div>',
// '	    <div class="info-mod" style="display: none;">',
// '	      <div class="info-hd">',
// '	        <h4><%=title%></h4>',
// '	        <div class="close"><a href="javascript:void(0)">Close</a></div>',
// '	      </div>',
// '	      <div class="info-bd">',
// '	        <%=description%>',
// '	      </div>',
// '	    </div>',
'	  </div>',
			].join("")
		),
		base_info:_.template(
		    [
				'    <div class="mod info-mod baseinfo" data-id="base_info" id="<%=id%>">',
				'      <div class="mod-hd">基本信息</div>',
				'      <div class="mod-bd">',
				'        <dl>',
				'          <!--<dt>预览图</dt>-->',
				'          <dd>',
				'            <div class="cover"><img src="<%=thumbnail%>" alt=""></div>',
				'          </dd>',
				'        </dl>',
				'        <dl class="inputform">',
				'          <dt>标题</dt>',
				'          <dd>',
				'            <p style="display: block;"><%=title%></p>',
				'        </dl>',
				'        <%if(typeof author!="undefined"){%><dl class="inputform">',
				'          <dt>作者</dt>',
				'          <dd>',
				'            <p class="empty" style="display: block;"><%=author%></p>',
				'        </dl><%}%>',
				'        <%if(typeof description!="undefined"){%><dl class="textareaform">',
				'          <dt>描述</dt>',
				'          <dd>',
				'            <p><%=description%></p>',
				'        </dl><%}%>',			
				'      </div>',
				'    </div>'
			].join("")
		),		
	   text_form:_.template(
	   	[
'	   	<% if(type=="text"){ %>',
'			<div class="editform" style="display: block;">',
'           <form onsubmit="javascript:return false;">',
'				<input name=<%=id%> type="text" style="width:234px;" value="<%= (text=="点击添加内容")?"":text%>" >',
'				<div>',
'					<button class="btn btn-small btn-confirm btn-primary action-save" type="submit">确认</button>',
'					<button class="btn btn-small action-cancel" style="margin-left:10px;" type="button">取消</button>',
'				</div>',
'            </form>',
'			</div>',
'		<% } else { %>',
'			<div class="editform" style="display: block;">',
'           <form onsubmit="javascript:return false;">',
'				<textarea name=<%=id%> style="width:234px;"><%=(text=="点击添加内容"?"":text)%></textarea>',
'				<div>',
'					<button class="btn btn-small btn-primary action-save" type="button">确认</button>',
'					<button class="btn btn-small action-cancel" style="margin-left:10px;" type="button">取消</button>',
'				</div>',
'            </form>',
'			</div>',
'		<% } %>',
	   	].join("")
	   ),
	   operate_modal:_.template(
	   	[
'		  <div class="modal-header">',
'		    <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>',
'		    <h3><%=title%></h3>',
'		  </div>',
'		  	<div class="modal-body">',
'		    <form class="form-horizontal">',
		'      <div class="control-group">',
		'        <label class="control-label" for="name" style="width:70px;">标题：</label>',
		'        <div class="controls" style="margin-left:80px;">',
		'          <input type="text" id="name" value="<%=name%>" disabled style="width:300px; margin-right:10px;">',
		'          <input type="hidden" id="transition" value="<%=transition%>">',
		'          <input type="hidden" id="objectid" value="<%=id%>">',		
		'        </div>',
		'      </div>',
		'      <div class="control-group" style="margin-bottom:0;">',
		'        <label class="control-label" for="chapterCode" style="width:70px;">说明：</label>',
		'        <div class="controls" style="margin-left:80px;">',
		'          <textarea id="comment" rows="4" style="width:300px;"></textarea>',
		'        </div>',
		'      </div>',
'		    </form>',
'			</div>',
'		  <div class="modal-footer">',
'		    <button class="btn btn-primary btn-confirm">确定</button>',
'		  </div>',
	   	].join("")
	   ),
	   confirm:_.template(
	   	[
'		  <div class="modal-header">',
'		    <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>',
'		    <h3>确认框</h3>',
'		  </div>',
'		  <div class="modal-body"> <span style="font-size:14px;"><%=msg%></span></div>',
'		  <div class="modal-footer">',
'		    <button class="btn btn-primary btn-confirm">确定</button>',
'		    <button aria-hidden="true" data-dismiss="modal" style="margin-left:20px;" class="btn btn-cancel">取消</button>',
'		  </div>',
	   	].join("")
	   ),
	});
	$('body').append(global.template.modal({name:'confirmModal',type:'small-modal',options:{}}));
})();
