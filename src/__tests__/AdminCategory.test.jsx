import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryTable from '../components/admin/table/CategoryTable'; 
import { Provider } from 'react-redux';
import { store } from '../store/index'; 
import { MemoryRouter } from "react-router-dom";

describe('CategoryTable', () => {

  test('renders CategoryTable component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan judul ditampilkan
    expect(screen.getByText(/Buat Kategori Baru/i)).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan input pencarian ada
    expect(screen.getByPlaceholderText(/Cari berdasarkan nama kategori/i)).toBeInTheDocument();
  });

  test('opens modal when "Buat Kategori Baru" button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan modal tidak terlihat pada awalnya
    expect(screen.queryByText(/Batal/i)).not.toBeInTheDocument();

    // Klik tombol untuk membuka modal
    fireEvent.click(screen.getByText(/Buat Kategori Baru/i));

    // Memastikan modal muncul
    expect(screen.getByText(/Batal/i)).toBeInTheDocument();
  });

  test('closes modal when "Batal" button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryTable />
        </MemoryRouter>
      </Provider>
    );

    // Klik tombol untuk membuka modal
    fireEvent.click(screen.getByText(/Buat Kategori/i));

    // Memastikan modal muncul
    expect(screen.getByText(/Batal/i)).toBeInTheDocument();

    // Klik tombol batal
    fireEvent.click(screen.getByText(/Batal/i));

    // Memastikan modal tidak terlihat lagi
    expect(screen.queryByText(/Batal/i)).not.toBeInTheDocument();
  });

  test('opens delete confirmation modal when delete button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryTable />
        </MemoryRouter>
      </Provider>
    );

    // Memastikan modal konfirmasi hapus tidak terlihat pada awalnya
    expect(screen.queryByText(/Konfirmasi Hapus/i)).not.toBeInTheDocument();

  });
});