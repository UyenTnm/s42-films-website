"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  AI_TOOLS,
  CONTACT_EMAIL,
  CV_ACCEPT,
  ENGLISH_LEVELS,
  EXPERIENCE,
  LIMITS,
  LOCATIONS,
  POSITIONS,
  STRENGTHS,
  checkCvFile,
  cleanTags,
  todayInVietnam,
  validateApplication,
  type CvMode,
  type FieldErrors,
  type FieldName,
} from "@/lib/careers";

interface FormState {
  fullName: string;
  email: string;
  phone: string; // digits only, without +84
  location: string;
  position: string;
  experience: string;
  strengths: string[];
  strengthsOther: string[];
  tools: string[];
  toolsOther: string[];
  english: string;
  portfolioUrl: string;
  cvMode: CvMode;
  cvUrl: string;
  bestProjectUrl: string;
  onSite: "" | "yes" | "no";
  startDate: string;
  salaryMin: string; // digits only
  salaryMax: string; // digits only
  notes: string;
  consent: boolean;
  website: string; // honeypot, stays empty for humans
}

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  position: "",
  experience: "",
  strengths: [],
  strengthsOther: [],
  tools: [],
  toolsOther: [],
  english: "",
  portfolioUrl: "",
  cvMode: "file",
  cvUrl: "",
  bestProjectUrl: "",
  onSite: "",
  startDate: "",
  salaryMin: "",
  salaryMax: "",
  notes: "",
  consent: false,
  website: "",
};

// Order used to move focus to the first field with an error.
const FIELD_ORDER: FieldName[] = [
  "fullName",
  "email",
  "phone",
  "location",
  "position",
  "experience",
  "strengths",
  "strengthsOther",
  "tools",
  "toolsOther",
  "english",
  "portfolioUrl",
  "cvFile",
  "cvUrl",
  "bestProjectUrl",
  "onSite",
  "startDate",
  "salaryMin",
  "salaryMax",
  "notes",
  "consent",
];

const fieldId = (name: FieldName) => `apply-${name}`;
const errorId = (name: FieldName) => `apply-${name}-error`;

function groupDigits(digits: string) {
  return digits ? new Intl.NumberFormat("vi-VN").format(Number(digits)) : "";
}

