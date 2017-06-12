var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	getLightboxContent: function(refID, roomID) {
		var encodedRefID = encodeURIComponent(refID);
		var encodedRoomID = encodeURIComponent(roomID);
		var requestUrl = `${ENDPOINTS.API_DOMAIN+'/enquiry/'+encodedRefID+'/getItemList'}?roomid=`+encodedRoomID;
		var count = 0;

		if(count < 1) {
			return axios({
				method: 'get',
				url: requestUrl,
				// auth: {
				//     username: 'tockserver',
				//     password: 'K3mistry'
				//   },
			}).then(function(response) {
				if(response.data.Message) {
					return response.data.Message.Room;
				} else {
					return 'Unable to fetch room';
				}

			}, function(response) {
				throw new Error('Unable to fetch room');
			});
		}
	}
};