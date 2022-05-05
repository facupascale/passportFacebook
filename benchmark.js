import autocannon from 'autocannon';
import { PassTrough } from 'stream'
import logger from './utils/winston/winston_config';

function run(url) {
    const buf = [];
    const outputStream = new PassTrough()

    const inst = autocannon({
        url,
        connection: 100,
        duration: 20,
    })

    autocannon.track(inst, {outputStream})

    outputStream.on('data', (data) => buf.push(data))

    inst.on('done', () => {
        process.stdout.write(Buffer.concat(buf))
    })
}

logger.info('Running all benchmarks ...')

run('http://localhost:8080/api/info')
run('http://localhost:8080/api/info?verbose=1')