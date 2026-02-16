export function arraysHaveEqualElements(array1: string[], array2: string[]) {
	if (array1.length !== array2.length) return false;
	const set1 = new Set(array1);
	const set2 = new Set(array2);
	if (set1.size !== set2.size) return false;

	for (const element of array1) {
		if (!set2.has(element)) return false;
	}
	return true;
}
