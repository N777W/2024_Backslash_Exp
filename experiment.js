let SEED = "666";
Nof1.SET_SEED(SEED);


function generateComplexBackslashTask() {
    // Generate a random string with complex backslash sequences
    function createAnnoyingString(length) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const backslashSequences = ["\\n", "\\t", "\\\\", "\\b", "\\r"]; // Common escaped sequences
        let result = "";

        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.3) {
                // 30% chance of adding a backslash sequence
                result += backslashSequences[Math.floor(Math.random() * backslashSequences.length)];
            } else if (Math.random() < 0.2) {
                // 20% chance of adding a single backslash
                result += "\\";
            } else {
                // Otherwise, add a random character
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }

        return result;
    }

    // Generate a random string length between 50 and 100
    const stringLength = Math.floor(Math.random() * 51) + 50;
    const annoyingString = createAnnoyingString(stringLength);

    // Count all the backslashes, including those in escape sequences
    const correctCount = (annoyingString.match(/\\/g) || []).length;

    // Return the task string and the solution
    return { task: annoyingString, solution: correctCount };
}


let experiment_configuration_function = (writer) => { return {
    experiment_name: "NicksExperiment",
    seed: SEED,
    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
        "Objective:\n" +
            "Participants are tasked with counting all the backslashes (\\\\) in a randomly generated string. \n" +
            "This includes standalone backslashes and those that appear as part of escape sequences (e.g., \\n, \\t, \\\\\\).\n" +
            "\n" +
            "Task Instructions:\n" +
            "1. You will be presented with a string containing a mixture of:\n" +
            "   - Random alphanumeric characters.\n" +
            "   - Standalone backslashes (\\\\).\n" +
            "   - Backslashes in common escape sequences such as:\n" +
            "     - \\n (newline)\n" +
            "     - \\t (tab)\n" +
            "     - \\\\\\ (escaped backslash)\n" +
            "     - \\\\b (backspace)\n" +
            "     - \\r (carriage return)\n" +
            "2. Your task is to carefully count all backslashes in the string, including:\n" +
            "   - Each standalone \\\\ counts as one backslash.\n" +
            "   - Each backslash in an escape sequence (e.g., \\\\n, \\\\\\\\) also counts as one backslash.\n")
    ]),
    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "- Given the string: a\\\\nbcd\\\\e\\\\\\\\fghijk\\\\tlmno\\\\r\\\\pq\\\\rs\\\\tuvw\\\\xy\\\\z\\\\n1234\\\\5\n" +
            "- Breakdown of backslashes:\n" +
            "  - \\\\\ → 2 backslashes\n" +
            "  - \\n → 1 backslash\n" +
            "  - \\ → 1 backslash\n" +
            "  - \\\\\ → 2 backslashes\n" +
            "  - \\t → 1 backslash\n" +
            "  - ... (continue for the entire string)\n" +
            "- Total: 15 backslashes"
        )),
    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the experiment phase.\n\n"
        )),
    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Thanks for the fish."
            )
        )
    ],
    layout: [
        { variable: "Indentation",  treatments: ["indented", "nonindented"]},
    ],
    repetitions: 2, //CATALAN_GRAPHS.length,
    measurement: Nof1.Time_to_finish(Nof1.text_input_experiment),
    task_configuration:    (t) => {
        t.do_print_task = () => {
            writer.clear_stage();
            if(t.treatment_value('Indentation')=="indented")
                writer.print_html_on_stage(generatedTask.task);
            else
                writer.print_html_on_stage(generatedTask.task);
        };
        t.expected_answer = generatedTask.solution;
        t.accepts_answer_function = (given_answer) => {
            return given_answer===t.expected_answer;
        };
        t.do_print_error_message = (given_answer) => {
            writer.clear_error();
            writer.print_html_on_error("<h1>Invalid answer: " + given_answer + "");
        };
        t.do_print_after_task_information = () => {
            writer.clear_error();
            writer.print_string_on_stage(writer.convert_string_to_html_string(
                "Correct.\n\n" +
                "In case, you feel not concentrated enough, make a short break.\n\n" +
                "Press [Enter] to go on. "));
        }
    }
}};
const generatedTask = generateComplexBackslashTask();
Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);



