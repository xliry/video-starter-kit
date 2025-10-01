"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRightIcon, PlayIcon, LayersIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface Segment {
  id: number;
  startFrame: string;
  endFrame: string;
  status: "pending" | "processing" | "completed";
}

export default function SegmentProcessing() {
  // Mock segments for now
  const segments: Segment[] = [
    { id: 0, startFrame: "Frame 0", endFrame: "Frame 1", status: "completed" },
    { id: 1, startFrame: "Frame 1", endFrame: "Frame 2", status: "pending" },
    { id: 2, startFrame: "Frame 2", endFrame: "Frame 3", status: "pending" },
  ];

  return (
    <div className="border-b border-border">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="segments" className="border-b-0">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex flex-row items-center gap-2 w-full">
              <LayersIcon className="w-4 h-4 opacity-50" />
              <h2 className="text-sm text-muted-foreground font-semibold flex-1 text-left">
                Segment Processing
              </h2>
              <Badge variant="secondary" className="text-xs">
                {segments.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-col gap-2 px-4">
              <p className="text-xs text-muted-foreground mb-2">
                Keyframes are broken into segments for processing
              </p>

              <div className="space-y-2">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 border border-border"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          Segment {segment.id}
                        </span>
                        <Badge
                          variant={
                            segment.status === "completed"
                              ? "default"
                              : segment.status === "processing"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {segment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                          {segment.startFrame}
                        </span>
                        <ArrowRightIcon className="w-3 h-3" />
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                          {segment.endFrame}
                        </span>
                      </div>
                    </div>
                    {segment.status === "pending" && (
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <PlayIcon className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400 font-medium">Note:</span>
                  <span className="text-muted-foreground">
                    End frame becomes next segment's start frame
                  </span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
