import React from 'react';
import $ from 'jquery';

import ErrorCheck from '../functions/errorCheck.js';

function validateEmail(elemID) {
	var val = $('#'+elemID).val();
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(val);
}

var ContactForm = React.createClass({
	onFormSubmit: function(e) {
		e.preventDefault();

		var error = false;
		//clear all errors
		$('.form-item').removeClass('error');
		$('.form-item').find('.error-msg').remove();

		//check form completion
		$('.form-item').each(function() {
			var input = $(this).find('input, select, textarea');

			if(!ErrorCheck.errorCheck(input)) {
				error = true;
				$(this).addClass('error').append('<div class="error-msg">'+$(this).attr('data-error')+'</div>');
			}
		});
		//valid email
		if($('#contact-email').val() !== '' && !validateEmail('contact-email')) {
			error = true;
			$('#contact-email').parent().addClass('error').append('<div class="error-msg">Please enter a valid email address</div>');
		}

		var name = this.refs.name.value;
		var email = this.refs.email.value;
		var message = this.refs.message.value;

		if(!error) {
			this.props.onMessage(name,email,message);
		}
	},
	render: function() {
		return (
			<div className="contact-form">
				<form className="details" onSubmit={this.onFormSubmit}>
					<div className="form-item" data-error="Please enter your name">
						<label htmlFor="contact-name">Your Name</label>
						<input type="text" id="contact-name" ref="name" />
					</div>

					<div className="form-item" data-error="Please enter your email">
						<label htmlFor="contact-email">Your Email</label>
						<input type="email" id="contact-email" ref="email" />
					</div>

					<div className="form-item" data-error="Please enter your message">
						<label htmlFor="contact-message">Your Message</label>
						<textarea id="contact-message" ref="message"></textarea>
					</div>

					<button id="postcode-submit"  className="button submit button--floatright">Submit</button>
				</form>
				<div className="contact-form__success">
					<h2>Thank you for your message</h2>
					<p>One of our advisers will be in touch shortly.</p>
				</div>
				<div className="contact-form__failure">
					<h2>Something went wrong</h2>
					<p>Your message could not be sent. <a href="/contact-us" title="Please try again">Please try again.</a></p>
				</div>
			</div>
		);
	}
});

export default ContactForm;