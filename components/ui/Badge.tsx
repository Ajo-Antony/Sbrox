export default function Badge({ 
  children, 
  className = "badge",
  classNameOverride 
}: { 
  children: React.ReactNode;
  className?: string;
  classNameOverride?: string;
}) {
  const finalClassName = classNameOverride || className;
  return <span className={finalClassName}>{children}</span>;
}
