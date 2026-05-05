import { format } from "date-fns";
import { Activity } from "lucide-react";

interface Props {
  activities: any[];
}

export default function LeadActivity({ activities }: Props) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Activity className="h-3.5 w-3.5" /> Activity Timeline
      </h4>
      <div className="space-y-0">
        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No activity yet</p>
        )}
        {activities.map((a: any, i: number) => (
          <div key={a.id} className="flex gap-3 text-sm relative">
            {/* Timeline line */}
            {i < activities.length - 1 && (
              <div className="absolute left-[5px] top-5 bottom-0 w-px bg-border" />
            )}
            <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary mt-1 shrink-0 relative z-10" />
            <div className="pb-4">
              <p className="text-foreground leading-snug">
                <span className="font-semibold">{a.profiles?.full_name || a.profiles?.email || "System"}</span>
                {" "}
                {a.action === "status_changed" && <>changed status from <span className="capitalize font-medium text-muted-foreground">{a.old_value}</span> to <span className="capitalize font-semibold text-primary">{a.new_value}</span></>}
                {a.action === "note_added" && "added a note"}
                {a.action === "assigned" && <>assigned lead to <span className="font-semibold">{a.new_value}</span></>}
                {a.action === "reminder_set" && "set a follow-up reminder"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(a.created_at), "MMM d 'at' h:mm a")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
