# Cookie Dog + Cat Inventory System

Dog + Cat Inventory System is an open source project that helps inventory, sales, and employee management.

## Prerequisites

Before you begin, make sure you have the following software and tools installed on your system.

1. [Node](https://nodejs.org/en/blog/release/v18.17.1) version 18 or later.
2. npm 10.9.1 version or later (Normally shipped with Node).
3. Port 3000 available.
4. [git](https://git-scm.com/) version 2.43 or later.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. Clone the repository to your local machine.

2. Navigate to the root folder.
   ```bash
   cd cookie-dog-and-cat-frontend
   ```
3. Inside the folder exists a file called *.env.example*. Rename it to *.env*.

    **Note:** Update the values in the file to match your environment configuration. Failing to set these correctly may cause some features of the application to not work properly.

    Example `.env` file:
    ```bash
    REACT_APP_API_URL=http://localhost:5000/api/
    REACT_APP_EMAIL_JS_SERVICE_ID=your_email_service_id
    REACT_APP_EMAIL_JS_TEMPLATE_ID=your_email_template_id
    REACT_APP_EMAIL_JS_PUBLIC_ID=your_email_js_public_id
    ```

    **Descriptions of the variables:**
    - `REACT_APP_API_URL`: The base URL for the backend API. Change this to the correct API URL for your environment (e.g., production or development).
    - `REACT_APP_EMAIL_JS_SERVICE_ID`: The service ID for EmailJS. Replace with your EmailJS service ID.
    - `REACT_APP_EMAIL_JS_TEMPLATE_ID`: The template ID for EmailJS. Replace with the template ID used for sending emails.
    - `REACT_APP_EMAIL_JS_PUBLIC_ID`: The public API key for EmailJS. Replace with your public EmailJS key.

    For more information on how to get the required EmailJS values, refer to the [EmailJS Documentation](https://www.emailjs.com/docs/).

4. Install project dependencies using npm.
   ```bash
   npm install
   ```

## Running the App

To start the development server use the following command:

```bash
npm start
```

This will start the development server, and you can access the app in your web browser by visiting http://localhost:3000.