export default function TimerRing({ minutes = 15 }: { minutes?: number }) {
  return (
    <div className="relative w-[46px] h-[46px] flex-shrink-0">
      <svg width="46" height="46" className="-rotate-90">
        <circle cx="23" cy="23" r="19" stroke="#524C40" strokeWidth="4" fill="none" />
        <circle
          cx="23"
          cy="23"
          r="19"
          stroke="#E85D2C"
          strokeWidth="4"
          fill="none"
          strokeDasharray="119"
          strokeDashoffset="0"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display font-semibold text-[15px]">
        {minutes}
      </div>
    </div>
  );
}
