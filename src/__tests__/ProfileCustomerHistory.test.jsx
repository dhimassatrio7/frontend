import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/index'; // Pastikan path ini benar
import HistoryOrder from '../components/customer/HistoryOrder';

describe('HistoryOrder Component - Simple Input Tests', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <HistoryOrder />
      </Provider>
    );
  });

  test('allows user to edit profile', () => {
    // Click the Edit button
    fireEvent.click(screen.getByText(/Edit/i));

    // Get input fields
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const contactInput = screen.getByPlaceholderText(/No Telp/i);
    const addressInput = screen.getByPlaceholderText(/Alamat/i);

    // Check if inputs are enabled
    expect(usernameInput).toBeEnabled();
    expect(emailInput).toBeEnabled();
    expect(contactInput).toBeEnabled();
    expect(addressInput).toBeEnabled();

    // Change input values
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(contactInput, { target: { value: '987654321' } });
    fireEvent.change(addressInput, { target: { value: 'New Address' } });

    // Click the Save button
    fireEvent.click(screen.getByText(/Simpan/i));

    // Check if the button is clickable
    expect(screen.getByText(/Edit/i)).toBeEnabled();
  });
});