import { Table } from "@radix-ui/themes";
import { GameState, getTotalScores } from "./Scores";

interface TableScoreProps {
    gameState: GameState;
}

function TableScore({ gameState }: TableScoreProps) {
    const rounds = Array.from(
        new Set(
            Object.values(gameState).flatMap((playerScores) =>
                playerScores.map((ps) => ps.round)
            )
        )
    ).sort((a, b) => a - b);

    const totalScores = getTotalScores(gameState)

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
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
                        <Table.RowHeaderCell>{round + 1}</Table.RowHeaderCell>
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
    );
}

export default TableScore;
