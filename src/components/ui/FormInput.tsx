"use client";
import { read } from "fs";
import { useState, InputHTMLAttributes, FC } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "input" | "gender";
  genderValue?: string;
  onGenderChange?: (value: string) => void;
  customLabelStyle?: string;
}

export const FormInput: FC<FormInputProps> = ({
  type = "text",
  label,
  className = "",
  variant = "input",
  genderValue,
  onGenderChange,
  customLabelStyle,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Gender variant
  if (variant === "gender") {
    return (
      <div className="relative w-full">
        {label && (
          <div className={`${customLabelStyle ? customLabelStyle : "block text-white font-medium text-xs"}`} >{label}</div>
        )}
        <div className={`flex gap-2 ${customLabelStyle ? "mt-2" : 'mt-1'}`}>
          <button
            type="button"
            onClick={() => !props.disabled && onGenderChange?.("male")}
            disabled={props.disabled}
            className={`flex-1 px-4 py-3.5 lg:text-sm md:text-sm text-xs rounded-md font-medium transition-colors border-2 ${
              genderValue === "male"
                ? "bg-(--primary)/15 border-(--border-blue) text-white"
                : "bg-white/15 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
            } ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center justify-center gap-1.5">
              NAM
              <img src="/icons/Male.png" alt="Male" className="lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => !props.disabled && onGenderChange?.("female")}
            disabled={props.disabled}
            className={`flex-1 px-4 py-3.5 lg:text-sm md:text-sm text-xs rounded-md font-medium transition-colors border-2 ${
              genderValue === "female"
                ? "bg-(--primary)/15 border-(--border-blue) text-whit"
                : "bg-white/15 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
            } ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center justify-center gap-1.5">
              NỮ
              <img src="/icons/Female.png" alt="Male" className="lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Input variant (default)
  return (
    <div className="relative w-full">
      {label && (
        <div className={`${customLabelStyle ? customLabelStyle : "block text-white font-medium text-xs"}`} >{label}</div>
      )}
      <input
        type={inputType}
        className={`w-full ${customLabelStyle ? "mt-2" : 'mt-1'} px-4 py-3.5 lg:text-sm md:text-sm text-xs bg-white/15 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent pr-${isPassword ? '12' : '4'} ${className}`}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {showPassword ? (
            // Hide password icon (mắt bị gạch)
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Pupil */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />

              {/* Eye */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.478 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.064 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"
              />

              {/* Slash */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3l18 18"
              />
            </svg>
          ) : (
            // Show password icon (mắt thường)
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};