const express = require('express');
const router = express.Router();
const penController = require('../controllers/pen.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/save', auth, penController.savePen);
router.get('/user', auth, penController.getUserPens);
router.get('/public', penController.getPublicPens); // Recent list
router.get('/top-rated', penController.getTopRatedPens); // Best list
router.get('/:id', penController.getPenById); // Public view
router.delete('/:id', auth, penController.deletePen);
router.post('/:id/like', auth, penController.likePen);
router.post('/:id/share', auth, penController.sharePen);

module.exports = router;
