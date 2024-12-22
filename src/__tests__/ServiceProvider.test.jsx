import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import {store} from "../store/index"; // Pastikan ini adalah lokasi file store Redux Anda
import Main from "../components/partner/Main"; // Lokasi file Main yang akan diuji

describe("Main Component", () => {
  test("renders 'Profil Mitra' title", () => {
    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    // Memastikan teks 'Profil Mitra' tampil di halaman
    const profileTitle = screen.getByText(/Profil Mitra/i);
    expect(profileTitle).toBeInTheDocument();
  });

  test("renders 'Daftar Pesanan' title", () => {
    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    // Memastikan teks 'Daftar Pesanan' tampil di halaman
    const orderListTitle = screen.getByText(/Daftar Pesanan/i);
    expect(orderListTitle).toBeInTheDocument();
  });

  test("displays no orders message when no transactions are available", () => {
    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    // Memastikan pesan 'Tidak ada permintaan service' muncul saat tidak ada transaksi
    const noOrdersMessage = screen.getByText(/Tidak ada permintaan service/i);
    expect(noOrdersMessage).toBeInTheDocument();
  });
});
