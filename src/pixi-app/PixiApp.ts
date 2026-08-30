import { Application } from "pixi.js";

export class PixiApp {
  private app: Application | null = null;
  private isInitialized = false;

  public async init(container: HTMLElement): Promise<void> {
    if (this.isInitialized && this.app?.renderer) {
      if (this.app.canvas && !container.contains(this.app.canvas)) {
        container.appendChild(this.app.canvas);
      }
      return;
    }

    const app = new Application();
    this.app = app;

    await app.init({
      resizeTo: window,
      backgroundColor: 0x000000,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    if (!container.contains(app.canvas)) {
      container.appendChild(app.canvas);
    }

    this.isInitialized = true;
  }

  public getApplication(): Application | null {
    return this.app;
  }

  public destroy(): void {
    if (this.app?.renderer) {
      if (this.app.canvas?.parentElement) {
        this.app.canvas.parentElement.removeChild(this.app.canvas);
      }
      this.app.destroy(true, { children: true });
    }

    this.app = null;
    this.isInitialized = false;
  }
}

export const pixiApp = new PixiApp();
