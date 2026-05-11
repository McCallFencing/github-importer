import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, MapPin } from "lucide-react";

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  label: string;
}

/**
 * Free address autocomplete using Photon (OpenStreetMap-based).
 * No API key required.
 */
export function AddressAutocomplete({
  id,
  value,
  onChange,
  placeholder,
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const skipNextFetchRef = useRef(false);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setLoading(true);
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          value
        )}&limit=5&lang=en&osm_tag=place&osm_tag=highway&osm_tag=building`;
        // Use a simpler query without restrictive osm_tags for better address coverage
        const simpleUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          value
        )}&limit=5&lang=en`;
        const res = await fetch(simpleUrl, { signal: ctrl.signal });
        const data = await res.json();
        const results: Suggestion[] = (data.features || [])
          .map((f: any) => {
            const p = f.properties || {};
            const parts = [
              [p.housenumber, p.street].filter(Boolean).join(" ") || p.name,
              p.city || p.town || p.village,
              p.state,
              p.postcode,
            ].filter(Boolean);
            return { label: parts.join(", ") };
          })
          .filter((s: Suggestion) => s.label && s.label.length > 0);
        setSuggestions(results);
        setOpen(results.length > 0);
        setHighlight(-1);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectSuggestion = (s: Suggestion) => {
    skipNextFetchRef.current = true;
    onChange(s.label);
    setOpen(false);
    setSuggestions([]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        className={className}
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              role="option"
              aria-selected={highlight === i}
              onMouseDown={(e) => {
                e.preventDefault();
                selectSuggestion(s);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={cn(
                "flex items-start gap-2 px-3 py-2 text-sm cursor-pointer",
                highlight === i ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <span className="leading-snug">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
