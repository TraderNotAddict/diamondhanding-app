import { Duration } from "luxon";

export const renderDuration = (durationInSeconds: number): string => {
	const roundedDurationInSeconds = Math.floor(durationInSeconds);
	let remainder = roundedDurationInSeconds;
	const numDays = Math.floor(remainder / 86400);
	remainder = remainder - numDays * 86400;
	const numHours = Math.floor(remainder / 3600);
	remainder = remainder - numHours * 3600;
	const numMinutes = Math.floor(remainder / 60);
	remainder = remainder - numMinutes * 60;

	let result = "";
	if (numDays > 0) {
		result += `${numDays}D `;
	}
	result += `${numHours >= 10 ? numHours : `0${numHours}`}:`;
	result += `${numMinutes >= 10 ? numMinutes : `0${numMinutes}`}:`;
	result += `${remainder >= 10 ? remainder : `0${remainder}`}`;
	return result;
};
