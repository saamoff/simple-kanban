# Simple Kanban Board 🚀

A task management system with time tracking, built with Vue.js (frontend) and Node.js (backend). Helps teams organize tasks, track time spent, and visualize productivity metrics.

![Login Page](https://imgur.com/9IKKBXA.png)  
*Figure 1: User login page with JWT authentication.*

## Key Features ✨
- **CRUD Operations** for Tasks and Projects.
- **Time Tracking**: Record start/end times for tasks (collision detection for time intervals).
- **Collaborator Management**: Associate tasks with team members.
- **Real-time Stats**: Daily/monthly time summaries (HH:MM format).
- **Responsive UI**: Works on desktop and mobile.
- **JWT Authentication**: Secure user login/registration.
- **API Documentation**: Swagger-integrated endpoints.

## Tech Stack 🛠️
**Frontend**:  
Vue.js 3, Pinia (state management), TailwindCSS, HeadlessUI, HeroIcons, Axios  

**Backend**:  
Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS  

**Tools**:  
Swagger (API docs), Postman (testing)

## Screenshots 📸
| ![Register Page](https://imgur.com/q5HwMqX.png)   | ![Task Board](https://imgur.com/iMJPSFj.png) |
|---------------------------------------------------|----------------------------------------------|
| *Figure 2: User registration form.*               | *Figure 3: Kanban board.*                    |

| ![Task Details](https://imgur.com/sfmgxhw.png)       | ![Statistics](https://imgur.com/TXpSDD0.png)           |
|------------------------------------------------------|--------------------------------------------------------|
| *Figure 4: Task details with time tracking.*         | *Figure 5: Dashboard with daily/monthly time reports.* |

## Installation ⚙️
### Prerequisites
- Node.js >= 18.x
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas/database))
- npm or yarn

### Steps
1. **Clone the repository**:
   ```bash
    git clone https://github.com/saamoff/simple-kanban
    cd simple-kanban
   ```
2. **Backend Setup**:
  ```bash
    cd backend
    npm install
    # Create a .env file in the root directory
    npm run dev
  ```
  **.env Example**:
  ```bash
   PORT=3001
   DATABASE_URL=mongodb://localhost:27017/kanban
   JWT_SECRET=your_secure_secret_here
   JWT_EXPIRES_IN=24h
  ```
3. **Frontend Setup**
  ```bash
    cd frontend
    npm install
    npm run dev
  ```

## API Documentation 📄

Interactive Swagger docs available at /api-docs after starting the backend.
Example endpoints:

- ``POST /api/auth/login`` – User login
- ``GET /api/tasks`` – List all tasks
- ``POST /api/time-trackers`` – Start/stop time tracking

## Business Rules 🔒
✅ Time intervals cannot overlap for the same collaborator
✅ Tasks must belong to a project
✅ Passwords stored encrypted (bcryptJS)
✅ Daily tracked time cannot exceed 24 hours

## License 📜
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Note**: User and collaborator creation is done directly via database (per challenge requirements).
For a live demo or additional queries, please contact samueliatarola@gmail.com.
