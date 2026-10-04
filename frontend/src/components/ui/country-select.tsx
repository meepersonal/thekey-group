import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES, searchCountries, type Country } from "@/data/countries";

export function CountrySelect({
    value,
    onChange,
    placeholder = "Sélectionnez un pays",
    disabled = false,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => searchCountries(query), [query]);
    const selected = COUNTRIES.find((c) => c.name === value);

    // Fermeture au clic extérieur
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    // Focus input + reset de la sélection clavier à l'ouverture
    useEffect(() => {
        if (isOpen) {
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Maintient l'option active visible lors de la navigation clavier
    useEffect(() => {
        if (!isOpen) return;
        const item = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
        item?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, isOpen]);

    const select = (country: Country) => {
        onChange(country.name);
        setIsOpen(false);
        setQuery("");
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const country = filtered[activeIndex];
            if (country) select(country);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={cn(
                    "flex h-12 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 text-left text-sm transition-colors",
                    "hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
                    isOpen && "border-slate-400 ring-2 ring-emerald-500/30",
                    disabled && "cursor-not-allowed opacity-60",
                )}
            >
                <span className={cn("truncate", !selected && "text-slate-400")}>
                    {selected ? (
                        <span className="flex items-center gap-2">
                            <span className="text-base leading-none">{selected.flag}</span>
                            {selected.name}
                        </span>
                    ) : (
                        placeholder
                    )}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                        isOpen && "rotate-180",
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                    {/* Barre de recherche */}
                    <div className="border-b border-slate-100 p-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActiveIndex(0);
                                }}
                                onKeyDown={onKeyDown}
                                placeholder="Rechercher un pays..."
                                aria-label="Rechercher un pays"
                                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Liste */}
                    <div ref={listRef} role="listbox" className="max-h-64 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="py-6 text-center text-sm text-slate-500">
                                Aucun pays trouvé
                            </div>
                        ) : (
                            filtered.map((c, index) => {
                                const isSelected = c.name === value;
                                return (
                                    <button
                                        key={c.code}
                                        data-index={index}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => select(c)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={cn(
                                            "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                                            isSelected
                                                ? "bg-emerald-50 text-emerald-700"
                                                : index === activeIndex
                                                  ? "bg-slate-50"
                                                  : "hover:bg-slate-50",
                                        )}
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <span className="text-base leading-none">{c.flag}</span>
                                            <span className="truncate">{c.name}</span>
                                        </span>
                                        {isSelected && <Check className="h-4 w-4 shrink-0" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
