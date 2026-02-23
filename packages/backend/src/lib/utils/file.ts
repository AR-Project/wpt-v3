import { join, dirname, resolve } from "node:path";
import { existsSync } from "node:fs";

let memoizedRoot: string | null = null;

/**
 * Finds the monorepo root by looking for 'bun.lock'
 * starting from this file's directory.
 */
function getResolvedRoot(): string {
	if (memoizedRoot) return memoizedRoot;
	let currentDir = import.meta.dir; // The dir of this file
	const ROOT_ANCHOR = "bun.lock";

	// dirname of "C:/" is "C:/"
	while (currentDir !== dirname(currentDir)) {
		if (existsSync(join(currentDir, ROOT_ANCHOR))) {
			memoizedRoot = currentDir;
			return currentDir;
		}
		currentDir = dirname(currentDir);
	}

	// fallback
	return process.cwd();
}

/**
 * Resolves paths relative to the monorepo root.
 * Usage: resolveFromRoot("runtime-assets", "images", "logo.png")
 */
export function resolveFromRoot(...pathSegments: string[]): string {
	return resolve(getResolvedRoot(), ...pathSegments);
}
