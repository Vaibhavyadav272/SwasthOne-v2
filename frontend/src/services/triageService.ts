import type {
  TriageInput,
  TriageResult,
} from '../types/triage'

import { calculateTriage } from '../utils/triageRules'

export function runTriage(
  input: TriageInput,
): TriageResult {
  /*
   * Current prototype:
   * local rule-based triage.
   *
   * Later this function can call the backend
   * without requiring a redesign of Triage.tsx.
   */

  return calculateTriage(input)
}