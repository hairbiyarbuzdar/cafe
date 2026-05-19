import { ExpensesShell } from "@/features/expenses/expenses-shell";
import {
  expensesSummary,
  listExpenseHeads,
  listExpenses,
} from "@/lib/queries/expenses";
import { listPaymentChannels } from "@/lib/queries/payment-channels";

export const metadata = { title: "Expenses" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const [summary, expenses, heads, paymentChannels] = await Promise.all([
    expensesSummary(),
    listExpenses(),
    listExpenseHeads(),
    listPaymentChannels(),
  ]);

  return (
    <ExpensesShell
      summary={summary}
      expenses={expenses}
      heads={heads}
      paymentChannels={paymentChannels}
    />
  );
}
