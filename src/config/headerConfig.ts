/**
 * Header height constants for scroll offset calculations
 * Used across the app in AppShell, Settings, PaginatedEventGrid, etc.
 */
export const HEADER_CONFIG = {
  // Desktop header height (sm breakpoint and up)
  DESKTOP: 120,
  // Mobile header height (below sm breakpoint)
  MOBILE: 80,
};

/**
 * Get the appropriate header height based on screen size
 * @param isMobileScreen - Whether the current screen is mobile size
 * @returns The header height in pixels
 */
export const getHeaderHeight = (isMobileScreen: boolean): number => {
  return isMobileScreen ? HEADER_CONFIG.MOBILE : HEADER_CONFIG.DESKTOP;
};
