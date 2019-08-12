module.exports = {
  UTTER_ASK_FLAT: 'utter_ask_flat',
  UTTER_ASK_FLOOR: 'utter_ask_floor',
  UTTER_ASK_POLL_OPTIONS: 'utter_ask_poll_options',
  UTTER_START_POLL_RESPONSE: 'utter_start_poll_response',
  UTTER_SERVICE_REQUEST_RESPONSE: 'utter_service_request_response',
  ACTION_DISPATCH_SERVICE_REQUEST: 'action_dispatch_service_request',

//  #staff-> utter_init_offer_job
//  #enquirer-> utter_init_notify_respondent_found, utter_init_notify_service_completed

//  ##============================================##

// #Service request redirection, searching and feedback situation

  UTTER_INIT_SERVICE_REQUEST_NOTIFICATION: 'utter_init_service_request_notification',
  UTTER_INIT_NOTIFY_RESPONDENT_FOUND: 'utter_init_notify_respondent_found',
  UTTER_INIT_NOTIFY_RESPONDENT_NOT_FOUND: 'utter_init_notify_respondent_not_found',
  UTTER_INIT_NOTIFY_SERVICE_COMPLETED: 'utter_init_notify_service_completed',

  ACTION_RESPONDENT_FOUND: 'action_respondent_found',


//  ##============================================##

// #Basic conversation manner

  UTTER_THANKS: 'utter_thanks',
  UTTER_ALRIGHT: 'utter_alright',
  UTTER_GREAT: 'utter_greet',
  UTTER_GOODBYE: 'utter_goodbye',

//  ##============================================##

  UTTER_NAME: 'utter_name',


// ##============================================##

  UTTER_ROOM_ASK_AFFIRM_SERVICE_REQUEST: 'utter_room_ask_affirm_service_request',

  UTTER_ASK_AFFIRM_SERVICE_REQUEST: 'utter_ask_affirm_service_request',



// ##============================================##

    //rasa default actions

  ACTION_DEFAULT_FALLBACK: 'action_default_fallback',

  UTTER_INVALID_SERVICE: 'utter_invalid_service',

  UTTER_INTERNAL_SERVER_ERROR: 'utter_internal_server_error',

  utterActions: [
    'utter_ask_flat',
    'utter_ask_floor',
    'utter_ask_time',
    'utter_service_request_response',

    'utter_thanks',
    'utter_alright',
    'utter_greet',
    'utter_goodbye',
    'utter_name',
    'utter_room_ask_affirm_service_request',
    'utter_ask_affirm_service_request'
  ],

  reverseCmdUtterActions: [
    'utter_init_service_request_notification',
    'utter_init_notify_respondent_found',
    'utter_init_notify_respondent_not_found',
    'utter_init_notify_service_completed'
  ],


  customActions: [
    'action_dispatch_service_request',
    'service_request_form',
    'action_respondent_found',
    'action_respondent_not_found',
    'action_database_ask_affirmation',
    'action_start_poll',
    'action_log_poll_subject',
    'action_handle_vote'
  ]
}
