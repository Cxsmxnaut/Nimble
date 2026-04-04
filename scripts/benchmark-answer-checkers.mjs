const GROQ_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

const CASES = [
  { type: "exact", question: "What is H2O commonly called?", canonical: "water", user: "water", expected: true },
  { type: "exact", question: "Capital of France?", canonical: "Paris", user: "Paris", expected: true },
  { type: "paraphrase", question: "Define photosynthesis briefly.", canonical: "plants convert light into chemical energy", user: "plants use sunlight to make chemical energy", expected: true },
  { type: "paraphrase", question: "What does mitosis do?", canonical: "cell division producing two identical daughter cells", user: "it splits one cell into two genetically identical cells", expected: true },
  { type: "synonym", question: "What is another word for quick?", canonical: "fast", user: "rapid", expected: true },
  { type: "synonym", question: "What is sodium chloride called?", canonical: "salt", user: "table salt", expected: true },
  { type: "typo", question: "Translate to Spanish: house", canonical: "casa", user: "casa", expected: true },
  { type: "typo", question: "Translate to Spanish: house", canonical: "casa", user: "cassa", expected: true },
  { type: "near-miss", question: "What is the powerhouse of the cell?", canonical: "mitochondria", user: "nucleus", expected: false },
  { type: "near-miss", question: "What planet is known as the Red Planet?", canonical: "Mars", user: "Jupiter", expected: false },
  { type: "paraphrase", question: "What is evaporation?", canonical: "liquid changing into gas", user: "when liquid turns into vapor", expected: true },
  { type: "wrong", question: "What gas do plants absorb?", canonical: "carbon dioxide", user: "oxygen", expected: false },
];

const COMBOS = [
  { provider: "groq", model: "llama-3.1-8b-instant" },
  { provider: "groq", model: "llama-3.3-70b-versatile" },
  { provider: "openrouter", model: "openai/gpt-4o-mini" },
  { provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct" },
];

function parseJsonObject(text) {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return null;
  }
}

function buildMessages(testCase) {
  return [
    {
      role: "system",
      content: [
        "You grade short study answers for semantic correctness.",
        "Return JSON only:",
        '{"is_correct":boolean,"confidence":number,"reason":string}',
        "Accept paraphrases and synonyms when the meaning is equivalent.",
        "Reject answers with wrong concepts.",
      ].join("\n"),
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          question: testCase.question,
          canonical_answer: testCase.canonical,
          user_answer: testCase.user,
        },
        null,
        2,
      ),
    },
  ];
}

async function runCase(provider, model, testCase) {
  const start = Date.now();
  try {
    if (provider === "groq") {
      if (!GROQ_KEY) return { ok: false, error: "missing_key", latency: 0 };
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          response_format: { type: "json_object" },
          messages: buildMessages(testCase),
        }),
      });
      if (!res.ok) {
        return { ok: false, error: `http_${res.status}`, latency: Date.now() - start };
      }
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content ?? "";
      const parsed = parseJsonObject(content);
      if (!parsed || typeof parsed.is_correct !== "boolean") {
        return { ok: false, error: "parse_error", latency: Date.now() - start };
      }
      return {
        ok: true,
        isCorrect: parsed.is_correct,
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
        latency: Date.now() - start,
      };
    }

    if (!OPENROUTER_KEY) return { ok: false, error: "missing_key", latency: 0 };
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: buildMessages(testCase),
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `http_${res.status}`, latency: Date.now() - start };
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = parseJsonObject(content);
    if (!parsed || typeof parsed.is_correct !== "boolean") {
      return { ok: false, error: "parse_error", latency: Date.now() - start };
    }
    return {
      ok: true,
      isCorrect: parsed.is_correct,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
      latency: Date.now() - start,
    };
  } catch {
    return { ok: false, error: "network_error", latency: Date.now() - start };
  }
}

async function runCombo(combo) {
  const rows = [];
  for (const testCase of CASES) {
    const result = await runCase(combo.provider, combo.model, testCase);
    rows.push({ testCase, result });
  }

  const successful = rows.filter((row) => row.result.ok);
  const failures = rows.length - successful.length;
  const correct = successful.filter((row) => row.result.isCorrect === row.testCase.expected).length;
  const accuracy = successful.length > 0 ? correct / successful.length : 0;
  const avgLatency = successful.length > 0
    ? successful.reduce((sum, row) => sum + row.result.latency, 0) / successful.length
    : 0;

  return {
    ...combo,
    total: rows.length,
    successful: successful.length,
    failures,
    accuracy,
    avgLatencyMs: avgLatency,
  };
}

function score(comboResult) {
  return (comboResult.accuracy * 100) - (comboResult.avgLatencyMs / 1000) * 8 - (comboResult.failures * 3);
}

async function main() {
  const results = [];
  for (const combo of COMBOS) {
    const result = await runCombo(combo);
    results.push(result);
  }

  const ranked = [...results].sort((a, b) => score(b) - score(a));

  console.log(JSON.stringify({ results, ranked }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
