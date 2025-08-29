import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, Database, Trash2, Eye, CheckCircle, FileText, Save } from "lucide-react";
import { localDB, UserData } from "@/utils/localDatabase";


const ElonInstall = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [showData, setShowData] = useState(false);
  const [testData, setTestData] = useState({
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    street: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const users = localDB.getAllUsers();
    setUsers(users);
  };

  const testDatabase = () => {
    // Usar a função do localDB que já faz auto-save
    const newUser = localDB.saveUser({
      name: testData.name,
      email: testData.email,
      phone: testData.phone,
      address: {
        street: testData.street,
        city: testData.city,
        state: testData.state,
        zipCode: testData.zipCode
      },
      pixCode: `PIX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      isPaid: Math.random() > 0.5,
      orderValue: 299.90,
      paymentMethod: 'pix'
    });

    setUsers(localDB.getAllUsers());
    
    toast({
      title: "Teste Realizado + Auto-Save!",
      description: "Dados salvos no sistema e arquivo TXT baixado automaticamente.",
    });
  };

  const installDatabase = () => {
    localStorage.setItem('lojaVirtualInstalled', 'true');
    toast({
      title: "Banco de Dados Instalado!",
      description: "Sistema de armazenamento interno configurado com sucesso.",
    });
  };


  const clearDatabase = () => {
    localDB.clearAll();
    setUsers([]);
    toast({
      title: "Banco Limpo!",
      description: "Todos os dados foram removidos.",
      variant: "destructive"
    });
  };

  const exportToCSV = () => {
    if (users.length === 0) {
      toast({
        title: "Nenhum dado encontrado",
        description: "Não há dados para exportar.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = localDB.exportToCSV();
    localDB.downloadFile(csvContent, `loja-virtual-dados-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');

    toast({
      title: "Dados Exportados!",
      description: `Arquivo CSV com ${users.length} registros baixado com sucesso.`,
    });
  };

  const exportToTXT = () => {
    if (users.length === 0) {
      toast({
        title: "Nenhum dado encontrado",
        description: "Não há dados para exportar.",
        variant: "destructive"
      });
      return;
    }

    const txtContent = localDB.exportToTXT();
    localDB.downloadFile(txtContent, `relatorio-completo-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');

    toast({
      title: "Relatório TXT Exportado!",
      description: "Arquivo de texto com relatório completo baixado.",
    });
  };

  const importFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (Array.isArray(importedData)) {
          // Limpar dados atuais e importar novos
          localDB.clearAll();
          importedData.forEach(userData => {
            localDB.saveUser(userData);
          });
          setUsers(localDB.getAllUsers());
          
          toast({
            title: "Dados Importados!",
            description: `${importedData.length} registros importados com sucesso.`,
          });
        }
      } catch (error) {
        toast({
          title: "Erro na Importação",
          description: "Arquivo inválido. Use um arquivo JSON válido.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const isInstalled = localStorage.getItem('lojaVirtualInstalled') === 'true';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Elon Install - Gerenciador de Banco</h1>
          <p className="text-muted-foreground">
            Sistema de instalação e gerenciamento do banco de dados interno
          </p>
        </div>

        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={isInstalled ? "default" : "secondary"}>
                {isInstalled ? "Instalado" : "Não Instalado"}
              </Badge>
              {isInstalled && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-sm text-muted-foreground">
              Total de registros salvos: <strong>{users.length}</strong>
            </p>
          </CardContent>
        </Card>

        {/* Instalação */}
        <Card>
          <CardHeader>
            <CardTitle>1. Instalação do Banco</CardTitle>
            <CardDescription>
              Configure o sistema de armazenamento interno (localStorage)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={installDatabase} className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Instalar Banco de Dados
            </Button>
          </CardContent>
        </Card>

        {/* Teste */}
        <Card>
          <CardHeader>
            <CardTitle>2. Teste do Banco</CardTitle>
            <CardDescription>
              Insira dados de teste para verificar o funcionamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={testData.name}
                  onChange={(e) => setTestData({...testData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={testData.email}
                  onChange={(e) => setTestData({...testData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={testData.phone}
                  onChange={(e) => setTestData({...testData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={testData.zipCode}
                  onChange={(e) => setTestData({...testData, zipCode: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="street">Endereço</Label>
              <Input
                id="street"
                value={testData.street}
                onChange={(e) => setTestData({...testData, street: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={testData.city}
                  onChange={(e) => setTestData({...testData, city: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={testData.state}
                  onChange={(e) => setTestData({...testData, state: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={testDatabase} className="w-full">
              Testar Banco de Dados
            </Button>
          </CardContent>
        </Card>

        {/* Gerenciamento de Dados */}
        <Card>
          <CardHeader>
            <CardTitle>3. Gerenciamento de Dados</CardTitle>
            <CardDescription>
              Visualize, exporte e gerencie os dados armazenados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setShowData(!showData)} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {showData ? "Ocultar" : "Visualizar"} Dados
              </Button>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button onClick={exportToTXT} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Exportar TXT
              </Button>
              <Label htmlFor="importFile" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar JSON
                  </span>
                </Button>
                <Input
                  id="importFile"
                  type="file"
                  accept=".json"
                  onChange={importFromFile}
                  className="hidden"
                />
              </Label>
              <Button onClick={clearDatabase} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Banco
              </Button>
            </div>

            {showData && users.length > 0 && (
              <div className="mt-4">
                <Separator className="mb-4" />
                <h4 className="font-semibold mb-2">Dados Armazenados:</h4>
                <div className="max-h-96 overflow-y-auto">
                  <Textarea
                    value={JSON.stringify(users, null, 2)}
                    readOnly
                    className="font-mono text-xs"
                    rows={15}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Os dados são salvos no localStorage do navegador</p>
            <p>• Use a exportação CSV para backup regular dos dados</p>
            <p>• O sistema pode armazenar: dados do usuário, endereço, código PIX, status de pagamento</p>
            <p>• Para migração futura: exporte os dados e importe no banco definitivo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ElonInstall;