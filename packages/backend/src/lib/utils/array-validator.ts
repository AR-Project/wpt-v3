export function haveMismatch(arr1: string[], arr2: string[]): boolean {
	// 1. Instant exit if lengths differ
	if (arr1.length !== arr2.length) return true;

	const counts = new Map<string, number>();

	// 2. Count occurrences in the first array
	for (const item of arr1) {
		counts.set(item, (counts.get(item) || 0) + 1);
	}

	// 3. Subtract occurrences using the second array
	for (const item of arr2) {
		const count = counts.get(item);

		// If item doesn't exist or count is already 0, they aren't equal
		if (!count) return true;

		counts.set(item, count - 1);
	}

	// If we made it here, they are identical
	return false;
}
