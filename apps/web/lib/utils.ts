import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Descendant, Node } from "slate";

export const CalculateAverageTimeToRead = (
  text: string,
  averageWPM: number,
) => {
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = wordCount / averageWPM;
  return Math.round(readingTime);
};

export const serialize = (nodes: Descendant[]) => {
  return nodes.map((node) => Node.string(node)).join("\n");
};

export const truncateValue = (value: string, totalChar: number) => {
  if (value.length > totalChar) {
    return `${value.slice(0, totalChar)}...`;
  } else {
    return value;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
