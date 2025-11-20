# Backend API Contract for Subscription Feature

## Overview
These are the API endpoints required on the backend to support the enhanced subscription management system with full and partial payments.

## Current Active Subscription Endpoint

### GET /internal/subscriptions/current
Fetch the currently active subscription for the authenticated user.

**Authorization:** Required (Bearer token)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "plan_id": "plan_1",
    "plan_name": "Professional",
    "subscription_status": "active",
    "payment_status": "paid",
    "start_date": "2024-11-20T00:00:00Z",
    "end_date": "2025-11-20T00:00:00Z",
    "amount_paid": 999900,
    "amount_due": 0,
    "full_amount": 999900,
    "cycle": "yearly",
    "max_users": 50,
    "razorpay_subscription_id": "sub_razorpay_123",
    "last_payment_date": "2024-11-20T00:00:00Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": true,
  "data": null,
  "message": "No active subscription found"
}
```

---

## Partial Payment Order Creation Endpoint

### POST /internal/subscriptions/plans/:planId/create-partial-order
Create a Razorpay order for partial payment of a subscription plan.

**Authorization:** Required (Bearer token)

**URL Parameters:**
- `planId` (string): ID of the subscription plan

**Request Body:**
```json
{
  "amount": 500000,
  "cycle": "yearly"
}
```

**Validation Rules:**
- `amount` must be less than full plan price
- `amount` must be greater than or equal to 10% of plan price or ₹1000, whichever is lower
- `cycle` must be "yearly" or "monthly"
- User must not have an active subscription for another plan (unless within 7 days of expiry)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "order_id": "order_razorpay_456",
    "amount": 500000,
    "currency": "INR",
    "plan": {
      "id": "plan_1",
      "name": "Professional",
      "description": "Professional Plan",
      "price_yearly": 999900,
      "features": ["Feature 1", "Feature 2"],
      "max_users": 50
    },
    "cycle": "yearly",
    "razorpay_key": "rzp_live_xxxxx",
    "plan_id": "plan_1"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Amount cannot be less than ₹1000 or greater than plan price"
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Active subscription already exists. Cannot purchase another plan."
}
```

---

## Partial Payment Verification Endpoint

### POST /internal/subscriptions/plans/:planId/verify-partial-payment
Verify Razorpay payment for partial subscription and record the transaction.

**Authorization:** Required (Bearer token)

**URL Parameters:**
- `planId` (string): ID of the subscription plan

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_razorpay_789",
  "razorpay_order_id": "order_razorpay_456",
  "razorpay_signature": "signature_hash_123",
  "cycle": "yearly",
  "amountPaid": 500000
}
```

**Processing Steps:**
1. Verify Razorpay signature using the secret
2. Fetch plan details to get full plan amount
3. Calculate remaining amount: `fullAmount - amountPaid`
4. Check if subscription already exists for this plan by user
5. If new: Create subscription record with status "partial"
6. If exists: Update subscription with additional payment
7. Record payment details in payment history

**Database Changes:**
- If no subscription exists for this user on this plan:
  - Create new subscription with `subscription_status = 'partial'`
  - Set `amount_paid = amountPaid`
  - Set `amount_due = fullAmount - amountPaid`
  - Set `payment_status = 'paid'` (payment received, not subscription activated)
  
- If subscription exists:
  - Update `amount_paid += amountPaid`
  - Update `amount_due -= amountPaid`
  - Keep `subscription_status = 'partial'` until fully paid

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription_id": "sub_123",
    "plan_id": "plan_1",
    "plan_name": "Professional",
    "amount_paid": 500000,
    "amount_due": 499900,
    "full_amount": 999900,
    "subscription_status": "partial",
    "payment_status": "paid",
    "razorpay_payment_id": "pay_razorpay_789",
    "razorpay_order_id": "order_razorpay_456",
    "message": "Partial payment recorded. Remaining amount due: ₹4999"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid Razorpay signature"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Plan not found"
}
```

---

## Full Payment Order Creation Endpoint

### POST /internal/subscriptions/plans/:planId/create-order
(Already exists - Include validation for partial payments)

**Additional Validation Required:**
- If user has a "partial" subscription for this plan, allow payment
- If user has "active" subscription for another plan and > 7 days remain, reject
- If user has "active" subscription for another plan and ≤ 7 days remain, allow (renewal)

---

## Full Payment Verification Endpoint

