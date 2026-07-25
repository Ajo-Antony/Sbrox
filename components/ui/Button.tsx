import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "outline" | "sage";
}

export default function Button({ variant = "primary", className = "", ...rest }: Props) {
  const base = "rounded-xl2 px-4 py-3 font-bold text-sm transition-colors disabled:opacity-50";
  const styles = {
    primary: "bg-coral text-white active:bg-coraldark",
    dark: "bg-ink text-white active:bg-black",
    outline: "border border-line bg-white text-ink",
    sage: "bg-sage text-white active:bg-[#2d4f3f]"
  }[variant];
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}
