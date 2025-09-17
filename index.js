import mongoose from "mongoose";
import chalk from "chalk";
import inquirer from "inquirer";

// Import the Item model- represents the data structure in MongoDB
// Models are JS classes that define the structure of documents in a collection
import Item from "./models/Item.js";

// Import seed data from data directory
import seedData from "./data/seedData.js";

//*--------------------------------
//* Connect to the MongoDB database
//*--------------------------------
// MongoDB uses connection URL to ID DB server & name
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mission05");
    console.log(
      chalk.cyan.underline(`MongoDB Connected: ${mongoose.connection.host}`)
    );
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};
//? ====================================
//? Command Line Interface (CLI) Setup
//? ====================================
/**
 * Mongo DB Operations:
 * - deleteMany({}) - Removes all documents from a collection
 * - insertMany(seedData) - Bulk insert of multiple documents
 * - Each object in seedData becomes a document in the MongoDB collection
 * - MongoDB automatically assigns a unique _id to each document
 */

//? -------------------------------
//? SEED DATABASE FUNCTION
// from seedData.js
//? -------------------------------
const seedDB = async () => {
  try {
    // First, clear existing data to avoid duplicates
    await Item.deleteMany({});

    // Insert the seed data as new documents
    await Item.insertMany(seedData);

    console.log(chalk.green.bold("✓ Database seeded successfully!"));
    console.log(chalk.yellow("Items added:"));
    seedData.forEach((item) => {
      console.log(
        chalk.yellow(
          `- ${item.title} (Start: $${item.start_price}, Reserve: $${item.reserve_price})`
        )
      );
    });

    // Create text index for search functionality - important for future search API
    await Item.collection.createIndex({ title: "text", description: "text" });
    console.log(
      chalk.green(
        "✓ Text search indexes created for title and description fields"
      )
    );
  } catch (error) {
    console.error(chalk.red(`Error seeding database: ${error.message}`));
  }
};

//? -------------------------------
//? ADD ITEM FUNCTION
//? -------------------------------
/**
 * Add a new item to the database
 * This function prompts the user for item details and adds it to MongoDB
 */
const addItem = async () => {
  try {
    // Uses inqirer to prompt user for item details
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter item title:",
        validate: (input) => (input.trim() !== "" ? true : "Title is required"),
      },
      {
        type: "input",
        name: "description",
        message: "Enter item description:",
        validate: (input) =>
          input.trim() !== "" ? true : "Description is required",
      },
      {
        type: "number",
        name: "start_price",
        message: "Enter starting price:",
        validate: (input) =>
          !isNaN(input) && input > 0
            ? true
            : "Starting price must be a positive number",
      },
      {
        type: "number",
        name: "reserve_price",
        message: "Enter reserve price:",
        validate: (input) =>
          !isNaN(input) && input > 0
            ? true
            : "Reserve price must be a positive number",
      },
    ]);
    // Create a new Item document using the Item model
    const newItem = new Item({
      title: answers.title,
      description: answers.description,
      start_price: answers.start_price,
      reserve_price: answers.reserve_price,
    });

    // Save the new item to the database
    await newItem.save();
    console.log(chalk.green.bold("✓ New item added successfully!"));
  } catch (error) {
    console.error(chalk.red(`Error adding item: ${error.message}`));
  }
};

//? -------------------------------
//? DELETE ITEM FUNCTION
//? -------------------------------
const deleteItem = async () => {
  try {
    // First get all items to show as choices
    const items = await Item.find({});

    if (items.length === 0) {
      console.log(chalk.yellow("No items found in the database to delete"));
      return;
    }

    // Create choices for the inquirer prompt
    const choices = items.map((item) => ({
      name: `${item.title} (Start: $${item.start_price}, Reserve: $${item.reserve_price})`,
      value: item._id.toString(),
    }));

    // Add an option to cancel
    choices.push({
      name: "Cancel - Don't delete anything",
      value: "cancel",
    });

    // Prompt user to select an item to delete
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "itemId",
        message: "Select an item to delete:",
        choices: choices,
      },
    ]);

    // If user selected cancel
    if (answer.itemId === "cancel") {
      console.log(chalk.yellow("Operation cancelled"));
      return;
    }

    // Confirm deletion
    const confirmation = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to delete this item?",
        default: false,
      },
    ]);

    if (confirmation.confirm) {
      // Delete the item
      await Item.findByIdAndDelete(answer.itemId);
      console.log(chalk.green.bold("✓ Item deleted successfully!"));
    } else {
      console.log(chalk.yellow("Deletion cancelled"));
    }
  } catch (error) {
    console.error(chalk.red(`Error deleting item: ${error.message}`));
  }
};
export { connectDB, seedDB, addItem, deleteItem };
