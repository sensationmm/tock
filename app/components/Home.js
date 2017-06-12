import React from 'react';
import loadjs from 'loadjs';
import $ from 'jquery';

import PostcodeSearch from './PostcodeSearch.js';


var Home = React.createClass({
	componentWillMount: function() {
		loadjs('/js/app.js');
	},
	componentDidMount: function() {
		document.body.className = '';
		document.body.classList.add('home'); 

        document.title = "Tock.";	
	},
	componentWillUnmount: function() {
		//remove error message
		$('.site-warning').slideUp('fast', function() {
			$(this).html('').css('display','none');
		});
	},
	handleSearch: function(postcode) {

		//Error handler: use of sessionStorage not permitted in Safari Private Mode
		//Prevent user progressing and provide warning message
		try {
			localStorage.test = 2;        
		} catch (e) {
			$('#postcode-search').val('').blur();

			if($('.site-warning').css('display') === 'none') {
				$('.site-warning').html('We’ve noticed you’re using a private window in Safari, please be aware that you will not be able to receive a quote from Tock in this mode. You may use a normal Safari window or alternative browser to access our full services.<br /><br />Thanks').slideDown('slow');
			} else {
				$('.site-warning').addClass('animate').addClass('flash');
				setTimeout(function() {
					$('.site-warning').removeClass('flash');
				}, 250);
			}
			return;
		}

		var encodedPostcode = encodeURIComponent(postcode);
		sessionStorage.removeItem('tock-ref'); //remove any old search

		window.location = '/your-property?postcode='+encodedPostcode;
	},
	render: function() {
		return (
			<div>
				<article className="page-block" id="section1" style={{backgroundImage:`url(./images/backgrounds/hp-cactus.jpg)`}}>
					<div className="page-block__inner page-block--home">
						<div className="page-block__title"><h1>Home insurance time again?<br />Take Tock&apos;s free home check</h1></div>

						<PostcodeSearch onSearch={this.handleSearch} />
					</div>
				</article>

				<article className="page-block" id="section2" style={{backgroundImage:`url(./images/backgrounds/hp-taxi.jpg)`}}>
					<div className="page-block__inner">
						<div className="page-block__title"><h2>We offer insurance products<br /> crafted to your lifestyle</h2></div>
						<img className="page-block__logo" src={'./images/logo-covea.png'} alt="Covea Logo" />
					</div>
				</article>

				<article className="page-block" id="section3" style={{backgroundImage:`url(./images/backgrounds/hp-ruler.jpg)`}}>
					<div className="page-block__inner page-block--alternate">
						<div className="page-block__title"><h2>Calculated with precision</h2></div>
						<p>Over 50% of UK households are not properly insured. We give you a quick <br />
							and accurate figure, so no nasty surprises if you need to claim.</p>
					</div>
				</article>

				<article className="page-block" id="section4" style={{backgroundImage:`url(./images/backgrounds/hp-woman.jpg)`}}>
					<div className="page-block__inner">
						<div className="page-block__title"><h2>Trusted by you</h2></div>
						<p>"I just want to let you know I've already recommended you to a friend <br />
							who I believe has taken up insurance with you as well. So very <br />
							impressed with your service and with the knowledge and politeness of <br />
							your staff"</p>
					</div>
				</article>

				<div className="home-nav">
					<div className="home-nav__button home-nav__button--active" rel="section1"></div>
					<div className="home-nav__button" rel="section2"></div>
					<div className="home-nav__button" rel="section3"></div>
					<div className="home-nav__button" rel="section4"></div>
				</div>
			</div>
		);
	}
});

export default Home;