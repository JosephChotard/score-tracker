import { cyanDark, greenDark, indigoDark, plumDark, redDark, tealDark } from "@radix-ui/colors";
import { Badge, Card, Flex, Grid, Text } from "@radix-ui/themes";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { GameState, getTotalScores } from "./Scores";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: "Cum sum",
        },
    },
};

interface ScoreStatsProps {
    gameState: GameState;
}

const COLOUR_OPTIONS = {
    red: redDark.red9,
    green: greenDark.green9,
    indigo: indigoDark.indigo9,
    cyan: cyanDark.cyan9,
    plum: plumDark.plum9,
    teal: tealDark.teal9,
} as const;

type ColourKeys = keyof typeof COLOUR_OPTIONS;

// Create an array of the keys
const COLOUR_KEYS: ColourKeys[] = Object.keys(COLOUR_OPTIONS) as ColourKeys[];
const COLOUR_VALUES: string[] = Object.values(COLOUR_OPTIONS);


const NUM_COLOURS = Object.keys(COLOUR_OPTIONS).length

function cumsum(arr: number[]): number[] {
    return arr.reduce((acc, curr, index) => {
        if (index === 0) {
            acc.push(curr);
        } else {
            acc.push(acc[index - 1] + curr);
        }
        return acc;
    }, [] as number[]);
}

function ScoreStats({ gameState }: ScoreStatsProps) {
    const sortedScores = Object.entries(getTotalScores(gameState))
        .sort(([_, scoreA], [__, scoreB]) => scoreA - scoreB)
        .map(([name, score]) => ({ name, score }));

    const datasets = Object.entries(gameState).map(
        ([playerName, data], index) => ({
            label: playerName,
            borderColor: COLOUR_VALUES[index % NUM_COLOURS],
            data: cumsum(data.map(({ score }) => score)),
        })
    );

    const num_rounds = gameState[Object.keys(gameState)[0]].length;

    console.log(gameState, datasets);

    return (
        <Grid columns="2" gap="4" minHeight="400" width="auto" m="4">
            <Card>
                <ol>
                    {sortedScores.map(({ name, score }) => (
                        <li key={name}>
                            <Flex gap="4" align="center">
                                <Text>{name}</Text>{" "}
                                <Flex flexGrow="1" justify="end">
                                    <Badge
                                        size="1"
                                        color={
                                            COLOUR_KEYS[
                                                Object.keys(gameState).indexOf(
                                                    name
                                                ) % NUM_COLOURS
                                            ]
                                        }
                                    >
                                        {score}
                                    </Badge>
                                </Flex>
                            </Flex>
                        </li>
                    ))}
                </ol>
            </Card>
            <Card>
                <Line
                    options={options}
                    data={{
                        labels: Array.from({ length: num_rounds }, (x, i) => i),
                        datasets,
                    }}
                />
            </Card>
        </Grid>
    );
}

export default ScoreStats;
