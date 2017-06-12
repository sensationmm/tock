var axios = require('axios');
import * as ENDPOINTS from './endpoints.js';

module.exports = {
	updateItem: function(refID, roomid, listid = 0, price, name = '', collection = '') {
		var encodedRefID = encodeURIComponent(refID);
		var encodedRoomID = encodeURIComponent(roomid);
		var encodedListID = encodeURIComponent(listid);
		var encodedPrice = encodeURIComponent(price);
		var encodedName = encodeURIComponent(name);
		var encodedCollection = encodeURIComponent(collection);
		var requestUrl = '/enquiry/'+encodedRefID+'/updateRoomItem?roomid='+encodedRoomID+'&price='+encodedPrice;



		if(listid !== 0) {
			requestUrl += '&listid='+encodedListID;
		} else if(name !== '') {
			requestUrl += '&name='+encodedName;
		} 

		if(collection !== '') {
			requestUrl += '&collection='+encodedCollection;
		}

		requestUrl = `${ENDPOINTS.API_DOMAIN+requestUrl}`;

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

			if(response.data.Message.AdditionalRooms) {
				var newIndexedArray2 = [];

				for(var j=0; j<response.data.Message.AdditionalRooms.length; j++) {
					var newIndex2 = response.data.Message.AdditionalRooms[j].Id;
					newIndexedArray2[newIndex2] = response.data.Message.AdditionalRooms[j];
				}
				response.data.Message.AdditionalRooms = newIndexedArray2;
			}

			return response.data.Message;

		}, function(response) {
			throw new Error('Unable to fetch rooms');
		});
	},
	removeItem: function(refID, itemid) {
		var encodedRefID = encodeURIComponent(refID);
		var encodedItemID = encodeURIComponent(itemid);
		var requestUrl = `${ENDPOINTS.API_DOMAIN+'/enquiry/'+encodedRefID+'/removeRoomItem?itemid='+encodedItemID}`;

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

			if(response.data.Message.AdditionalRooms) {
				var newIndexedArray2 = [];

				for(var j=0; j<response.data.Message.AdditionalRooms.length; j++) {
					var newIndex2 = response.data.Message.AdditionalRooms[j].Id;
					newIndexedArray2[newIndex2] = response.data.Message.AdditionalRooms[j];
				}
				response.data.Message.AdditionalRooms = newIndexedArray2;
			}

			return response.data.Message;

		}, function(response) {
			throw new Error('Unable to delete item');
		});	
	}
};