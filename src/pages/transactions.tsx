import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { NavigationBar } from "@/components/layout/NavigationBar";

const TransactionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Gestion des Transactions</h1>
        <div className="grid gap-8">
          <TransactionForm />
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;