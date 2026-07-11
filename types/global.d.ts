export {};

declare global {
  interface Window {
    /** Set by the preloader once its exit animation has finished. */
    __preloaderDone?: boolean;
  }

  interface WindowEventMap {
    "preloader:done": Event;
  }
}
