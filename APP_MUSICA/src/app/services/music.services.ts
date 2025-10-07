// src/app/services/music.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  // Lista de canciones (playlist)
  private playlist: Song[] = [
    {
      id: 1,
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      year: 1975,
      duration: '5:55',
      audioSrc: 'assets/music/bohemian-rhapsody.mp3', // ¡Asegúrate de tener este archivo!
      coverSrc: 'assets/covers/queen.jpg' // ¡Y este!
    },
    {
      id: 2,
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      year: 1976,
      duration: '6:30',
      audioSrc: 'assets/music/hotel-california.mp3', // ¡Asegúrate de tener este archivo!
      coverSrc: 'assets/covers/eagles.jpg' // ¡Y este!
    },
    {
      id: 3,
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      album: 'Thriller',
      year: 1982,
      duration: '4:54',
      audioSrc: 'assets/music/billie-jean.mp3', // ¡Asegúrate de tener este archivo!
      coverSrc: 'assets/covers/thriller.jpg' // ¡Y este!
    }
  ];

  // Estados observables para que los componentes reaccionen a los cambios
  private currentSong$ = new BehaviorSubject<Song | null>(null);
  private isPlaying$ = new BehaviorSubject<boolean>(false);
  private currentTime$ = new BehaviorSubject<number>(0);
  private duration$ = new BehaviorSubject<number>(0);

  private audio = new Audio();
  private currentSongIndex = -1;

  constructor() {
    // Escuchar eventos del elemento de audio para actualizar nuestros observables
    this.audio.addEventListener('timeupdate', () => this.currentTime$.next(this.audio.currentTime));
    this.audio.addEventListener('loadedmetadata', () => this.duration$.next(this.audio.duration));
    this.audio.addEventListener('ended', () => this.next());
  }

  // Métodos públicos para interactuar con el servicio
  getPlaylist(): Song[] {
    return this.playlist;
  }

  getCurrentSong(): Observable<Song | null> {
    return this.currentSong$.asObservable();
  }

  getIsPlaying(): Observable<boolean> {
    return this.isPlaying$.asObservable();
  }

  getCurrentTime(): Observable<number> {
    return this.currentTime$.asObservable();
  }

  getDuration(): Observable<number> {
    return this.duration$.asObservable();
  }

  playSong(song: Song): void {
    this.currentSongIndex = this.playlist.findIndex(s => s.id === song.id);
    this.currentSong$.next(song);
    this.audio.src = song.audioSrc;
    this.audio.load();
    this.audio.play();
    this.isPlaying$.next(true);
  }

  togglePlayPause(): void {
    if (this.audio.paused) {
      if (!this.currentSong$.value) {
        // Si no hay canción seleccionada, reproduce la primera
        this.playSong(this.playlist[0]);
      } else {
        this.audio.play();
        this.isPlaying$.next(true);
      }
    } else {
      this.audio.pause();
      this.isPlaying$.next(false);
    }
  }

  next(): void {
    this.currentSongIndex++;
    if (this.currentSongIndex >= this.playlist.length) {
      this.currentSongIndex = 0; // Volver al inicio
    }
    this.playSong(this.playlist[this.currentSongIndex]);
  }

  previous(): void {
    this.currentSongIndex--;
    if (this.currentSongIndex < 0) {
      this.currentSongIndex = this.playlist.length - 1; // Ir al final
    }
    this.playSong(this.playlist[this.currentSongIndex]);
  }

  seekTo(time: number): void {
    this.audio.currentTime = time;
  }
}