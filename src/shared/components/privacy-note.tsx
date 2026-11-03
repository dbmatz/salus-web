import { cn } from "@/shared/lib/utils"
import { Lock } from "lucide-react";

export function PrivacyNote({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg bg-success-subtle px-4 py-3 text-sm text-success-foreground", className)}
      {...props}>
      <Lock className="size-5 shrink-0 text-success-icon" aria-hidden="true" />
      <p>{children}</p>
    </div>

  )
}