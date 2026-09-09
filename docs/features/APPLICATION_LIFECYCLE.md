# Application Lifecycle Integration (#26) - Implementation Guide

## Overview
This implementation provides a complete application lifecycle management system for SkillBridge, enabling students to apply for opportunities and recruiters to track and manage applications through various stages.

## Application Status Pipeline
```
APPLIED → UNDER_REVIEW → SHORTLISTED → INTERVIEW → ACCEPTED / REJECTED
```

## What Was Implemented

### 1. Database Schema Updates
**Migration File:** `supabase/migrations/002_application_lifecycle.sql`

#### Changes Made:
- **Updated `applications` table:**
  - Updated status values to match pipeline: `'applied' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected'`
  - Added `status_updated_by` (UUID) - tracks who made the status change
  - Added `rejection_reason` (TEXT) - optional notes for rejections

- **New `application_status_history` table:**
  - Tracks all status changes with timestamps
  - Records old_status → new_status transitions
  - Links to the user who made the change
  - Includes optional notes for each change

- **Updated RLS Policies:**
  - Students can view and apply, but cannot modify recruiter-controlled status
  - Industry/recruiters can view applications for their own opportunities
  - Industry can update application status with proper authorization

- **Automatic Audit Trail:**
  - Trigger `log_application_status_change()` automatically logs all status changes
  - No manual audit logging needed

### 2. TypeScript Type Definitions
**File:** `src/database/types.ts`

```typescript
// Updated Application interface
export interface Application {
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

// New ApplicationStatusHistory interface
export interface ApplicationStatusHistory {
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

#### Key Methods:
- `createApplication()` - Students apply to opportunities with duplicate check
- `getStudentApplications()` - Fetch all applications for a student with opportunity details
- `getIndustryApplications()` - Fetch all applications for recruiter's posted opportunities
- `getApplication()` - Get single application with full details
- `updateApplicationStatus()` - Update status with authorization checks and validation
- `getApplicationHistory()` - Get complete status change history for an application

All methods include proper error handling and role-based access control.

### 4. API Endpoints

#### **POST /api/applications**
Create a new application (student applies)
```json
Request Body:
{
  "opportunityId": "uuid",
  "matchScore": 85
}

