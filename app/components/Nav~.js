import React from 'react';
import {Link} from 'react-router';

var Nav = React.createClass({
	render: function() {
		var {backgroundImage, activeLink, pageTitle} = this.props;

		function renderNav() {
			var navString = {};

			var navArrayKeys = [
				'your-property',
				'your-details',
				'your-belongings',
				'your-quote',
			];

			var navArray = new Array();
			navArray[navArrayKeys[0]] = 'Select home';
			navArray[navArrayKeys[1]] = 'Your details';
			navArray[navArrayKeys[2]] = 'Your belongings';
			navArray[navArrayKeys[3]] = 'Your quote';

			var navIndex = navArrayKeys.indexOf(activeLink);

			for(var i = 0; i < 4; i++) {
				if(i < navIndex) {
					navString += <li><Link to={navArrayKeys[i] }>;
					navString += { navArray[navArrayKeys[i]] }</Link></li>;
				} else if(i == navIndex) {
					navString += <li className="active">{ navArray[navArrayKeys[i]] }</li>;
				} else {
					navString += <li>{ navArray[navArrayKeys[i]] }</li>;
				}
				console.log(navString);
			}
			return navString;
		}

		return (
			<div className="banner" style={{backgroundImage:`url(./images/backgrounds/`+backgroundImage+`.jpg)`}}>
				<div className="banner__inner">
					<h1>{pageTitle}</h1>
					<nav className="banner__breadcrumb">
						<ul>{renderNav()}</ul>
					</nav>
				</div>
			</div>
		)
	}
});

export default Nav;
				