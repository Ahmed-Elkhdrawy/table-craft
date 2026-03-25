export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  department: string
  joinedAt: string
}

export const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', department: 'Engineering', joinedAt: '2023-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'editor', status: 'active', department: 'Marketing', joinedAt: '2023-02-20' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', role: 'viewer', status: 'inactive', department: 'Sales', joinedAt: '2023-03-10' },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'editor', status: 'active', department: 'Engineering', joinedAt: '2023-04-05' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', role: 'admin', status: 'active', department: 'HR', joinedAt: '2023-05-12' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', role: 'viewer', status: 'active', department: 'Engineering', joinedAt: '2023-06-18' },
  { id: '7', name: 'Grace Chen', email: 'grace@example.com', role: 'editor', status: 'inactive', department: 'Design', joinedAt: '2023-07-22' },
  { id: '8', name: 'Henry Wilson', email: 'henry@example.com', role: 'viewer', status: 'active', department: 'Sales', joinedAt: '2023-08-30' },
  { id: '9', name: 'Iris Taylor', email: 'iris@example.com', role: 'admin', status: 'active', department: 'Engineering', joinedAt: '2023-09-14' },
  { id: '10', name: 'Jack Anderson', email: 'jack@example.com', role: 'editor', status: 'active', department: 'Marketing', joinedAt: '2023-10-01' },
  { id: '11', name: 'Karen Thomas', email: 'karen@example.com', role: 'viewer', status: 'inactive', department: 'HR', joinedAt: '2023-10-15' },
  { id: '12', name: 'Liam Harris', email: 'liam@example.com', role: 'editor', status: 'active', department: 'Design', joinedAt: '2023-11-02' },
  { id: '13', name: 'Mia Clark', email: 'mia@example.com', role: 'admin', status: 'active', department: 'Engineering', joinedAt: '2023-11-20' },
  { id: '14', name: 'Noah Lewis', email: 'noah@example.com', role: 'viewer', status: 'active', department: 'Sales', joinedAt: '2023-12-05' },
  { id: '15', name: 'Olivia Walker', email: 'olivia@example.com', role: 'editor', status: 'inactive', department: 'Marketing', joinedAt: '2024-01-10' },
  { id: '16', name: 'Paul Robinson', email: 'paul@example.com', role: 'viewer', status: 'active', department: 'Engineering', joinedAt: '2024-01-25' },
  { id: '17', name: 'Quinn Hall', email: 'quinn@example.com', role: 'admin', status: 'active', department: 'HR', joinedAt: '2024-02-08' },
  { id: '18', name: 'Rachel Young', email: 'rachel@example.com', role: 'editor', status: 'active', department: 'Design', joinedAt: '2024-02-28' },
  { id: '19', name: 'Sam King', email: 'sam@example.com', role: 'viewer', status: 'inactive', department: 'Sales', joinedAt: '2024-03-15' },
  { id: '20', name: 'Tina Wright', email: 'tina@example.com', role: 'admin', status: 'active', department: 'Engineering', joinedAt: '2024-04-01' },
  { id: '21', name: 'Uma Scott', email: 'uma@example.com', role: 'editor', status: 'active', department: 'Marketing', joinedAt: '2024-04-18' },
  { id: '22', name: 'Victor Green', email: 'victor@example.com', role: 'viewer', status: 'active', department: 'Engineering', joinedAt: '2024-05-05' },
  { id: '23', name: 'Wendy Adams', email: 'wendy@example.com', role: 'editor', status: 'inactive', department: 'HR', joinedAt: '2024-05-22' },
  { id: '24', name: 'Xavier Baker', email: 'xavier@example.com', role: 'admin', status: 'active', department: 'Design', joinedAt: '2024-06-10' },
  { id: '25', name: 'Yara Nelson', email: 'yara@example.com', role: 'viewer', status: 'active', department: 'Sales', joinedAt: '2024-06-28' },
]
