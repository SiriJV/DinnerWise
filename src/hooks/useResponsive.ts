import { useMediaQuery } from '@mantine/hooks';

/**
 * Mantine breakpoints in em and px
 * xs: 0
 * sm: 36em (576px)
 * md: 48em (768px)
 * lg: 62em (992px)
 * xl: 75em (1200px)
 */

/**
 * Is mobile/small screen (less than md breakpoint)
 * @returns boolean - true if viewport width < 48em (768px)
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 47.9em)');
};

/**
 * Is tablet size (between sm and md)
 * @returns boolean - true if 36em <= viewport width < 48em
 */
export const useIsTablet = (): boolean => {
  return useMediaQuery('(min-width: 36em) and (max-width: 47.9em)');
};

/**
 * Is desktop/large screen (md and above)
 * @returns boolean - true if viewport width >= 48em (768px)
 */
export const useIsDesktop = (): boolean => {
  return useMediaQuery('(min-width: 48em)');
};

/**
 * Is very small screen (less than 400px)
 * @returns boolean - true if viewport width < 400px
 */
export const useIsVerySmall = (): boolean => {
  return useMediaQuery('(max-width: 25em)');
};

/**
 * Is large screen or bigger (lg and above)
 * @returns boolean - true if viewport width >= 62em (992px)
 */
export const useIsLarge = (): boolean => {
  return useMediaQuery('(min-width: 62em)');
};

/**
 * Get current breakpoint name
 * @returns 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export const useBreakpoint = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLarge = useIsLarge();

  if (isLarge) {
    return useMediaQuery('(min-width: 75em)') ? 'xl' : 'lg';
  }
  if (isTablet) return 'sm';
  if (isMobile && !isTablet) return 'xs';
  return 'md';
};
