# Mongolian Copy Surface Coverage

Every scenario declares an extraction type. FULL_SURFACE is a complete screen, ISOLATED_COMPONENT calls an existing component renderer, and ATTRIBUTE_ONLY extracts attributes only.

| Surface | Render function or source | Scenario implemented | Extraction type | Extracted entry count | Covered | Notes |
| ------- | ------------------------- | -------------------- | --------------- | --------------------: | ------- | ----- |
| COMING_SOON | renderComingSoon | coming-soon | FULL_SURFACE | 14 | YES |  |
| LANDING | renderLanding | landing | FULL_SURFACE | 39 | YES |  |
| ABOUT | renderAbout | about | FULL_SURFACE | 14 | YES |  |
| CHOICE | renderChoice | choice | FULL_SURFACE | 24 | YES |  |
| ONE_TIME_START | renderOneTimeStart | one-time-start | FULL_SURFACE | 27 | YES |  |
| ONE_TIME_PAYWALL | renderReport | one-time-unpaid | FULL_SURFACE | 44 | YES |  |
| ONE_TIME_REPORT | renderReport | one-time-paid | FULL_SURFACE | 72 | YES |  |
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
| SAMPLE_REPORT | renderSampleResultPreview | sample-report | ISOLATED_COMPONENT | 9 | YES |  |
| QUESTION_BANK | stageOneQuestions consumed by renderStageOne | question-bank | ISOLATED_COMPONENT | 84 | YES |  |
| ANSWER_OPTIONS | stageOneQuestions consumed by renderInput | answer-options | ISOLATED_COMPONENT | 518 | YES |  |
| ACCESSIBILITY | extractAccessibilityAttributes from exported renderers | accessibility | ATTRIBUTE_ONLY | 2 | YES |  |
