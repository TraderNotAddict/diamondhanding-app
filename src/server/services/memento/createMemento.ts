import { NftCollection } from "@/models/enums/NftCollection";
import { NftTypes } from "@/models/enums/NftTypes";
import { Attribute, IMemento, Memento } from "@/models/memento";
import { prepareImageForUpload } from "./mint/metadata/image/prepareImageForUpload";
import { uploadImageToIpfs } from "./mint/metadata/image/uploadImageToIpfs";
import { getIpfsUrl } from "@/utils/getIpfsUrl";
import { createBlurhash } from "@/utils/createBlurhash";
import { prepareMetadataForUpload } from "./mint/metadata/prepareMetadataForUpload";
import { uploadMetadataToIpfs } from "./mint/metadata/uploadMetadataToIpfs";
import { nanoid } from "nanoid";
import { ASSET_LIST } from "@/utils/constants/assets";
import { IJob } from "@/models/job";
import { NextApiResponse } from "next";

/*
  0. Load job and check number of NFTs already minted.
  1. Generate Image - prepareImageForUpload
  2. Upload Image to IPFS - uploadImageToIpfs
  3. Generate Blurhash - createBlurhash
  4. Prepare Metadata - prepareMetadataForUpload
  5. Upload Metadata to IPFS - uploadMetadataToIpfs
  6. Insert memento document - mongoDB Operation

  Update progress and stream back to client
*/
export const createMemento = async ({
	job,
	updateAndRespond,
}: {
	job: IJob;
	updateAndRespond: () => void;
}) => {
	const uid = nanoid();
	const filename = `portal_${uid}`;
	const image = await prepareImageForUpload();
	updateAndRespond();
	const cid = await uploadImageToIpfs(image, filename + ".png");
	updateAndRespond();
	const imageUrl = getIpfsUrl(cid, filename + ".png");
	console.log(imageUrl);
	const blurhash = await createBlurhash(imageUrl);
	updateAndRespond();

	const metadata = await prepareMetadataForUpload({ imageUrl });
	updateAndRespond();
	const metadataCid = await uploadMetadataToIpfs(metadata, filename + ".json");
	updateAndRespond();
	const metadataUrl = getIpfsUrl(metadataCid, filename + ".json");
	console.log(metadataUrl);

	// sample memento for testing
	const memento: IMemento = {
		nftCollection: NftCollection.Dev1b,
		ownerSolanaWalletAddress: "9GV1VsCeUfATXoecCfEFMyJXaZomxD9zbE77hGpW7KGz",
		typeOfNft: NftTypes.cNFT,
		name: metadata.name as string,
		assetLocked: ASSET_LIST[0].mintAddress,
		quantityLocked: 1,
		valueLockedInUSD: 25.0,
		durationLockedInSeconds: 60 * 60 * 24 * 30,
		symbol: "Dev1b",
		description: "This is a test description for the NFT.",
		blurhash,
		image: imageUrl,
		metadataUri: metadataUrl,
		attributes: metadata.attributes as Attribute[],
		properties: metadata.properties ?? {},
	};

	const newMementoDoc = new Memento(memento);
	await newMementoDoc.save();
	updateAndRespond();

	return;
};
