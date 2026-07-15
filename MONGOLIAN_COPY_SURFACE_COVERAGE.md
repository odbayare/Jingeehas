# Mongolian Copy Surface Coverage

Any PARTIAL or NO status means total render coverage is not complete.

| Surface | Render function or source | Scenario implemented | Extracted entry count | Covered | Notes |
| ------- | ------------------------- | -------------------- | --------------------: | ------- | ----- |
| COMING_SOON | renderComingSoon | coming-soon | 14 | YES |  |
| LANDING | renderLanding | landing | 41 | YES |  |
| ABOUT | renderAbout | about | 26 | YES |  |
| CHOICE | renderChoice | choice | 50 | YES |  |
| ONE_TIME_START | renderOneTimeStart | one-time-start | 28 | YES |  |
| ONE_TIME_PAYWALL | renderReport | one-time-unpaid | 46 | YES |  |
| ONE_TIME_REPORT | renderReport | one-time-paid | 73 | YES |  |
| SEVEN_DAY_PAYWALL | renderSevenDayPaywall | seven-day-paywall | 17 | YES |  |
| SEVEN_DAY_START | renderSevenDayStart | seven-day-start | 12 | YES |  |
| DIARY_HOME | renderDiary | diary-zero | 12 | YES |  |
| DIARY_HOME | renderDiary | diary-partial | 12 | YES |  |
| DIARY_QUESTION | renderDiary | diary-single | 12 | YES |  |
| DIARY_QUESTION | dailyCore -> renderDiary | diary-multi | 4 | YES |  |
| DIARY_QUESTION | dailyCore -> renderDiary | diary-scale | 3 | YES |  |
| DIARY_QUESTION | dailyCore -> renderDiary | diary-text | 2 | YES |  |
| DIARY_CONFIRMATION | renderDiary | diary-confirmation | 12 | PARTIAL | Confirmation depends on interactive completion; static render path captured. |
| INSUFFICIENT_REPORT | renderReport | insufficient-report | 11 | YES |  |
| LIMITED_REPORT | renderReport | limited-report | 14 | YES |  |
| LIMITED_REPORT | renderReport | usable-limited-report | 14 | YES |  |
| FULL_SEVEN_DAY_REPORT | renderReport | full-seven-day-report | 78 | YES |  |
| UPGRADE_OFFER | renderReport | upgrade-offer | 73 | PARTIAL | Offer is conditional; paid report scenario captured. |
| UPGRADE_PAYWALL | renderUpgradePaywall | upgrade-paywall | 16 | YES |  |
| LEAD_CAPTURE | renderLeadCapture | lead-capture | 20 | YES |  |
| LEAD_THANK_YOU | renderLeadThankYou | lead-thank-you | 8 | YES |  |
| GENERAL_SAFETY | renderOneTimeStart | general-safety | 28 | YES |  |
| PROFESSIONAL_SAFETY | renderReport | professional-safety | 27 | YES |  |
| URGENT_SAFETY | renderReport | urgent-mode-4 | 9 | YES |  |
| ADVISOR_PORTAL | renderCoachLogin | advisor-login | 7 | YES |  |
| ADVISOR_PORTAL | renderCoachDashboard | advisor-dashboard | 7 | PARTIAL | Dashboard state is available; populated remote clients are not created. |
| ADMIN_PORTAL | renderAdminCoach | admin-portal | 41 | YES |  |
| PAYMENT | renderContactCaptureForm | payment-contact | 9 | YES |  |
| QPAY | renderOneTimeStart | qpay-invoice | 28 | PARTIAL | No production invoice call; pre-invoice payment surface only. |
| QPAY | renderOneTimeStart | qpay-pending | 28 | PARTIAL | Mock state does not expose a standalone pending renderer. |
| QPAY | renderReport | qpay-paid | 73 | PARTIAL | Paid entitlement is mocked; no real invoice created. |
| VISIBLE_ERROR | renderOneTimeStart | payment-error | 28 | PARTIAL | No new visible error text injected; static error container path only. |
| SAMPLE_REPORT | renderChoice | sample-report | 50 | PARTIAL | Choice surface contains sample preview entry point; internal preview renderer is not exported. |
| QUESTION_BANK | stageOneQuestions -> renderStageOne | question-bank | 84 | YES |  |
| ANSWER_OPTIONS | stageOneQuestions/dailyCore -> renderInput | answer-options | 601 | YES |  |
| ACCESSIBILITY | rendered aria-label/placeholder extraction | accessibility | 78 | PARTIAL | Covers exported static renderers; browser-only post-interaction DOM is unavailable. |
