# Notes on the analytics export

Export from UnitDesk, the ERP and Meridian's Q3 reporting, pulled by the Operations Technology team. Q3 means July to September.

## Columns

- **metric:** what's measured (see below)
- **site:** North, Central or All (both hospitals)
- **request_type:** supplies, equipment, transport, discharge_member_need, or all
- **period:** Q3, or a note where it was measured differently
- **value** and **unit**

## Metrics

| Metric | What it means | Caveats |
| --- | --- | --- |
| requests_submitted | Requests created in UnitDesk | Phone and email requests aren't included |
| duplicate_rate | Share of requests that matched another request from the same unit for the same item within 2 hours | Matching is on free-text item names, so it may undercount |
| share_requests_over_500 | Share of requests that needed manager approval | |
| median_minutes_submitted_to_approved | Time from submission to approval, or to auto-approval for requests under $500 | |
| median_minutes_approved_to_delivered | Time from approval to marked delivered | Depends on the twice-daily delivery round (10:00 and 16:00) |
| requests_status_never_updated | Share of requests that stayed "Submitted" until closed in bulk at month end | |
| reopened_or_resubmitted | Discharge needs that were raised more than once | |
| discharge_need_missing_member_id | Discharge requests with no plan member ID | |
| discharge_need_raised_after_discharge | Discharge requests created after the patient had already left | |
| stockout_events | A unit recorded zero stock of an item it needed | Only recorded on units that scan, about half |
| stockouts_in_top_12_items | Share of stockouts in the 12 most-stocked-out items | |
| stockouts_nights_or_weekends | Share of stockouts between 19:00 and 07:00, or on weekends | |
| stockout_items_found_in_other_unit_stock | Share of stockout events where another unit on the same site held the item | From a one-off cupboard audit in September |
| expired_stock_written_off | Value of expired supplies written off | |
| phone_calls_to_stores_logged | Calls to the stores line | From the phone system, not linked to requests |
| unitdesk_sessions_mobile_browser | Share of UnitDesk sessions from a phone browser | UnitDesk isn't designed for mobile |
| unitdesk_sessions_shared_login | Share of night sessions at North on the shared unit login | Mostly agency and travel nurses |
| nurse_time_on_requests_median / p90 | Minutes per shift on request admin | Time-and-motion audit of 40 shifts. Didn't include time spent on the phone away from the unit. |
| nurse_satisfaction_unitdesk | Survey score | 212 responses |
