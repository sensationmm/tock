import React from 'react';
import loadjs from 'loadjs';
import $ from 'jquery';

import ContactForm from './ContactForm.js';
import SendContact from '../../api/sendContact.js'; 

var ContactUs = React.createClass({
	componentWillMount: function() {
		loadjs('/js/app.js');
	},
	componentDidMount: function() {
		document.body.className = '';

        document.title = "Contact Us :: Tock.";	
	},
	handleMessage: function(name,email,message) {
		//api call to submit form
		SendContact.sendEmail(name,email,message).then(function(result) {
			if(result === 'Mail sent') {
				$('.contact-form form').fadeOut('fast', function() {
					$('.contact-form__success').fadeIn('fast');
				});
			} else {
				$('.contact-form form').fadeOut('fast', function() {
					$('.contact-form__failure').fadeIn('fast');
				});
			}
		});
	},
	render: function() {
		return (
			<div>
				<div className="banner" style={{backgroundImage:`url(./images/backgrounds/vase.jpg)`}}>
					<div className="banner__inner">
						<h1>Contact Us</h1>
					</div>
				</div>

				<div className="body">
					<div className="body__inner">
						<div className="cols">
							<div className="col-half">
								<h2>Hey there!</h2>

								<p>We love to hear from our customers at Tock, if you want a more general chat, contact us at:</p>

								<p><strong><a href="mailto:hello@tockinsurance.com" title="Email us">hello@tockinsurance.com</a></strong></p>

								<p>If you have more technical question about the actual insurance product, our friends at Covea would love to hear from you - give them a call on </p>

								<p><strong>0333 130 4560</strong></p>

								<p>Help! If you have a claim and/or need some emergency assistance, call 0330 134 8162</p>
							</div>

							<div className="col-half">
								<ContactForm onMessage={this.handleMessage} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

export default ContactUs;