# 💳 Full-Stack Payment Gateway

A complete payment processing system that simulates a real-world payment gateway. It handles secure checkout, transaction validation, and merchant dashboard analytics.

## 🚀 Tech Stack
* **Frontend:** React.js, Tailwind CSS
* **Backend:** Java Spring Boot (REST API)
* **Database:** PostgreSQL
* **Infrastructure:** Docker & Docker Compose

## 🛠️ Features
* **Secure Checkout Page:** Validates credit card numbers using the Luhn Algorithm.
* **Merchant Dashboard:** Real-time view of total transaction volume and count.
* **Transaction History:** Detailed list of all successful and failed payments.
* **End-to-End Simulation:** Simulates bank processing delays (2 seconds).

## ⚙️ How to Run Locally

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/srinadh93/payment-gateway-project.git](https://github.com/srinadh93/payment-gateway-project.git)
    cd payment-gateway-project
    ```

2.  **Start with Docker**
    ```bash
    docker-compose up --build
    ```

3.  **Access the Applications**
    * **Merchant Dashboard:** [http://localhost:3000](http://localhost:3000)
        * *Login:* `test@example.com` / `123456`
    * **Customer Checkout:** [http://localhost:3001](http://localhost:3001)

## 📡 API Endpoints
* `POST /api/v1/payments` - Process a new transaction.
* `GET /api/v1/payments` - Retrieve transaction history.