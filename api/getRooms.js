var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	getRooms: function(refID) {
		var requestUrl = `${ENDPOINTS.API_DOMAIN+'/enquiry/'+refID+'/getRoomList'}`;

		return axios({
			method: 'get',
			url: requestUrl,
			// auth: {
			//     username: 'tockserver',
			//     password: 'K3mistry'
			//   },
		}).then(function(response) {

			var newIndexedArray = [];

			for(var i=0; i<response.data.Message.Rooms.length; i++) {
				var newIndex = response.data.Message.Rooms[i].Id;
				newIndexedArray[newIndex] = response.data.Message.Rooms[i];
			}
			response.data.Message.Rooms = newIndexedArray;


			return response.data.Message.Rooms;

		}, function(response) {
			throw new Error('Unable to fetch rooms');
		});
	},
	addExtraRooms: function(refID) {
		var requestUrl = `${ENDPOINTS.API_DOMAIN+'/enquiry/'+refID+'/addRoom'}`;

		return axios({
			method: 'get',
			url: requestUrl,
			// auth: {
			//     username: 'tockserver',
			//     password: 'K3mistry'
			//   },
		}).then(function(response) {

			var newIndexedArray = [];
			var roomsListNew = [];

			for(var i=0; i<response.data.Message.Rooms.length; i++) {
				var newIndex = response.data.Message.Rooms[i].Id;
				newIndexedArray[newIndex] = response.data.Message.Rooms[i];
				roomsListNew[newIndex] = response.data.Message.Rooms[i];
			}
			response.data.Message.Rooms = newIndexedArray;

			if(response.data.Message.AdditionalRooms) {
				var newIndexedArray2 = [];

				for(var j=0; j<response.data.Message.AdditionalRooms.length; j++) {
					var newIndex2 = response.data.Message.AdditionalRooms[j].Id;
					response.data.Message.AdditionalRooms[j].Total = response.data.Message.AdditionalRooms[j].Value;
					response.data.Message.AdditionalRooms[j].Location = 'extra';
					newIndexedArray2[newIndex2] = response.data.Message.AdditionalRooms[j];
					roomsListNew[newIndex2] = response.data.Message.AdditionalRooms[j];
				}
				response.data.Message.AdditionalRooms = newIndexedArray2;
			}

			response.data.Message.RoomsListNew = roomsListNew;

			return response.data.Message;

		}, function(response) {
			throw new Error('Unable to add rooms');
		});
	}
};