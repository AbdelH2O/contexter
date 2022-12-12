import client from './redisClient.js';
import supabase from './utilitySupabase.js';

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.webcrypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const matchmake = async () => {
  try {
    await client.connect();
  } catch(err) {
    // console.log(err);
  }
  const { members: maleMembers } = await client.zScan('male', 0);
  const { members: femaleMembers } = await client.zScan('female', 0);

  if(maleMembers.length > 0 && femaleMembers.length > 0) {
    const maleMembers = maleMembers.map((member) => JSON.parse(member));
    const femaleMembers = femaleMembers.map((member) => JSON.parse(member));
    for(let i = 0; i < Math.min(maleMembers.length, femaleMembers.length); i++) {
      const room = uuidv4();
      const { data: chatRoom, error: chatRoomError } = await supabase
        .from('rooms')
        .insert({
          id: room,
          name1: maleMembers[i].username,
          name2: femaleMembers[i].username,
        });
      console.log(chatRoom, chatRoomError);
      await client.zRem('male', maleMembers[i]);
      await client.zRem('female', femaleMembers[i]);
    }
  }
  const trash = await client.scan(0, 'MATCH', 'bull:taskQueue:*');
  trash.keys.forEach(async (key) => {
    const resp = await client.del(key);
  });
}
