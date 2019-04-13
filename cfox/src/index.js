import React from 'react';
import ReactDOM from 'react-dom';
import Player from './player';
import './css/ui.css'

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            let orig = document.body.className;
            document.body.className = orig + 'touch-screen';
        }
    }

    render() {
        return (
            <Player />
        );
    }
}

ReactDOM.render(<Index />, document.querySelector("#app"));
