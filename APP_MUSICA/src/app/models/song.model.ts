// src/app/models/song.model.ts

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: string; // Formato "MM:SS"
  audioSrc: string; // Ruta al archivo de audio
  coverSrc: string; // Ruta a la imagen de la carátula
}