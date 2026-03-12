import { LuBook, LuLaptop, LuDumbbell, LuActivity, LuPen, LuTarget, LuWaves, LuMusic, LuClipboardList, LuMicroscope, LuPalette, LuSmile, LuHeart, LuStar, LuCoffee, LuTrophy } from "react-icons/lu";

export const HABIT_ICONS = {
  LuBook, LuLaptop, LuDumbbell, LuActivity, LuPen, LuTarget, 
  LuWaves, LuMusic, LuClipboardList, LuMicroscope, LuPalette,
  LuSmile, LuHeart, LuStar, LuCoffee, LuTrophy
};

export const HABIT_ICON_NAMES = Object.keys(HABIT_ICONS);

export function renderHabitIcon(iconName: string, className?: string) {
  const Icon = (HABIT_ICONS as any)[iconName];
  if (Icon) return <Icon className={className || "h-5 w-5"} />;
  // Fallback for old emojis that might be stored in localStorage
  return <span className={className}>{iconName}</span>;
}
