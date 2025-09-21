import { useOnlineStatus } from '@/hooks/use-online-status';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showOnlineStatus?: boolean;
}

export function OfflineIndicator({ className, showOnlineStatus = false }: OfflineIndicatorProps) {
  const isOnline = useOnlineStatus();

  if (isOnline && !showOnlineStatus) {
    return null;
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        isOnline 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-orange-50 text-orange-700 border-orange-200",
        className
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3 mr-1" />
          Online
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 mr-1" />
          Offline
        </>
      )}
    </Badge>
  );
}