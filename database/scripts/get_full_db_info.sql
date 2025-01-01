\echo 'DATABASE STRUCTURE DOCUMENTATION'
\echo '\nTABLES, COLUMNS AND CONSTRAINTS:'
\i get_table_info.sql

\echo '\nPOLICIES, TRIGGERS AND INDEXES:'
\i get_security_info.sql

\echo '\nVIEWS AND FUNCTIONS:'
\i get_views_functions.sql 