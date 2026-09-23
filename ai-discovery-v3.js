/*
AI Business Opportunity Mapper — V3 AI Discovery
Generative discovery remains separate from the deterministic scoring framework.
*/

const AI_DISCOVERY_ENDPOINT =
  "https://ai-opportunity-mapper-api.javier-e40.workers.dev/";

function ensureAIDiscoveryUI() {
  if (document.getElementById("aiDiscovery")) return;

  const inputToolbar = document.querySelector(".input-card .toolbar");

  if (inputToolbar && !document.getElementById("aiAnalyzeBtn")) {
    const btn = document.createElement("button");

    btn.id = "aiAnalyzeBtn";
    btn.className = "ai-button";
    btn.type = "button";
    btn.innerHTML = "✨ Analyze with AI";
    btn.onclick = analyzeWithAI;

    inputToolbar.insertBefore(
      btn,
      inputToolbar.children[1] || null
    );
  }

  const results = document.getElementById("results");

  if (!results) return;

  const executiveSnapshot =
    document.getElementById("executiveSnapshot");

  const section = document.createElement("section");

  section.id = "aiDiscovery";
  section.className = "ai-discovery";
  section.style.display = "none";

  section.innerHTML = `
    <div class="ai-discovery-head">
      <div>
        <div class="ai-eyebrow">
          V3 · AI-assisted discovery
        </div>

        <h2>AI-Assisted Opportunity Discovery</h2>

        <p class="subtitle">
          Semantic interpretation of the business case designed
          to identify contextual opportunities the structured
          library may not capture.
        </p>
      </div>

      <span class="ai-chip">
        LLM DISCOVERY
      </span>
    </div>

    <div class="ai-principle">
      <strong>AI discovers and reasons.</strong>
      The framework evaluates. Management decides.
    </div>

    <div
      id="aiDiscoveryStatus"
      class="ai-status">
    </div>

    <div id="aiExecutiveInterpretation"></div>

    <div id="aiOpportunityList"></div>
  `;

  if (executiveSnapshot) {
    executiveSnapshot.insertAdjacentElement(
      "afterend",
      section
    );
  } else {
    results.prepend(section);
  }

  const version =
    document.querySelector(".version");

  if (version) {
    version.textContent =
      "V3 · AI-Assisted Discovery";
  }

  const methodParas =
    document.querySelectorAll(".method");

  methodParas.forEach(p => {
    if (
      p.textContent.includes(
        "V2.4 uses a transparent rules-based strategy model"
      )
    ) {
      p.innerHTML =
        "<strong>V3 combines two deliberately separate layers.</strong> " +
        "The Structured Model provides transparent, repeatable prioritization. " +
        "AI Discovery semantically interprets the business context and surfaces additional opportunities. " +
        "The LLM does not set final prioritization scores: the framework evaluates and management owns the decision.";
    }
  });
}

function setAIStatus(message, type = "") {
  const el =
    document.getElementById("aiDiscoveryStatus");

  if (!el) return;

  el.className =
    "ai-status" +
    (type ? " " + type : "");

  el.textContent = message || "";
}

function validateAIInputs(x) {
  if (
    !x.challenges ||
    x.challenges.trim().length < 10
  ) {
    return (
      "Please describe the key business challenges " +
      "before running AI Discovery."
    );
  }

  return "";
}

