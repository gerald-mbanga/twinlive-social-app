import { Home, Compass, Users, Heart, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export const AppSidebar = () => {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Compass, label: "Discover", active: false },
    { icon: Users, label: "My Twins", active: false },
    { icon: Heart, label: "Favorites", active: false },
    { icon: Clock, label: "History", active: false },
    { icon: TrendingUp, label: "Trending", active: false },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col gap-4 p-4 border-r border-border/50">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              item.active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <Card className="p-4 mt-4 bg-gradient-feature border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Find Your Twin</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Get matched with someone who shares your vibe
            </p>
            <button className="text-xs font-medium text-primary hover:underline">
              Start Matching →
            </button>
          </div>
        </div>
      </Card>

      <div className="mt-auto pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Made by Gerald Mbanga
        </p>
      </div>
    </aside>
  );
};
