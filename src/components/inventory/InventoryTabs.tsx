
import React from "react";
import { Package, ClipboardList } from "lucide-react";

interface InventoryTabsProps {
  activeTab: "materials" | "transactions";
  setActiveTab: (tab: "materials" | "transactions") => void;
}

const InventoryTabs: React.FC<InventoryTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="px-6 mt-6 border-b border-gray-200">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab("materials")}
          className={`flex items-center pb-4 px-2 ${
            activeTab === "materials"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package
            size={18}
            className={`mr-2 ${
              activeTab === "materials" ? "text-blue-600" : "text-gray-500"
            }`}
          />
          <span>Materials</span>
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center pb-4 px-2 ${
            activeTab === "transactions"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ClipboardList
            size={18}
            className={`mr-2 ${
              activeTab === "transactions" ? "text-blue-600" : "text-gray-500"
            }`}
          />
          <span>Transaction History</span>
        </button>
      </div>
    </div>
  );
};

export default InventoryTabs;
