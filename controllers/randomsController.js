let {randomsService} = require('../services/randomsServices')

class Randoms {
    async getRandoms(req, res, next) {
        try {
            let forked = await randomsService.getRandoms(req);
            
            forked.on('message', msg => {
                if(msg === 'ready') {
                    forked.send('Cargando');
                } else {
                    res.render('randoms', {data: msg, cant: req.query.cant || 100000000 })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}
let randomsController = new Randoms()

module.exports = { randomsController }