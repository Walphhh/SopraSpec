import {Router} from 'express';
import {SelectionController} from '../controllers/selection-controller';

const router = Router();
const steps = ['system', 'area', 'type', 'substrate', 'membrane', 'insulation', 'exposure', 'installation'];
const controller = new SelectionController();

router.get('/', (req, res) => {
  res.redirect('/api/selection/system');
});

steps.forEach((step, idx) => {
  router.get(`/${step}`, controller.getStep(step));

  const nextStep = steps[idx + 1] ?? 'result';
  router.post(`/${step}`, controller.postStep(step, nextStep));
});

router.get('/result', controller.getResult);

export default router;