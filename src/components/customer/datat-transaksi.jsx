import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionByDocumentId } from "../../store/slices/transactionSlice";

const DataTransaction = () => {
  const dispatch = useDispatch();

  // Ambil state dari Redux store
  const { transactions } = useSelector((state) => state.transaction);

  // Ambil documentId dari localStorage
  const documentId = localStorage.getItem("documentId");

  // Fetch data transaksi berdasarkan documentId setelah komponen dimount
  useEffect(() => {
    if (documentId) {
      dispatch(fetchTransactionByDocumentId(documentId));
    }
  }, [dispatch, documentId]);

  // Logging untuk debugging
  console.log("Transactions in Component:", transactions);

  return (
    <div>
      <h1>Data Transaction</h1>
    </div>
  );
};

export default DataTransaction;