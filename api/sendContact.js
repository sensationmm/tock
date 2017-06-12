var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	sendEmail: function(name,email,message) {
		var encodedName = encodeURIComponent(name);
		var encodedEmail = encodeURIComponent(email);
		var encodedMessage = encodeURIComponent(message);

		var requestParams = '?name='+encodedName+'&email='+encodedEmail+'&message='+encodedMessage;

		var requestUrl = `${ENDPOINTS.API_DOMAIN}/sendContact`+requestParams;

		return axios({
			method: 'get',
			url: requestUrl,
			// auth: {
			//     username: 'tockserver',
			//     password: 'K3mistry'
			//   },
		}).then(function(response) {
			if(response.data.Message) {
				return response.data.Message;
			} else {
				return 'Unable to send message';
			}

		}, function(response) {
			throw new Error('Unable to send message');
		});
	}
};