import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { formatEstimate, formatPhone, LEAD_STATUSES } from "@/lib/lead-utils";
import { GripVertical, User, UserPlus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useRef, useEffect, useCallback, useState } from "react";

const statusConfig: Record<string, { border: string; bg: string; dot: string; label: string }> = {
  new: { border: "border-t-emerald-500", bg: "bg-emerald-500/10", dot: "bg-emerald-500", label: "New" },
  "1st_attempt": { border: "border-t-amber-500", bg: "bg-amber-500/10", dot: "bg-amber-500", label: "1st Attempt Call" },
  "2nd_attempt": { border: "border-t-orange-500", bg: "bg-orange-500/10", dot: "bg-orange-500", label: "2nd Attempt Call" },
  "3rd_attempt": { border: "border-t-rose-400", bg: "bg-rose-400/10", dot: "bg-rose-400", label: "3rd Attempt Call" },
  emailed: { border: "border-t-sky-500", bg: "bg-sky-500/10", dot: "bg-sky-500", label: "Emailed" },
  scheduled_estimate: { border: "border-t-indigo-500", bg: "bg-indigo-500/10", dot: "bg-indigo-500", label: "Scheduled Estimate" },
  unresponsive: { border: "border-t-zinc-500", bg: "bg-zinc-500/10", dot: "bg-zinc-500", label: "Unresponsive" },
  quoted: { border: "border-t-violet-500", bg: "bg-violet-500/10", dot: "bg-violet-500", label: "Quoted" },
  won: { border: "border-t-green-500", bg: "bg-green-500/10", dot: "bg-green-500", label: "Won" },
  lost: { border: "border-t-rose-500", bg: "bg-rose-500/10", dot: "bg-rose-500", label: "Lost" },
};

interface AssignmentInfo {
  lead_id: string;
  assigned_to: string;
  full_name: string | null;
  email: string;
}

interface Props {
  leads: Tables<"leads">[];
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function LeadsKanban({ leads, onSelect, onStatusChange }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const SCROLL_ZONE = 120; // px from edge to trigger scroll
  const SCROLL_SPEED = 12; // px per frame

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const container = scrollRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (scrollIntervalRef.current) {
      cancelAnimationFrame(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }

    const scrollFn = () => {
      if (!scrollRef.current) return;
      if (x < SCROLL_ZONE) {
        const intensity = 1 - x / SCROLL_ZONE;
        scrollRef.current.scrollLeft -= SCROLL_SPEED * intensity;
        scrollIntervalRef.current = requestAnimationFrame(scrollFn);
      } else if (x > rect.width - SCROLL_ZONE) {
        const intensity = 1 - (rect.width - x) / SCROLL_ZONE;
        scrollRef.current.scrollLeft += SCROLL_SPEED * intensity;
        scrollIntervalRef.current = requestAnimationFrame(scrollFn);
      }
    };

    if (x < SCROLL_ZONE || x > rect.width - SCROLL_ZONE) {
      scrollIntervalRef.current = requestAnimationFrame(scrollFn);
    }
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      cancelAnimationFrame(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return stopAutoScroll;
  }, [stopAutoScroll]);

  // Keep dimensions in sync with main content
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const update = () => {
      setContentWidth(container.scrollWidth);
      setViewportWidth(container.clientWidth);
      setScrollLeft(container.scrollLeft);
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    Array.from(container.children).forEach((child) => observer.observe(child));
    update();
    return () => observer.disconnect();
  }, [leads.length]);

