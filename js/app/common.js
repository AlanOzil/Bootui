// 请求公用地址
var ip = "http://" + window.location.host,
	port = window.location.port,
	ajaxUrl = "/Ashx/PostHandler.ashx?action=",
	msgIp = ip + port + ajaxUrl,
	filepath = ip + port + "/Ashx";

/**
 * post请求
 * @param url      请求地址
 * @param data     请求参数
 * @param callback 回调方法
 * @param format   返回数据类型
 */
function doPost(url, data, callback, callbackFormat) {
	$.post(url, data, function(data) {
		callback(data.data, data);
	}, callbackFormat || "json");
}

/**
 * get请求
 * @param url      请求地址
 * @param data     请求参数
 * @param callback 回调方法
 * @param format   返回数据类型
 */
function doGet(url, data, callback, callbackFormat) {
	$.get(url, data, function(data) {
		callback(data.data, data);
	}, callbackFormat || "json");
}

/** 
 * 判断是否null 
 * @param data 
 */
function isNull(data) {
	if (typeof(data) != "object") {
		data = "" + data;
	}
	return (JSON.stringify(data) == "{}" || data == "" || data == undefined || data == null || data == "undefined") ? true : false;
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt) { //author: meizz   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//将字符串格式的日期格式化为指定的日期String格式
// formatDate("2010-04-30", "yyyy-MM-dd HH:mm:ss");   
// formatDate("2010-4-29 1:50:00", "yyyy-MM-dd HH:mm:ss");
function formatDate(date, format) {
	if (!date) return;
	if (!format) format = "yyyy-MM-dd";
	switch (typeof date) {
		case "string":
			date = new Date(date.replace(/-/, "/").replace(/-/, "/"));
			break;
		case "number":
			date = new Date(date);
			break;
	}
	if (!date instanceof Date) return;
	var dict = {
		"yyyy": date.getFullYear(),
		"M": date.getMonth() + 1,
		"d": date.getDate(),
		"H": date.getHours(),
		"m": date.getMinutes(),
		"s": date.getSeconds(),
		"MM": ("" + (date.getMonth() + 101)).substr(1),
		"dd": ("" + (date.getDate() + 100)).substr(1),
		"HH": ("" + (date.getHours() + 100)).substr(1),
		"mm": ("" + (date.getMinutes() + 100)).substr(1),
		"ss": ("" + (date.getSeconds() + 100)).substr(1)
	};
	return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
		return dict[arguments[0]];
	});
}

