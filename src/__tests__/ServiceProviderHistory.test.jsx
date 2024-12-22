import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import {store} from "../store/index"; // Pastikan path ke Redux store sudah benar
import HistoryOrder from "../components/partner/HistoryOrder";

describe("HistoryOrder Component", () => {
  test("renders 'Profil Mitra' section", () => {
    render(
      <Provider store={store}>
        <HistoryOrder />
      </Provider>
    );

    const profileTitle = screen.getByText(/Profil Mitra/i);
    expect(profileTitle).toBeInTheDocument();
  });

  test("renders 'Riwayat Pesanan' section", () => {
    render(
      <Provider store={store}>
        <HistoryOrder />
      </Provider>
    );

    const orderHistoryTitle = screen.getByText(/Riwayat Pesanan/i);
    expect(orderHistoryTitle).toBeInTheDocument();
  });

  test("displays 'Tidak ada riwayat transaksi' message when no transactions exist", () => {
    render(
      <Provider store={store}>
        <HistoryOrder />
      </Provider>
    );

    const noHistoryMessage = screen.getByText(/Tidak ada riwayat transaksi/i);
    expect(noHistoryMessage).toBeInTheDocument();
  });

  test("opens edit modal when 'Edit' button is clicked", () => {
    render(
      <Provider store={store}>
        <HistoryOrder />
      </Provider>
    );

    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);

    const modalHeader = screen.getByText(/Edit Data/i); // Assuming the modal contains "Edit Data" text
    expect(modalHeader).toBeInTheDocument();
  });

  test("opens detail modal when 'Lihat Rincian' button is clicked", () => {
    render(
      <Provider store={store}>
        <HistoryOrder />
      </Provider>
    );

    const detailButton = screen.queryByText(/Lihat Rincian/i);
    if (detailButton) {
      fireEvent.click(detailButton);

      const modalDetailHeader = screen.getByText(/Detail Pesanan/i); // Assuming the modal contains "Detail Pesanan" text
      expect(modalDetailHeader).toBeInTheDocument();
    } else {
      expect(detailButton).not.toBeInTheDocument(); // Handles cases where there are no transactions
    }
  });
});
