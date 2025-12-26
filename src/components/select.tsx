"use client";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
interface SelectProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  options: {
    label: string;
    value: string;
  }[];
  status?: string;
  noOptions?: string;
}
function Select({
  placeholder = "Select",
  onChange,
  value,
  className,
  options = [],
  status,
  noOptions = "No options available",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const fuse = new Fuse(options, {
    keys: ["label"],
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 1,
    useExtendedSearch: true,
  });
  const results = fuse.search(search).map((r) => r.item);
  const filterOptions = search ? results : options;
  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
        setTimeout(() => {
          setSearch("");
        }, 200);
        // inputRef.current?.blur();
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, []);

  useEffect(() => {
    if (open) {
      // Scroll to selected item if exists
      const selectedEl = value ? itemRefs.current[value] : null;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center" });
      }
    }
  }, [open, value]);

  const handleSelect = (newValue: string) => {
    if (newValue === value) {
      // same value selected → do nothing or just close
      setOpen(false);
      return;
    }
    onChange?.(newValue);
    setOpen(false);

    setTimeout(() => {
      setSearch("");
    }, 600);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label || "";
  return (
    <>
      <div
        ref={dropRef}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-owns="select-listbox"
        aria-controls="select-listbox"
        className={cn(
          "relative py-1 border rounded-md max-w-full  group bg-white",
          {
            "border-destructive": status === "error",
          },
          className
        )}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          if (e.target === inputRef.current) return;
          e.preventDefault();
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="inner relative">
          <div className="mr-7 px-2.5">
            {value && !open && (
              <div
                className={clsx("absolute bg-white left-0 w-full rounded-md")}
              >
                <div className="px-2.5 mr-7 truncate">
                  <span className="cursor-text text-sm" title={selectedLabel}>
                    {selectedLabel}
                  </span>
                </div>
              </div>
            )}

            <div className="search">
              <input
                ref={inputRef}
                role="searchbox"
                aria-autocomplete="list"
                aria-activedescendant={value ? `option-${value}` : undefined}
                aria-label={placeholder}
                id="search_1"
                type="text"
                placeholder={value ? selectedLabel : placeholder}
                className="w-full focus:outline-none text-sm"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setOpen(true)}
              />
            </div>

            <div className="control absolute right-2 top-1/8 -translate-y-1/12">
              {value && !open && (
                <div
                  role="button"
                  aria-label="Clear selection"
                  tabIndex={0}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    e.preventDefault(); // prevent input from losing focus
                    e.stopPropagation(); // prevent dropdown toggle
                    onChange?.(""); // clear value
                  }}
                  className="absolute right-1 top-1/3 -translate-y-1/3 bg-[#8c8c8c] size-4 rounded-full flex items-center justify-center text-white z-50 opacity-0 group-hover:opacity-100"
                >
                  <X />
                </div>
              )}
              <ChevronDown
                role="button"
                aria-label="Toggle options"
                tabIndex={0}
                className={clsx("text-gray-400 cursor-pointer duration-150", {
                  "rotate-180": open,
                  "pointer-events-none": !open && value,
                  "pointer-events-auto": open && !value,
                })}
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "absolute border   w-full rounded-md card-shadow ease-out duration-300 bg-white select-shadow border-gray-300 z-50 scroll",
            {
              "opacity-100 translate-y-3": open,
              "opacity-0 pointer-events-none": !open,
            }
          )}
        >
          <ul
            className="py-1 max-h-56 h-auto overflow-y-auto scroll rounded-md"
            id="select=listbox"
            role="listbox"
            aria-label="Select options"
          >
            {filterOptions.length ? (
              filterOptions.map((item, i) => (
                <li
                  id={`option-${item.value}`}
                  role="option"
                  aria-selected={item.value === value}
                  ref={(el) => {
                    itemRefs.current[item.value] = el;
                  }}
                  title={item.label}
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.value !== value) handleSelect(item.value);
                  }}
                  className={clsx(
                    "h-8 hover:bg-[#F2F3F7] p-1.5 gap-1 flex items-center cursor-pointer text-sm text-[#4F5669]",
                    { "bg-[#F2F3F7] text-slate-950": item.value === value }
                  )}
                >
                  <Check
                    size={14}
                    className={clsx("invisible", {
                      visible: item.value === value,
                    })}
                  />
                  <span className="truncate">{item.label}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-400">{noOptions}</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

interface Option {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  placeholder?: string;
  onChange?: (value: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (label: string) => {
    const next = value.includes(label)
      ? value.filter((v) => v !== label)
      : [...value, label];

    onChange?.(next);
  };

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative min-h-8 border rounded-md bg-white group",
        className
      )}
      onClick={() => {
        setOpen(true);
        inputRef.current?.focus();
      }}
    >
      {/* Input + Tags */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-0.5 mr-8">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-accent px-2 py-0.5 mt-0.5 rounded-md text-xs"
          >
            {tag}
            <X
              size={12}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleValue(tag);
              }}
            />
          </span>
        ))}

        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={value.length ? "" : placeholder}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !search && value.length) {
              onChange?.(value.slice(0, -1));
            }
          }}
          className="flex-1 min-w-15 text-sm outline-none mt-0.5"
        />
      </div>

      <div className="control absolute top-1/3 -translate-y-1/5 right-2">
        {value && !open && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onChange?.([]);
            }}
            className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-[#8c8c8c] size-4 rounded-full flex items-center justify-center text-white z-50 opacity-0 group-hover:opacity-100"
          >
            <X />
          </div>
        )}
        <ChevronDown
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
            inputRef.current?.focus(); // focus even when toggling
          }}
          className={clsx("cursor-pointer text-[#858b9c]", {
            "rotate-180": open,
          })}
        />
      </div>
      {/* Dropdown */}
      <ul
        className={clsx(
          "absolute border h-56 overflow-y-auto  mt-2 w-full rounded-md card-shadow duration-200 bg-white select-shadow border-gray-300 z-50 scroll py-1",
          {
            "opacity-100 translate-y-1": open,
            "opacity-0 pointer-events-none": !open,
          }
        )}
      >
        {filtered.length ? (
          filtered.map((opt) => {
            const active = value.includes(opt.label);
            return (
              <li
                key={opt.id}
                onClick={() => toggleValue(opt.label)}
                className={clsx(
                  "px-2 h-8 flex items-center text-sm cursor-pointer hover:bg-accent",
                  { "bg-accent": active }
                )}
              >
                <Check
                  size={14}
                  className={clsx("mr-2", {
                    invisible: !active,
                  })}
                />
                {opt.label}
              </li>
            );
          })
        ) : (
          <li className="px-3 py-2 text-sm text-gray-400">No results found</li>
        )}
      </ul>
    </div>
  );
}

export { Select };
