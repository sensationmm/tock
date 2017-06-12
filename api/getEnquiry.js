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
	},
	getQuotes: function(reference) {
		var encodedReference = encodeURIComponent(reference);
		var requestUrl = `${ENDPOINTS.API_DOMAIN+'/enquiry/'+encodedReference+'/getQuotes'}`;
		
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
				return 'Unable to fetch quote';
			}

		}, function(response) {
			throw new Error('Unable to fetch quote');
		});
	},
	saveEnquiry: function(reference) {
		var encodedReference = encodeURIComponent(reference);
		var requestUrl = `${ENDPOINTS.API_DOMAIN+'/enquiry/'+encodedReference+'/sendReference'}`;

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
				return 'Unable to save enquiry';
			}

		}, function(response) {
			throw new Error('Unable to save enquiry');
		});
	},
	sendQuote: function(reference) {
		var encodedReference = encodeURIComponent(reference);
		var requestUrl = `${ENDPOINTS.API_DOMAIN+'/enquiry/'+encodedReference+'/sendQuote'}`;

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
				return 'Unable to send quote';
			}

		}, function(response) {
			throw new Error('Unable to send quote');
		});
	}
};