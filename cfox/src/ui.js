import React from 'react';
import './css/ui.css'

const getStyleName = (props) => {
    if (props.name === "play") {
        return "glyphicon " + (props.playSate ?  props.childStyleName : props.childPauseStyleName);
    } else {
        return "glyphicon " + props.childStyleName;
    }
}

export const PlayerButton = (props) => {
    return (
        <div className={"col-xs-" + (props.name === "play" ? "3" : "2")}>
            <div 
             onClick={props.onClick}
             className={props.styleName + " text-center"}
             id={props.name}
             data-action={props.name}>
                <span 
                 id={props.childId}
                 className={getStyleName(props)}
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

export const ProgressLine = (props) => {
    return (
        <div className="timeline progress-bar-wrapper">
            <div className="full_line"></div>
            <div className="line_preload"></div>
            <div className="line_played" style={{width: props.completed + '%'}}>
                <span className="progress-bar-pointer"></span>
            </div>
        </div>
    );
};

export const TimeLine = (props) => {
    return (
        <div className="time_of_song">
            <div className="container-fluid">
                <div className="row">
                     <div className="col-xs-2">
                         <span className="time_played">{props.currentTime}</span>
                     </div>
                     <div className="col-xs-2 col-xs-offset-8">
                         <span className="full_time">{props.totalTime}</span>
                     </div>
                </div>
            </div>
        </div>
    );
};

export const ProgressLineWarp = (props) => {
    return (
      <div className="timeline_wrap">
          <ProgressLine completed={props.completed} />
          <TimeLine totalTime={props.totalTime} currentTime={props.currentTime} />
      </div>
    );
};

export const SongInfo = (props) => {
    return (
         <div className="song_playing text-center">
             <div className="song_name"><span key="npSong">{props.songName}</span></div>
             <div className="artist_name"><span key="npArtist">{props.artist}</span></div>
         </div>
    );
};

export const Album = (props) => {
    return (
        <div className="album_wrap">
            <div className="no_album_img">
                <div className="jAudio--thumb">
                </div>
            </div>
        </div>
    );
};

export const PlayerHeader = (props) => {
    return (
        <div className="player_header">
            <div className="container-fluid">
                <div className="row">
                <div className="col-xs-2">
                    <div className="back_btn"><span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span></div>
                </div>
                <div className="col-xs-8">
                    <div className="header_name text-center" id="nowPlay">
                        <span key="npAction">{props.playState ? "PLAY..." : "PAUSE..."}</span>
                    </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export const PlayerContainer = (props) => {
    return (
        <div className="player_content">
             <PlayerHeader playState={props.playState} />
             <Album />
             <SongInfo songName={props.songName} artist={props.artist} />
             <ProgressLineWarp 
              completed={props.completed}
              totalTime={props.totalTime}
              currentTime={props.currentTime} />
             <PlayerButtonContainer buttons={props.buttons} />
             {props.audio}
        </div>
    );
};
