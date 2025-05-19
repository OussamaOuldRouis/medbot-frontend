import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';

// Initialize Supabase REST API
const supabaseUrl = 'https://nhacxhyjnrkrhbhrjcmz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oYWN4aHlqbnJrcmhiaHJqY216Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTk5Mzg3MiwiZXhwIjoyMDYxNTY5ODcyfQ.ig_Nkzy35FzHZc0OO603NLSoJ3PUED2etJscjVfLJrI';

async function importInteractions() {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'public', 'db_drug_interactions.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Found ${records.length} interactions to import`);

    // Process in batches of 10 (smaller batch size)
    const batchSize = 10;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      // Transform data to match Supabase schema
      const interactions = batch.map(record => ({
        drug1: record['drug_1']?.trim(),
        drug2: record['drug_2']?.trim(),
        interaction_description: record['interaction_description']?.trim(),
        severity: 'moderate',
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      try {
        // Insert batch into Supabase using fetch
        const response = await fetch(`${supabaseUrl}/rest/v1/drug_interactions`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(interactions)
        });

        if (!response.ok) {
          const error = await response.text();
          console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        } else {
          console.log(`Successfully imported batch ${i / batchSize + 1} (${i + 1}-${Math.min(i + batchSize, records.length)})`);
        }
      } catch (error) {
        console.error(`Error processing batch ${i / batchSize + 1}:`, error.message);
      }

      // Add a delay between batches
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log('Import completed!');
  } catch (error) {
    console.error('Error during import:', error);
  }
}

// Run the import
importInteractions(); 