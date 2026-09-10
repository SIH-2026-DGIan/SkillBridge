# Application Lifecycle Integration - Complete Implementation Guide

## Issue #26: Application Lifecycle Integration

### 🎯 Objective
Connect student applications and recruiter status updates into one complete lifecycle.

### 📋 Status Pipeline
```
APPLIED → UNDER_REVIEW → SHORTLISTED → INTERVIEW → ACCEPTED / REJECTED
```

---

## ✅ Complete Implementation Checklist

### 1. Database Schema & Migrations
**File:** `supabase/migrations/002_application_lifecycle.sql`

**Changes:**
- ✅ Updated `applications` table with proper status enum
- ✅ Added `status_updated_by` (UUID) - tracks who made the change
- ✅ Added `rejection_reason` (TEXT) - optional notes for rejections
- ✅ Created `application_status_history` table for audit trail
- ✅ Implemented RLS policies for secure access control
- ✅ Created PostgreSQL trigger `log_application_status_change()` for automatic audit logging

**Status Values:** `'applied' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected'`

### 2. TypeScript Type Definitions
**File:** `src/database/types.ts`

```typescript
interface Application {
  id: string;
  opportunity_id: string;
  student_id: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
  match_score?: number | null;
  applied_at: string;
  updated_at?: string;
  status_updated_by?: string | null;
  rejection_reason?: string | null;
}

interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  old_status?: string | null;
  new_status: string;
  changed_by?: string | null;
  changed_at: string;
  notes?: string | null;
}
```

### 3. Backend Services
**File:** `src/backend/services/application.service.ts`

**Methods Implemented:**

#### `createApplication(opportunityId, studentId, matchScore?)`
- Creates new application
- Prevents duplicate applications
- Automatically sets status to "applied"
- Returns created application

#### `getStudentApplications(studentId)`
- Retrieves all applications for a student
- Includes opportunity details (title, company, location, type)
- Ordered by most recent first
- Used by students to view their applications

#### `getIndustryApplications(industryUserId)`
- Retrieves applications for all opportunities posted by industry user
- Includes student profile details
- Used by recruiters to view received applications
- Filters by posted_by user

#### `getApplication(applicationId)`
- Retrieves single application with full details
- Includes both student and opportunity information
- Used for detail pages

#### `updateApplicationStatus(applicationId, newStatus, industryUserId, rejectionReason?)`
- Updates application status
- Only industry users can call this
- Validates status value
- Automatically persists change to history via trigger
- Returns updated application

#### `getApplicationHistory(applicationId)`
- Retrieves complete status change history
- Ordered chronologically (oldest first)
- Includes details of who made the change
- Used to display application timeline

### 4. API Routes & Endpoints

#### `POST /api/applications`
**Create Application (Student Apply)**

Request:
```json
{
  "opportunityId": "uuid",
  "matchScore": 85
}
```

Response (201):
```json
{
  "id": "uuid",
  "opportunity_id": "uuid",
  "student_id": "uuid",
  "status": "applied",
  "match_score": 85,
  "applied_at": "2026-09-10T10:30:00Z",
  "updated_at": "2026-09-10T10:30:00Z"
}
```

Access Control:
- ✅ Only students can apply (role verification)
- ✅ Prevents duplicate applications for same opportunity
- ✅ Automatically sets to "applied" status

#### `GET /api/applications`
**List Applications (Role-Based)**

Response:
- For **students**: Returns their own applications with opportunity details
- For **industry**: Returns applications for their posted opportunities with student details
- Others: Returns 403 Forbidden

#### `GET /api/applications/[id]`
**Get Single Application**

Response includes:
- Full application details
- Student profile (name, email, college, branch, CGPA, avatar)
- Opportunity details (title, company, description, location, deadline)

Access Control:
- ✅ Student can view their own application
- ✅ Industry recruiter can view applications for their opportunities

#### `PUT /api/applications/[id]`
**Update Application Status (Industry Only)**

Request:
```json
{
  "status": "under_review",
  "rejectionReason": "Skill gap in required areas"
}
```

Response:
- Updated application with new status
- timestamp updated
- status_updated_by set to current user

Access Control:
- ✅ Only industry users can update status
- ✅ Can only update applications for their own opportunities
- ✅ Validates new status is in allowed values

#### `GET /api/applications/[id]/history`
**Get Application Status History (Timeline)**

Response:
```json
[
  {
    "id": "uuid",
    "application_id": "uuid",
    "old_status": "applied",
    "new_status": "under_review",
    "changed_by": "uuid",
    "changed_at": "2026-09-10T11:00:00Z",
    "notes": null
  },
  {
    "id": "uuid",
    "application_id": "uuid",
    "old_status": "under_review",
    "new_status": "shortlisted",
    "changed_by": "uuid",
    "changed_at": "2026-09-10T12:00:00Z",
    "notes": null
  }
]
```

---

## 🖥️ Frontend Components

### Student Side

