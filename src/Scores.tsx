import { Box, Container, Heading } from "@radix-ui/themes";
import React, { Reducer, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import ScoreInput, { PlayerScore } from "./ScoreInput";
import ScoreStats from "./ScoreStats";
import TableScore from "./TableScore";

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

interface PlayerRoundScore {
    round: number;
    score: number;
}

export interface GameState {
    [player: string]: PlayerRoundScore[];
}

interface SetRoundAction {
    type: "SET_ROUND";
    payload: {
        roundNum: number;
        scores: PlayerScore[];
    };
}

type Action = SetRoundAction;

const initialState: GameState = {};

const scoreReducer: Reducer<GameState, Action> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case "SET_ROUND": {
            console.log("set rounnnnnnnnd", action.payload);
            const { roundNum, scores } = action.payload;
            const newState = { ...state };

            scores.forEach(({ player, score }) => {
                newState[player] = [
                    ...(newState[player] ?? []).filter(
                        ({ round }) => round !== roundNum
                    ),
                    { round: roundNum, score },
                ];
            });

            return newState;
        }
        default:
            return state;
    }
};

const setRound = (roundNum: number, scores: PlayerScore[]): SetRoundAction => ({
    type: "SET_ROUND",
    payload: {
        roundNum,
        scores,
    },
});

export const getTotalScores = (gameState: GameState) =>
    Object.keys(gameState).reduce(
        (totals, player: string) => {
            totals[player] = gameState[player].reduce(
                (sum, { score }) => sum + score,
                0
            );
            return totals;
        },
        {} as {
            [player: string]: number;
        }
    );

function Scores() {
    const query = useQuery();
    const playerNames = query.get("players")?.split(",") ?? [];
    const [round, setRoundNumber] = useState(0);
    const [gameState, dispatchGameState] = useReducer(
        scoreReducer,
        initialState
    );
    const onChangeScore = (round: number, scores: PlayerScore[]) => {
        setRoundNumber(round + 1);
        dispatchGameState(setRound(round, scores));
        console.log(round, scores);
    };

    return (
        <Container p="7" align="center" size="3">
            <Box p="4">
                <Heading align="center">Game Scores</Heading>
            </Box>
            <ScoreInput
                playerNames={playerNames}
                round={round}
                onSubmit={onChangeScore}
            />
            {round > 0 && (
                <>
                    <TableScore gameState={gameState} />
                    <ScoreStats gameState={gameState} />
                </>
            )}
        </Container>
    );
}

export default Scores;
