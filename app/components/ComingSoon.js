import React from 'react';
import background from '../../images/backgrounds/child-with-dog.jpg'; 
import loadjs from 'loadjs';

var ComingSoon = React.createClass({
	componentWillMount: function() {
		loadjs('/js/app.js');
	},
	componentDidMount: function() {
		document.body.className = '';
	},
	getInitialState: function() {

		function capitalizeFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function replaceAll(str, find, replace) {
		  return str.replace(new RegExp(find, 'g'), replace);
		}

		var path = this.props.location.pathname;
		path = replaceAll(path, '/','');
		path = replaceAll(path, '-',' ');
		path = capitalizeFirstLetter(path);

		return {
			pageTitle: path,
		}
	},
	render: function() {
		var {pageTitle} = this.state;
		return (
			<div>
				<div className="banner" style={{backgroundImage:"url("+background+")"}}>
					<div className="banner__inner">
						<h1>{pageTitle}</h1>
					</div>
				</div>

				<div className="body">
					<div className="body__inner">
						<h2>Coming Soon</h2>
					</div>
				</div>
			</div>
		);
	}
});

export default ComingSoon;