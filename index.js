// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase configuration object with database URL
const appSettings = {
    databaseURL: ""
}

// Initialize Firebase app with the configuration
const app = initializeApp(appSettings)

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app)

// Create a reference to the "shoppingList" node in the database
const shoppingListInDB = ref(database, "shoppingList")
const deliveryListInDB = ref(database, "deliveryList")

// Get references to HTML elements
const inputFieldEl = document.getElementById("input-field")      // Text input field
const inputFieldEl2 = document.getElementById("input-field2")    // Delivery Text input field
const addButtonEl = document.getElementById("add-button")        // Add button
const addButtonEl2 = document.getElementById("add-button2")      // Add button for Delivery shit
const shoppingListEl = document.getElementById("shopping-list")  // Container for shopping list items
const deliveryListEl = document.getElementById("delivery-list")  // Container for shopping list items


// Function to add item to the shopping list
function addShoppingItem() {
    // Get the value from the input field
    let inputValue = inputFieldEl.value
    
    // Only add if there's actually text in the input
    if (inputValue.trim() !== "") {
        // Push the new item to Firebase database (creates unique key automatically)
        push(shoppingListInDB, inputValue)
        
        // Clear the input field after adding
        clearInputFieldEl()
    }
}

// Function to add item to the delivery list
function addDeliveryItem() {
    // Get the value from the input field
    let inputValue = inputFieldEl2.value
    
    // Only add if there's actually text in the input
    if (inputValue.trim() !== "") {
        // Push the new item to Firebase database (creates unique key automatically)
        push(deliveryListInDB, inputValue)
        
        // Clear the input field after adding
        clearInputFieldEl2()
    }
}

// Add event listener to the add button
addButtonEl.addEventListener("click", function() {
    // Get the value from the input field
    let inputValue = inputFieldEl.value
    
    // Push the new item to Firebase database (creates unique key automatically)
    push(shoppingListInDB, inputValue)
    
    // Clear the input field after adding
    clearInputFieldEl()
})

// Add event listener to the add delivery button
addButtonEl2.addEventListener("click", function() {
    // Get the value from the input field
    let inputValue = inputFieldEl2.value
    
    // Push the new item to Firebase database (creates unique key automatically)
    push(deliveryListInDB, inputValue)
    
    // Clear the input field after adding
    clearInputFieldEl2()
})

// Add event listener for Enter key on the shopping list input field
inputFieldEl.addEventListener("keydown", function(event) {
    // Check if the pressed key is Enter
    if (event.key === "Enter") {
        addShoppingItem()
    }
})

// Add event listener for Enter key on the delivery list input field
inputFieldEl2.addEventListener("keydown", function(event) {
    // Check if the pressed key is Enter
    if (event.key === "Enter") {
        addDeliveryItem()
    }
})


// Listen for changes in the database and update the UI accordingly
onValue(shoppingListInDB, function(snapshot) {
    // Check if there's data in the database
    if (snapshot.exists()) {
        // Convert the snapshot data to an array of [key, value] pairs
        let itemsArray = Object.entries(snapshot.val())
        
        // Clear the current shopping list display
        clearShoppingListEl()
        
        // Loop through each item in the array
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]           // Current [key, value] pair
            let currentItemID = currentItem[0]        // Firebase-generated unique key
            let currentItemValue = currentItem[1]     // The actual shopping list item text
            
            // Add this item to the shopping list display
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        // If no data exists, show a placeholder message
        shoppingListEl.innerHTML = "No groceries... yet"
    }
})

// Listen for changes in the database and update the UI accordingly
onValue(deliveryListInDB, function(snapshot) {
    // Check if there's data in the database
    if (snapshot.exists()) {
        // Convert the snapshot data to an array of [key, value] pairs
        let itemsArray = Object.entries(snapshot.val())
        
        // Clear the current shopping list display
        clearDeliveryListEl()
        
        // Loop through each item in the array
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]           // Current [key, value] pair
            let currentItemID = currentItem[0]        // Firebase-generated unique key
            let currentItemValue = currentItem[1]     // The actual shopping list item text
            
            // Add this item to the shopping list display
            appendItemToDeliveryListEl(currentItem)
        }
    } else {
        // If no data exists, show a placeholder message
        deliveryListEl.innerHTML = "No delivery items... yet"
    }
})

// Function to clear all items from the shopping list display
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Function to clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Function to clear all items from the shopping list display
function clearDeliveryListEl() {
    deliveryListEl.innerHTML = ""
}

// Function to clear the input field
function clearInputFieldEl2() {
    inputFieldEl2.value = ""
}

// Function to add a new item to the shopping list display
function appendItemToShoppingListEl(item) {
    let itemID = item[0]      // Firebase unique key
    let itemValue = item[1]   // Shopping list item text
    
    // Create a new list item element
    let newEl = document.createElement("li")
    
    // Set the text content to the shopping list item
    newEl.textContent = itemValue
    
    // Add click event listener to delete item when clicked
    newEl.addEventListener("click", function() {
        // Create a reference to the specific item in the database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        // Remove the item from the database
        remove(exactLocationOfItemInDB)
    })
    
    // Add the new element to the shopping list container
    shoppingListEl.append(newEl)
}

// Function to add a new item to the shopping list display
function appendItemToDeliveryListEl(item) {
    let itemID = item[0]      // Firebase unique key
    let itemValue = item[1]   // Shopping list item text
    
    // Create a new list item element
    let newEl = document.createElement("li")
    
    // Set the text content to the shopping list item
    newEl.textContent = itemValue
    
    // Add click event listener to delete item when clicked
    newEl.addEventListener("click", function() {
        // Create a reference to the specific item in the database
        let exactLocationOfItemInDB = ref(database, `deliveryList/${itemID}`)
        
        // Remove the item from the database
        remove(exactLocationOfItemInDB)
    })
    
    // Add the new element to the shopping list container
    deliveryListEl.append(newEl)
}