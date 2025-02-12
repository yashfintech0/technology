import { cn } from "@/lib/utils"

export function AdBanner({ className, vertical }: { className?: string; vertical?: boolean }) {
  return (
    <div className={cn("bg-muted p-4 text-center rounded-lg", vertical ? "min-h-[600px]" : "", className)}>
      <div className="text-sm text-muted-foreground">Advertisement</div>
      <div
        className={cn(
          "bg-muted-foreground/10 rounded-md flex items-center justify-center",
          vertical ? "aspect-[300/600]" : "aspect-[728/90]",
        )}
      >
        <span className="text-muted-foreground">Ad Space Available</span>
      </div>
    </div>
  )
}

