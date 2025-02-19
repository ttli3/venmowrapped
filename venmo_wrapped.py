import pandas as pd
import numpy as np
from datetime import datetime
import emoji
from collections import Counter
import seaborn as sns
from pathlib import Path
import json

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if pd.isna(obj):
            return None
        return super().default(obj)

def clean_amount(amount):
    if pd.isna(amount):
        return 0.0
    if isinstance(amount, str):
        # Remove $ and commas, then convert to float
        cleaned = amount.strip().replace('$', '').replace(',', '')
        # Handle + and - signs
        if cleaned.startswith('+'):
            return float(cleaned[1:])
        elif cleaned.startswith('-'):
            return -float(cleaned[1:])
        return float(cleaned)
    return 0.0

def analyze_venmo_statement(file_path):
    required_columns = ['ID', 'Datetime', 'Type', 'Amount (total)', 'Note']
    
    try:
        # Try with skiprows first (for official Venmo CSVs)
        df = pd.read_csv(file_path, skiprows=2)
        if not all(col in df.columns for col in required_columns):
            # Try without skiprows
            df = pd.read_csv(file_path)
    except Exception as e:
        raise ValueError(f'Failed to read CSV file: {str(e)}')
    
    # Validate required columns
    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        raise ValueError(f'Missing required columns: {missing_cols}')
    
    # Drop empty rows
    df = df.dropna(subset=['ID'])
    if len(df) == 0:
        raise ValueError('No valid transactions found in CSV')
    
    try:
        # Clean amount column
        df['Amount'] = df['Amount (total)'].apply(clean_amount)
        
        # Convert datetime and extract components
        df['Datetime'] = pd.to_datetime(df['Datetime'])
        df['Month'] = df['Datetime'].dt.month
        df['Hour'] = df['Datetime'].dt.hour
        df['DayOfWeek'] = df['Datetime'].dt.day_name()
    except Exception as e:
        raise ValueError(f'Error processing data: {str(e)}')
    
    # Filter only payment transactions
    payments_df = df[df['Type'] == 'Payment'].copy()
    if len(payments_df) == 0:
        raise ValueError('No payment transactions found in CSV')
    
    insights = {
        "spending_overview": get_spending_overview(payments_df),
        "transaction_categories": get_transaction_categories(payments_df),
        "people_insights": get_people_insights(payments_df),
        "time_insights": get_time_insights(payments_df),
        "fun_insights": get_fun_insights(payments_df),
        "financial_habits": get_financial_habits(payments_df),
        "social_insights": get_social_insights(payments_df),
        "money_pingpong": find_money_pingpong(payments_df),
        "eternal_debt_cycles": find_eternal_debt_cycles(payments_df)
    }
    
    # Convert insights to JSON-serializable format
    return json.loads(json.dumps(insights, cls=NumpyEncoder))

def get_spending_overview(df):
    outgoing = abs(df[df['Amount'] < 0]['Amount'].sum())
    incoming = df[df['Amount'] > 0]['Amount'].sum()
    
    monthly_spend = df[df['Amount'] < 0].groupby('Month')['Amount'].sum().abs()
    
    # Handle empty data
    most_exp_month = monthly_spend.idxmax() if not monthly_spend.empty else None
    most_exp_amount = monthly_spend.max() if not monthly_spend.empty else 0
    cheapest_month = monthly_spend.idxmin() if not monthly_spend.empty else None
    cheapest_amount = monthly_spend.min() if not monthly_spend.empty else 0
    
    # Calculate average payment size (absolute value of all transactions)
    avg_payment = abs(df['Amount']).mean() if not df.empty else 0
    
    return {
        "total_spent": outgoing,
        "total_received": incoming,
        "net_balance": incoming - outgoing,
        "avg_monthly_spend": outgoing / 12 if outgoing > 0 else 0,
        "most_expensive_month": most_exp_month,
        "most_expensive_month_amount": most_exp_amount,
        "avg_payment_size": avg_payment,
        "total_transactions": len(df)
    }

def safe_get_first_row(df):
    try:
        return df.iloc[0] if not df.empty else pd.Series()
    except:
        return pd.Series()

