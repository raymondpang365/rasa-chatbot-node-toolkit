module.exports = {
  UTTER_ASK_FLAT: 'utter_ask_flat',
  UTTER_ASK_FLOOR: 'utter_ask_floor',
  UTTER_SERVICE_REQUEST_RESPONSE: 'utter_service_request_response',
  ACTION_DISPATCH_SERVICE_REQUEST: 'action_dispatch_service_request',

//  #staff-> utter_init_offer_job
//  #enquirer-> utter_init_inform_respondent_found, utter_init_inform_service_completed

//  ##============================================##

// #Service request redirection, searching and feedback situation

  UTTER_INIT_SERVICE_REQUEST_NOTIFICATION: 'utter_init_service_request_notification',
  UTTER_INIT_INFORM_RESPONDENT_FOUND: 'utter_init_inform_respondent_found',
  UTTER_INIT_INFORM_RESPONDENT_NOT_FOUND: 'utter_init_inform_respondent_not_found',
  UTTER_INIT_INFORM_SERVICE_COMPLETED: 'utter_init_inform_service_completed',

  ACTION_RESPONDENT_FOUND: 'action_respondent_found',


//  ##============================================##

// #Basic conversation manner

  UTTER_THANKS: 'utter_thanks',
  UTTER_ALRIGHT: 'utter_alright',
  UTTER_GREAT: 'utter_greet',
  UTTER_GOODBYE: 'utter_goodbye',

//  ##============================================##

  UTTER_NAME: 'utter_name',

    //rasa default actions

  ACTION_DEFAULT_FALLBACK: 'action_default_fallback'
}
