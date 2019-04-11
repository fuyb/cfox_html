import React from 'react'
import PlayButton from './button'

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.play = this.play.bind(this);
        this.state = {
            start: false,
            playState: false,
            index: 0,
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
                }
            ]
        };
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('timeupdate', () => this.progress());
    }

    progress() {
        //console.log(this.audio.duration);
        //console.log(`transform: scaleX(${this.audio.currentTime / this.audio.duration})`);
    }

    prev() {
        this.playNext(-1);
        /*
        this.setState({
            index: this.state.index > 0 ? this.state.index - 1 : 0,
        }, () => this.play());
        */
    }

    next() {
        this.playNext(1);
        /*
        this.setState({
            index: this.state.index < this.state.playList.length - 1 ? this.state.index + 1 : 0,
        }, () => this.play());
        */
    }

    playNext(delta) {
        this.setState(({index, playList}) => ({
            index: Math.max(0, Math.min(playList.length - 1, index + delta))
        }), () => this.play());
    }

    play() {
        const item = this.state.playList[this.state.index];
        this.source.src = item.url;
        this.source.type = item.type;
        this.audio.load();
        this.audio.play();
        this.setState({
            playState: true,
            start: true,
        });
    }

    pause() {
        this.audio.pause();
        this.setState({
            playState: false,
        });
    }

    onPlayClick() {
        if (this.state.playState === true) {
            this.pause();
        } else {
            if (this.state.start === false) {
                this.play()
            } else {
                this.audio.play();
                this.setState({
                    playState: true,
                });
            }
        }
    }

    render() {
        return (
            <div>
            <PlayButton 
             value="PREV"
             onClick={() => this.prev()} 
            />
            <PlayButton 
             value="PLAY"
             onClick={() => this.onPlayClick()} 
            />
            <PlayButton 
             value="NEXT"
             onClick={() => this.next()} 
            />
            <audio 
             ref={(audio) => {this.audio = audio}}
            >
                <source 
                 ref={(source) => {this.source = source}}
                />
            </audio>
            </div>
        );
    }
};
