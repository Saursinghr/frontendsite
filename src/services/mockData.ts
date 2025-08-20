
// Mock data for BuildTrack dashboard

// Construction Sites
export const sites = [
  {
    id: 1,
    name: "Downtown Office Complex",
    code: "DOC-2023",
    address: "123 Main St, New York, NY 10001",
    completionPercentage: 45,
    status: "in-progress",
    budget: 5000000,
    utilized: 1250000,
    teamSize: 7,
    managers: 1,
    admins: 1,
    totalDays: 824,
    daysRemaining: 592,
    milestones: {
      foundation: 100,
      structure: 65,
      plumbingElectrical: 30,
      finishing: 10
    }
  },
  {
    id: 2,
    name: "Riverside Apartments",
    code: "RAP-2023",
    address: "456 River Rd, Boston, MA 02108",
    completionPercentage: 75,
    status: "in-progress",
    budget: 8500000,
    utilized: 6375000,
    teamSize: 12,
    managers: 2,
    admins: 1,
    totalDays: 730,
    daysRemaining: 183,
    milestones: {
      foundation: 100,
      structure: 100,
      plumbingElectrical: 80,
      finishing: 45
    }
  },
  {
    id: 3,
    name: "Hillside Shopping Mall",
    code: "HSM-2023",
    address: "789 Hill Ave, San Francisco, CA 94016",
    completionPercentage: 30,
    status: "in-progress",
    budget: 12000000,
    utilized: 3600000,
    teamSize: 18,
    managers: 3,
    admins: 2,
    totalDays: 1095,
    daysRemaining: 766,
    milestones: {
      foundation: 90,
      structure: 40,
      plumbingElectrical: 10,
      finishing: 0
    }
  },
  {
    id: 4,
    name: "Greenfield Hospital",
    code: "GFH-2023",
    address: "101 Health Blvd, Chicago, IL 60601",
    completionPercentage: 15,
    status: "in-progress",
    budget: 25000000,
    utilized: 3750000,
    teamSize: 24,
    managers: 4,
    admins: 3,
    totalDays: 1460,
    daysRemaining: 1241,
    milestones: {
      foundation: 70,
      structure: 10,
      plumbingElectrical: 0,
      finishing: 0
    }
  },
  {
    id: 5,
    name: "Tech Park Campus",
    code: "TPC-2023",
    address: "202 Innovation Dr, Austin, TX 78701",
    completionPercentage: 60,
    status: "in-progress",
    budget: 18000000,
    utilized: 10800000,
    teamSize: 20,
    managers: 3,
    admins: 2,
    totalDays: 912,
    daysRemaining: 365,
    milestones: {
      foundation: 100,
      structure: 95,
      plumbingElectrical: 60,
      finishing: 20
    }
  },
  {
    id: 6,
    name: "Oceanview Condominiums",
    code: "OVC-2022",
    address: "303 Beach Rd, Miami, FL 33139",
    completionPercentage: 100,
    status: "completed",
    budget: 15000000,
    utilized: 14800000,
    teamSize: 0,
    managers: 0,
    admins: 0,
    totalDays: 730,
    daysRemaining: 0,
    milestones: {
      foundation: 100,
      structure: 100,
      plumbingElectrical: 100,
      finishing: 100
    }
  }
];

// Tasks for Downtown Office Complex
export const tasks = [
  {
    id: 1,
    name: "Complete foundation inspection",
    description: "Perform a thorough inspection of the foundation work and document any issues",
    status: "in-progress",
    priority: "high",
    assignedTo: "John Smith",
    dueDate: "2023-04-20"
  },
  {
    id: 2,
    name: "Order additional steel reinforcement",
    description: "Place an order for 20 tons of steel reinforcement bars for the next phase",
    status: "todo",
    priority: "medium",
    assignedTo: "Sarah Johnson",
    dueDate: "2023-04-18"
  },
  {
    id: 3,
    name: "Schedule electrical contractor",
    description: "Coordinate with the electrical contractor for the initial wiring work",
    status: "todo",
    priority: "medium",
    assignedTo: "John Smith",
    dueDate: "2023-04-25"
  },
  {
    id: 4,
    name: "Transport equipment to north section",
    description: "Move the excavator and other equipment to the north section of the site",
    status: "done",
    priority: "low",
    assignedTo: "Mike Davis",
    dueDate: "2023-04-17"
  },
  {
    id: 5,
    name: "Supervise concrete pouring",
    description: "Oversee the concrete pouring for the east wing foundation",
    status: "todo",
    priority: "high",
    assignedTo: "Lisa Wong",
    dueDate: "2023-04-19"
  }
];

