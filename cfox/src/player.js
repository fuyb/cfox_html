import React from 'react'
import PlayButton from './button'

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: null,
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
        }
    }

    play() {
        let index = this.state.index;
        const item = this.state.playList[index];
        this.source.src = item.url;
        this.source.type = item.type;
        this.audio.load();
        this.audio.play();
        index = index < this.state.playList.length - 1 ? index + 1 : 0;
        this.setState({
            playState: !this.state.playState,
            index: index,
        });
    }

    render() {
        return (
            <div>
            <PlayButton 
             value="PLAY"
             onClick={() => this.play()} 
            />
            <audio 
             ref={(audio) => {this.audio = audio}}
             onEnded={() => this.play()}
            >
                <source 
                 ref={(source) => {this.source = source}}
                />
            </audio>
            </div>
        );
    }
};
