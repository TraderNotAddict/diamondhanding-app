export const getGeometryFromValueAndDuration = ({
	valueInUsd,
	durationInSeconds,
}: {
	valueInUsd: number;
	durationInSeconds: number;
}): "dot" | "line" | "triangle" | "diamond" => {
	const score = valueInUsd * (durationInSeconds / 1000);
	if (score > 250000) return "diamond";
	if (score > 100000) return "triangle";
	if (score > 50000) return "line";
	return "dot";
};
