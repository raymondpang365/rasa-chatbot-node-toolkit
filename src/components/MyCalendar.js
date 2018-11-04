import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// ... and fullcalendar-reactwrapper.
import FullCalendar from 'fullcalendar-reactwrapper';

import '../../node_modules/fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';

class MyCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events:[
        {
          title: 'All Day Event',
          start: '2018-11-01'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-11-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-11-16T16:00:00'
        },
        {
          title: 'Meeting',
          start: '2018-11-08T10:30:00',
          end: '2018-11-08T12:30:00'
        },
        {
          title: 'Birthday Party',
          start: '2018-11-03T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2018-11-28'
        }
      ],
    }
  }

  render() {
    return (
      <div id="example-component">
        <FullCalendar
          id="your-custom-ID"
          header={{
            left: 'prev,next today myCustomButton',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          }}
          defaultView='agendaWeek'
          selectable
          selectHelper
          unselectAuto={false}
          contentHeight={400}
          select={(start, end, jsEvent, view, [ resource ] ) => console.log(`${start}  ${end}`)}
          navLinks // can click day/week names to navigate views
          editable
          eventLimit // allow "more" link when too many events
          events={this.state.events}
        />
      </div>
    );
  }
}

export default MyCalendar

