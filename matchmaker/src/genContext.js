const genContext = async (male, female) => {
    const data = {
        inputs: `context: In the 10th century a knight called ${male.username} and a damsel called ${female.username} romantic story`,
        parameters: {
            max_new_tokens: 250,
        },
    }
    const response = await fetch(
		"https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
		{
			headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
    console.log(result);
	return result;
}

// export default genContext;
// (async () => {
genContext({username: 'Perceival'}, {username: 'Guenivere'})
// })();