### POST /internal/subscriptions/plans/:planId/verify-payment
(Already exists - Update to handle partial payment scenarios)

**Additional Logic Required:**

```javascript
// Check if subscription has remaining balance
const existingSubscription = await getSubscription(userId, planId);

if (existingSubscription?.status === 'partial') {
  // This is completing a partial payment
  amountPaid = existingSubscription.amountPaid + currentPayment;
  amountDue = existingSubscription.fullAmount - amountPaid;
  
  if (amountDue === 0) {
    // Fully paid - activate subscription
    subscription.subscription_status = 'active';
    subscription.payment_status = 'paid';
    subscription.start_date = now();
    subscription.end_date = calculateEndDate(subscription.cycle);
  } else {
    // Still partial
    subscription.subscription_status = 'partial';
    subscription.amount_paid = amountPaid;
    subscription.amount_due = amountDue;
  }
} else {
  // New full payment - activate immediately
  subscription.subscription_status = 'active';
  subscription.payment_status = 'paid';
  subscription.start_date = now();
  subscription.end_date = calculateEndDate(subscription.cycle);
}
```

**Response (200 OK) - Partial Payment Still Remaining:**
```json
{
  "success": true,
  "data": {
    "subscription_id": "sub_123",
    "subscription_status": "partial",
    "amount_paid": 999900,
    "amount_due": 0,
    "message": "Payment verified. Subscription is now active."
  }
}
```

---

## Data Model Updates

### Subscriptions Table Schema

```sql
ALTER TABLE subscriptions ADD COLUMN (
  amount_paid INTEGER DEFAULT 0,         -- Amount paid in paise
  amount_due INTEGER DEFAULT 0,          -- Amount due in paise
  full_amount INTEGER NOT NULL,          -- Total plan amount in paise
  subscription_status ENUM('partial', 'active', 'expired', 'cancelled') DEFAULT 'active',
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  last_payment_date TIMESTAMP NULL,      -- When last payment was made
  cycles_completed INTEGER DEFAULT 0     -- Number of full cycles completed
);
```

### Payments/Transactions Table (New or Enhanced)

```sql
CREATE TABLE subscription_payments (
  id VARCHAR(255) PRIMARY KEY,
  subscription_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  plan_id VARCHAR(255) NOT NULL,
  amount_paid INTEGER NOT NULL,          -- In paise
  payment_type ENUM('full', 'partial') DEFAULT 'full',
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_order_id VARCHAR(255),
  payment_status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
  INDEX idx_subscription (subscription_id),
  INDEX idx_user (user_id),
  INDEX idx_payment_date (payment_date)
);
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**422 Unprocessable Entity:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "amount": ["Amount must be between ₹1000 and ₹9999"]
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "An error occurred while processing your request"
}
```

---

## Implementation Notes

### Amount Handling
- All amounts are in **paise** (₹1 = 100 paise)
- Frontend sends amount in paise
- Backend stores in paise
- Convert to rupees only for display

### Signature Verification
```javascript
// Use crypto to verify Razorpay signature
const crypto = require('crypto');

function verifyPaymentSignature(orderId, paymentId, signature) {
  const message = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(message)
    .digest('hex');
  
  return signature === expectedSignature;
}
```

### State Transitions
```
No Subscription
    ↓
[Full Payment] → Active (immediately)
    ↓
[Partial Payment] → Partial (awaiting remaining payment)
    ↓
[Additional Partial] → Partial (still awaiting)
    ↓
[Final Payment] → Active (fully paid)
    ↓
[Expiry] → Expired
    ↓
[Renewal] → Active (new cycle)
```

### Idempotency
- If same payment signature is received twice, return existing subscription
- Use `razorpay_payment_id` as unique constraint
- Check existence before creating new subscription record

### Rate Limiting
- Consider rate limiting payment verification endpoints
- Suggest: 100 requests per hour per user per endpoint

---

## Testing Checklist

- [ ] Create order for full payment
- [ ] Create order for partial payment (various amounts)
- [ ] Verify full payment immediately activates subscription
- [ ] Verify partial payment creates subscription with remaining balance
- [ ] Verify subsequent payments update remaining balance
- [ ] Verify final partial payment activates subscription
- [ ] Verify 7-day renewal logic blocks plan switching
- [ ] Verify signature verification catches tampering
- [ ] Verify current subscription endpoint returns null when none exists
- [ ] Verify amounts are calculated correctly in paise
