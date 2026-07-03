# Visible Surface Test Coverage

## Test File

`tests/visible-surface-prototype.test.js`

## Registered Test

`tests/run-all.js` includes:

```js
["node", ["tests/visible-surface-prototype.test.js"]]
```

## Assertions Covered

- visible prototype guard defaults false;
- disabled prototype path returns empty HTML;
- disabled prototype path leaves report HTML unchanged;
- disabled prototype path leaves state unchanged;
- preview surface renders only under explicit enabled helper options;
- paid surface renders only with paid access;
- safety guidance renders without payment;
- payment failure keeps safety guidance visible;
- professional and urgent modes suppress ordinary surfaces while preserving safety guidance;
- `professionalFirst: true` and `urgent: true` suppress ordinary surfaces while preserving safety guidance;
- `internalDiagnostics` does not render;
- `ownerDebug` does not render;
- adapter field names do not render;
- internal fixture/debug names do not render;
- payment mechanics text does not render;
- diagnosis/treatment/prescribing claim words do not render;
- entitlement checks remain unchanged;
- localStorage is not read;
- console logging is not added;
- QPay/pricing/payment constants remain present in `app.js`;
- exact WP20 artifact filenames are enforced.

## Regression Coverage

Full regression command:

```bash
npm test
```
