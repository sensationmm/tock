import React from 'react';
import loadjs from 'loadjs';
import $ from 'jquery';
import {Link} from 'react-router';


import Room from './Room.js';
import Lightbox from './Lightbox.js';
import LightboxAPI from '../../api/LightboxAPI.js'; 
import UpdateItem from '../../api/updateItem.js'; 

import GetRooms from '../../api/getRooms.js';
import GetEnquiry from '../../api/getEnquiry.js';
// import GetEnquiry2 from '../../api/getEnquiry2.js';

import Functions from '../functions/errorCheck.js';

var PropertyDetails = React.createClass({
	getInitialState: function() {
		return {
			message: '',
			enquiry: {},
			lightbox: false,
			totalItems: 0,
			lightboxContent: ''
		}
	},
	componentWillMount: function() {
		
		var that = this;

        var refID = sessionStorage.getItem('tock-ref');
        if(!refID) {
        	//redirect to homepage if no reference code present
        	window.location.href = '/';
        } else {
        	//get enquiry
			GetEnquiry.getEnquiry(refID).then(function(result) {
				var newIndexedArray = [];
				var roomsListNew = [];

				//reindex rooms to use room instance id
				for(var i=0; i<result.Rooms.length; i++) {
					var newIndex = result.Rooms[i].Id;
					result.Rooms[i].Location = 'main';
					newIndexedArray[newIndex] = result.Rooms[i];
					roomsListNew[newIndex] = result.Rooms[i];
				}
				result.Rooms = newIndexedArray;

				//reindex additional rooms to use room instance id
				if(result.AdditionalRooms) {
					var newIndexedArray2 = [];

					for(var j=0; j<result.AdditionalRooms.length; j++) {
						var newIndex2 = result.AdditionalRooms[j].Id;
						result.AdditionalRooms[j].Total = result.AdditionalRooms[j].Value;
						result.AdditionalRooms[j].Location = 'extra';
						newIndexedArray2[newIndex2] = result.AdditionalRooms[j];
						roomsListNew[newIndex2] = result.AdditionalRooms[j];
					}
					result.AdditionalRooms = newIndexedArray2;
				}

				that.setState({
					refID: refID,
					roomsList: roomsListNew,
					enquiry: result
				});
			});
        }
	},
	componentDidMount: function() {
		loadjs('/js/app.js');
		document.body.className = '';
        document.body.classList.add('yourbelongings');

        document.title = "Your Belongings :: Tock.";	

		$('.lightbox__items__items').scrollTop(0);
	},
	handleDisabled: function() {
		//show error is user tries to perform inactive task
		$('.lightbox__add-item__actions').find('> div').addClass('flash');
		setTimeout(function() {
			$('.lightbox__add-item__actions').find('> div').removeClass('flash');
		},250);
	},
	handleLaunchLightbox: function(id, location, currentlyActive = false) {

		var enquiry = this.state.enquiry;
		var roomsList = enquiry.Rooms;
		var prevID = id - 1;

		if(currentlyActive && roomsList[prevID]) {
			roomsList[prevID].Status = 'Viewed';
		}
		enquiry.Rooms = roomsList;

		//set lightbox state
		if(!this.state.lightbox && !currentlyActive) {
			//show lightbox
			this.setState({
				lightbox: true,
				lightboxID: id,
				lightboxLocation: location,
				enquiry: enquiry
			});
		} else if(!this.state.lightbox) {
			//change to next lightbox
			this.setState({
				lightbox: true,
				lightboxID: id,
				lightboxContent: null,
				lightboxLocation: location,
				enquiry: enquiry
			});
		} else {
			this.setState({
				lightboxID: id,
				lightboxLocation: location,
				enquiry: enquiry
			});
		}

		if(!currentlyActive) {
			//lightbox classes
			$('header, footer').fadeOut('fast');
			$('body').addClass('lightboxed');
		}
	},
	handleCloseLightbox: function(id) {
		var that = this;

		if(!$('.lightbox__close').hasClass('disabled')) {
			$('.lightbox-overlay').addClass('lightbox-overlay--close');
			setTimeout(function() {
				$('header, footer').fadeIn('slow');
				$('body').removeClass('lightboxed');

				var showExtraRooms = true;
				var enquiry = that.state.enquiry;
				var roomsList = enquiry.Rooms;

				if(roomsList[id]) {
					//set room as viewed
					roomsList[id].Status = 'Viewed';
				}
				//work out if extra rooms should be shown, ie. if all standard rooms have been completed
				roomsList.map((room) => {
					if(room.Status !== 'Viewed' && room.Status !== 'Edited') {
						showExtraRooms = false;
					}
					return showExtraRooms;
				});

				enquiry.Rooms = roomsList;

				if(!showExtraRooms || that.state.enquiry.AdditionalRooms !== null) {
					//clear lightbox
					that.setState({
						lightbox: false,
						lightboxID: undefined,
						lightboxContent: null,
						enquiry: enquiry
					});
				} else {
        			var refID = that.state.enquiry.EnquiryId;
        			//add extra rooms and show next button
					GetRooms.addExtraRooms(refID).then(function(message) {
						$('html, body').animate({'scrollTop': ($('.rooms').offset().top + $('.rooms').outerHeight()) }, 500);

						$('#progress-save').fadeOut('fast', function() {
							$('.progress-buttons').find('span').remove();
							$('#progress-confirm').fadeIn('fast');
						});

						that.setState({
							lightbox: false,
							lightboxID: undefined,
							lightboxContent: null,
							roomsList: message.RoomsListNew,
							enquiry: message
						});
					});
				}
				
			}, 501);
		} else {
			//cant close lightbox - action required first
			this.handleDisabled();
		}
	},
	handleUpdateRoomTotal: function(room, item, val) {
		//function when user updates values

		if(!$('.lightbox__close').hasClass('disabled')) {
			var newRoomsList = this.state.roomsList;

			var totalItems = 0;

			$('.lightbox__item__values[data-value="'+item+'"]').parent().find('.high-value').fadeOut('fast');
			$('#values'+item).parent().find('.lightbox__error').remove();

			$('.lightbox__item__values[data-value="'+item+'"]').find('.lightbox__item__value').removeClass('active');

			if('£'+val === $('#values'+item).find('.lightbox__item__value--high-value').html()) {
				$('#values'+item).find('.lightbox__item__value--high-value').html('£'+val+'+');
			}

			if($('#values'+item).find('.lightbox__item__value--high-value').html() !== '£'+val) {
				$('.lightbox__item__values[data-value="'+item+'"]').find('.lightbox__item__value[data-value="'+val+'"]').addClass('active');
			}
			$('.lightbox__item__values[data-value="'+item+'"]').attr('data-total', val);
			var newTotal = 0;
			$('.lightbox__item__values').each(function() {
				totalItems++;
				var add = parseInt($(this).attr('data-total'), 10);
				newTotal += add;
			});
			newRoomsList[room].Total = newTotal;

			var that = this;

			//api call to store value
			UpdateItem.updateItem(this.state.refID, room, item, val).then(function(message) {
				var roomsList = message.Rooms;
				roomsList = roomsList.concat(message.AdditionalRooms);

				var roomsKeys = Object.keys(roomsList);
				for(var i=0; i<roomsKeys; i++) {
					if(roomsList[roomsKeys[i]].Id === room) {
						roomsList[roomsKeys[i]].Total = newTotal;
					}
				}

				// roomsList[room].Total = newTotal;
				message.Enquiry = roomsList;

				that.setState({
					...that.state,
					enquiry: message,
					totalItems: totalItems
				});
			});
		} else {
			//cant perform update - action required
			this.handleDisabled();
		}

		//change made - reshow save button if hidden (ie. save performed since last edit)
		if($('.progress-buttons').has('span').length) {
			$('.progress-buttons').find('span').remove();
			$('#progress-save').fadeIn('slow');
		}
	},
	renderLightbox: function() {
		var that = this;
		if(this.state.lightbox) {
			//api call to get right content for lightbox based on room clicked
			LightboxAPI.getLightboxContent(this.state.refID, this.state.lightboxID).then(function(message) {
				var room = message;
				
				that.setState({
					lightbox: false,
					lightboxContent: room
				});
			});
		}

		if(that.state.lightboxContent !== '' && that.state.lightboxContent) {

			if(that.state.lightboxLocation === 'main') {
				return (<Lightbox show={that.state.lightbox} room={that.state.lightboxContent} lightboxID={that.state.lightboxID} selected={that.state.enquiry.Rooms[that.state.lightboxID].Items} additional={that.state.enquiry.Rooms[that.state.lightboxID].AdditionalItems} onLaunchLightbox={that.handleLaunchLightbox} onCloseLightbox={that.handleCloseLightbox} roomsList={that.state.roomsList} onUpdateRoomTotal={that.handleUpdateRoomTotal} onOpenHighValue={that.handleOpenHighValue} onUpdateHighValue={that.handleUpdateHighValue} onKeyPress={that.handleKeyPress} onAddItem={that.handleAddItem} onRemoveItem={that.handleRemoveItem} onEditItem={that.handleEditItem} />)
			} else if(that.state.lightboxLocation === 'extra') {
				return (<Lightbox show={that.state.lightbox} room={that.state.lightboxContent} lightboxID={that.state.lightboxID} selected={that.state.enquiry.AdditionalRooms[that.state.lightboxID].Items} additional={that.state.enquiry.AdditionalRooms[that.state.lightboxID].AdditionalItems} onLaunchLightbox={that.handleLaunchLightbox} onCloseLightbox={that.handleCloseLightbox} roomsList={that.state.roomsList} onUpdateRoomTotal={that.handleUpdateRoomTotal} onOpenHighValue={that.handleOpenHighValue} onUpdateHighValue={that.handleUpdateHighValue} onKeyPress={that.handleKeyPress} onAddItem={that.handleAddItem} onRemoveItem={that.handleRemoveItem} onEditItem={that.handleEditItem} />)
			}


		}
	},
	handleOpenHighValue: function(room, item, val) {
		//user has clicked high value option - inout needed
		if(!$('.lightbox__close').hasClass('disabled')) {
			// var highValue = parseInt(val * 1.1, 10);
			var highValue = $('#values'+item).parent().find('.high-value').find('input').val();
			$('#values'+item).parent().find('.lightbox__error').remove();
			this.handleUpdateRoomTotal(room, item, highValue);
			
			$('.lightbox__item__values[data-value="'+item+'"]').find('.lightbox__item__value').removeClass('active');
			$('#values'+item+' .lightbox__item__value--high-value').addClass('active');
			//show high value field
			$('#values'+item).parent().find('.high-value').find('input').val(highValue);
			$('#values'+item).parent().find('.high-value').slideDown('fast');
			$('#values'+item).parent().find('.high-value').find('input').focus();
		} else {
			//action required
			this.handleDisabled();
		}
	},
	handleUpdateHighValue: function(room, item) {
		//user has entered high value
		var highValue = parseInt($('#values'+item).parent().find('.high-value').find('input').val(), 10);
		var minValue = parseInt($('#values'+item).find('.lightbox__item__value:nth-child(3)').attr('data-value'), 10);

		//ensure entered value is not empty or less than minimum for this price band
		if(highValue < minValue || isNaN(highValue)) {
			highValue = minValue;
			$('#values'+item).parent().find('.high-value').find('input').val(highValue);
			$('#values'+item).parent().append('<p class="lightbox__error">Minimum value of &pound;'+minValue+' in this bracket</p>');
		}

		$('.lightbox__item__values[data-value="'+item+'"]').attr('data-total', highValue);
		var newTotal = 0;
		$('.lightbox__item__values').each(function() {
			var add = parseInt($(this).attr('data-total'), 10);
			newTotal += add;
		});

		var newRoomsList = this.state.roomsList;

		var totalItems = this.state.totalItems
		totalItems++;
		newRoomsList[room].Total = newTotal;

		this.setState({
			...this.state,
			roomsList: newRoomsList,
			totalItems: totalItems
		});

		var that = this;

		//api call to store high value
		UpdateItem.updateItem(this.state.refID, room, item, highValue).then(function(message) {
			var roomsList = message.Rooms;

			var roomsKeys = Object.keys(roomsList);
			for(var i=0; i<roomsKeys; i++) {
				if(roomsList[roomsKeys[i]].Id === room) {
					roomsList[roomsKeys[i]].Total = newTotal;
				}
			}
			// roomsList[room].Total = newTotal;
			message.Enquiry = roomsList;

			that.setState({
				...that.state,
				enquiry: message,
				totalItems: totalItems
			});
		});

		//hide high value input
		$('#values'+item).parent().find('.high-value').slideUp('fast');
		$('#values'+item+' .lightbox__item__value--high-value').html('&pound;'+highValue);

		//change made - reshow save button if hidden (ie. save performed since last edit)
		if($('.progress-buttons').has('span').length) {
			$('.progress-buttons').find('span').remove();
			$('#progress-save').fadeIn('slow');
		}
	},
	handleAddItem: function(room, cancel = false) {
		//action clicked
		var newItemName = $('#add-item__name').val();
		var newItemValue = $('#add-item__value').val();

		if(cancel) {
			newItemName = $('#add-item__name').attr('data-reset');
			newItemValue = $('#add-item__value').attr('data-reset');
		}
		var newItemCollection = $('#add-item__collection').val();
		var that = this;

		if(newItemName && newItemValue) {
			//api call to add item
			UpdateItem.updateItem(this.state.refID, room, 0, newItemValue, newItemName, newItemCollection).then(function(message) {
				var {totalItems} = that.state;
				totalItems++;

				var newRoomsList = that.state.roomsList;
				var newTotal = 0;
				$('.lightbox__item__values').each(function() {
					totalItems++;
					var add = parseInt($(this).attr('data-total'), 10);
					newTotal += add;
				});
				message.Rooms[room].Total = newTotal + parseInt(newItemValue,10);
				newRoomsList[room].Total = newTotal + parseInt(newItemValue,10);

				that.setState({
					...that.state,
					enquiry: message,
					totalItems: totalItems
				});

				$('.lightbox__add-item').fadeOut('slow', function() {
				$('.lightbox__add-item__close').css('display','block');
				$('.lightbox__add-item__cancel').css('display','none');
					$('.lightbox__buttons').fadeIn('slow');
				}).find('input').val('');
				//allow lightbox to be closed again
				$('.lightbox__close').removeClass('disabled');

				$('.lightbox__items__items').scrollTop($('.lightbox__items__items')[0].scrollHeight);
			});
		} else {
			$('.lightbox__add-item__actions').find('> div').addClass('flash');
			setTimeout(function() {
				$('.lightbox__add-item__actions').find('> div').removeClass('flash');
			},250);
		}
	},
	handleEditItem: function(room, id, name, val, collection = null) {
		this.handleRemoveItem(room, id, val);

		$('#add-item__name').val(name);
		$('#add-item__name').attr('data-reset', name);
		$('#add-item__value').val(val);
		$('#add-item__value').attr('data-reset', val);
		if(collection !== null) {
			$('#add-item__collection').val(collection);
		}

		$('.lightbox__buttons').fadeOut('slow', function() {
			$('.lightbox__add-item__close').css('display','none');
			$('.lightbox__add-item__cancel').css('display','block');

			//prevent lightbox being closed until action completed
			$('.lightbox__close').addClass('disabled');

			$('.lightbox__add-item').fadeIn('slow');
		});
	},
	handleRemoveItem: function(room, id, val) {
		var that = this;
		//api call to delete added item
		UpdateItem.removeItem(this.state.refID, id).then(function(message) {
			var {totalItems} = that.state;
			totalItems--;

			var newRoomsList = that.state.roomsList;
			var newTotal = 0;
			$('.lightbox__item__values').each(function() {
				totalItems++;
				var add = parseInt($(this).attr('data-total'), 10);
				newTotal += add;
			});
			message.Rooms[room].Total = newTotal - parseInt(val,10);
			newRoomsList[room].Total = newTotal - parseInt(val,10);

			that.setState({
				...that.state,
				enquiry: message,
				totalItems: totalItems
			});
		});
	},
	handleKeyPress: function(e) {
		//numbers only
		if(e.which < 48 || e.which > 57) {
			e.preventDefault();
		}
	},
	saveEnquiry: function() {
		//stores enquiry for later and sends email with reference code
		var refID = this.state.enquiry.EnquiryId;
		GetEnquiry.saveEnquiry(refID).then(function(result) {
			if(result === 'Mail sent') {
				$('#progress-save').fadeOut('slow', function() {
					$('.progress-buttons').append('<span>Thank you, we have sent you an email with your reference number and a link to re access your belongings.</span>');
				});
        		
			}
		});
	},
	render: function() {
		var {enquiry, roomsList} = this.state;

		var renderRooms = () => {
			//show all standard room boxes
			if(enquiry.Rooms) {
				var newRooms = enquiry.Rooms;
				return newRooms.map((room) => {
					if(!room.Total) {
						if(enquiry.Rooms[parseInt(room.Id, 10)].Items) {
							var savedRoomTotal = 0;
							//work out total for room based on values stored
							for(var i=0; i<enquiry.Rooms[room.Id].Items.length; i++) {
								savedRoomTotal += enquiry.Rooms[room.Id].Items[i].Price;
							}
							//work out total for additional rooms  based on values stored
							if(enquiry.Rooms[room.Id].AdditionalItems) {
								for(var j=0; j<enquiry.Rooms[room.Id].AdditionalItems.length; j++) {
									savedRoomTotal += enquiry.Rooms[room.Id].AdditionalItems[j].Price;
								}
							}

							room.Total = savedRoomTotal;
						} else {
							room.Total = 0; //add state count for room total
						}
					}

					return (
						<Room key={room.Id} location="main" {...room} launchLightbox={this.handleLaunchLightbox} />
					)
				});
			}
		}

		var renderOtherRooms = () => {
			var newRooms = enquiry.AdditionalRooms;
			return newRooms.map((room) => { 
				return (
					<Room key={room.Id} location="extra" {...room} Total={room.Value} launchLightbox={this.handleLaunchLightbox} />
				)
			});
		}

		var renderAdditional = () => {
			//show other rooms block if applicable
			if(enquiry.AdditionalRooms) {
				return (
					<div className="additional-rooms">
						<br /><h3>Other rooms</h3>
						<p>Based on the information you have given about your living room, kitchen and master bedroom, we have been able to calculate an average total for your entire home. You do not need to edit these rooms, however if you feel something is missing, please feel free to add it.</p><br />
						{renderOtherRooms()}
					</div>
				)
			}
		}

		var getTotal = (includeRebuild = false) => {
			//show running total for selected items
			if(roomsList) {
				var countTotal = 0;

				if(includeRebuild) {
					countTotal += enquiry.RebuildCost;
				}

				var roomKeys = Object.keys(roomsList);

				for(var i=0; i < roomKeys.length; i++) {
					countTotal += roomsList[parseInt(roomKeys[i],10)].Total;
				}

				return Functions.formatMoney(countTotal);
			}
		}

		var estimatedTotal = () => {
			if(roomsList) {
				
				var countTotal = getTotal();

				if(countTotal !== '£0') {
					return (
						<div className="estimated-total">
							Estimated total
							<span>{countTotal}</span>
						</div>
					)
				}
			}
		}

		var houseStreet = (enquiry.Address) ? enquiry.Address.Street : '';

		var renderProgressButton = () => {
			//show appropriate CTA button - save or submit
			if(enquiry.AdditionalRooms === null) {
				return (
					<div className="progress-buttons">
						<div id="progress-save" data-ref={Functions.formatRefCode(enquiry.EnquiryId)} className="button submit" onClick={() => this.saveEnquiry()}>Save for later</div>
						<div id="progress-confirm" className="button"><Link to="/your-quote">Confirm inventory</Link></div>
					</div>
				)
			} else {
				return (
					<div className="button no-message"><Link to="/your-quote">Confirm inventory</Link></div>
				)
			}
		}

		return (
			<div>
				<div className="banner" style={{backgroundImage:`url(./images/backgrounds/hp-cactus.jpg)`}}>
					<div className="banner__inner">
						<h1>Your belongings</h1>
						<nav className="banner__breadcrumb">
							<ul>
							<li><Link to="/your-property">Select home</Link></li>
							<li><Link to="/your-details">Your details</Link></li>
							<li className="active">Your belongings</li>
							<li>Your quote</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="body">
					<div className="body__inner">
						<div className="belongings-intro">
							<h2>{houseStreet}</h2>
							<p>Our smart calculator means we are able to give you a more accurate value for your contents.  We ask you to value three of your main rooms, we take a quick look in your wardrobe, then dash through your garden and garage - we then use these values to calculate the total for your entire home. There is an opportunity to value more rooms if you wish.</p>
						</div>

						<h3>Select a room</h3>

						<div className="rooms">

							{renderRooms()}

							<div className="rooms__reference">
								<div className="rooms__reference__inner">
									<div className="rooms__reference-number">Your complicated but secure reference code: {Functions.formatRefCode(enquiry.EnquiryId)}</div> 
									{estimatedTotal()}
									<p>Use this to re-access your inventory if you’d like to come back later. We&apos;ll ask for it after you select your door number.</p>
									
									{renderProgressButton()}
								</div>
							</div>
						</div>

						{renderAdditional()}
					</div>
				</div>

				<div className="body body--white body--balanced">
					<div className="body__inner">
						<div className="quote-estimate">
							Estimated total
							<div className="quote-estimate__total">{getTotal(true)}</div>
						</div>
					</div>
				</div>
				
				{this.renderLightbox()}
				
			</div>

		);
	}
});

export default PropertyDetails;