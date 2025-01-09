Here is the updated README with the newest functionalities added while retaining the existing structure and information:

---

# Comprehensive Fullstack App Project.

Finance App Tracker.

This repository hosts a fullstack application with a **Vite React.js frontend** and a **PHP/MySQL backend** running on **XAMPP**. The app enables users to register, log in securely, and manage their financial expenditures linked to their registered bank accounts.

---

## Features

### Functional Requirements

- **User Registration**: Allows new users to sign up with basic details.
- **User Login**: Secure login with encrypted password storage.
- **Password Encryption**: Ensures user passwords are hashed for enhanced security.
- **Expenditure Tracking**:
  - Add new expenditures.
  - Edit and update expenditure details.
  - Delete expenditures.
  - View a detailed list of expenditures.
- **Bank Account Integration**: Expenditures are linked to a user's registered bank account.
- **Visibility Toggle**:
  - Allows users to toggle visibility of sensitive financial details (e.g., account balance and expenditure amounts) with a single click.
- **Transaction Management**:
  - Displays categorized transaction history.
  - Supports filtering by categories and transaction types (Deposit/Withdrawal).

### Non-Functional Requirements

- **Scalability**: Supports multiple users and concurrent operations efficiently.
- **Security**: Implements password hashing and input validation to protect user data.
- **Performance**: Optimized API responses and frontend rendering for smooth user experience.
- **Maintainability**: Clean codebase with modular structure for easier updates.
- **Usability**: User-friendly interface with responsive design.

---

## Technologies Used

- **Frontend**: Vite with React.js
- **Backend**: PHP running on XAMPP
- **Database**: MySQL

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

- **Frontend URL**: `http://localhost:5173`
- **Backend URL**: `http://localhost/backend-folder-name` (adjust `backend-folder-name` to match your folder in `htdocs`)

---

## Functionality Details

### User Registration & Login

- Passwords are hashed using a secure encryption algorithm (e.g., bcrypt or Argon2).
- Users can register with their email, name, and password.
- Upon successful login, users receive a session or JWT token for subsequent requests.

### Expenditure Management (CRUD)

- **Create**: Add a new expenditure by specifying amount, date, and description.
- **Read**: View a list of all expenditures tied to a user.
- **Update**: Edit existing expenditures.
- **Delete**: Remove unwanted expenditures.

### Visibility Toggle

- Users can toggle the visibility of sensitive financial data (e.g., account balance, expenditure amounts) by clicking an eye/eye-slash icon.

### Transaction Management

- Categorized transaction history.
- Filter transactions by:
  - **Category** (e.g., Salary, Rent, Bills).
  - **Type** (Deposit/Withdrawal).
- View transaction details in a modal.

### Security Measures

- **Password Hashing**: Ensures sensitive data protection.
- **Input Validation**: Validates all user inputs to prevent SQL injection and XSS attacks.

---

## Troubleshooting

### Common Issues

- **Frontend-Backend Connection**: Ensure both are running on the correct ports and check CORS settings.
- **Database Connection Errors**: Verify `config.php` settings and database availability.
- **Password Encryption Issues**: Confirm that the hashing library is correctly installed and configured.

---

## Contribution

Contributions are welcome! Feel free to fork this repository and submit pull requests for enhancements or bug fixes.

---

## License

This project does not have a specified license. Contact the repository owner for permissions regarding use or distribution.

---

## Acknowledgments

- **React.js** for the frontend framework.
- **PHP/MySQL** for backend development and database management.
- **XAMPP** for simplifying the local server setup.
- The open-source community for libraries and tools.

---

