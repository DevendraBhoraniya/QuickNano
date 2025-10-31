chrome.runtime.onInstalled.addListener(() => {
// ✅ Context menu for selected text (Rewrite & Explain)
chrome.contextMenus.create({
id: "rewriteExplain",
title: "📝 Rewrite & Explain",
contexts: ["selection"],
});

// ✅ Summarize options — visible on all pages
chrome.contextMenus.create({
id: "summarizeParent",
title: "🧠 Summarize This Page",
contexts: ["all"],
});

chrome.contextMenus.create({
id: "summarizeTLDR",
parentId: "summarizeParent",
title: "⚡ TL;DR Summary",
contexts: ["all"],
});

chrome.contextMenus.create({
id: "summarizeKeyPoints",
parentId: "summarizeParent",
title: "📌 Key Points Summary",
contexts: ["all"],
});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
if (!tab?.id) return;

// Rewrite & Explain (only for selected text)
if (info.menuItemId === "rewriteExplain" && info.selectionText) {
chrome.tabs.sendMessage(tab.id, {
action: "rewriteExplain",
text: info.selectionText,
});
}

// Summarize TL;DR
else if (info.menuItemId === "summarizeTLDR") {
chrome.tabs.sendMessage(tab.id, {
action: "summarizePage",
mode: "tldr",
});
}

// Summarize Key Points
else if (info.menuItemId === "summarizeKeyPoints") {
chrome.tabs.sendMessage(tab.id, {
action: "summarizePage",
mode: "key-points",
});
}
});