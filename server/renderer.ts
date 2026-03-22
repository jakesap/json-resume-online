// Server-side theme renderer using installed jsonresume-theme-* packages
// Falls back to stackoverflow theme if the requested theme isn't installed

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThemeModule = {
  render: (resume: any, options?: any) => string | Promise<string>;
};

const INSTALLED_THEMES: Record<string, () => Promise<ThemeModule>> = {
  // Original themes
  stackoverflow: () => import("jsonresume-theme-stackoverflow"),
  even: () => import("jsonresume-theme-even"),
  paper: () => import("jsonresume-theme-paper"),
  spartan: () => import("jsonresume-theme-spartan"),
  flat: () => import("jsonresume-theme-flat"),
  orbit: () => import("jsonresume-theme-orbit"),
  onepage: () => import("jsonresume-theme-onepage"),
  cora: () => import("jsonresume-theme-cora"),
  // Added themes
  modern: () => import("jsonresume-theme-modern"),
  classy: () => import("jsonresume-theme-classy"),
  straightforward: () => import("jsonresume-theme-straightforward"),
  catppuccin: () => import("jsonresume-theme-catppuccin"),
  sceptile: () => import("jsonresume-theme-sceptile"),
  "modern-extended": () => import("jsonresume-theme-modern-extended"),
  simplyelegant: () => import("jsonresume-theme-simplyelegant"),
  msresume: () => import("jsonresume-theme-msresume"),
  rnord: () => import("jsonresume-theme-rnord"),
  projects: () => import("jsonresume-theme-projects"),
  printclassy: () => import("jsonresume-theme-printclassy"),
};

const FALLBACK_THEME = "stackoverflow";

export async function renderResume(resume: unknown, themeSlug: string): Promise<string> {
  const loader = INSTALLED_THEMES[themeSlug] ?? INSTALLED_THEMES[FALLBACK_THEME];

  let themeModule: ThemeModule;
  try {
    themeModule = await loader();
  } catch {
    themeModule = await INSTALLED_THEMES[FALLBACK_THEME]();
  }

  const result = await themeModule.render(resume, {});
  return result;
}
