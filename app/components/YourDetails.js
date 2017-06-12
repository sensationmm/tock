import React from 'react';
import loadjs from 'loadjs';
import $ from 'jquery';
import {Link} from 'react-router';
import GetEnquiry from '../../api/getEnquiry.js';
import CreateEnquiry from '../../api/createEnquiry.js';
import FacebookLogin from 'react-facebook-login';

import Functions from '../functions/errorCheck.js';

function validateEmail(elemID) {
	var val = $('#'+elemID).val();
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	return re.test(val);
}

function calculateAge(birthYear, birthMonth, birthDay) {
	var todayDate = new Date();
	var todayYear = todayDate.getFullYear();
	var todayMonth = todayDate.getMonth();
	var todayDay = todayDate.getDate();
	var age = todayYear - birthYear; 

	if (todayMonth < birthMonth - 1) {
		age--;
	}

	if (birthMonth - 1 === todayMonth && todayDay < birthDay) {
		age--;
	}
	return age;
}

var PropertyDetails = React.createClass({
	getInitialState: function() {
		return {
			refID: '',
			enquiry: {}
		}
	},
	componentWillMount: function() {
		var that = this;

        var refID = sessionStorage.getItem('tock-ref');
        if(!refID) {
        	//redirect to homepage if no reference code stored
        	window.location.href = '/';
        } else {
        	//show existing personal data
        	GetEnquiry.getEnquiry(refID).then(function(result) {
        		$('#details-name').val(result.PersonnelDetails.Name);
        		$('#details-email').val(result.PersonnelDetails.Email);
        		$('#details-phone').val(result.PersonnelDetails.Phone);
        		$('#details-dob').val(result.PersonnelDetails.DOB);
				$('#details-maritalstatus option[value="'+result.PersonnelDetails.Marital+'"]').attr('selected','selected');
        		$('#details-occupation').val(result.PersonnelDetails.Occupation);
        		$('#details-facebook').val(result.Facebook);

        		that.setState({
					refID: result.EnquiryId,
					enquiry: result
				});
        	});
        }
	},
	componentDidMount: function() {
  		loadjs('//code.jquery.com/ui/1.12.1/jquery-ui.js');
		loadjs('/js/app.js');
	
		document.body.className = '';
        document.body.classList.add('yourproperty');

        document.title = "Your Details :: Tock.";	
	},
	facebookLogin: function() {
		//reset all errors
		$('.form-item').removeClass('error');
		$('.form-item').find('.error-msg').remove();
		//show loading mask
		$('header, footer').fadeOut('fast');
		$('body').addClass('lightboxed');
		$('.fblogin-overlay').fadeIn('fast');
	},
	facebookResponse: function(response) {
		//handle facebook login
		var {id, name, email, birthday} = response;

		$('.fblogin-overlay').fadeOut('fast');
		$('header, footer').fadeIn('fast');
		$('body').removeClass('lightboxed');

		if(name) { 
			$('#details-name').val(name); 
		} else if($('#details-name').val() === '') { 
			$('#details-name').parent().addClass('error').append('<div class="error-msg">Name not available</div>'); 
		}
        if(email) { 
			$('#details-email').val(email);
		} else if($('#details-email').val() === '') { 
			$('#details-email').parent().addClass('error').append('<div class="error-msg">Email address not available</div>'); 
		}
        if(birthday) { 
			$('#details-dob').val(birthday);
		} else if($('#details-dob').val() === '') { 
			$('#details-dob').parent().addClass('error').append('<div class="error-msg">Date of birth not available</div>'); 
		}
        $('#details-facebook').val(id);

        if($('#details-phone').val() === '') { 
			$('#details-phone').parent().addClass('error').append('<div class="error-msg">Phone number not available</div>'); 
		}
		if($('#details-occupation').val() === '') { 
			$('#details-occupation').parent().addClass('error').append('<div class="error-msg">Occupation not available</div>'); 
		}
		if($('#details-maritalstatus').val() === '0') { 
			$('#details-maritalstatus').parent().addClass('error').append('<div class="error-msg">Marital status not available</div>'); 
		}
	},
	savePersonalDetails: function() {
		//submit form
		var refID = sessionStorage.getItem('tock-ref');
		var name = $('#details-name').val();
		var email = $('#details-email').val();
		var phone = $('#details-phone').val();
		var dob = $('#details-dob').val();
		var maritalstatus = $('#details-maritalstatus').val();
		var occupation = $('#details-occupation').val();
		var occupationStatus = $('#details-occupation').attr('data-status');
		var facebook = $('#details-facebook').val();

		var error = false;

		//reset all errors
		$('.form-item').removeClass('error');
		$('.form-item').find('.error-msg').remove();

		//loop through entries to check all completed
		$('.form-item').each(function() {
			var input = $(this).find('input, select');

			if(!Functions.errorCheck(input)) {
				error = true;
				$(this).addClass('error').append('<div class="error-msg">'+$(this).attr('data-error')+'</div>');
			}
		});

		//specific error checking
		if($('#details-email').val() !== '' && !validateEmail('details-email')) {
			error = true;
			$('#details-email').parent().addClass('error').append('<div class="error-msg">Please enter a valid email address</div>');
		}
		
		var phoneVal = $('#details-phone').val();
		if(phoneVal !== '' && (phoneVal.length < 11 || (phoneVal.match(/\+/g) && (phoneVal.charAt(0) !== '+' || phoneVal.match(/\+/g).length > 1)))) {
			error = true;
			$('#details-phone').parent().addClass('error').append('<div class="error-msg">Please enter a valid phone number</div>');
		}
		
		if($('.details-occupationlist').css('display') === 'block') {
			error = true;
			$(this).addClass('error');
			$(this).find('.details-occupationlist').addClass('error');
		} else if($('#details-occupation').val() !== '') {
			//handle user selecting unsupported occupation
			if(occupationStatus === 'prohibited') {
				error = true;
				$('#details-occupation').parent().addClass('error').append('<div class="error-msg">Sorry - we cannot provide insurance for this occupation</div>');
			} else if(occupationStatus === 'refer') {
				error = true;
				$('#details-occupation').parent().addClass('error').append('<div class="error-msg">Sorry - we need you to call us on 0123 456 789 for this occupation</div>');
			}
		}

		if(dob) {
			var getDOB = dob.split('/');
			var getAge = calculateAge(getDOB[2],getDOB[1],getDOB[0]);

			//user is not old enough to get a quote
			if(getAge < 18) {
				error = true;
				$('#details-dob').parent().addClass('error').append('<div class="error-msg">You must be at least 18 years of age</div>');
			}
		}

		if(!error) {
			//api call to store user data
			CreateEnquiry.updateUserInfo(refID, name, email, phone, dob, maritalstatus, occupation, facebook).then(function(message) {
				window.location.href = '/your-belongings';
			});
		}
 	},
	render: function() {
		return (
			<div>
				<div className="banner" style={{backgroundImage:`url('./images/backgrounds/interior.jpg')`}}>
					<div className="banner__inner">
						<h1>Your details</h1>
						<nav className="banner__breadcrumb">
							<ul>
							<li><Link to="/your-property">Select home</Link></li>
							<li className="active">Your details</li>
							<li>Your belongings</li>
							<li>Your quote</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="body">
					<div className="body__inner">
						<div className="personal-details" data-propertyid="0">
							<form className="details">
								<div className="form-half">
									<div className="form-item" data-error="Please enter your name">
										<label htmlFor="details-name">Name</label>
										<input type="text" id="details-name" />
									</div>

									<div className="form-item" data-error="Please enter your email address">
										<label htmlFor="details-email">Email address</label>
										<input type="email" id="details-email" />
									</div>

									<div className="form-item" data-error="Please enter your phone number">
										<label htmlFor="details-phone">Phone number</label>
										<input type="tel" id="details-phone" maxLength="17" size="17" />
									</div>
								</div>

								<div className="form-half">
									<div className="form-item has-dropdown" data-error="Please select your occupation">
										<label htmlFor="details-occupation">Occupation</label>
										<input type="text" id="details-occupation" />
										<div className="details-occupationlist"></div>
									</div>

									<div className="form-item" data-error="Please select your marital status">
										<label htmlFor="details-marital">Marital Status</label>
										<select id="details-maritalstatus">
										<option value="0">Please select...</option>
										<option value="1">Single</option>
										<option value="2">Married</option>
										<option value="3">Civil partnered</option>
										<option value="4">Divorced</option>
										<option value="5">Widowed</option>
										</select>
									</div>
							
									<div className="form-item" data-error="Please select your date of birth">
										<label htmlFor="details-dob">Date of birth</label>
										<input className="dobpicker" type="text" id="details-dob" defaultValue="DD/MM/YYYY" />
									</div>
								</div>
							</form>

							<input type="hidden" id="details-facebook" />

							<FacebookLogin cssClass="facebook-login" textButton="Continue with Facebook" appId="727114827457161" autoLoad={false} scope="public_profile, email, user_birthday" fields="name,email,birthday" onClick={this.facebookLogin} callback={this.facebookResponse} />	

							<div className="button button--large submit button--floatright" onClick={() => this.savePersonalDetails()}>Continue</div>

						</div>


						<br /><br />

					</div>
				</div>

				<div className="fblogin-overlay">
					<div className="fblogin-overlay__content">
						<div className="fblogin-overlay__text">Connecting to Facebook</div>
						<div className="fblogin-overlay__spinner"></div>
					</div>
				</div>
			</div>
		);
	}
});

export default PropertyDetails;