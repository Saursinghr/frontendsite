import { CirclePlus, ClipboardList, BadgeCheck, Package } from "lucide-react";

export interface SummaryStats {
  total: number;
  pending: number;
  approved: number;
  delivered: number;
}

export function ProcurementSummary({ stats }: { stats: SummaryStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      <div className="flex items-center gap-3 rounded-lg border bg-white px-6 py-4">
        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <div className="font-semibold text-2xl mt-1">{stats.total}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-white px-5 py-4 shadow-sm">
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <CirclePlus className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Pending</p>
          <div className="font-bold text-2xl">{stats.pending}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-white px-5 py-4 shadow-sm">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <BadgeCheck className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Approved</p>
          <div className="font-bold text-2xl">{stats.approved}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-white px-5 py-4 shadow-sm">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <Package className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Delivered</p>
          <div className="font-bold text-2xl">{stats.delivered}</div>
        </div>
      </div>
    </div>
  );
}
