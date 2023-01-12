(function($, window, document, undefined) {
    $.widget("mobile.mmp", $.mobile.widget, {
        options:{
            text:'Multiple Month Picker',
            theme:'a',
            id:'mmp',
			months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			value: []
        },
		value: function(value) {
			if ( value === undefined ) {
				return this.options.value;
			}
	 
			this.options.value = value;
			this._values = ',' + value.join(',') + ',';
			this._check();
		},
		_currentYear: (new Date()).getFullYear(),
		_values : ',',
		_check: function() {
			var that = this;
			this.element.find('input').each(function() {
				if(that._values.indexOf(',' + $(this).val() + ',') >= 0) {
					$(this).prop('checked', true).checkboxradio('refresh');
				} else {
					$(this).prop('checked', false).checkboxradio('refresh');
				}
			});
		},
        _create:function() {
            this.element.css('text-align', 'center');
			
			this.element.append('<div id="mmp-header" data-role="controlgroup" data-type="horizontal"></div>');
			this.element.children('div').append('<button id="btnPreviousYear" data-iconpos="notext" data-icon="arrow-l">Previous year</button>');
			this.element.children('div').append('<button id="yearLabel" style="width: 150px;">' + this._currentYear + '</button>');
			this.element.children('div').append('<button id="btnNextYear" data-iconpos="notext" data-icon="arrow-r">Next year</button>');
			
			for(var i=0; i<4; i++) {
				this.element.append('<fieldset id="mmp-months-row-' + i + '" data-role="controlgroup" data-type="horizontal"></fieldset>');
				for(var j=0; j<3; j++) {
					var month = this._currentYear + '-' + this._zeros(1 + j + 3*i, 2);
					this.element.find('#mmp-months-row-' + i).append('<input type="checkbox" name="' + month + '" id="' + month + '" value="' + month + '" data-wrapper-class="mmp-month" />');
					this.element.find('#mmp-months-row-' + i).append('<label for="' + month + '" style="width: text-align: center;">' + this.options.months[j + 3*i] + '</label>');
				}
			}
			
			$('<style>.mmp-month { width: 100px; }</style>').appendTo('head');
			$('<style>.mmp-month > label { text-align: center; }</style>').appendTo('head');
			
			$('body').trigger('create');
			
			var that = this;
			
			this.element.find('#btnPreviousYear').click(function() {
				that._currentYear--;
				that.element.html('');
				that._create();

                
                if (arr!==undefined) {
                    arr.map((x) => {
                        x==[''] ? arr.shift() : $(`#mmp label[for=${x}]`).addClass('ui-btn-active');
                    });
                }
                if($('label.ui-checkbox-on').length > 1){
                    $('#mmp').mmp('value', []);
                    
                    that._values = ',';
                    that.options.value = [];
                    arr = [];
                }
                
			});			
			this.element.find('#btnNextYear').click(function() {
				that._currentYear++;
				that.element.html('');
				that._create();

                
                if (arr!==undefined) {
                    arr.map((x) => {
                        x==[''] ? arr.shift() : $(`#mmp label[for=${x}]`).addClass('ui-btn-active');
                    });
                }
                if($('label.ui-checkbox-on').length > 1 && arr!==undefined){
                    $('#mmp').mmp('value', []);
                    
                    that._values = ',';
                    that.options.value = [];
                    arr = [];
                }
                
			});
            
            var arr;
            var startValArr;
            let startY;
            let startM;
            var endValArr;
            let endY;
            let endM;
			
			this.element.children('fieldset').find('label').css('text-align', 'center');
			this.element.children('fieldset').find('input').click(function() {
				var value = $(this).val();

				if($(this).is(':checked')) {
					if(that._values.indexOf(',' + value + ',') < 0) {
						that._values += value + ',';
					}
				} else {
					if(that._values.indexOf(',' + value + ',') >= 0) {
						that._values = that._values.replace(',' + value + ',', ',');
					}
				}
				if(that._values == ',') {
					that.options.value = [];
				} else {
                    console.log('that._values', that._values);
					that.options.value = that._values.substring(1, that._values.length - 1).split(',');

					arr = that.options.value.sort();
                    startValArr = arr[0].substring(0, that._values.length - 2).split('-');
                    startY = startValArr[0];
                    startM = startValArr[1];
                    endValArr = arr[arr.length-1].substring(0, that._values.length - 2).split('-');
                    endY = endValArr[0];
                    endM = endValArr[1];

                    startY = parseInt(startY);
                    startM = parseInt(startM);
                    endY = parseInt(endY);
                    endM = parseInt(endM);

                    if (startY===endY) {
                        if (endM-startM>0){
                            let m = startM+1;
                            for(let i=1;i<endM-startM;i++){
                                arr.push(m<10 ? startY+'-0'+(startM+i) : startY+'-'+(startM+i));    
                                m++; 
                            }
                        } 
                    } else {
                        let m = startM+1;
                        for(let i=1;i<12-startM+1;i++){
                            arr.push(m<10 ? startY+'-0'+(startM+i) : startY+'-'+(startM+i));
                            m++; 
                        }
                        for(let i=1;i<endM;i++){
                            arr.push(i<10 ? endY+'-0'+i : endY+'-'+i);
                        }
                        while(startY<endY-1){
                            startY++;
                            for(let i=1;i<=12;i++){
                                arr.push(i<10 ? startY+'-0'+i : startY+'-'+i);
                            }
                        }
                    }
                    arr.filter((v, i) => arr.indexOf(v) === i);

                    that.options.value = arr.sort();
                    console.log(arr.sort());

                    
                    if (arr!==undefined) {
                        arr.map((x) => {
                            x==[''] ? arr.shift() : $(`#mmp label[for=${x}]`).addClass('ui-btn-active');
                        });
                    }
                    if($('label.ui-checkbox-on').length > 1){
                        $('#mmp').mmp('value', []);
                        
                        that._values = ',';
                        that.options.value = [];
                        arr = [];
                    }
                    
				}
			});
            if (arr!==undefined) {
                arr.map((x) => {
                    x==[''] ? arr.shift() : $(`#mmp label[for=${x}]`).addClass('ui-btn-active');
                });
            }
            if($('label.ui-checkbox-on').length > 1){
                $('#mmp').mmp('value', []);
                
                that._values = ',';
                that.options.value = [];
                arr = [];
            }

			this._check();
        },
		_zeros: function(text, size) {
			var temp = text + '';
			while(temp.length < size) {
				temp = '0' + temp;
			}
			return temp;
		}
    });
})(jQuery, window, document);