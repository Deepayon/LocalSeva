# LocalSeva Authentication Flow

## Overview
LocalSeva now has a complete authentication system that properly handles both **new user registration** and **existing user login** with OTP-based authentication and profile completion.

## 🔐 Complete Authentication Flow

### **Step 1: Phone Number Input**
- User enters 10-digit phone number
- System checks if user exists in database
- **New User:** Shows "OTP sent for registration"
- **Existing User:** Shows "OTP sent for login"
- 6-digit OTP generated and sent (in development, OTP is shown on screen)

### **Step 2: OTP Verification**
- User enters 6-digit OTP
- System validates OTP and checks if user has completed profile
- **Existing User (with name):** Direct login → Redirects to home
- **New User (no name):** Goes to profile completion step

### **Step 3: Profile Completion (New Users Only)**
- User enters full name (required)
- User enters email (optional)
- User selects/enters neighborhood
- Profile is completed and user is logged in
- Redirects to home page

## 📱 User Experience

### **For New Users:**
1. **Phone Input** → "OTP sent for registration"
2. **OTP Input** → "New user! Please complete your profile after OTP verification"
3. **Profile Completion** → "Complete Your Profile" form
4. **Success** → Redirected to home page

### **For Existing Users:**
1. **Phone Input** → "OTP sent for login"
2. **OTP Input** → "Welcome back! Logging you in..."
3. **Success** → Redirected directly to home page (no profile step)

## 🛠️ Technical Implementation

### **API Endpoints:**

#### 1. Send OTP (`/api/auth/send-otp`)
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent for login", // or "OTP sent for registration"
  "userId": "user-id",
  "isNewUser": false, // true for new users
  "otp": "123456" // only in development
}
```

#### 2. Verify OTP (`/api/auth/verify-otp`)
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": "user-id",
    "phone": "+919876543210",
    "name": "John Doe", // null for new users
    "email": "john@example.com", // null for new users
    "verified": true,
    "trustScore": 85,
    "role": "user",
    "isNewUser": false // true for new users
  },
  "sessionToken": "session-token"
}
```

#### 3. Complete Profile (`/api/auth/complete-profile`)
```http
POST /api/auth/complete-profile
Content-Type: application/json

{
  "userId": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "neighborhood": "Sector 2, Salt Lake"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile completed successfully",
  "user": {
    "id": "user-id",
    "phone": "+919876543210",
    "name": "John Doe",
    "email": "john@example.com",
    "verified": true,
    "trustScore": 85,
    "role": "user",
    "neighborhood": {
      "id": "neighborhood-id",
      "name": "Sector 2, Salt Lake",
      "city": "Kolkata",
      "state": "West Bengal"
    }
  }
}
```

### **Frontend Flow:**

#### State Management:
```typescript
const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
const [isExistingUser, setIsExistingUser] = useState(false);
```

#### Flow Logic:
1. **Send OTP** → Set `isExistingUser` based on API response
2. **Verify OTP** → Check `isNewUser` flag in response
   - If `isNewUser: false` → Redirect to home
   - If `isNewUser: true` → Go to profile step
3. **Complete Profile** → Update user and redirect to home

### **Database Schema:**

#### User Model:
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE,
  name TEXT,
  email TEXT UNIQUE,
  avatar TEXT,
  verified BOOLEAN DEFAULT false,
  trustScore INTEGER DEFAULT 0,
  role TEXT DEFAULT 'user',
  neighborhoodId TEXT,
  otpCode TEXT,
  otpExpires DATETIME,
  isActive BOOLEAN DEFAULT true,
  lastLoginAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### **Test Existing User Login:**
1. Phone: `9876543210` (Demo User)
2. OTP: Generated dynamically (shown in dev mode)
3. Flow: Phone → OTP → Home (no profile step)

### **Test New User Registration:**
1. Phone: Any new 10-digit number (e.g., `9876543215`)
2. OTP: Generated dynamically (shown in dev mode)
3. Flow: Phone → OTP → Profile → Home

### **API Test Commands:**

#### Send OTP for Existing User:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'
```

#### Send OTP for New User:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543215"}'
```

#### Verify OTP:
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"123456"}'
```

## 🔒 Security Features

### **OTP Security:**
- 6-digit random OTP generation
- 10-minute OTP expiration
- OTP cleared after successful verification
- Rate limiting (implemented at API level)

### **Session Management:**
- 30-day session expiration
- Secure session token generation
- Session validation on each request
- Automatic logout on session expiration

### **User Verification:**
- Phone number verification via OTP
- Email validation (optional)
- Profile completion requirement for new users

## 📱 UI/UX Improvements

### **Visual Feedback:**
- Clear messaging for login vs registration
- Progress indication through multi-step flow
- Loading states for all async operations
- Error messages with actionable feedback

### **Form Validation:**
- Phone number format validation
- OTP length validation
- Email format validation (if provided)
- Required field validation

### **Responsive Design:**
- Mobile-first design approach
- Touch-friendly input fields
- Proper spacing and typography
- Accessible form labels

## 🚀 Deployment Notes

### **Environment Variables:**
```env
# Database
DATABASE_URL="file:./dev.db"

# Development/Production
NODE_ENV="development" # or "production"
```

### **Production Considerations:**
1. **SMS Service:** Replace demo OTP with real SMS service
2. **Rate Limiting:** Implement API rate limiting
3. **Session Security:** Use secure cookies for session tokens
4. **HTTPS:** Enable HTTPS for production
5. **Monitoring:** Add authentication failure monitoring

## 🔄 Session Management

### **Login Flow:**
1. User provides phone → OTP sent
2. User verifies OTP → Session created
3. Session stored in localStorage + cookie
4. User redirected based on profile status

### **Logout Flow:**
1. User clicks logout → Session invalidated
2. Local storage cleared
3. User redirected to auth page

### **Session Validation:**
- Automatic validation on page load
- Session timeout handling
- Invalid session cleanup

## 🎯 Key Features

### **Smart User Detection:**
- Automatically detects existing vs new users
- Tailors flow based on user status
- Seamless experience for both scenarios

### **Progressive Profiling:**
- Minimal info required for signup (phone + OTP)
- Additional info collected progressively
- No friction for returning users

### **Neighborhood Integration:**
- Neighborhood selection during profile completion
- Automatic neighborhood creation for new areas
- Geographic integration for local services

This complete authentication system ensures that both new user registration and existing user login work seamlessly, with proper OTP verification, profile completion, and session management.