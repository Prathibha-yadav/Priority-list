const fs = require("fs");

const taskFilePath = `${__dirname}/task.txt`;
const completedFilePath = `${__dirname}/completed.txt`;

const addTask = (priority, description) => {
  const task = `${priority} ${description}`;
  fs.appendFileSync(taskFilePath, task + "\n");
  console.log(`Added task: "${description}" with priority ${priority}`);
};

const listTasks = () => {
  if (fs.existsSync(taskFilePath)) {
    const tasks = fs
      .readFileSync(taskFilePath, "utf8")
      .trim()
      .split("\n")
      .map((task) => task.split(" "));
    if (tasks.length > 0) {
      tasks.sort((a, b) => a[0] - b[0]);
      console.log("Tasks:");
      tasks.forEach(([priority, ...description], index) => {
        console.log(`${index + 1}. ${description.join(" ")} [${priority}]`);
      });
    } else {
      console.log("There are no pending tasks!");
    }
  } else {
    console.log("There are no pending tasks!");
  }
};

const deleteTask = (index) => {
  if (fs.existsSync(taskFilePath)) {
    const tasks = fs.readFileSync(taskFilePath, "utf8").trim().split("\n");
    if (index >= 0 && index < tasks.length) {
      tasks.splice(index, 1);
      fs.writeFileSync(taskFilePath, tasks.join("\n") + "\n");
      console.log(`Deleted task #${index + 1}`);
    } else {
      console.log(
        `Error: task with index #${index + 1} does not exist. Nothing deleted.`
      );
    }
  } else {
    console.log("There are no pending tasks!");
  }
};

const markTaskAsDone = (index) => {
  if (fs.existsSync(taskFilePath)) {
    const tasks = fs.readFileSync(taskFilePath, "utf8").trim().split("\n");
    if (index >= 0 && index < tasks.length) {
      const task = tasks[index];
      tasks.splice(index, 1);
      fs.writeFileSync(taskFilePath, tasks.join("\n") + "\n");
      fs.appendFileSync(completedFilePath, task.split(" ").slice(1).join(" ") + "\n");
      console.log("Marked item as done.");
    } else {
      console.log(
        `Error: no incomplete item with index #${index + 1} exists.`
      );
    }
  } else {
    console.log("There are no pending tasks!");
  }
};

const reportTasks = () => {
  if (fs.existsSync(taskFilePath) || fs.existsSync(completedFilePath)) {
    const pendingTasks = fs.existsSync(taskFilePath)
      ? fs.readFileSync(taskFilePath, "utf8").trim().split("\n")
      : [];
    const completedTasks = fs.existsSync(completedFilePath)
      ? fs.readFileSync(completedFilePath, "utf8").trim().split("\n")
      : [];

    console.log(`Pending: ${pendingTasks.length}`);
    pendingTasks.forEach((task, index) => {
      const [priority, ...description] = task.split(" ");
      console.log(`${index + 1}. ${description.join(" ")} [${priority}]`);
    });

    console.log(`\nCompleted: ${completedTasks.length}`);
    completedTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task}`);
    });
  } else {
    console.log("There are no tasks!");
  }
};

const command = process.argv[2];

switch (command) {
  case "add":
    const priority = process.argv[3];
    const description = process.argv.slice(4).join(" ");
    if (priority && description) {
      addTask(priority, description);
    } else {
      console.log("Error: Missing priority or description. Nothing added!");
    }
    break;

  case "ls":
    listTasks();
    break;

  case "del":
    const deleteIndex = parseInt(process.argv[3]) - 1;
    if (!isNaN(deleteIndex)) {
      deleteTask(deleteIndex);
    } else {
      console.log("Error: Missing NUMBER for deleting tasks.");
    }
    break;

  case "done":
    const doneIndex = parseInt(process.argv[3]) - 1;
    if (!isNaN(doneIndex)) {
      markTaskAsDone(doneIndex);
    } else {
      console.log("Error: Missing NUMBER for marking tasks as done.");
    }
    break;

  case "help":
    console.log(`Usage :-
$ ./task add [priority] "[description]"    # Add a new item with priority [priority] and text "[description]" to the list
$ ./task ls                               # Show incomplete priority list items sorted by priority in ascending order
$ ./task del [index]                      # Delete the incomplete item with the given [index]
$ ./task done [index]                     # Mark the incomplete item with the given [index] as complete
$ ./task help                             # Show usage
$ ./task report                           # Generate a report`);
    break;

  case "report":
    reportTasks();
    break;

  default:
    console.log("Invalid command. Use './task help' to see usage.");
    break;
}
