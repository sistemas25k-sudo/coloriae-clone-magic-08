export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  pixCode?: string;
  isPaid: boolean;
  createdAt: string;
  orderValue: number;
  paymentMethod?: 'pix' | 'credit' | 'debit';
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const STORAGE_KEY = 'lojaVirtualUsers';

export const localDB = {
  // Salvar usuário
  saveUser: (userData: Omit<UserData, 'id' | 'createdAt'>): UserData => {
    const users = localDB.getAllUsers();
    const newUser: UserData = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // Auto-save para arquivo
    localDB.autoSaveToFile(newUser);
    
    return newUser;
  },

  // Buscar todos os usuários
  getAllUsers: (): UserData[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  // Buscar usuário por ID
  getUserById: (id: string): UserData | null => {
    const users = localDB.getAllUsers();
    return users.find(user => user.id === id) || null;
  },

  // Buscar usuário por email
  getUserByEmail: (email: string): UserData | null => {
    const users = localDB.getAllUsers();
    return users.find(user => user.email === email) || null;
  },

  // Atualizar usuário
  updateUser: (id: string, updates: Partial<UserData>): UserData | null => {
    const users = localDB.getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return users[userIndex];
  },

  // Marcar como pago
  markAsPaid: (id: string, pixCode?: string): boolean => {
    const user = localDB.updateUser(id, { 
      isPaid: true, 
      pixCode: pixCode || `PIX${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
    return !!user;
  },

  // Deletar usuário
  deleteUser: (id: string): boolean => {
    const users = localDB.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredUsers));
    return true;
  },

  // Limpar todos os dados
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Exportar para CSV
  exportToCSV: (): string => {
    const users = localDB.getAllUsers();
    const headers = [
      'ID', 'Nome', 'Email', 'Telefone', 'Endereço', 'Cidade', 
      'Estado', 'CEP', 'Código PIX', 'Pago', 'Data Criação', 'Valor Pedido', 'Método Pagamento'
    ];

    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.name}"`,
        user.email,
        `"${user.phone}"`,
        `"${user.address.street}"`,
        user.address.city,
        user.address.state,
        user.address.zipCode,
        user.pixCode || '',
        user.isPaid ? 'SIM' : 'NÃO',
        new Date(user.createdAt).toLocaleString('pt-BR'),
        `R$ ${user.orderValue.toFixed(2)}`,
        user.paymentMethod || ''
      ].join(','))
    ].join('\n');

    return csvContent;
  },

  // Auto-salvar em arquivo quando há novo cadastro
  autoSaveToFile: (newUser: UserData): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Salvar dados individuais em TXT
    const txtContent = `
=== NOVO CADASTRO ===
Data/Hora: ${new Date(newUser.createdAt).toLocaleString('pt-BR')}
ID: ${newUser.id}
Nome: ${newUser.name}
Email: ${newUser.email}
Telefone: ${newUser.phone}
Endereço: ${newUser.address.street}
Cidade: ${newUser.address.city}
Estado: ${newUser.address.state}
CEP: ${newUser.address.zipCode}
Valor do Pedido: R$ ${newUser.orderValue.toFixed(2)}
Código PIX: ${newUser.pixCode || 'Não gerado'}
Status Pagamento: ${newUser.isPaid ? 'PAGO' : 'PENDENTE'}
Método Pagamento: ${newUser.paymentMethod || 'Não definido'}
========================
`;

    localDB.downloadFile(txtContent, `cadastro-${timestamp}.txt`, 'text/plain');
    
    // Auto-backup CSV completo a cada 5 cadastros
    const users = localDB.getAllUsers();
    if (users.length % 5 === 0) {
      const csvContent = localDB.exportToCSV();
      localDB.downloadFile(csvContent, `backup-completo-${timestamp}.csv`, 'text/csv');
    }
  },

  // Download de arquivo
  downloadFile: (content: string, filename: string, mimeType: string): void => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Exportar para TXT (formato legível)
  exportToTXT: (): string => {
    const users = localDB.getAllUsers();
    const stats = localDB.getStats();
    
    let txtContent = `RELATÓRIO COMPLETO - LOJA VIRTUAL
Gerado em: ${new Date().toLocaleString('pt-BR')}

=== ESTATÍSTICAS ===
Total de Cadastros: ${stats.totalUsers}
Pagamentos Realizados: ${stats.paidUsers}
Pagamentos Pendentes: ${stats.unpaidUsers}
Taxa de Conversão: ${stats.conversionRate.toFixed(2)}%
Receita Total: R$ ${stats.totalRevenue.toFixed(2)}

=== CADASTROS ===

`;

    users.forEach((user, index) => {
      txtContent += `${index + 1}. ${user.name}
   ID: ${user.id}
   Email: ${user.email}
   Telefone: ${user.phone}
   Endereço: ${user.address.street}, ${user.address.city}/${user.address.state} - ${user.address.zipCode}
   Valor: R$ ${user.orderValue.toFixed(2)}
   PIX: ${user.pixCode || 'Não gerado'}
   Status: ${user.isPaid ? 'PAGO' : 'PENDENTE'}
   Data: ${new Date(user.createdAt).toLocaleString('pt-BR')}
   
`;
    });

    return txtContent;
  },

  // Estatísticas
  getStats: () => {
    const users = localDB.getAllUsers();
    const totalUsers = users.length;
    const paidUsers = users.filter(u => u.isPaid).length;
    const unpaidUsers = totalUsers - paidUsers;
    const totalRevenue = users.filter(u => u.isPaid).reduce((sum, u) => sum + u.orderValue, 0);
    
    return {
      totalUsers,
      paidUsers,
      unpaidUsers,
      totalRevenue,
      conversionRate: totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0
    };
  }
};