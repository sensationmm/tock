var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	getPostcode: function(postcode) {
		var encodedPostcode = encodeURIComponent(postcode);
		var requestUrl = `${ENDPOINTS.GET_PROPERTIES_URL}?postcode=${encodedPostcode}`;

		return axios({
			method: 'get',
			url: requestUrl,
			// auth: {
			//     username: 'tockserver',
			//     password: 'K3mistry'
			//   },
		}).then(function(response) {
			return response.data.Message;

		}, function(response) {
			throw new Error('Unable to fetch postcode');
		});
	}
};
