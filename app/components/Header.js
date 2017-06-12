import React from 'react';
import {Link, IndexLink} from 'react-router';

var Header = React.createClass({
	render: function() {
		var {currentRoute} = this.props;

		function getLogo() {
			var plainTemplate = ['who-we-are','privacy-statement','complaints'];

			if(plainTemplate.indexOf(currentRoute.path) !== -1) {
				return './images/tock-logo.png';
			} else {
				return './images/tock-logo-white.png';
			}
		}
		return (
			<header>
				<nav className="header__nav">
					<ul>
					<li><Link to="/who-we-are" id="link-whoweare">Who we are</Link></li>
					</ul>
				</nav>

				<div className="logo">
					<IndexLink to="/" id="link-logo"><img src={getLogo()} alt="Tock" title="Tock" /></IndexLink>
				</div>

				<div className="button button--contact button--right"><Link to="/contact-us" id="link-contact">Get in touch</Link></div>
			</header>
		);
	}
});

export default Header;