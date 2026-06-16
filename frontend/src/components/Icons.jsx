/* Lightweight inline SVG icon set (stroke = currentColor). */
const S = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IconCard = (p) => (<svg {...S} {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>)
export const IconCar = (p) => (<svg {...S} {...p}><path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M5 12h14"/></svg>)
export const IconHome = (p) => (<svg {...S} {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11h14V9"/></svg>)
export const IconSparkle = (p) => (<svg {...S} {...p}><path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3Z"/><path d="M19 14l.8 2 .2.8M5 4l.6 1.6"/></svg>)
export const IconLogout = (p) => (<svg {...S} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>)
export const IconCheck = (p) => (<svg {...S} {...p}><path d="M20 6 9 17l-5-5"/></svg>)
export const IconClose = (p) => (<svg {...S} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>)
export const IconDownload = (p) => (<svg {...S} {...p}><path d="M12 3v12M7 11l5 5 5-5"/><path d="M5 21h14"/></svg>)
export const IconCopy = (p) => (<svg {...S} {...p}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>)
export const IconEdit = (p) => (<svg {...S} {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>)
export const IconBack = (p) => (<svg {...S} {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>)
export const IconShare = (p) => (<svg {...S} {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>)
export const IconWand = IconSparkle
export const IconUpload = (p) => (<svg {...S} {...p}><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 20h14"/></svg>)
export const IconImage = (p) => (<svg {...S} {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>)
export const IconSettings = (p) => (<svg {...S} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>)
export const IconChevron = (p) => (<svg {...S} {...p}><path d="m9 18 6-6-6-6"/></svg>)
export const IconPhone = (p) => (<svg {...S} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>)
export const IconMail = (p) => (<svg {...S} {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>)
export const IconGlobe = (p) => (<svg {...S} {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/></svg>)
export const IconPin = (p) => (<svg {...S} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>)
export const IconArrow = (p) => (<svg {...S} {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>)

/* Brand glyphs (filled) */
const B = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' }
export const IconWhatsApp = (p) => (<svg {...B} {...p}><path d="M.06 24l1.7-6.2A11.86 11.86 0 1 1 12 24a11.9 11.9 0 0 1-5.7-1.46L.06 24Zm6.6-3.8.37.22a9.86 9.86 0 1 0-3.37-3.37l.23.38-1 3.63 3.77-.86ZM17.4 14.3c-.15-.25-.55-.4-1.15-.7s-1.42-.7-1.64-.78-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a8.06 8.06 0 0 1-2.37-1.46 8.9 8.9 0 0 1-1.64-2.04c-.17-.3 0-.45.13-.6s.25-.28.37-.43a1.7 1.7 0 0 0 .25-.42.46.46 0 0 0 0-.43c-.06-.12-.54-1.3-.74-1.78s-.4-.4-.54-.41h-.46a.9.9 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2 4.68 4.68 0 0 0 .98 2.48 10.7 10.7 0 0 0 4.1 3.62c2.45 1.06 2.45.7 2.9.66a2.46 2.46 0 0 0 1.62-1.14 2 2 0 0 0 .14-1.14Z"/></svg>)
export const IconFacebook = (p) => (<svg {...B} {...p}><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>)
export const IconX = (p) => (<svg {...B} {...p}><path d="M18.24 2H21.5l-7.13 8.15L22.75 22h-6.6l-5.17-6.76L4.06 22H.8l7.62-8.71L1.25 2H8l4.67 6.18L18.24 2Zm-1.16 18h1.8L7.02 3.9H5.08L17.08 20Z"/></svg>)
export const IconLinkedIn = (p) => (<svg {...B} {...p}><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V9.99H5.67v8.35h2.67ZM7 8.8a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1Zm11.34 9.54v-4.57c0-2.45-1.31-3.59-3.05-3.59a2.63 2.63 0 0 0-2.39 1.31V9.99h-2.67v8.35h2.67v-4.4c0-1.16.22-2.28 1.65-2.28 1.42 0 1.44 1.32 1.44 2.36v4.32h2.35Z"/></svg>)
