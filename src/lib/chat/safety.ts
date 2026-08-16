const MEDICAL =
  /\b(diagnos(?:is|e|ed)?|prescri(?:be|ption)|medication|dosage|symptom|treat(?:ment|ing)?|lab results?|blood test|mri|x-ray|pathology)\b/i;
const PHI =
  /\b(ssn|social security|date of birth|\bdob\b|medical record|\bmrn\b|patient (?:named|name is)|protected health|phi)\b/i;
const GUARANTEE =
  /\b(guarantee|guaranteed|promise(?:d)? (?:results?|roi|conversion)|will (?:definitely|certainly) (?:increase|reduce|lower))\b/i;

export function classifyRisk(text: string): "medical" | "phi" | "guarantee" | null {
  if (PHI.test(text)) return "phi";
  if (MEDICAL.test(text)) return "medical";
  if (GUARANTEE.test(text)) return "guarantee";
  return null;
}