// Team Members for Downtown Office Complex
export const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    role: "manager",
    email: "john.smith@buildtrack.com",
    phone: "555-123-4567",
    assignedTasks: 2,
    status: "Clocked In",
    lastActivity: "Tech Park Campus",
    attendance: 98
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "admin",
    email: "sarah.johnson@buildtrack.com",
    phone: "555-987-6543",
    assignedTasks: 1,
    status: "Clocked In",
    lastActivity: "Oceanview Condominiums",
    attendance: 100
  },
  {
    id: 3,
    name: "Mike Davis",
    role: "driver",
    email: "mike.davis@buildtrack.com",
    phone: "555-456-7890",
    assignedTasks: 1,
    status: "Clocked Out",
    lastActivity: "Riverside Apartments",
    attendance: 92
  },
  {
    id: 4,
    name: "Robert Chen",
    role: "worker",
    email: "robert.chen@buildtrack.com",
    phone: "555-222-3333",
    assignedTasks: 0,
    status: "Clocked In",
    lastActivity: "Downtown Office Complex",
    attendance: 95
  },
  {
    id: 5,
    name: "Lisa Wong",
    role: "supervisor",
    email: "lisa.wong@buildtrack.com",
    phone: "555-444-5555",
    assignedTasks: 1,
    status: "Clocked In",
    lastActivity: "Greenfield Hospital",
    attendance: 99
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    role: "worker",
    email: "carlos.rodriguez@buildtrack.com",
    phone: "555-666-7777",
    assignedTasks: 0,
    status: "Clocked Out",
    lastActivity: "Hillside Shopping Mall",
    attendance: 88
  },
  {
    id: 7,
    name: "Emma Wilson",
    role: "worker",
    email: "emma.wilson@buildtrack.com",
    phone: "555-888-9999",
    assignedTasks: 0,
    status: "Clocked In",
    lastActivity: "Oceanview Condominiums",
    attendance: 97
  }
];


// Materials for Downtown Office Complex
export const materials = [
  {
    id: 1,
    name: "Cement",
    quantity: 500,
    unit: "bags",
    status: "In Stock",
    stockLevel: 500
  },
  {
    id: 2,
    name: "Sand",
    quantity: 200,
    unit: "tons",
    status: "In Stock",
    stockLevel: 400
  },
  {
    id: 3,
    name: "Bricks",
    quantity: 10000,
    unit: "pieces",
    status: "In Stock",
    stockLevel: 500
  },
  {
    id: 4,
    name: "Steel",
    quantity: 50,
    unit: "tons",
    status: "In Stock",
    stockLevel: 500
  }
];

// Procurement for Downtown Office Complex
export const procurements = [
  {
    id: 1,
    item: "Concrete Mixer",
    quantity: 2,
    vendor: "Construction Equipment Inc.",
    requestDate: "Apr 10, 2023",
    deliveryDate: "Apr 25, 2023",
    status: "Approved"
  },
  {
    id: 2,
    item: "Safety Helmets",
    quantity: 50,
    vendor: "Safety Gear Suppliers",
    requestDate: "Apr 12, 2023",
    deliveryDate: "Apr 20, 2023",
    status: "Delivered"
  },
  {
    id: 3,
    item: "Electrical Wiring",
    quantity: 1000,
    vendor: "Electrical Wholesale Co.",
    requestDate: "Apr 14, 2023",
    deliveryDate: "Apr 28, 2023",
    status: "Pending"
  },
  {
    id: 4,
    item: "Plumbing Fixtures",
    quantity: 30,
    vendor: "Modern Plumbing Supplies",
    requestDate: "Apr 8, 2023",
    deliveryDate: "Apr 22, 2023",
    status: "Approved"
  },
  {
    id: 5,
    item: "Window Frames",
    quantity: 100,
    vendor: "Architectural Elements Ltd.",
    requestDate: "Apr 5, 2023",
    deliveryDate: "May 5, 2023",
    status: "Pending"
  }
];

