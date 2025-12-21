-- Check the actual structure of the bots table

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'bots'
ORDER BY ordinal_position;
