"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = (theme ?? "system") as keyof typeof themeIcons;
  const ThemeIcon = themeIcons[currentTheme] ?? Monitor;

  return (
    <Select value={currentTheme} onValueChange={setTheme}>
      <SelectTrigger
        icon={ThemeIcon}
        placeholder="Theme"
        variant="borderless"
        className="min-w-0 h-8 text-xs pr-1"
      />
      <SelectContent>
        <SelectItem index={0} value="system" icon={Monitor}>
          System
        </SelectItem>
        <SelectItem index={1} value="light" icon={Sun}>
          Light
        </SelectItem>
        <SelectItem index={2} value="dark" icon={Moon}>
          Dark
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
