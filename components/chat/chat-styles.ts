export const chatPanelMobile =
  "fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[60] flex max-h-[min(78dvh,calc(100dvh-9rem))] flex-col overflow-hidden";

export const chatPanelDesktop = "sm:inset-x-auto sm:bottom-24 sm:w-[min(100%,380px)] sm:max-h-[min(85dvh,560px)]";

export const chatFabBase =
  "fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-xl transition";

export const chatFabBottom =
  "bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]";

export const chatMessagesArea =
  "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4";