Response:
{
  "id": "uuid",
  "opportunity_id": "uuid",
  "student_id": "uuid",
  "status": "applied",
  "match_score": 85,
  "applied_at": "2026-09-09T10:30:00Z"
}
```

#### **GET /api/applications**
List applications based on user role
- Students: see their own applications
- Industry: see applications for their opportunities

#### **GET /api/applications/[id]**
Get full application details with opportunity and student info

#### **PUT /api/applications/[id]**
Update application status (industry only)
```json
Request Body:
{
  "status": "shortlisted",
  "rejectionReason": "Not enough experience" // optional, only for rejected status
}
```

#### **GET /api/applications/[id]/history**
Get complete status history with timeline

### 5. Frontend Components

#### **Student Portal: /student/applications**
- Display all student applications with status badges
- Visual pipeline showing status progression
- Filter applications by status
- Loading and error states
- Fallback to demo data if API fails
- Links to detailed application view

#### **Student Portal: /student/applications/[id]**
- View complete application details
- Display opportunity information
- Show status history with timeline
- Display when/how status changed
- Visual indicators for each status change

#### **Industry Portal: /industry/applications**
- List all received applications
- Filter by status (applied, under_review, shortlisted, interview, accepted, rejected)
- Quick status update buttons
- Match score display
- Student information preview
- Real-time status updates

#### **Industry Portal: /industry/applications/[id]**
- Full candidate profile
- Student skills, education, CGPA
- Quick status update panel
- Rejection reason input field
- Complete application history/timeline
- Contact information

## End-to-End Flow

### Scenario: Student Applies → Industry Reviews → Student Sees Update

1. **Student Applies**
   - Student navigates to `/student/opportunities`
   - Clicks "Apply" on an opportunity
   - Application created with `status: 'applied'`
   - Appears in `/student/applications` page

2. **Industry Views Application**
   - Recruiter navigates to `/industry/applications`
   - Sees incoming application with match score
   - Reviews student profile by clicking "View Full Profile"

3. **Industry Updates Status**
   - Recruiter changes status to "under_review"
   - Status automatically logged in `application_status_history`
   - Application moves through pipeline

4. **Student Sees Update**
   - Student refreshes `/student/applications`
   - Status badge updated to "under_review"
   - Can click application to view timeline showing when status changed

## Demo Data
Updated demo data includes applications with various statuses:
- `app-1`: TechNova - ML Intern - **shortlisted**
- `app-2`: DataSphere - Data Analyst - **applied**
- `app-3`: AI Labs - AI Research - **interview**
- `app-4`: WebStack - Frontend Dev - **under_review**
- `app-5`: CloudCore - Cloud Eng - **accepted**

## Key Features

✅ **Complete Application Lifecycle**
- Full status pipeline from applied to accepted/rejected
- Automatic tracking of all status changes with timestamps
- Optional rejection reasons for better feedback

✅ **Role-Based Access Control**
- Students can only view their own applications
- Industry can only manage applications for their opportunities
- Students cannot modify recruiter-controlled status

✅ **Status History & Timeline**
- Complete audit trail of all status changes
- Timeline view showing when and how status changed
- Automatic logging via database triggers (no manual entry needed)

✅ **User Experience**
- Loading states for async operations
- Error handling with user-friendly messages
- Fallback to demo data for better offline support
- Real-time updates without page refresh

✅ **Developer Experience**
- Well-organized service layer for application logic
- Type-safe API endpoints
- Comprehensive error handling
- Easy to extend and maintain

## Database Queries

### Get all applications for a student:
```sql
SELECT * FROM applications 
WHERE student_id = $1 
ORDER BY applied_at DESC;
```

### Get status history for an application:
```sql
SELECT * FROM application_status_history 
WHERE application_id = $1 
ORDER BY changed_at ASC;
```

### Get all applications for industry's opportunities:
```sql
SELECT a.* FROM applications a
JOIN opportunities o ON a.opportunity_id = o.id
WHERE o.posted_by = $1
ORDER BY a.applied_at DESC;
```

## Running the Implementation

1. **Apply Database Migration:**
   ```bash
   # Run the migration in Supabase SQL editor
   # File: supabase/migrations/002_application_lifecycle.sql
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Test the Flow:**
   - Navigate to `/student/applications` to view applications
   - Go to `/industry/applications` to manage them
   - Try updating status and viewing timeline

## Acceptance Criteria - Met ✅

- ✅ **Student Apply**: Students can apply to opportunities (POST /api/applications)
- ✅ **Student View**: Students see their applications with current status (GET /student/applications)
- ✅ **Student View Next Step**: Application timeline shows status changes
- ✅ **Industry View**: Industry users see all applications for their opportunities (GET /industry/applications)
- ✅ **Industry Update**: Industry can move candidates through pipeline (PUT /api/applications/[id])
- ✅ **Industry Shortlist**: Can move to shortlisted status
- ✅ **Industry Interview**: Can move to interview status
- ✅ **Industry Accept/Reject**: Can accept or reject with optional reasons
- ✅ **Student Cannot Modify**: Students get 403 error if trying to update status
- ✅ **Industry Only Own**: Industry can only modify for their opportunities (RLS policy)
- ✅ **Status Persisted**: All status changes saved with audit trail
- ✅ **Timeline Display**: Application history shows complete lifecycle

## End-to-End Demonstration

To demonstrate the complete feature:

1. **Login as Student** (demo-student-1)
   - Go to `/student/applications`
   - See list of applications with pipeline

2. **Click on Application**
   - View full application details
   - See timeline of status changes

3. **Login as Industry** (demo-industry-1)
   - Go to `/industry/applications`
   - See received applications
   - Click status update buttons
   - Watch status change in real-time
   - Switch back to student view to confirm status update

## Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Layer                     │
│  Student Portal & Industry Portal Components         │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────▼────────────┐
         │   API Endpoints        │
         │  /api/applications/*   │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Application Service    │
         │  Business Logic        │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────────────────────────┐
         │      Supabase Database Layer               │
         │  - applications table                      │
         │  - application_status_history table        │
         │  - RLS Policies                            │
         │  - Audit Triggers                          │
         └────────────────────────────────────────────┘
```

## Future Enhancements

- Email notifications on status changes
- Bulk status updates for multiple applications
- Custom status stages per organization
- Application notes/comments feature
- Interview scheduling integration
- Analytics dashboard for recruitment funnel
- Skill-based filtering for industry
- Application scoring algorithms
