// chrome.runtime.onMessage.addListener(async (message) => {
//   console.log("📥 Message received:", message);

//   if (message.action === "rewriteExplain" && message.text) {
//     showPopup("⏳ Processing text with AI...", true);
//     await rewriteAndExplain(message.text);
//   }

//   if (message.action === "summarizePage") {
//     showPopup("⏳ Summarizing page with AI...", true);
//     await summarizePage(message.mode);
//   }
// });

// // 🔹 Rewriter Function
// async function rewriteAndExplain(selectedText: string) {
//   try {
//     if (!("Rewriter" in self)) {
//       showPopup("❌ Rewriter API not supported in this browser.", false);
//       return;
//     }

//     const availability = await (self as any).Rewriter.availability();
//     if (availability === "unavailable") {
//       showPopup("⚠️ Rewriter API unavailable in this browser.", false);
//       return;
//     }

//     const rewriter = await (self as any).Rewriter.create({
//       tone: "more-casual",
//       format: "plain-text",
//       length: "shorter",
//       sharedContext:
//         "Rewrite complex or technical text in simple, easy-to-understand English.",
//       outputLanguage: "en",
//     });

//     const simpler = await rewriter.rewrite(selectedText, {
//       context: "Simplify this text for general readers.",
//     });

//     rewriter.destroy();

//     showPopup(
//       `<div class="ai-popup-section">
//         <h3>📝 Simplified Version</h3>
//         <div class="ai-content">${escapeHtml(simpler)}</div>
//       </div>`,
//       false
//     );
//   } catch (err) {
//     console.error("Rewriter failed:", err);
//     showPopup(`❌ Error: ${escapeHtml(String(err))}`, false);
//   }
// }

// // 🔹 Summarizer Function
// async function summarizePage(mode: "tldr" | "key-points") {
//   try {
//     if (!("Summarizer" in self)) {
//       showPopup("❌ Summarizer API not supported in this browser.", false);
//       return;
//     }

//     const availability = await (self as any).Summarizer.availability();
//     if (availability === "unavailable") {
//       showPopup("⚠️ Summarizer API unavailable in this browser.", false);
//       return;
//     }

//     let textContent = document.body?.innerText || "";
//     if (!textContent.trim()) {
//       showPopup("⚠️ No readable text found on this page.", false);
//       return;
//     }

//     // ✅ Avoid QuotaExceededError
//     const MAX_CHARS = 10000;
//     if (textContent.length > MAX_CHARS) {
//       console.warn(
//         `⚠️ Page too long (${textContent.length} chars). Trimming to ${MAX_CHARS}.`
//       );
//       textContent = textContent.slice(0, MAX_CHARS);
//     }

//     const summarizer = await (self as any).Summarizer.create({
//       type: mode === "tldr" ? "tl;dr" : "key-points",
//       length: "medium",
//       format: "markdown",
//       sharedContext:
//         "Summarize visible web page content clearly and concisely for readers.",
//     });

//     const summary = await summarizer.summarize(textContent, {
//       context:
//         mode === "tldr"
//           ? "Create a short TL;DR summary for this web page."
//           : "Extract key bullet points from this page.",
//     });

//     summarizer.destroy();

//     // Format the content based on mode
//     const formattedContent = mode === "key-points"
//       ? formatKeyPoints(summary)
//       : `<div class="ai-content">${escapeHtml(summary)}</div>`;

//     showPopup(
//       `<div class="ai-popup-section">
//         <h3>${mode === "tldr" ? "⚡ TL;DR Summary" : "📌 Key Points"}</h3>
//         ${formattedContent}
//       </div>`,
//       false
//     );
//   } catch (err) {
//     console.error("Summarizer failed:", err);
//     showPopup(`❌ Error: ${escapeHtml(String(err))}`, false);
//   }
// }

// // 🔹 Format Key Points with Beautiful Bullet List
// function formatKeyPoints(text: string): string {
//   // Split by common bullet point markers or newlines
//   const lines = text
//     .split(/\n|•|−|–|—|\*|\d+\./)
//     .map(line => line.trim())
//     .filter(line => line.length > 0);

//   if (lines.length <= 1) {
//     // If no clear bullet structure, return as paragraph
//     return `<div class="ai-content">${escapeHtml(text)}</div>`;
//   }

