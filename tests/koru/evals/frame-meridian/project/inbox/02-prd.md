# PRD: Meridian Requests (v0.4, draft)

**Owner:** Priya Shah, Product Owner, Operations Technology
**Status:** Draft for discussion. Some sections TBC.
**Last updated:** 18 November

## 1. Background

UnitDesk was built in 2017 for supply requests only. Since then teams have started using it for equipment, transport and some patient discharge needs, which it wasn't designed for. Leadership wants to replace it with an AI-powered platform. See Dana's brief.

## 2. Problem statement

Requests are slow, get lost and cause stockouts. Nurses spend too much time on admin (Director of Nursing estimates 40 minutes per shift). Leadership has no visibility. The current system is old and hard to use, and staff don't like it.

## 3. Goals

1. Use AI across the request process
2. Reduce stockouts by 50%
3. Reduce nurse admin time
4. Real-time dashboard for leadership
5. Mobile app
6. Replace UnitDesk by Q2
7. Better experience for members at discharge (TBC with Plan team)

## 4. Users

- Nurses
- Managers
- Materials management
- Plan team (TBC)
- Leadership

## 5. Jobs to be done

- As a nurse, I want an AI chatbot so that I can make requests faster.
- As a manager, I want a dashboard so that I can see everything.
- As materials management, I want AI to auto-order so that we don't run out.
- As leadership, I want reports.
- As a member, I want my discharge needs handled. (TBC)

## 6. Requirements

### Must have

- R1. Staff can create a request for supplies, equipment, transport or member needs in under 30 seconds.
- R2. AI suggests the item and quantity based on the unit's history.
- R3. AI automatically places orders with suppliers when stock is predicted to run low. No human approval needed for predicted orders.
- R4. All requests over $500 require manager approval.
- R5. Requests are routed automatically to the right team.
- R6. Real-time inventory levels shown on every request.
- R7. Duplicate requests are blocked.
- R8. Works on mobile and desktop.
- R9. Single sign-on for all staff.
- R10. Leadership dashboard with live status of all requests across all four hospitals.

### Should have

- R11. AI chatbot that answers questions about request status.
- R12. Notifications when a request is updated.
- R13. Member discharge requests visible to the Plan's care navigation team.

### Could have

- R14. Voice requests.
- R15. AI predicts which patients will need equipment at discharge.

## 7. Success metrics

- Stockouts down 50%
- Nurse satisfaction up
- Adoption: everyone using it
- Faster requests

## 8. Scope

Phase 1: Meridian North and Meridian Central. All request types. Plan integration if possible.

Out of scope: TBC.

## 9. Design

Use our existing design system (Meridian UI). Should look modern, like a consumer app.

## 10. Open questions

- Does the Plan team need to be in phase 1? Hannah thinks yes, Dana thinks later.
- Do agency nurses need access?
- Who owns the dashboard?
