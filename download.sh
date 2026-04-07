#!/bin/bash
BASE="https://edukacjazeglarska.pl/almapress/aplikacja_zj_jsm"
OUT="$(dirname "$0")/content"
mkdir -p "$OUT"

# Save struct.js (navigation tree)
curl -s "$BASE/navi/js/struct.js" -o "$OUT/struct.js"

# Extract page paths
PAGES=$(grep -oE '"href":"pages/p[0-9]+/"' "$OUT/struct.js" | sed 's/"href":"//;s/"//' | sort -u)
TOTAL=$(echo "$PAGES" | wc -l | tr -d ' ')
echo "Found $TOTAL pages to download"

i=0
for page in $PAGES; do
    i=$((i+1))
    dir="$OUT/$page"
    mkdir -p "$dir"
    url="$BASE/$page""_page.0.html"
    echo "[$i/$TOTAL] $page"
    curl -s "$url" -o "$dir/_page.0.html"
    
    # Download referenced images/media from the page
    html="$dir/_page.0.html"
    if [ -f "$html" ]; then
        # Extract image/media references (src="..." patterns)
        refs=$(grep -oE 'src="[^"]*"' "$html" | sed 's/src="//;s/"//' | grep -v '^http' | grep -v '^\.\./api/' | grep -v '^about:' | grep -v '^\.\./js/' | sort -u)
        for ref in $refs; do
            refdir=$(dirname "$ref")
            mkdir -p "$dir/$refdir" 2>/dev/null
            refurl="$BASE/${page}${ref}"
            if [ ! -f "$dir/$ref" ]; then
                curl -s "$refurl" -o "$dir/$ref" 2>/dev/null
            fi
        done
    fi
    
    # Be polite
    sleep 0.1
done

echo "Done! Content saved to $OUT"
