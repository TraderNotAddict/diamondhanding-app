export function pickRandomElement<T>(arr: T[]): [number, T] {
	if (arr.length === 0) throw Error("Empty Array"); // or handle the empty array as needed
	const randomIndex = Math.floor(Math.random() * arr.length);
	return [randomIndex, arr[randomIndex]];
}
