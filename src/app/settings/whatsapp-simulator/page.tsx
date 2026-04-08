"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, RefreshCw, Wifi, WifiOff, CheckCheck, ChevronDown } from "lucide-react";

const API_BASE        = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const COMPANY_ID      = "100";
// Phone Number ID is hardcoded — operators only have one WABA number
const PHONE_NUMBER_ID = "16505551111";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  whatsAppNumber: string;
  phone: string;
}

interface Message {
  id: string;
  text: string;
  dir: "out" | "in";
  time: string;
}

interface LogEntry {
  time: string;
  text: string;
  type: "ok" | "err" | "info";
}

interface Chip { label: string; value: string; }

const STEPS = [
  { key: "GREETING",          label: "Greeting" },
  { key: "AWAITING_SERVICE",  label: "Service selection" },
  { key: "AWAITING_LOCATION", label: "Location" },
  { key: "AWAITING_DATE",     label: "Date" },
  { key: "AWAITING_SLOT",     label: "Time slot" },
  { key: "AWAITING_ADDONS",   label: "Add-ons" },
  { key: "AWAITING_CONFIRM",  label: "Confirm" },
  { key: "COMPLETED",         label: "Completed" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function buildPayload(text: string, phoneNumberId: string, customerPhone: string) {
  return {
    object: "whatsapp_business_account",
    entry: [{
      id: "ENTRY_SIM",
      changes: [{
        field: "messages",
        value: {
          messaging_product: "whatsapp",
          metadata: { display_phone_number: "+1 650 555 1111", phone_number_id: phoneNumberId },
          messages: [{
            from: customerPhone,
            id: `wamid_sim_${Date.now()}`,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            text: { body: text },
            type: "text",
          }],
        },
      }],
    }],
  };
}

function detectStep(r: string): string | null {
  const s = r.toLowerCase();
  if (s.includes("select a service") || s.includes("welcome back") || s.includes("reply with the number to select")) return "AWAITING_SERVICE";
  if (s.includes("select a location") || s.includes("location number")) return "AWAITING_LOCATION";
  if (s.includes("available dates") || s.includes("reply with date")) return "AWAITING_DATE";
  if (s.includes("arrival time") || s.includes("reply with slot") || s.includes("slots left")) return "AWAITING_SLOT";
  if (s.includes("add-on") || s.includes("skip")) return "AWAITING_ADDONS";
  if (s.includes("confirm booking") || s.includes("amount payable") || s.includes("yes, confirm")) return "AWAITING_CONFIRM";
  if (s.includes("booking confirmed") || s.includes("booking is complete") || s.includes("thank you for booking")) return "COMPLETED";
  return null;
}

function extractChips(response: string): Chip[] {
  const numbered = response.split("\n").filter(l => /^\d+[\.\)]\s/.test(l.trim()));
  if (numbered.length > 0) {
    return numbered.slice(0, 6).flatMap(line => {
      const m = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
      if (!m) return [];
      return [{ label: `${m[1]}. ${m[2].replace(/\*|✅|🏷️/g, "").trim().substring(0, 28)}`, value: m[1] }];
    });
  }
  return [];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5 bg-[#1f2c23] rounded-xl rounded-bl-sm w-fit">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

// ── Customer Dropdown ─────────────────────────────────────────────────────────

interface CustomerDropdownProps {
  customers: Customer[];
  selected: Customer | null;
  onSelect: (c: Customer) => void;
  loading: boolean;
}

function CustomerDropdown({ customers, selected, onSelect, loading }: CustomerDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const label = selected
    ? `${selected.firstName} ${selected.lastName}`
    : loading ? "Loading customers..." : "Select customer";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-[#172010] border border-[#1e2e20] rounded-lg px-3 py-2 text-[#e8f0ea] text-xs outline-none hover:border-[#25D366]/40 transition-colors"
      >
        <span className={selected ? "text-[#e8f0ea]" : "text-[#4a6b4e]"}>{label}</span>
        <ChevronDown className={`w-3 h-3 text-[#4a6b4e] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#111a15] border border-[#1e2e20] rounded-lg overflow-hidden shadow-xl max-h-48 overflow-y-auto">
          {customers.length === 0 ? (
            <div className="px-3 py-2 text-xs text-[#4a6b4e]">No customers found</div>
          ) : (
            customers.map(c => (
              <button
                key={c.id}
                onClick={() => { onSelect(c); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-xs hover:bg-[#1f2c23] transition-colors border-b border-[#1e2e20] last:border-0
                  ${selected?.id === c.id ? "bg-[#1f2c23] text-[#25D366]" : "text-[#e8f0ea]"}`}
              >
                <div className="font-medium">{c.firstName} {c.lastName}</div>
                <div className="text-[#4a6b4e] font-mono text-[10px] mt-0.5">
                  WA: +{c.whatsAppNumber}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function WhatsAppSimulatorPage() {
  const [customers, setCustomers]       = useState<Customer[]>([]);
  const [loadingCust, setLoadingCust]   = useState(true);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [connected, setConnected]       = useState<boolean | null>(null);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState("");
  const [typing, setTyping]             = useState(false);
  const [chips, setChips]               = useState<Chip[]>([{ label: "👋 Say Hi to start", value: "Hi" }]);
  const [activeStep, setActiveStep]     = useState("GREETING");
  const [logs, setLogs]                 = useState<LogEntry[]>([{ time: getTime(), text: "Ready. Select a customer and send a message.", type: "info" }]);
  const [lastReq, setLastReq]           = useState("");
  const [lastRes, setLastRes]           = useState("");

  const chatRef = useRef<HTMLDivElement>(null);
  const logRef  = useRef<HTMLDivElement>(null);

  // Scroll helpers
  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [logs]);

  // Load customers on mount
  useEffect(() => {
    fetch(`${API_BASE}/v1/api/companies/${COMPANY_ID}/customers`)
      .then(r => r.json())
      .then((data: Customer[]) => {
        setCustomers(data);
        if (data.length > 0) setSelectedCust(data[0]); // auto-select first
      })
      .catch(() => addLog("Failed to load customers from backend", "err"))
      .finally(() => setLoadingCust(false));
  }, []);

  const addLog = useCallback((text: string, type: LogEntry["type"]) => {
    setLogs(p => [...p.slice(-49), { time: getTime(), text, type }]);
  }, []);

  const customerPhone = selectedCust?.whatsAppNumber ?? "";

  const send = useCallback(async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text) return;
    if (!selectedCust) { addLog("Select a customer first", "err"); return; }

    setInput("");
    setChips([]);
    setMessages(p => [...p, { id: Date.now().toString(), text, dir: "out", time: getTime() }]);

    const payload = buildPayload(text, PHONE_NUMBER_ID, customerPhone);
    setLastReq(JSON.stringify(payload, null, 2));
    setTyping(true);
    addLog(`POST /v1/api/webhook — "${text}" (${selectedCust.firstName})`, "info");

    try {
      const res  = await fetch(`${API_BASE}/v1/api/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.text();
      setLastRes(body);

      setTimeout(() => {
        setTyping(false);
        if (body && body !== "Invalid payload" && !body.startsWith("No entry")) {
          setMessages(p => [...p, { id: Date.now().toString(), text: body, dir: "in", time: getTime() }]);
          setChips(extractChips(body));
          const step = detectStep(body);
          if (step) setActiveStep(step);
          addLog(`${res.status} OK`, "ok");
        } else {
          setMessages(p => [...p, { id: Date.now().toString(), text: `⚠️ ${body}`, dir: "in", time: getTime() }]);
          addLog(`Error: ${body.substring(0, 60)}`, "err");
        }
      }, 700);
    } catch (e) {
      setTyping(false);
      const msg = e instanceof Error ? e.message : "Unknown error";
      setMessages(p => [...p, { id: Date.now().toString(), text: "⚠️ Cannot reach backend. Check URL + CORS.", dir: "in", time: getTime() }]);
      setLastRes(`Error: ${msg}`);
      addLog(`Failed: ${msg}`, "err");
    }
  }, [input, customerPhone, selectedCust, addLog]);

  const testConnection = async () => {
    try {
      const token = encodeURIComponent("LgX2vRdWPTmOMesyXowuUA==");
      const res   = await fetch(`${API_BASE}/v1/api/webhook?hub.mode=subscribe&hub.verify_token=${token}&hub.challenge=test123`);
      const text  = await res.text();
      const ok    = text === "test123" || res.ok;
      setConnected(ok);
      addLog(ok ? "Connection OK — webhook verified" : `Unexpected: ${text}`, ok ? "ok" : "err");
    } catch (e) {
      setConnected(false);
      addLog(`Failed: ${e instanceof Error ? e.message : "error"}`, "err");
    }
  };

  const reset = () => {
    setMessages([]);
    setChips([{ label: "👋 Say Hi to start", value: "Hi" }]);
    setActiveStep("GREETING");
    setLastReq(""); setLastRes("");
    addLog("Conversation reset", "info");
  };

  const stepIdx = STEPS.findIndex(s => s.key === activeStep);

  return (
    <div className="h-full w-full px-4 pb-6">
      {/* Breadcrumb */}
      <div className="pl-1 pb-2 text-sm text-[#70707A]">
        <span>Settings / </span><span className="text-[#121417]">WhatsApp Simulator</span>
      </div>
      <div className="pb-4">
        <h1 className="text-4xl font-bold px-2">WhatsApp Simulator</h1>
        <p className="text-[#70707A] text-sm mt-1 px-2">Test the full booking flow against your real backend.</p>
      </div>

      {/* Layout */}
      <div className="flex gap-4" style={{ height: "calc(100vh - 190px)", minHeight: 560 }}>

        {/* ── Left: Config + Log ── */}
        <div className="w-64 shrink-0 flex flex-col gap-3">
          <div className="bg-[#0a0f0d] rounded-xl border border-[#1e2e20] p-4 flex flex-col gap-3">
            <p className="text-[10px] font-semibold text-[#4a6b4e] uppercase tracking-wider">Config</p>

            {/* Customer dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-[#4a6b4e] uppercase tracking-wider">Customer</label>
              <CustomerDropdown
                customers={customers}
                selected={selectedCust}
                onSelect={c => { setSelectedCust(c); reset(); }}
                loading={loadingCust}
              />
            </div>

            {/* Selected customer phone info */}
            {selectedCust && (
              <div className="bg-[#172010] border border-[#1e2e20] rounded-lg px-3 py-2">
                <p className="text-[10px] text-[#4a6b4e] uppercase tracking-wider mb-1">WhatsApp Number</p>
                <p className="text-[#e8f0ea] font-mono text-[11px]">+{selectedCust.whatsAppNumber}</p>
                <p className="text-[10px] text-[#4a6b4e] uppercase tracking-wider mt-2 mb-1">Phone Number ID</p>
                <p className="text-[#e8f0ea] font-mono text-[11px]">{PHONE_NUMBER_ID}</p>
              </div>
            )}

            {/* Connection status */}
            <div className="flex items-center gap-1.5 text-xs">
              {connected === null
                ? <><span className="w-2 h-2 rounded-full bg-gray-400" /><span className="text-gray-400">Not tested</span></>
                : connected
                ? <><Wifi className="w-3.5 h-3.5 text-green-500" /><span className="text-green-500 font-medium">Connected</span></>
                : <><WifiOff className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400 font-medium">Failed</span></>}
            </div>

            <button onClick={testConnection}
              className="w-full bg-[#25D366] text-black text-xs font-semibold rounded-lg py-2 hover:bg-[#20c45a] transition-colors">
              Test Connection
            </button>
            <button onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 text-[#8aab8e] text-xs border border-[#1e2e20] rounded-lg py-2 hover:border-[#4a6b4e] transition-colors">
              <RefreshCw className="w-3 h-3" /> Reset Conversation
            </button>
          </div>

          {/* Log */}
          <div className="bg-[#0a0f0d] rounded-xl border border-[#1e2e20] p-3 flex flex-col gap-2 flex-1 overflow-hidden min-h-0">
            <p className="text-[10px] font-semibold text-[#4a6b4e] uppercase tracking-wider shrink-0">Log</p>
            <div ref={logRef} className="flex flex-col gap-0.5 overflow-y-auto flex-1 min-h-0">
              {logs.map((l, i) => (
                <p key={i} className={`text-[10px] font-mono leading-relaxed
                  ${l.type === "ok" ? "text-[#25D366]" : l.type === "err" ? "text-red-400" : "text-[#53bdeb]"}`}>
                  [{l.time}] {l.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Center: Phone ── */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <p className="text-[10px] text-[#70707A] uppercase tracking-widest font-medium">Preview</p>
          <div className="w-[320px] flex flex-col rounded-[32px] border-2 border-[#1e2e20] overflow-hidden flex-1 min-h-0"
            style={{ background: "#111a15", boxShadow: "0 0 40px rgba(37,211,102,0.05),0 20px 50px rgba(0,0,0,0.5)" }}>

            {/* WA header */}
            <div className="bg-[#1f2c23] px-4 pt-7 pb-3 flex items-center gap-3 border-b border-[#1e2e20] shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-sm shrink-0">🚗</div>
              <div>
                <p className="text-sm font-semibold text-[#e8f0ea] leading-none">Carsly Booking Bot</p>
                <p className="text-xs text-[#8aab8e] mt-0.5">{typing ? "typing..." : "online"}</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 min-h-0" style={{ background: "#0a0f0d" }}>
              <div className="text-center mb-1">
                <span className="text-[10px] text-[#4a6b4e] bg-[#111a15] px-3 py-1 rounded-full">Today</span>
              </div>
              {selectedCust && messages.length === 0 && (
                <div className="text-center mt-4">
                  <span className="text-[10px] text-[#4a6b4e]">
                    Simulating as {selectedCust.firstName} {selectedCust.lastName}
                  </span>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.dir === "out" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words
                    ${msg.dir === "out" ? "bg-[#005c4b] text-[#e8f5e9] rounded-br-sm" : "bg-[#1f2c23] text-[#e8f0ea] rounded-bl-sm"}`}>
                    {msg.text}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] opacity-50">{msg.time}</span>
                      {msg.dir === "out" && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                    </div>
                  </div>
                </div>
              ))}
              {typing && <div className="flex justify-start"><TypingDots /></div>}
            </div>

            {/* Quick replies */}
            {chips.length > 0 && (
              <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-[#1e2e20] shrink-0" style={{ background: "#0a0f0d" }}>
                {chips.map(chip => (
                  <button key={chip.value} onClick={() => send(chip.value)}
                    className="border border-[#25D366]/30 text-[#25D366] text-xs px-3 py-1 rounded-full hover:bg-[#25D366]/10 transition-colors">
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-2 flex items-center gap-2 border-t border-[#1e2e20] shrink-0" style={{ background: "#111a15" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder={selectedCust ? "Type a message..." : "Select a customer first"}
                disabled={!selectedCust}
                className="flex-1 bg-[#1a2a1d] border border-[#1e2e20] rounded-full px-4 py-2 text-sm text-[#e8f0ea] placeholder-[#4a6b4e] outline-none focus:border-[#25D366]/30 disabled:opacity-40"
              />
              <button onClick={() => send()} disabled={!selectedCust}
                className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center shrink-0 hover:bg-[#20c45a] transition-colors disabled:opacity-40">
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Inspector ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Step tracker */}
          <div className="bg-[#0a0f0d] rounded-xl border border-[#1e2e20] p-4 shrink-0">
            <p className="text-[10px] font-semibold text-[#4a6b4e] uppercase tracking-wider mb-3">Flow progress</p>
            <div className="flex flex-col gap-0.5">
              {STEPS.map((step, i) => (
                <div key={step.key} className={`flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-colors ${step.key === activeStep ? "bg-[#25D366]/10" : ""}`}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0
                    ${step.key === activeStep ? "border-[#25D366] text-[#25D366] bg-[#25D366]/10"
                      : i < stepIdx ? "border-[#4a6b4e] text-[#4a6b4e]"
                      : "border-[#1e2e20] text-[#1e2e20]"}`}>
                    {i < stepIdx ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs ${step.key === activeStep ? "text-[#25D366] font-medium" : i < stepIdx ? "text-[#8aab8e]" : "text-[#1e2e20]"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Last Request */}
          <div className="bg-[#0a0f0d] rounded-xl border border-[#1e2e20] flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#1e2e20] flex items-center justify-between shrink-0">
              <span className="text-[10px] font-semibold text-[#4a6b4e] uppercase tracking-wider">Last request</span>
              <span className="text-[10px] bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded font-mono font-semibold">POST</span>
            </div>
            <pre className="p-3 text-[10px] font-mono text-[#8aab8e] overflow-auto flex-1 min-h-0 leading-relaxed">{lastReq || "—"}</pre>
          </div>

          {/* Last Response */}
          <div className="bg-[#0a0f0d] rounded-xl border border-[#1e2e20] flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#1e2e20] shrink-0">
              <span className="text-[10px] font-semibold text-[#4a6b4e] uppercase tracking-wider">Last response</span>
            </div>
            <pre className="p-3 text-[10px] font-mono text-[#8aab8e] overflow-auto flex-1 min-h-0 leading-relaxed whitespace-pre-wrap">{lastRes || "—"}</pre>
          </div>
        </div>

      </div>
    </div>
  );
}
