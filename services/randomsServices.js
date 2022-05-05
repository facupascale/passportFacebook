let { fork } = require('child_process');

class Randoms { 
    async getRandoms(req, res, next) {
        try {
            const { cant } = req.query;
            let url_randoms = process.cwd() + '/utils/js/random.js';
            const forked = fork(url_randoms, [cant ? cant : 10]);

            return forked
        } catch (error) {
            console.log(error);
        }
    }
}
let randomsService = new Randoms()
module.exports = { randomsService }