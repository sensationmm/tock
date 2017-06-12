import React from 'react';


var NotFound = React.createClass({
	componentDidMount: function() {
		document.body.className = '';
		document.body.classList.add('home'); 
	},
	render: function() {
		return (
			<div>
				<article className="page-block page-block--short" id="section2" style={{backgroundImage:`url(./images/backgrounds/vase.jpg)`}}>
					<div className="page-block__inner">
						<div className="page-block__title"><h2>404 error</h2></div>
						<h3>Oops! Something went wrong</h3>
						<p>Please try again or click the button below<br /> to navigate to the homepage</p><br />
						<button className="button button--contact"><a href="/" title="Go to homepage">Take me home</a></button>
					</div>
				</article>
			</div>
		);
	}
});

export default NotFound;