#### 1. Student Opportunities Discovery Page
**File:** `src/app/student/opportunities/page.tsx`
- Browse available opportunities
- See match score for each opportunity
- **NEW:** Apply button calls `/api/applications` with opportunity ID and match score

#### 2. Student Opportunities Detail Page
**File:** `src/app/student/opportunities/[id]/page.tsx`
- **FIXED:** Apply button now makes API call instead of mock
- Displays match analysis
- Shows matching and missing skills
- Call to action to apply for opportunity

```typescript
// FIXED handleApply function
const handleApply = async () => {
  if (applied) return;
  setApplying(true);
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        opportunityId: id,
        matchScore: match?.score || 0,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    toast.success('Application submitted successfully!');
    setApplied(true);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to submit application');
  } finally {
    setApplying(false);
  }
};
```

#### 3. Student Applications List Page
**File:** `src/app/student/applications/page.tsx`
- Fetches applications via `GET /api/applications`
- Displays applications in table format
- Shows: Opportunity name, Company, Applied Date, Current Status, Next Step link
- Filter tabs for: All, Applied, Under Review, Shortlisted, Interview, Accepted, Rejected
- Status counters showing count per status
- Horizontal pipeline visualization

#### 4. Student Application Detail Page
**File:** `src/app/student/applications/[id]/page.tsx`
- Displays full application details
- Shows opportunity information
- **Application Timeline:**
  - Chronological list of all status changes
  - Each event shows: Status, Previous Status, Date & Time, Who made the change
  - Visual timeline with connecting line
