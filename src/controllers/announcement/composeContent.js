import axios from 'axios';
import { q } from '../util/q'
import logger from '../../utils/logger';

const moment = require('moment-timezone');

export default async (content, roomCode) => {

  moment.locale("zh-cn");

  if(content.includes('$today_time')){
    const today = moment().tz("Asia/Hong_Kong|Hongkong")
    const date =  today.format("MMM Do")
    const day =  today.format("dddd")

    content = content.replace('$today_time_date', date);
    content = content.replace('$today_time_day', day);

  }
  if(content.includes('$tmr_time')){

    const tmr = moment().tz("Asia/Hong_Kong|Hongkong").add(1,'day')
    const date = tmr.format("MMM Do")
    const day = tmr.format("dddd")

    content = content.replace('$tmr_time_date', date);
    content = content.replace('$tmr_time_day', day);
  }

  if(content.includes('$today_weather') || content.includes('$tmr_weather')) {
    const building_id = (await q(`SELECT building_id FROM building_room br INNER JOIN room r 
      ON br.room_id = r.id WHERE r.code = $1`, [roomCode])).rows[0].building_id
    const estate_id = (await q("SELECT estate_id FROM building WHERE id = $1", [building_id])).rows[0].estate_id;
    const cityWeatherApiId = (await q(`SELECT weather_api_id FROM city c 
      INNER JOIN estate e ON c.id = e.city_id WHERE e.id = $1;`, [estate_id])).rows[0].weather_api_id;

    let todayWeather = null;
    let forecast = null;

    if (content.includes('$today_weather')) {
      todayWeather = (await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?id=${cityWeatherApiId}` +
          `&appid=93311caa458c50c1286d6e14bcf84af7` +
          `&units=metric`
        )
      ).data;
      logger.info(todayWeather)
      const tmrMinTemp = todayWeather.main.temp_min;
      const tmrMaxTemp = todayWeather.main.temp_max;
      const weatherCode = todayWeather.weather[0].id;

      const weatherBrief = (await q("SELECT template FROM weather WHERE weather_api_id = $1", [weatherCode]))
        .rows[0].template;

      content = content.replace('$today_weather_min_temp', tmrMinTemp);
      content = content.replace('$today_weather_max_temp', tmrMaxTemp);
      content = content.replace('$today_weather_brief',  weatherBrief);
    }
    if (content.includes('$tmr_weather')) {
      forecast = (await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast/daily?id=${cityWeatherApiId}` +
          `&appid=93311caa458c50c1286d6e14bcf84af7` +
          `&units=metric`
        )
      ).data.list[0];
      const tmrMinTemp = forecast.temp.min;
      const tmrMaxTemp = forecast.temp.max ;
      const weatherCode = forecast.weather[0].id;

      const weatherBrief = (await q("SELECT template FROM weather WHERE weather_api_id = $1", [weatherCode]))
        .rows[0].template;

      content = content.replace('$tmr_weather_min_temp', tmrMinTemp);
      content = content.replace('$tmr_weather_max_temp', tmrMaxTemp);
      content = content.replace('$tmr_weather_brief',  weatherBrief);
    }
  }

  if(content.includes('$inspiration')){
    const quote = (await q("SELECT body FROM inspiquote " +
      "OFFSET floor(random()*(SELECT count(*) FROM inspiquote)) LIMIT 1;")).rows[0].body;

    content = content.replace('$inspiration', quote);

  }

  return content;
}
