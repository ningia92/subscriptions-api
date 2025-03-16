## Subscriptions Tracker API

The Subscriptions Tracker API is a RESTful API built with Node.js, Express, and Mongoose, designed to manage and track user subscriptions. It allows users to register, authenticate via JWT, and manage their subscriptions, including upcoming renewals. The app also implements role management (user/admin), ensuring that only users with admin privileges can access certain features. Custom middlewares are used for authorization and error handling, ensuring that only authenticated users can access protected features. Additionaly, to ensure security and reliability, the app integrates numerous middlewares, such as helmet, cors, sanitizations to prevent XSS and NoSQL injection attacks, and rate limiting/slow down mechanisms to protect against DoS and brute force attacks.

#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import mongodb.js
2. Invoke in app.listen() callback
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.routes.js
- users.routes.js
- subscriptions.routes.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Check if the user have admin secret
- Hash Password (with bcryptjs)
- Save User
- Generate Token (JWT)
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw Error('Please provide email and password')
- Find User
- Compare Passwords
- If no user or password does not match, throw Error('Invalid credentials')
- If correct, generate Token (JWT)
- Send Response with Token (JWT)

#### Mongoose Errors

- Cast Error
- Duplicate (Email)
- Validation Error

#### Security

- express-slow-down
- express-rate-limit
- express-mongo-sanitize
- express-xss-sanitizer
- helmet
- cors
