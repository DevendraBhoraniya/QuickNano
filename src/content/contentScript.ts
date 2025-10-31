chrome.runtime.onMessage.addListener(async (message) => {
  console.log("📥 Message received:", message);

  if (message.action === "rewriteExplain" && message.text) {
    showPopup("⏳ Processing text with AI...", true);
    await rewriteAndExplain(message.text);
  }

  if (message.action === "summarizePage") {
    showPopup("⏳ Summarizing page with AI...", true);
    await summarizePage(message.mode);
  }
});

// 🔹 Rewriter Function
async function rewriteAndExplain(selectedText: string) {
  try {
    if (!("Rewriter" in self)) {
      showPopup("❌ Rewriter API not supported in this browser.", false);
      return;
    }

    const availability = await (self as any).Rewriter.availability();
    if (availability === "unavailable") {
      showPopup("⚠️ Rewriter API unavailable in this browser.", false);
      return;
    }

    const rewriter = await (self as any).Rewriter.create({
      tone: "more-casual",
      format: "plain-text",
      length: "shorter",
      sharedContext:
        "Rewrite complex or technical text in simple, easy-to-understand English.",
      outputLanguage: "en",
    });

    const simpler = await rewriter.rewrite(selectedText, {
      context: "Simplify this text for general readers.",
    });

    rewriter.destroy();

    showPopup(
      `<div class="ai-popup-section">
        <h3>📝 Simplified Version</h3>
        <p>${escapeHtml(simpler)}</p>
      </div>`,
      false
    );
  } catch (err) {
    console.error("Rewriter failed:", err);
    showPopup(`❌ Error: ${escapeHtml(String(err))}`, false);
  }
}

// 🔹 Summarizer Function
async function summarizePage(mode: "tldr" | "key-points") {
  try {
    if (!("Summarizer" in self)) {
      showPopup("❌ Summarizer API not supported in this browser.", false);
      return;
    }

    const availability = await (self as any).Summarizer.availability();
    if (availability === "unavailable") {
      showPopup("⚠️ Summarizer API unavailable in this browser.", false);
      return;
    }

    let textContent = document.body?.innerText || "";
    if (!textContent.trim()) {
      showPopup("⚠️ No readable text found on this page.", false);
      return;
    }

    // ✅ Avoid QuotaExceededError
    const MAX_CHARS = 10000;
    if (textContent.length > MAX_CHARS) {
      console.warn(
        `⚠️ Page too long (${textContent.length} chars). Trimming to ${MAX_CHARS}.`
      );
      textContent = textContent.slice(0, MAX_CHARS);
    }

    const summarizer = await (self as any).Summarizer.create({
      type: mode === "tldr" ? "tldr" : "key-points",
      length: "medium",
      outputLanguage: "en",
      sharedContext:
        "Summarize visible web page content clearly and concisely for readers.",
    });

    const summary = await summarizer.summarize(textContent, {
      context:
        mode === "tldr"
          ? "Create a short TL;DR summary for this web page."
          : "Extract key bullet points from this page.",
    });

    summarizer.destroy();

    showPopup(
      `<div class="ai-popup-section">
        <h3>${mode === "tldr" ? "⚡ TL;DR Summary" : "📌 Key Points"}</h3>
        <p>${escapeHtml(summary)}</p>
      </div>`,
      false
    );
  } catch (err) {
    console.error("Summarizer failed:", err);
    showPopup(`❌ Error: ${escapeHtml(String(err))}`, false);
  }
}

// 🔹 Escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 🔹 Popup UI
function showPopup(content: string, isLoading: boolean) {
  console.log("🔵 showPopup called - isLoading:", isLoading);

  // Remove existing popups
  document.getElementById("ai-rewriter-popup")?.remove();
  document.getElementById("ai-rewriter-overlay")?.remove();

  // Inject popup styles once
  if (!document.getElementById("ai-rewriter-popup-style")) {
    const style = document.createElement("style");
    style.id = "ai-rewriter-popup-style";
    style.textContent = `
      #ai-rewriter-popup .ai-popup-section { margin-bottom: 20px; }
      #ai-rewriter-popup .ai-popup-section h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }
      #ai-rewriter-popup .ai-popup-section p {
        margin: 0;
        color: #e0e0e0;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement("div");
  overlay.id = "ai-rewriter-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: "2147483646",
    opacity: "0",
    transition: "opacity 0.2s ease-in-out",
  });

  const popup = document.createElement("div");
  popup.id = "ai-rewriter-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  Object.assign(popup.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.9)",
    background: "#1a1a1a",
    color: "#e0e0e0",
    borderRadius: "12px",
    zIndex: "2147483647",
    width: "90%",
    maxWidth: "600px",
    minWidth: "400px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    opacity: "0",
    transition: "all 0.2s ease-in-out",
  });

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.setAttribute("aria-label", "Close popup");
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "transparent",
    border: "none",
    color: "#999",
    fontSize: "28px",
    cursor: "pointer",
  });

  const contentContainer = document.createElement("div");
  Object.assign(contentContainer.style, {
    maxHeight: "500px",
    overflowY: "auto",
    padding: "20px",
  });
  contentContainer.innerHTML = content;

  popup.appendChild(closeButton);
  popup.appendChild(contentContainer);
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    popup.style.opacity = "1";
    popup.style.transform = "translate(-50%, -50%) scale(1)";
  });

  const closePopup = () => {
    overlay.style.opacity = "0";
    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -50%) scale(0.9)";
    setTimeout(() => {
      overlay.remove();
      popup.remove();
    }, 200);
  };

  closeButton.addEventListener("click", closePopup);
  if (!isLoading) {
    overlay.addEventListener("click", closePopup);
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closePopup(),
      { once: true }
    );
  } else {
    // Fallback auto-close for loading popups
    setTimeout(() => {
      if (document.getElementById("ai-rewriter-popup") === popup) closePopup();
    }, 30000);
  }

  popup.addEventListener("click", (e) => e.stopPropagation());
}
