import { q, qNonEmpty } from '../../../util/q';
import { NLU_MESSAGE } from '../../../util/extractDetail'

import logger from '../../../../utils/logger';

export default async (payload) => {
    try {
      const roomId = await NLU_MESSAGE.roomId(payload);
      const originalIntent = NLU_MESSAGE.intent(payload);

      console.log(originalIntent);
      const optionChosen = await NLU_MESSAGE.content(payload);

      if(roomId === null || optionChosen === null) {
        return originalIntent;
      }
      console.log(roomId)

      const pollRows = (await q(`SELECT p.id, p.question_utterance_id FROM poll p 
        INNER JOIN room r ON p.room_id = r.id 
        WHERE r.code = $1 AND p.completed = false ORDER BY p.id DESC`, [roomId])).rows;

      if (pollRows.length === 0){
        return originalIntent;
      }

      const { id: pollId } = pollRows[0];

      const optionsRows = (await q(`SELECT id, alias, option FROM poll_options 
        WHERE poll_id = $1 ORDER BY alias`,
        [pollId])).rows;

      for(let i = 0; i < optionsRows.length; i++){
          const r = optionsRows[i];

          if (r.alias === optionChosen || r.option === optionChosen) {
            logger.info('changed to vote')
            return {
              intent: 'vote',
              confidence: 1
            }
          }


      }

      return originalIntent
  }
  catch(err){
    throw err;
  }
}

/*
Example request:
{
	"text": "0 e 4568 u| 1",
	"intent": {
		"name": "inform",
		"confidence": 0.831528767287172
	},
	"entities": [
		{
			"entity": "epic_id",
			"value": "0",
			"start": 0,
			"end": 1,
			"confidence": null,
			"extractor": "MitieEntityExtractor"

		}, {
			"entity": "utterance_id",
			"value": "4568",
			"start": 4,
			"end": 8,
			"confidence": null,
			"extractor": "MitieEntityExtractor"

		}, {
			"entity": "floor",
			"value": "1",
			"start": 12,
			"end": 13,
			"confidence": null,
			"extractor": "MitieEntityExtractor"

		}
	],
	"context": "is_vote"

}
 */
