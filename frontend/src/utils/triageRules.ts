import type {
  TriageInput,
  TriageResult,
} from '../types/triage'

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function hasSymptom(
  symptoms: string[],
  keywords: string[],
): boolean {
  return symptoms.some((symptom) => {
    const normalized = normalize(symptom)

    return keywords.some((keyword) =>
      normalized.includes(keyword),
    )
  })
}

export function calculateTriage(
  input: TriageInput,
): TriageResult {
  const symptoms = input.symptoms ?? []

  const trustScore = input.rppg?.trustScore

  /*
   * An rPPG measurement is considered usable only when
   * its confidence is adequate.
   *
   * A low TrustScore means the measurement should be
   * retaken or manually verified. It does NOT mean
   * that the patient is medically low-risk.
   */
  const rppgIsUsable =
    Boolean(input.rppg?.measurementAvailable) &&
    (
      typeof trustScore !== 'number' ||
      trustScore >= 70
    )

  const usedData = {
    symptoms: symptoms.length > 0,
    manualVitals: Boolean(input.manualVitals),
    rppg: rppgIsUsable,
    baseline: Boolean(input.baseline),
  }

  /*
   * ==========================================
   * 1. URGENT INDICATORS
   * ==========================================
   */

  const chestConcern = hasSymptom(symptoms, [
    'chest discomfort',
    'chest pain',
    'chest pressure',
  ])

  const breathingConcern = hasSymptom(symptoms, [
    'breathing difficulty',
    'difficulty breathing',
    'shortness of breath',
  ])

  if (chestConcern || breathingConcern) {
    const reasons: string[] = []

    if (chestConcern) {
      reasons.push(
        'Chest discomfort or pain was reported.',
      )
    }

    if (breathingConcern) {
      reasons.push(
        'Breathing difficulty was reported.',
      )
    }

    return {
      category: 'urgent',

      reasons,

      measurementAction: 'none',

      requiresProfessionalReview: true,

      usedData,
    }
  }

  /*
   * ==========================================
   * 2. CONSULT INDICATORS
   * ==========================================
   */

  const feverReported = hasSymptom(symptoms, [
    'fever',
  ])

  /*
   * Manual pulse has priority.
   *
   * rPPG pulse is used only when the rPPG
   * measurement has sufficient confidence.
   */
  const manualPulse =
    input.manualVitals?.pulse

  const rppgPulse =
    rppgIsUsable
      ? input.rppg?.heartRate
      : undefined

  const pulse =
    typeof manualPulse === 'number' &&
    manualPulse > 0
      ? manualPulse
      : rppgPulse

  const elevatedPulse =
    typeof pulse === 'number' &&
    pulse > 100

  if (
    feverReported &&
    elevatedPulse
  ) {
    return {
      category: 'consult',

      reasons: [
        'Fever was reported.',
        `Pulse is elevated (${Math.round(
          pulse,
        )} bpm).`,
      ],

      measurementAction: 'none',

      requiresProfessionalReview: true,

      usedData,
    }
  }

  /*
   * ==========================================
   * 3. LOW rPPG CONFIDENCE
   * ==========================================
   */

  if (
    input.rppg?.measurementAvailable &&
    typeof trustScore === 'number' &&
    trustScore < 70
  ) {
    return {
      category: 'routine',

      reasons: [
        'The camera screening confidence is currently low.',
      ],

      measurementAction: 'retake-rppg',

      requiresProfessionalReview: false,

      usedData,
    }
  }

  /*
   * ==========================================
   * 4. ROUTINE
   * ==========================================
   */

  return {
    category: 'routine',

    reasons: [
      'No urgent indicator was identified from the available information.',
      'No current consult indicator was identified.',
    ],

    measurementAction: 'none',

    requiresProfessionalReview: false,

    usedData,
  }
}