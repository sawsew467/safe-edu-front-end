import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
  LucideIcon,
} from "lucide-react";

interface AlertIconProps {
  iconName: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  CheckCircle: CheckCircle,
  AlertCircle: AlertCircle,
  AlertTriangle: AlertTriangle,
  AlertOctagon: AlertOctagon,
};

export function AlertIcon({ iconName, className = "h-5 w-5" }: AlertIconProps) {
  const Icon = iconMap[iconName] || CheckCircle;

  return <Icon className={className} />;
}
