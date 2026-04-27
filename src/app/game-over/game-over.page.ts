import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService, GameState, GameMode } from '../services/game';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.page.html',
  styleUrls: ['./game-over.page.scss'],
  standalone: false,
})
export class GameOverPage implements OnInit {
  gameState!: GameState;
  isNewRecord = false;

  get score(): number { return this.gameState.score; }
  get highScore(): number { return this.gameState.highScore; }
  get round(): number { return this.gameState.round; }

  get modeEmoji(): string {
    const map: Record<GameMode, string> = { school: '📚', work: '💼', social: '📱' };
    return this.gameState.mode ? map[this.gameState.mode] : '🎮';
  }

  get modeLabel(): string {
    const map: Record<GameMode, string> = { school: 'Sekolah', work: 'Kerja', social: 'Sosial' };
    return this.gameState.mode ? map[this.gameState.mode] : '';
  }

  get rating(): { stars: number; label: string } {
    const s = this.gameState.score;
    if (s >= 100) return { stars: 5, label: 'Luar Biasa! 🏆' };
    if (s >= 70)  return { stars: 4, label: 'Hebat! 🎉' };
    if (s >= 40)  return { stars: 3, label: 'Bagus! 👍' };
    if (s >= 20)  return { stars: 2, label: 'Coba Lagi 💪' };
    return { stars: 1, label: 'Butuh Latihan 😅' };
  }

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameState = this.gameService.getGameState();
    if (!this.gameState.mode) {
      this.router.navigate(['/home']);
      return;
    }
    this.isNewRecord = this.gameState.score > 0 &&
      this.gameState.score === this.gameState.highScore;
  }

  async replay() {
    if (this.gameState.mode) {
      await this.gameService.setMode(this.gameState.mode);
      this.router.navigate(['/game']);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