def get_transaction_categories(df):
    def categorize_transaction(row):
        note = str(row['Note']).lower()
        amount = row['Amount']
        
        if amount >= 0:
            return 'incoming'
            
        categories = {
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
            'travel': ['flight', 'hotel', 'airbnb', 'vacation', 'trip']
        }
        
        for category, keywords in categories.items():
            if any(keyword in note for keyword in keywords):
                return category
        return 'miscellaneous'
    
    # Apply categorization
    df['Category'] = df.apply(categorize_transaction, axis=1)
    
    # Get spending by category
    spending_by_category = df[df['Amount'] < 0].groupby('Category').agg({
        'Amount': ['count', lambda x: abs(x.sum())]
    })
    spending_by_category.columns = ['count', 'total']
    
    # Calculate percentages
    total_spending = spending_by_category['total'].sum()
    spending_by_category['percentage'] = (spending_by_category['total'] / total_spending * 100)
    
    # Get top transactions in each category
    top_transactions = {}
    for category in spending_by_category.index:
        cat_transactions = df[df['Category'] == category].sort_values('Amount')
        if not cat_transactions.empty:
            top_transactions[category] = {
                'amount': float(abs(cat_transactions['Amount'].iloc[0])),
                'note': str(cat_transactions['Note'].iloc[0]),
                'to': str(cat_transactions['To'].iloc[0])
            }
    
    # Find biggest splurge
    negative_txs = df[df['Amount'] < 0].sort_values('Amount')
    biggest_tx = safe_get_first_row(negative_txs)
    
    if spending_by_category.empty:
        return {
            "category_breakdown": {},
            "most_frequent_category": {"name": "none", "count": 0},
            "highest_spending_category": {"name": "none", "amount": 0},
            "biggest_splurge": {"amount": 0, "category": "none", "note": "none", "to": "none"}
        }

    return {
        "category_breakdown": {
            category: {
                'count': int(row['count']),
                'total': float(row['total']),
                'percentage': float(row['percentage']),
                'top_transaction': top_transactions.get(category)
            }
            for category, row in spending_by_category.iterrows()
        },
        "most_frequent_category": {
            "name": spending_by_category['count'].idxmax(),
            "count": int(spending_by_category['count'].max())
        },
        "highest_spending_category": {
            "name": spending_by_category['total'].idxmax(),
            "amount": float(spending_by_category['total'].max())
        },
        "biggest_splurge": {
            "amount": float(abs(biggest_tx['Amount'])),
            "category": str(biggest_tx['Category']),
            "note": str(biggest_tx['Note']),
            "to": str(biggest_tx['To'])
        }
    }

def safe_get_max_info(series):
    if series.empty:
        return "none", 0
    return series.idxmax(), float(series.max())

def get_people_insights(df):
    sent = df[df['Amount'] < 0].groupby('To')['Amount'].agg(['sum', 'count']) * -1
    received = df[df['Amount'] > 0].groupby('From')['Amount'].agg(['sum', 'count'])
    
    if df.empty:
        return {
            "venmo_soulmate": {"name": "none", "count": 0, "total_amount": 0},
            "most_generous_friend": {"name": "none", "amount": 0, "count": 0},
            "most_thankful_friend": {"name": "none", "amount": 0, "count": 0},
            "biggest_payment_sent": {"amount": 0, "to": "none", "note": "none"},
            "biggest_payment_received": {"amount": 0, "from": "none", "note": "none"}
        }

    # Find most frequent transaction partner (combined sent and received)
    all_partners = pd.concat([
        df[df['Amount'] < 0]['To'].value_counts(),
        df[df['Amount'] > 0]['From'].value_counts()
    ]).groupby(level=0).sum()
    
    if all_partners.empty:
        most_frequent_partner = "none"
        transaction_count = 0
        partner_transactions = pd.DataFrame()
    else:
        most_frequent_partner = all_partners.idxmax()
        transaction_count = all_partners.max()
        partner_transactions = df[
            ((df['Amount'] < 0) & (df['To'] == most_frequent_partner)) |
            ((df['Amount'] > 0) & (df['From'] == most_frequent_partner))
        ]
    
    # Get max values safely
    generous_name, generous_amount = safe_get_max_info(received['sum'] if not received.empty else pd.Series())
    thankful_name, thankful_amount = safe_get_max_info(sent['sum'] if not sent.empty else pd.Series())
    
    return {
        "venmo_soulmate": {
            "name": most_frequent_partner,
            "count": int(transaction_count),
            "total_amount": float(abs(partner_transactions['Amount']).sum()) if not partner_transactions.empty else 0
        },
        "most_generous_friend": {
            "name": generous_name,
            "amount": float(generous_amount),
            "count": int(received.loc[generous_name, 'count']) if generous_name != "none" else 0
        },
        "most_thankful_friend": {
            "name": thankful_name,
            "amount": float(thankful_amount),
            "count": int(sent.loc[thankful_name, 'count']) if thankful_name != "none" else 0
        },
        "biggest_payment_sent": {
            "amount": float(abs(df['Amount'].min())) if not df.empty else 0,
            "to": df.loc[df['Amount'].idxmin(), 'To'] if not df.empty else "none",
            "note": df.loc[df['Amount'].idxmin(), 'Note'] if not df.empty else "none"
        },
        "biggest_payment_received": {
            "amount": float(df['Amount'].max()) if not df.empty else 0,
            "from": df.loc[df['Amount'].idxmax(), 'From'] if not df.empty else "none",
            "note": df.loc[df['Amount'].idxmax(), 'Note'] if not df.empty else "none"
        }
    }

