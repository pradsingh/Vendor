
import { Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./ui/button";

export function HomeButton() {
  return (
    <Button variant="ghost" className="absolute top-4 left-4" asChild>
      <Link href="/">
        <Home className="h-6 w-6 text-primary" />
      </Link>
    </Button>
  );
}
