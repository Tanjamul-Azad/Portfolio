/**
 * Theme bootstrapping, shared by the server layout (which inlines the script
 * into <head>) and the client ThemeProvider.
 *
 * The script runs before first paint, so the stored theme is on <html> before
 * anything renders: no flash of the wrong theme. After that nothing touches
 * <html> again until the visitor actually toggles.
 */
export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME = "dark";

export const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)})||${JSON.stringify(
  DEFAULT_THEME
)};var r=t==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;if(r!=="light"&&r!=="dark")r=${JSON.stringify(
  DEFAULT_THEME
)};d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r;}catch(e){}})();`;