  // Sync scrollLeft state on main scroll
  const handleMainScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    setScrollLeft(container.scrollLeft);
  }, []);

  const grouped = LEAD_STATUSES.reduce(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status);
      return acc;
    },
    {} as Record<string, Tables<"leads">[]>
  );

  // Fetch assignments as a plain record for reliable caching
  const assignmentsQuery = useQuery({
    queryKey: ["kanban_assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_assignments")
        .select("lead_id, assigned_to, profiles:assigned_to(full_name, email)")
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      const record: Record<string, AssignmentInfo> = {};
      for (const a of data) {
        if (!record[a.lead_id]) {
          const p = a.profiles as unknown as { full_name: string | null; email: string } | null;
          record[a.lead_id] = {
            lead_id: a.lead_id,
            assigned_to: a.assigned_to,
            full_name: p?.full_name || null,
            email: p?.email || "",
          };
        }
      }
      return record;
    },
  });

  // Fetch team members
  const teamQuery = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ leadId, assignedTo }: { leadId: string; assignedTo: string | null }) => {
      await supabase.from("lead_assignments").delete().eq("lead_id", leadId);
      if (assignedTo && user) {
        const { error } = await supabase.from("lead_assignments").insert({
          lead_id: leadId,
          assigned_to: assignedTo,
          assigned_by: user.id,
        });
        if (error) throw error;

        const member = teamQuery.data?.find((m) => m.id === assignedTo);
        await supabase.from("lead_activity_log").insert({
          lead_id: leadId,
          user_id: user.id,
          action: "assigned",
          new_value: member?.full_name || member?.email || assignedTo,
        });

        const assignerProfile = teamQuery.data?.find((m) => m.id === user.id);
        const assignedByName = assignerProfile?.full_name || assignerProfile?.email || "Someone";
        supabase.functions.invoke("send-assignment-email", {
          body: { assigneeId: assignedTo, leadId, assignedByName },
        }).catch((err) => console.error("Assignment email failed:", err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban_assignments"] });
      queryClient.invalidateQueries({ queryKey: ["all_lead_assignments"] });
      queryClient.invalidateQueries({ queryKey: ["lead_assignment"] });
      queryClient.invalidateQueries({ queryKey: ["lead_activity"] });
      toast({ title: "Assignee updated" });
    },
  });

  const assignments = assignmentsQuery.data ?? {};
  const team = teamQuery.data ?? [];

  const thumbRatio = contentWidth > 0 ? viewportWidth / contentWidth : 1;
  const showCustomScrollbar = thumbRatio < 1;
  const thumbWidth = Math.max(40, thumbRatio * 100);
  const thumbLeft = contentWidth > viewportWidth
    ? (scrollLeft / (contentWidth - viewportWidth)) * (100 - thumbWidth)
    : 0;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    if (!track || !scrollRef.current) return;
    const rect = track.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    scrollRef.current.scrollLeft = clickRatio * (contentWidth - viewportWidth);
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    const track = (e.currentTarget as HTMLDivElement).parentElement;
    if (!track) return;
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    const startX = e.clientX;
    const startScroll = scrollRef.current?.scrollLeft ?? 0;
    const trackWidth = track?.clientWidth ?? 1;

    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current || !scrollRef.current) return;
      const delta = ev.clientX - startX;
      const scrollDelta = (delta / trackWidth) * contentWidth;
      scrollRef.current.scrollLeft = startScroll + scrollDelta;
    };
    const onUp = () => {
      draggingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <>
      {/* Custom always-visible scrollbar */}
      {showCustomScrollbar && (
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative rounded-full cursor-pointer mb-2"
          style={{ height: 10, background: 'hsl(var(--muted) / 0.5)' }}
        >
          <div
            onMouseDown={handleThumbMouseDown}
            className="absolute top-0 h-full rounded-full transition-colors hover:opacity-80 cursor-grab active:cursor-grabbing"
            style={{
              width: `${thumbWidth}%`,
              left: `${thumbLeft}%`,
              background: 'hsl(var(--muted-foreground) / 0.35)',
            }}
          />
        </div>
      )}
      <div ref={scrollRef} onScroll={handleMainScroll} onDragOver={handleDragOver} onDragEnd={stopAutoScroll} onDrop={stopAutoScroll} className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
      {LEAD_STATUSES.map((status) => {
        const config = statusConfig[status];
        return (
          <div key={status} className="min-w-[280px] flex-1 flex flex-col">
            {/* Column header */}
            <div className={`rounded-t-xl px-4 py-3 ${config.bg} border-t-[3px] ${config.border} border-x border-border`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                  <h3 className="font-semibold text-sm text-foreground">{config.label}</h3>
                </div>
                <span className="text-xs font-semibold bg-card px-2 py-0.5 rounded-full text-muted-foreground border border-border">
                  {grouped[status]?.length || 0}
                </span>
              </div>
            </div>

            {/* Cards container */}
            <div
              className="flex-1 space-y-2 p-2 bg-muted/20 rounded-b-xl border-x border-b border-border min-h-[200px]"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("bg-primary/5"); }}
              onDragLeave={(e) => e.currentTarget.classList.remove("bg-primary/5")}
              onDrop={(e) => {
                e.currentTarget.classList.remove("bg-primary/5");
                const leadId = e.dataTransfer.getData("leadId");
                if (leadId) onStatusChange(leadId, status);
              }}
            >
              {grouped[status]?.map((lead) => {
                const assignment = assignments[lead.id];
                const assigneeName = assignment?.full_name || assignment?.email || "";
                return (
                  <Card
                    key={lead.id}
                    className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 border-border bg-card group"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("leadId", lead.id)}
                    onClick={() => onSelect(lead.id)}
                  >
                    <CardContent className="p-3.5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1.5 flex-1 min-w-0">
                           <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{formatPhone(lead.phone)}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                          {lead.fence_name && (
                            <p className="text-xs text-muted-foreground">{lead.fence_name}</p>
                          )}
                          {/* Assignee row */}
                          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                  {assigneeName ? (
                                    <>
                                      <User className="h-3 w-3 shrink-0" />
                                      <span className="text-[11px] truncate max-w-[160px]">{assigneeName}</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserPlus className="h-3 w-3 shrink-0" />
                                      <span className="text-[11px]">Assign</span>
                                    </>
                                  )}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="min-w-[180px] z-50 bg-popover">
                                {team.map((member) => (
                                  <DropdownMenuItem
                                    key={member.id}
                                    onClick={() => assignMutation.mutate({ leadId: lead.id, assignedTo: member.id })}
                                    className={member.id === assignment?.assigned_to ? "bg-primary/10 font-medium" : ""}
                                  >
                                    {member.full_name || member.email}
                                  </DropdownMenuItem>
                                ))}
                                {assignment && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => assignMutation.mutate({ leadId: lead.id, assignedTo: null })}
                                      className="text-destructive"
                                    >
                                      Unassign
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            {(lead.estimate_low || lead.estimate_total) ? (
                              <span className="text-xs font-bold text-primary">{formatEstimate(lead)}</span>
                            ) : <span />}
                            <span className="text-[10px] text-muted-foreground">{format(new Date(lead.created_at), "MMM d")}</span>
                          </div>
                        </div>
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 ml-2 mt-0.5 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
       })}
      </div>
      {/* Custom scrollbar at bottom */}
      {showCustomScrollbar && (
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative rounded-full cursor-pointer mt-2"
          style={{ height: 10, background: 'hsl(var(--muted) / 0.5)' }}
        >
          <div
            onMouseDown={handleThumbMouseDown}
            className="absolute top-0 h-full rounded-full transition-colors hover:opacity-80 cursor-grab active:cursor-grabbing"
            style={{
              width: `${thumbWidth}%`,
              left: `${thumbLeft}%`,
              background: 'hsl(var(--muted-foreground) / 0.35)',
            }}
          />
        </div>
      )}
    </>
  );
}