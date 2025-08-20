
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface EmployeeSummaryCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
}

export const EmployeeSummaryCards: React.FC<EmployeeSummaryCardsProps> = ({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border border-slate-100 bg-white rounded-xl shadow-sm">
        <CardContent className="flex items-center p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 mr-4">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <h3 className="text-2xl font-bold">{totalEmployees}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-100 bg-white rounded-xl shadow-sm">
        <CardContent className="flex items-center p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 mr-4">
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Employees</p>
            <h3 className="text-2xl font-bold">{activeEmployees}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-100 bg-white rounded-xl shadow-sm">
        <CardContent className="flex items-center p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50 mr-4">
            <Users className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Inactive Employees</p>
            <h3 className="text-2xl font-bold">{inactiveEmployees}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
