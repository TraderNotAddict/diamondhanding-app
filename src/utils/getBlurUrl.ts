import { decode } from "blurhash";

export function getBlurUrl(
	blurhash: string | undefined | null,
	width: number = 32,
	height: number = 32,
	punch: number = 1
) {
	punch = punch || 1;

	if (!blurhash) return;

	let url = "";
	// decode hash
	const pixels = decode(blurhash, width, height, punch);

	// temporary canvas to create a blob from decoded ImageData
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext("2d");
	const imageData = context!.createImageData(width, height);
	imageData.data.set(pixels);
	context!.putImageData(imageData, 0, 0);
	url = canvas.toDataURL();

	return url;
}
