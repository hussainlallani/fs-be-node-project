import { useScreen } from "./useScreen";

export function useResponsiveColumns() {
  const screen = useScreen();
  const width = screen ?? 0;

  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}
