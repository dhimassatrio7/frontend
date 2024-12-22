import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/admin/NavbarAdmin'; // Adjust the import based on your file structure

describe('Navbar Component', () => {
  test('renders Navbar with correct title and button', () => {
    // Mock the toggleSidebar function
    const toggleSidebar = vi.fn(); // Use vi.fn() instead of jest.fn()

    // Render the Navbar component
    render(<Navbar toggleSidebar={toggleSidebar} />);

    // Check if the title is rendered
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();

    // Check if the button is rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('calls toggleSidebar when button is clicked', () => {
    // Mock the toggleSidebar function
    const toggleSidebar = vi.fn(); // Use vi.fn() instead of jest.fn()

    // Render the Navbar component
    render(<Navbar toggleSidebar={toggleSidebar} />);

    // Click the button
    fireEvent.click(screen.getByRole('button'));

    // Check if toggleSidebar was called
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });
});