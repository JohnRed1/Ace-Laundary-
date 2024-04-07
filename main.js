const washingPrice = 200;
const ironingPrice = 150;
let previewNumber = 1;
let receiptDatabase = [];
let inputValue = "";
let isListeningForKeydown = false;

// Check if there is any existing data in local storage
const storedReceipts = localStorage.getItem("receiptDatabase");
if (storedReceipts) {
  receiptDatabase = JSON.parse(storedReceipts);
}
console.log(receiptDatabase);

//Generate Receipt
function generateRandomPreviewNumber() {
  const digits = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  const letters =
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Generates two random uppercase letters
  return `#${digits}${letters}`;
}

//Enable Services
function enableServices() {
  const clothesType = document.getElementById("clothesType").value;
  const washingCheckbox = document.getElementById("washing");
  const ironingCheckbox = document.getElementById("ironing");
  const quantityInput = document.getElementById("quantity");
  const addButton = document.getElementById("addClothbtn");

  if (clothesType) {
    washingCheckbox.disabled = false;
    ironingCheckbox.disabled = false;
    quantityInput.disabled = false;
    addButton.disabled = false;
  } else {
    washingCheckbox.disabled = true;
    ironingCheckbox.disabled = true;
    quantityInput.disabled = true;
    addButton.disabled = true;
  }

  updateTotalPrice(); // Ensure total price is updated when enabling/disabling services
}

//Update Total Price
function updateTotalPrice() {
  const quantity = parseInt(document.getElementById("quantity").value) || 0;
  const washingCheckbox = document.getElementById("washing");
  const ironingCheckbox = document.getElementById("ironing");

  let totalPrice = 0;

  if (washingCheckbox.checked) {
    totalPrice += washingPrice;
  }

  if (ironingCheckbox.checked) {
    totalPrice += ironingPrice;
  }

  totalPrice *= quantity;

  document.getElementById("totalPrice").value = `₦${totalPrice}`;
}

//Add clothes to preview

function addClothes() {
  const clothesType = document.getElementById("clothesType").value;
  const washingCheckbox = document.getElementById("washing");
  const ironingCheckbox = document.getElementById("ironing");
  const quantity = document.getElementById("quantity").value;

  // Check if either washing or ironing is selected
  if (!(washingCheckbox.checked || ironingCheckbox.checked)) {
    errMsg("Please select either washing or ironing before adding clothes.");
    return;
  }

  if (quantity === "") {
    errMsg("Please select a value for quantity");
    return;
  }

  const selectedServices = [];

  if (washingCheckbox.checked) {
    selectedServices.push("Washing");
  }

  if (ironingCheckbox.checked) {
    selectedServices.push("Ironing");
  }

  const servicesString =
    selectedServices.length > 0 ? ` for ${selectedServices.join(" and ")}` : "";

  const newClothes = `${quantity} ${clothesType}(s)${servicesString} -  ${
    document.getElementById("totalPrice").value
  }`;

  const listItem = document.createElement("li");
  listItem.textContent = newClothes;

  // Add Delete button
  const deleteButton = document.createElement("button");
  deleteButton.className = "deleteBtn";
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteClothesItem(listItem);
  };
  listItem.appendChild(deleteButton);

  const selectedClothesList = document.getElementById("selectedClothesList");
  selectedClothesList.appendChild(listItem);

  if (!document.getElementById("previewNumberValue").textContent) {
    document.getElementById("previewNumberValue").textContent =
      generateRandomPreviewNumber();
  }

  // Increment the preview number for the next preview
  previewNumber++;

  // Update the total preview price
  const totalPreviewPrice =
    parseInt(document.getElementById("totalPreviewPriceValue").textContent) ||
    0;
  const clothesPrice =
    parseInt(document.getElementById("totalPrice").value.substring(1)) || 0;
  document.getElementById("totalPreviewPriceValue").textContent =
    totalPreviewPrice + clothesPrice;

  // show print button
  document.getElementById("printbtn").style.display = "flex";

  // Enable the paid checkbox after adding clothes
  document.getElementById("paidCheckbox").disabled = false;

  // Reset form values
  document.getElementById("clothesType").value = "";
  document.getElementById("washing").checked = false;
  document.getElementById("ironing").checked = false;
  document.getElementById("quantity").value = "";
  document.getElementById("totalPrice").value = "₦0";

  // Disable services and quantity after adding clothes
  document.getElementById("washing").disabled = true;
  document.getElementById("ironing").disabled = true;
  document.getElementById("quantity").disabled = true;
  document.getElementById("addClothbtn").disabled = true;
}

