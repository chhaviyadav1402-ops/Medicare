import { MedicalDocument, FullCarePlan } from '../types';

export const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc-hist-001',
    title: '9-Year Longitudinal Diabetic History & Chronic Illness Burnout Assessment',
    category: 'PAST_HISTORY',
    doctorName: 'Dr. Sarah Jenkins, MD (Chief of Endocrinology & Diabetes Metabolism)',
    doctorPhone: '+1 (555) 234-8900',
    clinicOrHospital: 'Apex Diabetes & Metabolic Specialty Center',
    date: '2024-11-14',
    doctorNotesRaw: `PATIENT PAST CLINICAL HISTORY & CHRONIC CARE EVALUATION:
- Initial Clinical Diagnosis: Type 2 Diabetes Mellitus confirmed in May 2017 (9-year disease duration).
- Progression & Treatment History: Controlled on oral hypoglycemic agents for 4 years with moderate lifestyle changes; however, progressive beta-cell decline led to increased insulin resistance and glycemic variability.
- Chronic Complications:
  * Diabetic Distal Symmetric Peripheral Neuropathy: Bilateral burning paresthesias, numbness, and tingling in toes/feet (documented since 2023).
  * Psychological Burden & Chronic Illness Distress: Patient exhibits longstanding diabetes distress and emotional fatigue from 9 continuous years of hyper-vigilant glucose monitoring, restrictive dietary regimens, and fear of diabetic complications (vision loss, kidney failure).
- Known Drug Allergy: Penicillin (severe urticaria, facial angioedema, and respiratory tightness). STRICT CONTRAINDICATION FOR AMOXICILLIN OR PENICILLIN CLASS.
- Baseline Organ Function: Renal microalbuminuria screening indicated mild albumin excretion; liver transaminases normal.
- Clinical Plan: Coordinate with Neuropsychiatry to address secondary depression and chronic burnout, ensuring patient has dual neuropathic and depressive support.`,
    diagnoses: [
      'Type 2 Diabetes Mellitus (9-Year Longstanding)',
      'Diabetic Distal Symmetric Peripheral Neuropathy',
      'Chronic Illness Distress & Secondary Depression',
      'Penicillin Drug Allergy (Strict Contraindication)'
    ],
    allergiesNoted: ['Penicillin (Anaphylactic Angioedema / Hives)'],
    fileName: 'Longitudinal_Diabetes_9Yr_Assessment_2024.pdf',
    createdAt: '2024-11-14T10:30:00.000Z',
  },
  {
    id: 'doc-hist-002',
    title: 'Comprehensive Glycemic, Metabolic & Renal Diagnostic Panel',
    category: 'LAB_REPORT',
    doctorName: 'Dr. Sarah Jenkins, MD',
    doctorPhone: '+1 (555) 234-8900',
    clinicOrHospital: 'Apex Clinical & Diagnostic Pathology Laboratories',
    date: '2026-08-18',
    doctorNotesRaw: `LABORATORY INTERPRETATION & GLYCEMIC BIOMARKERS:
- Glycated Hemoglobin (HbA1c): 8.2% (Target < 7.0%, Baseline 7.4%). Demonstrates progressive glycemic escape and post-prandial blood sugar spikes.
- Fasting Blood Sugar: 162 mg/dL (Target: 80 - 130 mg/dL).
- Estimated Average Glucose (eAG): 189 mg/dL.
- Urine Microalbumin-to-Creatinine Ratio (UACR): 42 mg/g (Normal < 30 mg/g; demonstrates early diabetic microalbuminuria requiring renal protective therapy with SGLT2 inhibitor).
- Lipid Profile: Serum Total Cholesterol 214 mg/dL; LDL-C 128 mg/dL (Elevated); HDL-C 42 mg/dL; Triglycerides 194 mg/dL.
- Serum Creatinine: 0.94 mg/dL; eGFR: 84 mL/min/1.73m² (Mildly decreased).
- Serum Vitamin B12: 240 pg/mL (Borderline low, common secondary to prolonged Metformin therapy; B12 replenishment advised).
- Physician Interpretation: Chronic hyperglycemic spikes directly aggravate neuropathic pain and cause energy swings that exacerbate depressive lethargy. Strict low-glycemic dietary intake and med adherence mandated.`,
    diagnoses: [
      'Sub-optimally Controlled HbA1c (8.2%)',
      'Diabetic Microalbuminuria (Stage 1 Diabetic Kidney Disease)',
      'Diabetic Dyslipidemia (Elevated LDL & Triglycerides)'
    ],
    allergiesNoted: [],
    fileName: 'Apex_Lab_Report_HbA1c_UACR_Aug2026.pdf',
    createdAt: '2026-08-18T14:15:00.000Z',
  },
  {
    id: 'doc-recent-001',
    title: 'Neuropsychiatric Consultation: Chronic Illness Major Depression & Neuropathic Pain',
    category: 'RECENT_VISIT',
    doctorName: 'Dr. Marcus Vance, MD (Neuropsychiatrist & Behavioral Health Physician)',
    doctorPhone: '+1 (555) 441-2890',
    clinicOrHospital: 'Mind-Body Neuropsychiatry & Chronic Disease Wellness Clinic',
    date: '2026-09-08',
    doctorNotesRaw: `NEUROPSYCHIATRIC EVALUATION & MULTI-TARGET REVISED PRESCRIPTION:
Patient: Kanika (Age 48)
Chief Complaint: "I've had diabetes for almost 10 years and I feel completely drained, defeated, and empty. Everything feels like a chore, my feet burn at night, and I just can't keep pretending everything is okay."
Clinical Assessment:
- Meets DSM-5 criteria for Major Depressive Disorder, Single Episode, Moderate-to-Severe (PHQ-9 Depression Inventory Score: 16/27).
- Marked anhedonia, early morning awakening, psychomotor sluggishness, and severe chronic illness burnout tied to relentless dietary calculations, fingerstick anxiety, and fear of diabetic complications.
- Diabetic Peripheral Neuropathy causes burning foot sensations that worsen nocturnal sleep, amplifying daytime depressive affect.

PHYSICIAN PRESCRIPTIONS & CLINICAL DIRECTIVES:
1. Duloxetine (Cymbalta) 60mg (Delayed-Release Capsule): Take 1 capsule every MORNING (08:00 AM) with breakfast.
   * Rationale: Dual-action Serotonin-Norepinephrine Reuptake Inhibitor (SNRI) selected as first-line therapy because it targets BOTH Major Depressive Disorder AND diabetic neuropathic nerve pain in one agent.
2. Metformin 1000mg ER (Extended-Release Tablet): Take 1 tablet MORNING with breakfast and 1 tablet at DINNER (07:30 PM). Must take WITH food to prevent gastrointestinal upset.
   * Rationale: Fundamental long-term insulin sensitization.
3. Empagliflozin (Jardiance) 10mg (Tablet): Take 1 tablet MORNING (08:30 AM) with a full glass of water.
   * Rationale: SGLT2 inhibitor providing renal protection for microalbuminuria and cardiorenal risk reduction.
4. Atorvastatin 20mg (Tablet): Take 1 tablet at BEDTIME (10:00 PM). Essential for diabetic vascular preservation.
5. Rapid Glucose Dextrose Gel / 15g Fast-Acting Glucose Tabs: Keep at bedside and in pocket for SOS hypoglycemia (<70 mg/dL).

DIETARY & LIFESTYLE MANDATES:
- Strict Low Glycemic Index (<55) dietary protocol: Prevent glucose spikes that trigger mood swings and insulin surges.
- Neuro-supportive nutrients: High Omega-3 (wild salmon, walnuts, chia), magnesium-rich greens to support brain neurotransmitters and combat neuro-inflammation.
- Paced physical movement: 15-20 min post-meal walking to lower glucose and elevate endorphins.
- Avoid all refined sugars, sweetened drinks, and white flour carbs.

EMERGENCY & CRISIS DIRECTIVES:
- Call Dr. Marcus Vance / Crisis Support (988 or clinic line) if depressive despair or suicidal thoughts emerge.
- Call Dr. Sarah Jenkins (+1 555-234-8900) or Emergency 911 if:
  * Blood glucose drops below 70 mg/dL with tremors/confusion.
  * Blood glucose spikes above 250 mg/dL with nausea/ketone symptoms.`,
    diagnoses: [
      'Major Depressive Disorder Secondary to Chronic Disease (PHQ-9: 16)',
      'Type 2 Diabetes Mellitus with Peripheral Neuropathy',
      'Diabetic Distress & Burnout Syndrome'
    ],
    allergiesNoted: ['Penicillin'],
    fileName: 'Dr_Marcus_Vance_Neuropsychiatry_Prescription_Sept2026.pdf',
    createdAt: '2026-09-08T11:00:00.000Z',
  }
];

