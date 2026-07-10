"""
Step 1: Scrape product descriptions from kairosbookshop.org
and build a structured JSON data file for import.

Usage: python scripts/scrape-products.py
Output: public/import-data.json
"""
import csv, re, json, time, os, sys
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

CSV_PATH = "public/wc-product-export-10-7-2026-1783675859764.csv"
OUTPUT_PATH = "public/import-data.json"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
REQUEST_DELAY = 1.5  # seconds between requests (polite scraping)

CATEGORY_SLUG_MAP = {
    "Breakthrough": "breakthrough",
    "Deliverance": "deliverance",
    "Prayer": "prayer",
    "Spiritual Growth": "spiritual-growth",
    "Faith": "faith",
    "Prophetic": "prophetic",
    "Healing": "healing",
    "Spiritual Warfare": "spiritual-warfare",
    "Finances/Giving": "finances-giving",
    "Personal Development": "personal-development",
    "Prosperity": "prosperity",
    "Revival": "revival",
    "Pastoral ministry and Church Growth": "pastoral-ministry",
    "VGS Week Two 2025": "vgs-2025",
    "VGS Week Three 2025": "vgs-2025",
    "VGS Week four 2025": "vgs-2025",
}


class ShortDescParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_short_desc = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        if tag == "div" and "class" in attrs_d:
            classes = attrs_d["class"].split()
            if "woocommerce-product-details__short-description" in classes:
                self.in_short_desc = True

    def handle_endtag(self, tag):
        if self.in_short_desc and tag == "div":
            self.in_short_desc = False

    def handle_data(self, data):
        if self.in_short_desc:
            self.parts.append(data.strip())

    def get_text(self):
        return " ".join(p for p in self.parts if p)


def slugify(text):
    s = text.lower().strip()
    s = s.replace(":", "").replace("'", "").replace("&", "and")
    s = s.replace("–", "-").replace("—", "-")
    s = re.sub(r"[^a-z0-9-]", " ", s)
    s = re.sub(r"\s+", " ", s).strip().replace(" ", "-")
    s = re.sub(r"-+", "-", s)
    return s


def fetch_description(url):
    """Fetch product page and extract short description."""
    req = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        resp = urlopen(req, timeout=15)
        html = resp.read().decode("utf-8", errors="replace")
    except (HTTPError, URLError) as e:
        print(f"    HTTP error: {e}")
        return ""
    except Exception as e:
        print(f"    Error: {e}")
        return ""

    # Try short description first
    parser = ShortDescParser()
    parser.feed(html)
    text = parser.get_text()
    if text:
        return text

    # Fallback: meta AIOSEO description
    m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html, re.IGNORECASE)
    if m:
        return m.group(1)

    # Fallback: og:description
    m = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"', html, re.IGNORECASE)
    if m:
        return m.group(1)

    return ""


def process_csv():
    """Read CSV, group parents with variations."""
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    # Separate parents from variations
    parents = []
    current_parent = None

    for r in rows:
        t = r["Type"]
        if t in ("variable", "simple", "simple, downloadable, virtual"):
            current_parent = {
                "id": r["ID"],
                "sku": r["SKU"],
                "name": r["Name"].strip(),
                "type": t,
                "categories": r["Categories"],
                "image_url": r["Images"].strip(),
                "regular_price": r["Regular price"].strip(),
                "sale_price": r["Sale price"].strip(),
                "in_stock": r["In stock?"].strip(),
                "variations": [],
            }
            parents.append(current_parent)
        elif "variation" in t and current_parent is not None:
            attr_val = r.get("Attribute 1 value(s)", "").strip()
            price = r.get("Sale price", "").strip() or r.get("Regular price", "").strip()
            current_parent["variations"].append({
                "name": r["Name"].strip(),
                "type": t,
                "price": price,
                "attr_value": attr_val.lower() if attr_val else "",
                "download_url": r.get("Download 1 URL", "").strip(),
            })

    return parents


