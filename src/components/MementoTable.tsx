import {
	Box,
	ButtonGroup,
	HStack,
	Image,
	Input,
	InputGroup,
	InputLeftElement,
	SimpleGrid,
	Spinner,
	Stack,
	Table,
	Tag,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SearchIcon, StarIcon } from "@chakra-ui/icons";
import { IMemento } from "@/models/memento";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { RectangleButton } from "./buttons/RectangleButton";
import { useHodlModalState, useAssetState } from "@/store";
import { ConnectWalletButton } from "./buttons/ConnectWalletButton";
import { renderDuration } from "@/utils/renderDuration";
import { MintButton } from "./buttons/MintButton";
import { ASSET_LIST } from "@/utils/constants/assets";
import { getBlurUrl } from "@/utils/getBlurUrl";
import { getBackgroundColor, getColor } from "@/utils/getColors";
import { shareToX } from "shareToX";
import { useDataFetchWithAutomaticRefresh } from "@/utils/useDataFetch";
import { mutate } from "swr";

// Stateful component
export const MementoTable = () => {
	const selectedAsset = useAssetState((state) => state.selectedAsset);
	const setShowHodlModal = useHodlModalState((state) => state.setShowHodlModal);
	const { publicKey, connecting, connected, disconnecting } = useWallet();
	const [hasStartedConnecting, setHasStartedConnecting] = useState(false);
	const [favourites, setFavourites] = useState(new Set<string>()); // Temp implementation
	const [filterFavourites, setFilterFavourites] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const searchMaxWidth = useBreakpointValue({
		base: "100%",
		md: "50%",
	});
	const [isTable, setIsTable] = useState(true);

	const {
		data: { userMementos: mementos, mintProgress } = {},
		error,
		isLoading,
	} = useDataFetchWithAutomaticRefresh<{
		userMementos: IMemento[];
		mintProgress: any;
	}>(publicKey ? `/api/memento/${publicKey}` : null);

	if (error) {
		return (
			<Box
				justifyContent="center"
				alignItems="center"
				display="flex"
				width="100%"
			>
				<p className="p-4 text-center">
					Failed to load items, please try connecting again.
				</p>
			</Box>
		);
	}

	if (isLoading && !disconnecting && !connecting) {
		return (
			<Box
				mx={2}
				my={6}
				justifyContent="center"
				alignItems="center"
				display="flex"
				width="100%"
			>
				<Spinner size="lg" />
			</Box>
		);
	}

	const getHeaders = () => {
		return (
			<Thead>
				<Tr>
					<Th>
						<StarIcon
							boxSize={4}
							color={filterFavourites ? "yellow.100" : "gray.700"}
							_hover={{
								cursor: "pointer",
							}}
							onClick={() => setFilterFavourites((f) => !f)}
						/>
					</Th>
					<Th fontFamily="inherit">
						<Text fontSize="md" fontWeight="bold">
							MEMENTO
						</Text>
					</Th>
					<Th fontFamily="inherit">
						<Text fontSize="md" fontWeight="bold" textAlign="right">
							TOKEN
						</Text>
					</Th>
					<Th fontFamily="inherit">
						<Text fontSize="md" fontWeight="bold" textAlign="right">
							AMOUNT
						</Text>
					</Th>
					<Th fontFamily="inherit">
						<Text fontSize="md" fontWeight="bold" textAlign="right">
							DURATION
						</Text>
					</Th>
					<Th fontFamily="inherit">
						<Text fontSize="md" fontWeight="bold" textAlign="right">
							INITIATIVE
						</Text>
					</Th>
					<Th fontFamily="inherit">
						<Text fontSize="md" fontWeight="bold" textAlign="right">
							MINT
						</Text>
					</Th>
				</Tr>
			</Thead>
		);
	};

	if (!connected || !mementos || mementos.length === 0) {
		return (
			<Stack
				px={2}
				py={6}
				mb={24}
				alignItems="center"
				width="100%"
				position="relative"
			>
				<HStack width={searchMaxWidth}>
					<InputGroup maxWidth="100%">
						<InputLeftElement>
							<SearchIcon boxSize={4} />
						</InputLeftElement>
						<Input
							width="full"
							fontSize="sm"
							variant="filled"
							type="text"
							placeholder="What are you looking for?"
							autoComplete="off"
							borderRadius={0}
							isDisabled
						/>
					</InputGroup>
					<ButtonGroup isDisabled>
						<RectangleButton isActive={false}>CARD</RectangleButton>
						<RectangleButton isActive onClick={() => setIsTable(false)}>
							TABLE
						</RectangleButton>
					</ButtonGroup>
				</HStack>
				<Box overflowX="auto" width="100%">
					<Table>
						{getHeaders()}
						<Tbody>
							<Tr>
								<Td borderBottom="None">
									<HStack>
										<StarIcon
											boxSize={4}
											color="transparent"
											focusable
											stroke="gray.700"
											strokeWidth={2}
										/>
										<Text fontSize="md" fontWeight="medium">
											1
										</Text>
									</HStack>
								</Td>
								<Td py={1} borderBottom="None">
									<HStack spacing={3}>
										<Image
											src="https://bafybeihmqkcwifzpisudjtcwpipgno4rn5kaxuackmf2zcl2uhtxwytrpy.ipfs.nftstorage.link/portal_APeirtqa6y_fQwnm0e5Nf.png"
											alt="Mystery Memento"
											boxSize={14}
											maxW="none"
										/>
										<Text fontSize="md" fontWeight="medium">
											Mystery Memento
										</Text>
									</HStack>
								</Td>
								<Td borderBottom="None">
									<Text fontSize="md" fontWeight="medium">
										{selectedAsset.symbol}
									</Text>
								</Td>
								<Td borderBottom="None">
									<Text fontSize="md" fontWeight="medium">
										?
									</Text>
								</Td>
								<Td borderBottom="None">
									<Text fontSize="md" fontWeight="medium">
										{renderDuration(60)}
									</Text>
								</Td>
								<Td borderBottom="None">
									<Text fontSize="md" fontWeight="medium">
										?
									</Text>
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</Box>
				<Box
					position="absolute"
					bottom={-2}
					bgGradient="linear(transparent 50%, #131315 75%)"
					width="100%"
					height="100%"
					display="flex"
					justifyContent="center"
					alignItems="flex-end"
				>
					{!connected && <ConnectWalletButton />}
					{connected && mementos && mementos.length === 0 && (
						<RectangleButton onClick={() => setShowHodlModal(true)}>
							Unlock your first memento now!
						</RectangleButton>
					)}
				</Box>
			</Stack>
		);
	}

	const updateFavourites = (id: string) => {
		const newFavourites = new Set(favourites);
		if (newFavourites.has(id)) {
			newFavourites.delete(id);
			setFavourites(newFavourites);
		} else {
			newFavourites.add(id);
			setFavourites(newFavourites);
		}
	};

	const terms = searchTerm.toLowerCase().split(" ");

	const mementosToShow = mementos
		.map((memento) => ({
			id: memento._id!,
			name: memento.name,
			imageSrc: memento.image,
			fallbackSrc: getBlurUrl(memento.blurhash),
			token:
				ASSET_LIST.find((a) => a.mintAddress === memento.assetLocked)?.symbol ??
				"",
			value: memento.quantityLocked,
			duration: renderDuration(memento.durationLockedInSeconds),
			initiative:
				memento.attributes.find((a) => a.trait_type === "Initiative")?.value ??
				"-",
			mintedAt: memento.mintedAt,
			hasMetadata: memento.metadataUri !== "n/a",
		}))
		.filter((memento) => {
			if (terms.length === 0) {
				return true;
			}
			return terms.every(
				(term) =>
					memento.name.toLowerCase().includes(term) ||
					memento.token.toLowerCase().includes(term) ||
					memento.value.toString().includes(term) ||
					memento.duration.includes(term) ||
					memento.initiative.includes(term) ||
					(memento.mintedAt && memento.hasMetadata
						? "minter"
						: "cannot mint"
					).includes(term)
			);
		})
		.filter((memento) => !filterFavourites || favourites.has(memento.id));

	return (
		<Stack px={2} py={6} alignItems="center" width="100%">
			<HStack width={searchMaxWidth}>
				<InputGroup maxWidth="100%">
					<InputLeftElement>
						<SearchIcon boxSize={4} />
					</InputLeftElement>
					<Input
						width="full"
						fontSize="sm"
						variant="filled"
						type="text"
						placeholder="What are you looking for?"
						autoComplete="off"
						borderRadius={0}
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
					/>
				</InputGroup>
				<ButtonGroup>
					<RectangleButton
						isActive={!isTable}
						onClick={() => setIsTable(false)}
					>
						GALLERY
					</RectangleButton>
					<RectangleButton isActive={isTable} onClick={() => setIsTable(true)}>
						TABLE
					</RectangleButton>
				</ButtonGroup>
			</HStack>
			<Box overflowX="auto" width="100%">
				{isTable && (
					<Table>
						{getHeaders()}
						<Tbody>
							{mementosToShow.map((memento, index) => {
								return (
									<Tr
										key={memento.id}
										_hover={{
											backgroundColor: "gray.900",
											cursor: "pointer",
										}}
									>
										<Td borderBottom="None">
											<HStack>
												{favourites.has(memento.id) ? (
													<StarIcon
														boxSize={4}
														focusable
														onClick={() => updateFavourites(memento.id)}
														color="yellow.100"
														_hover={{ cursor: "pointer" }}
													/>
												) : (
													<StarIcon
														boxSize={4}
														color="transparent"
														focusable
														onClick={() => updateFavourites(memento.id)}
														stroke="gray.700"
														strokeWidth={2}
														_hover={{
															stroke: "yellow.100",
															cursor: "pointer",
														}}
													/>
												)}
												<Text fontSize="md" fontWeight="medium">
													{index + 1}
												</Text>
											</HStack>
										</Td>
										<Td py={1} borderBottom="None">
											<HStack spacing={3}>
												<Image
													src={memento.imageSrc}
													alt={memento.name}
													fallbackSrc={memento.fallbackSrc}
													loading="lazy"
													boxSize={14}
													maxW="none"
												/>
												<Text fontSize="md" fontWeight="medium">
													{memento.name}
												</Text>
											</HStack>
										</Td>
										<Td borderBottom="None">
											<Text fontSize="md" fontWeight="medium" textAlign="right">
												{memento.token}
											</Text>
										</Td>
										<Td borderBottom="None">
											<Text fontSize="md" fontWeight="medium" textAlign="right">
												{memento.value}
											</Text>
										</Td>
										<Td borderBottom="None">
											<Text fontSize="md" fontWeight="medium" textAlign="right">
												{memento.duration}
											</Text>
										</Td>
										<Td borderBottom="None">
											<Text fontSize="md" fontWeight="medium" textAlign="right">
												{memento.initiative}
											</Text>
										</Td>
										<Td borderBottom="None">
											{memento.mintedAt == null && memento.hasMetadata ? (
												<Box display="flex" justifyContent="flex-end">
													<MintButton
														onSuccess={() =>
															mutate(`/api/memento/${publicKey}`)
														}
														mementoId={memento.id.toString()}
													/>
												</Box>
											) : (
												<Text
													fontSize="md"
													fontWeight="medium"
													textAlign="right"
													onClick={() => {
														memento.hasMetadata
															? shareToX({
																	text: `I just Diamond Handed ${memento.value} ${memento.token} for ${memento.duration} on DiamondHanding.io!`,
																	imageUrl: memento.imageSrc,
																	hashtags: [
																		"DiamondHanding",
																		"NFT",
																		"Solana",
																	].join(","),
															  })
															: shareToX({
																	text: `I'm a paperhanded bitch! Check out DiamondHanding.io!`,
																	imageUrl: memento.imageSrc,
																	hashtags: [
																		"Paperhanded",
																		"NFT",
																		"solana",
																	].join(","),
															  });
													}}
												>
													{memento.hasMetadata ? "SHARE" : "SHAME"}
												</Text>
											)}
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				)}
				{!isTable && (
					<SimpleGrid columns={[1, 2, 3]} mt={2} spacing={2}>
						{mementosToShow.map((memento) => (
							<motion.div
								key={memento.id}
								whileHover={{
									translateY: -5,
									transition: { duration: 0.1 },
								}}
								style={{
									marginTop: 5,
									marginBottom: 1,
									cursor: "pointer",
								}}
							>
								<Box
									backgroundImage={memento.imageSrc}
									backgroundPosition="center"
									height="100%"
								>
									<Stack
										alignItems="center"
										padding={4}
										backdropFilter="blur(2px)"
										backgroundColor="blackAlpha.600"
										borderWidth={1}
										borderColor="gray.700"
										height="100%"
									>
										<Image
											mt={1}
											src={memento.imageSrc}
											alt={memento.name}
											fallbackSrc={memento.fallbackSrc}
											loading="lazy"
											boxSize="50%"
											maxW="none"
										/>
										<HStack mt={3}>
											<Tag
												size="sm"
												variant="solid"
												backgroundColor={getBackgroundColor(memento.token)}
												borderRadius={0}
												fontWeight="bold"
												color={getColor(memento.token)}
											>
												{memento.token}
											</Tag>
											<Text fontSize="sm">{memento.value}</Text>
										</HStack>
										<Stack spacing={0} alignItems="center">
											<Text>{memento.name}</Text>
											<Text fontSize="sm" color="whiteAlpha.600">
												{memento.initiative ? `${memento.initiative} | ` : ""}
												{memento.duration}
											</Text>
										</Stack>
										{memento.mintedAt == null && memento.hasMetadata ? (
											<MintButton
												onSuccess={() => mutate(`/api/memento/${publicKey}`)}
												mementoId={memento.id.toString()}
											/>
										) : (
											<Text fontSize="sm" color="whiteAlpha.600">
												{memento.hasMetadata ? "MINTED" : "CANNOT MINT"}
											</Text>
										)}
									</Stack>
								</Box>
							</motion.div>
						))}
					</SimpleGrid>
				)}
			</Box>
		</Stack>
	);
};
