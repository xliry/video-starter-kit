import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { Logo } from "./logo";
import { Badge } from "./ui/badge";

export default function Header() {
  return (
    <header className="px-4 py-2 flex justify-between items-center border-b border-border">
      <h1 className="text-lg font-medium">
        <Logo />
      </h1>
      <nav className="flex flex-row items-center justify-end gap-1">
        <Badge
          variant="secondary"
          className="bg-sky-700/50 text-sky-300 pointer-events-auto cursor-default hover:bg-sky-700/60"
        >
          <InfoIcon className="w-3 h-3 mr-1" />
          demo
        </Badge>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://fal.ai" target="_blank" rel="noopener noreferrer">
            fal.ai
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/fal-ai/fal-video-studio"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Button>
      </nav>
    </header>
  );
}
