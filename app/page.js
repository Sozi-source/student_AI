"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

const SERVICES = [
  {
    category: "📋 Indexing",
    items: [
      { label: "What is KNDI indexing?", text: "What is KNDI indexing and why is it mandatory?" },
      { label: "How to apply for indexing", text: "Give me the full step-by-step process to apply for KNDI indexing." },
      { label: "Documents required", text: "What documents do I need to apply for KNDI indexing?" },
      { label: "Indexing fees", text: "What are the full fees for KNDI indexing including all payments?" },
      { label: "Check application status", text: "How do I check my KNDI indexing application status?" },
      { label: "Paid via institution", text: "I paid for indexing through my institution, what do I do next?" },
      { label: "Late payment penalty", text: "What is the penalty for late or stale bank slips for KNDI indexing?" },
    ],
  },
  {
    category: "📝 Aptitude Exam",
    items: [
      { label: "What is the aptitude exam?", text: "What is the KNDI aptitude exam and who needs to sit it?" },
      { label: "Aptitude eligibility", text: "Am I eligible for the KNDI aptitude exam? What are the criteria?" },
      { label: "2026 aptitude exam dates", text: "What are all the 2026 KNDI aptitude exam dates and which phases are open?" },
      { label: "How to apply", text: "How do I apply for the KNDI aptitude exam? Give me full steps and fees." },
      { label: "What happens if I fail?", text: "What happens if I fail the KNDI aptitude exam?" },
    ],
  },
  {
    category: "⬆️ Upgrading Exams",
    items: [
      { label: "What is the upgrading exam?", text: "What is the KNDI professional upgrading exam and who must sit it?" },
      { label: "Upgrading eligibility", text: "Who is eligible for the KNDI professional upgrading exam?" },
      { label: "Subjects examined", text: "What subjects are covered in the KNDI professional upgrading exam?" },
      { label: "2026 upgrade exam dates", text: "What are all the 2026 KNDI upgrading exam dates, phases, and deadlines?" },
      { label: "Fees per subject", text: "What are the fees for the KNDI upgrading exam per subject including resit fees?" },
      { label: "Revision classes", text: "Tell me about the KNDI upgrading exam revision classes — schedule and attendance rules." },
      { label: "How to apply", text: "How do I apply for the KNDI professional upgrading exam? Full steps please." },
      { label: "What if I fail twice?", text: "What happens if I fail the KNDI upgrading exam twice?" },
    ],
  },
  {
    category: "🎓 Licensing Exams (LPE)",
    items: [
      { label: "What is the LPE?", text: "What is the KNDI Licensing Professional Examination and who must sit it?" },
      { label: "LPE eligibility", text: "What are the full eligibility requirements for the KNDI licensing professional exam?" },
      { label: "Exam papers by level", text: "What exam papers will I sit based on my programme level — certificate, diploma, or degree?" },
      { label: "LPE fees", text: "What are the full fees for the KNDI licensing professional exam by programme level?" },
      { label: "2026 LPE exam dates", text: "What are all the 2026 KNDI licensing exam dates for both Phase 1 and Phase 2?" },
      { label: "How to apply for LPE", text: "How do I apply for the KNDI licensing professional exam? Full steps." },
      { label: "Resit policy", text: "What is the KNDI policy on resitting the licensing professional exam?" },
    ],
  },
  {
    category: "🪪 Registration & Licensing",
    items: [
      { label: "After passing LPE", text: "What do I do after passing the KNDI licensing professional exam?" },
      { label: "Professional titles", text: "What professional title will I get after KNDI registration based on my level?" },
      { label: "How to get licensed", text: "How do I get my KNDI registration certificate and practice license?" },
    ],
  },
  {
    category: "🏥 Internship",
    items: [
      { label: "Who needs internship?", text: "Who is required to do the KNDI internship and when?" },
      { label: "Internship duration", text: "How long is the KNDI internship programme?" },
      { label: "Find internship centres", text: "How do I find approved KNDI internship centres?" },
    ],
  },
  {
    category: "📤 Send Documents to HOD",
    items: [
      { label: "How to submit documents", text: "How do I submit documents to the department HOD?" },
      { label: "Send via WhatsApp", text: "I want to send my documents via WhatsApp to the HOD. What is the number and what should I include?" },
      { label: "Send via Email", text: "I want to email my documents to the HOD. What is the email address and what should I include?" },
    ],
  },
  {
    category: "📞 Contacts & Links",
    items: [
      { label: "KNDI contacts", text: "Give me all KNDI official contacts — phone, email, and portal links." },
      { label: "KNDI portal links", text: "What are all the important KNDI online portal links for applications?" },
      { label: "How to pay via MPESA", text: "How do I pay KNDI fees via MPESA? Give me the paybill numbers." },
    ],
  },
];

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^#{1,3} (.+)$/gm, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>")
    .replace(
      /(https?:\/\/[^\s<"]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 130) + "px";
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setMenuOpen(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setStarted(true);

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, {
          role: "assistant",
          content: "Samahani, nimepata hitilafu. Please try again or contact **+254 0112 514 865** or **info@kndi.institute**.",
        }]);
      }
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Connection error. Please check your internet and try again, or contact **+254 0112 514 865**.",
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleCategory = (cat) => {
    setOpenCategory(openCategory === cat ? null : cat);
  };

  return (
    <div className={styles.shell}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLogo}><span>KN</span></div>
        <div className={styles.headerText}>
          <div className={styles.headerTitle}>KNDI Assistant</div>
          <div className={styles.headerSub}>Imperial College · Human Nutrition &amp; Dietetics</div>
        </div>
        <div className={styles.statusBadge}>
          <div className={styles.statusDot} />
          <span>Online</span>
        </div>
      </header>

      {/* Services Menu Bar */}
      <div className={styles.menuBar} ref={menuRef}>
        <button
          className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleActive : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Browse services"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          Browse Services &amp; Processes
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {menuOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              Select a topic — tap any item to get full details
            </div>
            {SERVICES.map((section) => (
              <div key={section.category} className={styles.dropdownSection}>
                <button
                  className={`${styles.categoryBtn} ${openCategory === section.category ? styles.categoryBtnOpen : ""}`}
                  onClick={() => toggleCategory(section.category)}
                >
                  <span>{section.category}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: openCategory === section.category ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openCategory === section.category && (
                  <div className={styles.itemList}>
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        className={styles.itemBtn}
                        onClick={() => sendMessage(item.text)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.5 }}>
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat body */}
      <main className={styles.chatArea}>
        {!started && (
          <div className={styles.welcomeWrap}>
            <div className={styles.welcomeCard}>
              <div className={styles.welcomeEmoji}>🎓</div>
              <h1 className={styles.welcomeTitle}>Habari! I&apos;m your KNDI Assistant</h1>
              <p className={styles.welcomeSub}>
                Use the <strong>Browse Services</strong> menu above to explore KNDI processes,
                or type your question below. Available 24/7 for Imperial College students.
              </p>
              <div className={styles.hintRow}>
                <div className={styles.hint}>
                  <span>📋</span> Indexing
                </div>
                <div className={styles.hint}>
                  <span>⬆️</span> Upgrading
                </div>
                <div className={styles.hint}>
                  <span>🎓</span> Licensing
                </div>
                <div className={styles.hint}>
                  <span>📞</span> Contacts
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`${styles.msgRow} ${msg.role === "user" ? styles.userRow : styles.botRow}`}>
            <div className={`${styles.avatar} ${msg.role === "user" ? styles.avatarUser : styles.avatarBot}`}>
              {msg.role === "user" ? "S" : "KN"}
            </div>
            <div className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleBot}`}>
              {msg.role === "assistant" ? (
                <span dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.msgRow} ${styles.botRow}`}>
            <div className={`${styles.avatar} ${styles.avatarBot}`}>KN</div>
            <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typingBubble}`}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Input area */}
      <footer className={styles.inputArea}>
        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="Type your question or use Browse Services above…"
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKey}
            rows={1}
            disabled={loading}
          />
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <div className={styles.footerNote}>
          📞 +254 0112 514 865 &nbsp;·&nbsp; 📧 info@kndi.institute &nbsp;·&nbsp; 🌐 kndi.institute
        </div>
      </footer>
    </div>
  );
}