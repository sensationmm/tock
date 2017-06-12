import React, { Component } from 'react';
import '../scss/App.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

class App extends Component {
    render() {
		const currentRoute = this.props.routes[this.props.routes.length - 1];

        return (
            <div>
                <div className="site-warning"></div>
                <Header currentRoute={currentRoute} />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default App;
