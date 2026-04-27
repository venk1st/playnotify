import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface NotificationItem {
  id: number;
  title: string;
  app: string;
  message: string;
  isImportant: boolean;
  icon: string;
  color: string;
}

export type GameMode = 'school' | 'work' | 'social';

export interface GameState {
  score: number;
  focus: number;
  mode: GameMode | null;
  highScore: number;
  round: number;
  correctStreak: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private state: GameState = {
    score: 0,
    focus: 100,
    mode: null,
    highScore: 0,
    round: 0,
    correctStreak: 0
  };

  private notifications: Record<GameMode, NotificationItem[]> = {
    school: [
      // PENTING
      { id: 1, title: 'Pak Budi (Guru)', app: 'Classroom', message: 'Tugas Matematika dikumpulkan besok pagi!', isImportant: true, icon: 'book-outline', color: '#1e88e5' },
      { id: 2, title: 'Kepala Sekolah', app: 'SchoolApp', message: 'Besok ada ulangan mendadak Bahasa Indonesia.', isImportant: true, icon: 'alert-circle-outline', color: '#e53935' },
      { id: 3, title: 'Wali Kelas', app: 'Pesan', message: 'Rapat orang tua murid Sabtu jam 08.00.', isImportant: true, icon: 'people-outline', color: '#00897b' },
      { id: 4, title: 'Bu Rina (Guru IPA)', app: 'Classroom', message: 'Praktikum laboratorium jam 2 siang ini!', isImportant: true, icon: 'flask-outline', color: '#8e24aa' },
      { id: 5, title: 'Perpustakaan', app: 'Library', message: 'Buku pinjaman harus dikembalikan hari ini!', isImportant: true, icon: 'library-outline', color: '#f57c00' },
      // TIDAK PENTING
      { id: 6, title: 'Budi', app: 'WhatsApp', message: 'Wkwkwk liat meme ini lucu banget bro 😂', isImportant: false, icon: 'chatbubble-outline', color: '#25D366' },
      { id: 7, title: 'Game Store', app: 'Play Store', message: 'DISKON 90%! Beli diamond game sekarang!', isImportant: false, icon: 'game-controller-outline', color: '#ff6f00' },
      { id: 8, title: 'TikTok', app: 'TikTok', message: 'Video baru dari akun favoritmu sudah tayang!', isImportant: false, icon: 'musical-notes-outline', color: '#010101' },
      { id: 9, title: 'Shopee', app: 'Shopee', message: 'Flash sale 12.12! Produk impianmu diskon 70%!', isImportant: false, icon: 'cart-outline', color: '#f05e23' },
      { id: 10, title: 'Instagram', app: 'Instagram', message: '😍 Seseorang menyukai foto profilmu!', isImportant: false, icon: 'heart-outline', color: '#e1306c' },
    ],
    work: [
      // PENTING
      { id: 11, title: 'Pak Direktur', app: 'Email', message: 'URGENT: Revisi laporan Q4 sebelum jam 3 sore!', isImportant: true, icon: 'briefcase-outline', color: '#c62828' },
      { id: 12, title: 'Google Calendar', app: 'Calendar', message: 'Meeting klien dimulai dalam 10 menit!', isImportant: true, icon: 'calendar-outline', color: '#1a73e8' },
      { id: 13, title: 'HRD', app: 'WorkApp', message: 'Batas pengisian timesheet hari ini jam 5!', isImportant: true, icon: 'time-outline', color: '#2e7d32' },
      { id: 14, title: 'Tim Proyek', app: 'Slack', message: 'Server production DOWN! Perlu tindakan segera!', isImportant: true, icon: 'warning-outline', color: '#e53935' },
      { id: 15, title: 'Client ABC', app: 'Email', message: 'Request perubahan kontrak - harap ditinjau ASAP', isImportant: true, icon: 'mail-outline', color: '#1565c0' },
      // TIDAK PENTING
      { id: 16, title: 'Tokopedia', app: 'Tokopedia', message: 'Flash Sale! Laptop impianmu diskon 50% hari ini!', isImportant: false, icon: 'bag-handle-outline', color: '#42a5f5' },
      { id: 17, title: 'LinkedIn', app: 'LinkedIn', message: '12 orang melihat profil LinkedIn Anda minggu ini', isImportant: false, icon: 'logo-linkedin', color: '#0077b5' },
      { id: 18, title: 'Twitter/X', app: 'Twitter', message: 'Topik #MondayMotivation sedang trending sekarang!', isImportant: false, icon: 'logo-twitter', color: '#1da1f2' },
      { id: 19, title: 'YouTube', app: 'YouTube', message: 'Konten baru: "10 Tips Produktivitas Kerja 2024"', isImportant: false, icon: 'logo-youtube', color: '#ff0000' },
      { id: 20, title: 'Promo Bank', app: 'BankApp', message: 'Cashback 20% untuk transaksi di merchant pilihan!', isImportant: false, icon: 'card-outline', color: '#00838f' },
    ],
    social: [
      // PENTING
      { id: 21, title: 'Mama', app: 'Telepon', message: 'Nak, angkat telepon Mama sekarang ya!', isImportant: true, icon: 'call-outline', color: '#e53935' },
      { id: 22, title: 'Reza (Teman)', app: 'WhatsApp', message: 'Tolong aku, aku ada kecelakaan di jalan tol!', isImportant: true, icon: 'help-buoy-outline', color: '#e53935' },
      { id: 23, title: 'RS Medika', app: 'Pesan', message: 'Jadwal kontrol kesehatan Anda besok jam 09.00', isImportant: true, icon: 'medical-outline', color: '#d81b60' },
      { id: 24, title: 'Bank BCA', app: 'BankApp', message: 'Verifikasi transaksi mencurigakan - konfirmasi?', isImportant: true, icon: 'shield-checkmark-outline', color: '#1565c0' },
      { id: 25, title: 'Papa', app: 'Telepon', message: 'Papa coba hubungi kamu, penting sekali!', isImportant: true, icon: 'call-outline', color: '#1565c0' },
      // TIDAK PENTING
      { id: 26, title: 'Instagram', app: 'Instagram', message: '@anak_kekinian menyukai foto liburanmu ✨', isImportant: false, icon: 'logo-instagram', color: '#e1306c' },
      { id: 27, title: 'Trending', app: 'YouTube', message: 'VIRAL: Kucing berbicara bahasa manusia! 😱', isImportant: false, icon: 'videocam-outline', color: '#ff0000' },
      { id: 28, title: 'Facebook', app: 'Facebook', message: 'Andi mengundang Anda bergabung ke grup "Memes"', isImportant: false, icon: 'logo-facebook', color: '#1877f2' },
      { id: 29, title: 'Spotify', app: 'Spotify', message: 'Lagu baru dari artis favoritmu sudah tersedia!', isImportant: false, icon: 'musical-note-outline', color: '#1db954' },
      { id: 30, title: 'GoFood', app: 'Gojek', message: 'Promo makan siang! Diskon 30% s/d jam 13.00', isImportant: false, icon: 'restaurant-outline', color: '#00aed9' },
    ]
  };

