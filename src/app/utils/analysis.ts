import Papa from 'papaparse';
import { format } from 'date-fns';

// Type definitions
type Amount = number;
type TransactionType = 'Payment' | string;

interface Transaction {
  ID: string;
  Datetime: string;
  Type: TransactionType;
  'Amount (total)': string | number;
  Amount?: Amount;
  Note: string;
  From?: string;
  To?: string;
  Month?: number;
  Hour?: number;
  DayOfWeek?: string;
  Category?: string;
  is_weekend?: boolean;
  note_length?: number;
  has_emoji?: boolean;
}

interface SpendingOverview {
  total_spent: Amount;
  total_received: Amount;
  net_balance: Amount;
  avg_monthly_spend: Amount;
  most_expensive_month: number | null;
  most_expensive_month_amount: Amount;
  avg_payment_size: Amount;
  total_transactions: number;
}

interface TopTransaction {
  amount: Amount;
  note: string;
  to: string;
}

interface CategoryBreakdown {
  [category: string]: {
    count: number;
    total: Amount;
    percentage: number;
    top_transaction?: TopTransaction;
  };
}

interface TransactionCategories {
  category_breakdown: CategoryBreakdown;
  most_frequent_category: {
    name: string;
    count: number;
  };
  highest_spending_category: {
    name: string;
    amount: Amount;
  };
  biggest_splurge: {
    amount: Amount;
    category: string;
    note: string;
    to: string;
  };
}

interface PeopleInsights {
  venmo_soulmate: {
    name: string;
    count: number;
    total_amount: Amount;
  };
  most_generous_friend: {
    name: string;
    amount: Amount;
    count: number;
  };
  most_thankful_friend: {
    name: string;
    amount: Amount;
    count: number;
  };
  biggest_payment_sent: {
    amount: Amount;
    to: string;
    note: string;
  };
  biggest_payment_received: {
    amount: Amount;
    from: string;
    note: string;
  };
}

interface TimeInsights {
  most_active_day: {
    day: string;
    count: number;
    percentage: number;
  };
  most_active_month: {
    month: number;
    count: number;
  };
  most_active_hour: {
    hour: number;
    count: number;
  };
  weekend_vs_weekday: {
    weekend_count: number;
    weekday_count: number;
    weekend_percentage: number;
  };
  late_night: {
    count: number;
    percentage: number;
    total_amount: Amount;
    most_common_category: string;
  };
}

interface FinancialHabits {
  avg_transaction_amount: Amount;
  payment_frequency: string;
  largest_payment_gap: number;
  payment_consistency: number;
}

interface SocialInsights {
  total_unique_people: number;
  most_active_month: string;
  social_score: number;
  payment_network_size: number;
}

interface MoneyPingpong {
  person: string;
  amount: Amount;
  note1: string;
  note2: string;
  time_diff: number;
}

interface DebtCycle {
  person: string;
  stats: {
    you_sent: Amount;
    you_received: Amount;
    out_count: number;
    in_count: number;
    last_sent: Amount;
    last_received: Amount;
    last_sent_note: string;
    last_received_note: string;
  };
}

interface FunInsights {
  most_used_emoji: {
    emoji: string;
    count: number;
  };
  favorite_emoji_combo: {
    first: string;
    second: string;
  };
  creative_notes: {
    note: string;
    amount: Amount;
    with: string;
  }[];
  note_stats: {
    shortest: string;
    longest: string;
    most_repeated: {
      note: string;
      count: number;
    };
    emoji_percentage: number;
  };
  late_night_activity: {
    count: number;
    total_amount: Amount;
  };
  cheapskate_award: {
    smallest_amount: Amount;
  };
}

interface VenmoInsights {
  spending_overview: SpendingOverview;
  transaction_categories: TransactionCategories;
  people_insights: PeopleInsights;
  time_insights: TimeInsights;
  fun_insights: FunInsights;
  financial_habits: FinancialHabits;
  social_insights: SocialInsights;
  money_pingpong: MoneyPingpong[];
  eternal_debt_cycles: DebtCycle[];
}

// Helper functions
export function cleanAmount(amount: string | number | null): number {
  if (amount === null || amount === undefined) {
    return 0.0;
  }
  if (typeof amount === 'string') {
    // Remove $ and commas, then convert to float
    let cleaned = amount.trim().replace('$', '').replace(/,/g, '');
    // Handle + and - signs
    if (cleaned.startsWith('+')) {
      return parseFloat(cleaned.substring(1));
    } else if (cleaned.startsWith('-')) {
      return -parseFloat(cleaned.substring(1));
    }
    return parseFloat(cleaned) || 0;
  }
  return typeof amount === 'number' ? amount : 0.0;
}

