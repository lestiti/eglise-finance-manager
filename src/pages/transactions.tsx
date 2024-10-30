import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";

const TransactionsPage = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Gestion des Transactions</h1>
      
      <div className="grid gap-8">
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  );
};

export default TransactionsPage;