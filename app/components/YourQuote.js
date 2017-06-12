import React from 'react';
import loadjs from 'loadjs';
import $ from 'jquery';
import {Link} from 'react-router';

import GetEnquiry from '../../api/getEnquiry.js';

import Functions from '../functions/errorCheck.js';

var PropertyDetails = React.createClass({
	getInitialState: function() {
		return {
			quote: {},
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
			GetEnquiry.getQuotes(refID).then(function(result) {
				that.setState({
					quote: result
				});
			});
        }
	},
	componentDidMount: function() {
		loadjs('/js/app.js');
		document.body.className = '';
        document.body.classList.add('yourquote');

        document.title = "Your Quote :: Tock.";	

    	window.scrollTo(0,0);
	},
	submitEnquiry: function() {
		var refID = this.state.quote.EnquiryId;
		//api call to complete application
		GetEnquiry.sendQuote(refID).then(function(result) {
			if(result === 'Mail sent') {
        		var label = $('.quote__submit').find('.radio--active').find('.radio__label').html().toLowerCase();
        		$('.quote__submit .radio').fadeOut('fast');
        		$('.quote__submit .quote__rightcol').html('<div class="quote__final">Thank you, someone from Cov&eacute;a will be <br />calling you in the '+label+' shortly.</div>');

        		//clear stored session
        		sessionStorage.removeItem('tock-ref');
			}
		});
	},
	chooseTime: function(time) {
		//preferred time radio button
		if(!$('#time-'+time).hasClass('radio--active')) {
			$('.radio').removeClass('radio--active');
			$('#time-'+time).addClass('radio--active');
		}
	},
	render: function() {
		var {quote} = this.state;

		var renderPremiumItem = () => {
			//show all items marked as premium
			var items = quote.Premium;
			return items.map((item) => {
				return (
					<div key={'premium'+item.Id} className="quote__premium__item">
						<div className="quote__premium__item__room">{item.Room}</div>
						<div className="quote__premium__item__price">{Functions.formatMoney(item.Price)}</div>
						<div className="quote__premium__item__name">{item.Name}</div>
					</div>
				)
			});
		}

		var renderPremiumItems = () => {
			//show premium block if needed
			if(quote.Premium) {
				return (
					<div className="quote__premium">
						<h3>Specified items</h3>
						{renderPremiumItem()}
					</div>
				)
			}
		}

		return (
			<div>
				<div className="banner" style={{backgroundImage:`url('./images/backgrounds/lightbulb.jpg')`}}>
					<div className="banner__inner">
						<h1>Your Quote</h1>
						<nav className="banner__breadcrumb">
							<ul>
							<li><Link to="/your-property">Select home</Link></li>
							<li><Link to="/your-details">Your details</Link></li>
							<li><Link to="/your-belongings">Your belongings</Link></li>
							<li className="active">Your quote</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="body">
					<div className="body__inner">

						<div className="quote">

							<div className="quote__summary">
								<h2>Summary</h2>
								<p className="quote__summary__reference">Your complicated but secure reference code: {Functions.formatRefCode(quote.EnquiryId)}</p>
								<p className="quote__summary__startdate">Start date: {quote.StartDate}</p>

								<div className="quote__summary__item">
									<div className="quote__summary__item__label">Buildings</div>
									<div className="quote__summary__item__value">{Functions.formatMoney(quote.RebuildCost)}</div>
									<div className="quote__summary__item__name">Rebuild value</div>
								</div>

								<div className="quote__summary__item">
									<div className="quote__summary__item__label">Contents</div>
									<div className="quote__summary__item__value">{Functions.formatMoney(quote.ContentsValue)}</div>
									<div className="quote__summary__item__name">Your total</div>
								</div>

								<div className="quote__summary__item quote__summary__item--border">
									<div className="quote__summary__item__label">Contents</div>
									<div className="quote__summary__item__value">
										{Functions.formatMoney(quote.RebuildCost + quote.ContentsValue)}
									</div>
									<div className="quote__summary__item__name">Total value</div>
								</div>
							</div>

							<div className="quote__about-covea">
								<h2>Cov&eacute;a Insurance</h2>
								<p>We&apos;d like to introduce you to Covéa Insurance who can provide you with a product crafted to your needs. You may not have heard of them before but they have been providing insurance for people like you for over 60 years. </p>
								<p>They are the name behind some leading retail and financial institutions and have an award winning claims service. They&apos;re part of the French mutual insurance group Cov&eacute;a, one of the leading property and liability insurance providers in France, generating €17.2 billion in premiums in 2015.</p>
								<p>As a result of its financial strength, the Covéa group has attained a Standard and Poor&eacute;s A+ Stable rating.</p>
							</div>

							{renderPremiumItems()}

							<div className="quote__quote">
								<h3>Your Quote</h3>
								<div className="quote__summary">
									<p>A clever underwriter from Cov&eacute;a Insurance will be calling you shortly to discuss the best options for you based on the information you have provided. If there is a time that would be more convenient to call, please select below:</p>
								</div>

								<div className="quote__rightcol">
									<p>Or alternatively feel free to call Tock&apos;s team at Covéa Insurance on <span className="highlight">0330 221 0444</span> between 09:00 - 17:00 Monday to Friday quoting your reference code.</p>
									<p>This link here takes you to the <a href="/docs/Tock-Client-Agreement-Web.pdf" title="View Tock Client Agreement" target="_blank">Tock Client Agreement</a></p>
								</div>
							</div>

							<div className="quote__submit">	
								<div className="quote__summary">
									<div id="time-morning" className="radio radio--active" onClick={() => this.chooseTime('morning')}>
										<div className="radio__icon"></div>
										<div className="radio__label">Morning</div>
									</div>

									<div id="time-afternoon" className="radio" onClick={() => this.chooseTime('afternoon')}>
										<div className="radio__icon"></div>
										<div className="radio__label">Afternoon</div>
									</div>
								</div>

								<div className="quote__rightcol">
									<div className="button button--floatright submit" onClick={() => this.submitEnquiry()}>Submit</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

export default PropertyDetails;