/** "901234567" → "90 123 4567"; "0901234567" → "090 123 4567". */
function formatPhoneDigits(digits: string) {
  const lead = digits.startsWith("0") ? 3 : 2;
  return [digits.slice(0, lead), digits.slice(lead, lead + 3), digits.slice(lead + 3)]
    .filter(Boolean)
    .join(" ");
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const fieldBox =
  "w-full min-w-0 border border-white/25 bg-black/40 text-base text-white outline-none transition focus-within:border-white/75 focus-within:bg-black/60";
const inputClasses = `h-14 px-4 placeholder:text-white/30 ${fieldBox} focus:border-white/75 focus:bg-black/60 aria-[invalid=true]:border-[#ffb4ad]/80`;
const chipClasses =
  "relative flex cursor-pointer items-center border border-white/25 px-4 py-3 text-sm tracking-[0.06em] text-white/80 transition select-none hover:border-white/60 has-[:checked]:border-[#f1f1ed] has-[:checked]:bg-[#f1f1ed] has-[:checked]:text-black has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white";

/* ------------------------------------------------------------------ */
/* Layout helpers                                                     */
/* ------------------------------------------------------------------ */

function Section({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-white/12 pt-8">
      <h2 className="mb-6 flex items-baseline gap-4 font-heading text-sm tracking-[0.22em] text-white/85 uppercase sm:text-base">
        <span className="text-white/35">{String(index).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

const labelClasses =
  "mb-2.5 block font-heading text-xs tracking-[0.14em] text-white/70 uppercase sm:text-[13px]";

function LabelText({ label, required }: { label: string; required?: boolean }) {
  return (
    <>
      {label}
      {required ? (
        <span className="ml-1 text-[#ffb4ad]" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="ml-2 text-white/35 normal-case tracking-normal">
          (optional)
        </span>
      )}
    </>
  );
}

function ErrorText({ name, error }: { name: FieldName; error?: string }) {
  return (
    <p
      id={errorId(name)}
      className="mt-2 min-h-5 text-sm text-[#ffb4ad]"
      aria-live="polite"
    >
      {error}
    </p>
  );
}

function Field({
  name,
  label,
  required,
  error,
  hint,
  wide,
  group,
  labelFor,
  children,
}: {
  name: FieldName;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  wide?: boolean;
  group?: boolean;
  /** Use when the focusable element is not fieldId(name). */
  labelFor?: string;
  children: ReactNode;
}) {
  const body = (
    <>
      {hint && <p className="-mt-1 mb-3 text-sm text-white/50">{hint}</p>}
      {children}
      <ErrorText name={name} error={error} />
    </>
  );

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      {group ? (
        <fieldset
          id={fieldId(name)}
          aria-describedby={errorId(name)}
          aria-required={required}
          className="min-w-0"
        >
          <legend className={labelClasses}>
            <LabelText label={label} required={required} />
          </legend>
          {body}
        </fieldset>
      ) : (
        <>
          <label htmlFor={labelFor ?? fieldId(name)} className={labelClasses}>
            <LabelText label={label} required={required} />
          </label>
          {body}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dropdown in the S•42 style (replaces the browser's native select)   */
/* ------------------------------------------------------------------ */

function SelectMenu({
  name,
  value,
  options,
  placeholder,
  error,
  searchable,
  onChange,
}: {
  name: FieldName;
  value: string;
  options: readonly string[];
  placeholder: string;
  error?: string;
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const typeahead = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const listId = `${fieldId(name)}-list`;
  const optionId = (index: number) => `${fieldId(name)}-option-${index}`;

  const visible = query
    ? options.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : options;

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setDropUp(below < 300 && rect.top > below);
    }
    setQuery("");
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    setQuery("");
    if (refocus) triggerRef.current?.focus();
  };

  const choose = (option: string | undefined) => {
    if (option === undefined) return;
    onChange(option);
    close();
  };

  // Close when clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  // Keep the highlighted option visible while moving with the keyboard.
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(optionId(active))
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (event: KeyboardEvent) => {
    const last = visible.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openMenu();
        else setActive((i) => Math.min(last, i + 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openMenu();
        else setActive((i) => Math.max(0, i - 1));
        return;
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(last);
        }
        return;
      case "Enter":
        event.preventDefault();
        if (open) choose(visible[active]);
        else openMenu();
        return;
      case " ":
        if (searchable && open) return; // a space is part of the search text
        event.preventDefault();
        if (open) choose(visible[active]);
        else openMenu();
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        return;
      case "Tab":
        if (open) close(false);
        return;
    }

    // Type a letter to jump to a matching option (non-search menus).
    if (!searchable && event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      const now = Date.now();
      const state = typeahead.current;
      state.text = now - state.at > 700 ? event.key : state.text + event.key;
      state.at = now;
      const match = options.findIndex((o) =>
        o.toLowerCase().startsWith(state.text.toLowerCase()),
      );
      if (match >= 0) {
        if (!open) openMenu();
        setActive(match);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={fieldId(name)}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && !searchable && visible.length ? optionId(active) : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId(name)}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
        className={`${inputClasses} flex cursor-pointer items-center justify-between gap-3 text-left ${
          open ? "border-white/75 bg-black/60" : ""
        }`}
      >
        <span className={`truncate ${value ? "text-white" : "text-white/35"}`}>
          {value || placeholder}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-[11px] text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          className={`absolute right-0 left-0 z-40 border border-white/30 bg-[#0b0b0b] shadow-[0_24px_60px_rgba(0,0,0,0.85)] ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {searchable && (
            <div className="border-b border-white/12 p-2">
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-label="Search"
                aria-controls={listId}
                aria-expanded="true"
                aria-autocomplete="list"
                aria-activedescendant={visible.length ? optionId(active) : undefined}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Type to search…"
                className="h-11 w-full border border-white/15 bg-black px-3 text-base text-white outline-none placeholder:text-white/30 focus:border-white/50"
              />
            </div>
          )}
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={fieldId(name)}
            data-lenis-prevent
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {visible.length === 0 && (
              <li className="px-4 py-3 text-sm text-white/45">No matches</li>
            )}
            {visible.map((option, index) => {
              const selected = option === value;
              return (
                <li
                  key={option}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  onPointerMove={() => setActive(index)}
                  onClick={() => choose(option)}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-base transition-colors ${
                    index === active ? "bg-white/10" : ""
                  } ${selected ? "text-white" : "text-white/75"}`}
                >
                  <span>{option}</span>
                  {selected && (
                    <span aria-hidden="true" className="text-sm text-white">
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Multi-choice chips + "Other" tags                                   */
/* ------------------------------------------------------------------ */

function Chips({
  name,
  options,
  selected,
  onToggle,
}: {
  name: FieldName;
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label key={option} className={chipClasses}>
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="sr-only"
          />
          {option}
        </label>
      ))}
    </div>
  );
}

function TagInput({
  name,
  label,
  tags,
  error,
  onChange,
}: {
  name: FieldName;
  label: string;
  tags: string[];
  error?: string;
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const full = tags.length >= LIMITS.tags;

  const commit = (text: string) => {
    const next = cleanTags([...tags, ...text.split(",")]);
    if (next.length !== tags.length) onChange(next);
    setDraft("");
  };

  return (
    <div className="mt-4">
      <label htmlFor={fieldId(name)} className={labelClasses}>
        {label}
        <span className="ml-1 text-[#ffb4ad]" aria-hidden="true">
          *
        </span>
      </label>
      <div
        className={`${fieldBox} flex min-h-14 flex-wrap items-center gap-2 px-3 py-2 ${
          error ? "border-[#ffb4ad]/80" : ""
        }`}
        onClick={() => document.getElementById(fieldId(name))?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-2 bg-[#f1f1ed] py-1.5 pr-1.5 pl-3 text-sm text-black"
          >
            {tag}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange(tags.filter((t) => t !== tag));
              }}
              className="flex size-6 cursor-pointer items-center justify-center text-black/60 hover:bg-black/10 hover:text-black"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={fieldId(name)}
          type="text"
          value={draft}
          disabled={full}
          maxLength={LIMITS.tag + 1}
          onChange={(event) => {
            const value = event.target.value;
            if (value.includes(",")) {
              const parts = value.split(",");
              commit(parts.slice(0, -1).join(","));
              setDraft(parts[parts.length - 1]);
            } else {
              setDraft(value);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (draft.trim()) commit(draft);
            } else if (event.key === "Backspace" && !draft && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && commit(draft)}
          placeholder={
            full
              ? `Up to ${LIMITS.tags}`
              : tags.length
                ? "Add another…"
                : "Type, then press comma or Enter"
          }
          className="h-10 min-w-[12rem] flex-1 bg-transparent px-1 text-base text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed"
          aria-invalid={Boolean(error)}
          aria-describedby={`${errorId(name)} ${fieldId(name)}-help`}
        />
      </div>
      <p id={`${fieldId(name)}-help`} className="mt-2 text-xs text-white/40">
        Separate with a comma. Up to {LIMITS.tags}.
      </p>
      <ErrorText name={name} error={error} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CV: upload a file OR paste a link                                   */
/* ------------------------------------------------------------------ */

function CvField({
  mode,
  url,
  file,
  errors,
  onMode,
  onUrl,
  onFile,
}: {
  mode: CvMode;
  url: string;
  file: File | null;
  errors: FieldErrors;
  onMode: (mode: CvMode) => void;
  onUrl: (url: string) => void;
  onFile: (file: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  return (
    <div className="sm:col-span-2">
      <fieldset className="min-w-0">
        <legend className={labelClasses}>
          <LabelText label="CV / resume" required />
        </legend>

        <div role="radiogroup" aria-label="How to send your CV" className="mb-4 flex flex-wrap gap-2">
          {(
            [
              ["file", "Upload a file"],
              ["link", "Paste a link"],
            ] as const
          ).map(([value, text]) => (
            <label key={value} className={`${chipClasses} justify-center`}>
              <input
                type="radio"
                name="cvMode"
                value={value}
                checked={mode === value}
                onChange={() => onMode(value)}
                className="sr-only"
              />
              {text}
            </label>
          ))}
        </div>

        {mode === "file" ? (
          <>
            {file ? (
              <div
                className={`${fieldBox} flex min-h-14 items-center justify-between gap-3 px-4 py-3 ${
                  errors.cvFile ? "border-[#ffb4ad]/80" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-base text-white">{file.name}</p>
                  <p className="text-xs text-white/45">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onFile(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="shrink-0 cursor-pointer border border-white/25 px-3 py-2 text-sm text-white/75 transition hover:border-white/60 hover:text-white"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed px-4 py-6 text-center transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white ${
                  dragging
                    ? "border-white bg-white/[0.06]"
                    : errors.cvFile
                      ? "border-[#ffb4ad]/80 bg-black/40"
                      : "border-white/30 bg-black/40 hover:border-white/60"
                }`}
              >
                <span className="text-base text-white">
                  Drop your CV here, or <span className="underline underline-offset-4">browse</span>
                </span>
                <span className="text-sm text-white/45">PDF, DOC or DOCX · max 4 MB</span>
                <input
                  ref={inputRef}
                  id={fieldId("cvFile")}
                  type="file"
                  accept={CV_ACCEPT}
                  onChange={(event) => onFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                  aria-invalid={Boolean(errors.cvFile)}
                  aria-describedby={errorId("cvFile")}
                />
              </label>
            )}
            <ErrorText name="cvFile" error={errors.cvFile} />
          </>
        ) : (
          <>
            <input
              id={fieldId("cvUrl")}
              name="cvUrl"
              type="url"
              inputMode="url"
              value={url}
              onChange={(event) => onUrl(event.target.value)}
              maxLength={LIMITS.url}
              placeholder="https://drive.google.com/…"
              aria-label="CV / resume link"
              className={inputClasses}
              aria-invalid={Boolean(errors.cvUrl)}
              aria-describedby={errorId("cvUrl")}
            />
            <ErrorText name="cvUrl" error={errors.cvUrl} />
          </>
        )}
      </fieldset>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The form                                                           */
/* ------------------------------------------------------------------ */

export default function ApplicationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [minDate, setMinDate] = useState<string>();

  // The page is pre-rendered, so "today" is worked out in the browser.
  useEffect(() => setMinDate(todayInVietnam()), []);

  const clearErrors = (...names: FieldName[]) => {
    if (!names.some((name) => name in errors)) return;
    setErrors((current) => {
      const next = { ...current };
      for (const name of names) delete next[name];
      return next;
    });
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    clearErrors(key as FieldName);
    if (status) setStatus(null);
  };

  const toggle = (key: "strengths" | "tools", option: string) => {
    const list = form[key];
    update(
      key,
      list.includes(option)
        ? list.filter((item) => item !== option)
        : [...list, option],
    );
    if (option === "Other") clearErrors(`${key}Other` as FieldName);
  };

  const pickFile = (file: File | null) => {
    setCvFile(file);
    const problem = file ? checkCvFile({ name: file.name, size: file.size }) : null;
    setErrors((current) => {
      const next = { ...current };
      if (problem) next.cvFile = problem;
      else delete next.cvFile;
      return next;
    });
  };

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const first = FIELD_ORDER.find((name) => fieldErrors[name]);
    if (!first) return;
    const element = document.getElementById(fieldId(first));
    const target =
      element?.tagName === "FIELDSET"
        ? element.querySelector<HTMLElement>("input, button")
        : element;
    (element?.closest("label, fieldset, div") ?? element)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    target?.focus({ preventScroll: true });
  };

  const payload = () => ({
    ...form,
    cvUrl: form.cvMode === "link" ? form.cvUrl : "",
    salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
    salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
  });

  const fileForSubmit = form.cvMode === "file" ? cvFile : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const data = payload();
    const check = validateApplication(
      data,
      fileForSubmit ? { name: fileForSubmit.name, size: fileForSubmit.size } : null,
    );
    if (!check.ok) {
      setErrors(check.errors);
      setStatus("Please check the highlighted fields.");
      focusFirstError(check.errors);
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const body = new FormData();
      body.append("data", JSON.stringify(data));
      if (fileForSubmit) body.append("cvFile", fileForSubmit);

      const response = await fetch("/api/careers/apply", { method: "POST", body });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        if (result.errors) {
          setErrors(result.errors);
          focusFirstError(result.errors);
        }
        setStatus(
          result.message ||
            (response.status === 413
              ? "Your CV file is too large. Please keep it under 4 MB."
              : "We could not submit your application. Please try again."),
        );
        return;
      }

      setIsDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus(
        `We could not submit your application. Please try again, or email ${CONTACT_EMAIL}.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-svh bg-black font-sans text-[#f1f1ed]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_60%)]"
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 pt-24 pb-14 sm:px-10 sm:pt-28 sm:pb-20">
        <header className="mb-12 text-center">
          <div className="relative mx-auto mb-8 h-20 w-56 sm:h-24 sm:w-72">
            <Image
              src="/images/brand/s42-films-official.png"
              alt="S•42 Films"
              fill
              sizes="288px"
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <p className="mb-3 font-heading text-xs tracking-[0.3em] text-white/55 uppercase">
            Studio 42 · Ho Chi Minh City
          </p>
          <h1 className="font-heading text-[clamp(1.6rem,6vw,2.6rem)] leading-tight tracking-[0.06em] uppercase">
            {isDone ? "Application Received" : "Join as an AI Creative"}
          </h1>
        </header>

        {isDone ? (
          <div className="border border-white/12 bg-white/[0.03] px-6 py-10 text-center sm:px-12">
            <p className="mx-auto max-w-lg text-base leading-relaxed font-light text-white/80 sm:text-lg">
              Thank you for applying to Studio 42! We&apos;ve received your
              application. Our team will review your profile and contact you if
              you&apos;re shortlisted.
            </p>
            <p className="mt-8 text-sm text-white/50">
              Questions? Contact{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white/80 underline underline-offset-4 hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
            {/* Honeypot: hidden from people and screen readers. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="apply-website">Website</label>
              <input
                id="apply-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => update("website", event.target.value)}
              />
            </div>

            <Section index={1} title="Personal Information">
              <Field name="fullName" label="Full name" required error={errors.fullName}>
                <input
                  id={fieldId("fullName")}
                  name="fullName"
                  autoComplete="name"
                  maxLength={LIMITS.fullName}
                  placeholder="Nguyen Van A"
                  value={form.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  className={inputClasses}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errorId("fullName")}
                />
              </Field>

              <Field name="email" label="Email address" required error={errors.email}>
                <input
                  id={fieldId("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={LIMITS.email}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={inputClasses}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errorId("email")}
                />
              </Field>

              <Field name="phone" label="Phone number" required error={errors.phone}>
                <div
                  className={`${fieldBox} flex h-14 items-stretch ${
                    errors.phone ? "border-[#ffb4ad]/80" : ""
                  }`}
                >
                  <span
                    className="flex shrink-0 items-center gap-2.5 border-r border-white/15 px-4 text-base text-white/75 select-none"
                    aria-hidden="true"
                  >
                    {/* Vietnam flag as SVG: emoji flags don't show on Windows. */}
                    <svg viewBox="0 0 30 20" className="h-3.5 w-[21px] shrink-0">
                      <rect width="30" height="20" fill="#DA251D" />
                      <polygon
                        fill="#FFFF00"
                        points="15,4 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15"
                      />
                    </svg>
                    +84
                  </span>
                  <input
                    id={fieldId("phone")}
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="90 123 4567"
                    value={formatPhoneDigits(form.phone)}
                    onChange={(event) => {
                      let digits = event.target.value.replace(/\D/g, "");
                      // Pasted "+84 90…" or "84 90…": keep only the local part.
                      if (digits.startsWith("84") && digits.length > 10) digits = digits.slice(2);
                      update("phone", digits.slice(0, 10));
                    }}
                    className="h-full min-w-0 flex-1 bg-transparent px-4 text-base text-white outline-none placeholder:text-white/30"
                    aria-label="Phone number, Vietnam +84"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errorId("phone")}
                  />
                </div>
              </Field>

              <Field name="location" label="Current location" required error={errors.location}>
                <SelectMenu
                  name="location"
                  value={form.location}
                  options={LOCATIONS}
                  placeholder="Select city / province"
                  error={errors.location}
                  searchable
                  onChange={(value) => update("location", value)}
                />
              </Field>

              <Field
                name="position"
                label="Position applying for"
                required
                wide
                error={errors.position}
              >
                <SelectMenu
                  name="position"
                  value={form.position}
                  options={POSITIONS}
                  placeholder="Select a position"
                  error={errors.position}
                  onChange={(value) => update("position", value)}
                />
              </Field>
            </Section>

            <Section index={2} title="Experience & Skills">
              <Field
                name="experience"
                label="How long have you been working with AI creative tools?"
                required
                wide
                error={errors.experience}
              >
                <SelectMenu
                  name="experience"
                  value={form.experience}
                  options={EXPERIENCE}
                  placeholder="Select a duration"
                  error={errors.experience}
                  onChange={(value) => update("experience", value)}
                />
              </Field>

              <Field
                name="strengths"
                label="What are your main creative strengths?"
                required
                wide
                group
                hint="Select all that apply."
                error={errors.strengths}
              >
                <Chips
                  name="strengths"
                  options={STRENGTHS}
                  selected={form.strengths}
                  onToggle={(option) => toggle("strengths", option)}
                />
                {form.strengths.includes("Other") && (
                  <TagInput
                    name="strengthsOther"
                    label="Your other strengths"
                    tags={form.strengthsOther}
                    error={errors.strengthsOther}
                    onChange={(tags) => update("strengthsOther", tags)}
                  />
                )}
              </Field>

              <Field
                name="tools"
                label="Which AI tools do you use?"
                required
                wide
                group
                hint="Select all that apply."
                error={errors.tools}
              >
                <Chips
                  name="tools"
                  options={AI_TOOLS}
                  selected={form.tools}
                  onToggle={(option) => toggle("tools", option)}
                />
                {form.tools.includes("Other") && (
                  <TagInput
                    name="toolsOther"
                    label="Your other tools"
                    tags={form.toolsOther}
                    error={errors.toolsOther}
                    onChange={(tags) => update("toolsOther", tags)}
                  />
                )}
              </Field>

              <Field name="english" label="English proficiency" wide error={errors.english}>
                <SelectMenu
                  name="english"
                  value={form.english}
                  options={ENGLISH_LEVELS}
                  placeholder="Select a level"
                  error={errors.english}
                  onChange={(value) => update("english", value)}
                />
              </Field>
            </Section>

            <Section index={3} title="Portfolio & CV">
              <p className="-mt-2 text-sm leading-relaxed text-white/55 sm:col-span-2">
                Please provide accessible links to Google Drive, Behance, Vimeo,
                YouTube, or other portfolio platforms. Ensure viewing
                permissions are enabled.
              </p>

              <Field
                name="portfolioUrl"
                label="Portfolio / showreel link"
                required
                wide
                error={errors.portfolioUrl}
              >
                <input
                  id={fieldId("portfolioUrl")}
                  name="portfolioUrl"
                  type="url"
                  inputMode="url"
                  maxLength={LIMITS.url}
                  placeholder="https://"
                  value={form.portfolioUrl}
                  onChange={(event) => update("portfolioUrl", event.target.value)}
                  className={inputClasses}
                  aria-invalid={Boolean(errors.portfolioUrl)}
                  aria-describedby={errorId("portfolioUrl")}
                />
              </Field>

              <CvField
                mode={form.cvMode}
                url={form.cvUrl}
                file={cvFile}
                errors={errors}
                onMode={(mode) => {
                  update("cvMode", mode);
                  clearErrors("cvFile", "cvUrl");
                }}
                onUrl={(url) => update("cvUrl", url)}
                onFile={pickFile}
              />

              <Field
                name="bestProjectUrl"
                label="Best AI project link"
                wide
                error={errors.bestProjectUrl}
              >
                <input
                  id={fieldId("bestProjectUrl")}
                  name="bestProjectUrl"
                  type="url"
                  inputMode="url"
                  maxLength={LIMITS.url}
                  placeholder="https://"
                  value={form.bestProjectUrl}
                  onChange={(event) => update("bestProjectUrl", event.target.value)}
                  className={inputClasses}
                  aria-invalid={Boolean(errors.bestProjectUrl)}
                  aria-describedby={errorId("bestProjectUrl")}
                />
              </Field>
            </Section>

            <Section index={4} title="Availability & Salary">
              <Field
                name="onSite"
                label="Are you available to work on-site in Ho Chi Minh City?"
                required
                wide
                group
                error={errors.onSite}
              >
                <div className="flex gap-2">
                  {(["yes", "no"] as const).map((value) => (
                    <label key={value} className={`${chipClasses} min-w-24 justify-center`}>
                      <input
                        type="radio"
                        name="onSite"
                        value={value}
                        checked={form.onSite === value}
                        onChange={() => update("onSite", value)}
                        className="sr-only"
                      />
                      {value === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
              </Field>

              <Field name="startDate" label="When can you start?" required wide error={errors.startDate}>
                <input
                  id={fieldId("startDate")}
                  name="startDate"
                  type="date"
                  min={minDate}
                  value={form.startDate}
                  onChange={(event) => update("startDate", event.target.value)}
                  className={`${inputClasses} [color-scheme:dark] sm:max-w-xs`}
                  aria-invalid={Boolean(errors.startDate)}
                  aria-describedby={errorId("startDate")}
                />
              </Field>

              <p className="-mb-2 text-sm leading-relaxed text-white/55 sm:col-span-2">
                Please enter your expected gross monthly salary in VND.
                Internship applicants may enter their expected monthly
                allowance.
              </p>

              {(["salaryMin", "salaryMax"] as const).map((name) => (
                <Field
                  key={name}
                  name={name}
                  label={`Expected monthly salary — ${name === "salaryMin" ? "minimum" : "maximum"} (VND)`}
                  required
                  error={errors[name]}
                >
                  <div className="relative">
                    <input
                      id={fieldId(name)}
                      name={name}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={groupDigits(form[name])}
                      onChange={(event) =>
                        update(name, event.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder={name === "salaryMin" ? "15.000.000" : "25.000.000"}
                      className={`${inputClasses} pr-16`}
                      aria-invalid={Boolean(errors[name])}
                      aria-describedby={errorId(name)}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs tracking-[0.15em] text-white/45"
                    >
                      VND
                    </span>
                  </div>
                </Field>
              ))}
            </Section>

            <Section index={5} title="Additional Information">
              <Field
                name="notes"
                label="Anything else you'd like us to know?"
                wide
                error={errors.notes}
              >
                <textarea
                  id={fieldId("notes")}
                  name="notes"
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  rows={5}
                  maxLength={LIMITS.notes}
                  data-lenis-prevent
                  className={`${fieldBox} resize-y px-4 py-3 leading-relaxed placeholder:text-white/30`}
                  aria-describedby={errorId("notes")}
                />
                <p className="mt-1 text-right text-xs text-white/35">
                  {form.notes.length}/{LIMITS.notes}
                </p>
              </Field>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-white/80">
                  <input
                    id={fieldId("consent")}
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={(event) => update("consent", event.target.checked)}
                    className="mt-1 size-5 shrink-0 cursor-pointer accent-[#f1f1ed]"
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errorId("consent")}
                  />
                  <span>
                    I agree to Studio 42 collecting and processing my personal
                    information for recruitment purposes in accordance with its
                    privacy policy.
                    <span className="ml-1 text-[#ffb4ad]" aria-hidden="true">
                      *
                    </span>
                  </span>
                </label>
                <ErrorText name="consent" error={errors.consent} />
              </div>
            </Section>

            <div className="border-t border-white/12 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden border border-[#a3a3a3] bg-[#a3a3a3] px-8 font-heading text-xs tracking-[0.2em] text-black uppercase transition-colors hover:border-[#f1f1ed] disabled:cursor-wait sm:text-sm"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 origin-left bg-[#f1f1ed] transition-transform ease-out ${
                    isSubmitting
                      ? "scale-x-100 duration-[1800ms]"
                      : "scale-x-0 duration-500 group-hover:scale-x-100"
                  }`}
                />
                <span className="relative pl-[0.2em]">
                  {isSubmitting ? "Submitting" : "Submit Application"}
                </span>
              </button>

              <p
                className="mt-4 min-h-5 text-center text-sm tracking-wide text-[#ffb4ad]"
                aria-live="polite"
              >
                {status}
              </p>

              <p className="mt-4 text-center text-sm text-white/50">
                Questions? Contact{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-white/80 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
