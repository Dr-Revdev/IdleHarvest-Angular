import { Component } from '@angular/core';
import { GameComponent } from './features/game/game.component';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}