# Gift-recipient surprise landing — local review candidate

Base: released `13b6aeaf6c3e924bc46868478ee17ed348f6d2ee`. The public gift.js was inspected and its SHA256 matched this base. The released recipient flow already displayed the giver's optional note as plain text immediately after preview; it did not have a gift-opening reveal. No private live recipient link or real invoice was created to inspect it.

## Behavior

A recipient link now opens a mobile-first Jingeehas card headed “Танд бэлэг ирлээ 🎁”, with a small green-and-gold CSS gift and “Бэлгээ нээх”. Opening the gift reveals the actual optional greeting and a separate “Бэлгээ хүлээн авах” button. Opening/revealing performs no claim or payment operation. Only explicit acceptance sends claim with accept=true. No sender name is invented. If the note is absent/blank, neutral generic copy is used. Multiline Mongolian greetings render as plain text and wrap without horizontal overflow.

The finite lid/spark/greeting animation is decorative. Reduced-motion preference disables transitions/animations and uses a static opened lid. No sound, autoplay media, external asset, third-party script, or analytics call was added. Keyboard focus moves to the greeting heading; the next Tab reaches acceptance. Privacy, safety guidance, terms and support links remain available.

The bearer fragment is removed before requests. It stays only in the existing page closure, never history/state/storage/logging. History stores only a boolean recipient-entry marker, so reloading the stripped link asks the recipient to reopen the original gift link instead of showing a purchase form. This intentionally does not persist a bearer just to make reload seamless. A fresh homepage-to-gift-page navigation still opens ordinary gift purchase. Back/reveal/reload cannot claim. An already claimed gift belonging to this recipient still resumes its existing assessment through preview; no additional claim occurs. Invalid/expired/other-recipient used links show a neutral unavailable explanation with no reveal/acceptance. A token invalidated after preview is rejected by the existing claim API.

## Verification and scope

Mocked gifting browser suite: 15/15 passed, including buyer/recovery flows, XSS/plain text, keyboard focus, no token/note persistence or analytics, reload/back, duplicate acceptance, expired claim, claimed-resume, 280-character Mongolian greeting, 375px and 320px widths, reduced motion and desktop decoration. Full unit and contract suites passed. Production package verification passed with 16 static files, 80 function files and 18 required endpoints. Ordinary generated app.js and questions.js hashes match the released production bytes exactly; no backend, SQL, QPay, ordinary assessment, entitlement, report, or tracking source changed.

Verification used a local clone containing tracked source plus the candidate edits, with existing dependencies. Untracked duplicate “ 2” files in the working repository were preserved and excluded from that package. Visual evidence and test logs are outside the repository at `../jingeehas-gift-surprise-evidence/`; no Library upload occurred.

This candidate is local only. No push, PR, merge, production deploy/migration, real payment, recipient email, new credential or access grant was performed for this enhancement. Publication awaits separate authorization.
