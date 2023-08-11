import { blurhashFromURL } from "blurhash-from-url";

export const createBlurhash = async (imageUrl: string) => {
	const blurHash = await blurhashFromURL(imageUrl);
	return blurHash.encoded;
};
