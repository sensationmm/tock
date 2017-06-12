import React from 'react';

import Functions from '../functions/errorCheck.js';

var Room = React.createClass({
	render: function() {
		var {Id, Name, Type, Total, location, Status} = this.props;

		var roomCompleted = () => {
			//show tick if room completed
			// if(typeof Total === 'number' && Total > 0) {
			if(Status === 'Edited' || Status === 'Viewed' || location === 'extra') {
				return (
					<div className="rooms__completed"></div>
				)
			}
		}

		var totalLabel = () => {
			//show correct label
			if(location === 'main' || Status === 'Edited') {
				return ( <span>Your Total</span> )
			} else {
				//value is estimated, ie. not edited by user
				return ( <span>Estimated</span> )
			}
		}

		return (
			<div id={'room-'+Type.toLowerCase()} className="rooms__room" onClick={() => {this.props.launchLightbox(Id, location)}}>
				<div className="rooms__image" style={{backgroundImage:`url(./images/rooms/`+Type+`.jpg)`}}>
					<div className="rooms__title">{Name}</div>
					{roomCompleted()}
				</div>
				<div className="rooms__total">
					{totalLabel()}
					<div className="rooms__total__value">{Functions.formatMoney(Total)}</div>
				</div>
			</div>
		);
	}
});

export default Room;