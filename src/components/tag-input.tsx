import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

const TagInput = ({
  value = [],
  onChange,
  placeholder = "Add a tag...",
  maxTags = 10,
  className,
}: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTags = (newTags: string[]) => {
    setTags(newTags);
    onChange?.(newTags);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      updateTags([...tags, trimmedTag]);
    }
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    updateTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(",")) {
      const parts = value.split(",");
      parts.forEach((part) => addTag(part));
    } else {
      setInputValue(value);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "tag-input-container flex flex-wrap items-center gap-2 p-2 min-h-10 rounded-xl border border-input bg-card cursor-text transition-all duration-200",
        // "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        "hover:border-muted-foreground/30",
        className
      )}
      onClick={handleContainerClick}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          title={tag}
          className="tag-pill group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in fade-in-0 zoom-in-95 duration-200 max-w-45"
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="tag-remove-btn shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-transparent hover:bg-primary/20 transition-colors duration-150"
            aria-label={`Remove ${tag}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {tags.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-30 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
        />
      )}
    </div>
  );
};

export { TagInput };
