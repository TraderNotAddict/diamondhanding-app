export const getAccessToken = () => {
	let accessToken;

	try {
		accessToken = process.env.ACCESS_TOKEN ?? "";
	} catch (error) {
		console.log(error);
	}

	return accessToken;
};
