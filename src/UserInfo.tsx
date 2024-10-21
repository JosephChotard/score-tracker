import { PersonIcon, PlusIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Heading, IconButton, Text, TextField } from "@radix-ui/themes";
import React from "react";
import { Link } from "react-router-dom";

function UserInfo() {
    const [playerName, setPlayerName] = React.useState<string>("");
    const [players, setPlayers] = React.useState<string[]>([]);

    const onChangePlayerName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(event.currentTarget.value);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onClickAddPlayer();
        }
    };

    const onClickAddPlayer = () => {
        setPlayers([
            playerName,
            ...players.filter((name) => name !== playerName),
        ]);
        setPlayerName("");
    };

    const url = `/scores?players=${encodeURIComponent(players.join(","))}`;

    return (
        <Box p="7">
            <Heading align="center">Choose your users</Heading>
            <Flex direction="column" gap="2" p="3">
                <Flex gap="3" mb="5">
                    <Box flexGrow="1">
                        <TextField.Root
                            size="2"
                            placeholder="Name"
                            value={playerName}
                            onChange={onChangePlayerName}
                            onKeyDown={onKeyDown}
                        >
                            <TextField.Slot>
                                <PersonIcon height="16" width="16" />
                            </TextField.Slot>
                        </TextField.Root>
                    </Box>
                    <IconButton size="2" onClick={onClickAddPlayer}>
                        <PlusIcon width={18} height={18} />
                    </IconButton>
                </Flex>
                <Flex direction="column" gap="1">
                    {players.map((player) => (
                        <Text key={player}>{player}</Text>
                    ))}
                </Flex>
                <Button asChild>
                    <Link to={url}>Track scores</Link>
                </Button>
            </Flex>
        </Box>
    );
}

export default UserInfo;
