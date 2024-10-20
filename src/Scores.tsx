import { Box, Container, Heading, Table } from "@radix-ui/themes";
import React, { Reducer, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import ScoreInput, { PlayerScore } from "./ScoreInput";


function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

interface PlayerRoundScore {
    round: number;
    score: number;
}

interface State {
    [player: string]: PlayerRoundScore[];
}

interface SetRoundAction {
    type: 'SET_ROUND';
    payload: {
        roundNum: number;
        scores: PlayerScore[];
    };
}

type Action = SetRoundAction;

const initialState: State = {};

const scoreReducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ROUND": {
            const { roundNum, scores } = action.payload;
            const newState = { ...state };

            scores.forEach(({ player, score }) => {
                if (!newState[player]) {
                    newState[player] = [];
                }
                newState[player].push({ round: roundNum, score });
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


function Scores() {
    const query = useQuery();
    const playerNames = query.get("players")?.split(",") ?? [];
    const [round, setRoundNumber] = useState(0)
    const [gameState, dispatchGameState] = useReducer(
        scoreReducer,
        initialState
    );
    const onChangeScore = (round: number, scores: PlayerScore[]) => {
        setRoundNumber(round + 1);
        dispatchGameState(setRound(round, scores))
        console.log(round, scores);
    }

    const rounds = Array.from(
        new Set(
            Object.values(gameState).flatMap((playerScores) =>
                playerScores.map((ps) => ps.round)
            )
        )
    ).sort((a, b) => a - b);

    const totalScores = Object.keys(gameState).reduce(
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
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>
                            
                        </Table.ColumnHeaderCell>
                        {Object.keys(gameState).map((player) => (
                            <Table.ColumnHeaderCell key={player}>
                                {player}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rounds.map((round) => (
                        <Table.Row key={round}>
                            <Table.RowHeaderCell>{round+1}</Table.RowHeaderCell>
                            {Object.keys(gameState).map((player) => {
                                const roundScore = gameState[player].find(
                                    (ps) => ps.round === round
                                );
                                return (
                                    <Table.Cell key={player + round}>
                                        {roundScore ? roundScore.score : "-"}
                                    </Table.Cell>
                                );
                            })}
                        </Table.Row>
                    ))}
                    <Table.Row>
                        <Table.RowHeaderCell>Total</Table.RowHeaderCell>
                        {Object.keys(gameState).map((player) => (
                            <Table.Cell key={`total-${player}`}>
                                {totalScores[player]}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </Container>
    );
}

export default Scores;
