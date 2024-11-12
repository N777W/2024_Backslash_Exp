let SEED = "666";
Nof1.SET_SEED(SEED);

// Constants and variables used throughout the experiment with limited word pool
const wordPool = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z", "aa", "bb", "cc", "dd",
    "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn"
];
const targetAttribute = "X"; // Setting a short target value as well

let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "NicksExperiment",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string("Welcome to the JSON Indentation Experiment! Find the deepest path to the target value.")
        ]),

        pre_run_training_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("You are now in the training phase.")
        ),

        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("The experiment is starting. In each task, identify the correct path to the target value in the JSON object.\n\n")
        ),

        finish_pages: [
            writer.string_page_command(
                writer.convert_string_to_html_string("Experiment complete! Thank you for participating.")
            )
        ],

        layout: [
            { variable: "Indentation", treatments: ["indented", "nonindented"] }
        ],

        repetitions: 2, // Adjust as needed for the number of test cases

        measurement: Nof1.Time_to_finish(Nof1.text_input_experiment),

        task_configuration: (t) => {
            const isIndented = t.treatment_combination[0] === "indented";
            const maxDepth = 3; // Adjust for complexity
            const maxFields = 3;

            // Generate a new JSON object and determine the correct path for this task
            const { jsonObject, correctPath } = generateRandomJSON(maxDepth, maxFields);

            // Log the correct path to the console for debugging purposes
            console.log("Correct Path:", correctPath);

            t.do_print_task = () => {
                writer.clear_stage();

                // Display JSON with or without indentation
                if (isIndented) {
                    writer.print_html_on_stage(
                        `<pre>${highlightTargetValue(JSON.stringify(jsonObject, null, 4))}</pre>`
                    );
                } else {
                    writer.print_html_on_stage(
                        `<pre>${highlightTargetValue(formatJSONVertical(jsonObject))}</pre>`
                    );
                }

                // Display message asking for the path
                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    "Please identify the correct path to the target value."
                ));
            };

            // Set the expected answer as the correct path for validation
            t.expected_answer = correctPath;

            // Function to check if the user's answer is correct
            t.accepts_answer_function = (given_answer) => {
                return given_answer === t.expected_answer;
            };

            // Display error message if the path entered is incorrect
            t.do_print_error_message = (given_answer) => {
                writer.clear_error();
                writer.print_html_on_error(`<h1>Incorrect path: ${given_answer}</h1>`);
            };

            // Display message after the user answers correctly
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
function generateRandomJSON(maxDepth = 3, maxFields = 3) {
    const jsonObject = {};
    let uniqueKeys = new Set();
    let possiblePaths = [];
    let correctPath = "";

    function addNestedObject(obj, currentDepth, path) {
        if (currentDepth > maxDepth) return;

        const numFields = Math.min(maxFields, wordPool.length - uniqueKeys.size);
        let addedFields = 0;

        while (addedFields < numFields) {
            const key = getRandomKey(uniqueKeys);
            uniqueKeys.add(key);
            addedFields++;

            if (currentDepth < maxDepth && Math.random() > 0.3) {
                obj[key] = {};
                addNestedObject(obj[key], currentDepth + 1, [...path, key]);
            } else {
                obj[key] = getRandomValue(uniqueKeys);
                possiblePaths.push([...path, key]);
            }
        }
    }

    addNestedObject(jsonObject, 1, []);
    correctPath = setRandomTargetAttribute(jsonObject, possiblePaths, targetAttribute);
    return { jsonObject, correctPath };
}

function setRandomTargetAttribute(jsonObject, possiblePaths, targetAttribute) {
    if (possiblePaths.length > 0) {
        const randomPath = possiblePaths[Math.floor(Math.random() * possiblePaths.length)];
        const correctPath = randomPath.join(".");

        let current = jsonObject;
        for (let i = 0; i < randomPath.length - 1; i++) {
            current = current[randomPath[i]];
        }
        current[randomPath[randomPath.length - 1]] = targetAttribute;
        return correctPath;
    }
    console.error("Error: No valid paths found to set as correct path.");
    return "";
}

function getRandomKey(usedKeys) {
    let key;
    do {
        key = wordPool[Math.floor(Math.random() * wordPool.length)];
    } while (usedKeys.has(key));
    return key;
}

function getRandomValue(usedKeys) {
    let value;
    do {
        value = wordPool[Math.floor(Math.random() * wordPool.length)];
    } while (usedKeys.has(value));
    return value;
}

function highlightTargetValue(jsonString) {
    const targetValueRegex = new RegExp(`"${targetAttribute}"`, 'g');
    return jsonString.replace(targetValueRegex, `<span style="color: red;">"${targetAttribute}"</span>`);
}

function formatJSONVertical(obj) {
    const lines = JSON.stringify(obj, null, 4).split('\n');
    return lines.map(line => line.trim()).join('\n');
}
