export type Geometry = "Dot" | "Line" | "Triangle" | "Diamond";

export const getGeometryFromValueAndDuration = ({
	valueInUsd,
	durationInSeconds,
}: {
	valueInUsd: number;
	durationInSeconds: number;
}): Geometry => {
	const score = valueInUsd * (durationInSeconds / 1000);
	if (score > 250000) return "Diamond";
	if (score > 100000) return "Triangle";
	if (score > 50000) return "Line";
	return "Dot";
};
