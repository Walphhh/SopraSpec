import {Request,Response} from "express";
import { SessionData, SystemSelection } from '../types/selection-type';
import { DatabaseService } from '../services/database';

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

export class SelectionController{
    getStep(stepName:string){
        return (req: Request, res: Response) => {
            res.render(stepName, { title: `${stepName.charAt(0).toUpperCase() + stepName.slice(1)} Selection` });
        };
    }
    postStep(stepName:string, nextStep:string){
        return (req: Request, res: Response) => {            
            if (!req.session) {
                return res.status(500).json({ error: 'Session not available' });
            }
            (req.session as SessionData)[stepName] = req.body[stepName];
            res.redirect(`/api/selection/${nextStep}`);
        };
    }
    async getResult(req: Request, res: Response){
          const sessionData = req.session as SessionData;
          const systemSelection = buildSystemSelection(sessionData);
        
          if (!systemSelection) {
            return res.redirect('/api/selection/system');
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
    }
}