//   // Create beautiful bullet list
//   const bulletItems = lines
//     .map(line => `<li><span class="bullet-icon">▸</span>${escapeHtml(line)}</li>`)
//     .join('');

//   return `<ul class="ai-bullet-list">${bulletItems}</ul>`;
// }

// // 🔹 Escape HTML
// function escapeHtml(text: string): string {
//   const div = document.createElement("div");
//   div.textContent = text;
//   return div.innerHTML;
// }

// // 🔹 Global reference to current popup cleanup function
// let currentPopupCleanup: (() => void) | null = null;

// // 🔹 Popup UI
// function showPopup(content: string, isLoading: boolean) {
//   console.log("🔵 showPopup called - isLoading:", isLoading);

//   // Clean up previous popup properly
//   if (currentPopupCleanup) {
//     currentPopupCleanup();
//     currentPopupCleanup = null;
//   }

//   // Remove existing popups
//   document.getElementById("ai-rewriter-popup")?.remove();
//   document.getElementById("ai-rewriter-overlay")?.remove();

//   // Inject popup styles once
//   if (!document.getElementById("ai-rewriter-popup-style")) {
//     const style = document.createElement("style");
//     style.id = "ai-rewriter-popup-style";
//     style.textContent = `
//       /* Base Styles */
//       #ai-rewriter-popup * {
//         box-sizing: border-box;
//       }

//       #ai-rewriter-popup .ai-popup-section {
//         margin-bottom: 20px;
//       }

//       #ai-rewriter-popup .ai-popup-section h3 {
//         margin: 0 0 16px 0;
//         font-size: 18px;
//         font-weight: 600;
//         color: #fff;
//         display: flex;
//         align-items: center;
//         gap: 8px;
//         padding-bottom: 12px;
//         border-bottom: 2px solid #333;
//       }

//       /* Content Styles */
//       #ai-rewriter-popup .ai-content {
//         color: #e0e0e0;
//         line-height: 1.7;
//         font-size: 15px;
//         white-space: pre-wrap;
//         word-wrap: break-word;
//       }

//       /* Beautiful Bullet List */
//       #ai-rewriter-popup .ai-bullet-list {
//         list-style: none;
//         padding: 0;
//         margin: 0;
//       }

//       #ai-rewriter-popup .ai-bullet-list li {
//         display: flex;
//         align-items: flex-start;
//         gap: 12px;
//         padding: 12px 16px;
//         margin-bottom: 8px;
//         background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
//         border-radius: 8px;
//         border-left: 3px solid #4a9eff;
//         color: #e0e0e0;
//         line-height: 1.6;
//         font-size: 15px;
//         transition: all 0.2s ease;
//       }

//       #ai-rewriter-popup .ai-bullet-list li:hover {
//         background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
//         border-left-color: #6bb0ff;
//         transform: translateX(4px);
//       }

//       #ai-rewriter-popup .ai-bullet-list li:last-child {
//         margin-bottom: 0;
//       }

//       #ai-rewriter-popup .bullet-icon {
//         color: #4a9eff;
//         font-size: 18px;
//         font-weight: bold;
//         flex-shrink: 0;
//         margin-top: 2px;
//       }

//       /* Loading Animation */
//       @keyframes pulse {
//         0%, 100% { opacity: 1; }
//         50% { opacity: 0.5; }
//       }

//       #ai-rewriter-popup .loading-content {
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         gap: 12px;
//         padding: 40px 20px;
//         animation: pulse 1.5s ease-in-out infinite;
//       }

//       /* Scrollbar Styles */
//       #ai-rewriter-popup ::-webkit-scrollbar {
//         width: 8px;
//       }

//       #ai-rewriter-popup ::-webkit-scrollbar-track {
//         background: rgba(255,255,255,0.05);
//         border-radius: 4px;
//       }

//       #ai-rewriter-popup ::-webkit-scrollbar-thumb {
//         background: rgba(255,255,255,0.2);
//         border-radius: 4px;
//       }

//       #ai-rewriter-popup ::-webkit-scrollbar-thumb:hover {
//         background: rgba(255,255,255,0.3);
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   const overlay = document.createElement("div");
//   overlay.id = "ai-rewriter-overlay";
//   Object.assign(overlay.style, {
//     position: "fixed",
//     top: "0",
//     left: "0",
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.6)",
//     backdropFilter: "blur(4px)",
//     zIndex: "2147483646",
//     opacity: "0",
//     transition: "opacity 0.3s ease-in-out",
//   });