def deduplicate_variations(parents):
    """For each parent, deduplicate variations to unique formats with best price."""
    for p in parents:
        seen = {}
        for v in p["variations"]:
            fmt = v["attr_value"]
            if not fmt:
                # Try to infer from name: "- Softcopy", "- Audio Book"
                name_lower = v["name"].lower()
                if "softcopy" in name_lower or "soft copy" in name_lower:
                    fmt = "softcopy"
                elif "audio" in name_lower:
                    fmt = "audio_book"
                elif "hardcopy" in name_lower or "hard copy" in name_lower:
                    fmt = "hardcopy"
                else:
                    continue  # skip unidentifiable

            price_str = v["price"].replace(",", "")
            try:
                price = float(price_str) if price_str else 0
            except ValueError:
                price = 0

            # Keep the lowest observed price for each format
            if fmt not in seen or price < seen[fmt]["price"] or (
                price == seen[fmt]["price"] and price > 0
            ):
                seen[fmt] = {
                    "format": fmt,
                    "price": price,
                    "type": v["type"],
                    "download_url": v["download_url"],
                }

        p["unique_variants"] = list(seen.values())

        # If no variations were found, create a default HARDCOPY variant
        # from the parent's own price (simple products)
        if not p["unique_variants"]:
            price_str = (p["sale_price"] or p["regular_price"] or "").replace(",", "")
            try:
                price = float(price_str) if price_str else 0
            except ValueError:
                price = 0
            p["unique_variants"] = [{"format": "hardcopy", "price": price, "type": p["type"], "download_url": ""}]

        # Clean up temp field
        del p["variations"]

    return parents


def scrape_descriptions(parents):
    """Fetch descriptions from the live site."""
    total = len(parents)
    successes = 0

    for i, p in enumerate(parents):
        slug = slugify(p["name"])
        url = f"https://kairosbookshop.org/product/{slug}/"
        print(f"  [{i+1}/{total}] {p['name'][:60]}...", end="")

        # Check if AIOSEO meta has description
        desc = ""
        p["description"] = ""

        try:
            desc = fetch_description(url)
            if desc:
                successes += 1
                print(f" OK ({len(desc)} chars)")
            else:
                print(" no description found")
        except Exception as e:
            print(f" error: {e}")

        p["description"] = desc.strip()

        # Be polite
        if i < total - 1:
            time.sleep(REQUEST_DELAY)

    print(f"\nScraped {successes}/{total} descriptions successfully")
    return parents


def build_category_list(parents):
    """Extract all unique categories from products."""
    cat_set = set()
    for p in parents:
        if p["categories"]:
            for c in p["categories"].split(","):
                cat_set.add(c.strip())
    categories = []
    for name in sorted(cat_set):
        slug = CATEGORY_SLUG_MAP.get(name, slugify(name))
        categories.append({"name": name, "slug": slug})
    return categories


def main():
    print("=" * 60)
    print("STEP 1: Processing CSV...")
    print("=" * 60)
    parents = process_csv()
    print(f"Found {len(parents)} unique products")

    print("\nDeduplicating variations...")
    parents = deduplicate_variations(parents)

    # Show stats
    with_variants = sum(1 for p in parents if p["unique_variants"])
    total_variants = sum(len(p["unique_variants"]) for p in parents)
    print(f"Products with variants: {with_variants}")
    print(f"Total deduplicated variants: {total_variants}")

    print("\n" + "=" * 60)
    print("STEP 2: Scraping descriptions from kairosbookshop.org...")
    print("=" * 60)
    parents = scrape_descriptions(parents)

    print("\n" + "=" * 60)
    print("STEP 3: Building output...")
    print("=" * 60)
    categories = build_category_list(parents)

    output = {
        "categories": categories,
        "author": "Dr. Isaiah Macwealth",
        "products": [],
    }

    for p in parents:
        slug = slugify(p["name"])
        product = {
            "title": p["name"],
            "slug": slug,
            "author": "Dr. Isaiah Macwealth",
            "description": p["description"],
            "image_url": p["image_url"],
            "categories": [c.strip() for c in p["categories"].split(",") if c.strip()],
            "featured": False,
            "variants": [],
        }
        for v in p["unique_variants"]:
            fmt_upper = v["format"].upper().replace(" ", "_")
            if fmt_upper == "SOFTCOPY":
                fmt_upper = "SOFTCOPY"
            elif fmt_upper == "AUDIO_BOOK":
                fmt_upper = "AUDIO_BOOK"
            else:
                fmt_upper = "HARDCOPY"

            compare_price = round(v["price"] * 1.3, -2) if v["price"] > 0 else 0  # ~30% higher as compare

            variant = {
                "format": fmt_upper,
                "price": v["price"],
                "comparePrice": compare_price,
                "stock": 50,
                "sku": p["sku"] if p["sku"] else "",
            }
            product["variants"].append(variant)

        output["products"].append(product)

    # Write JSON
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nData saved to {OUTPUT_PATH}")
    print(f"  Categories: {len(categories)}")
    print(f"  Products: {len(output['products'])}")
    print(f"  Total variants: {sum(len(p['variants']) for p in output['products'])}")

    # Print summary of scraped descriptions
    with_desc = sum(1 for p in output["products"] if p["description"])
    print(f"  With descriptions: {with_desc}")
    print(f"  Without descriptions: {len(output['products']) - with_desc}")


if __name__ == "__main__":
    main()
