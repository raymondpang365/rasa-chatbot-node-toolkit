import axios from 'axios';
import { isSplitNlpServer, nluCorePort } from '../../../../config'

export default async formData => {
  if(isSplitNlpServer) {
    const nluResponse = await axios.post(
      'http://localhost:5000/parse',
      {
        q: formData.message,
        project: "shiba",
        model: "nlu"
      }
    ).then(res => res.data).catch(err => {
      throw err
    });

    console.log(nluResponse)

    let entitiesStringArray = nluResponse.entities.map( e => `"${e.entity}":"${e.value}"`);
    let entitiesString = entitiesStringArray.join(',');

    const intentString = nluResponse.intent.name;

    const nlgInputString = `/${intentString}{${entitiesString}}`

    console.log(nlgInputString)

    return await axios.post(
      `http://localhost:${nluCorePort}/webhooks/rest/webhook`,
      {
        message: nlgInputString,
        sender: formData.sender
      }
    ).then(res => res).catch(err => {
      throw err
    });

  }
  else {
    return await axios.post(
      `http://localhost:${nluCorePort}/webhooks/rest/webhook`,
      formData
    ).then(res => res).catch(err => {
      throw err
    });
  }

}
