const getRnadomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandoms = (cant) => {
    const data = {};
    let tmp = 0

    for (let i = 0; i < cant; i++) {
        tmp = getRnadomIntInclusive(1, 1000);
        let str_tmp = String(tmp)
        data[str_tmp] ? data[str_tmp] = data[str_tmp] + 1 : data[str_tmp] = 1;
    }

    return data
}

process.on('message', msg => {
    console.log(`Mensaje del padre: ${msg}`);

    const response = generateRandoms(process.argv[2]);
    process.send(response);
    process.exit()
})

process.send('ready');