import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionTable from '../components/admin/table/TransactionTable';
import { Provider } from 'react-redux';
import { store } from '../store/index'; 
import { MemoryRouter } from "react-router-dom";


describe('TransactionTable', () => {


  test('renders TransactionTable component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan judul ditampilkan
    expect(screen.getByText(/Buat Transaksi Baru/i)).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan input pencarian ada
    expect(screen.getByPlaceholderText(/Cari berdasarkan nama pelanggan/i)).toBeInTheDocument();
  });

  test('opens modal when "Buat Transaksi Baru" button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan modal tidak terlihat pada awalnya
    expect(screen.queryByText(/Kirim/i)).not.toBeInTheDocument();

    // Klik tombol untuk membuka modal
    fireEvent.click(screen.getByText(/Buat Transaksi Baru/i));
  });

  test('closes modal when "Batal" button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    // Klik tombol untuk membuka modal
    fireEvent.click(screen.getByText(/Buat Transaksi Baru/i));

    // Memastikan modal muncul
    expect(screen.getByText(/Kirim/i)).toBeInTheDocument();

    // Klik tombol batal
    fireEvent.click(screen.getByText(/Batal/i));

    // Memastikan modal tidak terlihat lagi
    expect(screen.queryByText(/Kirim/i)).not.toBeInTheDocument();
  });

  test('renders no transaction message when there are no transactions', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan pesan tidak ada data transaksi ditampilkan
    expect(screen.getByText(/Tidak ada data transaksi/i)).toBeInTheDocument();
  });
});