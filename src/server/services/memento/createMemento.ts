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
import { getGeometryFromValueAndDuration } from "@/utils/getGeometryFromValueAndDuration";
import { pickRandomElement } from "@/utils/pickRandomArrayElement";
import { paperhandOptions } from "@/utils/constants/paperhand";

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
	updateAndRespond: (add?: number) => void;
}) => {
	if (!job.didMeetGoal && !job.verifiedAt) {
		// sample memento for testing
		const [_, item] = pickRandomElement(paperhandOptions);

		const memento: IMemento = {
			nftCollection:
				process.env.CLUSTER === "devnet"
					? NftCollection.Dev1b
					: NftCollection.PHBC,
			ownerSolanaWalletAddress: job.walletAddress,
			typeOfNft: NftTypes.cNFT,
			name: item.option.split(".")[0].split("_").join(" ").toUpperCase(),
			assetLocked: job.assetLocked,
			quantityLocked: job.quantityLocked,
			valueLockedInUSD: job.valueLockedInUSD,
			durationLockedInSeconds: job.durationLockedInSeconds,
			symbol: "PHBC",
			description: "n/a",
			blurhash: item.blurhash,
			image: item.imageUrl,
			metadataUri: "n/a",
			attributes: [
				{
					trait_type: "Geometry",
					value: "",
				},
			],
		};

		const newMementoDoc = new Memento(memento);
		try {
			await newMementoDoc.save();
		} catch (error) {
			console.log(error);
		}
		updateAndRespond(6);
	} else if (job.didMeetGoal === true && job.verifiedAt) {
		const uid = nanoid();
		const filename = `cc_${uid}`;
		const geometry = getGeometryFromValueAndDuration({
			valueInUsd: job.valueLockedInUSD,
			durationInSeconds: job.durationLockedInSeconds,
		});
		const artVariant = Math.floor(Math.random() * 20) + 1;
		const initiative = job.initiativeRank;
		const image = await prepareImageForUpload({
			geometry,
			initiative,
			artVariant,
		});
		console.log("image created");
		updateAndRespond();
		const cid = await uploadImageToIpfs(image, filename + ".png");
		console.log(cid);
		updateAndRespond();
		const imageUrl = getIpfsUrl(cid, filename + ".png");
		console.log(imageUrl);
		const blurhash = await createBlurhash(imageUrl);
		updateAndRespond();

		const metadata = await prepareMetadataForUpload({
			imageUrl,
			geometry,
			initiative,
			artVariant,
		});

		updateAndRespond();
		const metadataCid = await uploadMetadataToIpfs(
			metadata,
			filename + ".json"
		);
		updateAndRespond();
		const metadataUrl = getIpfsUrl(metadataCid, filename + ".json");

		// sample memento for testing
		const memento: IMemento = {
			nftCollection:
				process.env.CLUSTER === "devnet"
					? NftCollection.Dev1b
					: NftCollection.CC,
			ownerSolanaWalletAddress: job.walletAddress,
			typeOfNft: NftTypes.cNFT,
			name: metadata.name as string,
			assetLocked: job.assetLocked,
			quantityLocked: job.quantityLocked,
			valueLockedInUSD: job.valueLockedInUSD,
			durationLockedInSeconds: job.durationLockedInSeconds,
			symbol: metadata.symbol as string,
			description: metadata.description as string,
			blurhash,
			image: imageUrl,
			metadataUri: metadataUrl,
			attributes: metadata.attributes as Attribute[],
			properties: metadata.properties ?? {},
		};

		const newMementoDoc = new Memento(memento);
		await newMementoDoc.save();
		updateAndRespond();
	}

	return;
};
