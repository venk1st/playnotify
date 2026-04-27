import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService, GameMode } from '../services/game';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  highScores: Record<GameMode, number> = {
    school: 0,
    work: 0,
    social: 0
  };

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadHighScores();
  }

  async ionViewWillEnter() {
    await this.loadHighScores();
  }

  private async loadHighScores() {
    this.highScores.school = await this.gameService.getHighScore('school');
    this.highScores.work = await this.gameService.getHighScore('work');
    this.highScores.social = await this.gameService.getHighScore('social');
  }

  async play(mode: GameMode) {
    await this.gameService.setMode(mode);
    this.router.navigate(['/game']);
  }
}
