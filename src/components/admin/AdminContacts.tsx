import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import ContactDetail from "./ContactDetail";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatPhone, formatSource, SOURCE_STYLES } from "@/lib/lead-utils";
import { Contact, Search, ArrowUp, ArrowDown, ArrowUpDown, Mail, Phone, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;
type SortKey = "name" | "email" | "phone" | "address" | "source" | "date";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return dir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 text-primary" />;
}

export default function AdminContacts() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedContact, setSelectedContact] = useState<Lead | null>(null);

  const leadsQuery = useQuery({
    queryKey: ["contacts_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const leads = leadsQuery.data ?? [];

  // Deduplicate by email, keeping the most recent entry
  const contacts = useMemo(() => {
    const map = new Map<string, Lead>();
    for (const lead of leads) {
      const key = lead.email.toLowerCase();
      const existing = map.get(key);
      if (!existing || new Date(lead.created_at) > new Date(existing.created_at)) {
        map.set(key, lead);
      }
    }
    return Array.from(map.values());
  }, [leads]);

  // Count submissions per email
  const submissionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lead of leads) {
      const key = lead.email.toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }, [leads]);

  // Filter
  const filtered = useMemo(() => {
    let result = contacts;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.address || "").toLowerCase().includes(q)
      );
    }

    if (sourceFilter !== "all") {
      result = result.filter((c) => c.source === sourceFilter);
    }

    return result;
  }, [contacts, search, sourceFilter]);

  // Sort
  const sorted = useMemo(() => {
    const copy = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortKey) {
        case "name": return dir * a.name.localeCompare(b.name);
        case "email": return dir * a.email.localeCompare(b.email);
        case "phone": return dir * a.phone.localeCompare(b.phone);
        case "address": return dir * (a.address || "").localeCompare(b.address || "");
        case "source": return dir * a.source.localeCompare(b.source);
        case "date": return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        default: return 0;
      }
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const uniqueSources = useMemo(() => {
    const sources = new Set(contacts.map((c) => c.source));
    return Array.from(sources);
  }, [contacts]);

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Address", "Source", "Submissions", "Last Active"];
    const rows = sorted.map((c) => [
      c.name,
      c.email,
      formatPhone(c.phone),
      c.address || "",
      formatSource(c.source),
      String(submissionCounts.get(c.email.toLowerCase()) || 1),
      format(new Date(c.created_at), "MM/dd/yy"),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported successfully" });
  };

  const thClass = "font-semibold text-foreground cursor-pointer select-none hover:text-primary transition-colors";

  if (leadsQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <Contact className="h-7 w-7 text-primary" />
            Contacts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {contacts.length} unique contact{contacts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={sorted.length === 0}>
          <Download className="h-4 w-4 mr-1.5" />
          Export CSV
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card h-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 bg-card">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {uniqueSources.map((s) => (
              <SelectItem key={s} value={s}>{formatSource(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className={thClass} onClick={() => handleSort("name")}>
                <span className="inline-flex items-center gap-1">Name <SortIcon active={sortKey === "name"} dir={sortDir} /></span>
              </TableHead>
              <TableHead className={`hidden md:table-cell ${thClass}`} onClick={() => handleSort("email")}>
                <span className="inline-flex items-center gap-1">Email <SortIcon active={sortKey === "email"} dir={sortDir} /></span>
              </TableHead>
              <TableHead className={`hidden md:table-cell ${thClass}`} onClick={() => handleSort("phone")}>
                <span className="inline-flex items-center gap-1">Phone <SortIcon active={sortKey === "phone"} dir={sortDir} /></span>
              </TableHead>
              <TableHead className={`hidden lg:table-cell ${thClass}`} onClick={() => handleSort("address")}>
                <span className="inline-flex items-center gap-1">Address <SortIcon active={sortKey === "address"} dir={sortDir} /></span>
              </TableHead>
              <TableHead className={thClass} onClick={() => handleSort("source")}>
                <span className="inline-flex items-center gap-1">Source <SortIcon active={sortKey === "source"} dir={sortDir} /></span>
              </TableHead>
              <TableHead className="hidden sm:table-cell font-semibold text-foreground text-center">Submissions</TableHead>
              <TableHead className={`hidden md:table-cell ${thClass}`} onClick={() => handleSort("date")}>
                <span className="inline-flex items-center gap-1">Last Active <SortIcon active={sortKey === "date"} dir={sortDir} /></span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => setSelectedContact(contact)}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-foreground">{contact.name}</p>
                    <div className="md:hidden space-y-0.5 mt-0.5">
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                      <p className="text-xs text-muted-foreground">{formatPhone(contact.phone)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <a href={`mailto:${contact.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {contact.email}
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <a href={`tel:${contact.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {formatPhone(contact.phone)}
                  </a>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {contact.address ? (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(contact.address!);
                        toast({ title: "Address copied to clipboard" });
                      }}
                      className="text-sm text-muted-foreground flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer text-left"
                      title="Click to copy"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate max-w-[200px]">{contact.address}</span>
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs font-medium ${SOURCE_STYLES[contact.source] || "border-border"}`}>
                    {formatSource(contact.source)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-center">
                  <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold text-foreground">
                    {submissionCounts.get(contact.email.toLowerCase()) || 1}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(contact.created_at), "MM/dd/yy")}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Contact className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No contacts found</p>
                    <p className="text-xs text-muted-foreground">
                      {search || sourceFilter !== "all" ? "Try adjusting your search or filters" : "Contacts will appear as people use your site"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ContactDetail
        contact={selectedContact}
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        submissionCount={selectedContact ? (submissionCounts.get(selectedContact.email.toLowerCase()) || 1) : 0}
      />
    </div>
  );
}
