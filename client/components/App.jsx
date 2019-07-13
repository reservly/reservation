import React from 'react';
import axios from 'axios';

import ReservationForm from './ReservationForm.jsx';
import TimesList from './TimesList.jsx';
import { Wrapper, GlobalStyles } from '../theme/theme';

import timeUtils from '../utils/timeUtils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantId: Math.floor(Math.random() * 100),
      restaurant: {
        id: -1,
        openTime: {
          hour: 0,
          minute: 0,
        },
        closeTime: {
          hour: 0,
          minute: 0,
        },
        timeIntervals: 0,
        maxSeating: 0,
        maxPartySize: 0,
      },
      bookingsToday: 0,
      available: [],
    };
  }

  componentDidMount() {
    const { restaurantId } = this.state;

    axios.get(`/${restaurantId}/reservations`)
      .then((response) => {
        const { restaurant_information } = response.data;
        let { bookings } = response.data;

        const restaurant = {
          id: restaurant_information._id,
          openTime: restaurant_information.open_time,
          closeTime: restaurant_information.close_time,
          timeIntervals: restaurant_information.time_intervals,
          maxSeating: restaurant_information.max_seating,
          maxPartySize: restaurant_information.max_party_size,
          maxTimeRange: restaurant_information.max_time_range,
        };

        bookings = bookings.map(booking => ({
          bookingTime: booking.booking_time,
          partyQty: booking.party_qty,
        }));

        this.setState({
          restaurant,
          available: timeUtils.getAvailableFromBookings(restaurant, bookings),
        });
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(`/${restaurantId}/reservations/count`)
      .then((response) => {
        this.setState({
          bookingsToday: response.data.bookings_count,
        });
      });
  }

  render() {
    const { restaurant, available, bookingsToday } = this.state;
    return (
      <div>
        <GlobalStyles />
        <Wrapper>
          <h1>Make a reservation</h1>
          <ReservationForm restaurant={restaurant} />
          <TimesList available={available} />
          <span>{`Booked ${bookingsToday} times today`}</span>
        </Wrapper>
      </div>
    );
  }
}

export default App;
