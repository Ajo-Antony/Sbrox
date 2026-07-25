"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  PenTool,
  Download,
  Trash2,
  PhoneOff,
  Send,
  Paperclip,
  Check,
  Star,
  Plus,
  Maximize2,
  Share2,
  Layers,
  Sparkles
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";
import { getStoredBookings, updateBookingStatus, BookingData } from "@/lib/store";

export default function LiveRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60); // 15 minutes = 900 seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"video" | "canvas" | "chat">("canvas");

  // Call state
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<
    { sender: "you" | "designer"; text: string; time: string; image?: string }[]
  >([
    {
      sender: "designer",
      text: "Hey there! Welcome to our 15-min session. I'm opening Figma & the canvas now.",
      time: "Just now"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Canvas Whiteboard state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#E85D2C");
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser" | "sticky">("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [stickies, setStickies] = useState<{ id: string; x: number; y: number; text: string; color: string }[]>(
    []
  );

  // Post call modal state
  const [showEndModal, setShowEndModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Fetch booking info
  useEffect(() => {
    const bookings = getStoredBookings();
    const found = bookings.find((b) => b.id === id) || {
      id: id || "bk_demo",
      designerId: "meera-nair",
      designerName: "Meera Nair",
      userName: "You",
      category: "UI Design",
      slot: "Live Now",
      rate: 499,
      tip: 49,
      total: 548,
      status: "in_progress",
      paymentMethod: "upi",
      createdAt: new Date().toISOString(),
      notes: "Quick review of onboarding UX flow"
    };
    setBooking(found);
  }, [id]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setShowEndModal(true);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Init Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set background
    ctx.fillStyle = "#FAF7F2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid dots background for design feel
    ctx.fillStyle = "#E4DFD4";
    for (let x = 15; x < canvas.width; x += 25) {
      for (let y = 15; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw initial design sketch sample
    ctx.strokeStyle = "#3F6B58";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 240, 360);

    ctx.fillStyle = "#1C1B19";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Mobile Onboarding UX", 60, 80);

    ctx.fillStyle = "#E85D2C";
    ctx.fillRect(60, 110, 200, 40);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("Get Started →", 120, 135);
  }, [activeTab]);

  // Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "eraser") {
      ctx.strokeStyle = "#FAF7F2";
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FAF7F2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStickies([]);
  };

  const addStickyNote = () => {
    setStickies((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        x: 60 + prev.length * 30,
        y: 180 + prev.length * 20,
        text: "Sticky feedback note: Increase button contrast",
        color: "#FBF3E3"
      }
    ]);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `quikdraw-session-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const sendMessage = (textToSend?: string) => {
    const msg = textToSend || chatInput;
    if (!msg.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "you", text: msg, time }]);
    if (!textToSend) setChatInput("");

    // Simulate designer automatic response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "designer",
          text: "Got it! Applying those adjustments directly on the quick-draw canvas now.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1200);
  };

  const handleEndCall = () => {
    setIsTimerRunning(false);
    setShowEndModal(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const handleFinishRating = () => {
    if (booking) {
      updateBookingStatus(booking.id, "completed", {
        rating,
        review: reviewText,
        tip: booking.tip + tipAmount,
        total: booking.total + tipAmount
      });
    }
    setRatingSubmitted(true);
    setTimeout(() => {
      router.push("/user/bookings");
    }, 1500);
  };

  // Time calculations
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  const isUrgent = secondsLeft < 180; // Less than 3 minutes

  return (
    <div className="flex flex-col min-h-screen bg-ink text-white select-none relative pb-12">
      <div className="flex flex-col flex-1 w-full md:max-w-2xl md:mx-auto">
      {/* Top Header Bar */}
      <div className="bg-[#262420] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <Link
            href="/user/bookings"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm text-white"
          >
            ←
          </Link>
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>{booking?.designerName || "Meera Nair"}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[11px] text-[#C9C4B8]">{booking?.category || "UI Design"} · 15m Slot</div>
          </div>
        </div>

        {/* 15-Minute Timer Display */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold font-display ${
            isUrgent
              ? "bg-coral/20 border-coral text-coral animate-pulse"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}
        >
          <span className="text-sm">⏱</span>
          <span>{formattedTime}</span>
          <button
            onClick={() => setSecondsLeft((p) => p + 300)}
            title="Extend +5 mins"
            className="ml-1 bg-white/20 hover:bg-white/30 text-white rounded px-1.5 py-0.5 text-[10px]"
          >
            +5m
          </button>
        </div>
      </div>

      {/* Main View Mode Selector Tabs */}
      <div className="bg-[#1C1B19] border-b border-white/10 px-3 py-2 flex gap-2">
        <button
          onClick={() => setActiveTab("canvas")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "canvas" ? "bg-coral text-white" : "bg-white/5 text-[#C9C4B8] hover:bg-white/10"
          }`}
        >
          <PenTool size={14} />
          <span>Quick-Draw Canvas</span>
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "video" ? "bg-coral text-white" : "bg-white/5 text-[#C9C4B8] hover:bg-white/10"
          }`}
        >
          <Video size={14} />
          <span>Video Call</span>
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors relative ${
            activeTab === "chat" ? "bg-coral text-white" : "bg-white/5 text-[#C9C4B8] hover:bg-white/10"
          }`}
        >
          <MessageSquare size={14} />
          <span>Chat</span>
          {messages.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* Canvas View Mode */}
      {activeTab === "canvas" && (
        <div className="p-3 flex flex-col gap-3 flex-1">
          {/* Canvas Toolbar */}
          <div className="bg-[#2A2824] rounded-xl p-2 flex items-center justify-between border border-white/10 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTool("pen")}
                className={`p-2 rounded-lg ${
                  tool === "pen" ? "bg-coral text-white" : "bg-white/10 text-[#C9C4B8]"
                }`}
                title="Pen tool"
              >
                <PenTool size={16} />
              </button>
              <button
                onClick={() => setTool("eraser")}
                className={`p-2 rounded-lg ${
                  tool === "eraser" ? "bg-coral text-white" : "bg-white/10 text-[#C9C4B8]"
                }`}
                title="Eraser"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={addStickyNote}
                className="p-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 flex items-center gap-1 font-semibold text-[11px]"
              >
                <Plus size={14} /> Note
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-lg">
              {["#E85D2C", "#3F6B58", "#C9A15C", "#1C1B19", "#2E6E93", "#FFFFFF"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setTool("pen");
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c && tool === "pen" ? "scale-110 border-white" : "border-transparent"
                  }`}
                />
              ))}
            </div>

            {/* Canvas Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearCanvas}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#C9C4B8]"
                title="Clear canvas"
              >
                Clear
              </button>
              <button
                onClick={downloadCanvas}
                className="p-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white flex items-center gap-1 font-semibold"
                title="Download canvas image"
              >
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* Interactive Whiteboard Canvas */}
          <div className="relative bg-[#FAF7F2] rounded-2xl overflow-hidden border border-white/20 shadow-inner min-h-[380px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={380}
              height={420}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair touch-none max-w-full"
            />

            {/* Render Stickies */}
            {stickies.map((s) => (
              <div
                key={s.id}
                style={{ top: `${s.y}px`, left: `${s.x}px` }}
                className="absolute bg-goldbg border border-gold/40 text-ink text-xs p-2.5 rounded-lg shadow-lg max-w-[160px] font-sans text-left"
              >
                <div className="font-bold text-[10px] text-coraldark uppercase tracking-wider mb-1">
                  Designer Note
                </div>
                {s.text}
              </div>
            ))}

            {/* Floating PiP Video Thumbnail */}
            <div className="absolute top-3 right-3 bg-ink/90 border border-white/20 rounded-xl p-1.5 shadow-2xl flex items-center gap-2">
              <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-coral to-amber-600 flex items-center justify-center text-[10px] font-bold text-white relative overflow-hidden">
                <span className="z-10">{booking?.designerName.split(" ")[0]}</span>
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-white pr-1">
                <div className="font-bold">Live Call</div>
                <div className="text-emerald-400">Connected</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Call View Mode */}
      {activeTab === "video" && (
        <div className="p-3 flex flex-col gap-3 flex-1">
          {/* Main Video Stream Frame */}
          <div className="relative aspect-square max-h-[380px] bg-gradient-to-br from-[#2E2A24] to-[#121110] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            {/* Top Info overlay */}
            <div className="flex justify-between items-start z-10">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{booking?.designerName} (Designer)</span>
              </div>
              <button
                onClick={() => setScreenSharing(!screenSharing)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
                  screenSharing
                    ? "bg-coral text-white border-coral"
                    : "bg-black/60 text-white border-white/20"
                }`}
              >
                {screenSharing ? "Sharing Screen" : "Share Figma"}
              </button>
            </div>

            {/* Designer Video Content Mock */}
            <div className="my-auto text-center flex flex-col items-center">
              {cameraOn ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-coral to-amber-500 flex items-center justify-center font-display font-bold text-3xl shadow-xl ring-4 ring-coral/30 animate-pulse">
                  {booking?.designerName.charAt(0)}
                </div>
              ) : (
                <div className="text-sm text-[#C9C4B8]">Camera turned off</div>
              )}
              <div className="font-display font-semibold text-lg mt-3">
                {screenSharing ? "Screen Share Active (Figma Board)" : booking?.designerName}
              </div>
              <div className="text-xs text-[#C9C4B8] mt-1">
                {screenSharing
                  ? "Designer is sharing Figma Canvas on screen"
                  : "Audio/Video 1080p HD Encrypted"}
              </div>
            </div>

            {/* Self Camera PiP */}
            <div className="absolute bottom-3 right-3 w-24 h-20 bg-black/80 rounded-xl border border-white/20 p-2 flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="text-[10px] text-[#C9C4B8] font-bold">You</div>
              <div className="text-center text-[10px] text-emerald-400 font-semibold">
                {micOn ? "Mic On" : "Muted"}
              </div>
            </div>
          </div>

          {/* Quick Call Action Bar */}
          <div className="bg-[#2A2824] rounded-2xl p-3 flex items-center justify-around border border-white/10">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-full ${
                micOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`p-3 rounded-full ${
                cameraOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={handleEndCall}
              className="px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <PhoneOff size={16} /> End Call
            </button>
          </div>
        </div>
      )}

      {/* Chat View Mode */}
      {activeTab === "chat" && (
        <div className="p-3 flex flex-col flex-1 h-[480px]">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-[#23211D] rounded-xl border border-white/10 mb-3">
            {messages.map((m, idx) => {
              const isYou = m.sender === "you";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isYou ? "items-end" : "items-start"}`}
                >
                  <div className="text-[10px] text-[#C9C4B8] mb-1">
                    {isYou ? "You" : booking?.designerName} · {m.time}
                  </div>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs ${
                      isYou
                        ? "bg-coral text-white rounded-tr-none"
                        : "bg-[#33302A] text-white border border-white/10 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 text-[11px]">
            {[
              "Can you adjust the primary button style?",
              "I love this direction!",
              "Please share Figma link",
              "Can we try a light background?"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="bg-white/10 hover:bg-white/20 text-[#E4DFD4] whitespace-nowrap px-2.5 py-1 rounded-full border border-white/10 flex-none"
              >
                + {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type message to designer…"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-[#23211D] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8A8478] focus:outline-none focus:border-coral"
            />
            <button
              onClick={() => sendMessage()}
              className="bg-coral text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      </div>

      {/* End Call / Session Summary Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-canvas text-ink w-full max-w-sm rounded-2xl p-5 border border-line shadow-2xl animate-in fade-in zoom-in-95">
            {!ratingSubmitted ? (
              <>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mx-auto mb-2 font-bold">
                    ✓
                  </div>
                  <div className="font-display font-semibold text-xl">15-Min Session Complete</div>
                  <div className="text-xs text-inksoft mt-1">
                    Your quick-draw session with {booking?.designerName} is finished!
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="bg-white border border-line rounded-xl p-3 text-center mb-4">
                  <div className="text-xs font-semibold text-inksoft mb-2">Rate your designer</div>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform ${
                          rating >= star ? "text-amber-500 scale-110" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Tip */}
                <div className="bg-goldbg rounded-xl p-3 mb-4">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span>Tip the designer</span>
                    <span className="text-coraldark">{formatINR(tipAmount)}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 49, 99, 149].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={`flex-1 py-1.5 rounded text-xs font-semibold border ${
                          tipAmount === amt
                            ? "bg-gold text-white border-gold"
                            : "bg-white text-ink border-line"
                        }`}
                      >
                        {amt === 0 ? "No tip" : formatINR(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Written Feedback */}
                <textarea
                  placeholder="Add a quick review (optional)…"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border border-line rounded-xl p-2.5 text-xs bg-white mb-4 resize-none h-16"
                />

                <Button variant="primary" className="w-full" onClick={handleFinishRating}>
                  Submit & Return to Bookings
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">🎉</div>
                <div className="font-display font-semibold text-lg">Thank You!</div>
                <div className="text-xs text-inksoft mt-1">
                  Your feedback and tip have been sent to {booking?.designerName}.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
