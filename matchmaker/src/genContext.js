const situations = [
	`-{name1} a forty years old tutor, a philosopher and a dialectician, was the tutor of {name2}.
	-{name2} becomes pregnant and he offers to marry her. He kept the marriage a secret
	-Her uncle hires hoodlums who castrate {name1}
	-Ashamed of himself he forces {name2} to becomes the abbess of a nunnery and became a monk himself.
	-She never thought of him as her husband again.
	- Nearly a decade after their separation {name1} and {name2} wrote to each other.`,
	`-{name1}, frees three lords who have been imprisoned for treason for decades. As a result, he was dispatched to a neighboring country, accompanied by the steward.
	-{name1} is a prince who does not know how to drink from the brook and requests that the steward demonstrate. Following his lead, the prince lies down on his stomach, and the servant threatens to drown him by seizing the prince's leg unless {name1} gives up everything in his favor.
	-The knave rides away with his gold, letter, horse and title.
	-He calls himself Disswar while the false prince sits on the high table., {name1}'s good looks attracts the attention of the royal court: {name2}, the king's only daughter.`
];

const genContext = async (male, female, openai) => {
    // const data = {
    //     inputs: `context: In the 10th century a knight called ${male.username} and a damsel called ${female.username} romantic story`,
    //     parameters: {
    //         max_new_tokens: 250,
    //     },
    // }
    // const response = await fetch(
	// 	"https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
	// 	{
	// 		headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
	// 		method: "POST",
	// 		body: JSON.stringify(data),
	// 	}
	// );
	const prompt = `Write a story with the following context in mind without finishing it:
		${situations[Math.floor(Math.random()*situations.length)]}
		- name1: ${male.username}
		- name2: ${female.username}`
	console.log(prompt);
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt,
		max_tokens: 256,
		temperature: 0.5,
	});
	const result = response.data;
    console.log(result.choices);
	console.log(result)
	return result;
}

export default genContext;
// (async () => {
// genContext({username: 'Perceival'}, {username: 'Guenivere'})
// })();