  constructor() {}

  getGameState(): GameState {
    return this.state;
  }

  async setMode(mode: GameMode) {
    const hs = await this.getHighScore(mode);
    this.state = {
      score: 0,
      focus: 100,
      mode: mode,
      highScore: hs,
      round: 0,
      correctStreak: 0
    };
  }

  getRandomNotification(): NotificationItem {
    if (!this.state.mode) throw new Error('Mode not set');
    const items = this.notifications[this.state.mode];

    // In social mode, increase proportion of unimportant notifications over time
    if (this.state.mode === 'social' && this.state.round > 5) {
      const roll = Math.random();
      if (roll < 0.65) {
        const unimportant = items.filter(n => !n.isImportant);
        return unimportant[Math.floor(Math.random() * unimportant.length)];
      }
    }

    return items[Math.floor(Math.random() * items.length)];
  }

  /** Returns the timer duration in ms — gets faster each round */
  getTimerDuration(): number {
    const base: Record<GameMode, number> = { school: 5000, work: 3000, social: 4000 };
    if (!this.state.mode) return 5000;
    const baseDuration = base[this.state.mode];
    // Reduce by 100ms per round, minimum 1 second
    const reduction = Math.min(this.state.round * 100, baseDuration - 1000);
    return baseDuration - reduction;
  }

  async processChoice(isCorrect: boolean): Promise<string> {
    this.state.round++;
    let feedbackMsg = '';

    if (isCorrect) {
      this.state.score += 10;
      this.state.correctStreak++;
      // Bonus for streaks
      if (this.state.correctStreak >= 3) {
        this.state.score += 5; // bonus streak
      }
      this.state.focus = Math.min(100, this.state.focus + 10);
      feedbackMsg = this.state.correctStreak >= 3
        ? `🔥 Streak x${this.state.correctStreak}! Fokus kamu luar biasa!`
        : '✅ Fokus kamu bagus!';
    } else {
      this.state.correctStreak = 0;
      this.state.score = Math.max(0, this.state.score - 5);
      const penalty = this.state.mode === 'work' ? 20 : 15;
      this.state.focus = Math.max(0, this.state.focus - penalty);
      try { await Haptics.impact({ style: ImpactStyle.Heavy }); } catch (_) {}
      feedbackMsg = '❌ Kamu terdistraksi!';
    }

    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      await this.saveHighScore();
    }

    return feedbackMsg;
  }

  async processTimeout(isImportant: boolean): Promise<string> {
    this.state.round++;
    this.state.correctStreak = 0;
    const penalty = this.state.mode === 'work' ? 20 : 15;
    this.state.focus = Math.max(0, this.state.focus - penalty);
    this.state.score = Math.max(0, this.state.score - 5);
    try { await Haptics.impact({ style: ImpactStyle.Heavy }); } catch (_) {}

    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      await this.saveHighScore();
    }

    return isImportant ? '⏰ Kamu melewatkan hal penting!' : '⏰ Waktu habis!';
  }

  private async saveHighScore() {
    await Preferences.set({
      key: `highScore_${this.state.mode}`,
      value: this.state.highScore.toString()
    });
  }

  async getHighScore(mode: GameMode): Promise<number> {
    const { value } = await Preferences.get({ key: `highScore_${mode}` });
    return value ? parseInt(value, 10) : 0;
  }

  isGameOver(): boolean {
    return this.state.focus <= 0;
  }
}
