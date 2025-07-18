#!/usr/bin/env node

const { initDatabase } = require('./src/utils/database');

async function migrate() {
  try {
    console.log('🔄 Running database migration...');
    await initDatabase();
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
