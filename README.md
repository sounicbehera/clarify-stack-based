# Clarify.com - A Decentralized E-commerce dApp

![Clarify.com Screenshot](https://i.imgur.com/your-screenshot-url.png) <!-- TODO: Replace with a real screenshot of your project -->

A fully functional e-commerce website built for the Clarity Hackathon. This project demonstrates a complete user flow for a decentralized application, from browsing products to making a payment on the Stacks testnet. The key feature is a robust, real-time payment verification system that checks the blockchain for a user's transaction.

---

## ✨ Key Features

* **Modern E-commerce UI:** A clean and responsive user interface for browsing products.
* **Full Shopping Cart Functionality:** Users can add products to a cart and see a running total.
* **On-Chain Payment System:** Instead of a traditional credit card checkout, users are given instructions to send a real STX transaction on the testnet.
* **Real-Time Transaction Verification:** The website includes a verification step that calls the public Stacks blockchain API to confirm that the user's payment has been sent before completing the order.
* **Unique Memo Identification:** The system generates a unique memo for each transaction, ensuring that the verification process is secure and accurate.

---

## 🛠️ Technologies Used

* **Frontend:** HTML, Tailwind CSS, Vanilla JavaScript
* **Blockchain:** Stacks
* **Smart Contract Language:** Clarity
* **APIs:** Hiro's Public Stacks API for transaction verification.

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

You must have **Node.js** and **npm** installed on your machine.
* [Download Node.js](https://nodejs.org/en/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd your-repo-name
    ```

3.  **Install the local web server:**
    This project must be run from a server to function correctly. We use `live-server` for this.
    ```bash
    npm install -g live-server
    ```

4.  **Run the application:**
    ```bash
    live-server
    ```
    Your browser will automatically open to the project's homepage.

---

## ⚙️ How It Works: The Payment Flow

This project uses a clever and robust method to handle payments without requiring a wallet connection library, making it resilient to many common dApp errors.

1.  **Cart & Checkout:** The user adds items to their cart and clicks "Proceed to Payment".
2.  **Instruction Generation:** The website generates a unique, one-time **memo code** (e.g., `CLARIFY-A8B2C1D9`) for this specific order.
3.  **User Payment:** The user is shown a modal with three critical pieces of information:
    * The store's STX address to send funds to.
    * The exact amount of STX to send.
    * The unique memo code they **must** include in their transaction.
4.  **Verification:** After the user sends the transaction from their own wallet (Leather, Hiro, etc.), they click the "I Have Sent The Payment" button.
5.  **Blockchain Check:** The website makes a `fetch` call to the public Hiro API, requesting the most recent transactions sent to the store's address.
6.  **Confirmation:** The script scans the recent transactions, looking for one that matches both the **amount** and the unique **memo code**. If a match is found, the payment is confirmed, and the order is completed.

This method is secure, reliable, and demonstrates a real-world application of interacting with the Stacks blockchain from a standard web application.


<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/15b8e04a-3a22-4c2f-93d5-4bd745400c9c" />
