/**
 * Gets the models from the server and replaces the input box with it if selecting one.
 */
const sourceInput = document.getElementById("ip-address");
const modelDropdown = document.getElementById("model-dropdown");
const modelInput = document.getElementById("model-name");

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

/**
 * Changes the model input to reflect what you select in the model dropdown
 */
modelDropdown.addEventListener("change", () => {
  const selectedModel = modelDropdown.value;
  if (selectedModel) {
    modelInput.value = selectedModel;
  }
});
