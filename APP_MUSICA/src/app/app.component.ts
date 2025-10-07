// src/app/app.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, async pipe, etc.
import { RouterOutlet } from '@angular/router';
import { MusicService } from './services/music.services';
import { Song } from './models/song.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // Importar CommonModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Inyección de dependencias moderna con inject()
  musicService = inject(MusicService);

  playlist: Song[] = [];
  
  // Exponemos los observables del servicio a la plantilla
  currentSong$ = this.musicService.getCurrentSong();
  isPlaying$ = this.musicService.getIsPlaying();
  currentTime$ = this.musicService.getCurrentTime();
  duration$ = this.musicService.getDuration();

  constructor() {
    this.playlist = this.musicService.getPlaylist();
  }

  // Métodos que llaman al servicio
  play(song: Song) {
    this.musicService.playSong(song);
  }

  togglePlayPause() {
    this.musicService.togglePlayPause();
  }

  nextSong() {
    this.musicService.next();
  }

  prevSong() {
    this.musicService.previous();
  }

  // Manejar el cambio en la barra de progreso
  onSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    this.musicService.seekTo(Number(input.value));
  }

  // Función para formatear el tiempo de segundos a MM:SS
  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}