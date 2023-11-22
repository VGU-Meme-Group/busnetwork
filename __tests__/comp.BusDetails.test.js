import { render, fireEvent } from '@testing-library/react';
import BusDetails from '../src/components/BusDetails';

describe('Test BusDetails component', () => {
    const mockHandleEvent = jest.fn();
    const mockDetails = {
        vehicle: {
            label: '123',
            _id: 'abc'
        }
    };

    test('It should render without crashing', () => {
        const { getByText } = render(<BusDetails details={mockDetails} handleEvent={mockHandleEvent} />);
        expect(getByText(/BUS123/i)).toBeInTheDocument();
        expect(getByText(/abc/i)).toBeInTheDocument();
    });

    test('It should call handleEvent when close icon is clicked', () => {
        const { getByTestId } = render(<BusDetails details={mockDetails} handleEvent={mockHandleEvent} />);
        fireEvent.click(getByTestId('bus-top-right'));
        expect(mockHandleEvent).toHaveBeenCalled();
    });
});
