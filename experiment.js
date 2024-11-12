let SEED = "666";
Nof1.SET_SEED(SEED);

const wordPool = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r",
    "s", "t", "u", "v", "w", "x", "y", "z", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh",
    "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv",
    "ww", "xx", "yy", "zz"
];

let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "NicksExperiment",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string("Welcome to the JSON Deepest Object Experiment! Find the path to the deepest JSON object.")
        ]),

        pre_run_training_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("You are now in the training phase.")
        ),

        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("The experiment is starting. In each task, identify the path to the deepest JSON object.")
        ),

        finish_pages: [
            writer.string_page_command(
                writer.convert_string_to_html_string("Experiment complete! Thank you for participating.")
            )
        ],

        layout: [
            { variable: "Indentation", treatments: ["indented", "nonindented"] }
        ],

        repetitions: 2,

        measurement: Nof1.Time_to_finish(Nof1.text_input_experiment),

        task_configuration: (t) => {
            const isIndented = true;
            const maxDepth = 5;
            const maxFields = 6;

            const { jsonObject, deepestPath } = generateComplexRandomJSON(maxDepth, maxFields);

            console.log("Deepest Path:", deepestPath);

            t.do_print_task = () => {
                writer.clear_stage();

                const jsonDisplay = isIndented
                    ? JSON.stringify(jsonObject, null, 4)
                    : formatJSONVertical(jsonObject);

                writer.print_html_on_stage(
                    `<pre>${jsonDisplay}</pre>`
                );

                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    "Please identify the path to the deepest JSON object."
                ));
            };

            t.expected_answer = "Skip";

            t.accepts_answer_function = (given_answer) => {
                return given_answer === t.expected_answer;
            };

            t.do_print_error_message = (given_answer) => {
                writer.clear_error();
                writer.print_html_on_error(`<h1>Incorrect path: ${given_answer}. Try again.</h1>`);
            };

            t.do_print_after_task_information = () => {
                writer.clear_error();
                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    "Correct! Press [Enter] to proceed to the next task."
                ));
            };
        }
    };
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);

// Utility functions
function generateComplexRandomJSON(maxDepth = 6, maxFields = 8) {
    const jsonObject = {};
    let deepestPath = [];
    let currentNode = jsonObject;
    const uniqueKeys = new Set();

    for (let depth = 0; depth < maxDepth; depth++) {
        const key = getRandomKey(uniqueKeys);
        currentNode[key] = depth === maxDepth - 1 ? {} : { attr: `RandomValue` };
        deepestPath.push(key);
        currentNode = currentNode[key];
    }

    addRandomBranches(jsonObject, maxDepth, maxFields, uniqueKeys);

    return { jsonObject, deepestPath: deepestPath.join(".") };
}

function addRandomBranches(obj, maxDepth, maxFields, uniqueKeys) {
    if (maxDepth <= 1) return;

    const numBranches = Math.floor(Math.random() * maxFields) + 1;
    for (let i = 0; i < numBranches; i++) {
        const key = getRandomKey(uniqueKeys);
        obj[key] = { attr: "side_value" };

        const branchDepth = Math.min(maxDepth, 2 + Math.floor(Math.random() * (maxDepth - 2)));
        let currentNode = obj[key];

        for (let depth = 1; depth < branchDepth; depth++) {
            const nestedKey = getRandomKey(uniqueKeys);
            currentNode[nestedKey] = depth === branchDepth - 1 ? {} : { attr: `branch_value${depth}` };
            currentNode = currentNode[nestedKey];

            if (Math.random() > 0.6) {
                addRandomBranches(currentNode, branchDepth - depth, maxFields, uniqueKeys);
            }
        }
    }
}

function getRandomKey(usedKeys) {
    let key;
    do {
        key = wordPool[Math.floor(Math.random() * wordPool.length)];
    } while (usedKeys.has(key));
    usedKeys.add(key);
    return key;
}

function formatJSONVertical(obj) {
    return JSON.stringify(obj).replace(/,/g, ',\n');
}
