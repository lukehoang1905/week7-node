const fs = require("fs");
const yargs = require("yargs");
const c = require("./modules/chalk");

function loadData() {
  try {
    const buffer = fs.readFileSync("data.json"); //path to the file we want to read
    const dataString = buffer.toString(); // a string
    const javaScriptObject = JSON.parse(dataString); // convert string to js object
    return javaScriptObject;
  } catch (err) {
    console.log("ERROR", err);
    return [];
  } // expect to be a js array
}

function saveData(data) {
  // write a string or buffer to data.json
  fs.writeFileSync("data.json", JSON.stringify(data));
}

yargs.command({
  command: "add",
  describe: "Used for adding a new todo",
  builder: {
    todo: {
      describe: "Describe what you are going to do.",
      demandOption: true, // is this arg required or not
      type: "string",
    },
    completed: {
      describe: "todo status",
      default: "uncompleted",
      type: "string",
    },
  },
  handler: function (arguments) {
    // console.log(arguments.todo, arguments.completed);
    const todos = loadData();
    const id = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
    todos.push({
      id: id,
      todo: arguments.todo,
      completed: arguments.completed,
    });
    // console.log(todos)
    saveData(todos);
    console.log("successfully");
  },
});

yargs.command({
  command: "list",
  describe:
    "List todos, if you want to see completed todos, use '--completed' ",
  builder: {
    completed: {
      describe:
        "show todos base on completed option \n  could be either 'all' || 'completed' || 'uncompleted'",
      type: "string",
      default: "all",
    },
  },
  handler: function ({ completed }) {
    const todos = loadData();
    let results;
    if (completed === "completed") {
      results = todos.filter((e) => e.completed === "completed");
    } else if (completed === "uncompleted") {
      results = todos.filter((e) => e.completed === "uncompleted");
    } else {
      results = todos;
    }
    results.forEach(
      (e) =>
        c.blue(`id: ${e.id}`) &
        c.yellow(`todo: ${e.todo}`) &
        (e.completed === "completed"
          ? c.green(`status: ${e.completed}`)
          : c.red(`status: ${e.completed}`))
    );
  },
});

yargs.command({
  command: "toggle",
  describe: "toogle completed and uncompleted",
  builder: {
    id: {
      describe: "The ID you want to delete",
      type: "number",
      demandOption: true,
    },
  },
  handler: function ({ id }) {
    const todos = loadData();

    const found = todos.findIndex((e) => e.id === id);
    if (found !== -1) {
      console.log("changed from", todos[found]);
      todos[found].completed =
        todos[found].completed === "completed" ? "uncompleted" : "completed";
    }
    saveData(todos);
    console.log("changed to", todos[found]);
    // const results = todos.map((todo) =>
    //   todo.id === args.id
    //     ? {
    //         ...todo,
    //         completed: `${
    //           todo.completed === "completed" ? "uncompleted" : "completed"
    //         }`,
    //       }
    //     : todo
    // );
  },
});

yargs.command({
  command: "delete",
  describe: "delete a todo using the ID",
  builder: {
    id: {
      describe: "The ID you want to delete",
      type: "number",
      default: 0,
    },
    a: {
      describe: "Delete all",
      type: "boolean",
      default: false,
    },
    completed: {
      describe: "Delete completed only",
      type: "boolean",
      default: false,
    },
  },
  handler: function (args) {
    const todos = loadData();
    if (args.id === 0 && args.a === false && args.completed === false) {
      console.log(
        `Please input option \n --id=<number> : to delete item with id  \n --completed : to delete completed item\n --a : To delete all`
      );
      return;
    }
    const results = args.a
      ? []
      : args.completed
      ? todos.filter((e) => e.completed === "uncompleted")
      : todos.filter((e) => e.id !== args.id);
    saveData(results);
    console.log("done");
  },
});

yargs.parse();
