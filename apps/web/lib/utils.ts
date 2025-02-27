import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const truncateValue = (value: string, totalChar: number) => {
  if (value.length < totalChar) {
    return `${value.slice(0, totalChar)}...`;
  } else {
    return value;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
