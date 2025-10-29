"use client";

import { motion } from "framer-motion";

import { AlertInfo } from "../lib/alert-logic";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AlertBadgeProps {
  alertInfo: AlertInfo;
}

export function AlertBadge({ alertInfo }: AlertBadgeProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-3 p-4 rounded-lg border bg-card"
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
            alertInfo.color,
          )}
        >
          <span className="text-xl">{alertInfo.icon}</span>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Badge
            className={cn("font-semibold", alertInfo.color, "text-white")}
            variant="secondary"
          >
            Level {alertInfo.level} - {alertInfo.name}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{alertInfo.description}</p>
      </div>
    </motion.div>
  );
}