// Delete Clothes Item
function deleteClothesItem(listItem) {
  const clothesPrice = parseInt(listItem.textContent.match(/₦(\d+)/)[1]) || 0;

  // Update the total preview price
  const totalPreviewPrice =
    parseInt(document.getElementById("totalPreviewPriceValue").textContent) ||
    0;
  document.getElementById("totalPreviewPriceValue").textContent =
    totalPreviewPrice - clothesPrice;

  // Remove the list item
  listItem.remove();

  // If there are no more items in the preview, hide the print button and disable the paid checkbox
  if (document.getElementById("selectedClothesList").children.length === 0) {
    document.getElementById("printbtn").style.display = "none";
    document.getElementById("paidCheckbox").disabled = true;

    document.getElementById("previewNumberValue").textContent = "";
  }
}

// Generate Receipt Content
function generateReceiptContent() {
  const previewNumber =
    document.getElementById("previewNumberValue").textContent;
  const selectedClothesList = document.getElementById("selectedClothesList");
  const totalPreviewPrice = document.getElementById(
    "totalPreviewPriceValue"
  ).textContent;

  const paidCheckbox = document.getElementById("paidCheckbox");
  const isPaid = paidCheckbox.checked ? "Paid" : "Not Paid";

  let receiptContent = `
    <html>
      <head>
        <title> Ace Laundry Invoice</title>
        <style>
          /* Your CSS styles for the receipt go here */
          body {
            font-family: "Raleway", sans-serif;
            font-size: 1.2rem;
          }
          img{
            width:5rem;

          }
          h2{
            white-space: nowrap;
            font-size: 0.8rem;
            color:  rgb(34, 7, 45);
            text-transform: uppercase;
            text-shadow: 1px 2px 1px #b6176c;
            letter-spacing: 2px;
          }
          div{
            display:flex;
            align-items:center;
            justify-content: center;
            flex-direction:column;
            padding:0.5rem 0rem;
            border-bottom:2px dotted #000000
          }
        
          .footer{
            position:fixed;
            bottom:0;
            left:0;
            right:0;
          }
          
          .Price{
            display:flex;
            flex-direction:column;
            align-items:right;
            border:none;
          }
          .orders{
            display:flex;
            align-items:start;
            justify-content: start;
            flex-direction:column;

          }
         
        </style>
      </head>
      <body>

      <div>
      <img src="Ace logo.png" alt="Logo" />
      <h2> Ace Laundry</h2>
      </div>

        <p>Receipt Number: ${previewNumber}</p>
        <div class = "orders">
        <ul>`;

  // Iterate through each list item in the selected clothes list
  for (let i = 0; i < selectedClothesList.children.length; i++) {
    const listItem = selectedClothesList.children[i];

    // Check if the list item has the "deleteBtn" class
    const hasDeleteButton = listItem.querySelector(".deleteBtn");

    // Exclude the delete button if present
    const listItemContent = hasDeleteButton
      ? listItem.firstChild.nodeValue
      : listItem.textContent;

    // Add the list item content to the receipt content
    receiptContent += `<li>${listItemContent}</li>`;
  }

  receiptContent += `</ul>
        
        </div>
      

         <div class = "Price">
         <p>Total Price: ₦${totalPreviewPrice}</p>
         <p>Paid Status: ${isPaid}</p>
         
         </div>



        <div class ="footer">
        <h2>Thank you for trusting us with your clothes</h2>
        
        </div>
      </body>
    </html>`;

  return receiptContent;
}

// Add this function for printing the receipt
function printReceipt() {
  storeReceipt();
  console.log(receiptDatabase);
  const printWindow = window.open("", "_blank");
  const receiptContent = generateReceiptContent();
  printWindow.document.write(receiptContent);
  printWindow.document.close();
  printWindow.print();
}

//Snackbar
function errMsg(message) {
  // Get the snackbar DIV
  let snackbar = document.getElementById("empty-field-alert");

  snackbar.className = "show";
  snackbar.textContent = "";
  snackbar.textContent = message;

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}


