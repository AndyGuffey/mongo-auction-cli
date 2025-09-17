# Auction Database CLI Tool

A tool for managing auction item data in MongoDB with both CLI and API interfaces.

---

## Overview

This CLI tool allows team members to easily:

- Seed MongoDB with sample auction items (CLI)
- Add and delete auction items (CLI)
- Search for items using various criteria (API)
- Find similar items (API)

Each auction item contains the following fields:

- **`title`**: Name of the auction item
- **`description`**: Detailed description of the item
- **`start_price`**: Initial bidding price
- **`reserve_price`**: Minimum acceptable price for the item

---

## Prerequisites

- Node.js (**v14 or higher**)
- MongoDB (**running locally on default port 27017**)
- npm (**Node Package Manager**)

---

## Installation

1. **Clone this repository:**

   ```bash
   git clone https://github.com/AndyGuffey/mongo-auction-cli.git
   cd mission-05
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Ensure MongoDB is running on your local machine:**

   ```bash
   # Check if MongoDB is running
   mongod --version

   # Start MongoDB if needed (commands may vary by OS)
   brew services start mongodb-community   # macOS with Homebrew
   sudo systemctl start mongod             # Linux with systemd
   ```

---

## CLI Usage

### 🔹 Seed the Database

Populate the database with sample auction items:

```bash
npm run seed
# or
node commands.js seed
```

This command will:

- Connect to MongoDB
- Clear any existing items in the database
- Insert sample auction items
- Create text indexes for search functionality

---

### 🔹 Add New Item

Add a new auction item to the database:

```bash
npm run add
# or
node commands.js add
```

This command will:

- Prompt you for the item details (title, description, start price, reserve price)
- Validate your input
- Add the new item to the database

---

### 🔹 Delete an Item

Delete an auction item from the database:

```bash
npm run delete
# or
node commands.js delete
```

This command will:

- Show a list of all available items
- Let you select which item to delete
- Ask for confirmation before deletion

---

### 🔹 View Help

To see all available commands:

```bash
npm start
# or
node commands.js
```

---

## API Usage

Start the API server:

```bash
npm run server  # Standard mode
npm run dev     # Development mode with auto-restart
```

### 🔸 Base URL

```bash
http://localhost:3000/
```

### 🔸 Get All Items

Retrieve all auction items from the database

```bash
GET http://localhost:3000/api/items
```

Example Response:

```bash
[
  {
    "_id": "65f583a7c390d3e426a6b8b1",
    "title": "Surfboard",
    "description": "The best surfboard ever",
    "start_price": 100,
    "reserve_price": 500
  },
  ...
]
```

### 🔸 Search by Keywords

Search for items using text search across title and description.

```bash
GET http://localhost:3000/api/items/search?query=surfboard
```

### 🔸 Search by Price Range

Find items within a specific price range.

```bash
GET http://localhost:3000/api/items/price?min=100&max=600
GET http://localhost:3000/api/items/price?min=500
GET http://localhost:3000/api/items/price?max=200
```

### 🔸 Find Similar Items

Discover items similar to a specific item based on text similarity.

```bash
GET http://localhost:3000/api/items/similar/65f583a7c390d3e426a6b8b1
```

---

## Technologies Used

- Node.js
- MongoDB & Mongoose
- Commander.js _(for CLI commands)_
- Express.js _(for API server)_
- CORS _(for API access control)_
- Chalk _(for colored console output)_
- Inquirer _(for interactive prompts)_
- ES Modules

---

## Checking Results in MongoDB Compass

After running **seed**, **add**, or **delete** commands, you can verify changes in MongoDB Compass:

1. Open MongoDB Compass and connect to:
   ```
   mongodb://localhost:27017
   ```
2. Navigate to the **mission05** database
3. Click on the **items** collection
4. You should see all your auction items displayed in the GUI

---

## 🚧 Future Enhancements

- Add complete CRUD operations to the API
- Implement authentication for secure API access
- Add pagination for large result sets
- Integrate advanced AI-assisted search capabilities
