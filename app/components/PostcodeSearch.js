import React from 'react';
import $ from 'jquery';

var PostcodeSearch = React.createClass({
	onFormSubmit: function(e) {
		e.preventDefault();

		function valid_postcode(postcode) {
		    postcode = postcode.replace(/\s/g, "");
		    var regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,2} ?[0-9][A-Z]{2}$/i;
		    return regex.test(postcode);
		}
		
		$('form.homepage-search').find('.error').remove();

		var postcode = this.refs.postcode.value;

		if(postcode.length > 0) {

			//regex check for valid format for postcode - note: valid postcode check carried out on next page
			if(valid_postcode(postcode)) {
				this.refs.postcode.value = '';
				this.props.onSearch(postcode);
			} else {
				$('form.homepage-search').append('<div class="error">Sorry – You may have typed that incorrectly</div>');
				$('form.homepage-search .error').slideDown('fast');
			}
		} else {
			$('form.homepage-search').append('<div class="error">Please enter your postcode</div>');
			$('form.homepage-search .error').slideDown('fast');
		}
	},
	render: function() {
		return (
			<div>
				<form className="homepage-search" onSubmit={this.onFormSubmit}>
					<input id="postcode-search" type="text" placeholder="Postcode" ref="postcode" maxLength="8" />
					<button id="postcode-submit"  className="button submit">Submit</button>
				</form>
			</div>
		);
	}
});

export default PostcodeSearch;