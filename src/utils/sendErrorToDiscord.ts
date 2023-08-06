import fetch from "node-fetch";

export type DebugInfo = {
	errorType?: string;
	message?: string;
	data?: any;
	route: string;
};

export const sendErrorToDiscord = async (error: DebugInfo) => {
	const params: BodyInit = JSON.stringify({
		content: error.errorType ?? "Error",
		embeds: [
			{
				title: error.message ?? "Error",
				color: 15258703,
				thumbnail: {
					url: "",
				},
				fields: [
					{
						name: error.route,
						value: JSON.stringify(error.data),
						inline: true,
					},
				],
			},
		],
	});
	try {
		await fetch(process.env.DISCORD_WEBHOOK ?? "", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: params,
		});
	} catch (error) {
		console.error("Error sending error to discord:", error);
	}
};
