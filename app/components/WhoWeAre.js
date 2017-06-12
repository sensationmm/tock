import React from 'react';
import loadjs from 'loadjs';

var WhoWeAre = React.createClass({
	componentWillMount: function() {
		loadjs('/js/app.js');
	},
	componentDidMount: function() {
		document.body.className = '';
		document.body.classList.add('page');

        document.title = "Who We Are :: Tock.";	

    	window.scrollTo(0,0);
	},
	render: function() {
		return (
			<div className="body">
				<article className="body__inner">
					<h1>Who We Are</h1>

					<h2>Why use Tock?</h2>

					<p>You may not have heard of us before. We&apos;re young, new and here to make a difference in insurance. We think buying insurance is too complicated, tedious and time-consuming. We&apos;re going to sort that.</p>

					<p>We&apos;re working with an insurance company called Covea. You may not have heard of them before - they are one of the insurance companies behind John Lewis. They are part of a French mutual insurance group and have been around for over 60 years. For those in the know, they have an S&P A+ Stable rating.</p>

					<p>We carefully selected Covea as our first insurer - we think they have great products and a fantastic claims service.</p>

					<p>Here are some of the things that we like about their insurance product:</p>

					<ul>
					<li>They cover all of your things wherever you are in the world, not just at home in the UK</li>
					<li>They even cover things like your parents or your grand-parents possessions (up to £10k) whilst they are in a care home </li>
					<li>If your nanny or housekeeper breaks or steals something from your home, you are covered</li>
					<li>They can help you if someone steals your identity </li>
					<li>If you needed to move out of your house whilst it was being repaired, they would find your somewhere just as nice to live</li>
					</ul>

					<p>For those of you who like detail, you can <a href="https://www.coveainsurance.co.uk/media/1394/kh3457-01-16-sterling-executive-home-summary.pdf" target="_blank">view their policy wording here</a>.</p>

					<h2>But what more can Tock do for you? </h2>

					<p><strong><em>We have a super smart calculator to work out the cost to rebuild your house. </em></strong></p>

					<p>Insurance companies need to know the amount of money it would take to rebuild your entire home should the worse happen. Most other providers will ask you to estimate this yourself. If you are not in the building trade, it’s really hard to know what your rebuild cost would be. Most people use ‘market value’ then knock a bit off, or use the amount given on their mortgage valuation report. </p>

					<p>Beware, ‘knocking a bit off’ the market value could mean you are over-insured, and possibly paying too much. </p>

					<p>Your mortgage valuation was done for your mortgage, not specifically for insurance purposes - even if it says ‘recommended insurance valuation’. It probably won’t take account of any ‘outbuildings‘, landscaping costs, access to your house, we could go on. The fact is, it is often not accurate, and we can help with our calculator.</p>

					<p><strong><em>We have a simple way of calculating the value of all your belongings.</em></strong></p>

					<p>Surprisingly, most of us under-estimate how much all of our belongings are worth. All those shoes and handbags, sports equipment and garden items all add up. Tock make it really easy by taking you on a virtual quick tour of your home to make sure you don’t forget anything.</p>

					<p><strong><em>We don’t wear suits and ties..</em></strong></p>

					<p>We’re normal, friendly people who are here to help you. We try our very best to remove all insurance jargon on our website - if you spot any, email us at hello@tockinsurance.com and we’ll send you a voucher for a free cup of tea or coffee at Starbucks.</p>

					<p>BUT, we are still insurance professionals so we do need to tell you in more serious, legal terms what we will actually do for you as a customer – <a href="/docs/Tock-Client-Agreement-Web.pdf" title="View Tock Client Agreement" target="_blank">here is a link to our important ‘Client Agreement’</a></p>

					<p><strong><em>We really want to make things easy for you.</em></strong></p>

					<p>Some of us at Tock have worked in insurance for many years, and think it’s about time someone created a quick, accurate, easy way to buy the right insurance for your busy and varied lifestyle. That’s what we have decided to do.</p>

				</article>
			</div>
		);
	}
});

export default WhoWeAre;