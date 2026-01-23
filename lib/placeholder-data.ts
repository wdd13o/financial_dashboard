const users = [
  {
    id: "user_1",
    email: "john.doe@example.com",
    password: "hashedpassword123", // In production, this would be properly hashed
    name: "John Doe",
  },
  {
    id: "user_2",
    email: "jane.smith@example.com",
    password: "hashedpassword456",
    name: "Jane Smith",
  },
  {
    id: "user_3",
    email: "bob.wilson@example.com",
    password: "hashedpassword789",
    name: "Bob Wilson",
  },
];

const invoices = [
  {
    id: "invoice_1",
    clientName: "Acme Corp",
    amount: 1500.00,
    status: "paid",
    dueDate: new Date("2025-01-31"),
    description: "Web Development Services",
    userId: "user_1",
  },
  {
    id: "invoice_2",
    clientName: "Tech Solutions Inc",
    amount: 2500.00,
    status: "pending",
    dueDate: new Date("2025-02-15"),
    description: "Mobile App Development",
    userId: "user_1",
  },
  {
    id: "invoice_3",
    clientName: "Creative Agency",
    amount: 1200.00,
    status: "overdue",
    dueDate: new Date("2025-01-01"),
    description: "Design Consultation",
    userId: "user_1",
  },
  {
    id: "invoice_4",
    clientName: "Global Enterprises",
    amount: 5000.00,
    status: "pending",
    dueDate: new Date("2025-03-01"),
    description: "Enterprise Software Integration",
    userId: "user_2",
  },
  {
    id: "invoice_5",
    clientName: "StartUp Media",
    amount: 800.00,
    status: "paid",
    dueDate: new Date("2025-01-20"),
    description: "Social Media Management",
    userId: "user_2",
  },
  {
    id: "invoice_6",
    clientName: "Local Business Co",
    amount: 3200.00,
    status: "pending",
    dueDate: new Date("2025-02-28"),
    description: "Business Consulting",
    userId: "user_3",
  },
  {
    id: "invoice_7",
    clientName: "Test Client",
    amount: 666.00,
    status: "paid",
    dueDate: new Date("2025-02-10"),
    description: "Test Invoice",
    userId: "user_1",
  },
];

export { users, invoices };
