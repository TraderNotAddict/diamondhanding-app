export const getIpfsUrl = (cid: string, fileName?: string) => {
	return (
		`https://${cid}.ipfs.nftstorage.link` + (fileName ? `/${fileName}` : "")
	);
};
