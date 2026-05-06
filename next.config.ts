import type { NextConfig } from "next";
import { mkdirSync } from "fs";
import { join } from "path";

// Create required directories
const requiredDirs = [
  "lib/supabase",
  "app/login",
  "app/dashboard/analyses/[id]",
  "app/api/auth/logout",
  "app/api/analyses/save"
];

requiredDirs.forEach(dir => {
  try {
    mkdirSync(join(process.cwd(), dir), { recursive: true });
  } catch {
    // Directory may already exist
  }
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
