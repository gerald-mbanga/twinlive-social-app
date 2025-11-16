import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Users } from "lucide-react";

interface LiveStreamCardProps {
  title: string;
  hosts: { name: string; avatar?: string }[];
  viewers: number;
  category: string;
  thumbnail: string;
}

export const LiveStreamCard = ({ title, hosts, viewers, category, thumbnail }: LiveStreamCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground animate-pulse-glow gap-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            LIVE
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
          <Eye className="h-3 w-3" />
          <span className="font-medium">{viewers.toLocaleString()}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex -space-x-2">
            {hosts.map((host, idx) => (
              <Avatar key={idx} className="w-10 h-10 border-2 border-background">
                <AvatarImage src={host.avatar} />
                <AvatarFallback className="bg-gradient-hero text-white text-xs">
                  {host.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {hosts.map(h => h.name).join(" & ")}
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              {category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
