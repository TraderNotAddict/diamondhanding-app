import {
	Box,
	HStack,
	Heading,
	Stack,
	Tag,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import { Ref, forwardRef, useEffect, useMemo, useRef, useState } from "react";

import { motion } from "framer-motion";
import { UserAssetInfo } from "@/server/services/assets/retrieveAssetsByWalletAddress";
import { renderDuration } from "@/utils/renderDuration";
import { AddIcon } from "@chakra-ui/icons";
import { DateTime } from "luxon";
import { RectangleButton } from "./buttons/RectangleButton";
import { Asset } from "@/utils/constants/assets";
import { WithdrawButton } from "./buttons/WithdrawButton";
import debounce from "lodash/debounce";

interface PanelProps {
	asset: UserAssetInfo;
	onPaperHand: (asset: Asset) => void;
	onWithdraw: (asset: Asset) => void;
}

// eslint-disable-next-line react/display-name
const Panel = forwardRef((props: PanelProps, ref: Ref<HTMLDivElement>) => {
	const { asset, onPaperHand, onWithdraw } = props;

	const [isLoading, setIsLoading] = useState(false);

	const [countdown, setCountdown] = useState(
		Math.floor(asset.unlockDate! - DateTime.now().toSeconds())
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown(Math.floor(asset.unlockDate! - DateTime.now().toSeconds()));
		}, 1000);

		return () => clearInterval(interval);
	}, [asset.unlockDate]);

	const width = useBreakpointValue({
		base: "300px",
		md: "30%",
	});

	const getBackgroundColor = () => {
		switch (asset.asset.symbol) {
			case "SOL":
				return "#5ffbf1";
			case "mSOL":
				return "#86a8e7";
		}
	};

	const getColor = () => {
		switch (asset.asset.symbol) {
			case "SOL":
				return "black";
			case "mSOL":
				return "#86a8e7";
		}
	};

	return (
		<motion.div
			whileHover={{
				translateY: -5,
				transition: { duration: 0.1 },
			}}
			ref={ref}
			style={{
				width,
				borderColor: "gray.700",
				borderRadius: 0,
				borderWidth: 1,
				padding: 16,
				marginRight: 12,
				cursor: "pointer",
				marginTop: 5,
				marginBottom: 1,
				backgroundColor: "#131315",
				minHeight: 150,
			}}
		>
			<Stack alignItems="flex-start">
				<HStack>
					<Tag
						size="md"
						variant="solid"
						backgroundColor={getBackgroundColor()}
						borderRadius={0}
						fontWeight="bold"
						color={getColor()}
					>
						{asset.asset.symbol}
					</Tag>
					<Text color="gray.500">
						{asset.lockedBalance / Math.pow(10, asset.asset.decimals)}
					</Text>
				</HStack>
				<Text fontSize="4xl" fontWeight="bold">
					{countdown <= 0 ? "DIAMOND HANDED" : renderDuration(countdown)}
				</Text>
				{countdown <= 0 ? (
					<WithdrawButton
						text="UNHODL"
						asset={asset.asset}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
						onSuccess={() => onWithdraw(asset.asset)}
					/>
				) : (
					<RectangleButton
						isDisabled={!asset.canManuallyUnlock}
						onClick={() => {
							if (asset.canManuallyUnlock) {
								onPaperHand(asset.asset);
							}
						}}
					>
						{asset.canManuallyUnlock ? "PAPER HAND" : "DIAMOND HANDING"}
					</RectangleButton>
				)}
			</Stack>
		</motion.div>
	);
});

interface AddPanelProps {
	onClick: () => void | Promise<void>;
	isLoading: boolean;
}

// eslint-disable-next-line react/display-name
const AddPanel = forwardRef(
	(props: AddPanelProps, ref: Ref<HTMLDivElement>) => {
		const { onClick, isLoading } = props;

		const width = useBreakpointValue({
			base: "300px",
			md: "30%",
		});

		return (
			<Stack
				width={width}
				cursor={isLoading ? "not-allowed" : "pointer"}
				borderRadius={0}
				borderWidth={1}
				borderColor="gray.700"
				backgroundColor="#131315"
				marginTop={5}
				marginBottom={1}
				ref={ref}
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="159px"
				color="gray.700"
				transition="color 0.2s ease-in-out, border-color 0.2s ease-in-out"
				_hover={{
					borderColor: "white",
					color: "white",
				}}
				onClick={isLoading ? undefined : onClick}
			>
				<AddIcon />
				<Text>New HODL</Text>
			</Stack>
		);
	}
);

interface Props {
	isLoading: boolean;
	assets: UserAssetInfo[];
	shouldShowAddButton: boolean;
	onAddButtonClick: () => void;
	onPaperHand: (asset: Asset) => void;
	onWithdraw: (asset: Asset) => void;
}

export const LockCarousel = (props: Props) => {
	const flickingRef = useRef<Flicking | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const flicking = flickingRef.current;
		if (flicking) {
			let currentIndex = 0; // Assuming starting at the first panel
			const totalPanels = props.assets.length + 1; // Assuming this gives total panels

			flicking.on("moveStart", () => setIsAnimating(true));
			flicking.on("moveEnd", () => setIsAnimating(false));

			const handleWheel = (e: WheelEvent) => {
				if (isAnimating) return;

				const direction = e.deltaX > 0 ? "next" : "prev";

				if (direction === "next" && currentIndex < totalPanels - 1) {
					currentIndex++;
				} else if (direction === "prev" && currentIndex > 0) {
					currentIndex--;
				}

				flicking.moveTo(currentIndex); // Assuming moveTo changes the panel
			};

			flicking.element.addEventListener("wheel", handleWheel);

			return () => {
				flicking.element.removeEventListener("wheel", handleWheel);
			};
		}
	}, [isAnimating, props.assets.length]);

	return (
		<Box mt={3} width="100%">
			<Flicking align="prev" circular={false} ref={flickingRef}>
				{props.assets.map((asset) => (
					<Panel
						asset={asset}
						key={asset.asset.symbol}
						onPaperHand={props.onPaperHand}
						onWithdraw={props.onWithdraw}
					/>
				))}
				{(props.shouldShowAddButton || props.isLoading) && (
					<AddPanel
						isLoading={props.isLoading}
						onClick={props.onAddButtonClick}
						key={`${props.isLoading}-${props.shouldShowAddButton}`}
					/>
				)}
			</Flicking>
		</Box>
	);
};
