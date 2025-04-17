import { useRouter } from "next/navigation";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signIn, signOut } from "@/lib/auth-client";
import {
  Home,
  Orbit,
  Crosshair,
  BookOpen,
  Briefcase,
  Link as LinkIcon,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

// Camera mode type
type CameraMode = "player" | "orbit";

// Definition of teleport locations
const LOCATIONS = {
  HOME: {
    position: [80, 14, 90],
    label: "Home",
    icon: Home,
    yaw: Math.PI / 2, // East
  },
  SKILLS: {
    position: [-60, 14, 60],
    label: "Skills",
    icon: BookOpen,
    yaw: Math.PI, // South
  },
  WORKS: {
    position: [-30, 14, -90],
    label: "Works",
    icon: Briefcase,
    yaw: Math.PI / 2, // East
  },
  LINKS: {
    position: [30, 14, 30],
    label: "Links",
    icon: LinkIcon,
    yaw: -Math.PI / 2, // West
  },
};

type LocationKey = keyof typeof LOCATIONS;

interface ControlsUIProps {
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  teleport: (locationKey: LocationKey) => void;
  currentLocation: LocationKey | null;
  portofolio: ProfileWithTypedSkills;
}

// Combined Controls component
export default function CombinedControls({
  cameraMode,
  setCameraMode,
  teleport,
  currentLocation,
  portofolio,
}: ControlsUIProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(
    portofolio.loginUser
  );

  // Update currentUser when portfolio prop changes
  useEffect(() => {
    setCurrentUser(portofolio.loginUser);
  }, [portofolio.loginUser]);

  // Handle logout with proper state management
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();

      // Update local state immediately
      setCurrentUser(null);

      // Force a refresh of the current page to ensure data is reloaded
      router.refresh();

      // Alternatively, you could navigate to the same page to force a refresh
      // const currentPath = window.location.pathname;
      // router.push(currentPath);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-10">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col gap-2">
        {/* Camera Mode Controls */}
        <div className="flex gap-2">
          <Button
            variant={cameraMode === "player" ? "default" : "outline"}
            size="sm"
            onClick={() => setCameraMode("player")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Crosshair size={16} /> Player
          </Button>
          <Button
            variant={cameraMode === "orbit" ? "default" : "outline"}
            size="sm"
            onClick={() => setCameraMode("orbit")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Orbit size={16} /> Orbit
          </Button>
        </div>

        {/* Teleport Controls */}
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-xs font-semibold opacity-70 text-white">
            Teleportation
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(LOCATIONS) as Array<LocationKey>).map((key) => {
              const location = LOCATIONS[key];
              const Icon = location.icon;
              return (
                <Button
                  key={key}
                  variant={currentLocation === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => teleport(key)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <Icon size={14} /> {location.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* User Account Controls */}
        <div className="flex flex-col gap-2 mt-2 border-t border-white/10 pt-2">
          <h3 className="text-xs font-semibold opacity-70 text-white">
            Account
          </h3>
          {currentUser ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-between gap-2 cursor-pointer"
                >
                  <User size={14} /> {currentUser}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-40" side="bottom" align="end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-between cursor-pointer"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>{" "}
                  <LogOut size={14} />
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 cursor-pointer"
              onClick={async () => {
                await signIn(`/museum/${portofolio.username}`);
              }}
            >
              <User size={14} /> Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
