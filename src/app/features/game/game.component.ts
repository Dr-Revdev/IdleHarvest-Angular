import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.services';
import { FormatNumberPipe } from '../../shared/pipes/format-number-pipe';

@Component({
  selector: 'app-game',
  imports: [FormatNumberPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  constructor(
    private changeDetector: ChangeDetectorRef,
    public gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gameService.loadGame();

    this.gameService.startAutoProduction(() => {
      this.changeDetector.detectChanges();
    });
  }
}