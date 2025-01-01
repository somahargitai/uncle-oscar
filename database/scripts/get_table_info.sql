-- Get detailed information about all tables, columns, and constraints
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.column_default,
    c.is_nullable,
    c.character_maximum_length,
    tc.constraint_type,
    cc.table_name as referenced_table
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
    ON t.table_name = c.table_name
LEFT JOIN information_schema.key_column_usage kcu 
    ON c.table_name = kcu.table_name 
    AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc 
    ON kcu.constraint_name = tc.constraint_name
LEFT JOIN information_schema.constraint_column_usage cc 
    ON tc.constraint_name = cc.constraint_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position; 