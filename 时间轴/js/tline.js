

(function ($,moment) {
	moment.locale('zh-CN');
	var _Object = {
	    assign : null
	};
	if (Object.assign) {
	 	_Object.assign = Object.assign ;
	}else{
		_Object.assign = function(){
	        var resultObj = arguments.length ? arguments[0] : {};
	        for (var i = 1; i < arguments.length; i++) {
	            var curObj =  arguments[i];
	            for(var key in curObj){
	                resultObj[key] = curObj[key] ;
	            }
	        }
	        return resultObj;
	    }
	}

	function TLine(elStr,options){
		this.el = $(elStr);
		this.options = options;
		this.init();
	}
	TLine.prototype.init = function(){
		this.initOptions();
		this.initData();
		this.renderDom();
	};
	TLine.prototype.initOptions = function(){
		var defaultOptions = {
			data : [],
			order: 'down',
			hasToolBox: true,
			orderBtnTitle:'时间',
			tlineTitle:'跟踪进度'
		};
		if (this.options) {
			var newOptions = _Object.assign({},defaultOptions,this.options);
			this.options = JSON.parse(JSON.stringify(newOptions));
		}else{
			this.options = defaultOptions;
		}
	};
	TLine.prototype.initData = function(){
		this.options.data.sort(function(prev,next){
			return new Date(prev.date) - new Date(next.date);
		});
		for (var i = 0; i < this.options.data.length; i++) {
			var curData = this.options.data[i];
			var item = {
				day : moment(curData.date).format('YYYY-MM-DD'),
				time : moment(curData.date).format('HH:mm'),
				week : moment(curData.date).format('dddd'),
				content: curData.content
			};
			if (i == 0) item.type = 'first';
			if(curData.type) item.type = curData.type;
			this.options.data[i] = item;
		}
		if (this.options.order === 'up') this.options.data.reverse();
	};
	TLine.prototype.renderDom = function() {
		var _this = this;
		if (this.options.hasToolBox) {
			var $toolBox = $('<div class="tline-toolbox">\
				<div class="tline-orderbtn" title="切换顺序">\
					<div class="tline-orderbtn-title"><span></span></div>\
					<div class="tline-orderbtn-icon tline-order"><span></span></div>\
				</div>\
				<div class="tline-title"></div>\
	</div>');
			$toolBox.find(".tline-orderbtn-title span").text(this.options.orderBtnTitle);
			$toolBox.find(".tline-title").text(this.options.tlineTitle);
			$toolBox.find(".tline-orderbtn").on('click',function(){
				var orderStr = _this.options.order === 'down' ? 'up' : 'down';
				_this.changeOrder(orderStr);
			});
			this.el.append($toolBox);
		}
		if (this.options.data.length) {
			var data = this.options.data;
			$ul = $('<ul class="tline tline-order"></ul>');
			for (var i = 0; i < data.length; i++) {
				var curData = data[i];
				var $li = $('<li class="tline-item">\
			<div class="tline-date">\
				<span class="day"></span><span class="time"></span><span class="week"></span>\
			</div>\
			<div class="tline-line">\
				<span class="tline-bgline"></span><span class="tline-icon"></span>\
			</div>\
			<div class="tline-content-wrap">\
				<div class="tline-content"></div>\
			</div>\
		</li>');
			$li.find(".day").text(curData.day);
			$li.find(".time").text(curData.time);
			$li.find(".week").text(curData.week);
			$li.find(".tline-content").text(curData.content);
			if (curData.type) {
				var itemClass = 'tline-item-' + curData.type;
				$li.addClass(itemClass);
			}
				$ul.append($li);
			}
			this.el.append($ul);
		}else{
			var $div = $('<div class="tline-no-data">暂无数据</div>');
			this.el.append($div);
		}
		var orderClass = this.options.order === 'down'? 'tline-down' : 'tline-up';
		this.el.find('.tline-order').addClass(orderClass);
	};
	TLine.prototype.changeOrder = function(orderStr) {
		if (this.options.order !== orderStr) {
			this.options.order = orderStr;
			this.options.data.reverse();
			this.el.text('');
			this.renderDom();
		}
	};
	window.TLine = TLine;
})(jQuery,moment);