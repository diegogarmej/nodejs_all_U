import { Patient } from './model'
import { Request, Response } from 'express'
import { PatientService } from './service'
import logger from '../../../utils/logger'
//import { DoctorCreationError, DoctorDeleteError, DoctorGetAllError, DoctorUpdateError, PatientDeleteError, PatientUpdateError, RecordNotFoundError } from '../../../config/customErrors'
import { creationError, deleteError, getAllError, updateError, recordNotFoundError } from '../../../utils/genericErrors'


export interface PatientController {
    getAllPatient(req: Request, res: Response): void
    createPatient(req: Request, res: Response): void  
    getPatientById(req: Request, res: Response): void  
    updatePaciente(req: Request, res: Response): void   
    deletePaciente(req: Request, res: Response): void  
}

export class PatientControllerImpl implements PatientController {
    private  patientService:  PatientService
    
    constructor ( patientService: PatientService ){
        this.patientService = patientService
    }
    public  async getAllPatient(req: Request, res: Response): Promise<void> {
        try {
            const patients = await this.patientService.getAllPatients()
            res.status(200).json(patients)
            
        } catch (error) {
            res.status(400).json({message: "Error getting all patients"})
        }
    }
    public  createPatient (req: Request, res: Response): void {
        const patientReq = req.body
        this.patientService.createPatient(patientReq)
        .then(
            (patient) =>{
                res.status(201).json(patient)
            },
            (error) =>{
                logger.error(error)
                if (error instanceof creationError){
                    res.status(400).json({
                        error_name: error.name,
                        message: "Failed Creating a patient"
                    })
                } else {
                    res.status(400).json({
                        message: "Internal Server Error"
                    })
                }
            }
        )

    }

    public async getPatientById (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            if (isNaN(id)){
                throw new Error("Id must be a number") 
            }
            const patient =  await this.patientService.getPatientById(id)
            if (patient) {
                res.status(200).json(patient)
            } else {
                throw new recordNotFoundError()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof recordNotFoundError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to retrieve patient"})
            }
        }
    }


    public async updatePaciente (req: Request, res: Response): Promise<void> {
        try{ 
            const id = parseInt(req.params.id)
            const patientReq = req.body
            const paciente =  await this.patientService.updatePaciente(id, patientReq)
            if (paciente) {
                res.status(200).json(paciente)
            } else {
                throw new updateError()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof recordNotFoundError){
                res.status(400).json({error: error.message})
            } else  if (error instanceof updateError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to update patient"})
            }
        }
    }

    public async deletePaciente (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            await this.patientService.deletePaciente(id)
            
            res.status(200).json({message: `Patient was deleted successfully`})
        } catch (error) {
            logger.error(error)
            if (error instanceof deleteError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to delete patient"})
            }
        }
    }

}