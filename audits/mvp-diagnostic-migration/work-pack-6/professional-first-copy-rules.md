# Work Pack 6 Professional-First Copy Rules

## What professional-first means in user-facing language

Professional-first means the report pauses ordinary behavior-change interpretation because a body signal, medical context, severe distress signal, or safety pattern may need clarification before weight-loss advice. It is not a diagnosis and it is not a failure state.

Required language:

> Энэ нь онош биш.

> Энэ хэсэг жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй гэсэн чиглэл юм.

> Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв.

## What must never be said

- Do not say "эмнээс болсон".
- Do not say "глюкозоос болсон".
- Do not say "даавраас болсон".
- Do not say "PCOS-оос болсон".
- Do not say "онош".
- Do not say "эмчилгээ".
- Do not say "заавал эмчид оч".
- Do not say the user is unsafe, broken, or unable to change.
- Do not hide professional-first safety copy behind payment.

## How to avoid diagnosis

Use uncertainty language:

- "байж магадгүй"
- "тодруулах хэрэгтэй байж болно"
- "мэргэжлийн хүнтэй ярилцах нь зөв дараалал байж болно"

Do not assign cause. The copy can say a signal deserves clarification, but it cannot say which medical factor caused weight change or eating behavior.

## How to avoid fear pressure

Keep the safety message short, calm, and practical. Do not dramatize risk. Do not use urgent language unless the existing safety route explicitly requires urgent handling.

Preferred framing:

`Эхлээд биеийн дохиог тодруулах нь зөөлөн бөгөөд хариуцлагатай алхам.`

Avoid:

`Яаралтай аюултай байж магадгүй тул...`

## How to avoid payment-blocking safety

Safety direction must be shown before any paid depth, report expansion, PDF, or premium content. A user should never have to pay to learn that professional-first guidance is recommended.

Runtime gate for future work: any implementation must prove that professional-first safety copy is visible in the free/initial result path.

## Suggested Mongolian safety section template

## Анхаарах зүйл / мэргэжлийн зөвлөгөө

`Энэ нь онош биш. Энэ хэсэг жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй гэсэн чиглэл юм. Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв. Энэ нь таны буруу гэсэн үг биш; зөв дарааллыг аюулгүй болгох гэсэн алхам юм.`

## Specific sample for `medication_body_concern_professional_check`

`Таны хариултад биеийн өөрчлөлт, эмийн орчин, эсвэл эрүүл мэндийн дохиог эхлээд тодруулах хэрэгтэй байж магадгүй зураглал харагдаж байна. Энэ нь онош биш. Энэ хэсэг жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй гэсэн чиглэл юм.`

`Энэ тохиолдолд жирийн 14 хоногийн зан үйлийн туршилт санал болгохгүй. Харин өөрт ажиглагдсан өөрчлөлт, давтамж, санаа зовоож байгаа зүйлээ товч тэмдэглээд мэргэжлийн хүнтэй ярилцах нь илүү зөв дараалал байж болно. Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв.`

## Notes for PCOS/body uncertainty ordinary-mode copy

`pcos_body_uncertainty_control` is ordinary mode in the current test artifact, so it should not automatically suppress the 14-day experiment. However, copy must not claim PCOS, hormones, medication, or another medical cause as fact.

Recommended language:

`Биеийн өөрчлөлт юунаас болж байгааг мэдэхгүй үед хяналтаа буцааж авах гэсэн оролдлого хүчтэй болдог. Энэ нь PCOS, даавар, эсвэл өөр нэг шалтгаанаас болсон гэж хэлж байгаа хэрэг биш; зөвхөн тодорхойгүй байдал таны сонголтын ачааллыг нэмэгдүүлж байж магадгүй гэсэн зураглал юм.`

Owner gate: before runtime integration, owner should decide whether ordinary-mode body uncertainty needs a soft professional-context bridge in every report.
