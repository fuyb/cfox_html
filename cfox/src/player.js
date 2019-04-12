import React from 'react'
import {PlayerButton} from './ui'
import {PlayerContainer} from './ui'

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
                    url: 'https://develop.yanbin.me/music/huozhe.mp3',
                },
                {
                    name: 'Mad Bad Cat',
                    artist: '17 Hippies',
                    type: 'audio/flac',
                    url:'https://develop.yanbin.me/music/mad-bad.flac',
                },
                {
                    name: '彼女は革命家',
                    artist: '頭脳警察',
                    type: 'audio/mpeg',
                    url:'https://develop.yanbin.me/music/binv.mp3',
                },
                {
                    name: '丝绸之路',
                    artist: '中央民族乐团',
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

    random() {
        this.setState(({index, playList, already, playState}) => ({
            index: Math.floor(Math.random() * this.state.playList.length),
            already: false,
            playState: false,
        }), () => this.play());
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

    createButton(id, childId) {
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
        return (
            <PlayerContainer 
             playState={this.state.playState}
             buttons={buttons} 
             songName={this.state.currentMusic.name}
             artist={this.state.currentMusic.artist}
             currentTime={this.state.currentTime}
             totalTime={'-' + this.state.totalTime}
             audio={audio}
            />
        );
    }
};
