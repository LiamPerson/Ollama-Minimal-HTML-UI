/**
 * This files handles all data relating to models in ollama.
 *
 * Gets the current model and populates the system prompt.
 * This adds it to the chat-history as well so that it accurately sends
 * the first message (the system prompt) for the conversation
 *
 * This script _must_ be loaded after chat-history.js
 */

/**
 * Gets the models from the server and replaces the input box with it if selecting one.
 */
const sourceInput = document.getElementById("ip-address");
const modelDropdown = document.getElementById("model-dropdown");
const modelInput = document.getElementById("model-name");
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

  const responseJson = await response.json();

  window.can_use_tools = responseJson.capabilities.includes("tools");

  populateSystemPrompt(responseJson.system);
};

/**
 * Makes the options from the query
 */
const buildSelectOptions = (modelsArray) => {
  const newOptionsHtml = modelsArray.map((model) => {
    const newOption = document.createElement("option");
    newOption.value = model.model;
    newOption.innerText = `${model.name} (${model.details.parameter_size})`;
    return newOption;
  });
  modelDropdown.replaceChildren(...newOptionsHtml);
};

/**
 * Queries for models and builds them if we find them.
 */
const queryAndBuild = async () => {
  const ipAddress = sourceInput.value;

  const response = await fetch(`${ipAddress}/api/tags`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return;
  }

  buildSelectOptions((await response.json()).models);
};

/**
 * Queries for models when the source input (ip) is blurred or when the document is loaded
 */
sourceInput.addEventListener("blur", queryAndBuild);
/**
 * Queries for models when the source input (ip) is blurred or when the document is loaded
 */
document.addEventListener("DOMContentLoaded", queryAndBuild);
document.addEventListener("DOMContentLoaded", getModelInformation);

/**
 * Changes the model input to reflect what you select in the model dropdown
 */
modelDropdown.addEventListener("change", () => {
  const selectedModel = modelDropdown.value;
  if (selectedModel) {
    modelInput.value = selectedModel;
    // Re-trigger the change as other listeners won't detect the change as it is programmatic and not user-driven.
    modelInput.dispatchEvent(new Event("change"));
    getModelInformation();
  }
});
