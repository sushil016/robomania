#!/bin/bash

# Clear Supabase Database Script
# Usage: ./clear-db.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  WARNING: This will delete ALL data from your database!${NC}"
echo -e "${YELLOW}Press Ctrl+C to cancel, or Enter to continue...${NC}"
read

# You need to set these environment variables or edit them here
# Get these from your Supabase project settings
SUPABASE_DB_URL="${SUPABASE_DB_URL:-your_supabase_connection_string}"

if [ "$SUPABASE_DB_URL" = "your_supabase_connection_string" ]; then
  echo -e "${RED}❌ Error: SUPABASE_DB_URL not set${NC}"
  echo ""
  echo "Set it with:"
  echo "export SUPABASE_DB_URL='postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres'"
  echo ""
  echo "Get your connection string from:"
  echo "Supabase Dashboard → Project Settings → Database → Connection String (Direct Connection)"
  exit 1
fi

echo -e "${GREEN}🧹 Clearing database...${NC}"

psql "$SUPABASE_DB_URL" -f supabase/migrations/CLEAR_DATABASE.sql

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Database cleared successfully!${NC}"
else
  echo -e "${RED}❌ Error clearing database${NC}"
  exit 1
fi