def get_time_insights(df):
    # Get day of week activity
    day_counts = df['DayOfWeek'].value_counts()
    busiest_day = day_counts.index[0]
    busiest_day_count = day_counts.iloc[0]
    
    # Get month activity
    month_counts = df.groupby('Month').size()
    busiest_month = month_counts.idxmax()
    busiest_month_count = month_counts.max()
    
    # Get hour activity
    hour_counts = df['Hour'].value_counts()
    busiest_hour = hour_counts.index[0]
    busiest_hour_count = hour_counts.iloc[0]
    
    # Analyze weekend vs weekday
    df['is_weekend'] = df['DayOfWeek'].isin(['Saturday', 'Sunday'])
    weekend_count = df[df['is_weekend']]['Amount'].count()
    weekday_count = df[~df['is_weekend']]['Amount'].count()
    
    # Late night analysis (10 PM - 5 AM)
    late_night_hours = [22, 23, 0, 1, 2, 3, 4, 5]
    late_night_txns = df[df['Hour'].isin(late_night_hours)]
    late_night_count = len(late_night_txns)
    late_night_percentage = (late_night_count / len(df)) * 100 if len(df) > 0 else 0
    late_night_total = abs(late_night_txns[late_night_txns['Amount'] < 0]['Amount'].sum())
    
    # Most common late night note keywords
    late_night_categories = ['food', 'drinks', 'uber', 'lyft', 'party', 'bar', 'club']
    if not late_night_txns.empty:
        notes = ' '.join(late_night_txns['Note'].astype(str).str.lower())
        category_counts = {cat: notes.count(cat) for cat in late_night_categories}
        late_night_category = max(category_counts.items(), key=lambda x: x[1])[0] if any(category_counts.values()) else 'other'
    else:
        late_night_category = 'none'
    
    return {
        "most_active_day": {
            "day": str(busiest_day),
            "count": int(busiest_day_count),
            "percentage": float(busiest_day_count / len(df) * 100)
        },
        "most_active_month": {
            "month": int(busiest_month),
            "count": int(busiest_month_count)
        },
        "most_active_hour": {
            "hour": int(busiest_hour),
            "count": int(busiest_hour_count)
        },
        "weekend_vs_weekday": {
            "weekend_count": int(weekend_count),
            "weekday_count": int(weekday_count),
            "weekend_percentage": float(weekend_count / (weekend_count + weekday_count) * 100)
        },
        "late_night": {
            "count": int(late_night_count),
            "percentage": float(late_night_percentage),
            "total_amount": float(late_night_total),
            "most_common_category": late_night_category
        }
    }

def find_money_pingpong(df):
    matches = []
    
    # Process outgoing transactions
    outgoing = df[df['Amount'] < 0].copy()
    incoming = df[df['Amount'] > 0].copy()
    
    # Compare each outgoing transaction with incoming ones
    for _, out_row in outgoing.iterrows():
        if pd.isna(out_row['From']) or pd.isna(out_row['To']) or pd.isna(out_row['Note']):
            continue
            
        # Look for matching incoming transactions from the same person within 7 days
        person_incoming = incoming[incoming['From'] == out_row['To']]
        out_amount = abs(out_row['Amount'])
        out_date = out_row['Datetime']
        
        for _, in_row in person_incoming.iterrows():
            if pd.isna(in_row['Note']):
                continue
                
            # Check if amounts are similar (within $1)
            in_amount = in_row['Amount']
            if abs(out_amount - in_amount) > 1:
                continue
                
            # Check if transactions are within 7 days
            time_diff = abs((in_row['Datetime'] - out_date).days)
            if time_diff <= 7:
                matches.append({
                    'person': out_row['To'],
                    'amount': out_amount,
                    'note1': out_row['Note'],
                    'note2': in_row['Note'],
                    'time_diff': time_diff
                })
                break
    
    return sorted(matches, key=lambda x: x['amount'], reverse=True)

