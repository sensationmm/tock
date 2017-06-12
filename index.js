import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, IndexRoute, browserHistory} from 'react-router';
import App from './app/App';
import Home from './app/components/Home.js';
import WhoWeAre from './app/components/WhoWeAre.js';
import PrivacyStatement from './app/components/PrivacyStatement.js';
import Complaints from './app/components/Complaints.js';
import ContactUs from './app/components/ContactUs.js';
import YourProperty from './app/components/YourProperty.js';
import YourDetails from './app/components/YourDetails.js';
import YourBelongings from './app/components/YourBelongings.js';
import YourQuote from './app/components/YourQuote.js';
import NotFound from './app/components/404.js';

ReactDOM.render(
  	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<Route path="privacy-statement" component={PrivacyStatement} />
			<Route path="complaints" component={Complaints} />
			<Route path="who-we-are" component={WhoWeAre} />
			<Route path="contact-us" component={ContactUs} />
			<Route path="your-property" component={YourProperty} />
			<Route path="your-details" component={YourDetails} />
			<Route path="your-belongings" component={YourBelongings} />
			<Route path="your-quote" component={YourQuote} />

			<IndexRoute component={Home} />
			<Route path='*' component={NotFound} />
		</Route>
	</Router>,
  	document.getElementById('root')
);
