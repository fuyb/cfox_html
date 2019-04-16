import React from 'react';
import {PlayerButton} from './ui';
import {PlayerContainer} from './ui';
import {ProgressLine} from './ui';

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.play = this.play.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.state = {
            already: false,
            playState: false,
            index: 0,
            completed: 0,
            currentTime: '00:00',
            totalTime: '00:00',
            lrcs: null,
            currentLRC: '',
            currentMusic: {},
            playList: [
                {
                    name: '活着——尘肺工人生命之歌',
                    artist: '今晚吃鱼丸',
                    type: 'audio/mpeg',
                    url: 'https://m.yanbin.me/music/huozhe.mp3',
                    album: 'https://m.yanbin.me/assets/huozhe.png',
                    lrc: '/assets/huozhe.lrc',
                },
                {
                    name: 'Tuvan Internationale',
                    artist: 'Huun-Huur-Tu',
                    type: 'audio/mpeg',
                    url:'https://m.yanbin.me/music/Tuvan-Internationale.mp3',
                    album: 'https://m.yanbin.me/assets/communism.jpg',
                    lrc: '/assets/internationale.lrc',
                },
                {
                    name: '卡尔',
                    artist: '白曼',
                    type: 'audio/mpeg',
                    url:'https://m.yanbin.me/music/kar.mp3',
                    album: 'https://m.yanbin.me/assets/kar.jpg',
                    lrc: null,
                }
            ]
        };
    }

    componentDidMount() {
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('timeupdate', () => this.progress());
        this.audio.addEventListener('error', (e) => this.error(e));
        this.audio.addEventListener('abort', (e) => this.error(e));

        this.setState(({index, playList}) => ({
            currentMusic: this.state.playList[this.state.index]
        }), () => {
            document.title = this.state.currentMusic.name;
        });
    }

    formatTime(time) {
        if (isNaN(time)) 
            return '00:00';

        let hour = '';
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        if (min >= 60) {
            hour = Math.floor(min / 60);
            min = Math.floor(min % 60);
            hour = hour < 10 ? '0' + hour : hour;
            hour += ':';
        }

        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        return `${hour}${min}:${sec}`;
    }

    formatLRCTime(time) {
        /* HH:MM:SS.MS */
        let times = time.split(':');
        const hour = parseInt(times[0]);
        const seconds = hour * 3600 + parseInt(times[1]) * 60 + parseInt(times[2]);
        let ftime = this.formatTime(seconds);
        times = time.split('.');
        if (times.length >= 2) {
            ftime = ftime + '.' + times[1];
        }
        if (hour === 0) {
            ftime = '00:' + ftime;
        }
        return ftime;
    }

    error(e) {
    }

    loadLRC(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = (event) => {
            let lrcs = new Map();
            const lines = xhr.response.split('\n');
            for(let line of lines) {
                let re = /\d+:\d+\.\d+/g;
                const times = line.match(re);
                if (!times)
                    continue;

                re = /\[\d+:\d+\.\d+\]/g;
                const newLine = line.replace(re, '');

                for (let time of times) {
                    let match = time.match(/\d+:/g);
                    if (!match)
                        continue;

                    if (match.length < 2) {
                        time = '00:' + time;
                    }
                    time = this.formatLRCTime(time);
                    const seconds = new Date('1970-01-01T' + time + 'Z').getTime() / 1000;
                    lrcs.set(seconds.toString(), newLine);
                }
            }
            this.setState({
                lrcs: lrcs
            });
        };
        xhr.send();
    }

    progress() {
        const currentTime = parseFloat(this.audio.currentTime);
        const completed = Math.round(currentTime * (100 / this.audio.duration));
        this.setState({
            completed: completed ? completed : 0,
            currentTime: this.formatTime(currentTime),
            totalTime: this.formatTime(this.audio.duration - currentTime),
        });

        if (!isNaN(currentTime) && this.state.lrcs !== null) {
            let lastLRC = '';
            let nextLRC = null;
            let maxKey = 0;
            for (let [key, value] of this.state.lrcs.entries()) {
                /* 找到歌词里最大的一个时间和对应的歌词 */
                if (parseFloat(key) > maxKey) {
                    maxKey = parseFloat(key);
                    lastLRC = value;
                }

                /* 情况1：当前时间和歌词时间相差小于1s就显示这行歌词 */
                const s = currentTime - parseFloat(key);
                if (s > 0 && s < 1) {
                    nextLRC = value;
                }
            }

            /* 情况2：用户拖拽时间轴超过歌词里最大的时间 */
            if (currentTime > maxKey && nextLRC === null) {
                nextLRC = lastLRC;
            }

            /* 上面的情况都没出现 nextLRC===null，不设置 currentLRC */
            if (nextLRC !== null) {
                this.setState({
                    currentLRC: nextLRC
                });
            }
        }
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
            lrcs: null,
            currentLRC: '',
            completed: 0,
            currentTime: '00:00',
            totalTime: '00:00',
        }), () => {
            this.source.src = this.state.currentMusic.url;
            this.source.type = this.state.currentMusic.type;
            this.audio.load();
            this.audio.play();
            document.title = this.state.currentMusic.name;
            if (this.state.currentMusic.lrc) {
                this.loadLRC(this.state.currentMusic.lrc);
            }
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
        if (!this.audio) return ;

        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.progressLine.current.getBoundingClientRect();
        const offset   = elemRect.left - bodyRect.left;
        const length = elemRect.right - elemRect.left;
        const time = ((e.clientX - offset) / length) * this.audio.duration;
        this.audio.currentTime = !isNaN(time) ? time : 0;
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
                mouseDown={(e) => this.mouseDown(e)}
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
             thumb={this.state.currentMusic.album}
             completed={this.state.completed}
             currentTime={this.state.currentTime}
             totalTime={'-' + this.state.totalTime}
             lrc={this.state.currentLRC}
             progressLine={this.createProgressLine(this.progressLine)}
             audio={audio}
            />
        );
    }
};
