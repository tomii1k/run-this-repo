#!/usr/bin/env python3
import os
from pathlib import Path

base_path = Path(r"c:\Users\tomas\Documents\vscode\RunthisRepo\run-this-repo")

dirs_to_create = [
    "lib/supabase",
    "app/login",
    "app/dashboard/analyses/[id]",
    "app/api/auth/logout",
    "app/api/analyses/save"
]

for dir_path in dirs_to_create:
    full_path = base_path / dir_path
    full_path.mkdir(parents=True, exist_ok=True)
    print(f"Created: {full_path}")

print("All directories created successfully!")
