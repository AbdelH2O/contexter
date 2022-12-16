import client from './redisClient.js';
import supabase from './utilitySupabase.js';
import { randomUUID as uuidv4 } from 'crypto'
import genContext from './genContext.js';

// function uuidv4() {
//   return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
//     (c ^ crypto.webcrypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//   );
// }
// function uuidv4() {
//   var cryptoObj = window.crypto || window.msCrypto; // for IE 11
//   var buffer = new Uint16Array(8);
//   cryptoObj.getRandomValues(buffer);
//   buffer[3] = buffer[3] & 0xfff | 0x4000;
//   buffer[4] = buffer[4] & 0x3fff | 0x8000;
//   return buffer.slice(0, 4).map(num => num.toString(16).padStart(4, '0')).join('-') +
//     buffer.slice(4, 8).map(num => num.toString(16).padStart(4, '0')).join('-');
// }

export const matchmake = async (openai) => {
  try {
    await client.connect();
  } catch(err) {
    // console.log(err);
  }
  const respm = await client.zScan('male', 0);
  const respf = await client.zScan('female', 0);
  console.log({respm, respf});
  const males = respm.members;
  const females = respf.members;

  if(males.length > 0 && females.length > 0) {
    console.log({males, females});
    const maleMembers = males.map((member) =>{
      console.log({member});
      return JSON.parse(member.value)
    });
    const femaleMembers = females.map((member) =>{
      console.log({member});
      return JSON.parse(member.value)
    });
    for(let i = 0; i < Math.min(maleMembers.length, femaleMembers.length); i++) {
      const room = uuidv4();
      const scene = await genContext(maleMembers[i], femaleMembers[i], openai);
      const { data: sceneD, error: sceneError } = await supabase
      .from('scene')
      .insert({
        context: scene.choices[0].text,
        scene: '',
      }).select();
      console.log({sceneD, sceneError});
      const { data: chatRoom, error: chatRoomError } = await supabase
      .from('rooms')
      .insert({
        id: room,
        name1: maleMembers[i].id,
        name2: femaleMembers[i].id,
        scene: sceneD[0].id,
      }).select();
      console.log({chatRoom, chatRoomError});
      // console.log({male: males[i], female: females[i]});
      await client.zRem('male', males[i].value);
      await client.zRem('female', females[i].value);
    }
  }
  const trash = await client.scan(0, 'MATCH', 'bull:taskQueue:*');
  trash.keys.forEach(async (key) => {
    const resp = key !== 'male' && key !== 'female' && await client.del(key);
  });
}
