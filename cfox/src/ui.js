import React from 'react';
import './player.css'

export const PlayerButton = (props) => {
    return (
        <div className={"col-xs-" + (props.id === 'play' ? "3" : "2")}>
            <div 
             className="play_btn text-center" 
             key={props.id} 
             data-action='play'>
                <span 
                 className="glyphicon glyphicon-play" 
                 key={props.child.id} 
                 aria-hidden="true">
                </span>
            </div>
        </div>
    );
};

export const PlayerButtonContainer = (props) => {
    return (
        <div className="player_btns">
            <div className="container-fluid">
                <div className="row">
                   {props.buttons}
                </div>
            </div>
        </div>
    );
};

export const PlayerContainer = (props) => {
    return (
        <div className="player_content">
             <PlayerButtonContainer buttons={props.buttons} />
        </div>
    );
};

