import React from 'react'
import {PlayButton} from './button'
import {ProgressLine} from './button'

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.play = this.play.bind(this);
        this.state = {
            already: false,
            playState: false,
            index: 0,
            completed: 0,
            currentTime: '00:00',
            totalTime: '00:00',
            playList: [
                {
                    type: 'audio/mpeg',
                    url: 'https://develop.yanbin.me/music/huozhe.mp3',
                },
                {
                    type: 'audio/flac',
                    url:'https://develop.yanbin.me/music/mad-bad.flac',
                },
                {
                    type: 'audio/mpeg',
                    url:'https://develop.yanbin.me/music/binv.mp3',
                },
                {
                    type: 'audio/webM',
                    url:'https://develop.yanbin.me/music/sczl.opus',
                }
            ]
        };
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('timeupdate', () => this.progress());
    }

    formatTime(currentTime) {
        let min = Math.floor(currentTime / 60);
        let sec = Math.floor(currentTime % 60);
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        return `${min}:${sec}`;
    }

    progress() {
        this.setState({
            completed: this.audio.currentTime / this.audio.duration * 100,
            currentTime: this.formatTime(this.audio.currentTime),
            totalTime: this.formatTime(
                this.audio.duration - (this.audio.currentTime ? this.audio.currentTime : 0)),
        });
    }

    prev() {
        this.playNext(-1);
    }

    next() {
        this.playNext(1);
    }

    playNext(delta) {
        this.setState(({index, playList, already, playState}) => ({
            index: Math.max(0, Math.min(playList.length - 1, index + delta)),
            already: false,
            playState: false,
        }), () => this.play());
    }

    play() {
        if (this.state.already === true && this.state.playState === true) {
            this.audio.pause();
            this.setState(({playState}) => ({
                playState: !playState
            }));
            return;
        }

        if (this.state.already === true && this.state.playState === false) {
            this.audio.play();
            this.setState(({playState}) => ({
                playState: !playState
            }));
            return;
        }

        const item = this.state.playList[this.state.index];
        this.source.src = item.url;
        this.source.type = item.type;
        this.audio.load();
        this.audio.play();
        this.setState({
            playState: true,
            already: true,
        });
    }

    pause() {
        this.audio.pause();
        this.setState({
            playState: false,
        });
    }

    render() {
        return (
            <div>
            <div>
            <PlayButton 
             value="PREV"
             onClick={() => this.prev()} 
            />
            <PlayButton 
             value="PLAY"
             onClick={() => this.play()} 
            />
            <PlayButton 
             value="NEXT"
             onClick={() => this.next()} 
            />
            </div>
            <div>
            <ProgressLine completed={this.state.completed} />
            </div>
            <div>
            <audio 
             ref={(audio) => {this.audio = audio}} 
            >
                <source 
                 ref={(source) => {this.source = source}}
                />
            </audio>
            </div>
            <PlayButton 
             value={this.state.currentTime}
            />
            <PlayButton 
             value={'-' + this.state.totalTime}
            />
            </div>
        );
    }
};
