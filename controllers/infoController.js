let { infoService } = require('../services/infoService.js')

class Info {
    async getInfo(req, res, next) {
        try {
            let {status, info} = await infoService.getInfo()

            res.render('info', { info: info })

        } catch (error) {
            console.log(error)
        }

    }

}

let infoController = new Info()

module.exports = { infoController }