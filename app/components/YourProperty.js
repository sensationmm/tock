import React from 'react';
import $ from 'jquery';
import GetProperties from '../../api/getProperties.js';
import GetRebuild from '../../api/getRebuild.js';
import CreateEnquiry from '../../api/createEnquiry.js';
import GetEnquiry from '../../api/getEnquiry.js';
import loadjs from 'loadjs';
import Swiper from 'swiper';
import Functions from '../functions/errorCheck.js';

var loaderAnimating = false;
var propertySlider = '';
var loaded = false;

var loaderTime = 750;
// var loaderTime = 100;

var PropertyDetails = React.createClass({
	getInitialState: function() {
		return {
			message: '',

		}
	},
	componentWillMount: function() {

		var that = this;

		//check if reference code exists in storage
		var refID = sessionStorage.getItem('tock-ref');
        if(!refID) {
        	//default state
			var postcode = this.props.location.query.postcode;
			postcode = postcode.replace(' ','');

			//api call to get all properties for postcode
			GetProperties.getPostcode(postcode).then(function(message) {

				loaded = true;

				//check for valid postcode ie. results returned from postcode lookup
				if(message !== 'Unable to retrieve address') {
					var propertiesList = message.Addresses;

					//set slider to middle of road, ie. minimal slide needed in both directions
					var initialProperty = parseInt(message.Addresses.length / 2, 10);

					that.setState({
						propertiesList: propertiesList
					});

					//initialise property slider
					propertySlider = new Swiper('.swiper-container', {
				        paginationClickable: true,
				        slidesPerView: 5.7,
				        spaceBetween: 20,
				        height: 300,
					    nextButton: '.swiper-button-next',
					    prevButton: '.swiper-button-prev',
					    scrollbar: '.swiper-scrollbar',
					    scrollbarHide: false,
					    scrollbarDraggable: true,
					    slideToClickedSlide: true,
					    scrollbarSnapOnRelease: true,
					    grabCursor: true,
					    centeredSlides: true,
					    initialSlide: initialProperty,
					    breakpoints: {
					    	800: {
				        		slidesPerView: 2.4,
					    	},
					    	1400: {
				        		slidesPerView: 3.7,
					    	}
					    }
				    }); 
					//show nav buttons if needed
				    if(propertySlider.slides.length > 3) {
				    	$('.swiper-button-prev, .swiper-button-next').css('opacity','1');
				    }
					//show nav sldier if needed
				    if(propertySlider.slides.length > 20) {
				    	$('.swiper-scrollbar').css('opacity','1');
				    }
				} else {
					//invalid postcode warning
					$('.swiper-wrapper').html('<div class="swiper__no-addresses"><p>The postcode you entered did not return any addresses.</p><p><a href="/" title="Search again">Please try searching again</a>.</div>');
				    $('.property-info').remove();
				}
			});
		} else {
			//current user session

			//get enquiry
			GetEnquiry.getEnquiry(refID).then(function(result) {
				loaded = true;
				var postcode = result.Address.Postcode;

				//get properties for stored postcode
				GetProperties.getPostcode(postcode).then(function(message) {
					var propertiesList = message.Addresses;

					//get selected property
					var initialProperty = parseInt(message.Addresses.length / 2, 10);

					that.setState({
						propertiesList: propertiesList
					});
					//initialise property slider
					propertySlider = new Swiper('.swiper-container', {
				        paginationClickable: true,
				        slidesPerView: 5.7,
				        spaceBetween: 20,
				        height: 300,
					    nextButton: '.swiper-button-next',
					    prevButton: '.swiper-button-prev',
					    scrollbar: '.swiper-scrollbar',
					    scrollbarHide: false,
					    scrollbarDraggable: true,
					    scrollbarSnapOnRelease: true,
					    grabCursor: true,
					    slideToClickedSlide: true,
					    centeredSlides: true,
					    initialSlide: initialProperty,
					    breakpoints: {
					    	800: {
				        		slidesPerView: 2.4,
					    	},
					    	1400: {
				        		slidesPerView: 3.7,
					    	}
					    }
				    }); 
				    //show nav buttons if needed
				    if(propertySlider.slides.length > 3) {
				    	$('.swiper-button-prev, .swiper-button-next').css('opacity','1');
				    }
				    //show nav slider if needed
				    if(propertySlider.slides.length > 20) {
				    	$('.swiper-scrollbar').css('opacity','1');
				    }
				    var slide = $('[data-address="'+result.Address.Street+'"]');
				    var activeSlide = $('.swiper-slide').index(slide);
				    slide.addClass('active');
				    //highlight/center stored property
				    propertySlider.slideTo(activeSlide);

				    //populate details form
				    $('.property-details').attr('data-propertyid', result.Address.Id);
					$('#property-address').html(result.Address.Street);
					$('#property-type option[value="'+result.Address.Type+'"]').attr('selected','selected');
					$('#property-built option[value="'+result.Address.HouseAge+'"]').attr('selected','selected');
					$('#property-rooms option[value="'+result.Address.NoOfBedrooms+'"]').attr('selected','selected');
					$('#property-coverstart').val(result.StartDate);
					$('#property-listed option[value="'+result.Address.Listed+'"]').attr('selected','selected');
					$('#property-ownrent option[value="'+result.PersonnelDetails.Residential+'"]').attr('selected','selected');
					$('#property-outbuildings option[value="'+result.Address.NoOfOutbuildings+'"]').attr('selected','selected');
					$('.quote-estimate__total').html(Functions.formatMoney(result.RebuildCost));
					$('.quote-estimate__total').attr('data-value',result.RebuildCost);
					$('#create-enquiry').attr('data-action', 'update');
					$('.property-details, .property-estimate').css('display','block').animate({'opacity':'1', 'top':'0px'}, 500);
				});
			});
		}
	},
	componentDidMount: function() {
		loadjs('/js/app.js');
		document.body.className = '';
        document.body.classList.add('yourproperty');

        document.title = "Your Property :: Tock.";	
	},
	showRebuildValue: function(addressid) {
		//function call when property clicked

		//prevent overlapping calls
		if(!loaderAnimating) {
			//check if enquiry exists for this property
			var enquiryExists = $('#property'+addressid).attr('data-enquiry-exists');

			//active state
			$('.swiper-slide').each(function() {
				$(this).removeClass('active');
				$(this).css('background-image', 'url(./images/houses/'+$(this).attr('data-image')+'.png)');
			});
			$('#property'+addressid).addClass('active');
			var image = $('#property'+addressid).attr('data-image');
			$('#property'+addressid).css('background-image', 'url(./images/houses/Active'+image+'.png)');

			//reset property details form
			$('#property-address').html('');
			$('#property-type option').removeAttr('selected');
			$('#property-type option[value="0"]').attr('selected','selected');
			$('#property-built option').removeAttr('selected');
			$('#property-built option[value="0"]').attr('selected','selected');
			$('#property-rooms option').removeAttr('selected');
			$('#property-rooms option[value="0"]').attr('selected','selected');
			$('#create-enquiry').attr('data-action', 'create');

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
			if(dd < 10) { dd = '0'+dd; } 
			if(mm < 10) { mm = '0'+mm; } 
			today = dd+'/'+mm+'/'+yyyy;

			$('#property-coverstart').val(today);
			$('#property-listed option').removeAttr('selected');
			$('#property-listed option[value="-1"]').attr('selected','selected');
			$('#property-ownrent option').removeAttr('selected');
			$('#property-ownrent option[value="0"]').attr('selected','selected');
			$('#property-outbuildings option').removeAttr('selected');
			$('#property-outbuildings option[value="-1"]').attr('selected','selected');

			//reset animation states
			$('.loader').css('display','block').css('opacity','0').css('top','20px');
			$('.loader__spinner').removeClass('loader__spinner--done');
			$('.property-details, .property-estimate, .existing-enquiry').css('display','none').css('opacity','0').css('top','20px');
			$('.loader__spinner').css('opacity','1');
			$('.loader__estimate').css('display','none');
			$('.loader__calculating').css('display','block');
			$('.loader').animate({'top':'0px', 'opacity':'1'}, 200).fadeIn('slow');
			$('.property-details h2 span, .property-details p').css('display','block');
			$('.loader__address').css('display', 'none');
			$('#rebuild-cost').css('display','none').find('input').val(0);

			//prevent click events and hide controls while animation in progress
			loaderAnimating = true;
			if(propertySlider) {
				propertySlider.detachEvents();
				$('.swiper-container').addClass('disabled');
				$('.swiper-scrollbar, .swiper-button-prev, .swiper-button-next').css('opacity', 0);
			}

			//get property data
			GetRebuild.getRebuild(addressid).then(function(message) {

				if(message.RebuildCost !== 0) {
					//get values for form
					$('.property-details').attr('data-propertyid', message.Id);
					$('#property-address').html(message.Street);
					$('#property-type option').removeAttr('selected');
					$('#property-type option[value="'+message.Type+'"]').attr('selected','selected');
					$('#property-built option').removeAttr('selected');
					$('#property-built option[value="'+message.HouseAge+'"]').attr('selected','selected');
					$('#property-rooms option').removeAttr('selected');
					$('#property-rooms option[value="'+message.NoOfBedrooms+'"]').attr('selected','selected');
					//set loader in view
					$("html, body").animate({ scrollTop: $('.loader').offset().top - 50 }, 1000);

					$('.loader__address').html(message.Street);

					//spinner animation
					setTimeout(function() {
						var propertytype = '';
						switch(message.Type) {
							case 1:
								propertytype = 'flat';
								break;
							case 2:
								propertytype = 'terrace';
								break;
							case 3:
								propertytype = 'semi-detached';
								break;
							case 4:
								propertytype = 'detached';
								break;
							default:
								propertytype = 'property';
								break;
						}
						$('.loader__info').html(message.NoOfBedrooms+' bedroom<br />'+propertytype);
						if(message.RebuildCost.toString().length > 7) {
							$('.loader__estimate__value').css('font-size', '35px');
						}
						$('.loader__estimate__value').html(Functions.formatMoney(message.RebuildCost));
						$('.quote-estimate__total').html(Functions.formatMoney(message.RebuildCost));
						$('.quote-estimate__total').attr('data-value', message.RebuildCost);
						//hide calculating
						$('.loader__calculating').fadeOut(loaderTime, function() {
							//show address step
							$('.loader__address').fadeIn(loaderTime, function() {

								setTimeout(function() {
									$('.loader__address').fadeOut(loaderTime, function() {
										//show info step
										$('.loader__info').fadeIn(loaderTime, function() {

											setTimeout(function() {
												$('.loader__info').fadeOut(loaderTime, function() {
													//show estimate step and complete
													$('.loader__estimate').fadeIn(loaderTime, function() {
														setTimeout(function() {
															//show details form OR login form based on whether enquiry exists for this property
															if(enquiryExists === 'No') {
																$('.property-details, .property-estimate').css('display','block').animate({'opacity':'1', 'top':'0px'}, 500);
															} else {
																$('.existing-enquiry, .property-estimate').css('display','block').animate({'opacity':'1', 'top':'0px'}, 500);
															}
															$('.loader__spinner').addClass('loader__spinner--done');
															//set loader to top of viewport - if height of page did not allow for it in previous call
															$("html, body").animate({ scrollTop: $('.loader').offset().top - 50 }, 1000);

															//allow clicks on slider again and reshow controls
															loaderAnimating = false;
															if(propertySlider) {
																propertySlider.attachEvents();
																$('.swiper-container').removeClass('disabled');
																$('.swiper-scrollbar, .swiper-button-prev, .swiper-button-next').css('opacity', 1);
															}
														}, loaderTime);
													});
												});
											}, loaderTime);
										});
									});
								}, loaderTime);
							});

						});
					}, loaderTime*2);
				} else {
					$('.property-details').attr('data-propertyid', $('.swiper-slide.active').attr('data-addressid'));
					$("html, body").animate({ scrollTop: $('.loader').offset().top - 50 }, 1000);
					$('#property-address').html($('.swiper-slide.active').attr('data-address'));
					$('.property-details h2 span, .property-details p').css('display','none');
					$('#rebuild-cost').css('display','block').find('input').val('');

					//no data animation
					setTimeout(function() {
						$('.loader__address').html('No data found');
						$('.loader__calculating').fadeOut(loaderTime, function() {
							//show no data step and complete
							$('.loader__address').fadeIn(loaderTime, function() {
								setTimeout(function() {
									//show details form OR login form based on whether enquiry exists for this property
									if(enquiryExists === 'No') {
										$('.property-details').css('display','block').animate({'opacity':'1', 'top':'0px'}, 500);
									} else {
										$('.existing-enquiry').css('display','block').animate({'opacity':'1', 'top':'0px'}, 500);
									}
									$('.loader__spinner').addClass('loader__spinner--done');
									//set loader to top of viewport - if height of page did not allow for it in previous call
									$("html, body").animate({ scrollTop: $('.loader').offset().top - 50 }, 1000);

									//allow clicks on slider again and reshow controls
									loaderAnimating = false;
									if(propertySlider) {
										propertySlider.attachEvents();
										$('.swiper-container').removeClass('disabled');
										$('.swiper-scrollbar, .swiper-button-prev, .swiper-button-next').css('opacity', 1);
									}
								}, loaderTime);
							});
						});
					}, loaderTime*2);
				}
			});
		}
	},
	createEnquiry: function() {
		//function call on property details submision

		//get form values
		var addressid = $('.property-details').attr('data-propertyid');
		var listed = $('#property-listed').val();
		var noofoutbuildings = $('#property-outbuildings').val();
		var noofbedrooms = $('#property-rooms').val();
		var startdate = $('#property-coverstart').val();
		var residentialid = $('#property-ownrent').val();
		var ageid = $('#property-built').val();
		var typeid = $('#property-type').val();
		var rebuild = $('.quote-estimate__total').attr('data-value');
		if($('#property-rebuild').val() !== 0) {
			rebuild = $('#property-rebuild').val();
			rebuild = rebuild.replace(',','').replace(',','').replace(',','');
		}

		var error = false;
		//reset all errors
		$('.form-item').removeClass('error');
		$('.form-item').find('.error-msg').remove();

		//loop through inputs to check all completed
		$('.form-item').each(function() {
			var input = $(this).find('input, select');

			if(!Functions.errorCheck(input)) {
				error = true;
				$(this).addClass('error').append('<div class="error-msg">'+$(this).attr('data-error')+'</div>');
			}
		});

		//submit form
		if(!error) {
			var refID = sessionStorage.getItem('tock-ref');
        	if(!refID) {
        		refID = '000';
        	}
        	//create enquiry api call
			CreateEnquiry.createEnquiry(refID, addressid, listed, noofoutbuildings, noofbedrooms, startdate, residentialid, ageid, typeid, rebuild).then(function(message) {
				var enquiryID = message.EnquiryId;

				sessionStorage.setItem('tock-ref', enquiryID);

				window.location.href = '/your-details';
			});
		}
	},
	noReference: function() {
		//switch from login form to standard form - if user wants to start again or existing enquiry was from previous owner
		$('.existing-enquiry').css('display','block').animate({'opacity':'0', 'top':'50px'}, 500, function() {
			$('.existing-enquiry').css('display','none');
			$('.property-details').css('display','block').animate({'opacity':'1', 'top':'0px'}, 500);
		});
	},
	loginEnquiry: function() {
		//login to existing enquiry using ref code
		var refID = $('#existing-enquiry-id').val();
		refID = refID.replace('-','');
		refID = refID.replace('-','');
		refID = refID.toUpperCase();
		var error = false;
		//reset error states
		$('.form-item').removeClass('error');
		$('.form-item').find('.error-msg').remove();

		//login form validation
		if(refID === '' || refID === 'AAAAAAAAA') {
			error = true;
			var formElem1 = $('#existing-enquiry-id').parent();
			formElem1.addClass('error').append('<div class="error-msg">Please enter your reference code</div>');
		} else if(refID.length !== 9) {
			error = true;
			var formElem2 = $('#existing-enquiry-id').parent();
			formElem2.addClass('error').append('<div class="error-msg">Invalid reference code format</div>');
		}

		if(!error) {
			//login api call
			GetEnquiry.getEnquiry(refID).then(function(result) {
				if(result !== 'Enquiry not found' && result !== 'Sorry, you cannot open an already submitted enquiry') {
					//valid login attempt
					sessionStorage.setItem('tock-ref', refID);
					window.location.href = '/your-details';
				} else if(result === 'Sorry, you cannot open an already submitted enquiry') {
					//invalid login attempt
					var formElem4 = $('#existing-enquiry-id').parent();
					formElem4.addClass('error').append('<div class="error-msg">Sorry, that enquiry has already been submitted</div>');
				} else {
					//invalid login attempt
					var formElem3 = $('#existing-enquiry-id').parent();
					formElem3.addClass('error').append('<div class="error-msg">Sorry, we do not recognise that reference code</div>');
				}
			});
		}
	},
	render: function() {

		var {propertiesList} = this.state;
		var that = this;

		var getBedrooms = (numRooms) => {
			var beds = '';
			if(numRooms) {
				beds += numRooms;
				beds += (numRooms === 1) ? ' bedroom' : ' bedrooms';
			}

			return beds;
		}

		var renderProperties = () => {
			//render properties slider
			if(loaded) {
				if(propertiesList) {
					return propertiesList.map((property) => {
						return (
							<div id={'property'+property.Id} key={'slide'+property.Id} className="swiper-slide" data-address={property.Street} data-addressid={property.Id} data-enquiry-exists={property.Enquiry} data-image={property.Type} style={{backgroundImage:`url(./images/houses/`+property.Type+`.png)`}} onClick={() => that.showRebuildValue(property.Id) }>
								<div className="property__name">{property.Street}</div>
								<div className="property__beds">{getBedrooms(property.NoOfBedrooms)}</div>
								<div className="property__select">Select</div>
							</div>
						)
					});
				} else {
					return (
						<div className="swiper__no-addresses">
							No addresses found
						</div>
					)
				}
			}
		}

		var renderPropertyInfo = () => {
			//render form
			return (
				<div className="property-details" data-propertyid="0">
					<h2><span>What we know about </span><div id="property-address"></div></h2>
					<p>In reaching our valuation for the re-build of your home we have made a number of assumptions from the data that we have. Recent changes to the property or its environment may not be reflected so for a wholly up to date view you may wish to use a chartered surveyor for a physical site survey</p>
					
					<form className="details">
						<div className="form-half">
							<div className="form-item" data-error="Please select your type of property">
								<label>Type of house</label>
								<select id="property-type">
								<option value="0">Please select</option>
								<option value="1">Flat</option>
								<option value="2">Terrace</option>
								<option value="3">Semi-detached</option>
								<option value="4">Detached</option>
								</select>
							</div>

							<div className="form-item" data-error="Please select when your home was built">
								<label>When was your home built</label>
								<select id="property-built">
								<option value="0">Please select</option>
								<option value="1">Older home up to 1837</option>
								<option value="2">Early/Mid Victorian 1837-1870</option>
								<option value="3">Late Victorian & Edwardian 1870-1914</option>
								<option value="4">Lovely homes built 1918-1939</option>
								<option value="5">Post war homes 1945-1959</option>
								<option value="6">60's &amp; 70's homes 1960–1979</option>
								<option value="7">Modern homes 1980 onwards</option>
								</select>
							</div>

							<div className="form-item" data-error="Please select your number of bedrooms">
								<label>Number of bedrooms</label>
								<select id="property-rooms">
								<option value="0">Please select</option>
								<option value="1">1 bedroom</option>
								<option value="2">2 bedrooms</option>
								<option value="3">3 bedrooms</option>
								<option value="4">4 bedrooms</option>
								<option value="5">5 bedrooms</option>
								<option value="6">6 bedroom</option>
								<option value="7">7 bedrooms</option>
								<option value="8">8 bedrooms</option>
								<option value="9">9 bedrooms</option>
								<option value="10">10 bedrooms</option>
								</select>
							</div>

							<div id="rebuild-cost" className="form-item" data-error="Please enter your rebuild cost">
								<label htmlFor="property-rebuild">Rebuild cost (&pound;)</label>
								<input type="text" id="property-rebuild" defaultValue="0" />
							</div>
						</div>

						<div className="form-half">
							<div className="form-item" data-error="Please select your listed status">
								<label>Is your home a listed property?</label>
								<select className="bool" id="property-listed">
								<option value="-1">Please select...</option>
								<option value="1">Yes</option>
								<option value="0">No</option>
								</select>
							</div>
							
							<div className="form-item" data-error="Please select type of ownership">
								<label>Do you own or rent your home?</label>
								<select id="property-ownrent">
								<option value="0">Please select...</option>
								<option value="1">Owned</option>
								<option value="2">Rented</option>
								</select>
							</div>
							
							<div className="form-item" data-error="Please select number of oubuildings">
								<label>How many outbuildings do you have?</label>
								<select className="bool" id="property-outbuildings">
								<option value="-1">Please select...</option>
								<option value="0">0 outbuildings</option>
								<option value="1">1 outbuilding</option>
								<option value="2">2 outbuildings</option>
								<option value="3">3 outbuildings</option>
								<option value="4">4 outbuildings</option>
								<option value="5">5+ outbuildings</option>
								</select>
							</div>
							
							<div className="form-item" data-error="Please select when you would like your cover to start">
								<label>When would you like your cover to start?</label>
								<input className="datepicker" type="text" id="property-coverstart" />
							</div>
						</div>
					</form>

					<div id="create-enquiry" data-action="create" className="button button--large submit button--floatright" onClick={() => that.createEnquiry()}>Continue</div>

		    		<div className="tip">
		    			<img className="tip__image" src="./images/lesly-juarez.png" alt="Lesly Juarez" />
		    			<quote>
		    				"If you&apos;re not in the building trade, it&apos;s really hard to know what it might cost to re-build your home. Our specialist team has worked out that cost for you so you can have confidence that if the worst happens every brick will go back just as it was."
		    			</quote>
		    		</div>
				</div>
			)
		}

		var renderExistingEnquiry = () => {
			//render login form
			return (
				<div className="existing-enquiry" data-propertyid="0">
					<h2>We think you&apos;ve been <br />here before</h2>
					<p></p>
					<form className="details">
						<div className="form-half">
							<div className="form-item" data-error="Please enter your reference code">
								<label>Do you have your complicated, but secure reference code?</label>
								<input type="text" id="existing-enquiry-id" defaultValue="AAA-AAA-AAA" maxLength="11" size="11" />
							</div>

							<p className="label" onClick={() => that.noReference()}>I don&apos;t have a reference code</p>
						</div>
						<div className="form-half">
							<div id="enquiry-login" className="button submit button--floatright" onClick={() => that.loginEnquiry()}>Continue</div>
						</div>
					</form>
				</div>
			)
		}

		var swiperControls = () => {
			return (
				<span>
				    <div className="swiper-button-prev"></div>
				    <div className="swiper-button-next"></div>
					<div className="swiper-scrollbar"></div>
				</span>
			)
		}

		return (
			<div>
				<div className="banner" style={{backgroundImage:`url('./images/backgrounds/child-with-dog.jpg')`}}>
					<div className="banner__inner">
						<h1>Please select your home</h1>
						<nav className="banner__breadcrumb">
							<ul>
							<li className="active">Select home</li>
							<li>Your details</li>
							<li>Your belongings</li>
							<li>Your quote</li>
							</ul>
						</nav>
					</div>
				</div>

				<div>
					<div className="swiper-container">
						<div className="swiper-wrapper">
							{renderProperties()}
						</div>
					</div>
					{swiperControls()}
    			</div>

				<div className="body property-info">
					<article className="body__inner">
				    	<div className="loader">
				    		<div className="loader__calculating">Calculating rebuild value</div>

				    		<div className="loader__address"></div>

				    		<div className="loader__info"></div>

				    		<div className="loader__estimate">
				    			Estimated rebuild value
				    			<div className="loader__estimate__value">&pound;550,000</div>
				    		</div>
				    		<div className="loader__spinner"></div>
				    	</div>

			    		{renderPropertyInfo()}

			    		{renderExistingEnquiry()}
					</article>
				</div>

				<div className="body property-estimate body--white body--balanced">
					<div className="body__inner">
						<div className="quote-estimate">
							Estimated rebuild value
							<div className="quote-estimate__total" data-value></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

export default PropertyDetails;