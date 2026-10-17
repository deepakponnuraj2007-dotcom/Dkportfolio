/**
 * Cross-browser Fullscreen API utility
 * Supports standard, WebKit (Safari, iOS), Mozilla (Firefox), and MS (Edge/IE)
 */

export const isFullscreenSupported = (): boolean => {
  if (typeof document === 'undefined') return false;
  const doc = document as any;
  return Boolean(
    doc.fullscreenEnabled ||
    doc.webkitFullscreenEnabled ||
    doc.mozFullScreenEnabled ||
    doc.msFullscreenEnabled
  );
};

export const isFullscreenActive = (): boolean => {
  if (typeof document === 'undefined') return false;
  const doc = document as any;
  return Boolean(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
};

export const isInIframe = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const requestFullscreenMode = async (element?: HTMLElement): Promise<boolean> => {
  if (typeof document === 'undefined') return false;
  try {
    if (isFullscreenActive()) return true;

    const target = element || document.documentElement || document.body;
    const anyTarget = target as any;

    if (anyTarget.requestFullscreen) {
      await anyTarget.requestFullscreen();
      return true;
    } else if (anyTarget.webkitRequestFullscreen) {
      await anyTarget.webkitRequestFullscreen();
      return true;
    } else if (anyTarget.webkitRequestFullScreen) {
      await anyTarget.webkitRequestFullScreen();
      return true;
    } else if (anyTarget.mozRequestFullScreen) {
      await anyTarget.mozRequestFullScreen();
      return true;
    } else if (anyTarget.msRequestFullscreen) {
      await anyTarget.msRequestFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('Native fullscreen request blocked or unsupported:', err);
  }
  return false;
};

export const exitFullscreenMode = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;
  try {
    const doc = document as any;
    if (!isFullscreenActive()) return true;

    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
      return true;
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
      return true;
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
      return true;
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('Exit fullscreen request could not be completed:', err);
  }
  return false;
};

export const toggleFullscreenMode = async (element?: HTMLElement): Promise<boolean> => {
  if (isFullscreenActive()) {
    return exitFullscreenMode();
  } else {
    return requestFullscreenMode(element);
  }
};
