/**
 * Gets the current model and populates the system prompt.
 * This adds it to the chat-history as well so that it accurately sends
 * the first message (the system prompt) for the conversation
 *
 * This script _must_ be loaded after chat-history.js
 */
// const modelInput = document.getElementById("model-name");
const systemInput = document.getElementById("system-prompt");

const populateSystemPrompt = async (prompt) => {
  systemInput.value = prompt;
  window.chat_history[0].content = window.chat_system_prompt_default + prompt;
};

const getModelInformation = async () => {
  const ipAddress = sourceInput.value;
  const response = await fetch(`${ipAddress}/api/show`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelInput.value,
    }),
  });

  if (!response.ok) {
    return;
  }

  populateSystemPrompt((await response.json()).system);
};

modelInput.addEventListener("change", getModelInformation);
document.addEventListener("DOMContentLoaded", getModelInformation);