def find_eternal_debt_cycles(df):
    # Track total back-and-forth amounts between people
    debt_cycles = {}
    
    # Process outgoing transactions
    outgoing = df[df['Amount'] < 0].copy()
    incoming = df[df['Amount'] > 0].copy()
    
    # First, identify people who have both sent and received money
    for person in set(outgoing['To']).intersection(set(incoming['From'])):
        person_outgoing = outgoing[outgoing['To'] == person]
        person_incoming = incoming[incoming['From'] == person]
        
        sent = abs(person_outgoing['Amount'].sum())
        received = person_incoming['Amount'].sum()
        
        # Only count if there's significant back-and-forth (at least 3 transactions total)
        out_count = len(person_outgoing)
        in_count = len(person_incoming)
        
        if out_count + in_count >= 3:
            total_flow = sent + received
            net_flow = abs(sent - received)
            
            # If net flow is small compared to total flow, it's a cycle
            if net_flow < total_flow * 0.3:  # Less than 30% difference
                # Get the most recent transactions
                recent_out = person_outgoing.sort_values('Datetime').iloc[-1]
                recent_in = person_incoming.sort_values('Datetime').iloc[-1]
                
                debt_cycles[person] = {
                    'you_sent': sent,
                    'you_received': received,
                    'out_count': out_count,
                    'in_count': in_count,
                    'last_sent': abs(recent_out['Amount']),
                    'last_received': recent_in['Amount'],
                    'last_sent_note': recent_out['Note'],
                    'last_received_note': recent_in['Note']
                }
    
    # Sort by total money flow
    return sorted([
        {
            'person': person,
            'stats': stats
        } for person, stats in debt_cycles.items()
    ], key=lambda x: x['stats']['you_sent'] + x['stats']['you_received'], reverse=True)

def get_fun_insights(df):
    def extract_emojis(text):
        if pd.isna(text):
            return []
        return [c for c in str(text) if c in emoji.EMOJI_DATA]
    
    # Emoji analysis
    all_emojis = []
    for note in df['Note'].dropna():
        all_emojis.extend(extract_emojis(note))
    emoji_counts = Counter(all_emojis)
    most_used_emoji = emoji_counts.most_common(1)[0] if emoji_counts else ('❓', 0)
    emoji_pairs = Counter(zip(all_emojis[:-1], all_emojis[1:]))
    fav_emoji_combo = emoji_pairs.most_common(1)[0][0] if emoji_pairs else ('❓', '❓')
    
    # Creative notes analysis
    df['note_length'] = df['Note'].str.len()
    df['has_emoji'] = df['Note'].apply(lambda x: bool(extract_emojis(x)))
    interesting_notes = df[
        (df['Note'].notna()) &
        (df['note_length'] > 5)
    ].sort_values('note_length', ascending=False)
    
    # Find shortest and longest notes
    valid_notes = df[df['Note'].str.len() > 0]
    shortest_note = valid_notes.nsmallest(1, 'note_length')['Note'].iloc[0] if not valid_notes.empty else ''
    longest_note = valid_notes.nlargest(1, 'note_length')['Note'].iloc[0] if not valid_notes.empty else ''
    
    # Find repeated notes
    note_counts = df['Note'].value_counts()
    most_repeated = note_counts.index[0] if not note_counts.empty else ''
    repeat_count = note_counts.iloc[0] if not note_counts.empty else 0
    
    # Analyze time patterns
    df['hour'] = pd.to_datetime(df['Datetime']).dt.hour
    late_night = df[df['hour'].between(0, 4)]
    late_night_count = len(late_night)
    late_night_total = abs(late_night['Amount'].sum())
    
    # Find the "cheapskate" transactions (very small amounts)
    tiny_txns = df[abs(df['Amount']) < 1]
    smallest_amount = tiny_txns['Amount'].min() if not tiny_txns.empty else 0
    
    return {
        "most_used_emoji": {
            "emoji": most_used_emoji[0],
            "count": most_used_emoji[1]
        },
        "favorite_emoji_combo": {
            "first": fav_emoji_combo[0],
            "second": fav_emoji_combo[1]
        },
        "creative_notes": [
            {
                "note": str(row['Note']),
                "amount": abs(float(row['Amount'])),
                "with": row['To'] if row['Amount'] < 0 else row['From']
            }
            for _, row in interesting_notes.head(3).iterrows()
        ],
        "note_stats": {
            "shortest": shortest_note,
            "longest": longest_note,
            "most_repeated": {
                "note": most_repeated,
                "count": repeat_count
            },
            "emoji_percentage": (df['has_emoji'].sum() / len(df)) * 100
        },
        "late_night_activity": {
            "count": late_night_count,
            "total_amount": late_night_total
        },
        "cheapskate_award": {
            "smallest_amount": abs(smallest_amount)
        }
    }





    