async function analyzeWithAI() {
  ensureAIDiscoveryUI();

  const x =
    typeof getInputs === "function"
      ? getInputs()
      : {};

  const validation =
    validateAIInputs(x);

  if (validation) {
    alert(validation);

    const c =
      document.getElementById("challenges");

    if (c) c.focus();

    return;
  }

  const section =
    document.getElementById("aiDiscovery");

  const button =
    document.getElementById("aiAnalyzeBtn");

  const interpretation =
    document.getElementById(
      "aiExecutiveInterpretation"
    );

  const list =
    document.getElementById(
      "aiOpportunityList"
    );

  section.style.display = "block";

const results =
  document.getElementById("results");

if (results) {
  results.style.display = "block";
}

interpretation.innerHTML = "";
list.innerHTML = "";

  setAIStatus(
    "AI is interpreting the business context " +
    "and looking for high-value opportunities…",
    "loading"
  );

  if (button) {
    button.disabled = true;

    button.dataset.original =
      button.innerHTML;

    button.innerHTML =
      "Analyzing…";
  }

  try {
    const response =
      await fetch(
        AI_DISCOVERY_ENDPOINT,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            company:
              x.company || "",

            industry:
              x.industry || "",

            model:
              x.model || "",

            size:
              x.size || "",

            objective:
              x.objective || "",

            challenges:
              x.challenges || "",

            customers:
              x.customers || "",

            data:
              x.data || ""
          })
        }
      );

    let payload = {};

    try {
      payload =
        await response.json();
    } catch (_) {}

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          "Rate limit reached. Please wait about " +
          "a minute before running another AI analysis."
        );
      }

      throw new Error(
        payload.error ||
        "AI Discovery is temporarily unavailable."
      );
    }

    renderAIDiscovery(payload);

    setAIStatus(
      "AI analysis complete. These discoveries " +
      "complement — rather than replace — " +
      "the structured assessment.",
      "success"
    );

    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {

    setAIStatus(
      error.message ||
      "Unable to complete AI Discovery. " +
      "The structured model remains available.",
      "error"
    );

  } finally {

    if (button) {
      button.disabled = false;

      button.innerHTML =
        button.dataset.original ||
        "✨ Analyze with AI";
    }
  }
}

function renderAIDiscovery(data) {
  const interpretation =
    document.getElementById(
      "aiExecutiveInterpretation"
    );

  const list =
    document.getElementById(
      "aiOpportunityList"
    );

  interpretation.innerHTML = `
    <div class="ai-interpretation">

      <div class="ai-label">
        Executive interpretation
      </div>

      <p>
        ${esc(
          data.executiveInterpretation ||
          "No interpretation returned."
        )}
      </p>

    </div>
  `;

  const opportunities =
    Array.isArray(data.opportunities)
      ? data.opportunities.slice(0, 5)
      : [];

  if (!opportunities.length) {
    list.innerHTML =
      '<p class="empty">' +
      'No additional AI opportunities were returned.' +
      '</p>';

    return;
  }

  list.innerHTML =
    opportunities
      .map((o, i) => {

        const kpis =
          Array.isArray(o.suggestedKPIs)
            ? o.suggestedKPIs
            : [];

        return `
          <article class="ai-opportunity">

            <div class="ai-opportunity-top">

              <div>

                <div class="ai-rank">
                  AI DISCOVERY #${i + 1}
                </div>

                <h3>
                  ${esc(
                    o.name ||
                    "AI Opportunity"
                  )}
                </h3>

                <div class="area">
                  ${esc(o.area || "")}
                </div>

              </div>

              <span class="ai-chip subtle">
                CONTEXTUAL
              </span>

            </div>

            <p class="ai-description">
              ${esc(o.description || "")}
            </p>

            <div class="ai-grid">

              <div class="ai-box">

                <div class="ai-label">
                  Why it matters
                </div>

                <p>
                  ${esc(
                    o.whyItMatters || ""
                  )}
                </p>

              </div>

              <div class="ai-box">

                <div class="ai-label">
                  Evidence from this case
                </div>

                <p>
                  ${esc(
                    o.evidence || ""
                  )}
                </p>

              </div>

            </div>

            <div class="ai-first-step">

              <div class="ai-label">
                Recommended first step
              </div>

              <p>
                ${esc(
                  o.recommendedFirstStep ||
                  ""
                )}
              </p>

            </div>

            ${
              kpis.length
                ? `
                  <div class="ai-kpis">

                    <div class="ai-label">
                      Suggested KPIs
                    </div>

                    <div>
                      ${kpis
                        .map(
                          k =>
                            `<span>${esc(k)}</span>`
                        )
                        .join("")}
                    </div>

                  </div>
                `
                : ""
            }

          </article>
        `;
      })
      .join("");
}

document.addEventListener(
  "DOMContentLoaded",
  ensureAIDiscoveryUI
);