//   const popup = document.createElement("div");
//   popup.id = "ai-rewriter-popup";
//   popup.setAttribute("role", "dialog");
//   popup.setAttribute("aria-modal", "true");
//   popup.setAttribute("aria-labelledby", "ai-popup-title");
//   Object.assign(popup.style, {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%) scale(0.95)",
//     background: "linear-gradient(145deg, #1f1f1f 0%, #1a1a1a 100%)",
//     color: "#e0e0e0",
//     borderRadius: "16px",
//     border: "1px solid rgba(255,255,255,0.1)",
//     zIndex: "2147483647",
//     width: "90%",
//     maxWidth: "650px",
//     minWidth: "400px",
//     maxHeight: "80vh",
//     boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
//     opacity: "0",
//     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//   });

//   const closeButton = document.createElement("button");
//   closeButton.innerHTML = "×";
//   closeButton.setAttribute("aria-label", "Close popup");
//   Object.assign(closeButton.style, {
//     position: "absolute",
//     top: "16px",
//     right: "16px",
//     background: "rgba(255,255,255,0.1)",
//     border: "none",
//     color: "#999",
//     fontSize: "28px",
//     cursor: "pointer",
//     zIndex: "1",
//     width: "36px",
//     height: "36px",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "all 0.2s ease",
//   });

//   closeButton.addEventListener("mouseenter", () => {
//     closeButton.style.background = "rgba(255,255,255,0.15)";
//     closeButton.style.color = "#fff";
//     closeButton.style.transform = "rotate(90deg)";
//   });

//   closeButton.addEventListener("mouseleave", () => {
//     closeButton.style.background = "rgba(255,255,255,0.1)";
//     closeButton.style.color = "#999";
//     closeButton.style.transform = "rotate(0deg)";
//   });

//   const contentContainer = document.createElement("div");
//   Object.assign(contentContainer.style, {
//     maxHeight: "calc(80vh - 40px)",
//     overflowY: "auto",
//     padding: "24px 28px",
//   });

//   if (isLoading) {
//     contentContainer.innerHTML = `<div class="loading-content">${content}</div>`;
//   } else {
//     contentContainer.innerHTML = content;
//   }

//   popup.appendChild(closeButton);
//   popup.appendChild(contentContainer);
//   document.body.appendChild(overlay);
//   document.body.appendChild(popup);

//   // Smooth entrance animation
//   requestAnimationFrame(() => {
//     overlay.style.opacity = "1";
//     popup.style.opacity = "1";
//     popup.style.transform = "translate(-50%, -50%) scale(1)";
//   });

//   let cleanedUp = false;
//   const closePopup = () => {
//     if (cleanedUp) return;
//     cleanedUp = true;

//     overlay.style.opacity = "0";
//     popup.style.opacity = "0";
//     popup.style.transform = "translate(-50%, -50%) scale(0.95)";

//     setTimeout(() => {
//       overlay.remove();
//       popup.remove();
//     }, 300);

//     // Clear the global reference if this is the current popup
//     if (currentPopupCleanup === cleanupListeners) {
//       currentPopupCleanup = null;
//     }
//   };

//   // Event listeners that need cleanup
//   const overlayClickHandler = () => {
//     if (!isLoading) closePopup();
//   };

//   const escapeKeyHandler = (e: KeyboardEvent) => {
//     if (e.key === "Escape" && !isLoading) closePopup();
//   };

//   const closeButtonClickHandler = () => closePopup();

//   const popupClickHandler = (e: Event) => e.stopPropagation();

//   // Attach event listeners
//   closeButton.addEventListener("click", closeButtonClickHandler);
//   overlay.addEventListener("click", overlayClickHandler);
//   document.addEventListener("keydown", escapeKeyHandler);
//   popup.addEventListener("click", popupClickHandler);

//   // Cleanup function
//   const cleanupListeners = () => {
//     closeButton.removeEventListener("click", closeButtonClickHandler);
//     overlay.removeEventListener("click", overlayClickHandler);
//     document.removeEventListener("keydown", escapeKeyHandler);
//     popup.removeEventListener("click", popupClickHandler);
//     closePopup();
//   };

