#!/bin/sh
# Fails if build/css/tokens.css is not exactly what `npm run tokens` makes from tokens/*.json: a hand edit,
# or a token changed without regenerating. It puts the file back afterwards, so checking never changes it.
file=build/css/tokens.css
saved=$(mktemp)
cp "$file" "$saved"
npm run tokens --silent >/dev/null 2>&1
if cmp -s "$file" "$saved"; then
  status=0
else
  echo "$file is out of sync with tokens/. Edit tokens/*.json, then run: npm run tokens"
  status=1
fi
cp "$saved" "$file"
rm "$saved"
exit $status
