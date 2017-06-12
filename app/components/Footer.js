import React from 'react';
import {Link, IndexLink} from 'react-router';

var Footer = React.createClass({
	render: function() {
		return (
			<footer className="footer">
				<div className="footer__logo">
					<IndexLink to="/" id="link-logofooter"><img src={'./images/tock-logo.png'} alt="Tock" title="Tock" /></IndexLink>
				</div>

				<nav className="footer__nav">
					<ul>
					<li><Link to="/privacy-statement" id="link-privacy">Privacy Statement</Link></li>
					<li><Link to="/complaints" id="link-conplaints">Complaints</Link></li>
					</ul>
				</nav>

				<div className="button button--floatright button--empty button--small"><Link to="/contact-us" id="link-contactfooter">Contact us</Link></div>
				<a href="http://facebook.com" title="View Tock on Facebook" target="_blank"><div className="button-social button-social"><img src="./images/icon-social-facebook.png" alt="Join us on Facebook" /></div></a>
			</footer>
		);
	}
});

export default Footer;