export interface Theme {
  slug: string
  label: string
}

// All themes rendered server-side. Slugs must match server ALLOWED_THEMES in server/index.ts.
export const THEMES: Theme[] = [
  { slug: 'catppuccin',      label: 'Catppuccin' },
  { slug: 'classy',          label: 'Classy' },
  { slug: 'cora',            label: 'Cora' },
  { slug: 'even',            label: 'Even' },
  { slug: 'flat',            label: 'Flat' },
  { slug: 'modern',          label: 'Modern' },
  { slug: 'modern-extended', label: 'Modern Extended' },
  { slug: 'msresume',        label: 'MS Resume' },
  { slug: 'onepage',         label: 'One Page' },
  { slug: 'orbit',           label: 'Orbit' },
  { slug: 'paper',           label: 'Paper' },
  { slug: 'printclassy',     label: 'Print Classy' },
  { slug: 'projects',        label: 'Projects' },
  { slug: 'rnord',           label: 'Rnord' },
  { slug: 'sceptile',        label: 'Sceptile' },
  { slug: 'simplyelegant',   label: 'Simply Elegant' },
  { slug: 'spartan',         label: 'Spartan' },
  { slug: 'stackoverflow',   label: 'Stack Overflow' },
  { slug: 'straightforward', label: 'Straightforward' },
  { slug: 'timeline-fixed',  label: 'Timeline Fixed' },
]

export const DEFAULT_THEME = 'stackoverflow'
