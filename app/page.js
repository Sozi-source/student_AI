"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

const QUICK_QUESTIONS = [
  { label: "How to get indexed?", text: "How do I apply for KNDI indexing?" },
  { label: "Documents needed", text: "What documents do I need for KNDI indexing?" },
  { label: "Indexing fees", text: "How much does KNDI indexing cost?" },
  { label: "2026 upgrade exam dates", text: "What are the 2026 professional upgrading exam dates and how do I apply?" },
  { label: "Aptitude exam", text: "Who needs to sit the KNDI aptitude exam and when is Phase 17?" },
  { label: "Licensing exams", text: "How do I apply for KNDI licensing professional exams?" },
  { label: "After passing LPE", text: "What happens after I pass the licensing professional exams?" },
  { label: "Degree internship", text: "What is the KNDI internship requirement for degree students?" },
];

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^#{1,3} (.+)$/gm, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)(\n<li>)/g, "$1$2")
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
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "Samahani, nimepata hitilafu. Please try again or contact us directly at **+254 0112 514 865** or **info@kndi.institute**.",
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Connection error. Please check your internet and try again, or contact **+254 0112 514 865**.",
        },
      ]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.shell}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <span>KN</span>
        </div>
        <div className={styles.headerText}>
          <div className={styles.headerTitle}>KNDI Assistant</div>
          <div className={styles.headerSub}>Imperial College · Human Nutrition &amp; Dietetics</div>
        </div>
        <div className={styles.statusBadge}>
          <div className={styles.statusDot} />
          <span>Online</span>
        </div>
      </header>

      {/* Chat body */}
      <main className={styles.chatArea}>
        {/* Welcome */}
        {!started && (
          <div className={styles.welcomeWrap}>
            <div className={styles.welcomeCard}>
              <div className={styles.welcomeEmoji}>🎓</div>
              <h1 className={styles.welcomeTitle}>Habari! I&apos;m your KNDI Assistant</h1>
              <p className={styles.welcomeSub}>
                Ask me anything about KNDI indexing, professional upgrading, aptitude exams,
                licensing, and registration processes. Available 24/7 for Imperial College students.
              </p>
              <div className={styles.quickGrid}>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.label}
                    className={styles.quickBtn}
                    onClick={() => sendMessage(q.text)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.msgRow} ${msg.role === "user" ? styles.userRow : styles.botRow}`}
          >
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

        {/* Typing indicator */}
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
            placeholder="Ask about indexing, upgrading, exams… (Enter to send)"
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
