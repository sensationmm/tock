

module.exports = {
	errorCheck: function(target) {
		var result = false;
		switch(target[0].type) {
			case 'text': 
			case 'number': 
			case 'tel':
			case 'textarea':
				if(!target.hasClass('dobpicker') && !target.hasClass('datepicker')) {
					if(target.val() !== '') {
						result = true;
					}
				} else {
					if(target.val() !== 'DD/MM/YYYY' && target.val() !== '') {
						result = true;
					}
				}
				break;
			case 'email': 
				if(target.val() !== '') {
					result = true;
				}
				break;
			case 'select-one': 
				if(!target.hasClass('bool')) {
					if(target.val() !== '0') {
						result = true;
					}
				} else {
					if(target.val() !== '-1') {
						result = true;
					}
				}
				
				break;
			default:
				result = 'not found';
				console.log(result);
				break;
		}
		return result;
	},
	formatRefCode: function(input) {
		if(input) {
			var split = input.match(/.{1,3}/g);
			var returnInput = '';
			split.forEach(function(item, index) {
				returnInput += item;
				if(item.length === 3 && index < 2) {
					returnInput += '-';
				}
			});
			return returnInput;
		}
	},
	formatMoney: function(input, showPound, c, d, t, j, i, s) {
		showPound = (showPound === undefined) ? true : undefined;
		c = isNaN(Math.abs(c)) ? 0 : Math.abs(c);
	    d = d === undefined ? "." : d;
	    t = t === undefined ? "," : t;
	    s = input < 0 ? "-" : "";
	    i = String(parseInt(input = Math.abs(Number(input) || 0).toFixed(c), 10));
	    j = ((i.length) > 3) ? i.length % 3 : 0;

	    var output = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(input - i).toFixed(c).slice(2) : "");


	    if(showPound) {
			output = '£' + output;
	    }

	    return output;
	}
};