export const INITIAL_CARE_PLAN: FullCarePlan = {
  lastAnalyzed: '2026-09-16T09:00:00.000Z',
  patientName: 'Kanika',
  summaryOverview: 'Integrated medical and psychiatric care plan for longstanding (9-year) Type 2 Diabetes Mellitus and secondary Major Depressive Disorder with diabetic peripheral neuropathy. Focuses on dual glycemic stabilization and neurotransmitter support to eliminate debilitating glucose spikes and alleviate chronic illness burnout.',
  activeConditions: [
    'Type 2 Diabetes Mellitus (9-Year Longstanding Duration)',
    'Major Depressive Disorder Secondary to Chronic Illness (PHQ-9: 16)',
    'Diabetic Distal Symmetric Peripheral Neuropathy',
    'Early Diabetic Microalbuminuria (Renal Protection Active)',
    'Diabetic Dyslipidemia (Cardioprotective Statin Protocol)',
    'Penicillin Drug Allergy (Strict Anaphylactic Contraindication)'
  ],
  allergies: ['Penicillin (Anaphylactic Reaction / Angioedema & Hives)'],
  medications: [
    {
      id: 'med-001',
      name: 'Duloxetine (Cymbalta)',
      genericName: 'Duloxetine Delayed-Release 60mg',
      dosage: '60mg, 1 Capsule',
      form: 'Capsule',
      conditionTreated: 'Major Depressive Disorder & Diabetic Peripheral Neuropathic Pain',
      timingSlot: 'MORNING',
      exactTime: '08:00 AM',
      relationToMeal: 'With Meal',
      specialInstructions: 'Take with breakfast. Dual-action SNRI treating both depression and diabetic nerve burning. Do not crush or chew capsule.',
      pillsRemaining: 24,
      totalPackSize: 30,
      dailyDoseCount: 1,
      daysRemaining: 24,
      restockAlertLevel: 'GOOD',
      restockByDate: '2026-10-12',
      prescribingDoctor: 'Dr. Marcus Vance, MD (Neuropsychiatry)',
      doctorPhone: '+1 (555) 441-2890',
      sourceDocumentId: 'doc-recent-001',
      particularDietForProblem: 'Neuro-Supportive Omega-3 & Magnesium Mood Diet'
    },
    {
      id: 'med-002',
      name: 'Metformin ER (Morning Dose)',
      genericName: 'Metformin Hydrochloride Extended Release 1000mg',
      dosage: '1000mg, 1 Tablet',
      form: 'Tablet',
      conditionTreated: 'Type 2 Diabetes (Insulin Sensitization & Glucose Regulation)',
      timingSlot: 'MORNING',
      exactTime: '08:00 AM',
      relationToMeal: 'With Meal',
      specialInstructions: 'Must take WITH breakfast food to prevent gastrointestinal discomfort. Swallow whole with full glass of water.',
      pillsRemaining: 2,
      totalPackSize: 60,
      dailyDoseCount: 2,
      daysRemaining: 1,
      restockAlertLevel: 'CRITICAL',
      restockByDate: '2026-09-19',
      prescribingDoctor: 'Dr. Sarah Jenkins, MD (Endocrinology)',
      doctorPhone: '+1 (555) 234-8900',
      sourceDocumentId: 'doc-recent-001',
      particularDietForProblem: 'Low Glycemic Index (<55) Complex Carbohydrate Diet'
    },
    {
      id: 'med-003',
      name: 'Empagliflozin (Jardiance)',
      genericName: 'Empagliflozin 10mg',
      dosage: '10mg, 1 Tablet',
      form: 'Tablet',
      conditionTreated: 'Type 2 Diabetes & Cardiorenal Microalbuminuria Protection',
      timingSlot: 'MORNING',
      exactTime: '08:30 AM',
      relationToMeal: 'After Meal',
      specialInstructions: 'Drink at least 2.5L of water daily to support urinary glucose clearance and protect renal filtration.',
      pillsRemaining: 16,
      totalPackSize: 30,
      dailyDoseCount: 1,
      daysRemaining: 16,
      restockAlertLevel: 'GOOD',
      restockByDate: '2026-10-04',
      prescribingDoctor: 'Dr. Sarah Jenkins, MD (Endocrinology)',
      doctorPhone: '+1 (555) 234-8900',
      sourceDocumentId: 'doc-recent-001',
      particularDietForProblem: 'High-Hydration Renal Protective Diet'
    },
    {
      id: 'med-004',
      name: 'Metformin ER (Evening Dose)',
      genericName: 'Metformin Extended Release 1000mg',
      dosage: '1000mg, 1 Tablet',
      form: 'Tablet',
      conditionTreated: 'Type 2 Diabetes (Nocturnal Glycemic Stabilization & Dawn Phenomenon)',
      timingSlot: 'EVENING',
      exactTime: '07:30 PM',
      relationToMeal: 'With Meal',
      specialInstructions: 'Take with dinner food. Prevents morning fasting glucose surges (dawn phenomenon).',
      pillsRemaining: 3,
      totalPackSize: 60,
      dailyDoseCount: 2,
      daysRemaining: 1,
      restockAlertLevel: 'CRITICAL',
      restockByDate: '2026-09-19',
      prescribingDoctor: 'Dr. Sarah Jenkins, MD',
      doctorPhone: '+1 (555) 234-8900',
      sourceDocumentId: 'doc-recent-001',
      particularDietForProblem: 'Low-GI Evening Plate (< 30g Net Carbs)'
    },
    {
      id: 'med-005',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium 20mg',
      dosage: '20mg, 1 Tablet',
      form: 'Tablet',
      conditionTreated: 'Diabetic Dyslipidemia & Atherosclerotic Vascular Protection',
      timingSlot: 'BEDTIME',
      exactTime: '10:00 PM',
      relationToMeal: 'Anytime',
      specialInstructions: 'Take at bedtime. Do not consume grapefruit or grapefruit juice as it inhibits hepatic metabolism.',
      pillsRemaining: 21,
      totalPackSize: 30,
      dailyDoseCount: 1,
      daysRemaining: 21,
      restockAlertLevel: 'GOOD',
      restockByDate: '2026-10-09',
      prescribingDoctor: 'Dr. Sarah Jenkins, MD',
      doctorPhone: '+1 (555) 234-8900',
      sourceDocumentId: 'doc-hist-002',
      particularDietForProblem: 'Heart-Healthy Lipid Stabilization Diet'
    },
    {
      id: 'med-006',
      name: 'Dextrose Glucose Gel / Tabs (SOS)',
      genericName: 'Fast-Acting Dextrose Gel 15g',
      dosage: '15g Carbohydrate Unit',
      form: 'Drops',
      conditionTreated: 'Acute Hypoglycemia Rescue (Blood Sugar < 70 mg/dL)',
      timingSlot: 'MORNING',
      exactTime: 'As Needed (SOS)',
      relationToMeal: 'Anytime',
      specialInstructions: 'Consume immediately if blood sugar drops below 70 mg/dL or if cold sweats, shakiness, or severe anxiety occur.',
      pillsRemaining: 6,
      totalPackSize: 10,
      dailyDoseCount: 0,
      daysRemaining: 99,
      restockAlertLevel: 'GOOD',
      restockByDate: '2027-01-01',
      prescribingDoctor: 'Dr. Sarah Jenkins, MD',
      doctorPhone: '+1 (555) 234-8900',
      sourceDocumentId: 'doc-recent-001',
      particularDietForProblem: 'Rule of 15 Hypoglycemia Protocol'
    }
  ],
  eatingHabits: [
    {
      id: 'habit-001',
      category: 'FOODS_TO_EAT',
      title: 'Neuro-Supportive Omega-3 & Magnesium Foods (Mood & Neuropathy)',
      description: 'Prioritize wild-caught salmon, chia seeds, walnuts, pumpkin seeds, and dark leafy greens (spinach, kale, Swiss chard) at lunch and dinner.',
      targetMeal: 'All Day',
      prescribedReason: 'Combats neuro-inflammation linked to chronic illness depression and reduces diabetic peripheral nerve discomfort.',
      priority: 'MANDATORY',
      relatedProblem: 'Major Depressive Disorder & Diabetic Neuropathy'
    },
    {
      id: 'habit-002',
      category: 'MEAL_TIMING',
      title: 'Rigid 3.5 to 4-Hour Meal Pacing (Anti-Hypoglycemia Protocol)',
      description: 'Never skip breakfast or postpone lunch past 1:30 PM after taking morning diabetes and depression medications. Paced meals keep glucose in target 80-140 mg/dL range.',
      targetMeal: 'Breakfast',
      prescribedReason: 'Skipping meals causes severe hypoglycemia, which triggers adrenaline surges mimicking panic attacks and severe depressive crashes.',
      priority: 'MANDATORY',
      relatedProblem: 'Type 2 Diabetes Mellitus & Mood Volatility'
    },
    {
      id: 'habit-003',
      category: 'FOODS_TO_AVOID',
      title: 'Strict Elimination of Refined Sugars & Ultra-Processed Carbs',
      description: 'Eliminate sugar-sweetened beverages, sodas, white sandwich bread, pastries, sweetened yogurts, and candy. Limit net carbs to <45g per meal.',
      targetMeal: 'All Day',
      prescribedReason: 'High glycemic foods trigger rapid blood glucose spikes >200 mg/dL followed by insulin crashes, driving severe brain fog, irritability, and chronic depressive despair.',
      priority: 'MANDATORY',
      relatedProblem: 'Type 2 Diabetes (HbA1c Elevation) & Depressive Swings'
    },
    {
      id: 'habit-004',
      category: 'HYDRATION',
      title: 'Therapeutic Hydration for SGLT2 Renal Cleansing (2.5L Daily)',
      description: 'Consume 8 to 10 glasses (2.5 liters) of clean water throughout the day. Finish heavy fluid intake 90 minutes before sleep.',
      targetMeal: 'All Day',
      prescribedReason: 'Empagliflozin flushes glucose through urine; adequate hydration prevents urinary tract infections and protects renal filtration.',
      priority: 'MANDATORY',
      relatedProblem: 'Empagliflozin SGLT2 Hydration & Microalbuminuria'
    },
    {
      id: 'habit-005',
      category: 'INTERACTION_ALERT',
      title: 'Strict Alcohol Avoidance with Metformin & Duloxetine',
      description: 'Avoid beer, wine, and liquor. Alcohol impairs liver gluconeogenesis causing dangerous delayed nocturnal hypoglycemia and worsens depression.',
      targetMeal: 'Dinner',
      prescribedReason: 'Dangerous drug interaction risking lactic acidosis with Metformin and intensified sedation/depression with Duloxetine.',
      priority: 'MANDATORY',
      relatedProblem: 'Metformin & Duloxetine Drug Safety'
    }
  ],
  problemDiets: [
    {
      id: 'pd-001',
      problem: 'Type 2 Diabetes Mellitus (Longstanding 9-Year Glycemic Control)',
      severityOrTarget: 'Target HbA1c < 7.0%, Fasting Glucose 80-130 mg/dL',
      dietName: 'Low-Glycemic Index (<55) Complex Fiber Protocol',
      prescribedDiet: 'High-fiber, low-glycemic dietary framework focusing on slow-digesting complex carbohydrates, non-starchy vegetables, and lean proteins.',
      foodsToEat: [
        'Steel-cut oats with chia seeds',
        'Steamed broccoli, cauliflower, Brussels sprouts',
        'Avocados and extra virgin olive oil',
        'Tricolor quinoa and brown basmati rice in measured portions',
        'Skinless poultry and wild fish'
      ],
      foodsToAvoid: [
        'White bread, refined white pasta, and pizza crust',
        'Fruit juices, regular sodas, and sweet tea',
        'Cakes, pastries, cookies, and candy',
        'Fried battered meats and french fries'
      ],
      clinicalRationale: 'Soluble fiber forms a gelatinous matrix in the digestive tract that slows glucose absorption, eliminating dangerous post-prandial hyperglycemic spikes.',
      mealTimingAdvice: 'Eat balanced meal within 45 minutes of waking with Metformin ER and Duloxetine; maintain regular 3-4 hour intervals.',
      prescribingDoctor: 'Dr. Sarah Jenkins, MD'
    },
    {
      id: 'pd-002',
      problem: 'Major Depressive Disorder Secondary to Chronic Diabetes Distress',
      severityOrTarget: 'PHQ-9 Score: 16 (Moderate-to-Severe) → Target < 8',
      dietName: 'Neuro-Supportive Mediterranean Mood Diet',
      prescribedDiet: 'Anti-inflammatory Mediterranean nutritional plan rich in omega-3 polyunsaturated fatty acids, magnesium, zinc, and B-complex vitamins.',
      foodsToEat: [
        'Wild salmon, sardines, and mackerel (2-3 times weekly)',
        'Raw walnuts, pumpkin seeds, and almonds',
        'Dark leafy greens (spinach, Swiss chard, arugula)',
        'Wild blueberries and blackberries (low GI antioxidant fruits)',
        'Unsweetened Greek yogurt with active probiotics'
      ],
      foodsToAvoid: [
        'Processed deli meats with nitrates',
        'High-fructose corn syrup',
        'Sugary confectionery that induces dopamine spikes and severe crashes',
        'Excessive caffeine (>2 cups daily) causing jittery anxiety'
      ],
      clinicalRationale: 'Omega-3 fatty acids EPA and DHA incorporate into neuronal cell membranes, reducing neuro-inflammation, while magnesium supports GABAergic pathways to ease chronic illness burnout.',
      mealTimingAdvice: 'Pair evening meals with tryptophan-rich proteins (turkey, eggs, nuts) to facilitate nighttime serotonin and melatonin production for restorative sleep.',
      prescribingDoctor: 'Dr. Marcus Vance, MD'
    },
    {
      id: 'pd-003',
      problem: 'Diabetic Peripheral Neuropathy & Microalbuminuria',
      severityOrTarget: 'UACR 42 mg/g → Target < 30 mg/g; Peripheral Paresthesias',
      dietName: 'Renal-Protective Antioxidant Regimen',
      prescribedDiet: 'Sodium-moderated (<2,000 mg/day), antioxidant-dense protocol supporting microvascular endothelial integrity and renal glomeruli.',
      foodsToEat: [
        'Fresh garlic, onions, and turmeric (anti-inflammatory spices)',
        'Bell peppers, cucumbers, and celery',
        'Water with lemon for urinary tract alkalinity',
        'Flaxseed and extra virgin cold-pressed olive oil'
      ],
      foodsToAvoid: [
        'Excessive sodium (>2,000 mg/day) from pickles, canned soups, and salty chips',
        'Artificial sweeteners that disrupt gut microbiome',
        'Trans fats and partially hydrogenated oils'
      ],
      clinicalRationale: 'Lowering vascular oxidative stress preserves the micro-capillaries supplying peripheral nerves and preserves glomerular filtration barrier.',
      mealTimingAdvice: 'Drink 1 full glass of water with each meal and maintain constant daylight hydration.',
      prescribingDoctor: 'Dr. Sarah Jenkins, MD'
    }
  ],
  dailyTimetable: [
    {
      slot: 'MORNING',
      label: 'Morning Awakening & Glycemic Start',
      timeRange: '07:30 AM – 09:00 AM',
      eatingGuidelines: [
        'Eat a low-GI breakfast within 45 minutes of waking (e.g., steel-cut oats with walnuts and chia, or poached eggs on sprouted grain).',
        'Drink 2 full glasses of water before taking Empagliflozin for kidney clearance.'
      ],
      medications: [
        {
          medId: 'med-001',
          name: 'Duloxetine (Cymbalta)',
          dosage: '60mg, 1 Capsule',
          form: 'Capsule',
          relationToMeal: 'With Meal',
          exactTime: '08:00 AM',
          conditionTreated: 'Major Depressive Disorder & Diabetic Neuropathic Nerve Pain',
          instructions: 'Take with breakfast food. Dual-action SNRI for mood and neuropathy.',
          taken: false,
          particularDietForProblem: 'Neuro-Supportive Omega-3 & Magnesium Mood Diet'
        },
        {
          medId: 'med-002',
          name: 'Metformin ER (Morning)',
          dosage: '1000mg, 1 Tablet',
          form: 'Tablet',
          relationToMeal: 'With Meal',
          exactTime: '08:00 AM',
          conditionTreated: 'Type 2 Diabetes (Insulin Sensitization)',
          instructions: 'CRITICAL RESTOCK: Only 2 doses left. Must take with food.',
          taken: false,
          particularDietForProblem: 'Low Glycemic Index (<55) Complex Carbohydrate Diet'
        },
        {
          medId: 'med-003',
          name: 'Empagliflozin (Jardiance)',
          dosage: '10mg, 1 Tablet',
          form: 'Tablet',
          relationToMeal: 'After Meal',
          exactTime: '08:30 AM',
          conditionTreated: 'Type 2 Diabetes & Cardiorenal Protection',
          instructions: 'Take with full glass of water. Maintain hydration throughout daylight.',
          taken: false,
          particularDietForProblem: 'High-Hydration Renal Protective Diet'
        }
      ],
      problemDietsInSlot: [
        { problem: 'Type 2 Diabetes Mellitus', diet: 'Low-Glycemic Index (<55) Breakfast' },
        { problem: 'Major Depressive Disorder', diet: 'Omega-3 & Magnesium Morning Boost' }
      ]
    },
    {
      slot: 'AFTERNOON',
      label: 'Midday Metabolic Stabilization & Walk',
      timeRange: '12:30 PM – 02:00 PM',
      eatingGuidelines: [
        'Balanced lunch: Grilled salmon or chicken breast with steamed greens and quinoa. Net carbs < 40g.',
        'Follow with 15-minute gentle walk to stimulate post-meal glucose uptake into muscles and boost mood.'
      ],
      medications: [],
      problemDietsInSlot: [
        { problem: 'Diabetic Peripheral Neuropathy', diet: 'Vascular Movement & Low-Sodium Plate' }
      ]
    },
    {
      slot: 'EVENING',
      label: 'Dinner Glycemic Balance & Mood Calming',
      timeRange: '06:30 PM – 08:00 PM',
      eatingGuidelines: [
        'Light dinner: Roasted lean protein with fiber-dense cauliflower mash or salad. Avoid sweet desserts.',
        'Never drink alcohol with dinner (severe interaction with Metformin & Duloxetine).'
      ],
      medications: [
        {
          medId: 'med-004',
          name: 'Metformin ER (Evening)',
          dosage: '1000mg, 1 Tablet',
          form: 'Tablet',
          relationToMeal: 'With Meal',
          exactTime: '07:30 PM',
          conditionTreated: 'Type 2 Diabetes (Nocturnal Glycemic Stabilization)',
          instructions: 'Take with dinner food. CRITICAL RESTOCK REQUIRED.',
          taken: false,
          particularDietForProblem: 'Low-GI Evening Plate (< 30g Net Carbs)'
        }
      ],
      problemDietsInSlot: [
        { problem: 'Type 2 Diabetes Mellitus', diet: 'Low-GI Evening Carb Restriction' }
      ]
    },
    {
      slot: 'BEDTIME',
      label: 'Restful Sleep & Cardioprotective Dosing',
      timeRange: '09:30 PM – 10:30 PM',
      eatingGuidelines: [
        'No heavy food after 08:30 PM. If mild hunger occurs, 10 raw almonds or warm chamomile tea.',
        'Keep fast-acting Dextrose tabs at bedside table in case of night sweats / hypoglycemia.'
      ],
      medications: [
        {
          medId: 'med-005',
          name: 'Atorvastatin',
          dosage: '20mg, 1 Tablet',
          form: 'Tablet',
          relationToMeal: 'Anytime',
          exactTime: '10:00 PM',
          conditionTreated: 'Diabetic Dyslipidemia & Vascular Protection',
          instructions: 'Take at bedtime with water. Do not consume grapefruit.',
          taken: false,
          particularDietForProblem: 'Heart-Healthy Lipid Stabilization Diet'
        }
      ]
    }
  ],
  emergencyContacts: [
    {
      id: 'contact-001',
      doctorName: 'Dr. Sarah Jenkins, MD',
      specialty: 'Chief of Endocrinology & Diabetes Metabolism',
      hospitalOrClinic: 'Apex Diabetes & Metabolic Specialty Center',
      primaryPhone: '+1 (555) 234-8900',
      emergencyPhone: '+1 (555) 234-8999',
      clinicAddress: '742 Medical Center Blvd, Suite 410, Metro Health District',
      isPrimaryDoctor: true,
      messyConditionTriggers: [
        'Blood glucose spikes above 250 mg/dL accompanied by nausea or confusion',
        'Acute hypoglycemia dropping below 70 mg/dL not corrected after 15 minutes of glucose tabs',
        'Severe numbness or open cut/ulceration observed on feet or toes',
        'Signs of acute allergic reaction (facial swelling or hives - remember Penicillin allergy!)'
      ],
      firstAidSteps: [
        'For hypoglycemia (<70 mg/dL): Immediately consume 15g fast-acting glucose tabs or juice. Re-check in 15 minutes.',
        'For high glucose (>250 mg/dL): Drink 2 glasses of water, do not take unprescribed insulin, and call clinic immediately.',
        'Sit in a safe, comfortable chair and keep phone speaker active.'
      ]
    },
    {
      id: 'contact-002',
      doctorName: 'Dr. Marcus Vance, MD',
      specialty: 'Consulting Neuropsychiatrist & Behavioral Health Lead',
      hospitalOrClinic: 'Mind-Body Neuropsychiatry & Chronic Disease Wellness Clinic',
      primaryPhone: '+1 (555) 441-2890',
      emergencyPhone: '+1 (555) 441-2899',
      clinicAddress: '1200 Beacon Way, Suite 800, Metro Health District',
      isPrimaryDoctor: false,
      messyConditionTriggers: [
        'Overwhelming depressive despair, panic episodes, or acute crisis thoughts',
        'Severe insomnia with escalating feelings of hopelessness regarding chronic illness burden',
        'Sudden severe dizziness or adverse reaction to Duloxetine'
      ],
      firstAidSteps: [
        'Contact Dr. Marcus Vance or call the 988 National Suicide & Crisis Lifeline immediately.',
        'Have a family member or caregiver stay present.',
        'Take slow, deep diaphragmatic breaths and remain seated.'
      ]
    },
    {
      id: 'contact-003',
      doctorName: 'Elena Morgan',
      specialty: 'Primary Caregiver & Spouse (Emergency Proxy)',
      hospitalOrClinic: 'Home / Primary Contact',
      primaryPhone: '+1 (555) 312-4091',
      clinicAddress: 'Residential Care Contact',
      isPrimaryDoctor: false,
      messyConditionTriggers: [
        'Patient unresponsive, disoriented, or exhibiting severe hypoglycemic tremor',
        'Patient unable to take medications or prepare meals independently'
      ],
      firstAidSteps: [
        'Administer glucose gel between cheek and gum if conscious.',
        'Call 911 immediately if patient loses consciousness.'
      ]
    }
  ],
  emergencyGuidance: {
    redFlagSymptoms: [
      'Severe hypoglycemia (< 60 mg/dL) with cold sweats, tremors, or disorientation',
      'Hyperglycemic crisis (> 250 mg/dL) with persistent vomiting or fruity breath',
      'Acute chest tightness radiating to jaw or left arm',
      'Acute depressive despair or panic breakdown',
      'Sudden foot numbness with skin discoloration or skin breakdown'
    ],
    urgentActions: [
      '1. Tap the Call Doctor / Emergency button to dial Dr. Sarah Jenkins or 911 immediately.',
      '2. State patient diagnosis: 9-year Type 2 Diabetes, Severe Depression on Duloxetine & Metformin, Penicillin Allergy.',
      '3. Keep phone on speakerphone and remain seated upright.'
    ]
  }
};