export function getDayName(date: Date): string {
  return format(date, 'EEEE');
}

export function isEmoji(char: string): boolean {
  // More precise emoji regex that excludes other unicode characters
  const regex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/u;
  return regex.test(char);
}

export function extractEmojis(text: string | null | undefined): string[] {
  if (!text) {
    return [];
  }
  return Array.from(text).filter(isEmoji);
}

export function safeGetMaxInfo(counts: Map<string | number, number>): [string, number] {
  if (counts.size === 0) {
    return ["none", 0];
  }
  let maxKey = "";
  let maxValue = 0;
  
  counts.forEach((value, key) => {
    if (value > maxValue) {
      maxValue = value;
      maxKey = String(key);
    }
  });
  
  return [maxKey, maxValue];
}

export function safeGetFirstRow(transactions: Transaction[]): Transaction {
  return transactions.length > 0 ? transactions[0] : {} as Transaction;
}

// Main functions
export async function analyzeVenmoStatement(fileContent: string): Promise<VenmoInsights> {
  const requiredColumns = ['ID', 'Datetime', 'Type', 'Amount (total)', 'Note'];
  
  // Skip first two rows and parse
  let parsedData: Transaction[] = [];
  try {
    // Normalize line endings and split
    const normalizedContent = fileContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedContent.split('\n');    
    // Skip header rows and join remaining lines
    const csvContent = lines.slice(2).join('\n');    
    const parseResult = Papa.parse<Transaction>(csvContent, {
      header: true,
      skipEmptyLines: 'greedy',
      transform: (value) => value.trim(),
      transformHeader: (header) => header.trim()
    });
    
    
    if (!parseResult.data || parseResult.data.length === 0) {
      throw new Error('No data found in CSV');
    }
    
    parsedData = parseResult.data;
  } catch (e) {
    throw new Error(`Failed to read CSV file: ${e instanceof Error ? e.message : String(e)}`);
  }
  
  // Drop empty rows and validate
  const df = parsedData.filter(row => row.ID && row.Datetime);
  if (df.length === 0) {
    throw new Error('No valid transactions found in CSV');
  }
  
  // Validate required columns
  const missingCols = requiredColumns.filter(col => !(col in df[0]));
  if (missingCols.length) {
    throw new Error(`Missing required columns: ${missingCols.join(', ')}`);
  }
  
  try {
    // Clean amount column and add derived fields
    df.forEach(row => {
      row.Amount = cleanAmount(row['Amount (total)']);
      
      // Convert datetime and extract components
      const date = new Date(row.Datetime);
      row.Month = date.getMonth() + 1;
      row.Hour = date.getHours();
      row.DayOfWeek = getDayName(date);
    });
    
    // Filter only payment transactions
    const paymentsDF = df.filter(row => row.Type === 'Payment');
    if (paymentsDF.length === 0) {
      throw new Error('No payment transactions found in CSV');
    }
    
    // Initialize all insights with default values
    const spendingOverview = getSpendingOverview(paymentsDF);
    const transactionCategories = getTransactionCategories(paymentsDF);
    const peopleInsights = getPeopleInsights(paymentsDF);
    const timeInsights = getTimeInsights(paymentsDF);
    const funInsights = getFunInsights(paymentsDF);
    const financialHabits = getFinancialHabits(paymentsDF);
    const socialInsights = getSocialInsights(paymentsDF);
    const moneyPingpong = findMoneyPingpong(paymentsDF);
    const eternalDebtCycles = findEternalDebtCycles(paymentsDF);

    // Validate critical insights
    if (!spendingOverview || typeof spendingOverview.total_spent === 'undefined') {
      throw new Error('Failed to calculate spending overview');
    }

    const insights: VenmoInsights = {
      spending_overview: spendingOverview,
      transaction_categories: transactionCategories,
      people_insights: peopleInsights,
      time_insights: timeInsights,
      fun_insights: funInsights,
      financial_habits: financialHabits,
      social_insights: socialInsights,
      money_pingpong: moneyPingpong || [],
      eternal_debt_cycles: eternalDebtCycles || []
    };
    
    return insights;
  } catch (e) {
    console.error('Analysis error:', e);
    throw new Error(`Error processing data: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export function getSpendingOverview(df: Transaction[]): SpendingOverview {
  if (!df || df.length === 0) {
    return {
      total_spent: 0,
      total_received: 0,
      net_balance: 0,
      avg_monthly_spend: 0,
      most_expensive_month: null,
      most_expensive_month_amount: 0,
      avg_payment_size: 0,
      total_transactions: 0
    };
  }

  const outgoing = Math.abs(df.filter(row => cleanAmount(row['Amount (total)']) < 0)
                             .reduce((sum, row) => sum + cleanAmount(row['Amount (total)']), 0));
  
  const incoming = df.filter(row => cleanAmount(row['Amount (total)']) > 0)
                     .reduce((sum, row) => sum + cleanAmount(row['Amount (total)']), 0);
  
  // Group by month and calculate spending per month
  const monthlySpend = new Map<number, number>();
  df.filter(row => cleanAmount(row['Amount (total)']) < 0).forEach(row => {
    const month = row.Month!;
    const currentSpend = monthlySpend.get(month) || 0;
    monthlySpend.set(month, currentSpend + Math.abs(cleanAmount(row['Amount (total)'])));
  });
  
  // Find most expensive month
  let mostExpMonth: number | null = null;
  let mostExpAmount = 0;
  
  monthlySpend.forEach((amount, month) => {
    if (amount > mostExpAmount) {
      mostExpAmount = amount;
      mostExpMonth = month;
    }
  });
  
  // Calculate average payment size (absolute value of all transactions)
  const avgPayment = df.reduce((sum, row) => sum + Math.abs(cleanAmount(row['Amount (total)'])), 0) / df.length;
  
  return {
    total_spent: outgoing || 0,
    total_received: incoming || 0,
    net_balance: (incoming - outgoing) || 0,
    avg_monthly_spend: outgoing > 0 ? outgoing / 12 : 0,
    most_expensive_month: mostExpMonth,
    most_expensive_month_amount: mostExpAmount || 0,
    avg_payment_size: avgPayment || 0,
    total_transactions: df.length
  };
}

export function getTransactionCategories(df: Transaction[]): TransactionCategories {
  // Categorize transactions
  df.forEach(row => {
    row.Category = categorizeTransaction(row);
  });
  
  // Group by category and calculate stats
  const spendingByCategory = new Map<string, {
    count: number;
    total: number;
    topTransaction?: Transaction;
  }>();
  
  df.filter(row => cleanAmount(row['Amount (total)']) < 0).forEach(row => {
    const category = row.Category!;
    const categoryStats = spendingByCategory.get(category) || { count: 0, total: 0 };
    
    categoryStats.count++;
    categoryStats.total += Math.abs(cleanAmount(row['Amount (total)']));
    
    if (!categoryStats.topTransaction || Math.abs(cleanAmount(row['Amount (total)'])) > Math.abs(categoryStats.topTransaction.Amount!)) {
      categoryStats.topTransaction = row;
    }
    
    spendingByCategory.set(category, categoryStats);
  });
  
  // Calculate percentages and create category breakdown
  const totalSpending = Array.from(spendingByCategory.values())
                             .reduce((sum, stats) => sum + stats.total, 0);
  
  const categoryBreakdown: CategoryBreakdown = {};
  spendingByCategory.forEach((stats, category) => {
    categoryBreakdown[category] = {
      count: stats.count,
      total: stats.total,
      percentage: totalSpending > 0 ? (stats.total / totalSpending * 100) : 0,
      top_transaction: stats.topTransaction ? {
        amount: Math.abs(stats.topTransaction.Amount!),
        note: String(stats.topTransaction.Note || ''),
        to: String(stats.topTransaction.To || '')
      } : undefined
    };
  });
  
  // Find most frequent category
  let mostFrequentCategory = "";
  let highestCount = 0;
  spendingByCategory.forEach((stats, category) => {
    if (stats.count > highestCount) {
      highestCount = stats.count;
      mostFrequentCategory = category;
    }
  });
  
  // Find highest spending category
  let highestSpendingCategory = "";
  let highestAmount = 0;
  spendingByCategory.forEach((stats, category) => {
    if (stats.total > highestAmount) {
      highestAmount = stats.total;
      highestSpendingCategory = category;
    }
  });
  
  // Find biggest splurge
  const negativeTxs = df.filter(row => cleanAmount(row['Amount (total)']) < 0)
                        .sort((a, b) => cleanAmount(a['Amount (total)']) - cleanAmount(b['Amount (total)']));
  const biggestTx = safeGetFirstRow(negativeTxs);
  
  return {
    category_breakdown: categoryBreakdown,
    most_frequent_category: {
      name: mostFrequentCategory || "none",
      count: highestCount
    },
    highest_spending_category: {
      name: highestSpendingCategory || "none",
      amount: highestAmount
    },
    biggest_splurge: {
      amount: Math.abs(cleanAmount(biggestTx['Amount (total)']) || 0),
      category: String(biggestTx.Category || "none"),
      note: String(biggestTx.Note || "none"),
      to: String(biggestTx.To || "none")
    }
  };
}

export function categorizeTransaction(row: Transaction): string {
  const note = String(row.Note || '').toLowerCase();
  const amount = cleanAmount(row['Amount (total)']);
  
  if (amount >= 0) {
    return 'incoming';
  }
  
  const categories: Record<string, string[]> = {
    'food': ['food', 'lunch', 'dinner', 'breakfast', 'grub', 'curry', 'chipotle', 'sushi', 'pizza', 'restaurant', 'meal', 'snack', 'eat'],
    'drinks': ['boba', 'coffee', 'starbucks', 'dunkin', 'drink', 'beer', 'alcohol', 'bar'],
    'rent': ['rent', 'lease', 'housing', 'apartment', 'utilities', 'electric', 'water', 'gas bill'],
    'entertainment': ['movie', 'concert', 'ticket', 'game', 'party', 'fun', 'event', 'show'],
    'transportation': ['uber', 'lyft', 'taxi', 'gas', 'ride', 'fare', 'train', 'bus'],
    'groceries': ['grocery', 'groceries', 'market', 'trader', 'walmart', 'target'],
    'shopping': ['amazon', 'shop', 'store', 'buy', 'purchase'],
    'bills': ['bill', 'utility', 'insurance', 'subscription', 'dues', 'fee'],
    'health': ['medical', 'doctor', 'health', 'gym', 'fitness', 'workout'],
    'education': ['tuition', 'book', 'class', 'course', 'school'],
    'gifts': ['gift', 'present', 'birthday', 'christmas', 'holiday'],
    /**
     * Transactions related to traveling, such as booking flights, hotels,
     * or vacation rentals.
     */
    'travel': ['flight', 'hotel', 'airbnb', 'vacation', 'trip']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => note.includes(keyword))) {
      return category;
    }
  }
  
  return 'miscellaneous';
}

export function getPeopleInsights(df: Transaction[]): PeopleInsights {
  // Group sent transactions by recipient
  const sent = new Map<string, { sum: number, count: number }>();
  df.filter(row => row.To && row['Amount (total)']).forEach(row => {
    const to = String(row.To);
    const amount = cleanAmount(row['Amount (total)']);
    if (amount < 0) {
      const current = sent.get(to) || { sum: 0, count: 0 };
      current.sum += Math.abs(amount);
      current.count++;
      sent.set(to, current);
    }
  });
  
  // Group received transactions by sender
  const received = new Map<string, { sum: number, count: number }>();
  df.filter(row => row.From && row['Amount (total)']).forEach(row => {
    const from = String(row.From);
    const amount = cleanAmount(row['Amount (total)']);
    if (amount > 0) {
      const current = received.get(from) || { sum: 0, count: 0 };
      current.sum += amount;
      current.count++;
      received.set(from, current);
    }
  });
  
  if (df.length === 0) {
    return {
      venmo_soulmate: { name: "none", count: 0, total_amount: 0 },
      most_generous_friend: { name: "none", amount: 0, count: 0 },
      most_thankful_friend: { name: "none", amount: 0, count: 0 },
      biggest_payment_sent: { amount: 0, to: "none", note: "none" },
      biggest_payment_received: { amount: 0, from: "none", note: "none" }
    };
  }
  
  // Find most frequent transaction partner
  const allPartners = new Map<string, number>();
  
  df.filter(row => row.To && row['Amount (total)']).forEach(row => {
    const to = String(row.To);
    const amount = cleanAmount(row['Amount (total)']);
    if (amount < 0) {
      allPartners.set(to, (allPartners.get(to) || 0) + 1);
    }
  });
  
  df.filter(row => row.From && row['Amount (total)']).forEach(row => {
    const from = String(row.From);
    const amount = cleanAmount(row['Amount (total)']);
    if (amount > 0) {
      allPartners.set(from, (allPartners.get(from) || 0) + 1);
    }
  });
  
  const [mostFrequentPartner, transactionCount] = safeGetMaxInfo(allPartners);
  
  const partnerTransactions = df.filter(row => {
    const amount = cleanAmount(row['Amount (total)']);
    return (amount < 0 && row.To === mostFrequentPartner) ||
           (amount > 0 && row.From === mostFrequentPartner);
  });
  
  const partnerTotalAmount = partnerTransactions.reduce((sum, row) => {
    const amount = cleanAmount(row['Amount (total)']);
    return sum + Math.abs(amount);  
  }, 0);
  
  // Get max values for generous and thankful friends
  const [generousName, generousAmount] = safeGetMaxInfo(
    new Map(Array.from(received.entries()).map(([k, v]) => [k, v.sum]))
  );
  
  const [thankfulName, thankfulAmount] = safeGetMaxInfo(
    new Map(Array.from(sent.entries()).map(([k, v]) => [k, v.sum]))
  );
  
  // Find biggest payments
  const sortedByAmountAsc = [...df]
    .filter(row => row['Amount (total)'])
    .sort((a, b) => cleanAmount(a['Amount (total)']) - cleanAmount(b['Amount (total)']));
  const biggestSent = sortedByAmountAsc[0];
  
  const sortedByAmountDesc = [...df]
    .filter(row => row['Amount (total)'])
    .sort((a, b) => cleanAmount(b['Amount (total)']) - cleanAmount(a['Amount (total)']));
  const biggestReceived = sortedByAmountDesc[0];
  
  return {
    venmo_soulmate: {
      name: mostFrequentPartner,
      count: transactionCount,
      total_amount: partnerTotalAmount
    },
    most_generous_friend: {
      name: generousName,
      amount: generousAmount,
      count: received.get(generousName)?.count || 0
    },
    most_thankful_friend: {
      name: thankfulName,
      amount: thankfulAmount,
      count: sent.get(thankfulName)?.count || 0
    },
    biggest_payment_sent: {
      amount: biggestSent ? Math.abs(cleanAmount(biggestSent['Amount (total)'])) : 0,
      to: String(biggestSent?.To || "none"),
      note: String(biggestSent?.Note || "none")
    },
    biggest_payment_received: {
      amount: biggestReceived ? cleanAmount(biggestReceived['Amount (total)']) : 0,
      from: String(biggestReceived?.From || "none"),
      note: String(biggestReceived?.Note || "none")
    }
  };
}

export function getTimeInsights(df: Transaction[]): TimeInsights {
  // Get day of week activity
  const dayCounts = new Map<string, number>();
  df.forEach(row => {
    const day = row.DayOfWeek || '';
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
  });
  const [busiestDay, busiestDayCount] = safeGetMaxInfo(dayCounts);
  
  // Get month activity
  const monthCounts = new Map<number, number>();
  df.forEach(row => {
    if (row.Month) {
      monthCounts.set(row.Month, (monthCounts.get(row.Month) || 0) + 1);
    }
  });
  const [busiestMonth, busiestMonthCount] = safeGetMaxInfo(monthCounts);
  
  // Get hour activity
  const hourCounts = new Map<number, number>();
  df.forEach(row => {
    if (row.Hour !== undefined) {
      hourCounts.set(row.Hour, (hourCounts.get(row.Hour) || 0) + 1);
    }
  });
  const [busiestHour, busiestHourCount] = safeGetMaxInfo(hourCounts);
  
  // Analyze weekend vs weekday
  df.forEach(row => {
    row.is_weekend = row.DayOfWeek === 'Saturday' || row.DayOfWeek === 'Sunday';
  });
  
  const weekendCount = df.filter(row => row.is_weekend).length;
  const weekdayCount = df.filter(row => !row.is_weekend).length;
  
  // Late night analysis (10 PM - 5 AM)
  const lateNightHours = [22, 23, 0, 1, 2, 3, 4, 5];
  const lateNightTxns = df.filter(row => row.Hour !== undefined && lateNightHours.includes(row.Hour));
  const lateNightCount = lateNightTxns.length;
  const lateNightPercentage = (lateNightCount / df.length) * 100;
  const lateNightTotal = lateNightTxns
    .filter(row => row.Amount! < 0)
    .reduce((sum, row) => sum + Math.abs(row.Amount!), 0);
  
  // Most common late night note keywords
  const lateNightCategories = ['food', 'drinks', 'uber', 'lyft', 'party', 'bar', 'club'];
  let lateNightCategory = 'none';
  
  if (lateNightTxns.length > 0) {
    const notes = lateNightTxns
      .map(row => String(row.Note || '').toLowerCase())
      .join(' ');
      
    const categoryCounts = lateNightCategories.map(cat => ({
      category: cat,
      count: (notes.match(new RegExp(cat, 'g')) || []).length
    }));
    
    const maxCategory = categoryCounts.reduce((max, current) => 
      current.count > max.count ? current : max, 
      { category: 'other', count: 0 }
    );
    
    lateNightCategory = maxCategory.count > 0 ? maxCategory.category : 'other';
  }
  
  return {
    most_active_day: {
      day: busiestDay,
      count: busiestDayCount,
      percentage: df.length > 0 ? (busiestDayCount / df.length * 100) : 0
    },
    most_active_month: {
      month: typeof busiestMonth === 'number' ? busiestMonth : 0,
      count: busiestMonthCount
    },
    most_active_hour: {
      hour: typeof busiestHour === 'number' ? busiestHour : 0,
      count: busiestHourCount
    },
    weekend_vs_weekday: {
      weekend_count: weekendCount,
      weekday_count: weekdayCount,
      weekend_percentage: (weekendCount + weekdayCount) > 0 
        ? (weekendCount / (weekendCount + weekdayCount) * 100) 
        : 0
    },
    late_night: {
      count: lateNightCount,
      percentage: lateNightPercentage,
      total_amount: lateNightTotal,
      most_common_category: lateNightCategory
    }
  };
}

export function findMoneyPingpong(df: Transaction[]): MoneyPingpong[] {
  const matches: MoneyPingpong[] = [];
  
  // Process outgoing transactions
  const outgoing = df.filter(row => row.Amount! < 0);
  const incoming = df.filter(row => row.Amount! > 0);
  
  // Compare each outgoing transaction with incoming ones
  for (const outRow of outgoing) {
    if (!outRow.From || !outRow.To || !outRow.Note) {
      continue;
    }
    
    // Look for matching incoming transactions from the same person within 7 days
    const personIncoming = incoming.filter(row => row.From === outRow.To);
    const outAmount = Math.abs(outRow.Amount!);
    const outDate = new Date(outRow.Datetime);
    
    for (const inRow of personIncoming) {
      if (!inRow.Note) {
        continue;
      }
      
      // Check if amounts are similar (within $1)
      const inAmount = inRow.Amount!;
      if (Math.abs(outAmount - inAmount) > 1) {
        continue;
      }
      
      // Check if transactions are within 7 days
      const inDate = new Date(inRow.Datetime);
      const timeDiff = Math.abs((inDate.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24));
      if (timeDiff <= 7) {
        matches.push({
          person: String(outRow.To),
          amount: outAmount,
          note1: String(outRow.Note),
          note2: String(inRow.Note),
          time_diff: Math.floor(timeDiff)
        });
        break;
      }
    }
  }
  
  return matches.sort((a, b) => b.amount - a.amount);
}

export function getFinancialHabits(df: Transaction[]): FinancialHabits {
  const amounts = df.map(t => Math.abs(cleanAmount(t['Amount (total)'])));
  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  
  return {
    avg_transaction_amount: avgAmount,
    payment_frequency: 'weekly', // Calculate based on date differences
    largest_payment_gap: 7, // Calculate based on date differences
    payment_consistency: 0.8 // Calculate based on payment patterns
  };
}

export function getSocialInsights(df: Transaction[]): SocialInsights {
  const uniquePeople = new Set([...df.map(t => t.From), ...df.map(t => t.To)].filter(Boolean));
  
  // Calculate most active month based on transaction count
  const monthCounts = new Map<number, number>();
  df.forEach(t => {
    if (t.Month) {
      monthCounts.set(t.Month, (monthCounts.get(t.Month) || 0) + 1);
    }
  });
  const [mostActiveMonth] = safeGetMaxInfo(monthCounts);
  
  // Calculate social score based on:
  // 1. Network size (number of unique people)
  // 2. Transaction frequency (transactions per person)
  // 3. Reciprocity (two-way relationships)
  const transactionsPerPerson = df.length / uniquePeople.size;
  const twoWayRelationships = new Set();
  
  df.forEach(t => {
    if (t.From && t.To) {
      const pair = [t.From, t.To].sort().join('-');
      twoWayRelationships.add(pair);
    }
  });
  
  const reciprocityRatio = twoWayRelationships.size / uniquePeople.size;
  const networkSizeScore = Math.min(uniquePeople.size / 50, 1); // Cap at 50 people
  const frequencyScore = Math.min(transactionsPerPerson / 10, 1); // Cap at 10 transactions per person
  
  const socialScore = (networkSizeScore * 0.4 + frequencyScore * 0.3 + reciprocityRatio * 0.3);
  
  return {
    total_unique_people: uniquePeople.size,
    most_active_month: format(new Date(2025, parseInt(mostActiveMonth.toString()) - 1), 'MMMM'),
    social_score: Math.min(Math.round(socialScore * 100) / 100, 1),
    payment_network_size: twoWayRelationships.size
  };
}

export function findEternalDebtCycles(df: Transaction[]): DebtCycle[] {
  const debtCycles: DebtCycle[] = [];
  const people = new Set([...df.map(t => t.From), ...df.map(t => t.To)].filter(Boolean));
  
  for (const person of people) {
    if (!person) continue;
    const personTransactions = df.filter(t => t.From === person || t.To === person);
    const sent = personTransactions.filter(t => t.From === person);
    const received = personTransactions.filter(t => t.To === person);
    
    if (sent.length > 0 && received.length > 0) {
      debtCycles.push({
        person,
        stats: {
          you_sent: sent.reduce((sum, t) => sum + cleanAmount(t['Amount (total)']), 0),
          you_received: received.reduce((sum, t) => sum + cleanAmount(t['Amount (total)']), 0),
          out_count: sent.length,
          in_count: received.length,
          last_sent: cleanAmount(sent[0]['Amount (total)']),
          last_received: cleanAmount(received[0]['Amount (total)']),
          last_sent_note: sent[0].Note,
          last_received_note: received[0].Note
        }
      });
    }
  }
  
  return debtCycles;
}

export function getFunInsights(df: Transaction[]): FunInsights {
  const emojis = df.flatMap(t => extractEmojis(t.Note));
  
  const emojiCounts = new Map<string, number>();
  emojis.forEach(e => emojiCounts.set(e, (emojiCounts.get(e) || 0) + 1));
  
  const [mostUsedEmoji, emojiCount] = safeGetMaxInfo(emojiCounts);
  
  const totalNotes = df.filter(t => t.Note).length;
  const notesWithEmojis = df.filter(t => t.Note && extractEmojis(t.Note).length > 0).length;
  const emojiPercentage = totalNotes > 0 ? (notesWithEmojis / totalNotes) * 100 : 0;
  
  return {
    most_used_emoji: {
      emoji: mostUsedEmoji,
      count: emojiCount
    },
    favorite_emoji_combo: {
      first: "👋",
      second: "🎉"
    },
    creative_notes: df
      .filter(t => t.Note && t.Note.length > 20)
      .slice(0, 5)
      .map(t => ({
        note: t.Note,
        amount: cleanAmount(t['Amount (total)']),
        with: t.To || t.From || ''
      })),
    note_stats: {
      shortest: df.reduce((min, t) => !t.Note ? min : (t.Note.length < min.length ? t.Note : min), ""),
      longest: df.reduce((max, t) => !t.Note ? max : (t.Note.length > max.length ? t.Note : max), ""),
      most_repeated: {
        note: "Thanks!",
        count: 10
      },
      emoji_percentage: emojiPercentage
    },
    late_night_activity: {
      count: df.filter(t => t.Hour && t.Hour >= 22).length,
      total_amount: df
        .filter(t => t.Hour && t.Hour >= 22)
        .reduce((sum, t) => sum + cleanAmount(t['Amount (total)']), 0)
    },
    cheapskate_award: {
      smallest_amount: Math.min(...df.map(t => Math.abs(cleanAmount(t['Amount (total)']))))
    }
  };
}

// Export interfaces
export type {
  Transaction,
  SpendingOverview,
  TopTransaction,
  CategoryBreakdown,
  TransactionCategories,
  PeopleInsights,
  TimeInsights,
  FinancialHabits,
  SocialInsights,
  MoneyPingpong,
  DebtCycle,
  FunInsights,
  VenmoInsights
}