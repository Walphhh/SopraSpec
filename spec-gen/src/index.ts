import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import session from 'express-session';
import path from 'path';
import { DatabaseService } from './database';
import { SystemSelection, SessionData } from './types';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to build SystemSelection from session
function buildSystemSelection(session: SessionData): SystemSelection | null {
  if (!session.system || !session.type || !session.substrate ||
      !session.membrane || session.insulation === undefined || !session.exposure ||
      !session.installation) {
    return null;
  }

  return {
    system: session.system as 'bayset' | 'enduroflex' | 'allduro',
    buildType: session.type as 'new_build' | 'refurbishment',
    substrate: session.substrate as 'concrete' | 'timber' | 'metal',
    membraneType: session.membrane as 'bitumen' | 'synthetic',
    insulationRequired: session.insulation === 'yes',
    exposureType: session.exposure as 'exposed' | 'protected' | 'ballasted' | 'green_roof' | 'pod_and_paver',
    installationMethod: session.installation as 'self-adhered' | 'mechanically_fixed' | 'loose_laid' | 'fully_torched'
  };
}

// Root route - redirect to system selection
app.get('/', (req: Request, res: Response) => {
  res.redirect('/system');
});

app.get('/system', (req: Request, res: Response) => {
  res.render('system', { title: 'Select Roofing System' });
});

app.get('/area', (req: Request, res: Response) => {
  res.render('area', { title: 'Project Area' });
});

app.get('/type', (req: Request, res: Response) => {
  res.render('type', { title: 'Project Type' });
});

app.get('/substrate', (req: Request, res: Response) => {
  res.render('substrate', { title: 'Substrate Type' });
});

app.get('/membrane', (req: Request, res: Response) => {
  res.render('membrane', { title: 'Membrane Type' });
});

app.get('/insulation', (req: Request, res: Response) => {
  res.render('insulation', { title: 'Insulation Required' });
});

app.get('/exposure', (req: Request, res: Response) => {
  res.render('exposure', {
    title: 'Exposure Type',
  });
});

app.get('/installation', (req: Request, res: Response) => {
  res.render('installation', { title: 'Installation Method' });
});

app.get('/result', async (req: Request, res: Response) => {
  const sessionData = req.session as SessionData;
  const systemSelection = buildSystemSelection(sessionData);

  if (!systemSelection) {
    return res.redirect('/system');
  }

  try {
    const result = await DatabaseService.findSystemSpecification(systemSelection);

    res.render('result', {
      title: 'System Specification Result',
      choices: sessionData,
      result: result,
      systemSelection: systemSelection
    });
  } catch (error) {
    console.error('Error getting specification:', error);
    res.render('result', {
      title: 'System Specification Result',
      choices: sessionData,
      result: { success: false, error: 'An error occurred while processing your request' },
      systemSelection: systemSelection
    });
  }
});

app.post('/system', (req: Request, res: Response) => {
  const { system } = req.body;
  (req.session as SessionData).system = system;
  res.redirect('/area');
});

app.post('/area', (req: Request, res: Response) => {
  (req.session as SessionData).area = req.body.area;
  res.redirect('/type');
});

app.post('/type', (req: Request, res: Response) => {
  const { type } = req.body;
  (req.session as SessionData).type = type;
  res.redirect('/substrate');
});

app.post('/substrate', (req: Request, res: Response) => {
  const { substrate } = req.body;
  (req.session as SessionData).substrate = substrate;
  res.redirect('/membrane');
});

app.post('/membrane', (req: Request, res: Response) => {
  const { membrane } = req.body;
  (req.session as SessionData).membrane = membrane;
  res.redirect('/insulation');
});

app.post('/insulation', (req: Request, res: Response) => {
  const { insulation } = req.body;
  (req.session as SessionData).insulation = insulation;
  res.redirect('/exposure');
});

app.post('/exposure', (req: Request, res: Response) => {
  (req.session as SessionData).exposure = req.body.exposure;
  res.redirect('/installation');
});

app.post('/installation', (req: Request, res: Response) => {
  (req.session as SessionData).installation = req.body.installation;
  res.redirect('/result');
});

// API endpoint for getting system specification (for AJAX requests)
app.get('/api/specification', async (req: Request, res: Response) => {
  const sessionData = req.session as SessionData;
  const systemSelection = buildSystemSelection(sessionData);

  if (!systemSelection) {
    return res.json({ success: false, error: 'Incomplete selection data' });
  }

  try {
    const result = await DatabaseService.findSystemSpecification(systemSelection);
    res.json(result);
  } catch (error) {
    console.error('API Error:', error);
    res.json({ success: false, error: 'An error occurred while processing your request' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
