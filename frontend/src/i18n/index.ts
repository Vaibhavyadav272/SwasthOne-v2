import { useSyncExternalStore } from 'react'

export type Language = 'en' | 'hi' | 'mr'

export const languages: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
}

const translations = {
  /* =====================================================
     ENGLISH
     ===================================================== */

  en: {
    dashboard: {
      greeting: 'Good evening',

      overview: "Today's healthcare overview",

      headline: 'Making every screening count.',

      description:
        'Continue patient screening, track referrals and keep healthcare records connected.',

      startScreening: 'Start screening',

      patientsToday: 'Patients today',

      screenings: 'Screenings',

      followUps: 'Follow-ups',

      fromYesterday: '+4 from yesterday',

      completed: '75% completed',

      dueToday: '2 due today',

      patientWorkflow: 'PATIENT WORKFLOW',

      quickActions: 'Quick actions',

      registerPatient: 'Register patient',

      registerDescription:
        'Create a new patient profile',

      continueScreening: 'Continue screening',

      continueDescription:
        'Symptoms → rPPG → TrustScore',

      viewReferrals: 'View referrals',

      referralDescription:
        'Track patients needing care',

      recentActivity: 'RECENT ACTIVITY',

      screeningStatus: 'Screening status',

      viewAll: 'View all',

      routine: 'Routine',

      consult: 'Consult',

      urgent: 'Urgent',

      trustTitle:
        'Screening confidence matters',

      trustDescription:
        'Low-confidence readings should be retaken or verified manually.',
    },

    screening: {
      eyebrow: 'Patient screening',

      title:
        "Let's understand how you are feeling.",

      description:
        'Tell us about your symptoms. This information will help guide the next screening step.',

      registration: 'Registration',

      symptomsStep: 'Symptoms',

      rppg: 'rPPG',

      triage: 'Triage',

      screeningFor: 'Screening for',

      age: 'Age',

      village: 'Village',

      symptomsTitle:
        'What symptoms are you experiencing?',

      selectAll:
        'Select all that apply.',

      moreTitle:
        'Tell us a little more',

      optional:
        'These details are optional.',

      duration:
        'How long have you had these symptoms?',

      selectDuration:
        'Select duration',

      today: 'Today',

      days23: '2–3 days',

      days47: '4–7 days',

      moreWeek:
        'More than a week',

      severity:
        'How severe do they feel?',

      selectSeverity:
        'Select severity',

      mild: 'Mild',

      moderate: 'Moderate',

      severe: 'Severe',

      measurementsTitle:
        'Do you have measurements from a healthcare worker?',

      measurementsOptional:
        'This step is optional.',

      noMeasurements:
        'No measurements available',

      noMeasurementsDescription:
        'Continue directly to camera-based screening.',

      yesMeasurements:
        'Yes, I have measurements',

      yesMeasurementsDescription:
        'Enter readings recorded by a healthcare worker.',

      recordedMeasurements:
        'Recorded measurements',

      recordedDescription:
        'Enter only measurements that are actually available.',

      bloodPressure:
        'Blood pressure',

      pulse: 'Pulse',

      temperature:
        'Temperature',

      oxygen: 'SpO₂',

      continueNote:
        'You can continue even if you do not have manual measurements.',

      continueScreening:
        'Continue to screening',
    },

    common: {
      back: 'Back',

      english: 'English',

      hindi: 'हिन्दी',

      marathi: 'मराठी',
    },
    triage: {
      eyebrow: 'Digital triage',

      title: 'Understanding the next step for this patient.',

      description:
        'SwasthOne combines symptoms, available measurements and screening information to support the next care decision.',

      recommendation: 'TRIAGE RECOMMENDATION',

      routineTitle: 'Routine care',

      routineDescription:
        'No immediate high-risk indicator was identified from the available information.',

      routineAction:
        'Continue routine care and follow-up.',

      consultTitle: 'Doctor consultation recommended',

      consultDescription:
        'The available information suggests that a healthcare professional should review the patient.',

      consultAction:
        'Request a doctor consultation.',

      urgentTitle: 'Urgent medical review recommended',

      urgentDescription:
        'The available information contains an indicator that requires prompt professional assessment.',

      urgentAction:
        'Seek prompt medical attention.',

      nextStep: 'Recommended next step',

      symptomSummary: 'Symptoms considered',

      noSymptoms: 'No symptoms recorded.',

      screeningConfidence: 'Screening confidence',

      highConfidence:
        'The screening signal passed the current confidence check.',

      lowConfidence:
        'The screening signal has low confidence and should be verified.',

      decisionSupport: 'Decision support only',

      decisionSupportText:
        'This recommendation is not a diagnosis or prescription. A qualified healthcare professional should make the final clinical decision.',

      footerNote:
        'Triage uses the information currently available in the patient record.',

      prototypeNote:
        'Prototype rule engine: the final triage result will be supplied by the dedicated triage service and can use symptoms, age, history, rPPG results and manual vitals.',
    },

    referral: {
      eyebrow: 'Referral management',
      title: 'Connect this patient to the right care.',
      description:
        'Choose an appropriate facility and create a referral that can be tracked through the care journey.',

      triage: 'Triage',
      facility: 'Facility',
      referral: 'Referral',
      followUp: 'Follow-up',

      triageResult: 'TRIAGE RESULT',
      urgent: 'Urgent review',
      consult: 'Consult recommended',
      routine: 'Routine care',

      triageSummary:
        'The referral recommendation is based on the information currently available in the patient record.',

      chooseFacility: 'Choose a healthcare facility',
      facilityDemo:
        'Facility availability shown here is demonstration data.',
      recommended: 'Recommended',

      referralDetails: 'Referral details',
      preferredDate: 'Preferred date',
      reason: 'Reason',
      urgentReview: 'Prompt professional review',
      clinicalReview: 'Clinical review',

      safetyTitle: 'Clinical decision remains with healthcare professionals',
      safetyText:
        'SwasthOne supports referral coordination. It does not independently diagnose or decide treatment.',

      footerNote:
        'The referral will be recorded in the patient journey.',
      createReferral: 'Create referral',

      prototypeNote:
        'Prototype facility data is simulated. Live PHC, appointment and government-system availability will require verified APIs and authorization.',

      trackingEyebrow: 'Referral tracking',
      trackingTitle: 'Keep the referral journey visible.',
      trackingDescription:
        'Track whether the patient has been accepted, consulted and connected to follow-up care.',

      currentStatus: 'CURRENT STATUS',
      sent: 'Referral sent',
      statusDescription:
        'The referral has been created and sent to the selected facility.',

      created: 'Created',
      createdDescription:
        'Referral created from the patient screening workflow.',

      sentDescription:
        'Referral sent to the selected healthcare facility.',

      accepted: 'Accepted',
      acceptedDescription:
        'Receiving facility confirms that the referral has been accepted.',

      appointment: 'Appointment',
      appointmentDescription:
        'An appointment or consultation slot is arranged.',

      consulted: 'Consulted',
      consultedDescription:
        'Patient completes the consultation with a healthcare professional.',

      followUpDescription:
        'Follow-up is recorded and the patient record is updated.',

      lifecycle: 'Referral lifecycle',

      continuityTitle: 'Continuity of care',
      continuityText:
        'Once the referral is completed, consultation and follow-up information can be added to the patient longitudinal record.',

      trackingSafetyTitle:
        'Referral tracking is about continuity, not just sending a referral.',

      trackingSafetyText:
        'The goal is to reduce referral drop-off and keep the patient journey connected.',

      trackingPrototypeNote:
        'Prototype status is simulated for demonstration. A production system would update these stages through authorized facility workflows and backend events.',
    },
    record: {
      eyebrow: 'Longitudinal health record',
      title: 'Keep the patient journey connected.',
      description:
        'View screening, triage, referral and follow-up information together in one patient record.',

      latestScreening: 'Latest screening',
      trustScore: 'Screening confidence',
      careStatus: 'Care status',
      activeRecord: 'Active record',
      viewProfile: 'View profile',
      today: 'Today',
      referralSent: 'Referral sent',
      date: 'Date',
      status: 'Status',
      completed: 'Completed',
      previousScreening: 'Previous screening',
      noPreviousRecord: 'No previous screening record available.', 

      careJourney: 'CARE JOURNEY',
      journeyTitle: 'Patient care timeline',

      registered: 'Patient registered',
      registeredDescription:
        'Basic patient profile and consent recorded.',

      screening: 'Symptoms and screening',
      screeningDescription:
        'Symptoms and available measurements were captured.',

      trustScoreEvent: 'TrustScore completed',
      trustScoreDescription:
        'Camera screening passed the current signal-confidence check.',

      triage: 'Digital triage',
      triageDescription:
        'Screening information was used to support the next care decision.',

      referralEvent: 'Referral created',
      referralDescription:
        'Referral sent to the selected healthcare facility.',

      followUpEvent: 'Follow-up',
      followUpDescription:
        'Follow-up will be recorded after the referral journey.',

      history: 'SCREENING HISTORY',
      historyTitle: 'Previous screening records',
      viewAll: 'View all',

      nextCare: 'NEXT CARE STEP',
      followUpTitle: 'Schedule patient follow-up',
      followUpText:
        'Keep the patient connected after referral and continue updating the longitudinal record.',

      scheduleFollowUp: 'Schedule follow-up',

      disclaimer:
        'The longitudinal record stores screening and care information. It does not replace the clinical record maintained by qualified healthcare professionals.',

      prototypeNote:
        'Prototype record data is currently local frontend data. The production version will load and update longitudinal records through the backend database.',
    },
    followUp: {
      eyebrow: 'Follow-up care',
      title: 'Keep the next step from getting missed.',
      description:
        'Schedule follow-up and choose how the patient or healthcare worker should be reminded.',

      patient: 'PATIENT',

      scheduleTitle: 'Choose follow-up timing',

      reminderTitle: 'Choose reminder method',

      smsReminder: 'Patient reminder',
      callReminder: 'Phone call',
      callDescription:
        'Healthcare worker can call the patient.',

      ashaReminder: 'ASHA follow-up',
      ashaDescription:
        'ASHA can be reminded to follow up with the patient.',

      purposeTitle: 'Why follow-up matters',
      purposeText:
        'Follow-up helps reduce loss after referral and keeps screening, consultation and care information connected.',

      footerNote:
        'The follow-up event will be added to the patient care journey.',

      confirm: 'Confirm follow-up',
      tomorrow: 'Tomorrow',
      recommendedFollowUp: 'Recommended follow-up',
      in3Days: 'In 3 days',
      standardFollowUp: 'Standard follow-up',
      in7Days: 'In 7 days',
      laterFollowUp: 'Later follow-up',

      prototypeNote:
        'Prototype reminder scheduling is local to the frontend. Production reminders will use authorized backend workflows and notification services.',
    },
    roleDashboard: {
      ashaDashboard: 'ASHA Dashboard',
      patientHealth: 'My Health',
      doctorDashboard: 'Doctor Dashboard',

      goodEvening: 'Good evening',
      welcomeBack: 'Welcome back',

      fieldWorkflow: "Today's field workflow",
      healthcareJourney: 'Your healthcare journey',
      clinicalWorkspace: "Today's clinical workspace",

      ashaHeadline: 'Keep patient care connected.',
      patientHeadline: 'Stay connected to your care.',
      doctorHeadline: 'Review patients and guide the next step.',

      ashaDescription:
        'Register patients, complete screening and track referrals from one place.',
      patientDescription:
        'Start a screening, view your health record and keep track of follow-ups.',
      doctorDescription:
        'Review screening information, triage results and referral needs.',

      reviewPatients: 'Review patients',
      startScreening: 'Start screening',

      patientsToday: 'Patients today',
      screenings: 'Screenings',
      followUps: 'Follow-ups',

      fromYesterday: '+4 from yesterday',
      completed: '75% completed',
      dueToday: '2 due today',

      patientWorkflow: 'Patient workflow',
      quickActions: 'Quick actions',

      registerPatient: 'Register patient',
      registerDescription: 'Create a new patient profile',

      continueScreening: 'Continue screening',
      continueDescription: 'Symptoms → rPPG → TrustScore',

      viewReferrals: 'View referrals',
      referralDescription: 'Track patients needing care',

      recentActivity: 'Recent activity',
      patientsAttention: 'Patients needing attention',

      latestTrustScore: 'Latest TrustScore',
      screeningConfidence: 'Screening confidence',
      healthRecords: 'Health records',
      availableRecords: 'Available records',
      nextFollowUp: 'Next follow-up',
      recommended: 'Recommended',

      myHealthcare: 'My healthcare',
      whatToDo: 'What would you like to do?',

      startScreeningDescription:
        'Check symptoms and begin screening',

      healthRecordsDescription:
        'View your screening and care history',

      myReferrals: 'My referrals',
      myReferralsDescription:
        'Track your current referral',

      nextStep: 'Next step',
      followUpCare: 'Follow-up care',
      followUpTomorrow: 'Follow-up tomorrow',

      followUpDescription:
        'Your next recommended care step is scheduled for tomorrow.',

      healthConnectedTitle:
        'Your health information stays connected',

      healthConnectedDescription:
        'Screening, referrals and follow-up information can be kept together in your care journey.',

      patientsAwaitingReview: 'Patients awaiting review',
      urgentCases: 'Urgent cases',
      todaysConsultations: "Today's consultations",

      needsClinicalReview: 'Needs clinical review',
      requiresAttention: 'Requires attention',
      scheduledToday: 'Scheduled today',

      clinicalReview: 'Clinical review',
      pending: 'pending',

      recentlyScreened: 'Recently screened',
      urgent: 'Urgent',
      consult: 'Consult',
      routine: 'Routine',

      reviewSafetyTitle:
        'Review screening information before clinical decisions',

      reviewSafetyDescription:
        'rPPG, TrustScore and triage are screening-support information and should not replace professional clinical judgment.',

      online: 'Online',
      offlineMode: 'Offline mode',
      allSynced: 'All records are synced',

      pendingSync: 'record(s) waiting to sync',

      offlineDescription:
        'Data will be saved locally and synced when connectivity returns.',
    },
        registration: {
      eyebrow: 'Patient registration',
      title: 'Create a patient profile',
      description:
        'Enter the basic details needed to create the patient record.',

      fullName: 'Full name',
      age: 'Age',
      gender: 'Gender',
      phone: 'Phone number',
      village: 'Village',
      emergencyContact: 'Emergency contact',

      patientWorkflow: 'Patient workflow',
      basicInformation: 'Basic information',
      basicInformationDescription:
        "Enter the patient's basic identifying details.",
      contactLocation: 'Contact & location',
      contactLocationDescription:
        'Useful for continuity and follow-up.',
      backToDashboard: 'Back to dashboard',
      cancel: 'Cancel',
      preferNotToSay: 'Prefer not to say',
      fullNamePlaceholder: "Enter patient's full name",
      agePlaceholder: 'e.g. 42',
      phonePlaceholder: '10-digit mobile number',
      villagePlaceholder: 'Enter village or locality',
      emergencyPlaceholder: 'Emergency contact number',
      selectGender: 'Select gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',

      consentTitle: 'Patient consent',
      consentText:
        'I consent to my health information being recorded and used for screening and care coordination.',

      continue: 'Continue',
      required: 'This field is required',
    },

    // profile: {
    //   eyebrow: 'Patient profile',
    //   title: 'Patient profile',
    //   patientInformation: 'Patient information',

    //   name: 'Name',
    //   age: 'Age',
    //   gender: 'Gender',
    //   phone: 'Phone',
    //   village: 'Village',
    //   emergencyContact: 'Emergency contact',

    //   nextStep: 'Next step',
    //   nextStepTitle: 'Begin health screening',
    //   nextStepDescription:
    //     'Continue with symptoms, available measurements and camera-based screening.',

    //   continueScreening: 'Continue to screening',
    // },

    rppg: {
      eyebrow: 'Camera screening',
      title: 'Camera-based health screening',
      description:
        'Keep your face inside the frame and stay still while the camera captures the screening signal.',

      registration: 'Registration',
      symptoms: 'Symptoms',
      rppg: 'rPPG',
      triage: 'Triage',

      cameraTitle: 'Position your face in the frame',
      cameraDescription:
        'Make sure your face is clearly visible and the lighting is adequate.',

      start: 'Start screening',
      stop: 'Stop screening',
      preparing: 'Preparing camera...',
      processing: 'Processing screening...',

      seconds: 'seconds',

      safetyTitle: 'Screening support only',
      safetyText:
        'Camera-based screening provides supportive health information. It does not replace clinical measurements or professional medical judgment.',

      cameraPermission:
        'Camera permission is required to continue.',
      positionFace: 'Position your face inside the frame',
      cameraReady: 'Camera ready',
      cameraNotStarted: 'Camera not started',
      secondsShort: 's',
      stayStill: 'Stay still and keep your face inside the frame',
      recordingComplete: 'Recording complete',
      signalCaptured:
        'Your signal has been captured for quality analysis.',
      cameraScreening: 'Camera screening',
      cameraAccessDescription:
        'Camera access is needed for the 30-second facial signal recording.',
      requestingCamera: 'Requesting camera access…',
      enableCamera: 'Enable camera',
      secondsRemaining: 'seconds remaining',
      measurementCaptured: 'Measurement captured',
      qualityAnalysisNext:
        'Next, we will check whether the signal is reliable enough to use.',
      betterReading: 'For a better reading',
      tipFaceCamera: 'Face the camera directly.',
      tipKeepStill: 'Keep your head as still as possible.',
      tipLighting: 'Use a well-lit environment.',
      tipFaceVisible: 'Keep your whole face visible.',
      whyQualityMatters: 'Why signal quality matters',
      qualityDescription:
        'Camera-based measurements can be affected by movement, lighting and signal quality. SwasthOne checks measurement confidence before using the result.',
      whatNext: 'What happens next?',
      stepCapture: 'Capture facial signal',
      stepQuality: 'Check signal quality',
      stepTrustScore: 'Calculate TrustScore',
      recordingNote:
        'Your camera recording is used for this screening step.',
      checkTrustScore: 'Check TrustScore',
      prototypeNote:
        'Frontend capture is ready. The real rPPG signal-processing service will provide HR, HRV, respiratory-rate information and TrustScore in the integration step.',
    },

    trustScore: {
      eyebrow: 'Screening confidence',
      title: 'How reliable is this screening?',
      description:
        'TrustScore indicates the confidence of the available screening signal. It is not a diagnosis.',

      trustScore: 'TrustScore',
      processingTime: 'Processing time',
      qualityFactors: 'Quality factors',

      heartRate: 'Heart rate',
      heartRateVariability: 'Heart rate variability',
      respiratoryRate: 'Respiratory rate',

      awaitingAnalysis: 'Awaiting analysis',
      good: 'Good',
      moderate: 'Moderate',
      low: 'Low',

      retake: 'Retake screening',
      continueTriage: 'Continue to triage',

      safetyTitle: 'Important',
      safetyText:
        'A low-confidence result should be retaken or verified using appropriate manual measurements. TrustScore does not diagnose a medical condition.',
      
      prototypeNote:
        'Prototype values are currently simulated. Production values will come from the dedicated rPPG and TrustScore service.',
      processing: 'Analyzing signal quality...',
      faceStability: 'Face stability',
      measurementConsistency: 'Measurement consistency',
      measurementQuality: 'Measurement quality',
      goodDescription:
        'The captured signal passed the current quality checks and can continue to the screening workflow.',
      lowDescription:
        'The signal quality is not strong enough to confidently use this reading.',
      signalQuality: 'Signal quality',
      movement: 'Movement',
      lighting: 'Lighting',
      stable: 'Stable',
      screeningInformation: 'Screening information',
      clinicalConfirmation: 'Subject to clinical confirmation',
      confidencePassed: 'Confidence check passed',
      confidencePassedDescription:
        'The TrustScore indicates that this capture has sufficient signal quality for screening support. Any concerning result should still be confirmed using clinically validated measurements.',
      retakeDescription:
        'Movement, lighting or signal quality may have affected this capture. Retake the measurement or use manual measurements from a healthcare worker.',
    },

    referralTracking: {
      eyebrow: 'Referral tracking',
      title: 'Keep the referral journey visible.',
      description:
        'Track whether the patient has been accepted, consulted and connected to follow-up care.',

      currentStatus: 'Current status',
      sent: 'Referral sent',
      pending: 'Pending acceptance',

      created: 'Created',
      accepted: 'Accepted',
      appointment: 'Appointment',
      consulted: 'Consulted',
      followUp: 'Follow-up',

      createdDescription:
        'Referral created from the patient screening workflow.',
      sentDescription:
        'Referral sent to the selected healthcare facility.',
      acceptedDescription:
        'Receiving facility confirms that the referral has been accepted.',
      appointmentDescription:
        'An appointment or consultation slot is arranged.',
      consultedDescription:
        'Patient completes the consultation with a healthcare professional.',
      followUpDescription:
        'Follow-up is recorded and the patient record is updated.',

      lifecycle: 'Referral lifecycle',
      facility: 'Facility',
      status: 'Status',

      backToRecord: 'Back to health record',

      safetyTitle: 'Continuity of care',
      safetyText:
        'Referral tracking helps keep the patient journey connected after a referral is created.',

      prototypeNote:
        'Prototype status is simulated. Production status updates will come from authorized backend and facility workflows.',
    },

    profile: {
      notFound: 'Patient not found',
      registerFirst: 'Please register a patient first.',
      registerPatient: 'Register patient',
      backToRegistration: 'Back to registration',
      registrationSuccess:
        'Patient registration completed successfully.',
      registered: 'Registered',
      ageGender: 'Age & gender',
      years: 'years',
      mobile: 'Mobile',
      notProvided: 'Not provided',
      location: 'Location',
      registration: 'Registration',
      today: 'Today',
      nextStep: 'Next step',
      startHealthScreening: 'Start health screening',
      screeningDescription:
        'Record symptoms and basic vitals before the screening assessment.',
      continue: 'Continue',
      safetyNote:
        'Patient information should only be accessed by authorized healthcare personnel.',
    },

  },

  /* =====================================================
     HINDI
     ===================================================== */

  hi: {
    dashboard: {
      greeting: 'शुभ संध्या',

      overview:
        'आज की स्वास्थ्य सेवा का अवलोकन',

      headline:
        'हर जाँच को महत्वपूर्ण बनाएं।',

      description:
        'रोगी की जाँच जारी रखें, रेफरल ट्रैक करें और स्वास्थ्य रिकॉर्ड को जोड़े रखें।',

      startScreening:
        'जाँच शुरू करें',

      patientsToday:
        'आज के रोगी',

      screenings:
        'जाँच',

      followUps:
        'फॉलो-अप',

      fromYesterday:
        'कल से +4',

      completed:
        '75% पूर्ण',

      dueToday:
        'आज 2 बाकी',

      patientWorkflow:
        'रोगी कार्यप्रवाह',

      quickActions:
        'त्वरित कार्य',

      registerPatient:
        'रोगी पंजीकृत करें',

      registerDescription:
        'नया रोगी प्रोफ़ाइल बनाएं',

      continueScreening:
        'जाँच जारी रखें',

      continueDescription:
        'लक्षण → rPPG → TrustScore',

      viewReferrals:
        'रेफरल देखें',

      referralDescription:
        'देखभाल की आवश्यकता वाले रोगियों को ट्रैक करें',

      recentActivity:
        'हाल की गतिविधि',

      screeningStatus:
        'जाँच की स्थिति',

      viewAll:
        'सभी देखें',

      routine:
        'सामान्य',

      consult:
        'परामर्श',

      urgent:
        'तत्काल',

      trustTitle:
        'जाँच की विश्वसनीयता महत्वपूर्ण है',

      trustDescription:
        'कम विश्वसनीयता वाली रीडिंग दोबारा ली जानी चाहिए या मैनुअल माप से सत्यापित की जानी चाहिए।',
    },

    screening: {
      eyebrow:
        'रोगी की जाँच',

      title:
        'आइए समझते हैं कि आप कैसा महसूस कर रहे हैं।',

      description:
        'अपने लक्षणों के बारे में बताएं। यह जानकारी अगले जाँच चरण में मदद करेगी।',

      registration:
        'पंजीकरण',

      symptomsStep:
        'लक्षण',

      rppg: 'rPPG',

      triage:
        'ट्रायेज',

      screeningFor:
        'जाँच के लिए',

      age: 'उम्र',

      village:
        'गाँव',

      symptomsTitle:
        'आपको कौन-कौन से लक्षण महसूस हो रहे हैं?',

      selectAll:
        'जो लागू हों उन्हें चुनें।',

      moreTitle:
        'थोड़ी और जानकारी दें',

      optional:
        'ये विवरण वैकल्पिक हैं।',

      duration:
        'आपको ये लक्षण कितने समय से हैं?',

      selectDuration:
        'अवधि चुनें',

      today:
        'आज',

      days23:
        '2–3 दिन',

      days47:
        '4–7 दिन',

      moreWeek:
        'एक सप्ताह से अधिक',

      severity:
        'लक्षण कितने गंभीर महसूस होते हैं?',

      selectSeverity:
        'गंभीरता चुनें',

      mild:
        'हल्के',

      moderate:
        'मध्यम',

      severe:
        'गंभीर',

      measurementsTitle:
        'क्या आपके पास स्वास्थ्यकर्मी द्वारा लिए गए माप हैं?',

      measurementsOptional:
        'यह चरण वैकल्पिक है।',

      noMeasurements:
        'कोई माप उपलब्ध नहीं है',

      noMeasurementsDescription:
        'सीधे कैमरा-आधारित जाँच पर जाएँ।',

      yesMeasurements:
        'हाँ, मेरे पास माप हैं',

      yesMeasurementsDescription:
        'स्वास्थ्यकर्मी द्वारा दर्ज किए गए माप दर्ज करें।',

      recordedMeasurements:
        'दर्ज किए गए माप',

      recordedDescription:
        'केवल उपलब्ध माप ही दर्ज करें।',

      bloodPressure:
        'ब्लड प्रेशर',

      pulse:
        'नाड़ी',

      temperature:
        'तापमान',

      oxygen:
        'SpO₂',

      continueNote:
        'अगर आपके पास मैनुअल माप नहीं हैं, तब भी आप आगे बढ़ सकते हैं।',

      continueScreening:
        'जाँच पर जाएँ',
    },

    common: {
      back:
        'वापस',

      english:
        'English',

      hindi:
        'हिन्दी',

      marathi:
        'मराठी',
    },
    triage: {
      eyebrow: 'डिजिटल ट्रायेज',

      title:
        'इस रोगी के लिए अगले कदम को समझना।',

      description:
        'SwasthOne लक्षणों, उपलब्ध माप और जाँच की जानकारी को मिलाकर अगले उपचार निर्णय में सहायता करता है।',

      recommendation:
        'ट्रायेज सुझाव',

      routineTitle:
        'सामान्य देखभाल',

      routineDescription:
        'उपलब्ध जानकारी के आधार पर तत्काल उच्च जोखिम का संकेत नहीं मिला।',

      routineAction:
        'सामान्य देखभाल और फॉलो-अप जारी रखें।',

      consultTitle:
        'डॉक्टर से परामर्श की सलाह',

      consultDescription:
        'उपलब्ध जानकारी के आधार पर स्वास्थ्यकर्मी द्वारा रोगी की समीक्षा की जानी चाहिए।',

      consultAction:
        'डॉक्टर से परामर्श का अनुरोध करें।',

      urgentTitle:
        'तत्काल चिकित्सकीय जाँच की सलाह',

      urgentDescription:
        'उपलब्ध जानकारी में ऐसा संकेत है जिसके लिए जल्द पेशेवर चिकित्सकीय मूल्यांकन आवश्यक है।',

      urgentAction:
        'जल्द चिकित्सा सहायता लें।',

      nextStep:
        'सुझाया गया अगला कदम',

      symptomSummary:
        'विचार किए गए लक्षण',

      noSymptoms:
        'कोई लक्षण दर्ज नहीं है।',

      screeningConfidence:
        'जाँच की विश्वसनीयता',

      highConfidence:
        'जाँच संकेत ने वर्तमान विश्वसनीयता जाँच पास की है।',

      lowConfidence:
        'जाँच संकेत की विश्वसनीयता कम है और इसे सत्यापित किया जाना चाहिए।',

      decisionSupport:
        'केवल निर्णय सहायता',

      decisionSupportText:
        'यह सुझाव निदान या प्रिस्क्रिप्शन नहीं है। अंतिम चिकित्सकीय निर्णय योग्य स्वास्थ्यकर्मी द्वारा लिया जाना चाहिए।',

      footerNote:
        'ट्रायेज रोगी रिकॉर्ड में वर्तमान में उपलब्ध जानकारी का उपयोग करता है।',

      prototypeNote:
        'प्रोटोटाइप नियम इंजन: अंतिम ट्रायेज परिणाम समर्पित ट्रायेज सेवा द्वारा दिया जाएगा और इसमें लक्षण, उम्र, इतिहास, rPPG परिणाम और मैनुअल माप शामिल हो सकते हैं।',
    },
    roleDashboard: {
      ashaDashboard: 'आशा डैशबोर्ड',
      patientHealth: 'मेरा स्वास्थ्य',
      doctorDashboard: 'डॉक्टर डैशबोर्ड',

      goodEvening: 'शुभ संध्या',
      welcomeBack: 'वापसी पर स्वागत है',

      fieldWorkflow: 'आज का क्षेत्रीय कार्यप्रवाह',
      healthcareJourney: 'आपकी स्वास्थ्य यात्रा',
      clinicalWorkspace: 'आज का चिकित्सकीय कार्यक्षेत्र',

      ashaHeadline: 'रोगी की देखभाल को जोड़े रखें।',
      patientHeadline: 'अपनी देखभाल से जुड़े रहें।',
      doctorHeadline: 'रोगियों की समीक्षा करें और अगले कदम का मार्गदर्शन करें।',

      ashaDescription:
        'एक ही स्थान से रोगियों का पंजीकरण, जाँच और रेफरल ट्रैक करें।',
      patientDescription:
        'जाँच शुरू करें, स्वास्थ्य रिकॉर्ड देखें और फॉलो-अप पर नज़र रखें।',
      doctorDescription:
        'जाँच की जानकारी, ट्रायेज परिणाम और रेफरल की समीक्षा करें।',

      reviewPatients: 'रोगियों की समीक्षा करें',
      startScreening: 'जाँच शुरू करें',

      patientsToday: 'आज के रोगी',
      screenings: 'जाँच',
      followUps: 'फॉलो-अप',

      fromYesterday: 'कल से +4',
      completed: '75% पूर्ण',
      dueToday: 'आज 2 बाकी',

      patientWorkflow: 'रोगी कार्यप्रवाह',
      quickActions: 'त्वरित कार्य',

      registerPatient: 'रोगी पंजीकृत करें',
      registerDescription: 'नया रोगी प्रोफ़ाइल बनाएं',

      continueScreening: 'जाँच जारी रखें',
      continueDescription: 'लक्षण → rPPG → TrustScore',

      viewReferrals: 'रेफरल देखें',
      referralDescription: 'देखभाल की आवश्यकता वाले रोगियों को ट्रैक करें',

      recentActivity: 'हाल की गतिविधि',
      patientsAttention: 'ध्यान देने योग्य रोगी',

      latestTrustScore: 'नवीनतम TrustScore',
      screeningConfidence: 'जाँच की विश्वसनीयता',
      healthRecords: 'स्वास्थ्य रिकॉर्ड',
      availableRecords: 'उपलब्ध रिकॉर्ड',
      nextFollowUp: 'अगला फॉलो-अप',
      recommended: 'अनुशंसित',

      myHealthcare: 'मेरी स्वास्थ्य सेवा',
      whatToDo: 'आप क्या करना चाहते हैं?',

      startScreeningDescription:
        'लक्षण जाँचें और स्क्रीनिंग शुरू करें',

      healthRecordsDescription:
        'अपनी जाँच और स्वास्थ्य इतिहास देखें',

      myReferrals: 'मेरे रेफरल',
      myReferralsDescription:
        'अपने वर्तमान रेफरल को ट्रैक करें',

      nextStep: 'अगला कदम',
      followUpCare: 'फॉलो-अप देखभाल',
      followUpTomorrow: 'कल फॉलो-अप',

      followUpDescription:
        'आपका अगला अनुशंसित देखभाल चरण कल निर्धारित है।',

      healthConnectedTitle:
        'आपकी स्वास्थ्य जानकारी जुड़ी रहती है',

      healthConnectedDescription:
        'जाँच, रेफरल और फॉलो-अप की जानकारी आपकी स्वास्थ्य यात्रा में साथ रखी जा सकती है।',

      patientsAwaitingReview: 'समीक्षा के लिए प्रतीक्षारत रोगी',
      urgentCases: 'तत्काल मामले',
      todaysConsultations: 'आज के परामर्श',

      needsClinicalReview: 'चिकित्सकीय समीक्षा आवश्यक',
      requiresAttention: 'ध्यान आवश्यक',
      scheduledToday: 'आज निर्धारित',

      clinicalReview: 'चिकित्सकीय समीक्षा',
      pending: 'बाकी',

      recentlyScreened: 'हाल ही में जाँच की गई',
      urgent: 'तत्काल',
      consult: 'परामर्श',
      routine: 'सामान्य',

      reviewSafetyTitle:
        'चिकित्सकीय निर्णय से पहले जाँच की जानकारी की समीक्षा करें',

      reviewSafetyDescription:
        'rPPG, TrustScore और ट्रायेज केवल स्क्रीनिंग सहायता की जानकारी हैं और पेशेवर चिकित्सकीय निर्णय का स्थान नहीं लेते।',

      online: 'ऑनलाइन',
      offlineMode: 'ऑफलाइन मोड',
      allSynced: 'सभी रिकॉर्ड सिंक हो गए हैं',

      pendingSync: 'रिकॉर्ड सिंक होने बाकी हैं',

      offlineDescription:
        'डेटा स्थानीय रूप से सहेजा जाएगा और कनेक्टिविटी लौटने पर सिंक किया जाएगा।',
    },
    registration: {
      eyebrow: 'रोगी पंजीकरण',
      title: 'रोगी प्रोफ़ाइल बनाएं',
      description:
        'रोगी रिकॉर्ड बनाने के लिए आवश्यक मूल जानकारी दर्ज करें।',

      fullName: 'पूरा नाम',
      age: 'उम्र',
      gender: 'लिंग',
      phone: 'फ़ोन नंबर',
      village: 'गाँव',
      emergencyContact: 'आपातकालीन संपर्क',

      selectGender: 'लिंग चुनें',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',

      patientWorkflow: 'रोगी कार्यप्रवाह',
      basicInformation: 'मूल जानकारी',
      basicInformationDescription:
        'रोगी की मूल पहचान संबंधी जानकारी दर्ज करें।',
      contactLocation: 'संपर्क और स्थान',
      contactLocationDescription:
        'देखभाल की निरंतरता और फॉलो-अप के लिए उपयोगी।',
      backToDashboard: 'डैशबोर्ड पर वापस जाएँ',
      cancel: 'रद्द करें',
      preferNotToSay: 'बताना नहीं चाहते',
      fullNamePlaceholder: 'रोगी का पूरा नाम दर्ज करें',
      agePlaceholder: 'उदा. 42',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर',
      villagePlaceholder: 'गाँव या स्थान दर्ज करें',
      emergencyPlaceholder: 'आपातकालीन संपर्क नंबर',
      consentTitle: 'रोगी की सहमति',
      consentText:
        'मैं अपनी स्वास्थ्य जानकारी को दर्ज करने और जाँच तथा देखभाल के समन्वय के लिए उपयोग करने की सहमति देता/देती हूँ।',

      continue: 'जारी रखें',
      required: 'यह फ़ील्ड आवश्यक है',
    },

    // profile: {
    //   eyebrow: 'रोगी प्रोफ़ाइल',
    //   title: 'रोगी प्रोफ़ाइल',
    //   patientInformation: 'रोगी की जानकारी',

    //   name: 'नाम',
    //   age: 'उम्र',
    //   gender: 'लिंग',
    //   phone: 'फ़ोन',
    //   village: 'गाँव',
    //   emergencyContact: 'आपातकालीन संपर्क',

    //   nextStep: 'अगला कदम',
    //   nextStepTitle: 'स्वास्थ्य जाँच शुरू करें',
    //   nextStepDescription:
    //     'लक्षणों, उपलब्ध माप और कैमरा-आधारित जाँच के साथ आगे बढ़ें।',

    //   continueScreening: 'जाँच जारी रखें',
    // },

    rppg: {
      eyebrow: 'कैमरा जाँच',
      title: 'कैमरा-आधारित स्वास्थ्य जाँच',
      description:
        'अपना चेहरा फ्रेम के अंदर रखें और कैमरा द्वारा जाँच संकेत रिकॉर्ड किए जाने के दौरान स्थिर रहें।',

      registration: 'पंजीकरण',
      symptoms: 'लक्षण',
      rppg: 'rPPG',
      triage: 'ट्रायेज',

      cameraTitle: 'अपना चेहरा फ्रेम में रखें',
      cameraDescription:
        'सुनिश्चित करें कि आपका चेहरा स्पष्ट दिखाई दे और रोशनी पर्याप्त हो।',

      start: 'जाँच शुरू करें',
      stop: 'जाँच रोकें',
      preparing: 'कैमरा तैयार हो रहा है...',
      processing: 'जाँच की प्रक्रिया चल रही है...',

      seconds: 'सेकंड',

      safetyTitle: 'केवल जाँच सहायता',
      safetyText:
        'कैमरा-आधारित जाँच सहायक स्वास्थ्य जानकारी प्रदान करती है। यह चिकित्सकीय माप या पेशेवर चिकित्सकीय निर्णय का स्थान नहीं लेती।',

      cameraPermission:
        'जारी रखने के लिए कैमरा अनुमति आवश्यक है।',
      positionFace: 'अपना चेहरा फ्रेम के अंदर रखें',
      cameraReady: 'कैमरा तैयार है',
      cameraNotStarted: 'कैमरा शुरू नहीं हुआ है',
      secondsShort: 'सेकंड',
      stayStill: 'स्थिर रहें और अपना चेहरा फ्रेम के अंदर रखें',
      recordingComplete: 'रिकॉर्डिंग पूरी हुई',
      signalCaptured:
        'आपका सिग्नल गुणवत्ता जाँच के लिए कैप्चर कर लिया गया है।',
      cameraScreening: 'कैमरा आधारित जाँच',
      cameraAccessDescription:
        '30 सेकंड की चेहरे की सिग्नल रिकॉर्डिंग के लिए कैमरा एक्सेस आवश्यक है।',
      requestingCamera: 'कैमरा एक्सेस का अनुरोध किया जा रहा है…',
      enableCamera: 'कैमरा सक्षम करें',
      secondsRemaining: 'सेकंड बाकी',
      measurementCaptured: 'माप कैप्चर किया गया',
      qualityAnalysisNext:
        'अब हम जाँचेंगे कि सिग्नल उपयोग के लिए पर्याप्त विश्वसनीय है या नहीं।',
      betterReading: 'बेहतर रीडिंग के लिए',
      tipFaceCamera: 'सीधे कैमरे की ओर देखें।',
      tipKeepStill: 'अपने सिर को यथासंभव स्थिर रखें।',
      tipLighting: 'अच्छी रोशनी वाले स्थान का उपयोग करें।',
      tipFaceVisible: 'अपना पूरा चेहरा दिखाई देने दें।',
      whyQualityMatters: 'सिग्नल की गुणवत्ता क्यों महत्वपूर्ण है',
      qualityDescription:
        'कैमरा आधारित माप गति, रोशनी और सिग्नल की गुणवत्ता से प्रभावित हो सकते हैं। SwasthOne परिणाम का उपयोग करने से पहले माप की विश्वसनीयता जाँचता है।',
      whatNext: 'आगे क्या होगा?',
      stepCapture: 'चेहरे का सिग्नल कैप्चर करें',
      stepQuality: 'सिग्नल की गुणवत्ता जाँचें',
      stepTrustScore: 'TrustScore की गणना करें',
      recordingNote:
        'इस जाँच चरण के लिए आपकी कैमरा रिकॉर्डिंग का उपयोग किया जाता है।',
      checkTrustScore: 'TrustScore जाँचें',
      prototypeNote:
        'फ्रंटएंड कैप्चर तैयार है। वास्तविक rPPG सिग्नल-प्रोसेसिंग सेवा इंटीग्रेशन चरण में HR, HRV, श्वसन दर और TrustScore उपलब्ध कराएगी।',
    },

    trustScore: {
      eyebrow: 'जाँच की विश्वसनीयता',
      title: 'यह जाँच कितनी विश्वसनीय है?',
      description:
        'TrustScore उपलब्ध जाँच संकेत की विश्वसनीयता दर्शाता है। यह निदान नहीं है।',

      trustScore: 'TrustScore',
      processingTime: 'प्रोसेसिंग समय',
      qualityFactors: 'गुणवत्ता कारक',

      heartRate: 'हृदय गति',
      heartRateVariability: 'हृदय गति परिवर्तनशीलता',
      respiratoryRate: 'श्वसन दर',

      awaitingAnalysis: 'विश्लेषण की प्रतीक्षा',

      good: 'अच्छा',
      moderate: 'मध्यम',
      low: 'कम',

      retake: 'जाँच दोबारा करें',
      continueTriage: 'ट्रायेज पर जाएँ',

      safetyTitle: 'महत्वपूर्ण',
      safetyText:
        'कम विश्वसनीयता वाले परिणाम को दोबारा लिया जाना चाहिए या उचित मैनुअल माप से सत्यापित किया जाना चाहिए। TrustScore किसी चिकित्सकीय स्थिति का निदान नहीं करता।',

      prototypeNote:
        'प्रोटोटाइप मान वर्तमान में सिम्युलेटेड हैं। वास्तविक सिस्टम में मान समर्पित rPPG और TrustScore सेवा से प्राप्त होंगे।',
      processing: 'सिग्नल की गुणवत्ता का विश्लेषण किया जा रहा है...',
      faceStability: 'चेहरे की स्थिरता',
      measurementConsistency: 'माप की स्थिरता',
      measurementQuality: 'माप की गुणवत्ता',
      goodDescription:
        'कैप्चर किया गया सिग्नल वर्तमान गुणवत्ता जाँच में सफल रहा है और जाँच प्रक्रिया में आगे बढ़ सकता है।',
      lowDescription:
        'सिग्नल की गुणवत्ता इस रीडिंग को विश्वसनीय रूप से उपयोग करने के लिए पर्याप्त नहीं है।',
      signalQuality: 'सिग्नल की गुणवत्ता',
      movement: 'हलचल',
      lighting: 'रोशनी',
      stable: 'स्थिर',
      screeningInformation: 'जाँच की जानकारी',
      clinicalConfirmation: 'चिकित्सकीय पुष्टि आवश्यक',
      confidencePassed: 'विश्वसनीयता जाँच सफल',
      confidencePassedDescription:
        'TrustScore बताता है कि इस कैप्चर की सिग्नल गुणवत्ता स्क्रीनिंग सहायता के लिए पर्याप्त है। किसी भी चिंताजनक परिणाम की पुष्टि मान्य चिकित्सकीय माप से की जानी चाहिए।',
      retakeDescription:
        'हलचल, रोशनी या सिग्नल की गुणवत्ता ने इस कैप्चर को प्रभावित किया हो सकता है। माप दोबारा लें या स्वास्थ्यकर्मी द्वारा लिए गए मैनुअल माप का उपयोग करें।',
    },

    referral: {
      eyebrow: 'रेफरल प्रबंधन',
      title: 'इस रोगी को सही देखभाल से जोड़ें।',
      description: 'उपयुक्त स्वास्थ्य सुविधा चुनें और रेफरल बनाएं जिसे पूरी देखभाल यात्रा में ट्रैक किया जा सके।',
      triage: 'ट्रायेज',
      facility: 'स्वास्थ्य सुविधा',
      referral: 'रेफरल',
      followUp: 'फॉलो-अप',
      triageResult: 'ट्रायेज परिणाम',
      urgent: 'तत्काल समीक्षा',
      consult: 'परामर्श की सलाह',
      routine: 'सामान्य देखभाल',
      triageSummary: 'रेफरल की सिफारिश रोगी रिकॉर्ड में उपलब्ध जानकारी पर आधारित है।',
      chooseFacility: 'स्वास्थ्य सुविधा चुनें',
      facilityDemo: 'यहाँ दिखाई गई सुविधा की उपलब्धता प्रदर्शन के लिए है।',
      recommended: 'अनुशंसित',
      referralDetails: 'रेफरल विवरण',
      preferredDate: 'पसंदीदा तारीख',
      reason: 'कारण',
      urgentReview: 'तत्काल पेशेवर समीक्षा',
      clinicalReview: 'चिकित्सकीय समीक्षा',
      safetyTitle: 'चिकित्सकीय निर्णय स्वास्थ्यकर्मियों के पास रहता है',
      safetyText: 'SwasthOne रेफरल समन्वय में सहायता करता है। यह स्वतंत्र रूप से निदान या उपचार का निर्णय नहीं करता।',
      footerNote: 'रेफरल रोगी की स्वास्थ्य यात्रा में दर्ज किया जाएगा।',
      createReferral: 'रेफरल बनाएं',
      prototypeNote: 'प्रोटोटाइप सुविधा डेटा सिम्युलेटेड है। वास्तविक सिस्टम की उपलब्धता सत्यापित API और अधिकृत एक्सेस पर निर्भर करेगी।',
      trackingEyebrow: 'रेफरल ट्रैकिंग',
      trackingTitle: 'रेफरल की पूरी यात्रा को स्पष्ट रखें।',
      trackingDescription: 'ट्रैक करें कि रोगी का रेफरल स्वीकार हुआ है, परामर्श हुआ है और फॉलो-अप से जुड़ा है या नहीं।',
      currentStatus: 'वर्तमान स्थिति',
      sent: 'रेफरल भेजा गया',
      statusDescription: 'रेफरल बनाया गया है और चुनी गई सुविधा को भेजा गया है।',
      created: 'बनाया गया',
      createdDescription: 'रोगी की जाँच प्रक्रिया से रेफरल बनाया गया।',
      sentDescription: 'रेफरल चुनी गई स्वास्थ्य सुविधा को भेजा गया।',
      accepted: 'स्वीकृत',
      acceptedDescription: 'प्राप्त करने वाली स्वास्थ्य सुविधा ने रेफरल स्वीकार किया।',
      appointment: 'अपॉइंटमेंट',
      appointmentDescription: 'अपॉइंटमेंट या परामर्श का समय निर्धारित किया गया।',
      consulted: 'परामर्श हुआ',
      consultedDescription: 'रोगी ने स्वास्थ्य पेशेवर के साथ परामर्श पूरा किया।',
      followUpDescription: 'फॉलो-अप दर्ज किया गया और रोगी रिकॉर्ड अपडेट किया गया।',
      lifecycle: 'रेफरल प्रक्रिया',
      continuityTitle: 'देखभाल की निरंतरता',
      continuityText: 'रेफरल पूरा होने के बाद परामर्श और फॉलो-अप की जानकारी रोगी की स्वास्थ्य यात्रा में जोड़ी जा सकती है।',
      trackingSafetyTitle: 'रेफरल ट्रैकिंग केवल रेफरल भेजने के बारे में नहीं है।',
      trackingSafetyText: 'लक्ष्य रेफरल के बाद रोगी के छूट जाने की संभावना कम करना और स्वास्थ्य यात्रा को जोड़े रखना है।',
      trackingPrototypeNote: 'प्रोटोटाइप स्थिति प्रदर्शन के लिए सिम्युलेटेड है। उत्पादन स्थिति अधिकृत स्वास्थ्य सुविधा और बैकएंड प्रक्रियाओं से अपडेट होगी.',
    },

    referralTracking: {
      eyebrow: 'रेफरल ट्रैकिंग',
      title: 'रेफरल की पूरी यात्रा को स्पष्ट रखें।',
      description:
        'ट्रैक करें कि रोगी का रेफरल स्वीकार हुआ है, परामर्श हुआ है और फॉलो-अप देखभाल से जुड़ा है या नहीं।',

      currentStatus: 'वर्तमान स्थिति',
      sent: 'रेफरल भेजा गया',
      pending: 'स्वीकृति की प्रतीक्षा',

      created: 'बनाया गया',
      accepted: 'स्वीकृत',
      appointment: 'अपॉइंटमेंट',
      consulted: 'परामर्श हुआ',
      followUp: 'फॉलो-अप',

      createdDescription:
        'रोगी की जाँच प्रक्रिया से रेफरल बनाया गया।',

      sentDescription:
        'रेफरल चुनी गई स्वास्थ्य सुविधा को भेजा गया।',

      acceptedDescription:
        'प्राप्त करने वाली स्वास्थ्य सुविधा ने रेफरल स्वीकार किया।',

      appointmentDescription:
        'अपॉइंटमेंट या परामर्श का समय निर्धारित किया गया।',

      consultedDescription:
        'रोगी ने स्वास्थ्य पेशेवर के साथ परामर्श पूरा किया।',

      followUpDescription:
        'फॉलो-अप दर्ज किया गया और रोगी रिकॉर्ड अपडेट किया गया।',

      lifecycle: 'रेफरल प्रक्रिया',
      facility: 'स्वास्थ्य सुविधा',
      status: 'स्थिति',

      backToRecord: 'स्वास्थ्य रिकॉर्ड पर वापस जाएँ',

      safetyTitle: 'देखभाल की निरंतरता',
      safetyText:
        'रेफरल ट्रैकिंग से रेफरल बनने के बाद रोगी की स्वास्थ्य यात्रा जुड़ी रहती है।',

      prototypeNote:
        'प्रोटोटाइप स्थिति सिम्युलेटेड है। वास्तविक स्थिति अधिकृत बैकएंड और स्वास्थ्य सुविधा प्रक्रियाओं से अपडेट होगी।',
    },

    profile: {
      notFound: 'रोगी नहीं मिला',
      registerFirst: 'कृपया पहले किसी रोगी का पंजीकरण करें।',
      registerPatient: 'रोगी पंजीकृत करें',
      backToRegistration: 'पंजीकरण पर वापस जाएँ',
      registrationSuccess:
        'रोगी का पंजीकरण सफलतापूर्वक पूरा हुआ।',
      registered: 'पंजीकृत',
      ageGender: 'उम्र और लिंग',
      years: 'वर्ष',
      mobile: 'मोबाइल',
      notProvided: 'उपलब्ध नहीं',
      location: 'स्थान',
      registration: 'पंजीकरण',
      today: 'आज',
      nextStep: 'अगला कदम',
      startHealthScreening: 'स्वास्थ्य जाँच शुरू करें',
      screeningDescription:
        'जाँच से पहले लक्षण और मूल स्वास्थ्य माप दर्ज करें।',
      continue: 'जारी रखें',
      safetyNote:
        'रोगी की जानकारी केवल अधिकृत स्वास्थ्यकर्मियों द्वारा ही देखी जानी चाहिए।',
    },
  },

  /* =====================================================
     MARATHI
     ===================================================== */

  mr: {
    dashboard: {
      greeting:
        'शुभ संध्याकाळ',

      overview:
        'आजच्या आरोग्यसेवेचा आढावा',

      headline:
        'प्रत्येक तपासणी महत्त्वाची बनवा.',

      description:
        'रुग्णांची तपासणी सुरू ठेवा, रेफरलचा मागोवा घ्या आणि आरोग्य नोंदी जोडलेल्या ठेवा.',

      startScreening:
        'तपासणी सुरू करा',

      patientsToday:
        'आजचे रुग्ण',

      screenings:
        'तपासण्या',

      followUps:
        'फॉलो-अप',

      fromYesterday:
        'कालपेक्षा +4',

      completed:
        '75% पूर्ण',

      dueToday:
        'आज 2 बाकी',

      patientWorkflow:
        'रुग्ण कार्यप्रवाह',

      quickActions:
        'जलद कृती',

      registerPatient:
        'रुग्णाची नोंदणी करा',

      registerDescription:
        'नवीन रुग्ण प्रोफाइल तयार करा',

      continueScreening:
        'तपासणी सुरू ठेवा',

      continueDescription:
        'लक्षणे → rPPG → TrustScore',

      viewReferrals:
        'रेफरल पहा',

      referralDescription:
        'सेवेची गरज असलेल्या रुग्णांचा मागोवा घ्या',

      recentActivity:
        'अलीकडील क्रियाकलाप',

      screeningStatus:
        'तपासणीची स्थिती',

      viewAll:
        'सर्व पहा',

      routine:
        'सामान्य',

      consult:
        'सल्ला',

      urgent:
        'तातडीचे',

      trustTitle:
        'तपासणीचा विश्वास महत्त्वाचा आहे',

      trustDescription:
        'कमी विश्वासार्ह रीडिंग पुन्हा घेतली जाऊ शकते किंवा मॅन्युअल मोजमापाने तपासली जाऊ शकते.',
    },

    screening: {
      eyebrow:
        'रुग्णाची तपासणी',

      title:
        'तुम्हाला कसे वाटत आहे ते समजून घेऊया.',

      description:
        'तुमच्या लक्षणांबद्दल सांगा. ही माहिती पुढील तपासणीसाठी मदत करेल.',

      registration:
        'नोंदणी',

      symptomsStep:
        'लक्षणे',

      rppg:
        'rPPG',

      triage:
        'ट्रायेज',

      screeningFor:
        'तपासणी',

      age:
        'वय',

      village:
        'गाव',

      symptomsTitle:
        'तुम्हाला कोणती लक्षणे जाणवत आहेत?',

      selectAll:
        'लागू असलेली सर्व लक्षणे निवडा.',

      moreTitle:
        'थोडी अधिक माहिती द्या',

      optional:
        'ही माहिती ऐच्छिक आहे.',

      duration:
        'ही लक्षणे तुम्हाला किती दिवसांपासून आहेत?',

      selectDuration:
        'कालावधी निवडा',

      today:
        'आज',

      days23:
        '2–3 दिवस',

      days47:
        '4–7 दिवस',

      moreWeek:
        'एका आठवड्यापेक्षा जास्त',

      severity:
        'लक्षणे किती गंभीर आहेत?',

      selectSeverity:
        'तीव्रता निवडा',

      mild:
        'सौम्य',

      moderate:
        'मध्यम',

      severe:
        'गंभीर',

      measurementsTitle:
        'तुमच्याकडे आरोग्य कर्मचाऱ्यांनी घेतलेले मोजमाप आहेत का?',

      measurementsOptional:
        'हा टप्पा ऐच्छिक आहे.',

      noMeasurements:
        'मोजमाप उपलब्ध नाही',

      noMeasurementsDescription:
        'थेट कॅमेरा-आधारित तपासणीवर जा.',

      yesMeasurements:
        'होय, माझ्याकडे मोजमाप आहेत',

      yesMeasurementsDescription:
        'आरोग्य कर्मचाऱ्यांनी नोंदवलेले मोजमाप भरा.',

      recordedMeasurements:
        'नोंदवलेली मोजमापे',

      recordedDescription:
        'फक्त उपलब्ध असलेली मोजमापे भरा.',

      bloodPressure:
        'रक्तदाब',

      pulse:
        'नाडी',

      temperature:
        'तापमान',

      oxygen:
        'SpO₂',

      continueNote:
        'तुमच्याकडे मॅन्युअल मोजमाप नसले तरी तुम्ही पुढे जाऊ शकता.',

      continueScreening:
        'तपासणीवर जा',
    },

    common: {
      back:
        'मागे',

      english:
        'English',

      hindi:
        'हिन्दी',

      marathi:
        'मराठी',
    },
    triage: {
      eyebrow: 'डिजिटल ट्रायेज',

      title:
        'या रुग्णासाठी पुढील योग्य पाऊल समजून घेऊया.',

      description:
        'SwasthOne लक्षणे, उपलब्ध मोजमाप आणि तपासणीची माहिती एकत्र करून पुढील उपचार निर्णयासाठी मदत करते.',

      recommendation:
        'ट्रायेज शिफारस',

      routineTitle:
        'सामान्य काळजी',

      routineDescription:
        'उपलब्ध माहितीच्या आधारावर तातडीच्या उच्च जोखमीचे संकेत आढळले नाहीत.',

      routineAction:
        'सामान्य काळजी आणि फॉलो-अप सुरू ठेवा.',

      consultTitle:
        'डॉक्टरांच्या सल्ल्याची शिफारस',

      consultDescription:
        'उपलब्ध माहितीच्या आधारावर आरोग्य कर्मचाऱ्यांनी रुग्णाची तपासणी करणे योग्य आहे.',

      consultAction:
        'डॉक्टरांच्या सल्ल्याची विनंती करा.',

      urgentTitle:
        'तातडीच्या वैद्यकीय तपासणीची शिफारस',

      urgentDescription:
        'उपलब्ध माहितीमध्ये तातडीच्या व्यावसायिक वैद्यकीय तपासणीची गरज दर्शवणारा संकेत आहे.',

      urgentAction:
        'तातडीने वैद्यकीय मदत घ्या.',

      nextStep:
        'शिफारस केलेले पुढील पाऊल',

      symptomSummary:
        'विचारात घेतलेली लक्षणे',

      noSymptoms:
        'कोणतीही लक्षणे नोंदवलेली नाहीत.',

      screeningConfidence:
        'तपासणीचा विश्वास',

      highConfidence:
        'तपासणीच्या संकेताने सध्याची विश्वासार्हता तपासणी उत्तीर्ण केली आहे.',

      lowConfidence:
        'तपासणीच्या संकेताचा विश्वास कमी आहे आणि त्याची पडताळणी करावी.',

      decisionSupport:
        'केवळ निर्णयासाठी मदत',

      decisionSupportText:
        'ही शिफारस निदान किंवा प्रिस्क्रिप्शन नाही. अंतिम वैद्यकीय निर्णय पात्र आरोग्यकर्मचाऱ्याने घ्यावा.',

      footerNote:
        'ट्रायेज रुग्णाच्या नोंदीमध्ये सध्या उपलब्ध असलेल्या माहितीचा वापर करते.',

      prototypeNote:
        'प्रोटोटाइप नियम इंजिन: अंतिम ट्रायेज परिणाम स्वतंत्र ट्रायेज सेवेकडून दिला जाईल आणि त्यात लक्षणे, वय, इतिहास, rPPG परिणाम आणि मॅन्युअल मोजमापांचा वापर केला जाऊ शकतो.',
    },
    roleDashboard: {
      ashaDashboard: 'आशा डॅशबोर्ड',
      patientHealth: 'माझे आरोग्य',
      doctorDashboard: 'डॉक्टर डॅशबोर्ड',

      goodEvening: 'शुभ संध्याकाळ',
      welcomeBack: 'पुन्हा स्वागत आहे',

      fieldWorkflow: 'आजचा क्षेत्रीय कार्यप्रवाह',
      healthcareJourney: 'तुमची आरोग्य यात्रा',
      clinicalWorkspace: 'आजचे वैद्यकीय कार्यक्षेत्र',

      ashaHeadline: 'रुग्णांची काळजी जोडलेली ठेवा.',
      patientHeadline: 'तुमच्या आरोग्यसेवेशी जोडलेले राहा.',
      doctorHeadline: 'रुग्णांचे पुनरावलोकन करा आणि पुढील मार्गदर्शन करा.',

      ashaDescription:
        'एका ठिकाणाहून रुग्णांची नोंदणी, तपासणी आणि रेफरलचा मागोवा घ्या.',
      patientDescription:
        'तपासणी सुरू करा, आरोग्य नोंदी पहा आणि फॉलो-अपचा मागोवा घ्या.',
      doctorDescription:
        'तपासणीची माहिती, ट्रायेज परिणाम आणि रेफरलचे पुनरावलोकन करा.',

      reviewPatients: 'रुग्णांचे पुनरावलोकन करा',
      startScreening: 'तपासणी सुरू करा',

      patientsToday: 'आजचे रुग्ण',
      screenings: 'तपासण्या',
      followUps: 'फॉलो-अप',

      fromYesterday: 'कालपेक्षा +4',
      completed: '75% पूर्ण',
      dueToday: 'आज 2 बाकी',

      patientWorkflow: 'रुग्ण कार्यप्रवाह',
      quickActions: 'जलद कृती',

      registerPatient: 'रुग्णाची नोंदणी करा',
      registerDescription: 'नवीन रुग्ण प्रोफाइल तयार करा',

      continueScreening: 'तपासणी सुरू ठेवा',
      continueDescription: 'लक्षणे → rPPG → TrustScore',

      viewReferrals: 'रेफरल पहा',
      referralDescription: 'सेवेची गरज असलेल्या रुग्णांचा मागोवा घ्या',

      recentActivity: 'अलीकडील क्रियाकलाप',
      patientsAttention: 'लक्ष देण्याची गरज असलेले रुग्ण',

      latestTrustScore: 'नवीनतम TrustScore',
      screeningConfidence: 'तपासणीचा विश्वास',
      healthRecords: 'आरोग्य नोंदी',
      availableRecords: 'उपलब्ध नोंदी',
      nextFollowUp: 'पुढील फॉलो-अप',
      recommended: 'शिफारस केलेले',

      myHealthcare: 'माझी आरोग्यसेवा',
      whatToDo: 'तुम्हाला काय करायचे आहे?',

      startScreeningDescription:
        'लक्षणे तपासा आणि तपासणी सुरू करा',

      healthRecordsDescription:
        'तुमच्या तपासणी आणि आरोग्य इतिहासाच्या नोंदी पहा',

      myReferrals: 'माझे रेफरल',
      myReferralsDescription:
        'तुमच्या सध्याच्या रेफरलचा मागोवा घ्या',

      nextStep: 'पुढील पाऊल',
      followUpCare: 'फॉलो-अप काळजी',
      followUpTomorrow: 'उद्या फॉलो-अप',

      followUpDescription:
        'तुमची पुढील शिफारस केलेली काळजी उद्यासाठी नियोजित आहे.',

      healthConnectedTitle:
        'तुमची आरोग्य माहिती जोडलेली राहते',

      healthConnectedDescription:
        'तपासणी, रेफरल आणि फॉलो-अपची माहिती तुमच्या आरोग्य प्रवासात एकत्र ठेवता येते.',

      patientsAwaitingReview: 'पुनरावलोकनासाठी प्रतीक्षेत असलेले रुग्ण',
      urgentCases: 'तातडीची प्रकरणे',
      todaysConsultations: 'आजचे सल्लामसलत',

      needsClinicalReview: 'वैद्यकीय पुनरावलोकन आवश्यक',
      requiresAttention: 'लक्ष आवश्यक',
      scheduledToday: 'आज नियोजित',

      clinicalReview: 'वैद्यकीय पुनरावलोकन',
      pending: 'प्रलंबित',

      recentlyScreened: 'अलीकडे तपासलेले',
      urgent: 'तातडीचे',
      consult: 'सल्ला',
      routine: 'सामान्य',

      reviewSafetyTitle:
        'वैद्यकीय निर्णय घेण्यापूर्वी तपासणीच्या माहितीचे पुनरावलोकन करा',

      reviewSafetyDescription:
        'rPPG, TrustScore आणि ट्रायेज ही केवळ तपासणीसाठी सहाय्यक माहिती आहे आणि व्यावसायिक वैद्यकीय निर्णयाची जागा घेत नाही.',

      online: 'ऑनलाइन',
      offlineMode: 'ऑफलाइन मोड',
      allSynced: 'सर्व नोंदी सिंक झाल्या आहेत',

      pendingSync: 'नोंदी सिंक होणे बाकी आहे',

      offlineDescription:
        'डेटा स्थानिक पातळीवर जतन केला जाईल आणि कनेक्टिव्हिटी परत आल्यावर सिंक केला जाईल.',
    },
    registration: {
      eyebrow: 'रुग्ण नोंदणी',
      title: 'रुग्ण प्रोफाइल तयार करा',
      description:
        'रुग्णाची नोंद तयार करण्यासाठी आवश्यक मूलभूत माहिती भरा.',

      fullName: 'पूर्ण नाव',
      age: 'वय',
      gender: 'लिंग',
      phone: 'फोन नंबर',
      village: 'गाव',
      emergencyContact: 'आपत्कालीन संपर्क',

      selectGender: 'लिंग निवडा',
      male: 'पुरुष',
      female: 'महिला',
      other: 'इतर',

      patientWorkflow: 'रुग्ण कार्यप्रवाह',
      basicInformation: 'मूलभूत माहिती',
      basicInformationDescription:
        'रुग्णाची मूलभूत ओळख संबंधित माहिती भरा.',
      contactLocation: 'संपर्क आणि ठिकाण',
      contactLocationDescription:
        'आरोग्यसेवेची सातत्यता आणि फॉलो-अपसाठी उपयुक्त.',
      backToDashboard: 'डॅशबोर्डवर परत जा',
      cancel: 'रद्द करा',
      preferNotToSay: 'सांगू इच्छित नाही',
      fullNamePlaceholder: 'रुग्णाचे पूर्ण नाव भरा',
      agePlaceholder: 'उदा. 42',
      phonePlaceholder: '10 अंकी मोबाइल नंबर',
      villagePlaceholder: 'गाव किंवा ठिकाण भरा',
      emergencyPlaceholder: 'आपत्कालीन संपर्क क्रमांक',
      consentTitle: 'रुग्णाची संमती',
      consentText:
        'माझी आरोग्यविषयक माहिती नोंदवण्यासाठी आणि तपासणी व आरोग्यसेवेच्या समन्वयासाठी वापरण्यास मी संमती देतो/देते.',

      continue: 'पुढे जा',
      required: 'हे क्षेत्र आवश्यक आहे',
    },

    // profile: {
    //   eyebrow: 'रुग्ण प्रोफाइल',
    //   title: 'रुग्ण प्रोफाइल',
    //   patientInformation: 'रुग्णाची माहिती',

    //   name: 'नाव',
    //   age: 'वय',
    //   gender: 'लिंग',
    //   phone: 'फोन',
    //   village: 'गाव',
    //   emergencyContact: 'आपत्कालीन संपर्क',

    //   nextStep: 'पुढील पाऊल',
    //   nextStepTitle: 'आरोग्य तपासणी सुरू करा',
    //   nextStepDescription:
    //     'लक्षणे, उपलब्ध मोजमाप आणि कॅमेरा-आधारित तपासणीसह पुढे जा.',

    //   continueScreening: 'तपासणी सुरू ठेवा',
    // },

    rppg: {
      eyebrow: 'कॅमेरा तपासणी',
      title: 'कॅमेरा-आधारित आरोग्य तपासणी',
      description:
        'तुमचा चेहरा फ्रेममध्ये ठेवा आणि कॅमेरा तपासणीचा संकेत घेत असताना स्थिर रहा.',

      registration: 'नोंदणी',
      symptoms: 'लक्षणे',
      rppg: 'rPPG',
      triage: 'ट्रायेज',

      cameraTitle: 'तुमचा चेहरा फ्रेममध्ये ठेवा',
      cameraDescription:
        'तुमचा चेहरा स्पष्ट दिसत आहे आणि प्रकाश पुरेसा आहे याची खात्री करा.',

      start: 'तपासणी सुरू करा',
      stop: 'तपासणी थांबवा',
      preparing: 'कॅमेरा तयार होत आहे...',
      processing: 'तपासणीची प्रक्रिया सुरू आहे...',

      seconds: 'सेकंद',

      safetyTitle: 'केवळ तपासणीसाठी सहाय्य',
      safetyText:
        'कॅमेरा-आधारित तपासणी सहाय्यक आरोग्यविषयक माहिती देते. ती वैद्यकीय मोजमाप किंवा व्यावसायिक वैद्यकीय निर्णयाची जागा घेत नाही.',

      cameraPermission:
        'पुढे जाण्यासाठी कॅमेरा परवानगी आवश्यक आहे.',
      positionFace: 'तुमचा चेहरा फ्रेमच्या आत ठेवा',
      cameraReady: 'कॅमेरा तयार आहे',
      cameraNotStarted: 'कॅमेरा सुरू झालेला नाही',
      secondsShort: 'सेकंद',
      stayStill: 'स्थिर रहा आणि तुमचा चेहरा फ्रेमच्या आत ठेवा',
      recordingComplete: 'रेकॉर्डिंग पूर्ण झाले',
      signalCaptured:
        'गुणवत्ता तपासणीसाठी तुमचा सिग्नल कॅप्चर करण्यात आला आहे.',
      cameraScreening: 'कॅमेरा आधारित तपासणी',
      cameraAccessDescription:
        '30 सेकंदांच्या चेहऱ्याच्या सिग्नल रेकॉर्डिंगसाठी कॅमेरा प्रवेश आवश्यक आहे.',
      requestingCamera: 'कॅमेरा प्रवेशाची विनंती केली जात आहे…',
      enableCamera: 'कॅमेरा सुरू करा',
      secondsRemaining: 'सेकंद शिल्लक',
      measurementCaptured: 'मापन कॅप्चर झाले',
      qualityAnalysisNext:
        'आता हा सिग्नल वापरण्यासाठी पुरेसा विश्वासार्ह आहे का ते तपासले जाईल.',
      betterReading: 'चांगल्या रीडिंगसाठी',
      tipFaceCamera: 'कॅमेऱ्याकडे थेट पहा.',
      tipKeepStill: 'तुमचे डोके शक्य तितके स्थिर ठेवा.',
      tipLighting: 'चांगल्या प्रकाशाचा वापर करा.',
      tipFaceVisible: 'तुमचा संपूर्ण चेहरा दिसू द्या.',
      whyQualityMatters: 'सिग्नलची गुणवत्ता का महत्त्वाची आहे',
      qualityDescription:
        'कॅमेरा आधारित मापन हालचाल, प्रकाश आणि सिग्नलच्या गुणवत्तेमुळे प्रभावित होऊ शकते. परिणाम वापरण्यापूर्वी SwasthOne मापनाचा विश्वासार्हपणा तपासते.',
      whatNext: 'पुढे काय होईल?',
      stepCapture: 'चेहऱ्याचा सिग्नल कॅप्चर करा',
      stepQuality: 'सिग्नलची गुणवत्ता तपासा',
      stepTrustScore: 'TrustScore मोजा',
      recordingNote:
        'या तपासणीच्या टप्प्यासाठी तुमच्या कॅमेऱ्याच्या रेकॉर्डिंगचा वापर केला जातो.',
      checkTrustScore: 'TrustScore तपासा',
      prototypeNote:
        'फ्रंटएंड कॅप्चर तयार आहे. वास्तविक rPPG सिग्नल-प्रोसेसिंग सेवा इंटिग्रेशनच्या टप्प्यात HR, HRV, श्वसन दर आणि TrustScore उपलब्ध करेल.',
    },

    trustScore: {
      eyebrow: 'तपासणीचा विश्वास',
      title: 'ही तपासणी किती विश्वासार्ह आहे?',
      description:
        'TrustScore उपलब्ध तपासणी संकेताचा विश्वास दर्शवतो. हा निदान नाही.',

      trustScore: 'TrustScore',
      processingTime: 'प्रक्रिया वेळ',
      qualityFactors: 'गुणवत्ता घटक',

      heartRate: 'हृदय गती',
      heartRateVariability: 'हृदय गतीतील बदल',
      respiratoryRate: 'श्वसन दर',

      awaitingAnalysis: 'विश्लेषणाची प्रतीक्षा',

      good: 'चांगले',
      moderate: 'मध्यम',
      low: 'कमी',

      retake: 'तपासणी पुन्हा करा',
      continueTriage: 'ट्रायेजकडे जा',

      safetyTitle: 'महत्त्वाचे',
      safetyText:
        'कमी विश्वासार्ह निकाल पुन्हा घेणे किंवा योग्य मॅन्युअल मोजमापाने तपासणे आवश्यक आहे. TrustScore कोणत्याही वैद्यकीय स्थितीचे निदान करत नाही.',

      prototypeNote:
        'प्रोटोटाइपमधील मूल्ये सध्या सिम्युलेटेड आहेत. उत्पादन प्रणालीमध्ये मूल्ये स्वतंत्र rPPG आणि TrustScore सेवेकडून मिळतील.',
      processing: 'सिग्नलच्या गुणवत्तेचे विश्लेषण केले जात आहे...',
      faceStability: 'चेहऱ्याची स्थिरता',
      measurementConsistency: 'मापनाची स्थिरता',
      measurementQuality: 'मापनाची गुणवत्ता',
      goodDescription:
        'कॅप्चर केलेला सिग्नल सध्याच्या गुणवत्ता तपासणीत यशस्वी झाला आहे आणि तपासणी प्रक्रियेत पुढे जाऊ शकतो.',
      lowDescription:
        'या रीडिंगचा विश्वासार्हपणे वापर करण्यासाठी सिग्नलची गुणवत्ता पुरेशी मजबूत नाही.',
      signalQuality: 'सिग्नलची गुणवत्ता',
      movement: 'हालचाल',
      lighting: 'प्रकाश',
      stable: 'स्थिर',
      screeningInformation: 'तपासणीची माहिती',
      clinicalConfirmation: 'वैद्यकीय पुष्टी आवश्यक',
      confidencePassed: 'विश्वासार्हता तपासणी यशस्वी',
      confidencePassedDescription:
        'TrustScore दर्शवतो की या कॅप्चरची सिग्नल गुणवत्ता तपासणीसाठी पुरेशी आहे. कोणत्याही चिंताजनक परिणामाची पुष्टी वैद्यकीयदृष्ट्या मान्य मापनाद्वारे केली पाहिजे.',
      retakeDescription:
        'हालचाल, प्रकाश किंवा सिग्नलची गुणवत्ता यामुळे हे कॅप्चर प्रभावित झाले असू शकते. मापन पुन्हा करा किंवा आरोग्य कर्मचाऱ्यांनी घेतलेले मॅन्युअल मापन वापरा.',
    },

    referral: {
      eyebrow: 'रेफरल व्यवस्थापन',
      title: 'या रुग्णाला योग्य आरोग्यसेवेशी जोडा.',
      description: 'योग्य आरोग्य सुविधा निवडा आणि संपूर्ण आरोग्य प्रवासात ट्रॅक करता येईल असे रेफरल तयार करा.',
      triage: 'ट्रायेज',
      facility: 'आरोग्य सुविधा',
      referral: 'रेफरल',
      followUp: 'फॉलो-अप',
      triageResult: 'ट्रायेज निकाल',
      urgent: 'तातडीची तपासणी',
      consult: 'सल्ल्याची शिफारस',
      routine: 'सामान्य काळजी',
      triageSummary: 'रेफरलची शिफारस रुग्णाच्या नोंदीमध्ये उपलब्ध माहितीवर आधारित आहे.',
      chooseFacility: 'आरोग्य सुविधा निवडा',
      facilityDemo: 'येथे दाखवलेली सुविधा उपलब्धता प्रात्यक्षिकासाठी आहे.',
      recommended: 'शिफारस केलेले',
      referralDetails: 'रेफरल तपशील',
      preferredDate: 'प्राधान्याची तारीख',
      reason: 'कारण',
      urgentReview: 'तातडीचे व्यावसायिक पुनरावलोकन',
      clinicalReview: 'वैद्यकीय पुनरावलोकन',
      safetyTitle: 'वैद्यकीय निर्णय आरोग्य व्यावसायिकांकडेच राहतो',
      safetyText: 'SwasthOne रेफरल समन्वयास मदत करते. ते स्वतंत्रपणे निदान किंवा उपचाराचा निर्णय घेत नाही.',
      footerNote: 'रेफरल रुग्णाच्या आरोग्य प्रवासात नोंदवले जाईल.',
      createReferral: 'रेफरल तयार करा',
      prototypeNote: 'प्रोटोटाइप सुविधा डेटा सिम्युलेटेड आहे. वास्तविक प्रणालीची उपलब्धता सत्यापित API आणि अधिकृत प्रवेशावर अवलंबून असेल.',
      trackingEyebrow: 'रेफरल ट्रॅकिंग',
      trackingTitle: 'रेफरलचा संपूर्ण प्रवास स्पष्ट ठेवा.',
      trackingDescription: 'रुग्णाचे रेफरल स्वीकारले गेले आहे का, सल्लामसलत झाली आहे का आणि फॉलो-अपशी जोडले गेले आहे का याचा मागोवा घ्या.',
      currentStatus: 'सध्याची स्थिती',
      sent: 'रेफरल पाठवले',
      statusDescription: 'रेफरल तयार करून निवडलेल्या आरोग्य सुविधेकडे पाठवले आहे.',
      created: 'तयार केले',
      createdDescription: 'रुग्णाच्या तपासणी प्रक्रियेतून रेफरल तयार केले.',
      sentDescription: 'रेफरल निवडलेल्या आरोग्य सुविधेकडे पाठवले.',
      accepted: 'स्वीकारले',
      acceptedDescription: 'संबंधित आरोग्य सुविधेने रेफरल स्वीकारले.',
      appointment: 'अपॉइंटमेंट',
      appointmentDescription: 'अपॉइंटमेंट किंवा सल्लामसलतीची वेळ निश्चित केली.',
      consulted: 'सल्लामसलत झाली',
      consultedDescription: 'रुग्णाने आरोग्य व्यावसायिकासोबत सल्लामसलत पूर्ण केली.',
      followUpDescription: 'फॉलो-अप नोंदवला गेला आणि रुग्णाची नोंद अपडेट केली.',
      lifecycle: 'रेफरल प्रक्रिया',
      continuityTitle: 'आरोग्यसेवेची सातत्यता',
      continuityText: 'रेफरल पूर्ण झाल्यानंतर सल्लामसलत आणि फॉलो-अपची माहिती रुग्णाच्या आरोग्य प्रवासात जोडता येते.',
      trackingSafetyTitle: 'रेफरल ट्रॅकिंग म्हणजे फक्त रेफरल पाठवणे नाही.',
      trackingSafetyText: 'रेफरलनंतर रुग्णाचा मागोवा सुटू नये आणि आरोग्य प्रवास जोडलेला राहावा हा उद्देश आहे.',
      trackingPrototypeNote: 'प्रोटोटाइप स्थिती प्रात्यक्षिकासाठी सिम्युलेटेड आहे. उत्पादन स्थिती अधिकृत आरोग्य सुविधा आणि बॅकएंड प्रक्रियेतून अपडेट केली जाईल.',
    },

    referralTracking: {
      eyebrow: 'रेफरल ट्रॅकिंग',
      title: 'रेफरलची संपूर्ण प्रक्रिया स्पष्ट ठेवा.',
      description:
        'रुग्णाचे रेफरल स्वीकारले गेले आहे का, सल्लामसलत झाली आहे का आणि फॉलो-अप काळजीशी जोडले गेले आहे का याचा मागोवा घ्या.',

      currentStatus: 'सध्याची स्थिती',
      sent: 'रेफरल पाठवले',
      pending: 'स्वीकृतीची प्रतीक्षा',

      created: 'तयार केले',
      accepted: 'स्वीकारले',
      appointment: 'अपॉइंटमेंट',
      consulted: 'सल्लामसलत झाली',
      followUp: 'फॉलो-अप',

      createdDescription:
        'रुग्णाच्या तपासणी प्रक्रियेतून रेफरल तयार केले.',

      sentDescription:
        'रेफरल निवडलेल्या आरोग्य सुविधेकडे पाठवले.',

      acceptedDescription:
        'संबंधित आरोग्य सुविधेने रेफरल स्वीकारले.',

      appointmentDescription:
        'अपॉइंटमेंट किंवा सल्लामसलतीची वेळ निश्चित केली.',

      consultedDescription:
        'रुग्णाने आरोग्य व्यावसायिकासोबत सल्लामसलत पूर्ण केली.',

      followUpDescription:
        'फॉलो-अप नोंदवला गेला आणि रुग्णाची नोंद अपडेट केली.',

      lifecycle: 'रेफरल प्रक्रिया',
      facility: 'आरोग्य सुविधा',
      status: 'स्थिती',

      backToRecord: 'आरोग्य नोंदीकडे परत जा',

      safetyTitle: 'आरोग्यसेवेची सातत्यता',
      safetyText:
        'रेफरल ट्रॅकिंगमुळे रेफरल तयार झाल्यानंतर रुग्णाची आरोग्य यात्रा जोडलेली राहते.',

      prototypeNote:
        'प्रोटोटाइप स्थिती सिम्युलेटेड आहे. उत्पादन प्रणालीमध्ये स्थिती अधिकृत बॅकएंड आणि आरोग्य सुविधा प्रक्रियेतून अपडेट केली जाईल.',
    },

    profile: {
      notFound: 'रुग्ण सापडला नाही',
      registerFirst: 'कृपया प्रथम रुग्णाची नोंदणी करा.',
      registerPatient: 'रुग्णाची नोंदणी करा',
      backToRegistration: 'नोंदणीकडे परत जा',
      registrationSuccess:
        'रुग्णाची नोंदणी यशस्वीरित्या पूर्ण झाली.',
      registered: 'नोंदणीकृत',
      ageGender: 'वय आणि लिंग',
      years: 'वर्षे',
      mobile: 'मोबाइल',
      notProvided: 'उपलब्ध नाही',
      location: 'ठिकाण',
      registration: 'नोंदणी',
      today: 'आज',
      nextStep: 'पुढील पाऊल',
      startHealthScreening: 'आरोग्य तपासणी सुरू करा',
      screeningDescription:
        'तपासणीपूर्वी लक्षणे आणि मूलभूत आरोग्य मोजमाप नोंदवा.',
      continue: 'पुढे जा',
      safetyNote:
        'रुग्णाची माहिती फक्त अधिकृत आरोग्य कर्मचाऱ्यांनीच पाहावी.',
    },
  },
} as const

/* =========================================================
   LANGUAGE STATE
   ========================================================= */

const STORAGE_KEY = 'swasthone-language'

let currentLanguage: Language =
  (localStorage.getItem(STORAGE_KEY) as Language) || 'en'

const listeners = new Set<() => void>()

export function setLanguage(language: Language) {
  currentLanguage = language

  localStorage.setItem(
    STORAGE_KEY,
    language,
  )

  listeners.forEach((listener) => {
    listener()
  })
}

export function getLanguage() {
  return currentLanguage
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function useLanguage() {
  return useSyncExternalStore(
    subscribe,
    getLanguage,
    () => 'en' as Language,
  )
}

/* =========================================================
   TRANSLATION FUNCTION
   ========================================================= */

export function t(
  section: keyof typeof translations.en,
  key: string,
): string {
  const sectionData =
    (translations[currentLanguage] as Record<
    string,
    Record<string, string>
  >)[section]

  if (!sectionData) {
    return key
  }

  return (
    (sectionData as Record<string, string>)[key] ??
    key
  )
}