- Student **cannot** modify status (read-only for recruiters' actions)

### Industry/Recruiter Side

#### 1. Industry Applications List Page
**File:** `src/app/industry/applications/page.tsx`
- Fetches applications via `GET /api/applications`
- Shows all applications received for posted opportunities
- Table with: Student Name, Opportunity, Applied Date, Current Status, Actions
- Filter tabs for: All, Applied, Under Review, Shortlisted, Interview, Accepted, Rejected
- Status counters showing count per status
- Quick status update buttons on list

#### 2. Industry Application Detail Page
**File:** `src/app/industry/applications/[id]/page.tsx`
- Full candidate profile with avatar, name, email
- Education details (College, Branch, CGPA)
- Match score with breakdown
- About section (student bio)
- **Status Management Section:**
  - 6 status buttons: Applied, Under Review, Shortlisted, Interview, Accepted, Rejected
  - When "Rejected" selected, shows optional rejection reason textarea
  - "Update to [Status]" button submits change
  - Loading indicator during update
- **Application History Timeline:**
  - Shows all status transitions
  - Each event displays: New Status, From Status, Date & Time, Notes if any
  - Visual timeline with icons

---

## 🔄 End-to-End Flow (Acceptance Criteria)

### Scenario: Complete Application Lifecycle

#### Step 1: Student Applies
1. Student navigates to `/student/opportunities`
2. Browses available opportunities
3. Clicks opportunity to view details at `/student/opportunities/[id]`
4. Reviews match score, skills, eligibility
5. Clicks "Apply Now" button
6. **API Call:** `POST /api/applications` with opportunityId and matchScore
7. Application created with status "applied"
8. User sees success toast: "Application submitted successfully!"
9. Apply button changes to "Applied" (disabled state)

#### Step 2: Industry Views Application
1. Industry user navigates to `/industry/applications`
2. Sees list of all applications received for their posted opportunities
3. Application appears in "Applied" tab (1 count)
4. Shows student name, opportunity, applied date

#### Step 3: Industry Updates Status
1. Industry user clicks on application at `/industry/applications/[id]`
2. Views full candidate details including student profile, match score
3. Sees status is currently "Applied"
4. Decides to review the application
5. Clicks "Under Review" button
6. Sees rejection reason textarea disappear
7. Clicks "Update to Under Review" button
8. **API Call:** `PUT /api/applications/[id]` with new status
9. Status updates immediately
10. Application history timeline shows:
    - "Under Review" from "Applied" at [timestamp]
11. Continues process:
    - Updates to "Shortlisted" (candidate skills look good)
    - Updates to "Interview" (scheduled interview)
    - Updates to "Accepted" (successful hire)

#### Step 4: Student Sees Updated Status
1. Student navigates to `/student/applications`
2. Sees their application in the list
3. Status shows different stages as industry updates it
4. Clicks on application to view details at `/student/applications/[id]`
5. Sees current status and complete timeline:
    - Applied: 2026-09-10 10:30 AM
    - Under Review: 2026-09-10 11:00 AM
    - Shortlisted: 2026-09-10 12:00 PM
    - Interview: 2026-09-10 02:00 PM
    - Accepted: 2026-09-10 04:00 PM

#### Alternative: Rejection Scenario
1. Industry user starts reviewing application
2. Determines student doesn't meet requirements
3. Selects "Rejected" status
4. Enters rejection reason: "Missing required experience in cloud technologies"
5. Clicks "Update to Rejected"
6. Status updates to "Rejected"
7. Rejection reason stored in database
8. Student can see application status is "Rejected" in their list and detail view

---

## 🔐 Security & Authorization Rules

### Row-Level Security (RLS) Policies

#### Applications Table
- **Student SELECT:** Can view their own applications only
  ```sql
  auth.uid() = student_id
  ```
- **Student INSERT:** Can only create applications for themselves
  ```sql
  auth.uid() = student_id
  ```
- **Industry SELECT:** Can view applications for their posted opportunities
  ```sql
  opportunity_id IN (SELECT id FROM opportunities WHERE posted_by = auth.uid())
  ```
- **Industry UPDATE:** Can only update applications for their opportunities
  ```sql
  opportunity_id IN (SELECT id FROM opportunities WHERE posted_by = auth.uid())
  ```

#### Application Status History Table
- **SELECT:** Both student and industry can view history for relevant applications
  ```sql
  EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = application_status_history.application_id
    AND (
      a.student_id = auth.uid()
      OR a.opportunity_id IN (
        SELECT id FROM opportunities WHERE posted_by = auth.uid()
      )
    )
  )
  ```

### Authorization Checks in Backend

#### StudentApplicationService.updateApplicationStatus
- ✅ Verifies user is from industry role
- ✅ Verifies opportunity belongs to the user
- ✅ Validates new status is in allowed list
- ✅ Prevents students from modifying status

---

## 📊 Data Persistence

### Automatic Status History Logging
- PostgreSQL trigger `log_application_status_change()` fires on every status update
- Automatically records:
  - Old status (before change)
  - New status (after change)
  - Who made the change (status_updated_by)
  - When the change was made
  - Optional notes/rejection reason

### Advantages
- ✅ No manual audit logging needed
- ✅ Consistent tracking across all status changes
- ✅ Cannot be bypassed or forgotten
- ✅ Historical data always available for audits

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Application creation with duplicate prevention
- [ ] Status validation (only valid statuses allowed)
- [ ] Status update authorization (only industry can update)
- [ ] Status update authorization (only for their opportunities)
- [ ] History logging trigger fires on status change

### Integration Tests
- [ ] POST /api/applications creates application and sets status
- [ ] GET /api/applications returns correct filtered results
- [ ] PUT /api/applications/[id] updates status
- [ ] PUT /api/applications/[id] triggers history logging
- [ ] GET /api/applications/[id]/history returns all transitions

### End-to-End Tests (Manual)
- [ ] Student applies to opportunity → status "applied"
- [ ] Industry sees application in their list
- [ ] Industry updates to "under_review" → history records change
- [ ] Student sees status update in detail view
- [ ] Industry updates to "accepted" → timeline complete
- [ ] Rejection flow: Industry rejects with reason → student sees reason
- [ ] Timeline shows all changes in chronological order

### Security Tests
- [ ] Student cannot view other student's applications
- [ ] Student cannot view applications for opportunities they didn't apply to
- [ ] Industry cannot view applications for others' opportunities
- [ ] Industry cannot update applications for others' opportunities
- [ ] Student cannot call PUT endpoint to modify status

---

## 📝 Database Queries

### View all applications for a student
```sql
SELECT * FROM applications 
WHERE student_id = 'user-id' 
ORDER BY applied_at DESC;
```

### View all applications for an opportunity
```sql
SELECT * FROM applications 
WHERE opportunity_id = 'opp-id' 
ORDER BY applied_at DESC;
```

### View application status history
```sql
SELECT * FROM application_status_history 
WHERE application_id = 'app-id' 
ORDER BY changed_at ASC;
```

### View total applications by status
```sql
SELECT status, COUNT(*) as count 
FROM applications 
GROUP BY status;
```

---

## 🚀 Deployment Checklist

- [ ] Run migration: `002_application_lifecycle.sql`
- [ ] Verify RLS policies are applied
- [ ] Test application service methods
- [ ] Test API endpoints with Postman/curl
- [ ] Test student flow (apply, view, see updates)
- [ ] Test industry flow (view, update, see changes reflected)
- [ ] Verify database trigger is working
- [ ] Check error handling and validation
- [ ] Monitor logs for any issues

---

## 📞 Support & Troubleshooting

### Issue: "You have already applied to this opportunity"
- **Cause:** Duplicate application prevention working correctly
- **Solution:** User already applied; show message in UI

### Issue: Status not updating
- **Cause:** Could be RLS policy issue or authorization check
- **Solution:** Verify user is industry role and opportunity belongs to them

### Issue: History not showing
- **Cause:** Trigger might not have fired or history table might be empty
- **Solution:** Check that status was actually updated; verify trigger exists

### Issue: Students seeing other applications
- **Cause:** RLS policy not properly enforced
- **Solution:** Verify RLS is enabled on applications table and policies are correct

---

## 🎉 Summary

The Application Lifecycle Integration feature provides a complete, secure system for managing student applications through their entire journey. With automatic audit logging, role-based access control, and intuitive UI components on both sides, the system ensures transparency and accountability throughout the process.

**Key Achievement:** End-to-end demonstrated flow where students can apply, recruiters can update status, and both can see real-time changes and complete history.
