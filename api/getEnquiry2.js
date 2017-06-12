var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	getEnquiry: function(reference) {
		var encodedReference = encodeURIComponent(reference);
		var requestUrl = `${ENDPOINTS.GET_ENQUIRY_URL}/`+encodedReference;

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