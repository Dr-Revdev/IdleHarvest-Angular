import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { FormatNumberPipe } from '../../shared/pipes/format-number-pipe';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [FormatNumberPipe, DecimalPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.loadGame();
    this.gameService.startGameLoop();
  }

  ngOnDestroy(): void {
    this.gameService.stopGameLoop();
  }
}