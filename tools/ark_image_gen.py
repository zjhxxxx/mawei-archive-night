#!/usr/bin/env python3
"""Generate project image assets with Volcengine Ark image models.

This script uses the Ark-compatible image generation endpoint:
POST https://ark.cn-beijing.volces.com/api/v3/images/generations

Authentication:
- Read ARK_API_KEY from the environment.

Supported workflows:
- single image generation
- batch generation from a JSON file
"""

from __future__ import annotations

import argparse
import base64
import json
import os
from pathlib import Path
import sys
import time
from typing import Any
from urllib import request
from urllib.error import HTTPError

API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
DEFAULT_MODEL = "doubao-seedream-4-5-251128"
DEFAULT_SIZE = "2496x1664"


def die(message: str, code: int = 1) -> None:
    print(f"Error: {message}", file=sys.stderr)
    raise SystemExit(code)


def load_jobs(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        die(f"Batch file not found: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        die("Batch file must contain a JSON array.")
    return data


def ensure_key() -> str:
    api_key = os.getenv("ARK_API_KEY")
    if not api_key:
        die("ARK_API_KEY is not set in the current environment.")
    return api_key


def build_payload(job: dict[str, Any]) -> dict[str, Any]:
    model = job.get("model", DEFAULT_MODEL)
    payload = {
        "model": model,
        "prompt": job["prompt"],
        "size": job.get("size", DEFAULT_SIZE),
        "response_format": "b64_json",
        "watermark": False,
        "sequential_image_generation": "disabled",
        "optimize_prompt_options": {
            "mode": job.get("optimize_mode", "standard"),
        },
    }

    if "seedream-5-0" in model:
        payload["output_format"] = job.get("output_format", "png")

    if "image" in job:
        payload["image"] = job["image"]

    if "tools" in job:
        payload["tools"] = job["tools"]

    return payload


def call_api(api_key: str, payload: dict[str, Any]) -> dict[str, Any]:
    req = request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=300) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        die(f"Ark API returned {exc.code}: {body}")


def write_output(data_item: dict[str, Any], out_path: Path) -> None:
    image_b64 = data_item.get("b64_json")
    if not image_b64:
        die(f"Response did not include b64_json for {out_path.name}.")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(base64.b64decode(image_b64))


def generate_job(api_key: str, job: dict[str, Any]) -> Path:
    out_path = Path(job["out"])
    payload = build_payload(job)

    print(f"Generating: {out_path.name}", file=sys.stderr)
    started = time.time()
    response = call_api(api_key, payload)

    data = response.get("data")
    if not isinstance(data, list) or not data:
        die(f"Ark response missing image data: {json.dumps(response, ensure_ascii=False)}")

    first = data[0]
    if isinstance(first, dict) and first.get("error"):
        die(f"Ark image generation failed for {out_path.name}: {json.dumps(first['error'], ensure_ascii=False)}")

    write_output(first, out_path)
    duration = time.time() - started
    print(f"Saved {out_path} in {duration:.1f}s", file=sys.stderr)
    return out_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate project assets with Volcengine Ark.")
    parser.add_argument("--batch", help="Path to a JSON array of generation jobs.")
    parser.add_argument("--prompt", help="Single-image prompt.")
    parser.add_argument("--out", help="Single-image output path.")
    parser.add_argument("--size", default=DEFAULT_SIZE)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--output-format", default="png")
    args = parser.parse_args()

    api_key = ensure_key()

    if args.batch:
        jobs = load_jobs(Path(args.batch))
        for job in jobs:
            generate_job(api_key, job)
        return 0

    if not args.prompt or not args.out:
        die("Use --batch, or provide both --prompt and --out.")

    generate_job(
        api_key,
        {
            "prompt": args.prompt,
            "out": args.out,
            "size": args.size,
            "model": args.model,
            "output_format": args.output_format,
        },
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