//   // Store cleanup function globally
//   currentPopupCleanup = cleanupListeners;

//   // Safety timeout for loading popups (2 minutes)
//   if (isLoading) {
//     setTimeout(() => {
//       if (document.getElementById("ai-rewriter-popup") === popup) {
//         console.warn("⚠️ Loading popup timeout reached");
//         closePopup();
//       }
//     }, 120000);
//   }
// }

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("📥 Message received:", message);

  if (message.action === "rewriteExplain" && message.text) {
    showLoadingPopup("⏳ Processing text with AI...");
    await rewriteAndExplain(message.text);
  }

  if (message.action === "summarizePage") {
    showLoadingPopup("⏳ Summarizing page with AI...");
    await summarizePage(message.mode);
  }
});

// 🔹 Rewriter Function
async function rewriteAndExplain(selectedText: string) {
  try {
    if (!("Rewriter" in self)) {
      showErrorPopup(
        "Rewriter API Not Supported",
        "The Rewriter API is not available in this browser.",
        true
      );
      return;
    }

    const availability = await (self as any).Rewriter.availability();
    console.log("Rewriter availability:", availability);

    if (availability === "no") {
      showErrorPopup(
        "Rewriter API Unavailable",
        "Your device doesn't support the Rewriter API.",
        true
      );
      return;
    }

    if (availability === "after-download") {
      showDownloadingPopup("Rewriter");
      // Wait for download to complete
      await waitForModelDownload("Rewriter");
    }

    updateLoadingMessage("🤖 AI is rewriting your text...");

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

    showResultPopup(
      `<div class="ai-popup-section">
        <h3>📝 Simplified Version</h3>
        <div class="ai-content">${escapeHtml(simpler)}</div>
      </div>`
    );
  } catch (err) {
    console.error("Rewriter failed:", err);
    showErrorPopup("Rewriter Error", String(err), false);
  }
}

