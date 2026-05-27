import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.services';

@Component({
  selector: 'app-game',
  imports: [],
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