// Recent Activity for Downtown Office Complex
export const recentActivities = [
  {
    id: 1,
    user: "Mike Davis",
    action: "Completed",
    description: "Completed equipment transport task",
    timestamp: "Apr 15, 2023 11:15 AM"
  },
  {
    id: 2,
    user: "Sarah Johnson",
    action: "Added",
    description: "Added new team member",
    timestamp: "Apr 15, 2023 9:45 AM"
  },
  {
    id: 3,
    user: "John Smith",
    action: "Updated",
    description: "Updated project timeline",
    timestamp: "Apr 15, 2023 8:30 AM"
  },
  {
    id: 4,
    user: "Sarah Johnson",
    action: "Ordered",
    description: "Ordered additional materials",
    timestamp: "Apr 14, 2023 4:20 PM"
  }
];

// Material Inventory Data for Charts
export const materialInventoryChart = [
  { name: "Bricks", value: 70 },
  { name: "Steel", value: 15 },
  { name: "Cement", value: 10 },
  { name: "Other", value: 5 }
];

// Finance Overview Data for Charts
export const financeOverviewChart = [
  {
    category: "Income",
    value: 1250000
  },
  {
    category: "Expenses",
    value: 72000
  }
];

export const resourceInventory = [
  {
    id: 1,
    name: 'Excavator',
    type: 'equipment',
    quantity: 2,
    status: 'available',
    assignedTo: 'Rajesh'
  },
  {
    id: 2,
    name: 'Cement Bags',
    type: 'material',
    quantity: 100,
    status: 'in use',
    assignedTo: 'Site A'
  },
  {
    id: 3,
    name: 'Concrete Mixer',
    type: 'equipment',
    quantity: 1,
    status: 'maintenance',
    assignedTo: 'Site B'
  },
  {
    id: 4,
    name: 'Bricks',
    type: 'material',
    quantity: 2000,
    status: 'available',
    assignedTo: 'Warehouse'
  },
  {
    id: 5,
    name: 'Bulldozer',
    type: 'equipment',
    quantity: 1,
    status: 'in use',
    assignedTo: 'Ravi'
  },
  {
    id: 6,
    name: 'Steel Rods',
    type: 'material',
    quantity: 300,
    status: 'available',
    assignedTo: 'Site C'
  },
  {
    id: 7,
    name: 'Scaffolding Set',
    type: 'equipment',
    quantity: 5,
    status: 'available',
    assignedTo: 'Store'
  },
  {
    id: 8,
    name: 'Paint Buckets',
    type: 'material',
    quantity: 40,
    status: 'in use',
    assignedTo: 'Interior Team'
  }
];

export const team = [
  {
    id: 1,
    name: 'John Smith',
    role: 'manager',
    status: 'Clocked In',
    lastActivity: 'Today, 8:00 AM',
    attendance: 95,
    assignedTasks: 3
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'supervisor',
    status: 'Clocked Out',
    lastActivity: 'Yesterday, 5:30 PM',
    attendance: 90,
    assignedTasks: 5
  },
  {
    id: 3,
    name: 'Mike Williams',
    role: 'worker',
    status: 'Clocked In',
    lastActivity: 'Today, 7:45 AM',
    attendance: 85,
    assignedTasks: 2
  },
  {
    id: 4,
    name: 'Emily Brown',
    role: 'worker',
    status: 'Clocked Out',
    lastActivity: 'Yesterday, 6:00 PM',
    attendance: 88,
    assignedTasks: 4
  },
  {
    id: 5,
    name: 'David Wilson',
    role: 'driver',
    status: 'Clocked In',
    lastActivity: 'Today, 8:15 AM',
    attendance: 92,
    assignedTasks: 1
  },
  {
    id: 6,
    name: 'Jessica Davis',
    role: 'admin',
    status: 'Clocked Out',
    lastActivity: 'Yesterday, 5:45 PM',
    attendance: 98,
    assignedTasks: 0
  },
];