//比较两个时间的前后
//var current_time = "2007-02-02 07:30";
//var stop_time = "2007-02-02 08:30";
//alert(CompareDate(current_time,stop_time));
//true---> d1>d2,d1在d2之后,false--->d1<d2，d1在d2之前
function CompareDate(d1, d2) {
	return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

// 从url中获取参数
// name为参数名称
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	//if (r != null) return unescape(r[2]);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}

//模态窗开关方法
//html（直接放入body结束标签之前）:
//  <div class="modal fade" tabindex="-1" role="dialog" id="modal">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title"></h4>
//       </div>
//       <div class="modal-body">
//         
//       </div>
//       <div class="modal-footer" style="display: none;">
//         <div style="text-align:left;"></div>
//       </div>
//     </div><!-- /.modal-content -->
//   </div><!-- /.modal-dialog -->
// </div><!-- /.modal -->
//js:
// onOff({
// 	modalId:'#modal',//必填,取决于HTML结构最外层父元素的id
// 	$controlBtn:$controlBtn,
// 	headerText:headerText,//默认为提示
// 	bodyText:bodyText,//默认提示内容
// 	footerText:'1234'//默认隐藏传参即显示参数内容,
// 	footerBtn:'<button>按钮</button>',也可放入按钮'<button>按钮</button>'
// 	footerText与footerBtn一般二者取其一
// 	refresh:false,//关闭后是否刷新，默认false
// });
function onOff(obj) {
	// $controlBtn,headerText,bodyText,footerText
	if (isNull(obj.modalId)) {
		throw new Error("onOff未填写modalId");
	}
	if (isNull(obj.headerText)) {
		obj.headerText == '提示：';
	}
	if (isNull(obj.bodyText)) {
		obj.bodyText == '内容&hellip;';
	}
	if (isNull(obj.refresh)) {
		obj.refresh == false;
	}
	$(obj.modalId).find('.modal-title').empty().html(obj.headerText);
	$(obj.modalId).find('.modal-title').css('color', '#b70002');
	$(obj.modalId).find('.modal-body').empty().html(obj.bodyText);
	$(obj.modalId).find('.modal-footer').empty();
	if (obj.footerText) {
		$(obj.modalId).find('.modal-footer').append('<div style="text-align:left;"></div></div>');
		$(obj.modalId).find('.modal-footer').css('display', 'block');
		$(obj.modalId).find('.modal-footer div').empty().html(obj.footerText);
		$(obj.modalId).find('.modal-footer div').css('color', '#b70002');
	} else if (obj.footerBtn) {
		$(obj.modalId).find('.modal-footer').css('display', 'block');
		$(obj.modalId).find('.modal-footer').append(obj.footerBtn);
	}
	$(obj.$controlBtn).attr('data-toggle', 'modal');
	$(obj.$controlBtn).attr('data-target', obj.modalId);
	if (obj.refresh) {
		$(obj.modalId).on('hidden.bs.modal', function(e) {
			$(obj.$controlBtn).attr('data-toggle', '');
			$(obj.$controlBtn).attr('data-target', '');
			location.reload();
		});
	}
}

//localStorage兼容IE8处理
if (typeof(localStorage) == 'undefined')

{
	var box = document.body || document.getElementsByTagName("head")[0] || document.documentElement;

	userdataobj = document.createElement('input');

	userdataobj.type = "hidden";

	userdataobj.addBehavior("#default#userData");

	box.appendChild(userdataobj);

	//设定对象  



	var localStorage = {

		setItem: function(nam, val) {
			userdataobj.load(nam);

			userdataobj.setAttribute(nam, val);

			var d = new Date();

			d.setDate(d.getDate() + 700);

			userdataobj.expires = d.toUTCString();

			userdataobj.save(nam);

			userdataobj.load("userdata_record");

			var dt = userdataobj.getAttribute("userdata_record");

			if (dt == null) dt = '';

			dt = dt + nam + ",";

			userdataobj.setAttribute("userdata_record", dt);

			userdataobj.save("userdata_record");
		},

		//模拟 setItem



		getItem: function(nam) {
			userdataobj.load(nam);

			return userdataobj.getAttribute(nam);
		},

		//模拟 getItem



		removeItem: function(nam) {
			userdataobj.load(nam);

			clear_userdata(nam)

			userdataobj.load("userdata_record");

			var dt = userdataobj.getAttribute("userdata_record");

			var reg = new RegExp(nam + ",", "g");

			dt = dt.replace(reg, '');

			var d = new Date();

			d.setDate(d.getDate() + 700);

			userdataobj.expires = d.toUTCString();

			userdataobj.setAttribute("userdata_record", dt);

			userdataobj.save("userdata_record");

		},

		//模拟 removeItem



		clear: function() {
			userdataobj.load("userdata_record");

			var dt = userdataobj.getAttribute("userdata_record").split(",");

			for (var i in dt)

			{
				if (dt[i] != '') clear_userdata(dt[i])
			}

			clear_userdata("userdata_record")

		}

		//模拟 clear();



	}

	function clear_userdata(keyname) //将名字为keyname的变量消除

	{
		var keyname;

		var d = new Date();

		d.setDate(d.getDate() - 1);

		userdataobj.load(keyname);

		userdataobj.expires = d.toUTCString();

		userdataobj.save(keyname);

	}

}