// 🔹 Summarizer Function
async function summarizePage(mode: "tldr" | "key-points") {
  try {
    if (!("Summarizer" in self)) {
      showErrorPopup(
        "Summarizer API Not Supported",
        "The Summarizer API is not available in this browser.",
        true
      );
      return;
    }

    const availability = await (self as any).Summarizer.availability();
    console.log("Summarizer availability:", availability);

    if (availability === "no") {
      showErrorPopup(
        "Summarizer API Unavailable",
        "Your device doesn't support the Summarizer API.",
        true
      );
      return;
    }

    if (availability === "after-download") {
      showDownloadingPopup("Summarizer");
      // Wait for download to complete
      await waitForModelDownload("Summarizer");
    }

    updateLoadingMessage("📄 Extracting page content...");

    let textContent = document.body?.innerText || "";
    if (!textContent.trim()) {
      showErrorPopup(
        "No Content Found",
        "No readable text found on this page.",
        false
      );
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

    updateLoadingMessage("🤖 AI is analyzing the page...");

    const summarizer = await (self as any).Summarizer.create({
      type: mode === "tldr" ? "teaser" : "key-points",
      length: "medium",
      format: "markdown",
      sharedContext:
        "Summarize visible web page content clearly and concisely for readers.",
    });

    const summary = await summarizer.summarize(textContent, {
      context:
        mode === "tldr"
          ? "Create a short TL;DR summary in simple, easy-to-understand language. Avoid jargon or complex words."
          : "Extract key bullet points in easy-to-understand language. Avoid jargon or complex words from this page.",
    });

    summarizer.destroy();

    // Format the content based on mode
    const formattedContent =
      mode === "key-points"
        ? formatKeyPoints(summary)
        : `<div class="ai-content">${escapeHtml(summary)}</div>`;

    showResultPopup(
      `<div class="ai-popup-section">
        <h3>${mode === "tldr" ? "⚡ TL;DR Summary" : "📌 Key Points"}</h3>
        ${formattedContent}
      </div>`
    );
  } catch (err) {
    console.error("Summarizer failed:", err);
    showErrorPopup("Summarizer Error", String(err), false);
  }
}

// 🔹 Wait for Model Download
async function waitForModelDownload(apiName: string): Promise<void> {
  const maxWaitTime = 300000; // 5 minutes
  const checkInterval = 2000; // 2 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    await new Promise((resolve) => setTimeout(resolve, checkInterval));

    const availability = await (self as any)[apiName].availability();
    console.log(`${apiName} availability check:`, availability);

    if (availability === "readily") {
      updateLoadingMessage(`✅ ${apiName} model downloaded! Processing...`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }
  }

  throw new Error("Model download timeout. Please try again later.");
}

// 🔹 Update Loading Message
function updateLoadingMessage(message: string) {
  const contentContainer = document.querySelector(
    "#ai-rewriter-popup .loading-content"
  );
  if (contentContainer) {
    contentContainer.innerHTML = `<div class="loading-spinner"></div><span>${escapeHtml(
      message
    )}</span>`;
  }
}

// 🔹 Show Loading Popup
function showLoadingPopup(message: string) {
  createPopup(
    `<div class="loading-content">
      <div class="loading-spinner"></div>
      <span>${escapeHtml(message)}</span>
    </div>`,
    true
  );
}

// 🔹 Show Result Popup
function showResultPopup(content: string) {
  createPopup(content, false);
}

// 🔹 Show Downloading Popup
function showDownloadingPopup(apiName: string) {
  createPopup(
    `<div class="downloading-content">
      <div class="download-icon">📥</div>
      <h3>Downloading ${apiName} Model</h3>
      <p>The AI model is being downloaded. This may take a few minutes...</p>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <p class="download-note">Please keep this tab open during the download.</p>
    </div>`,
    true
  );
}

// 🔹 Show Error Popup with Setup Instructions
function showErrorPopup(title: string, message: string, showSetup: boolean) {
  const setupInstructions = showSetup
    ? `
    <div class="setup-instructions">
      <h4>🔧 How to Enable Gemini Nano</h4>
      <div class="setup-steps">
        <div class="setup-step">
          <span class="step-number">1</span>
          <div class="step-content">
            <strong>Update Chrome Browser</strong>
            <p>Make sure you're using the latest version of Chrome (or any Chromium-based browser)</p>
          </div>
        </div>
        <div class="setup-divider">OR</div>
        <div class="setup-step">
          <span class="step-number">2</span>
          <div class="step-content">
            <strong>Enable Feature Flags</strong>
            <p>Copy and paste these URLs into your browser:</p>
            <div class="flag-links">
              <code class="copyable-link">chrome://flags/#rewriter-api-for-gemini-nano</code>
              <code class="copyable-link">chrome://flags/#summarization-api-for-gemini-nano</code>
            </div>
            <p class="flag-note">Set both flags to <strong>"Enabled"</strong> and restart your browser.</p>
          </div>
        </div>
      </div>
    </div>
  `
    : "";

  createPopup(
    `<div class="error-content">
      <div class="error-icon">❌</div>
      <h3>${escapeHtml(title)}</h3>
      <p class="error-message">${escapeHtml(message)}</p>
      ${setupInstructions}
    </div>`,
    false
  );
}

// 🔹 Format Key Points with Beautiful Bullet List
function formatKeyPoints(text: string): string {
  const lines = text
    .split(/\n|•|−|–|—|\*|\d+\./)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return `<div class="ai-content">${escapeHtml(text)}</div>`;
  }

  const bulletItems = lines
    .map(
      (line) => `
      <li>
        <span class="bullet-dot"></span>
        <span>${escapeHtml(line)}</span>
      </li>`
    )
    .join("");

  return `<ul class="ai-bullet-list">${bulletItems}</ul>`;
}

// 🔹 Escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 🔹 Global reference to current popup cleanup function
let currentPopupCleanup: (() => void) | null = null;

