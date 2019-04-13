import React from 'react'
import {PlayerButton} from './ui'
import {PlayerContainer} from './ui'
import {ProgressLine} from './ui'

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
            currentMusic: {},
            playList: [
                {
                    name: '活着——尘肺工人生命之歌',
                    artist: '今晚吃鱼丸',
                    type: 'audio/mpeg',
                    url: 'https://t2.yanbin.me/music/huozhe.mp3',
                },
                {
                    name: 'Mad Bad Cat',
                    artist: '17 Hippies',
                    type: 'audio/flac',
                    url:'https://t2.yanbin.me/music/mad-bad.flac',
                },
                {
                    name: '彼女は革命家',
                    artist: '頭脳警察',
                    type: 'audio/mpeg',
                    url:'https://t2.yanbin.me/music/binv.mp3',
                },
                {
                    name: '丝绸之路',
                    artist: '中央民族乐团',
                    type: 'audio/webM',
                    url:'https://t2.yanbin.me/music/sczl.opus',
                },
                {
                    name: 'Tuvan Internationale.mp3',
                    artist: 'Huun-Huur-Tu',
                    type: 'audio/mpeg',
                    url:'https://t2.yanbin.me/music/Tuvan-Internationale.mp3',
                }
            ]
        };
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('timeupdate', () => this.progress());
        this.audio.addEventListener('error', (e) => this.error(e));
        this.audio.addEventListener('abort', (e) => this.error(e));
    }

    formatTime(currentTime) {
        let min = Math.floor(currentTime / 60);
        let sec = Math.floor(currentTime % 60);
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        return `${min}:${sec}`;
    }

    error(e) {
    }

    progress() {
        this.setState({
            completed: Math.round(this.audio.currentTime * (100 / this.audio.duration)),
            currentTime: this.formatTime(this.audio.currentTime),
            totalTime: this.formatTime(
                (this.audio.duration ? this.audio.duration : 0) - 
                (this.audio.currentTime ? this.audio.currentTime : 0)),
        });
    }

    prev() {
        this.playNext(-1);
    }

    next() {
        this.playNext(1);
    }

    ready() {
        this.setState(() => ({
            already: false,
            playState: false,
        }), () => this.play());
    }

    random() {
        this.setState(({index, playList, already, playState}) => ({
            index: Math.floor(Math.random() * this.state.playList.length),
        }), () => this.ready());
    }

    playNext(delta) {
        this.setState(({index, playList, already, playState}) => ({
            index: Math.max(0, Math.min(playList.length - 1, (index + delta) >= playList.length ? 0 : (index + delta))),
        }), () => this.ready());
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

        this.setState(({index, playList}) => ({
            playState: true,
            already: true,
            currentMusic: this.state.playList[this.state.index],
        }), () => {
            this.source.src = this.state.currentMusic.url;
            this.source.type = this.state.currentMusic.type;
            this.audio.load();
            this.audio.play();
        });
    }

    pause() {
        this.audio.pause();
        this.setState({
            playState: false,
        });
    }

    positionHandle(position) {
    }

    mouseMove(e) {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.progressLine.current.getBoundingClientRect();
        const offset   = elemRect.left - bodyRect.left;
        const length = elemRect.right - elemRect.left;
        this.audio.currentTime = ((e.clientX - offset) / length) * this.audio.duration;
    }

    mouseUp() {
        window.removeEventListener('mousemove', this.mouseMove);
        window.removeEventListener('mouseup', this.mouseUp);
    }

    mouseDown() {
        window.addEventListener('mousemove', this.mouseMove);
        window.addEventListener('mouseup', this.mouseUp);
    }

    createProgressLine(ref) {
        return <ProgressLine 
                ref={ref} 
                completed={this.state.completed}
                mouseMove={(e) => this.mouseMove(e)}
               />
    }

    render() {
        const buttons = [
             <PlayerButton 
              name='random'
              key='random'
              styleName='random_btn'
              childId='random-child'
              childStyleName='glyphicon-random'
              onClick={() => this.random()}/>,
             <PlayerButton 
              name='prev'
              key='prev'
              styleName='prev_btn'
              childId='prev-child'
              childStyleName='glyphicon-backward'
              onClick={() => this.prev()}/>,
             <PlayerButton 
              name='play'
              key='play'
              styleName='play_btn'
              childId='play_circle'
              childStyleName='glyphicon-play'
              childPauseStyleName='glyphicon-pause'
              playSate={this.state.playState}
              onClick={() => this.play()}/>,
             <PlayerButton 
              name='next'
              key='next'
              styleName='next_btn'
              childId='play-child'
              childStyleName='glyphicon-forward'
              onClick={() => this.next()}/>,
             <PlayerButton 
              name='repeat'
              key='repeat'
              styleName='repeat_btn'
              childId='repeat-child'
              childStyleName='glyphicon-retweet'
              onClick={() => this.next()}/>,
        ];

        const source = React.createElement('source', {
            ref:(source) => {this.source = source}
        });
        const audio = React.createElement('audio', {
            ref:(audio) => {this.audio = audio}
        }, source);

        this.progressLine = React.createRef();

        return (
            <PlayerContainer 
             playState={this.state.playState}
             buttons={buttons} 
             songName={this.state.currentMusic.name}
             artist={this.state.currentMusic.artist}
             completed={this.state.completed}
             currentTime={this.state.currentTime}
             totalTime={'-' + this.state.totalTime}
             progressLine={this.createProgressLine(this.progressLine)}
             audio={audio}
            />
        );
    }
};
