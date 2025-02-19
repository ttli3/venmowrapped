import { analyzeVenmoStatement } from './app/utils/analysis';
import fs from 'fs/promises';

async function main() {
  console.log('Starting analysis...');
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a CSV file path');
    process.exit(1);
  }
  console.log('Reading file:', filePath);

  try {
    console.log('Loading file contents...');
    const data = await fs.readFile(filePath, 'utf8');
    console.log('File loaded, analyzing...');
    const insights = await analyzeVenmoStatement(data);
    console.log('Analysis complete!');
    
    console.log('\n=== Venmo Wrapped Analysis ===\n');
    
    console.log('💰 Spending Overview:');
    console.log(JSON.stringify(insights.spending_overview, null, 2));
    
    console.log('\n🏷️  Transaction Categories:');
    console.log(JSON.stringify(insights.transaction_categories, null, 2));
    
    console.log('\n👥 People Insights:');
    console.log(JSON.stringify(insights.people_insights, null, 2));
    
    console.log('\n⏰ Time Insights:');
    console.log(JSON.stringify(insights.time_insights, null, 2));
    
    console.log('\n🎯 Fun Insights:');
    console.log(JSON.stringify(insights.fun_insights, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
