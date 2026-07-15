# Mongolian Copy Surface Coverage

Every scenario declares an extraction type. FULL_SURFACE is a complete screen, ISOLATED_COMPONENT calls an existing component renderer, and ATTRIBUTE_ONLY extracts attributes only.

| Surface | Render function or source | Scenario implemented | Extraction type | Extracted entry count | Covered | Notes |
| ------- | ------------------------- | -------------------- | --------------- | --------------------: | ------- | ----- |
| COMING_SOON | renderComingSoon | coming-soon | FULL_SURFACE | 14 | YES |  |
| LANDING | renderLanding | landing | FULL_SURFACE | 41 | YES |  |
| ABOUT | renderAbout | about | FULL_SURFACE | 25 | YES |  |
| CHOICE | renderChoice | choice | FULL_SURFACE | 49 | YES |  |
| ONE_TIME_START | renderOneTimeStart | one-time-start | FULL_SURFACE | 27 | YES |  |
| ONE_TIME_PAYWALL | renderReport | one-time-unpaid | FULL_SURFACE | 45 | YES |  |
| ONE_TIME_REPORT | renderReport | one-time-paid | FULL_SURFACE | 72 | YES |  |
| SEVEN_DAY_PAYWALL | renderSevenDayPaywall | seven-day-paywall | FULL_SURFACE | 16 | YES |  |
| SEVEN_DAY_START | renderSevenDayStart | seven-day-start | FULL_SURFACE | 11 | YES |  |
| DIARY_HOME | renderDiaryHome | diary-home-zero | FULL_SURFACE | 9 | YES |  |
| DIARY_HOME | renderDiaryHome | diary-home-partial | FULL_SURFACE | 9 | YES |  |
| DIARY_HOME | renderDiaryHome | diary-home-complete | FULL_SURFACE | 9 | YES |  |
| DIARY_QUESTION | renderDiary using diaryQuestionIndex | diary-single | FULL_SURFACE | 11 | YES |  |
| DIARY_QUESTION | renderDiary using diaryQuestionIndex | diary-multi | FULL_SURFACE | 18 | YES |  |
| DIARY_QUESTION | renderDiary using diaryQuestionIndex | diary-scale | FULL_SURFACE | 18 | YES |  |
| DIARY_QUESTION | renderDiary using diaryQuestionIndex | diary-text | FULL_SURFACE | 9 | YES |  |
| DIARY_CONFIRMATION | renderDailySummaryConfirmation(D-SUM01) | diary-confirmation-empty | ISOLATED_COMPONENT | 4 | YES |  |
| DIARY_CONFIRMATION | renderDailySummaryConfirmation(D-SUM01) | diary-confirmation-awaiting | ISOLATED_COMPONENT | 7 | YES |  |
| DIARY_CONFIRMATION | renderDailySummaryConfirmation(D-SUM01) | diary-confirmation-confirmed | ISOLATED_COMPONENT | 7 | YES |  |
| DIARY_CONFIRMATION | renderDailySummaryConfirmation(D-SUM01) | diary-confirmation-edit | ISOLATED_COMPONENT | 8 | YES |  |
| DIARY_CONFIRMATION | renderDailySummaryConfirmation(D-SUM01) | diary-confirmation-add | ISOLATED_COMPONENT | 8 | YES |  |
| INSUFFICIENT_REPORT | renderReport | insufficient-report | FULL_SURFACE | 10 | YES |  |
| LIMITED_REPORT | renderReport | limited-report | FULL_SURFACE | 13 | YES |  |
| LIMITED_REPORT | renderReport | usable-limited-report | FULL_SURFACE | 13 | YES |  |
| FULL_SEVEN_DAY_REPORT | renderReport | full-seven-day-report | FULL_SURFACE | 77 | YES |  |
| UPGRADE_OFFER | renderUpgradeOffer | upgrade-offer-present | ISOLATED_COMPONENT | 7 | YES |  |
| UPGRADE_OFFER | renderUpgradeOffer | upgrade-offer-absent | ISOLATED_COMPONENT | 0 | YES | Entitled state correctly suppresses offer. |
| UPGRADE_PAYWALL | renderUpgradePaywall | upgrade-paywall | FULL_SURFACE | 15 | YES |  |
| LEAD_CAPTURE | renderLeadCapture | lead-capture | FULL_SURFACE | 16 | YES |  |
| LEAD_THANK_YOU | renderLeadThankYou | lead-thank-you | FULL_SURFACE | 7 | YES |  |
| GENERAL_SAFETY | renderOneTimeStart | general-safety | FULL_SURFACE | 27 | YES |  |
| PROFESSIONAL_SAFETY | renderReport | professional-safety | FULL_SURFACE | 26 | YES |  |
| URGENT_SAFETY | renderReport | urgent-mode-4 | FULL_SURFACE | 8 | YES |  |
| ADVISOR_PORTAL | renderCoachLogin | advisor-login | FULL_SURFACE | 6 | YES |  |
| VISIBLE_ERROR | renderCoachLogin with existing coachLoginError | advisor-login-error | ISOLATED_COMPONENT | 7 | YES |  |
| ADVISOR_PORTAL | renderCoachDashboard with mock empty advisor | advisor-dashboard-empty | FULL_SURFACE | 23 | YES |  |
| ADVISOR_PORTAL | renderCoachDashboard with mock paid client fixture | advisor-dashboard-populated | FULL_SURFACE | 25 | YES |  |
| ADMIN_PORTAL | renderAdminCoach with internalTest state | admin-portal | FULL_SURFACE | 10 | YES |  |
| OTHER_PROVEN_RENDERED | renderInternalTesterFeedbackSurvey with internalTest state | internal-feedback-survey | ISOLATED_COMPONENT | 51 | YES |  |
| OTHER_PROVEN_RENDERED | renderFeedbackThanks with internalTest state | internal-feedback-thanks | FULL_SURFACE | 5 | YES |  |
| OTHER_PROVEN_RENDERED | renderFeedbackExport with internalTest state | internal-feedback-export | FULL_SURFACE | 6 | YES |  |
| PAYMENT | renderContactCaptureForm | payment-contact | ISOLATED_COMPONENT | 9 | YES |  |
| QPAY | renderWeightQpayPaymentBox | qpay-pre-invoice | ISOLATED_COMPONENT | 2 | YES |  |
| QPAY | renderWeightQpayPaymentBox | qpay-invoice-created | ISOLATED_COMPONENT | 9 | YES |  |
| QPAY | renderWeightQpayPaymentBox | qpay-pending | ISOLATED_COMPONENT | 9 | YES |  |
| QPAY | renderWeightQpayPaymentBox | qpay-paid | ISOLATED_COMPONENT | 9 | YES |  |
| VISIBLE_ERROR | renderWeightQpayPaymentBox with qpayStatusMessage(error) | qpay-error | ISOLATED_COMPONENT | 3 | YES |  |
| SAMPLE_REPORT | renderSampleResultPreview | sample-report | ISOLATED_COMPONENT | 11 | YES |  |
| QUESTION_BANK | stageOneQuestions consumed by renderStageOne | question-bank | ISOLATED_COMPONENT | 84 | YES |  |
| ANSWER_OPTIONS | stageOneQuestions/dailyCore consumed by renderInput | answer-options | ISOLATED_COMPONENT | 601 | YES |  |
| ACCESSIBILITY | extractAccessibilityAttributes from exported renderers | accessibility | ATTRIBUTE_ONLY | 2 | YES |  |
