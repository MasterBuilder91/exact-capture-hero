import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { LogOut, User, FlaskConical, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, signOut, subscription } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container max-w-6xl flex items-center justify-between h-14 px-4">
          <a href="/" className="font-display text-xl font-bold gradient-brand-text">
            bornmalebornfemale<span className="text-xs align-super text-muted-foreground">.com</span>
          </a>

          <div className="flex items-center gap-3">
            <Link to="/academy" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Academy
            </Link>
            <Link to="/science" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5" />
              The Science
            </Link>
            {user ? (
              <>
                {subscription.subscribed && (
                  <span className="text-xs px-2 py-1 rounded-full gradient-brand text-primary-foreground font-medium">
                    PRO
                  </span>
                )}
                <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[140px]">
                  {user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="gradient-brand text-primary-foreground"
                onClick={() => setAuthOpen(true)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Navbar;
