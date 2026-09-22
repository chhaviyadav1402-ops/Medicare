import { FullCarePlan, MedicalDocument, MoodLogEntry } from '../types';
import { WEATHER_CONFIGS } from '../data/defaultMoodData';

export function generateMedicalSummaryText(
  carePlan: FullCarePlan,
  documents: MedicalDocument[],
  moodLogs: MoodLogEntry[]
): string {
  const generatedAt = new Date().toLocaleString();
  const primaryDoc =
    carePlan.emergencyContacts.find((c) => c.isPrimaryDoctor) || carePlan.emergencyContacts[0];

  const divider = '================================================================================';
  const subDivider = '--------------------------------------------------------------------------------';

  // Mood calculations
  const totalMoods = moodLogs.length;
  const avgMood =
    totalMoods > 0
      ? (moodLogs.reduce((acc, m) => acc + m.moodRating, 0) / totalMoods).toFixed(1)
      : 'N/A';
  const avgEnergy =
    totalMoods > 0
      ? (moodLogs.reduce((acc, m) => acc + m.energyLevel, 0) / totalMoods).toFixed(1)
      : 'N/A';

  // Weather distribution
  const weatherSummary = (['SUNNY', 'PARTLY_CLOUDY', 'RAINY', 'THUNDERSTORM', 'SNOWY', 'WINDY', 'MISTY'] as const)
    .map((w) => {
      const count = moodLogs.filter((m) => m.weather === w).length;
      return count > 0 ? `${WEATHER_CONFIGS[w].label.split('&')[0].trim()}: ${count} days` : null;
    })
    .filter(Boolean)
    .join(' | ');

  let text = `${divider}
MEDICARE ROUTINE - COMPREHENSIVE MEDICAL CARE PLAN & HEALTH SUMMARY
Report Generated : ${generatedAt}
Patient Name      : ${carePlan.patientName || 'Eleanor Vance'}
${divider}

1. PATIENT & CLINICAL OVERVIEW
${subDivider}
Primary Care Physician : ${primaryDoc ? primaryDoc.doctorName : 'Dr. Sarah Jenkins, MD'}
Specialty              : ${primaryDoc ? primaryDoc.specialty : 'Cardiology & Internal Medicine'}
Hospital / Clinic      : ${primaryDoc ? primaryDoc.hospitalOrClinic : 'Memorial General Hospital'}
Emergency Phone        : ${primaryDoc ? primaryDoc.emergencyPhone || primaryDoc.primaryPhone : '+1 (555) 902-1144'}

Active Diagnoses / Conditions:
${carePlan.activeConditions.map((c) => `  * ${c}`).join('\n')}

Known Allergies & Adverse Reactions:
${carePlan.allergies.length > 0 ? carePlan.allergies.map((a) => `  ! ${a}`).join('\n') : '  * None documented'}

Clinical Summary:
${carePlan.summaryOverview}

${divider}
2. CURRENT MEDICATION DOSAGE SCHEDULE & HISTORY
${subDivider}
Total Prescribed Medications: ${carePlan.medications.length}

`;

  carePlan.medications.forEach((med, idx) => {
    const isUrgent = med.restockAlertLevel === 'CRITICAL' || med.restockAlertLevel === 'WARNING';
    text += `[${idx + 1}] ${med.name.toUpperCase()} (${med.dosage}, ${med.form})
    Condition Treated  : ${med.conditionTreated}
    Daily Timing       : ${med.timingSlot} at ${med.exactTime} (${med.relationToMeal})
    Prescribed Dosage  : ${med.specialInstructions}
    Current Inventory  : ${med.pillsRemaining} pills remaining (~${med.daysRemaining} days left)
    Restock Alert      : ${isUrgent ? 'URGENT: REFILL NEEDED (' + med.restockAlertLevel + ')' : 'Normal supply'}
    Prescribing Doctor : ${med.prescribingDoctor || 'Attending Physician'} (Phone: ${med.doctorPhone || 'N/A'})
    Particular Diet    : ${med.particularDietForProblem || 'Standard healthy diet'}
\n`;
  });

  text += `${divider}
3. DAILY MEDICATION & MEAL TIMETABLE
${subDivider}
`;

  carePlan.dailyTimetable.forEach((slot) => {
    text += `\n>> ${slot.label.toUpperCase()} (${slot.timeRange})
Eating Guidelines:
${slot.eatingGuidelines.map((g) => `   - ${g}`).join('\n')}

Scheduled Medications:
`;
    if (slot.medications.length === 0) {
      text += '   (No medications scheduled for this slot)\n';
    } else {
      slot.medications.forEach((m) => {
        text += `   * ${m.name} ${m.dosage} - ${m.relationToMeal} (${m.exactTime})
     Reason: ${m.conditionTreated} | ${m.instructions}\n`;
      });
    }

    if (slot.problemDietsInSlot && slot.problemDietsInSlot.length > 0) {
      text += 'Problem-Specific Dietary Rules for this slot:\n';
      slot.problemDietsInSlot.forEach((pd) => {
        text += `   * For ${pd.problem}: ${pd.diet}\n`;
      });
    }
  });

  text += `\n${divider}
4. PROBLEM-SPECIFIC EATING HABITS & NUTRITIONAL DIRECTIVES
${subDivider}
`;

  if (carePlan.problemDiets && carePlan.problemDiets.length > 0) {
    carePlan.problemDiets.forEach((pd) => {
      text += `\nPROBLEM / CONDITION: ${pd.problem.toUpperCase()}${pd.severityOrTarget ? ` (${pd.severityOrTarget})` : ''}
  Particular Diet  : ${pd.dietName}
  Diet Protocol    : ${pd.prescribedDiet}
  Clinical Rationale: ${pd.clinicalRationale}
  Meal Timing Advice: ${pd.mealTimingAdvice}
  Recommended Foods:
${pd.foodsToEat.map((f) => `    + ${f}`).join('\n')}
  Strictly Avoid   :
${pd.foodsToAvoid.map((f) => `    - ${f}`).join('\n')}
`;
    });
  }

  text += `\n${divider}
5. RECENT MOOD, ENERGY & BIOMETEOROLOGY TRENDS
${subDivider}
Total Logged Observations : ${totalMoods}
Average Mood Rating       : ${avgMood} / 5.0
Average Energy Level      : ${avgEnergy} / 5.0
Weather Coverage          : ${weatherSummary || 'None recorded'}

Recent Mood Chronology (Latest to Oldest):
`;

  if (moodLogs.length === 0) {
    text += '  No mood logs recorded yet.\n';
  } else {
    moodLogs.slice(0, 14).forEach((log) => {
      const wLabel = WEATHER_CONFIGS[log.weather]?.label || log.weather;
      text += `
Date & Time    : ${log.date} at ${log.time}
Mood Score     : ${log.mood} (${log.moodRating}/5)
Energy Level   : ${log.energyLevel}/5 | Sleep Quality: ${log.sleepQuality}
Outdoor Weather: ${wLabel} (${log.temperature})
Physical State : ${log.physicalFeelings.join(', ') || 'Normal'}
Meds on Time   : ${log.medsTakenOnTime ? 'Yes' : 'No'}
Weather Impact : ${log.weatherHealthImpact || 'None logged'}
Patient Notes  : ${log.notes || 'None'}
`;
    });
  }

  text += `\n${divider}
6. MEDICAL DOCUMENTS & CONSULTATION ARCHIVE
${subDivider}
Total Documents in Vault: ${documents.length}

`;

  documents.forEach((doc, idx) => {
    text += `[DOC-${idx + 1}] ${doc.title}
  Date Recorded    : ${doc.date} | Category: ${doc.category}
  Attending Doctor : ${doc.doctorName} (${doc.clinicOrHospital})
  Doctor Phone     : ${doc.doctorPhone || 'N/A'}
  Conditions Noted : ${doc.diagnoses.join(', ') || 'General Examination'}
  Allergies Noted  : ${doc.allergiesNoted?.join(', ') || 'None noted'}
  Doctor Directives:
    ${doc.doctorNotesRaw.replace(/\n/g, '\n    ')}
\n`;
  });

  text += `${divider}
7. EMERGENCY PROTOCOLS & DOCTOR CONTACT DIRECTORY
${subDivider}
Emergency Red Flag Symptoms:
${carePlan.emergencyGuidance.redFlagSymptoms.map((s) => `  [!] ${s}`).join('\n')}

Immediate Action Protocol:
${carePlan.emergencyGuidance.urgentActions.map((a) => `  * ${a}`).join('\n')}

Doctor Directory:
`;

  carePlan.emergencyContacts.forEach((contact) => {
    text += `  * ${contact.doctorName} (${contact.specialty})
    Hospital : ${contact.hospitalOrClinic}
    Phone    : ${contact.primaryPhone} | Emergency: ${contact.emergencyPhone || contact.primaryPhone}
    Address  : ${contact.clinicAddress}
    Triggers : ${contact.messyConditionTriggers.join('; ')}
\n`;
  });

  text += `${divider}
END OF CLINICAL REPORT - MEDICARE ROUTINE
This summary is prepared for patient personal health tracking and physician review.
${divider}
`;

  return text;
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
