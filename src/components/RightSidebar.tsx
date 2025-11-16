import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame } from "lucide-react";

export const RightSidebar = () => {
  const trendingTopics = [
    { tag: "#MusicJam", streams: 2543 },
    { tag: "#CodingLive", streams: 1876 },
    { tag: "#GameNight", streams: 3421 },
    { tag: "#ArtStream", streams: 1234 },
  ];

  const suggestedUsers = [
    { name: "Alex Chen", category: "Music", avatar: "" },
    { name: "Sarah Kim", category: "Gaming", avatar: "" },
    { name: "Mike Ross", category: "Tech", avatar: "" },
  ];

  return (
    <aside className="hidden xl:flex w-80 flex-col gap-4 p-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trendingTopics.map((topic, idx) => (
            <button
              key={idx}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div>
                <p className="font-medium text-sm">{topic.tag}</p>
                <p className="text-xs text-muted-foreground">
                  {topic.streams.toLocaleString()} streams
                </p>
              </div>
              <Flame className="h-4 w-4 text-primary" />
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Suggested Twins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedUsers.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-hero text-white text-xs">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.category}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};
