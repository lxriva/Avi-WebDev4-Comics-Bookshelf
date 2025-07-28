import json

def parse_volumes(input_file="comic_corpus.json", output_file="parsed_comics.txt"):
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    chunks = []
    for vol in data:
        name = vol.get("name", "Unknown Title")
        publisher = vol.get("publisher", "Unknown Publisher")
        issues = vol.get("count_of_issues", "?")
        year = vol.get("start_year", "?")
        desc = vol.get("description", "No description available.").strip()

        text_chunk = f"""
Title: {name}
Publisher: {publisher}
Year: {year}
Issues: {issues}
Description: {desc}
"""
        chunks.append(text_chunk.strip())

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n\n---\n\n".join(chunks))

    print(f"Parsed {len(chunks)} volumes to {output_file}")


if __name__ == "__main__":
    parse_volumes()