// 🔹 Create Popup (Main Function)
function createPopup(content: string, isLoading: boolean) {
  console.log("🔵 Creating popup - isLoading:", isLoading);

  // Clean up previous popup properly
  if (currentPopupCleanup) {
    currentPopupCleanup();
    currentPopupCleanup = null;
  }

  // Remove existing popups
  document.getElementById("ai-rewriter-popup")?.remove();
  document.getElementById("ai-rewriter-overlay")?.remove();

  // Inject popup styles once
  if (!document.getElementById("ai-rewriter-popup-style")) {
    const style = document.createElement("style");
    style.id = "ai-rewriter-popup-style";
    style.textContent = `
      /* Base Styles */
      #ai-rewriter-popup * {
        box-sizing: border-box;
      }
      
      #ai-rewriter-popup .ai-popup-section { 
        margin-bottom: 20px; 
      }
      
      #ai-rewriter-popup .ai-popup-section h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 12px;
        border-bottom: 2px solid #333;
      }
      
      /* Content Styles */
      #ai-rewriter-popup .ai-content {
        color: #e0e0e0;
        line-height: 1.7;
        font-size: 15px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      
      /* Beautiful Bullet List */
      #ai-rewriter-popup .ai-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
      }

      #ai-rewriter-popup .ai-bullet-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-left: 3px solid #4a9eff;
          border-radius: 8px;
          padding: 10px 14px;
          color: #e0e0e0;
          line-height: 1.6;
          font-size: 15px;
          transition: background 0.2s ease;
      }

      #ai-rewriter-popup .ai-bullet-list li:hover {
          background: rgba(255, 255, 255, 0.08);
      }

      #ai-rewriter-popup .bullet-dot {
          width: 8px;
          height: 8px;
          margin-top: 6px;
          border-radius: 50%;
          background: #4a9eff;
          flex-shrink: 0;
      }
      
      /* Loading Content */
      #ai-rewriter-popup .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 40px 20px;
        text-align: center;
      }
      
      #ai-rewriter-popup .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255,255,255,0.1);
        border-top-color: #4a9eff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      #ai-rewriter-popup .loading-content span {
        color: #e0e0e0;
        font-size: 16px;
        font-weight: 500;
      }
      
      /* Downloading Content */
      #ai-rewriter-popup .downloading-content {
        text-align: center;
        padding: 30px 20px;
      }
      
      #ai-rewriter-popup .download-icon {
        font-size: 64px;
        margin-bottom: 16px;
        animation: bounce 2s ease-in-out infinite;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      #ai-rewriter-popup .downloading-content h3 {
        color: #fff;
        margin: 0 0 12px 0;
        font-size: 20px;
        border: none;
        padding: 0;
      }
      
      #ai-rewriter-popup .downloading-content p {
        color: #b0b0b0;
        margin: 8px 0;
        line-height: 1.6;
      }
      
      #ai-rewriter-popup .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
        margin: 20px 0;
        overflow: hidden;
      }
      
      #ai-rewriter-popup .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4a9eff, #6bb0ff);
        border-radius: 4px;
        animation: progress 2s ease-in-out infinite;
      }
      
      @keyframes progress {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
      
      #ai-rewriter-popup .download-note {
        font-size: 13px;
        color: #888;
        font-style: italic;
      }
      
      /* Error Content */
      #ai-rewriter-popup .error-content {
        text-align: center;
        padding: 30px 20px;
      }
      
      #ai-rewriter-popup .error-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }
      
      #ai-rewriter-popup .error-content h3 {
        color: #ff6b6b;
        margin: 0 0 12px 0;
        font-size: 20px;
        border: none;
        padding: 0;
      }
      
      #ai-rewriter-popup .error-message {
        color: #e0e0e0;
        margin: 12px 0 24px 0;
        line-height: 1.6;
      }
      
      /* Setup Instructions */
      #ai-rewriter-popup .setup-instructions {
        background: rgba(74, 158, 255, 0.1);
        border: 1px solid rgba(74, 158, 255, 0.3);
        border-radius: 12px;
        padding: 24px;
        margin-top: 24px;
        text-align: left;
      }
      
      #ai-rewriter-popup .setup-instructions h4 {
        color: #4a9eff;
        margin: 0 0 20px 0;
        font-size: 18px;
        text-align: center;
      }
      
      #ai-rewriter-popup .setup-steps {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      #ai-rewriter-popup .setup-step {
        display: flex;
        gap: 16px;
        align-items: flex-start;
        background: rgba(255,255,255,0.05);
        padding: 16px;
        border-radius: 8px;
      }
      
      #ai-rewriter-popup .step-number {
        background: #4a9eff;
        color: #fff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
      
      #ai-rewriter-popup .step-content {
        flex: 1;
      }
      
      #ai-rewriter-popup .step-content strong {
        color: #fff;
        display: block;
        margin-bottom: 8px;
        font-size: 16px;
      }
      
      #ai-rewriter-popup .step-content p {
        color: #b0b0b0;
        margin: 4px 0;
        font-size: 14px;
        line-height: 1.5;
      }
      
      #ai-rewriter-popup .setup-divider {
        text-align: center;
        color: #666;
        font-weight: bold;
        font-size: 14px;
        padding: 8px 0;
      }
      
      #ai-rewriter-popup .flag-links {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 12px 0;
      }
      
      #ai-rewriter-popup .copyable-link {
        background: rgba(0,0,0,0.4);
        color: #4a9eff;
        padding: 10px 12px;
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        display: block;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid rgba(74, 158, 255, 0.3);
      }
      
      #ai-rewriter-popup .copyable-link:hover {
        background: rgba(0,0,0,0.6);
        border-color: #4a9eff;
        transform: translateX(4px);
      }
      
      #ai-rewriter-popup .flag-note {
        background: rgba(74, 158, 255, 0.15);
        padding: 8px 12px;
        border-radius: 6px;
        margin-top: 8px;
        font-size: 13px;
      }
      
      /* Scrollbar Styles */
      #ai-rewriter-popup ::-webkit-scrollbar {
        width: 8px;
      }
      
      #ai-rewriter-popup ::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.05);
        border-radius: 4px;
      }
      
      #ai-rewriter-popup ::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 4px;
      }
      
      #ai-rewriter-popup ::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.3);
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
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    zIndex: "2147483646",
    opacity: "0",
    transition: "opacity 0.3s ease-in-out",
  });

  const popup = document.createElement("div");
  popup.id = "ai-rewriter-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  Object.assign(popup.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.95)",
    background: "linear-gradient(145deg, #1f1f1f 0%, #1a1a1a 100%)",
    color: "#e0e0e0",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    zIndex: "2147483647",
    width: "90%",
    maxWidth: "650px",
    minWidth: "400px",
    maxHeight: "85vh",
    boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
    opacity: "0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  });

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.setAttribute("aria-label", "Close popup");
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#999",
    fontSize: "28px",
    cursor: "pointer",
    zIndex: "1",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  });

  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.background = "rgba(255,255,255,0.15)";
    closeButton.style.color = "#fff";
    closeButton.style.transform = "rotate(90deg)";
  });

  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.background = "rgba(255,255,255,0.1)";
    closeButton.style.color = "#999";
    closeButton.style.transform = "rotate(0deg)";
  });

  const contentContainer = document.createElement("div");
  Object.assign(contentContainer.style, {
    maxHeight: "calc(85vh - 40px)",
    overflowY: "auto",
    padding: "24px 28px",
  });
  contentContainer.innerHTML = content;

  popup.appendChild(closeButton);
  popup.appendChild(contentContainer);
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Make flag links clickable (for copying)
  const flagLinks = popup.querySelectorAll(".copyable-link");
  flagLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const text = link.textContent || "";
      navigator.clipboard.writeText(text).then(() => {
        const originalText = link.textContent;
        link.textContent = "✓ Copied!";
        setTimeout(() => {
          link.textContent = originalText;
        }, 2000);
      });
    });
  });

  // Smooth entrance animation
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    popup.style.opacity = "1";
    popup.style.transform = "translate(-50%, -50%) scale(1)";
  });

  let cleanedUp = false;
  const closePopup = () => {
    if (cleanedUp) return;
    cleanedUp = true;

    overlay.style.opacity = "0";
    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -50%) scale(0.95)";

    setTimeout(() => {
      overlay.remove();
      popup.remove();
    }, 300);

    if (currentPopupCleanup === cleanupListeners) {
      currentPopupCleanup = null;
    }
  };

  // Event listeners
  const overlayClickHandler = () => {
    if (!isLoading) closePopup();
  };

  const escapeKeyHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) closePopup();
  };

  const closeButtonClickHandler = () => closePopup();
  const popupClickHandler = (e: Event) => e.stopPropagation();

  closeButton.addEventListener("click", closeButtonClickHandler);
  overlay.addEventListener("click", overlayClickHandler);
  document.addEventListener("keydown", escapeKeyHandler);
  popup.addEventListener("click", popupClickHandler);

  // Cleanup function
  const cleanupListeners = () => {
    closeButton.removeEventListener("click", closeButtonClickHandler);
    overlay.removeEventListener("click", overlayClickHandler);
    document.removeEventListener("keydown", escapeKeyHandler);
    popup.removeEventListener("click", popupClickHandler);
    closePopup();
  };

  currentPopupCleanup = cleanupListeners;
}