def get_financial_habits(df):
    # Calculate average transaction amount
    avg_amount = abs(df['Amount'].mean())
    
    # Calculate payment frequency
    dates = pd.to_datetime(df['Datetime']).sort_values()
    gaps = dates.diff().dt.days
    avg_gap = gaps.mean()
    
    if avg_gap <= 2:
        frequency = "Daily Spender"
    elif avg_gap <= 7:
        frequency = "Weekly Regular"
    elif avg_gap <= 30:
        frequency = "Monthly Planner"
    else:
        frequency = "Occasional Splurger"
    
    # Find largest gap between payments
    largest_gap = gaps.max()
    
    # Calculate payment consistency (0-1 score)
    # Based on standard deviation of gaps between payments
    gap_std = gaps.std()
    consistency = 1 / (1 + gap_std/30) if pd.notna(gap_std) else 0.5
    consistency = max(0, min(1, consistency))
    
    return {
        "avg_transaction_amount": float(avg_amount),
        "payment_frequency": frequency,
        "largest_payment_gap": int(largest_gap) if pd.notna(largest_gap) else 0,
        "payment_consistency": float(consistency)
    }

def get_social_insights(df):
    # Count unique people (combine 'To' and 'From' fields)
    all_people = pd.concat([df['To'], df['From']]).unique()
    total_unique = len(all_people)
    
    # Find most active month by transaction count
    df['Month'] = pd.to_datetime(df['Datetime']).dt.month
    monthly_counts = df.groupby('Month').size()
    month_names = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
    most_active_month = month_names[monthly_counts.idxmax() - 1] if not monthly_counts.empty else 'January'
    
    # Calculate social score (0-100)
    # Based on number of unique connections and transaction frequency
    max_expected_connections = 100  # Baseline for max score
    connection_score = min(1, total_unique / max_expected_connections)
    
    transaction_frequency = len(df) / 365  # Transactions per day
    frequency_score = min(1, transaction_frequency / 3)  # Cap at 3 transactions/day
    
    social_score = ((connection_score + frequency_score) / 2) * 100
    
    # Calculate payment network size (weighted by transaction count)
    person_weights = df.groupby('To').size().add(df.groupby('From').size(), fill_value=0)
    network_size = len(person_weights[person_weights > 1])  # Count people with >1 transaction
    
    return {
        "total_unique_people": int(total_unique),
        "most_active_month": most_active_month,
        "social_score": round(float(social_score), 1),
        "payment_network_size": int(network_size)
    }

def generate_visualizations(insights, output_dir):
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)
    
    # Create monthly spending data
    months = range(1, 13)
    monthly_amounts = []
    for month in months:
        if month == insights['spending_overview']['most_expensive_month']:
            monthly_amounts.append(insights['spending_overview']['most_expensive_month_amount'])
        elif month == insights['spending_overview']['cheapest_month']:
            monthly_amounts.append(insights['spending_overview']['cheapest_month_amount'])
        else:
            monthly_amounts.append(insights['spending_overview']['avg_monthly_spend'])
    
    
    # Filter out categories with very small percentages
    significant_categories = {k: v for k, v in categories.items() 
                            if v['percentage'] > 1.0 and k != 'incoming'}
    
    # Sort by percentage
    sorted_categories = dict(sorted(significant_categories.items(), 
                                  key=lambda x: x[1]['percentage'], 
                                  reverse=True))

if __name__ == "__main__":
    import sys
    import json
    import os
    
    try:
        if len(sys.argv) != 2:
            print(json.dumps({"error": "Usage: python venmo_wrapped.py <csv_file>"}))
            sys.exit(1)
            
        file_path = sys.argv[1]
        if not os.path.exists(file_path):
            print(json.dumps({"error": f"File {file_path} does not exist"}))
            sys.exit(1)
            
        insights = analyze_venmo_statement(file_path)
        print(json.dumps({"success": True, "data": insights}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)