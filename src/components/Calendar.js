
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import 'moment/min/moment.min.js';

class Calendar extends Component {

  componentDidMount() {
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      drop: () => {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          // if so, remove the element from the "Draggable Events" list
          $(this).remove();
        }
      }
    })
  }

  render() {
    return <div id="calendar" />;
  }

}





export default Calendar;
