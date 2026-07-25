set search_path = jingeehas, public;

create index admin_sessions_admin_id_idx on admin_sessions (admin_id);
create index advisor_clients_assessment_id_idx on advisor_clients (assessment_id) where assessment_id is not null;
create index advisor_clients_resolved_session_id_idx on advisor_clients (resolved_session_id) where resolved_session_id is not null;
create index advisor_report_access_assessment_idx on advisor_report_access_logs (assessment_id, created_at desc);
create index advisor_sessions_coach_id_idx on advisor_sessions (coach_id);
create index assessments_coach_client_id_idx on assessments (coach_client_id) where coach_client_id is not null;
create index assessments_safety_check_id_idx on assessments (safety_check_id);
create index data_deletion_requests_session_id_idx on data_deletion_requests (session_id);
create index entitlements_session_id_idx on entitlements (session_id);
create index payments_assessment_id_idx on payments (assessment_id);
create index recovery_contacts_entitlement_id_idx on recovery_contacts (entitlement_id) where entitlement_id is not null;
create index recovery_contacts_payment_id_idx on recovery_contacts (payment_id) where payment_id is not null;
create index recovery_contacts_session_id_idx on recovery_contacts (session_id);
create index report_snapshots_session_id_idx on report_snapshots (session_id);

insert into schema_migrations (version) values ('2026071602_foreign_key_indexes');;
