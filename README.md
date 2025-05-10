# Comprehensive Fullstack App Project.

Finance App Tracker.

This repository hosts a fullstack application with a **Vite React.js frontend** and a **PHP/MySQL backend** running on **XAMPP**. The app enables users to register, log in securely (including Google Authentication 2.0), and manage their financial expenditures linked to their registered bank accounts.

---

## Features

### Functional Requirements

* **User Registration**: Allows new users to sign up with basic details.
* **User Login**: Secure login with encrypted password storage.
* **Google Authentication 2.0**: Users can log in securely using their Google accounts.
* **Password Encryption**: Ensures user passwords are hashed for enhanced security.
* **Expenditure Tracking**:

  * Add new expenditures.
  * Edit and update expenditure details.
  * Delete expenditures.
  * View a detailed list of expenditures.
* **Bank Account Integration**: Expenditures are linked to a user's registered bank account.

### Non-Functional Requirements

* **Scalability**: Supports multiple users and concurrent operations efficiently.
* **Security**:

  * Implements password hashing and input validation to protect user data.
  * Integrates Google Authentication 2.0 for additional login security.
  * Uses **JSON Web Tokens (JWT)** to manage user sessions securely.
  * Implements **Cross-Site Scripting (XSS)** protection mechanisms.
  * Ensures **Data Protection** through secure API design and proper data handling.
* **Performance**: Optimized API responses and frontend rendering for smooth user experience.
* **Maintainability**: Clean codebase with modular structure for easier updates.
* **Usability**: User-friendly interface with responsive design.

---

## Technologies Used

* **Frontend**: Vite with React.js
* **Backend**: PHP running on XAMPP
* **Database**: MySQL
* **Authentication**: Google OAuth 2.0, JWT

---

## Prerequisites

Ensure you have the following installed:

1. **Node.js** (for frontend development)
2. **npm** or **yarn**
3. **XAMPP** (for PHP and MySQL backend)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Myfinanceapp
```

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

Ensure you have XAMPP installed and running. Place the backend files in the `htdocs` directory of your XAMPP installation.

---

## Project Structure

```
fullstack-app/
├── frontend/       # React.js frontend
├── backend/        # PHP backend with MySQL integration
├── README.md       # Documentation
```

### Frontend (Vite React.js)

Located in the `frontend/` folder. This directory includes the React.js app.

### Backend (PHP/MySQL)

Located in the `backend/` folder. This directory contains PHP scripts for handling API requests and managing the MySQL database.

---

## Running the Application

### 1. Start the Backend

1. Import the `database.sql` file into your MySQL server using phpMyAdmin.
2. Configure your database connection in the `backend/config.php` file:

   ```php
   <?php
   $db_host = 'localhost';
   $db_user = 'root';
   $db_password = '';  // Add your MySQL password
   $db_name = 'Myfinanceapp';
   ?>
   ```
3. Start XAMPP and ensure Apache and MySQL services are running.

### 2. Start the Frontend

Navigate to the `frontend/` folder and run:

```bash
npm run dev
```

* **Frontend URL**: `http://localhost:5173`
* **Backend URL**: `http://localhost/backend-folder-name` (adjust `backend-folder-name` to match your folder in `htdocs`)

---

## Functionality Details

### User Registration & Login

* Passwords are hashed using a secure encryption algorithm (e.g., bcrypt or Argon2).
* Users can register with their email, name, and password or log in with Google Authentication 2.0.
* Upon successful login, users receive a **JWT token** that is used to authenticate subsequent requests.
* JWT tokens are checked on each protected route to ensure session validity.

### Expenditure Management (CRUD)

* **Create**: Add a new expenditure by specifying amount, date, and description.
* **Read**: View a list of all expenditures tied to a user.
* **Update**: Edit existing expenditures.
* **Delete**: Remove unwanted expenditures.

### Security Measures

* **Google Authentication 2.0**: Provides a secure and familiar login option using Google accounts.
* **Password Hashing**: Ensures sensitive user data (like passwords) are securely stored.
* **JWT Session Checks**: Safely manage user sessions with token-based authentication.
* **Cross-Site Scripting (XSS) Protection**: Input sanitization and output escaping prevent malicious script injections.
* **Data Protection**: Secure handling of personal and financial data, use of HTTPS (recommended in production), and proper API design to minimize risk.
* **Input Validation**: All user inputs are validated to prevent SQL injection and other attacks.

---

## Database Schema

### Users Table

| Column   | Type                  | Description        |
| -------- | --------------------- | ------------------ |
| id       | INT (AUTO\_INCREMENT) | Unique user ID     |
| name     | VARCHAR(255)          | User's name        |
| email    | VARCHAR(255)          | User's email       |
| password | VARCHAR(255)          | Encrypted password |

### Expenditures Table

| Column      | Type                  | Description                |
| ----------- | --------------------- | -------------------------- |
| id          | INT (AUTO\_INCREMENT) | Unique expenditure ID      |
| user\_id    | INT                   | Foreign key to Users table |
| amount      | DECIMAL(10,2)         | Expenditure amount         |
| description | TEXT                  | Details of the expenditure |
| date        | DATE                  | Date of expenditure        |

---

## Troubleshooting

### Common Issues

* **Frontend-Backend Connection**: Ensure both are running on the correct ports and check CORS settings.
* **Database Connection Errors**: Verify `config.php` settings and database availability.
* **Google OAuth Issues**: Ensure Google API credentials are set up correctly and the callback URLs match.
* **JWT Token Errors**: Confirm token generation and verification are correctly implemented.
* **XSS or Input Validation Failures**: Review sanitization functions and middleware.

---

## Contribution

Contributions are welcome! Feel free to fork this repository and submit pull requests for enhancements or bug fixes.

---

## License

This project does not have a specified license. Contact the repository owner for permissions regarding use or distribution.

---

## Acknowledgments

* **React.js** for the frontend framework.
* **PHP/MySQL** for backend development and database management.
* **XAMPP** for simplifying the local server setup.
* **Google OAuth 2.0** for secure authentication.
* **JWT** for session management.
* The open-source community for libraries and tools.
