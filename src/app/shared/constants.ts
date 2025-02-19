export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.1 },
  transition: { duration: 0.5, ease: 'easeInOut' }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const STYLE_CONSTANTS = {
  cardBase: 'w-full h-full p-8 pb-24 flex flex-col items-center justify-center text-white text-center relative overflow-hidden',
  contentWrapper: 'space-y-6 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 w-full max-w-xl',
  heading: 'text-4xl font-black',
  subheading: 'text-2xl font-bold',
  statLabel: 'text-lg text-white/75',
  statValue: 'text-3xl font-bold',
  divider: 'border-t border-white/10'
};
