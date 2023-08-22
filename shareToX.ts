export const shareToX = ({
	text,
	imageUrl,
	hashtags,
}: {
	text: string;
	imageUrl: string;
	hashtags?: string;
}) => {
	const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		text
	)}&url=${encodeURIComponent(imageUrl)}&hashtags=${hashtags ?? ""}`;
	window.open(url, "_blank"); // Opens in a new window
};
