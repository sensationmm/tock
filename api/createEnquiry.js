var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	createEnquiry: function(refID = '000', addressid, listed, noofoutbuildings, noofbedrooms, startdate, residentialid, ageid, typeid, rebuild) {
		var encAddressid = encodeURIComponent(addressid);
		var encListed = encodeURIComponent(listed);
		var encNoofoutbuildings = encodeURIComponent(noofoutbuildings);
		var encNoofbedrooms = encodeURIComponent(noofbedrooms);
		var encStartdate = encodeURIComponent(startdate);
		var encResidentialid = encodeURIComponent(residentialid);
		var encAgeid = encodeURIComponent(ageid);
		var encTypeid = encodeURIComponent(typeid);
		var encRebuild = encodeURIComponent(rebuild);
		var encRefID = encodeURIComponent(refID);

		var requestParams = '?addressid='+encAddressid+'&listed='+encListed+'&noofoutbuildings='+encNoofoutbuildings+'&noofbedrooms='+encNoofbedrooms+'&startdate='+encStartdate+'&residentialid='+encResidentialid+'&ageid='+encAgeid+'&typeid='+encTypeid+'&rebuild='+encRebuild;


		var requestUrl = `${ENDPOINTS.API_DOMAIN}/enquiry/`+encRefID+`/property`+requestParams;

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
	updateUserInfo: function(refID, name, email, phone, dob, maritalstatus, occupation, facebook = '') {
		var encRefID = encodeURIComponent(refID);
		var encName = encodeURIComponent(name);
		var encEmail = encodeURIComponent(email);
		var encPhone = encodeURIComponent(phone);
		var encDob = encodeURIComponent(dob);
		var encMaritalstatus = encodeURIComponent(maritalstatus);
		var encOccupation = encodeURIComponent(occupation);
		var encFacebook = encodeURIComponent(facebook);

		var requestParams = '?name='+encName+'&email='+encEmail+'&phone='+encPhone+'&dob='+encDob+'&maritalstatus='+encMaritalstatus+'&occupation='+encOccupation+'&facebook='+encFacebook;

		var requestUrl = `${ENDPOINTS.API_DOMAIN}/enquiry/`+encRefID+`/details`+requestParams;

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
				return 'Unable to update user info';
			}

		}, function(response) {
			throw new Error('Unable to update user info');
		});
	}
};