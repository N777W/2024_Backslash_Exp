let SEED = "666";
Nof1.SET_SEED(SEED);

let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "NicksExperiment",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string(
                "Do this experiment"
            )
        ]),

        pre_run_training_instructions: writer.string_page_command(
            writer.convert_string_to_html_string(
                "You entered the training phase."
            )
        ),

        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string(
                "You entered the experiment phase.\n\n"
            )
        ),

        finish_pages: [
            writer.string_page_command(
                writer.convert_string_to_html_string(
                    "Thanks for the fish."
                )
            )
        ],

        layout: [
            { variable: "Indentation", treatments: ["indented", "nonindented"] },
        ],

        repetitions: 2,

        measurement: Nof1.Time_to_finish(Nof1.text_input_experiment),

        task_configuration: (t) => {
            // Function to generate a nested JSON object with a path to "target_value" at the deepest level
            function generateLargeRandomJson(depth = 5) {
                const alphabet = "abcdefghijklmnopqrstuvwxyz";
                let jsonObject = {};
                let current = jsonObject;
                let path = []; // To store the correct path to the deepest value

                for (let i = 0; i < depth; i++) {
                    let key = alphabet[Math.floor(Math.random() * alphabet.length)];
                    path.push(key);
                    current[key] = (i === depth - 1) ? "target_value" : {};
                    current = current[key];
                }

                console.log("Generated JSON Object:", jsonObject); // Debug: JSON structure
                console.log("Expected Path to Target Value:", path.join('.')); // Debug: Path

                return { jsonObject, path: path.join('.') };
            }

            // Generate a deeper JSON object and extract the path
            let { jsonObject, path } = generateLargeRandomJson();

            // Set the correct path as the expected answer
            t.expected_answer = path;

            // Function to display the task with correct indentation treatment
            t.do_print_task = () => {
                writer.clear_stage();

                // Determine if the JSON should be indented or non-indented based on treatment
                let treatment = t.treatment_combination[0].value;
                console.log("Treatment type:", treatment); // Debug: Treatment type

                let jsonStr = JSON.stringify(jsonObject, null, treatment === "indented" ? 4 : 0);
                writer.print_html_on_stage(`<pre>${jsonStr}</pre>`);
            };

            // Validate the provided answer
            t.accepts_answer_function = (given_answer) => {
                console.log("Given Answer:", given_answer); // Debug: User input
                console.log("Expected Answer:", t.expected_answer); // Debug: Expected path
                return given_answer === t.expected_answer;
            };

            // Error message when the answer is incorrect
            t.do_print_error_message = (given_answer) => {
                writer.clear_error();
                writer.print_html_on_error("<h1>Invalid answer: " + given_answer + "</h1>");
            };

            // Instructions after a correct answer is given
            t.do_print_after_task_information = () => {
                writer.clear_error();
                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    "Correct.\n\n" +
                    "In case, you feel not concentrated enough, make a short break.\n\n" +
                    "Press [Enter] to go on."
                ));
            };
        }
    };
};

// Run the configured experiment
Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
