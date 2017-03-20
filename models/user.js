import { Router } from 'express';
import { ObjectID } from 'mongodb';
 
var router = new Router();
 
router.get('/:id', async (req, res, next) => {
    try {
        var db = req.app.locals.db;
        var user = await db.collection('user').findOne({ _id: new ObjectID(req.params.id) }, {
            email: 1,
            firstName: 1,
            lastName: 1
        });
        if (user) {
            user.id = req.params.id;
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
});
 
export default router;