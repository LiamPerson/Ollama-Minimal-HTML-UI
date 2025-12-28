document
  .getElementById("question-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const ipAddress = document.getElementById("ip-address").value;
    const modelName = document.getElementById("model-name").value;
    const prompt = document.querySelector("#question-form textarea").value;
    const responseContainer = document.getElementById("current-response");
    const errorContainer = document.getElementById("error-container");
    const submitButton = document.getElementById("submit-button");

    errorContainer.innerText = null;
    submitButton.disabled = true;

    // The true, unmodified response from the AI
    let answer = "";

    window.addQuestion(prompt);

    try {
      const res = await fetch(`${ipAddress}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelName,
          date: Date.now(),
          messages: window.chat_history,
          tools: [
            {
              type: "function",
              function: {
                name: "search_the_web",
                description:
                  "Searches the Web using a search engine and gives results in JSON",
                parameters: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description: "The search query",
                    },
                  },
                  required: ["query"],
                },
              },
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const reader = res.body.getReader();
      let accumulatedData = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const decoder = new TextDecoder("utf-8");
        accumulatedData += decoder.decode(value);

        try {
          // Attempt to parse the accumulated data
          const jsonChunks = accumulatedData.split("\n"); // Split by newline characters or another delimiter based on your response format

          for (const chunk of jsonChunks) {
            if (chunk.trim()) {
              // Ignore empty chunks
              const jsonChunk = JSON.parse(chunk);
              answer += jsonChunk.message.content;
            }
          }

          accumulatedData = "";
        } catch (e) {
          console.error(e);
        }

        responseContainer.innerHTML = markdown.render(answer);
      }
    } catch (error) {
      console.error(error);
      errorContainer.innerText = "Error while generating: " + error?.message;
    } finally {
      submitButton.disabled = false;
      responseContainer.innerHTML = null;
      window.addResponse(answer);
    }
  });
