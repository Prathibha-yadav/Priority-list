const fs = require("fs");

const taskFilePath = "task.txt";
const completedFilePath = "completed.txt";

let addTask = (priority, description) => {
  const task = `${priority} ${description}`;
  fs.appendFileSync(taskFilePath, task + "\n");
  console.log(`Added task: "${description}" with priority ${priority}`);
};

let listTasks = () => {
  const tasks = fs.readFileSync(taskFilePath, "utf8").trim().split("\n");
  console.log("Tasks:");
  tasks.forEach((task, index) => {
    const [priority, description] = task.split(" ");
    console.log(`${index + 1}. ${description} [${priority}]`);
  });
};

let deleteTask = (index) => {
  const tasks = fs.readFileSync(taskFilePath, "utf8").trim().split("\n");
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    fs.writeFileSync(taskFilePath, tasks.join("\n") + "\n");
    console.log(`Deleted task #${index + 1}`);
  } else {
    console.log(`Error: task with index #${index + 1} does not exist. Nothing deleted.`);
  }
};

let markTaskAsDone = (index) => {
  const tasks = fs.readFileSync(taskFilePath, "utf8").trim().split("\n");
  if (index >= 0 && index < tasks.length) {
    const task = tasks[index];
    tasks.splice(index, 1);
    fs.writeFileSync(taskFilePath, tasks.join("\n") + "\n");
    fs.appendFileSync(completedFilePath, task.split(" ")[1] + "\n");
    console.log("Marked item as done.");
  } else {
    console.log(`Error: no incomplete item with index #${index + 1} exists.`);
  }
};

const command = process.argv[2];

switch (command) {
  case "add":
    const priority = process.argv[3];
    const description = process.argv.slice(4).join(" ");
    addTask(priority, description);
    break;

  case "list":
    listTasks();
    break;

  case "delete":
    const deleteIndex = parseInt(process.argv[3]) - 1;
    deleteTask(deleteIndex);
    break;

  case "done":
    const doneIndex = parseInt(process.argv[3]) - 1;
    markTaskAsDone(doneIndex);
    break;

  case "help":
    console.log(`Usage :-
$ ./task add [priority] "[description]"    # Add a new item with priority [priority] and text "[description]" to the list
$ ./task list                             # Show incomplete priority list items sorted by priority in ascending order
$ ./task delete [index]                   # Delete the incomplete item with the given [index]
$ ./task done [index]                     # Mark the incomplete item with the given [index] as complete
$ ./task help                             # Show usage
$ ./task report                           # Generate a report`);
    break;

  case "report":
    const completedTasks = fs.readFileSync(completedFilePath, "utf8").trim().split("\n");
    const pendingTasks = fs
      .readFileSync(taskFilePath, "utf8")
      .trim()
      .split("\n")
      .map((task) => {
        const [priority, description] = task.split(" ");
        return { priority, description };
      });

    console.log(`Pending: ${pendingTasks.length}`);
    pendingTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.description} [${task.priority}]`);
    });

    console.log(`\nCompleted: ${completedTasks.length}`);
    completedTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task}`);
    });
    break;

  default:
    console.log("Invalid command. Use './task help' to see usage.");
    break;
}
