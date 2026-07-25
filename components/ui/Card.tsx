import { HTMLAttributes } from "react";

export default function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white border border-line rounded-xl2 p-4 ${className}`} {...rest} />;
}
