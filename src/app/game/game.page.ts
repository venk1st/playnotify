import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GameService, NotificationItem, GameState } from '../services/game';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements OnInit, OnDestroy {
  gameState!: GameState;
  currentNotification!: NotificationItem;
  timeLeft = 100; // percentage 0–100
  timer: any;
  cardVisible = false;
  isProcessing = false;

  get modeLabel(): string {
    const labels: Record<string, string> = {
      school: '📚 Sekolah',
      work: '💼 Kerja',
      social: '📱 Sosial'
    };
    return this.gameState?.mode ? labels[this.gameState.mode] : '';
  }

  get focusColor(): string {
    if (!this.gameState) return 'primary';
    if (this.gameState.focus <= 20) return 'danger';
    if (this.gameState.focus <= 50) return 'warning';
    return 'success';
  }

  get score(): number { return this.gameState?.score ?? 0; }
  get focus(): number { return this.gameState?.focus ?? 100; }
  get round(): number { return this.gameState?.round ?? 0; }
  get streak(): number { return this.gameState?.correctStreak ?? 0; }
  get showStreak(): boolean { return (this.gameState?.correctStreak ?? 0) >= 3; }
  get gameMode(): string { return this.gameState?.mode ?? ''; }

  constructor(
    private gameService: GameService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.gameState = this.gameService.getGameState();
    if (!this.gameState.mode) {
      this.router.navigate(['/home']);
      return;
    }
    setTimeout(() => this.nextNotification(), 600);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  nextNotification() {
    if (this.gameService.isGameOver()) {
      this.router.navigate(['/game-over']);
      return;
    }
    this.stopTimer();
    this.cardVisible = false;
    this.isProcessing = false;

    setTimeout(() => {
      this.currentNotification = this.gameService.getRandomNotification();
      this.timeLeft = 100;
      this.cardVisible = true;
      this.startTimer();
    }, 300);
  }

  startTimer() {
    const duration = this.gameService.getTimerDuration();
    const tick = 50; // ms
    const step = 100 / (duration / tick);

    this.timer = setInterval(() => {
      this.timeLeft = Math.max(0, this.timeLeft - step);
      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.onTimeout();
      }
    }, tick);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async choose(action: 'open' | 'ignore') {
    if (this.isProcessing || !this.currentNotification) return;
    this.isProcessing = true;
    this.stopTimer();

    const isCorrect = action === 'open'
      ? this.currentNotification.isImportant
      : !this.currentNotification.isImportant;

    const msg = await this.gameService.processChoice(isCorrect);
    await this.showToast(msg, isCorrect ? 'success' : 'danger');

    if (this.gameService.isGameOver()) {
      this.router.navigate(['/game-over']);
    } else {
      this.nextNotification();
    }
  }

  async onTimeout() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const msg = await this.gameService.processTimeout(
      this.currentNotification?.isImportant ?? false
    );
    await this.showToast(msg, 'warning');

    if (this.gameService.isGameOver()) {
      this.router.navigate(['/game-over']);
    } else {
      this.nextNotification();
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1200,
      position: 'top',
      color,
      cssClass: 'game-toast'
    });
    await toast.present();
  }
}
