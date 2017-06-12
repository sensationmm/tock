var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	getRebuild: function(address) {
		var encodedAddress = encodeURIComponent(address);
		var requestUrl = `${ENDPOINTS.API_DOMAIN}/rebuild?addressid=`+encodedAddress;

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
				return 'Unable to fetch enquiry';
			}

		}, function(response) {
			throw new Error('Unable to fetch enquiry');
		});
	}
};