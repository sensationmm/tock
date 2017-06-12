import React from 'react';
import $ from 'jquery';
import Functions from '../functions/errorCheck.js';

var Lightbox = React.createClass({
	render: function() {

		if(this.props.room) {
			var {selected, additional, room, lightboxID, roomsList, onUpdateRoomTotal, onLaunchLightbox, onCloseLightbox, onOpenHighValue, onUpdateHighValue, onKeyPress, onAddItem, onRemoveItem, onEditItem} = this.props;

			var rooms = roomsList;
			if(lightboxID) {
				var roomData = rooms[lightboxID];
				var nextRoomData = rooms[lightboxID+1];
			}

			function search(nameKey, myArray){
				if(myArray) {
				    for (var i=0; i < myArray.length; i++) {
				        if (myArray[i].ListId === nameKey) {
				            return myArray[i].Price;
				        }
				    }
				}
			}

			var getClasses = (lightboxid, itemid, band, value = 0, highVal = 0) => {
				//get css classes for entry
				var classes = 'lightbox__item__value';
				if(band === 'high') {
					classes += ' lightbox__item__value--high-value';
				}

				if(band !== 'high' && search(itemid, selected) === parseInt(value,10)) {
					classes += ' active';
					$('.lightbox__item__values#values'+itemid).attr('data-total', parseInt(value,10));
				} else if(band === 'high' && search(itemid, selected) > parseInt(value,10)) {
					classes += ' active';
					$('.lightbox__item__values#values'+itemid).attr('data-total', highVal);
				} else if(band === 'none' && search(itemid, selected) === undefined) {
					classes += ' active';
				}
				
				return classes;
			}

			var getItemTotal = (itemid) => {
				var total = 0;
				if(selected) {
					for(var i=0; i< selected.length; i++) {
						if(selected[i].ListId === itemid) {
							total = selected[i].Price;
						}
					}
				}

				return total;
			}

			var getHighValue = (itemid, minVal) => {
				//number variant of high value
				var value = parseInt(minVal,10)*1.25;

				if(selected) {
					for(var i=0; i< selected.length; i++) {
						if(selected[i].ListId === itemid) {
							if(selected[i].Price > minVal) {
								value = selected[i].Price;
							} else {
								value = parseInt(minVal,10)*1.25;
							}
						}
					}
				}

				return value;
			}

			var getHighValueLabel = (itemid, minVal) => {
				//text variant of high value
				var value = minVal;

				if(selected) {
					for(var i=0; i< selected.length; i++) {
						if(selected[i].ListId === itemid) {
							if(selected[i].Price > minVal) {
								value = selected[i].Price;
							}
						}
					}
				}

				return value;
			}

			var renderAdditionalItems = (collection = null) => {
				//show all items marked as additional
				if(additional) {
					return additional.map((item) => {
						// room.Total = 0; //add state count for room total
						if(item.Collection === collection) {
							return (
								// <Room key={item.Id} {...room} />
								<div key={item.Id} className="lightbox__item">
									<div className="lightbox__additional__name">{item.Name}</div>
									<div id={'additional' + item.Id} key={'additional'+item.Id} className="lightbox__item__values" data-label={item.Name} data-value={item.Id} data-total={item.Price} data-collection={item.Collection}>
										<div className="lightbox__item__value lightbox__item__value--additional active">{Functions.formatMoney(item.Price)}</div>
										<div className="lightbox__item__value lightbox__item__value--additional lightbox__item__edit" onClick={() => onEditItem(roomData.Id, item.Id, item.Name, item.Price, item.Collection)}>Edit</div>
										<div className="lightbox__item__value lightbox__item__value--additional lightbox__item__delete" onClick={() => onRemoveItem(roomData.Id, item.Id, item.Price)}>Remove</div>
									</div>
								</div>
							)
						} else {
							return false;
						}
					});
				}
			}

			var renderItems = () => {
				//show all standard items for room
				if(room.Items) {
					return room.Items.map((item) => {
						// room.Total = 0; //add state count for room total
						return (
							// <Room key={item.Id} {...room} />
							<div key={item.Id} className="lightbox__item">
								{item.Name}
								<div id={'values' + item.Id} key={'values'+roomData.Id} className="lightbox__item__values" data-label={item.Name} data-value={item.Id} data-total={getItemTotal(item.Id)}>
									<div key={roomData.Id + '0'} className={getClasses(lightboxID, item.Id, 'none')} data-value="0" data-band="none" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, 0)}>
										N/A</div>
									<div key={roomData.Id + '1'} className={getClasses(lightboxID, item.Id, 'low', item.PriceRange1)} data-value={item.PriceRange1} data-band="low" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, item.PriceRange1)}>
										&lt; {Functions.formatMoney(item.PriceRange1)}</div>
									<div key={roomData.Id + '2'} className={getClasses(lightboxID, item.Id, 'med', item.PriceRange2)} data-value={item.PriceRange2} data-band="med" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, item.PriceRange2)}>
										{Functions.formatMoney(item.PriceRange1)} - {Functions.formatMoney(item.PriceRange2, false)}</div>
									<div key={roomData.Id + '3'} className={getClasses(lightboxID, item.Id, 'high', item.PriceRange2, getHighValue(item.Id, item.PriceRange2))} data-band="high" onClick={() => onOpenHighValue(lightboxID, item.Id, getHighValue(item.Id, item.PriceRange2))}>
										{Functions.formatMoney(getHighValueLabel(item.Id, item.PriceRange2))}+</div>
								</div>
								<div key={'values'+roomData.Id+'-highval'} className="high-value">
									<p>High value item - please specify a value</p><label>Price (&pound;)</label>
									<input type="number" max="9999999" onKeyPress={onKeyPress} onBlur={() => onUpdateHighValue(lightboxID, item.Id)} defaultValue={getHighValue(item.Id, item.PriceRange2)} />
									<button onClick={() => onUpdateHighValue(lightboxID, item.Id)} >Submit</button>
								</div>
							</div>
						)
					});
				}
			}

			var renderCollections = () => {
				//show any collections specified for this room
				if(room.Collections) {
					var count = 0;
					return room.Collections.map((collection) => {
						count++;
						return (
							<div key={'collection'+count} className="lightbox__collection">
								<div>
									<div className="lightbox__collection__name">{collection}</div>
									<div className="button button--floatright submit button--empty button--small add-item-button add-collection" data-collection={collection}>Add item</div>
								</div>
								{renderAdditionalItems(collection)}
							</div>
						)
					})
				}
			}

			var renderAccordion = () => {
				if(roomData.Type === 'Attire') {
					return ( 'lightbox__accordion' )
				}
			}

			var renderAccordionTrigger = () => {
				if(roomData.Type === 'Attire') {
					return ( 'lightbox__accordion-trigger' )
				}
			}

			var label1 = () => {
				if(roomData.Type === 'Attire') {
					return ( <div className={renderAccordionTrigger()}><strong>Men&apos;s Clothes</strong></div> )
				}
			}
				
			var renderItems1 = () => {
				if(room.Items1) {
					return room.Items1.map((item) => {
						// room.Total = 0; //add state count for room total
						return (
							<div key={item.Id} className="lightbox__item">
								{item.Name}
								<div id={'values' + item.Id} key={'values'+roomData.Id} className="lightbox__item__values" data-label={item.Name} data-value={item.Id} data-total={getItemTotal(lightboxID, item.Id)}>
									<div key={roomData.Id + '0'} className={getClasses(lightboxID, item.Id, 'none')} data-value="0" data-band="none" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, 0)}>
										N/A</div>
									<div key={roomData.Id + '1'} className={getClasses(lightboxID, item.Id, 'low', item.PriceRange1)} data-value={item.PriceRange1} data-band="low" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, item.PriceRange1)}>
										&lt; {Functions.formatMoney(item.PriceRange1)}</div>
									<div key={roomData.Id + '2'} className={getClasses(lightboxID, item.Id, 'med', item.PriceRange2)} data-value={item.PriceRange2} data-band="med" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, item.PriceRange2)}>
										{Functions.formatMoney(item.PriceRange1)} - {Functions.formatMoney(item.PriceRange2, false)}</div>
									<div key={roomData.Id + '3'} className={getClasses(lightboxID, item.Id, 'high', item.PriceRange2)} data-band="high" onClick={() => onOpenHighValue(lightboxID, item.Id, (item.PriceRange2 * 1.25))}>
										{Functions.formatMoney(item.PriceRange2)}+</div>
								</div>
								<div key={'values'+roomData.Id+'-highval'} className="high-value">
									<p>High value item - please specify a value</p><label>Price (&pound;)</label>
									<input type="number" onKeyPress={onKeyPress} onBlur={() => onUpdateHighValue(lightboxID, item.Id)} defaultValue={parseInt(item.PriceRange2*1.25,10)} />
								</div>
							</div>
						)
					});
				}
			}

			var label2 = () => {
				if(roomData.Type === 'Attire') {
					return ( <div className={renderAccordionTrigger()}><strong>Women&apos;s Clothes</strong></div> )
				}
			}

			var renderItems2 = () => {
				if(room.Items2) {
					return room.Items2.map((item) => {
						// room.Total = 0; //add state count for room total
						return (
							<div key={item.Id} className="lightbox__item">
								{item.Name}
								<div id={'values' + item.Id} key={'values'+roomData.Id} className="lightbox__item__values" data-label={item.Name} data-value={item.Id} data-total={getItemTotal(lightboxID, item.Id)}>
									<div key={roomData.Id + '0'} className={getClasses(lightboxID, item.Id, 'none')} data-value="0" data-band="none" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, 0)}>
										N/A</div>
									<div key={roomData.Id + '1'} className={getClasses(lightboxID, item.Id, 'low', item.PriceRange1)} data-value={item.PriceRange1} data-band="low" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, item.PriceRange1)}>
										&lt; {Functions.formatMoney(item.PriceRange1)}</div>
									<div key={roomData.Id + '2'} className={getClasses(lightboxID, item.Id, 'med', item.PriceRange2)} data-value={item.PriceRange2} data-band="med" onClick={() => onUpdateRoomTotal(lightboxID, item.Id, item.PriceRange2)}>
										{Functions.formatMoney(item.PriceRange1)} - {Functions.formatMoney(item.PriceRange2, false)}</div>
									<div key={roomData.Id + '3'} className={getClasses(lightboxID, item.Id, 'high', item.PriceRange2)} data-band="high" onClick={() => onOpenHighValue(lightboxID, item.Id, (item.PriceRange2 * 1.25))}>
										{Functions.formatMoney(item.PriceRange2)}+</div>
								</div>
								<div key={'values'+roomData.Id+'-highval'} className="high-value">
									<p>High value item - please specify a value</p><label>Price (&pound;)</label>
									<input type="number" onKeyPress={onKeyPress} onBlur={() => onUpdateHighValue(lightboxID, item.Id)} defaultValue={parseInt(item.PriceRange2*1.25,10)} />
								</div>
							</div>
						)
					});
				}
			}

			var renderInfo = () => {
				//show info box if required
				if(roomData.Type === 'Living') {
					return (
						<div className="lightbox__info">
							<div className="lightbox__info__icon"></div>
							<div className="lightbox__info__text">
								At Tock, we’ve made sure that our insurance policies cover your 'domestic staff' e.g. your nanny or cleaner. 
								Let’s hope they never break that expensive vase you spent more on than you intended - but if they do, with Tock 
								you know it’s covered. Would your current insurer be so understanding?
							</div>
						</div>
					)
				} else if(roomData.Type === 'Garden') {
					return (
						<div className="lightbox__info">
							<div className="lightbox__info__icon"></div>
							<div className="lightbox__info__text">
								We do not offer cover for Diving, Pot Holing, or Mountaineering equipment outside of the home. Please ask one of our underwriters if that is something you need and they will be able to help.
							</div>
						</div>
					)
				}
			}

			//next/finish button
			var renderNextButton = (nextRoomData)
				? (<div className="lightbox__next" onClick={() => onLaunchLightbox(lightboxID+1, nextRoomData.Location, true)}>Continue to {nextRoomData.Name}</div>)
				: (<div className="lightbox__next" onClick={() => onCloseLightbox(lightboxID)}>Finish</div>);

			var getRoomName = (name) => {
				//room name for intro text
				name = name.toLowerCase();
				if(name !== 'your clothes') {
					name = 'your '+name;
				}
				return name;
			}

			return (
				<div className="lightbox-overlay">
					<div className="lightbox">
						<div className="lightbox__header">{room.Name}</div>
						<div className="lightbox__close" onClick={() => onCloseLightbox(lightboxID)}>Close</div>
						<div className="lightbox__inner" style={{backgroundImage:`url(./images/rooms/background`+room.Type+`.jpg)`}}>
							<p>Please select the purchase (not resale) value for items in {getRoomName(room.Name)}. 
							If you do not have an item, please select N/A. Additional items can be added to the list.</p>

							<div className="lightbox__items">
								{room.Name} total {Functions.formatMoney(roomData.Total)}
								<div className="lightbox__items__items">
									{label1()}
									<div className={renderAccordion()}>{renderItems()}</div>
									{label2()}
									<div className={renderAccordion()}>{renderItems1()}</div>
									<div className={renderAccordion()}>{renderItems2()}</div>
									{renderAdditionalItems()}
									{renderCollections()}
								</div>

								<div className="lightbox__footer">
									<div className="lightbox__add-item">
										<form className="add-item">
										<input id="add-item__name" type="text" placeholder="Item name" />
										<input id="add-item__value" type="number" placeholder="Price (£)" />
										<input id="add-item__collection" type="hidden" />
										</form>
										<div className="lightbox__add-item__actions">
											<div className="lightbox__add-item__close">Cancel</div>
											<div className="lightbox__add-item__cancel" onClick={() => onAddItem(room.Id, true)}>Cancel</div>
											<div className="lightbox__add-item__save" onClick={() => onAddItem(room.Id)}>Submit</div>
										</div>
									</div>
									<div className="lightbox__buttons">

										<div className="lightbox__buttons__top">
											<div className="button submit button--empty button--small add-item-button">Add item</div>
										</div>
										{renderNextButton}
									</div>
								</div>
							</div>
						</div>

						<div className="lightbox__notice">
							If you have a really valuable item then we will ensure it is covered separately under your policy, let us know the value and we will take care of it for you.
						</div>

						{renderInfo()}
					</div>
				</div>
			);
		} else {
			return ( <div></div> )
		}
	}
});

export default Lightbox;