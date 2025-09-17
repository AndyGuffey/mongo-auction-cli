import { program } from "commander";
import mongoose from "mongoose";
import { connectDB, seedDB, addItem, deleteItem } from "./index.js";

// Set up commander for CLI commands
program.version("1.0.0").description("Auction Items Database Manager");

//todo -----------------------------------
//todo SEED DATABASE COMMAND
//todo -----------------------------------
program
  .command("seed")
  .description("Seed the database with sample auction items")
  .action(async () => {
    await connectDB();
    await seedDB();
    mongoose.connection.close();
  });

//* --------------------------------------
//* ADD ITEM COMMAND
//* --------------------------------------
program
  .command("add")
  .description("Add a new auction item")
  .action(async () => {
    await connectDB();
    await addItem();
    mongoose.connection.close();
  });

//! -----------------------------------
//! DELETE ITEM COMMAND
//! -----------------------------------
program
  .command("delete")
  .description("Delete an auction item")
  .action(async () => {
    await connectDB();
    await deleteItem();
    mongoose.connection.close();
  });

// Parse command line arguments
program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
