import { PayrollShell } from "@/features/payroll/payroll-shell";
import { listPaymentChannels } from "@/lib/queries/payment-channels";
import { listPayroll } from "@/lib/queries/payroll";
import { listRoles } from "@/lib/queries/roles";
import { ensureBuiltInRoles } from "@/lib/roles-seed";

export const metadata = { title: "Staff Payroll" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  await ensureBuiltInRoles();
  const sp = await searchParams;
  const now = new Date();

  let year = Number.parseInt(sp.year ?? "", 10);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    year = now.getFullYear();
  }
  let monthNum = Number.parseInt(sp.month ?? "", 10);
  if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
    monthNum = now.getMonth() + 1;
  }
  const month = `${year}-${String(monthNum).padStart(2, "0")}`;

  const [roster, channels, roles] = await Promise.all([
    listPayroll(month),
    listPaymentChannels(),
    listRoles(),
  ]);

  return (
    <PayrollShell
      month={month}
      year={year}
      monthNum={monthNum}
      rows={roster.rows}
      stats={roster.stats}
      channels={channels}
      roles={roles.map((r) => ({ id: r.id, name: r.name }))}
    />
  );
}
