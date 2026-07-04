# WP50 Paid-First Postfix Live Check

| Case | Expected | Result | Evidence |
| --- | --- | --- | --- |
| fresh unpaid user | Cannot start questions before paid access | Pass | Production one-time start showed `Төлбөр баталгаажсаны дараа тест эхэлнэ`; no `Тест эхлүүлэх` button and no `Асуулт 1/` visible |
| invoice created pending | QPay invoice may be created, but test remains locked | Pass | Browser invoice created with QR and `Лавлах дугаар: WT_1783139711024_2545e476`; no start button or stage question visible |
| payment failed or unpaid | Pending/unpaid check must not unlock | Pass | Payment check returned `paid: false`, `status: pending`, `creditGranted: false`; browser remained locked |
| confirmed paid user | Should unlock only after confirmed paid state | Deferred | Real payment was not completed because owner approval was not provided |
| test start | Should become available only after confirmed paid state | Deferred | Not tested after payment because live payment was deferred |
| entitlement unlock | Should grant entitlement/credit only after paid confirmation | Deferred | Pending check returned `creditGranted: false`; paid entitlement not tested |
| reload restore | Paid access should persist if current system supports persistence | Deferred | Not tested because confirmed paid state was not created |
| paid report/depth | Paid depth must not appear before confirmed payment | Pass | Pending browser state did not show paid depth such as `14 хоногийн туршилт` or `Давтагддаг тойрог` |
| QPay amount 9900 | Invoice/check amount remains `9900` | Pass | Create result amount `9900`; check result amount `9900` |
| product code unchanged | Product code remains `WEIGHT_TEST_ONE_TIME` | Pass | Create/check result product code `WEIGHT_TEST_ONE_TIME` |