// function storeReceipt() {
//   const previewNumber =
//     document.getElementById("previewNumberValue").textContent;
//   const selectedClothesList = document.getElementById("selectedClothesList");
//   const totalPreviewPrice = document.getElementById(
//     "totalPreviewPriceValue"
//   ).textContent;

//   const paidCheckbox = document.getElementById("paidCheckbox");
//   const isPaid = paidCheckbox.checked ? "Paid" : "Not Paid";

//   // Format the current date as "YYYY-MM-DD"
//   const currentDate = new Date();
//   const formattedDate = currentDate.toISOString().split('T')[0];

//   // Object to represent the receipt
//   const receiptInfo = {
//     previewNumber,
//     items: [],
//     totalPreviewPrice,
//     isPaid,
//     date: formattedDate, // Set date using a standardized format
//     addedTimestamp: Date.now(),
//   };

//   // Iterate through each list item in the selected clothes list
//   for (let i = 0; i < selectedClothesList.children.length; i++) {
//     const listItem = selectedClothesList.children[i];

//     // Check if the list item has the "deleteBtn" class
//     const hasDeleteButton = listItem.querySelector(".deleteBtn");

//     // Exclude the delete button if present
//     const listItemContent = hasDeleteButton
//       ? listItem.firstChild.nodeValue
//       : listItem.textContent;

//     // Add the list item content to the receipt object
//     receiptInfo.items.push(listItemContent);
//   }

//   // Store the receipt information in the array
//   receiptDatabase.push(receiptInfo);
//   localStorage.setItem("receiptDatabase", JSON.stringify(receiptDatabase));
// }

function storeReceipt() {
  const previewNumber =
    document.getElementById("previewNumberValue").textContent;
  const selectedClothesList = document.getElementById("selectedClothesList");
  const totalPreviewPrice = document.getElementById(
    "totalPreviewPriceValue"
  ).textContent;

  const paidCheckbox = document.getElementById("paidCheckbox");
  const isPaid = paidCheckbox.checked ? "Paid" : "Not Paid";

  // Format the current date as "MM/DD/YYYY"
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  // Object to represent the receipt
  const receiptInfo = {
    previewNumber,
    items: [],
    totalPreviewPrice,
    isPaid,
    date: formattedDate, // Set date using MM/DD/YYYY format
    addedTimestamp: Date.now(),
  };

  // Iterate through each list item in the selected clothes list
  for (let i = 0; i < selectedClothesList.children.length; i++) {
    const listItem = selectedClothesList.children[i];

    // Check if the list item has the "deleteBtn" class
    const hasDeleteButton = listItem.querySelector(".deleteBtn");

    // Exclude the delete button if present
    const listItemContent = hasDeleteButton
      ? listItem.firstChild.nodeValue
      : listItem.textContent;

    // Add the list item content to the receipt object
    receiptInfo.items.push(listItemContent);
  }

  // Store the receipt information in the array
  receiptDatabase.push(receiptInfo);
  localStorage.setItem("receiptDatabase", JSON.stringify(receiptDatabase));
}


// Function to search for a receipt in the database by receipt number
function searchReceiptByNumber(receiptNumber) {
  for (const receipt of receiptDatabase) {
    if (receipt.previewNumber === receiptNumber) {
      return receipt;
    }
  }
  return null; // Return null if no matching receipt is found
}

// Function to handle the search when the button is clicked or Enter is pressed
function searchReceipt() {
  const searchInput = document.querySelector(".searchId");
  const receiptNumber = searchInput.value.trim();

  if (receiptNumber === "") {
    errMsg("Please enter a receipt number for the search.");

    return;
  }

  const searchResult = searchReceiptByNumber(receiptNumber);

  if (searchResult) {
    displayReceiptDetails(searchResult);
  } else {
    errMsg("Receipt not found.");
  }
}

