import { type AttemptEvaluation } from "@/lib/domain/types";
import {
  damerauLevenshtein,
  normalizeForCompare,
  similarityScore,
  stripDiacritics,
  toGraphemes,
} from "@/lib/domain/normalize";

const MIN_SIMILARITY = 0.88;

function typoThreshold(graphemeLength: number): number {
  if (graphemeLength <= 6) {
    return 1;
  }

  if (graphemeLength <= 12) {
    return 2;
  }

  return 3;
}

export function evaluateAnswer(answer: string, canonical: string): AttemptEvaluation {
  const normalizedAnswer = normalizeForCompare(answer);
  const normalizedCanonical = normalizeForCompare(canonical);

  if (normalizedAnswer === normalizedCanonical) {
    return {
      outcome: "exact",
      normalizedAnswer,
      normalizedCanonical,
      editDistance: 0,
      similarity: 1,
    };
  }

  const answerBase = stripDiacritics(normalizedAnswer);
  const canonicalBase = stripDiacritics(normalizedCanonical);

  if (answerBase === canonicalBase) {
    return {
      outcome: "accent_near",
      normalizedAnswer,
      normalizedCanonical,
      editDistance: 1,
      similarity: 0.99,
    };
  }

  const answerGraphemes = toGraphemes(normalizedAnswer);
  const canonicalGraphemes = toGraphemes(normalizedCanonical);
  const distance = damerauLevenshtein(answerGraphemes, canonicalGraphemes);
  const maxLength = Math.max(answerGraphemes.length, canonicalGraphemes.length);
  const similarity = similarityScore(distance, maxLength);

  if (distance <= typoThreshold(canonicalGraphemes.length) && similarity >= MIN_SIMILARITY) {
    return {
      outcome: "typo_near",
      normalizedAnswer,
      normalizedCanonical,
      editDistance: distance,
      similarity,
    };
  }

  return {
    outcome: "incorrect",
    normalizedAnswer,
    normalizedCanonical,
    editDistance: distance,
    similarity,
  };
}

export function isCorrectOutcome(outcome: AttemptEvaluation["outcome"]): boolean {
  return outcome === "exact" || outcome === "accent_near" || outcome === "correct_after_retry";
}
