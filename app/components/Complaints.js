import React from 'react';
import loadjs from 'loadjs';

var Complaints = React.createClass({
	componentWillMount: function() {
		loadjs('/js/app.js');
	},
	componentDidMount: function() {
		document.body.className = '';
		document.body.classList.add('page');

        document.title = "Complaints :: Tock.";	

    	window.scrollTo(0,0);
	},
	render: function() {
		return (
			<div className="body">
				<article className="body__inner">
					<h1>Tock&apos;s Complaints Procedure</h1>

					<p>Our aim is always to provide our customers with a first-class service, however we are aware that, occasionally, it is possible that we may fail to meet your expectations. </p>

					<p>If you need to make a complaint, in the first instance, you should contact us either:</p>

					<p><strong>in writing</strong> to Michael Cahill, Tock Insurance, Mary Street House, Mary Street, Taunton, Somerset, TA1 3NW</p>
						
					<p>or, <strong>by telephone</strong> on 07538 530133</p>

					<p>or, by<strong> email</strong> at <a href="mailto:complaints@tockinsurance.com" title="Email us">complaints@tockinsurance.com</a></p>

					<p>Where a complaint arises we will, wherever possible, endeavour to resolve the matter by no later than the close of business the third working day following receipt. If this is not possible, to enable us to remedy the situation in a speedy and efficient manner, we have a documented, formal complaints procedure, details of which are shown below. </p>

					<ol>
					<li>We will acknowledge your complaint promptly, to reassure you that we will be dealing with the issue as a matter of urgency, giving you the details of who will be handling the matter in our office, and details of the service of the Financial Ombudsman Service, where this applies.</li>
					<li>In the event that your complaint relates to activities or services provided by another party, we will advise you of this in writing giving the reasons for our decision, and ensure that your complaint is promptly forwarded to the appropriate party, in writing.</li>
					<li>We will aim to make a final response to you as soon as is practicable, and keep you reasonably informed as to progress. We anticipate that we will be able to provide a substantive response to most complaints within eight weeks.</li>
					<li>By the end of eight weeks from receipt of your complaint, we will issue you with our final response, or issue a response that gives the reasons for the delay and indicates when we will be able to provide a final response. If you are dissatisfied with our response, or the delay at this time, you will have a period of six months in which you can refer the matter to the Financial Ombudsman Service, whose details are shown below.</li>
					</ol>

					<p>When we provide our final response letter, we will endeavour to ensure that we have taken into consideration any financial losses, or material inconvenience you may have suffered. If we do not feel that your complaint is justified, we will advise you of the reasons for our decision and we will also advise how you may pursue the complaint if you remain dissatisfied. </p>

					<p><strong>The Financial Ombudsman Service provides consumers with a free, independent service for resolving disputes with financial firms. </strong></p>

					<p><strong>The FOS Consumer Helpline is on 0800 023 4567 (free for people phoning from a "fixed line" (for example, a landline at home) or 0300 123 9 123 (free for mobile-phone users paying monthly charge for calls to No’s starting 01 or 02) and their address is:</strong></p>

					<p><strong><center>Financial Ombudsman Service<br />
					Exchange Tower<br />
					Harbour Exchange Square<br />
					London <br />
					E14 9SR</center></strong></p>
				</article>
			</div>
		);
	}
});

export default Complaints;