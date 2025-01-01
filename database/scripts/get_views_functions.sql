-- Get Views
SELECT 
    viewname,
    definition 
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;

-- Get Functions
SELECT 
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname; 