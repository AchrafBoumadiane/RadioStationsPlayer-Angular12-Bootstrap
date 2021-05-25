import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  audioObj = new Audio();
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];
  files = [
    {
      url: 'http://216.21.64.84:8000/WMXR-LP',
      name: 'The vibe'
    },
    {
      url: 'http://wpr-ice.streamguys.net/wpr-hd2-aac-56',
      name: 'WPR All Classical'
    },
    {
      url: 'http://wpr-ice.streamguys.net/wpr-ideas-aac-32',
      name: 'WPR Ideas Network'
    },
    {
      url: 'https://wpr-ice.streamguys1.com/wpr-music-aac-56',
      name: 'WPR News & Music Network'
    },
  ];
  currentTime = '00:00:00';
  duration = '00:00:00';
  seek = 0;

  onpenSong(url: string) {

    /*
    this.audioObj.src = url;
    this.audioObj.load();
    this.audioObj.play();
    */
    this.streamObserver(url).subscribe(event => { });

    //console.log(url);
  }

  streamObserver(url: string) {
    return new Observable(observer => {

      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        //console.log(event);
        this.seek = this.audioObj.currentTime;
        this.duration = this.timeFormat(this.audioObj.duration);
        this.currentTime = this.timeFormat(this.audioObj.currentTime);
      }

      this.addEvent(this.audioObj, this.audioEvents, handler);

      return () => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;

        this.removeEvent(this.audioObj, this.audioEvents, handler);
      }
    });
  }

  addEvent(obj: any, events: any, handler: any) {
    events.forEach((event: any) => {
      obj.addEventListener(event, handler)
    });

  }

  removeEvent(obj: any, events: any, handler: any) {
    events.forEach((event: any) => {
      obj.removeEventListener(event, handler)
    });
  }

  setSeekTo(ev: any) {
    this.audioObj.currentTime = ev.target.value;
  }

  setVolume(ev: any) {
    this.audioObj.volume = ev.target.value;
    //console.log(ev.target.value);
  }

  play() {
    this.audioObj.play();

    //console.log('play btn clicked');
  }

  pause() {
    this.audioObj.pause();
    //console.log('pause btn clicked');
  }

  stop() {
    this.audioObj.pause();
    this.audioObj.currentTime = 0;
    //console.log('stop btn clicked');
  }

  timeFormat(time: any, format="HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }
}
