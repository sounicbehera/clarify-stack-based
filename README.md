# Clarify.com - A Hybrid Web3 E-commerce Platform

![Clarify.com Screenshot](https://i.imgur.com/your-screenshot-url.png) <!-- TODO: Replace with a real screenshot of your project -->

**Clarify.com** is a fully functional e-commerce website built for the Clarity Hackathon. This project demonstrates a complete and robust user flow for a decentralized application, combining a simulated user authentication with a real-time, on-chain payment verification system on the Stacks testnet.

This project was designed to be **resilient and demo-ready**, solving common dApp challenges by implementing a clever, real-world payment confirmation method that does not rely on potentially fragile frontend wallet connection libraries for the transaction itself.

---

## ✨ Key Features

* **Modern E-commerce UI:** A clean, responsive, and user-friendly interface for browsing products.
* **Full Shopping Cart Functionality:** Users can add products, manage quantities with `+` and `-` controls, and remove items.
* **Simulated User Authentication:** A "Connect Wallet" feature that verifies a user's identity by having them provide their public Stacks address, mimicking a real dApp login flow without the need for a direct wallet connection at this stage.
* **On-Chain Payment System:** The checkout process instructs the user to make a real STX transfer on the testnet from their own wallet (e.g., Leather, Hiro).
* **Real-Time Transaction Verification:** The core innovation of this project. The website includes a verification step that calls the public Stacks blockchain API to confirm that the user's payment has been sent before completing the order.
* **Unique Memo Identification:** The system generates a unique memo code for each transaction, ensuring that the verification process is secure, accurate, and can't be spoofed.

---

## 🛠️ Technologies Used

* **Frontend:** HTML, Tailwind CSS, Vanilla JavaScript
* **Blockchain:** Stacks
* **Smart Contract Language:** Clarity (for the on-chain treasury)
* **APIs:** Hiro's Public Stacks API for real-time transaction verification.
* **Tooling:** Clarinet for local development and deployment.

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

## ⚙️ How It Works: The User & Payment Flow

This project uses a hybrid approach to create a stable and impressive user experience.

### Part 1: User Verification (Simulation)

1.  A user clicks "Connect Wallet".
2.  A modal appears prompting them to enter their public Stacks address (e.g., `ST...`).
3.  The website saves this address as the user's identity for the session, and the UI updates to show they are "connected". This simulates a dApp login in a way that is guaranteed to work for the demo.

### Part 2: Payment & On-Chain Verification (Real)

1.  The user adds items to their cart and clicks "Proceed to Payment".
2.  The website generates a unique, one-time **memo code** (e.g., `CLARIFY-A8B2C1D9`).
3.  The user is shown a modal with three critical pieces of information:
    * The store's official STX address.
    * The exact amount of STX to send.
    * The unique memo code they **must** include in their transaction.
4.  The user opens their own wallet (Leather, Hiro, etc.), manually creates the transaction with the provided details, and sends it on the testnet.
5.  After sending, the user clicks the **"I Have Sent The Payment"** button on the website.
6.  The website's JavaScript makes a `fetch` call to the public Hiro API, requesting the most recent transactions sent to the store's address that are in the mempool (recent and unconfirmed).
7.  The script scans these transactions, looking for one that matches both the **exact amount** and the **unique memo code**.
8.  If a match is found, the payment is instantly verified, the user sees a success message, and the order is completed. If not, it prompts them to try again in a moment.

This robust method demonstrates a real-world, on-chain interaction and provides a flawless user experience for the hackathon presentation.




<img width="1920" height="1200" alt="Screenshot (33)" src="https://github.com/user-attachments/assets/4fa1887b-5226-4239-b2c7-7aaacbe8899a" />


<img width="1920" height="1200" alt="Screenshot (34)" src="https://github.com/user-attachments/assets/8dcb4bb1-af95-4665-83e3-36ecbe96de7d" />


<img width="1920" height="1200" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/a815ed10-7880-47fc-b263-cd1897c75def" />
