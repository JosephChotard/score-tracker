import { Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface PlayerScore {
    player: string;
    score: number;
}

interface PlayerScoreInternal {
    player: string;
    score: string | null;
}

interface ScoreInputProps {
    playerNames: string[];
    round: number;
    onSubmit: (round: number, scores: PlayerScore[]) => void;
}

function ScoreInput({ playerNames, round, onSubmit }: ScoreInputProps) {
    const [scores, setScores] = useState<PlayerScoreInternal[]>([]);

    const handleScoreChange = (index: number, value: string) => {
        if (!isValidScore(value)) {
            return;
        }
        const newScores = [...scores];
        const cleanedValue = value === "" ? null : value;
        newScores[index].score = cleanedValue;
        setScores(newScores);
    };

    const clearScores = useCallback(() => {
        setScores(
            playerNames.map((playerName) => ({
                player: playerName,
                score: null,
            }))
        );
    }, [playerNames]);

    useEffect(() => {
        clearScores();
    }, [playerNames, clearScores]);

    

    const isValidScore = (score: string): boolean => {
        return !isNaN(Number(score)) || score === "-";
    };

    const notAllScoresAreValid = useMemo(
        () => scores.some((score) => score.score == null),
        [scores]
    );

    const broadcastScores = useCallback(() => {
        onSubmit(
            round,
            scores.map((score) => ({
                player: score.player,
                score: parseInt(score.score!),
            }))
        );
        clearScores()
    }, [clearScores, onSubmit, round, scores]);

    return (
        <Card>
            <Heading as="h3" color="gray">
                Round {round + 1}
            </Heading>
            <Flex direction="column" gap="2">
                {scores.map((playerScore, index) => (
                    <Flex key={playerScore.player} gap="4" align="center">
                        <Text>{playerScore.player}</Text>
                        <Flex flexGrow="1" justify="end">
                            <TextField.Root
                                type="number"
                                value={playerScore.score ?? ""}
                                onChange={(e) =>
                                    handleScoreChange(index, e.target.value)
                                }
                            />
                        </Flex>
                    </Flex>
                ))}
            </Flex>

            <Flex direction="column" gap="3" align="stretch" pt="3">
                <Button
                    onClick={broadcastScores}
                    disabled={notAllScoresAreValid}
                    size="2"
                >
                    Next Round
                </Button>
            </Flex>
        </Card>
    );
}

export default ScoreInput;