function displayReceiptDetails(receipt) {
  // Hide the matching receipt numbers container
  const matchingReceiptsList = document.getElementById("matchingReceiptsList");
  matchingReceiptsList.style.display = "none";

  // Clear existing receipt details if any
  let receiptDetailsContainer = document.getElementById("receiptDetails");
  receiptDetailsContainer.innerHTML = "";

  // Create elements to display receipt details
  const receiptNumberElement = document.createElement("p");
  receiptNumberElement.textContent = `Receipt Number: ${receipt.previewNumber}`;

  const itemsListElement = document.createElement("ul");
  for (const item of receipt.items) {
    const listItemElement = document.createElement("li");
    listItemElement.textContent = item;
    itemsListElement.appendChild(listItemElement);
  }

  const totalPreviewPriceElement = document.createElement("p");
  totalPreviewPriceElement.textContent = `Total Price: ₦${receipt.totalPreviewPrice}`;

  const isPaidElement = document.createElement("p");
  isPaidElement.textContent = `Paid Status: ${receipt.isPaid}`;

  // Append elements to the container
  receiptDetailsContainer.appendChild(receiptNumberElement);
  receiptDetailsContainer.appendChild(itemsListElement);
  receiptDetailsContainer.appendChild(totalPreviewPriceElement);
  receiptDetailsContainer.appendChild(isPaidElement);

  // Show the receipt details container
  receiptDetailsContainer.style.display = "block";
}

function handleInput() {
  let matchingReceiptsList = document.getElementById("matchingReceiptsList");
  matchingReceiptsList.innerHTML = "";
  matchingReceiptsList.style.display = "none";
  let receiptDetailsContainer = document.getElementById("receiptDetails");
  receiptDetailsContainer.innerHTML = "";
  receiptDetailsContainer.style.display = "none";

  const searchInput = document.querySelector(".searchId");
  inputValue = searchInput.value.trim();

  // Check if the input value has four or more characters
  if (inputValue.length >= 4) {
    isListeningForKeydown = true;
    const matchingReceipts = searchMatchingReceipts(inputValue);
    displayMatchingReceiptNumbers(matchingReceipts);
  } else {
    isListeningForKeydown = false;
  }
}

function handleKeyDown() {
  if (!isListeningForKeydown) {
    return;
  }

  const matchingReceipts = searchMatchingReceipts(inputValue);

  // Check if there are matching receipts
  if (matchingReceipts.length > 0) {
    // Display the matching receipt number
    displayMatchingReceiptNumbers(matchingReceipts);
  } else {
    errMsg("No matching receipts found.");
  }
}

function displayMatchingReceiptNumbers(matchingReceipts) {
  // Clear existing content if any
  const matchingReceiptsList = document.getElementById("matchingReceiptsList");
  matchingReceiptsList.innerHTML = "";

  // Create an unordered list for clickable receipt numbers
  const ulElement = document.createElement("ul");

  // Check if there are matching receipts
  if (matchingReceipts.length > 0) {
    // Iterate through matching receipts and create clickable items
    for (const receipt of matchingReceipts) {
      const liElement = document.createElement("li");
      liElement.textContent = receipt.previewNumber;
      liElement.onclick = function () {
        displayReceiptDetails(receipt);
      };
      ulElement.appendChild(liElement);
    }

    // Append the list to the container
    matchingReceiptsList.appendChild(ulElement);

    // Show the container
    matchingReceiptsList.style.display = "block";
  } else {
    // Hide the container if there are no matching receipts
    matchingReceiptsList.style.display = "none";
  }
}

function searchMatchingReceipts(searchValue) {
  return receiptDatabase.filter((receipt) =>
    receipt.previewNumber.includes(searchValue)
  );
}

// Function to calculate total amount paid and total amount not paid
function calculateTotalAmounts() {
  let totalAmountPaid = 0;
  let totalAmountNotPaid = 0;

  for (const receipt of receiptDatabase) {
    const totalPreviewPrice = parseInt(receipt.totalPreviewPrice);

    if (receipt.isPaid === "Paid") {
      totalAmountPaid += totalPreviewPrice;
    } else {
      totalAmountNotPaid += totalPreviewPrice;
    }
  }

  return { totalAmountPaid, totalAmountNotPaid };
}

const expand_btn = document.querySelector(".expand-btn");

let activeIndex;

expand_btn.addEventListener("click", () => {
  // const iconImage = expand_btn.querySelector('img');

  document.body.classList.toggle("collapsed");
});

const current = window.location.href;

const allLinks = document.querySelectorAll(".sidebar-links a");

allLinks.forEach((elem) => {
  elem.addEventListener("click", function () {
    const hrefLinkClick = elem.href;

    allLinks.forEach((link) => {
      if (link.href == hrefLinkClick) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
});
