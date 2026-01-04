import type { Test } from "./types";

export function generateTestData() {
	const data: Test[] = [
		{
			id: 0,
			name: "manel",
		},
	];

	const idCounter = 5;

	return { data, idCounter };
}
