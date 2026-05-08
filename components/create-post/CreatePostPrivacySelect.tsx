"use client";

import { useEffect, useRef, useState } from "react";

const visibilityOptions = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can see this post",
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can see this post",
  },
] as const;

export type VisibilityValue = (typeof visibilityOptions)[number]["value"];

type CreatePostPrivacySelectProps = {
  value: VisibilityValue;
  onChange: (value: VisibilityValue) => void;
};

export default function CreatePostPrivacySelect({
  value,
  onChange,
}: CreatePostPrivacySelectProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const selectedVisibility =
    visibilityOptions.find((option) => option.value === value) ?? visibilityOptions[0];

  return (
    <div className="position-absolute top-0 end-0" ref={menuRef} style={{ zIndex: 5 }}>
      <div className="position-relative">
        <button
          type="button"
          className="border-0 rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1"
          style={{ backgroundColor: "#e4e6eb", color: "#1c1e21" }}
          onClick={() => setIsOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1 }}>
            {selectedVisibility.label}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 14 14">
            <path
              d="M3.5 5.25 7 8.75l3.5-3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        {isOpen ? (
          <div
            className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm overflow-hidden"
            style={{ minWidth: 200, zIndex: 20 }}
            role="menu"
          >
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="w-100 text-start bg-transparent border-0 px-3 py-2"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="menuitemradio"
                aria-checked={value === option.value}
              >
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="fw-semibold small text-dark">{option.label}</div>
                    {value === option.value ? (
                      <span className="text-primary d-inline-flex align-items-center" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                          <circle cx="8" cy="8" r="7" fill="currentColor" fillOpacity=".12" />
                          <path
                            d="m5.1 8 1.9 1.9 3.9-3.9"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
