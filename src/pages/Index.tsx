import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { LiveStreamCard } from "@/components/LiveStreamCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Zap, Users } from "lucide-react";

const Index = () => {
  const liveStreams = [
    {
      title: "Late Night Music Jam Session 🎵",
      hosts: [{ name: "Maya" }, { name: "Jake" }],
      viewers: 1234,
      category: "Music",
      thumbnail: "",
    },
    {
      title: "Coding a Game Together | Unity + C#",
      hosts: [{ name: "Alex" }, { name: "Sam" }],
      viewers: 856,
      category: "Tech",
      thumbnail: "",
    },
    {
      title: "Travel Stories & Photography Tips",
      hosts: [{ name: "Lisa" }, { name: "Tom" }],
      viewers: 2341,
      category: "Lifestyle",
      thumbnail: "",
    },
    {
      title: "Digital Art Challenge - Draw Together!",
      hosts: [{ name: "Nina" }, { name: "Raj" }],
      viewers: 678,
      category: "Art",
      thumbnail: "",
    },
    {
      title: "Gaming Tournament Finals 🎮",
      hosts: [{ name: "Chris" }, { name: "Emma" }],
      viewers: 4521,
      category: "Gaming",
      thumbnail: "",
    },
    {
      title: "Cooking Different Cuisines Challenge",
      hosts: [{ name: "Sofia" }, { name: "Leo" }],
      viewers: 1890,
      category: "Food",
      thumbnail: "",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="flex">
        <AppSidebar />
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Hero Banner */}
          <div className="relative overflow-hidden bg-gradient-hero p-8 md:p-12">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <Sparkles className="w-4 h-4 text-white animate-pulse-glow" />
                <span className="text-sm font-medium text-white">Ready to connect?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Find Your Streaming Twin
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Get matched with someone who shares your passion. Go live together in seconds.
              </p>
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                <Zap className="h-4 w-4" />
                Start Matching Now
              </Button>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="p-4 md:p-6">
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="live" className="gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  Live Now
                </TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
              </TabsList>

              <TabsContent value="live" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Live Streams
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {liveStreams.length} twin streams happening now
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveStreams.map((stream, idx) => (
                    <LiveStreamCard key={idx} {...stream} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="following">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Follow some twins to see their streams here!</p>
                </div>
              </TabsContent>

              <TabsContent value="discover">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Discover new content and streamers</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
