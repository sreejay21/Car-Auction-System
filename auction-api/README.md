# Car Auction System API

A **Node.js + Express + MongoDB (Atlas)** based REST API for managing auctions of cars, dealers, and bids.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
    - [Auth Endpoints](#auth-endpoints)
    - [Car Endpoints](#car-endpoints)
    - [Dealer Endpoints](#dealer-endpoints)
    - [Auction Endpoints](#auction-endpoints)
- [Response Format](#response-format)
- [Testing](#testing)

---

## Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- **MongoDB Atlas** account

---

## Setup

1. **Clone the repository**:
     ```bash
     git clone https://github.com/sreejay21/Car-Auction-System.git
     cd Car-Auction-System/auction-api
     ```

2. **Install dependencies**:
     ```bash
     npm install
     ```

3. **Create a `.env` file** in the root directory:
     ```env
     PORT=5000
     MONGO_URI=<Your MongoDB Atlas URI>
     JWT_SECRET=<YourSecretKey>
     ADMIN_USERNAME=Admin
     ADMIN_PASSWORD=Admin
     ```
     > Replace `<Your MongoDB Atlas URI>` with your MongoDB connection string.  
     > **Note**: Passwords for dealers should be hashed before storing.

4. **Start the server**:
     ```bash
     npm run dev
     ```
     The server runs on [http://localhost:5000](http://localhost:5000).

---

## Environment Variables

| Key             | Description                          |
|------------------|--------------------------------------|
| `PORT`          | Server port (default: 5000)         |
| `MONGO_URI`     | MongoDB Atlas connection string     |
| `JWT_SECRET`    | Secret key for JWT token generation |
| `ADMIN_USERNAME`| Admin username                      |
| `ADMIN_PASSWORD`| Admin password                      |

---

## API Endpoints

### Auth Endpoints
1. **Generate Admin Token**  
     **POST** `/api/v1/auction/token`  
     **Body**:
     ```json
     {
         "username": "Admin",
         "password": "Admin"
     }
     ```
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 200,
         "result": {
             "token": "<JWT_TOKEN>"
         }
     }
     ```
     > Use the token in the `Authorization` header for all protected endpoints:  
     > `Authorization: Bearer <JWT_TOKEN>`

---

### Car Endpoints
1. **Create Car**  
     **POST** `/api/v1/car/createCar`  
     **Headers**:  
     `Authorization: Bearer <JWT_TOKEN>`  
     **Body**:
     ```json
     {
         "make": "Tesla",
         "model": "Model X",
         "year": 2025
     }
     ```
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 201,
         "result": {
             "car": {
                 "carId": "<CAR_ID>",
                 "make": "Tesla",
                 "model": "Model X",
                 "year": 2025
             }
         }
     }
     ```

---

### Dealer Endpoints
1. **Create Dealer**  
     **POST** `/api/v1/dealer`  
     **Headers**:  
     `Authorization: Bearer <JWT_TOKEN>`  
     **Body**:
     ```json
     {
         "name": "Dealer Name",
         "email": "dealer@example.com",
         "username": "dealer1",
         "password": "dealerPass"
     }
     ```
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 201,
         "result": {
             "dealer": {
                 "dealerId": "<DEALER_ID>",
                 "name": "Dealer Name",
                 "email": "dealer@example.com",
                 "username": "dealer1"
             },
             "message": "Dealer created successfully"
         }
     }
     ```

2. **Dealer Login**  
     **POST** `/api/v1/dealer/login`  
     **Body**:
     ```json
     {
         "username": "dealer1",
         "password": "dealerPass"
     }
     ```
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 200,
         "result": {
             "token": "<JWT_TOKEN>"
         }
     }
     ```

---

### Auction Endpoints
1. **Create Auction**  
     **POST** `/api/v1/auction/createAuction`  
     **Headers**:  
     `Authorization: Bearer <JWT_TOKEN>`  
     **Body**:
     ```json
     {
         "car": "<CAR_ID>",
         "startingPrice": 10000,
         "startTime": "2025-10-02T10:00:00Z",
         "endTime": "2025-10-02T12:00:00Z"
     }
     ```
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 201,
         "result": {
             "auction": {
                 "auctionId": "<AUCTION_ID>",
                 "car": "<CAR_ID>",
                 "startingPrice": 10000,
                 "startTime": "2025-10-02T10:00:00.000Z",
                 "endTime": "2025-10-02T12:00:00.000Z",
                 "status": "pending"
             },
             "message": "Auction created successfully"
         }
     }
     ```

2. **Start Auction**  
     **PATCH** `/api/v1/auction/status/<AUCTION_ID>`  
     **Headers**:  
     `Authorization: Bearer <JWT_TOKEN>`  
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 200,
         "result": {
             "auction": {
                 "auctionId": "<AUCTION_ID>",
                 "status": "active"
             },
             "message": "Auction started successfully"
         }
     }
     ```

3. **Place Bid**  
     **POST** `/api/v1/auction/placeBids`  
     **Headers**:  
     `Authorization: Bearer <JWT_TOKEN>`  
     **Body**:
     ```json
     {
         "auctionId": "<AUCTION_ID>",
         "dealerId": "<DEALER_ID>",
         "bidAmount": 15000
     }
     ```
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 201,
         "result": {
             "bid": {
                 "bidId": "<BID_ID>",
                 "auction": "<AUCTION_ID>",
                 "dealerId": "<DEALER_ID>",
                 "bidAmount": 15000,
                 "previousBid": 10000
             },
             "message": "Bid placed successfully"
         }
     }
     ```

4. **Get Winner Bid**  
     **GET** `/api/v1/auction/<AUCTION_ID>/winner-bid`  
     **Headers**:  
     `Authorization: Bearer <JWT_TOKEN>`  
     **Response**:
     ```json
     {
         "status": true,
         "responsecode": 200,
         "result": {
             "bidId": "<BID_ID>",
             "auction": "<AUCTION_ID>",
             "dealerId": "<DEALER_ID>",
             "bidAmount": 15000
         }
     }
     ```

---

## Response Format

### Success:
```json
{
    "status": true,
    "responsecode": <HTTP_STATUS_CODE>,
    "result": { ... }
}
```

### Error:
```json
{
    "status": false,
    "responsecode": <HTTP_STATUS_CODE>,
    "error": "Error message"
}
```

---

## Testing

1. **Run all Jest tests**:
     ```bash
     npm run test
     ```

2. **Use Postman to test endpoints**:
     - Generate JWT token using `/api/v1/auction/token` or dealer login.
     - Set `Authorization: Bearer <JWT_TOKEN>` for protected routes.
     - Test CRUD operations for Cars, Dealers, and Auctions.

---