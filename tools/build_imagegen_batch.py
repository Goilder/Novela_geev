import json
from pathlib import Path


ROOT = Path(r"G:\Project all\Novela-bl9t")
DOCS = ROOT / "docs"
MANIFEST = DOCS / "pampalche_asset_manifest.json"
OUT = ROOT / "asset_pipeline"


def slugify(value: str) -> str:
    allowed = []
    for ch in value.lower():
        if ch.isalnum():
            allowed.append(ch)
        elif ch in {" ", "-", "_", "/"}:
            allowed.append("_")
    text = "".join(allowed)
    while "__" in text:
        text = text.replace("__", "_")
    return text.strip("_") or "asset"


def ensure_dirs() -> None:
    for rel in [
        "prompts",
        "batches",
        "output/characters",
        "output/backgrounds",
        "output/props",
        "output/ui",
        "output/rewards",
        "reviews"
    ]:
        (OUT / rel).mkdir(parents=True, exist_ok=True)


def target_subdir(category: str) -> str:
    mapping = {
        "character": "characters",
        "character_sheet": "characters",
        "background": "backgrounds",
        "prop": "props",
        "ui": "ui",
        "reward": "rewards",
    }
    return mapping.get(category, "misc")


def build_prompt_text(asset: dict) -> str:
    lines = [
        f"Use case: stylized-concept",
        f"Asset type: game asset for family educational visual novel",
        f"Primary request: {asset['purpose']}",
        f"Style/medium: {asset['style']}",
        f"Composition/framing: {asset['composition']}",
        f"Constraints: family-friendly, child-safe, no aggression, no horror, no watermark, production-ready game asset",
        f"Avoid: dark horror mood, cluttered composition, extra text, photorealism unless implied",
        "",
        asset["prompt"],
    ]
    return "\n".join(lines)


def main() -> None:
    ensure_dirs()
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assets = manifest["assets"]

    queue = []
    review_rows = []

    for asset in assets:
        asset_id = asset["id"]
        category = asset["category"]
        subdir = target_subdir(category)
        ext = "png"
        prompt_text = build_prompt_text(asset)
        prompt_file = OUT / "prompts" / f"{asset_id}.txt"
        prompt_file.write_text(prompt_text, encoding="utf-8")

        output_path = OUT / "output" / subdir / f"{asset_id}.{ext}"
        record = {
            "id": asset_id,
            "category": category,
            "purpose": asset["purpose"],
            "format": asset["format"],
            "transparent_background": asset["transparent_background"],
            "prompt_file": str(prompt_file),
            "output_path": str(output_path),
            "prompt": prompt_text,
        }
        queue.append(record)
        review_rows.append(
            {
                "id": asset_id,
                "category": category,
                "status": "pending_generation",
                "output_path": str(output_path),
            }
        )

    (OUT / "batches" / "imagegen_queue.json").write_text(
        json.dumps(queue, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    (OUT / "batches" / "imagegen_queue.jsonl").write_text(
        "\n".join(json.dumps(item, ensure_ascii=False) for item in queue),
        encoding="utf-8",
    )

    (OUT / "reviews" / "generation_status.json").write_text(
        json.dumps(review_rows, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    summary = {
        "asset_count": len(queue),
        "manifest": str(MANIFEST),
        "queue_json": str(OUT / "batches" / "imagegen_queue.json"),
        "queue_jsonl": str(OUT / "batches" / "imagegen_queue.jsonl"),
        "prompts_dir": str(OUT / "prompts"),
        "output_root": str(OUT / "output"),
        "status_file": str(OUT / "reviews" / "generation_status.json"),
    }
    (OUT / "README.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
